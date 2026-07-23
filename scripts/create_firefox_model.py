import math
import os

import bpy
from mathutils import Vector


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT = os.path.join(ROOT, "public", "models", "firefox-nightly.glb")


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)


def material(name, color, metallic, roughness, emission=None, emission_strength=0.0):
    value = bpy.data.materials.new(name)
    value.diffuse_color = (*color, 1.0)
    value.use_nodes = True
    bsdf = value.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        emission_input = bsdf.inputs.get("Emission Color") or bsdf.inputs.get("Emission")
        if emission_input:
            emission_input.default_value = (*emission, 1.0)
        strength_input = bsdf.inputs.get("Emission Strength")
        if strength_input:
            strength_input.default_value = emission_strength
    return value


def smooth_object(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True


def add_uv_sphere(name, location, scale, mat, segments=64, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=rings,
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    smooth_object(obj)
    return obj


def add_cone(name, location, scale, rotation, mat):
    bpy.ops.mesh.primitive_cone_add(
        vertices=48,
        radius1=1.0,
        radius2=0.04,
        depth=2.0,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    smooth_object(obj)
    return obj


def add_curve(name, points, bevel_depth, mat):
    curve_data = bpy.data.curves.new(name=f"{name}Curve", type="CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 8
    curve_data.bevel_depth = bevel_depth
    curve_data.bevel_resolution = 6
    curve_data.resolution_u = 10
    spline = curve_data.splines.new("NURBS")
    spline.points.add(len(points) - 1)
    for index, point in enumerate(points):
        spline.points[index].co = (*point, 1.0)
    spline.order_u = min(4, len(points))
    spline.use_endpoint_u = True

    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def add_orbit_particle(name, location, radius, mat):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=radius, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    smooth_object(obj)
    return obj


def build_model():
    clear_scene()

    nightly = material(
        "NightlyPurple",
        (0.25, 0.05, 0.72),
        metallic=0.45,
        roughness=0.18,
        emission=(0.32, 0.06, 0.95),
        emission_strength=0.22,
    )
    firefox = material(
        "FirefoxOrange",
        (1.0, 0.14, 0.015),
        metallic=0.35,
        roughness=0.2,
        emission=(1.0, 0.06, 0.01),
        emission_strength=0.32,
    )
    coral = material(
        "FirefoxCoral",
        (0.94, 0.02, 0.19),
        metallic=0.28,
        roughness=0.24,
        emission=(0.8, 0.01, 0.1),
        emission_strength=0.18,
    )
    core = material(
        "OpenWebCore",
        (0.008, 0.01, 0.028),
        metallic=0.82,
        roughness=0.22,
        emission=(0.03, 0.01, 0.12),
        emission_strength=0.18,
    )
    glow = material(
        "OrbitGlow",
        (0.55, 0.12, 1.0),
        metallic=0.25,
        roughness=0.12,
        emission=(0.42, 0.04, 1.0),
        emission_strength=1.1,
    )

    core_obj = add_uv_sphere("OpenWebCore", (0.0, 0.0, 0.0), (1.34, 1.34, 1.34), core)
    bevel = core_obj.modifiers.new(name="CoreBevel", type="BEVEL")
    bevel.width = 0.025
    bevel.segments = 2

    primary_points = []
    secondary_points = []
    for index in range(116):
        t = -0.75 + (index / 115) * math.tau * 1.05
        radius = 1.72 + 0.17 * math.sin(t * 1.4)
        primary_points.append(
            (
                radius * math.cos(t),
                0.32 * math.sin(t * 1.7),
                radius * 0.78 * math.sin(t),
            )
        )

        t2 = 0.05 + (index / 115) * math.tau * 0.96
        radius2 = 1.83 + 0.12 * math.cos(t2 * 1.8)
        secondary_points.append(
            (
                radius2 * math.cos(t2),
                -0.38 + 0.25 * math.sin(t2 * 1.25),
                radius2 * 0.74 * math.sin(t2),
            )
        )

    add_curve("NightlyRibbon", primary_points, 0.19, nightly)
    add_curve("FirefoxRibbon", secondary_points, 0.125, firefox)

    head = add_uv_sphere("FoxHead", (-1.43, -0.18, 0.36), (0.58, 0.43, 0.52), nightly, 48, 24)
    head.rotation_euler = (0.1, -0.25, -0.2)
    snout = add_uv_sphere("FoxSnout", (-1.82, -0.24, 0.24), (0.42, 0.28, 0.23), coral, 48, 24)
    snout.rotation_euler = (0.0, -0.18, -0.1)
    add_cone(
        "FoxEarLeft",
        (-1.65, -0.18, 0.89),
        (0.24, 0.17, 0.42),
        (0.0, -0.08, -0.2),
        nightly,
    )
    add_cone(
        "FoxEarRight",
        (-1.2, -0.1, 0.86),
        (0.22, 0.15, 0.38),
        (0.0, 0.12, 0.18),
        firefox,
    )
    add_orbit_particle("FoxEye", (-1.75, -0.55, 0.48), 0.065, glow)

    orbit_points = []
    for index in range(96):
        t = (index / 95) * math.tau
        point = Vector((2.32 * math.cos(t), 0.65 * math.sin(t), 1.18 * math.sin(t)))
        orbit_points.append(tuple(point))
    add_curve("OuterOrbit", orbit_points, 0.022, glow)

    particle_positions = [
        (2.25, 0.05, 0.62),
        (-2.12, 0.34, -0.72),
        (0.62, -0.72, 1.65),
        (-0.48, 0.58, -1.82),
        (1.62, 0.55, -1.02),
    ]
    for index, position in enumerate(particle_positions, start=1):
        add_orbit_particle(f"OrbitParticle{index}", position, 0.075 + index * 0.008, glow)

    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0.0, 0.0, 0.0))
    root = bpy.context.object
    root.name = "FirefoxNightlyRoot"
    for obj in list(bpy.context.scene.objects):
        if obj != root and obj.parent is None:
            obj.parent = root

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=OUTPUT,
        export_format="GLB",
        export_apply=True,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_materials="EXPORT",
    )
    print(f"Exported {OUTPUT}")


if __name__ == "__main__":
    build_model()
