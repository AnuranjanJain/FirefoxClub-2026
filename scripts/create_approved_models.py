import math
import os
import random

import bpy
from mathutils import Vector


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_DIR = os.path.join(ROOT, "public", "models")


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


def make_material(name, color, metallic=0.55, roughness=0.16, emission=0.35):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    emission_color = bsdf.inputs.get("Emission Color") or bsdf.inputs.get("Emission")
    if emission_color:
        emission_color.default_value = (*color, 1.0)
    emission_strength = bsdf.inputs.get("Emission Strength")
    if emission_strength:
        emission_strength.default_value = emission
    return mat


def smooth(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True


def add_ico(name, location, scale, mat, subdivisions=2):
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=subdivisions,
        radius=1.0,
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    smooth(obj)
    return obj


def add_uv(name, location, scale, mat, segments=64, rings=32):
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
    smooth(obj)
    return obj


def add_shard(name, location, scale, rotation, mat):
    bpy.ops.mesh.primitive_cone_add(
        vertices=4,
        radius1=1.0,
        radius2=0.08,
        depth=2.0,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    return obj


def add_curve(name, points, bevel, mat, cyclic=False):
    data = bpy.data.curves.new(name=f"{name}Curve", type="CURVE")
    data.dimensions = "3D"
    data.resolution_u = 4
    data.bevel_depth = bevel
    data.bevel_resolution = 4
    spline = data.splines.new("NURBS")
    spline.points.add(len(points) - 1)
    for index, point in enumerate(points):
        spline.points[index].co = (*point, 1.0)
    spline.order_u = min(4, len(points))
    spline.use_endpoint_u = not cyclic
    spline.use_cyclic_u = cyclic
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def add_arc_shards(
    prefix,
    radius,
    start,
    end,
    count,
    y,
    mat,
    width=0.18,
    depth=0.12,
    length=0.42,
    wobble=0.08,
):
    for index in range(count):
        t = start + (end - start) * (index / max(1, count - 1))
        r = radius + math.sin(t * 3.1) * wobble
        x = math.cos(t) * r
        z = math.sin(t) * r
        rotation = (0.0, -t - math.pi / 2, 0.0)
        shard = add_shard(
            f"{prefix}{index:03d}",
            (x, y + math.sin(t * 2.0) * 0.08, z),
            (
                width * (0.78 + (index % 5) * 0.07),
                depth,
                length * (0.8 + (index % 7) * 0.055),
            ),
            rotation,
            mat,
        )
        shard.rotation_euler.rotate_axis("Z", math.sin(t * 1.7) * 0.2)


def add_orbit(name, rx, rz, y, mat, phase=0.0, bevel=0.015):
    points = []
    for index in range(96):
        t = phase + math.tau * index / 95
        points.append((rx * math.cos(t), y + 0.2 * math.sin(t * 2), rz * math.sin(t)))
    return add_curve(name, points, bevel, mat, cyclic=True)


def add_particles(prefix, count, bounds, materials, seed):
    random.seed(seed)
    for index in range(count):
        x = random.uniform(bounds[0], bounds[1])
        y = random.uniform(bounds[2], bounds[3])
        z = random.uniform(bounds[4], bounds[5])
        scale = random.uniform(0.025, 0.09)
        add_ico(
            f"{prefix}{index:03d}",
            (x, y, z),
            (scale, scale, scale),
            materials[index % len(materials)],
            subdivisions=1,
        )


def add_fox_head(nightly, orange, glow):
    head = add_ico("FoxHead", (-1.28, -0.18, 0.54), (0.58, 0.4, 0.5), nightly, 3)
    head.rotation_euler = (0.06, -0.26, -0.15)
    snout = add_ico("FoxSnout", (-1.7, -0.27, 0.37), (0.46, 0.27, 0.22), nightly, 2)
    snout.rotation_euler = (0.0, -0.2, -0.15)
    add_shard(
        "FoxEarFront",
        (-1.52, -0.12, 1.02),
        (0.25, 0.18, 0.48),
        (0.0, -0.16, -0.2),
        nightly,
    )
    add_shard(
        "FoxEarBack",
        (-1.05, -0.08, 0.98),
        (0.21, 0.15, 0.4),
        (0.0, 0.12, 0.18),
        orange,
    )
    add_ico("FoxEye", (-1.63, -0.57, 0.58), (0.07, 0.045, 0.07), glow, 2)


def material_set():
    return {
        "nightly": make_material("NightlyCrystal", (0.24, 0.035, 0.82), 0.68, 0.08, 0.7),
        "violet": make_material("VioletGlass", (0.56, 0.12, 1.0), 0.62, 0.1, 0.8),
        "orange": make_material("FirefoxOrange", (1.0, 0.16, 0.015), 0.56, 0.12, 0.75),
        "coral": make_material("FirefoxCoral", (1.0, 0.025, 0.18), 0.5, 0.14, 0.65),
        "dark": make_material("GlobeCore", (0.008, 0.005, 0.035), 0.82, 0.18, 0.08),
        "glow": make_material("ElectricGlow", (0.66, 0.22, 1.0), 0.28, 0.08, 1.8),
        "grid": make_material("GridGlow", (0.19, 0.035, 0.42), 0.24, 0.2, 0.9),
    }


def root_scene(name):
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    root = bpy.context.object
    root.name = name
    for obj in list(bpy.context.scene.objects):
        if obj != root and obj.parent is None:
            obj.parent = root
    return root


def export(filename):
    os.makedirs(MODEL_DIR, exist_ok=True)
    path = os.path.join(MODEL_DIR, filename)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_apply=True,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_materials="EXPORT",
    )
    print(f"Exported {path}")


def build_hero():
    clear_scene()
    mats = material_set()
    add_uv("NetworkGlobe", (0, 0.18, 0), (1.42, 1.42, 1.42), mats["dark"])
    for latitude in (-0.95, -0.48, 0.0, 0.48, 0.95):
        radius = math.sqrt(max(0.2, 1.42 * 1.42 - latitude * latitude))
        points = [
            (radius * math.cos(t), 0.07, latitude + 0.025 * math.sin(t * 3))
            for t in [math.tau * i / 63 for i in range(64)]
        ]
        add_curve(f"GlobeLatitude{latitude}", points, 0.008, mats["glow"], cyclic=True)
    for longitude in range(0, 180, 30):
        angle = math.radians(longitude)
        points = []
        for index in range(64):
            t = math.tau * index / 63
            x = 1.42 * math.cos(t) * math.cos(angle)
            y = 0.18 + 1.42 * math.cos(t) * math.sin(angle) * 0.22
            z = 1.42 * math.sin(t)
            points.append((x, y, z))
        add_curve(f"GlobeLongitude{longitude}", points, 0.006, mats["violet"], cyclic=True)

    add_arc_shards("NightlyBody", 1.86, 0.72, 5.35, 78, -0.12, mats["nightly"], 0.19, 0.12, 0.44)
    add_arc_shards("NightlyHighlight", 1.68, 1.1, 4.9, 46, -0.3, mats["violet"], 0.09, 0.07, 0.32)
    add_arc_shards("OrangeTail", 1.92, -1.45, 1.24, 58, -0.15, mats["orange"], 0.17, 0.1, 0.46)
    add_arc_shards("CoralTail", 1.68, -1.2, 0.7, 35, -0.33, mats["coral"], 0.1, 0.07, 0.34)
    add_fox_head(mats["nightly"], mats["orange"], mats["glow"])
    add_orbit("WideOrbit", 3.4, 1.65, 0.4, mats["glow"], 0.3)
    add_orbit("TightOrbit", 2.75, 1.35, 0.15, mats["orange"], -0.2, 0.01)
    add_particles("OrbitLight", 46, (-3.8, 3.8, -0.7, 0.8, -2.2, 2.2), [mats["glow"], mats["orange"]], 42)
    root_scene("HeroCrystalFox")
    export("hero-crystal-fox.glb")


def build_split():
    clear_scene()
    mats = material_set()
    add_uv("SplitCore", (0, 0.15, 0), (1.35, 1.35, 1.35), mats["dark"])
    add_arc_shards("NormalHalf", 1.78, 1.5, 4.82, 64, -0.12, mats["orange"], 0.19, 0.11, 0.46)
    add_arc_shards("NormalCoral", 1.57, 2.0, 4.9, 42, -0.3, mats["coral"], 0.11, 0.07, 0.34)
    add_arc_shards("NightlyHalf", 1.78, -1.63, 1.65, 64, -0.12, mats["nightly"], 0.19, 0.11, 0.46)
    add_arc_shards("NightlyHighlight", 1.57, -1.6, 1.1, 42, -0.3, mats["violet"], 0.11, 0.07, 0.34)
    add_shard("NormalEar", (-0.72, -0.15, 1.5), (0.29, 0.2, 0.56), (0, -0.08, -0.28), mats["orange"])
    add_shard("NightlyEar", (0.72, -0.15, 1.5), (0.29, 0.2, 0.56), (0, 0.08, 0.28), mats["nightly"])
    points = [(0, -0.62, z) for z in [(-1.45 + i * 2.9 / 31) for i in range(32)]]
    add_curve("ModeDivider", points, 0.012, mats["glow"])
    add_particles("ModeLight", 30, (-2.7, 2.7, -0.5, 0.5, -2.1, 2.1), [mats["orange"], mats["glow"]], 18)
    root_scene("SplitFirefox")
    export("split-firefox.glb")


def build_footer():
    clear_scene()
    mats = material_set()
    add_uv("HorizonPlanet", (0, 0.5, -4.4), (5.2, 5.2, 5.2), mats["dark"])
    points = []
    for index in range(96):
        x = -5.2 + index * 10.4 / 95
        z = -4.4 + math.sqrt(max(0, 5.2 * 5.2 - x * x))
        points.append((x, -0.1, z))
    add_curve("HorizonRim", points, 0.035, mats["orange"])
    add_curve("HorizonViolet", [(x, 0.06, z + 0.06) for x, _, z in points], 0.018, mats["glow"])
    add_shard("HorizonEarLeft", (-0.55, -0.05, 1.08), (0.34, 0.2, 0.72), (0, -0.12, -0.15), mats["orange"])
    add_shard("HorizonEarRight", (0.42, -0.05, 1.02), (0.31, 0.18, 0.65), (0, 0.12, 0.16), mats["nightly"])
    add_arc_shards("HorizonFox", 1.15, 0.2, 2.9, 22, -0.08, mats["orange"], 0.12, 0.08, 0.34)
    add_particles("HorizonLight", 45, (-5.0, 5.0, -0.5, 0.5, -1.5, 2.8), [mats["glow"], mats["orange"]], 23)
    root_scene("FooterHorizon")
    export("footer-horizon.glb")


def build_shards():
    clear_scene()
    mats = material_set()
    random.seed(77)
    for index in range(180):
        progress = index / 179
        x = -4.6 + progress * 9.2 + random.uniform(-0.75, 0.75)
        z = -2.8 + progress * 5.7 + random.uniform(-1.05, 1.05)
        y = random.uniform(-1.2, 1.2)
        size = random.uniform(0.045, 0.24) * (1.4 - abs(progress - 0.5))
        mat = mats["orange"] if index % 9 == 0 else mats["violet"] if index % 3 else mats["nightly"]
        add_shard(
            f"StreamShard{index:03d}",
            (x, y, z),
            (size, size * 0.72, size * random.uniform(1.6, 3.8)),
            (
                random.uniform(-1.1, 1.1),
                random.uniform(-1.1, 1.1),
                random.uniform(-1.1, 1.1),
            ),
            mat,
        )
    for line in range(18):
        points = []
        offset = -1.0 + line * 0.12
        for index in range(42):
            progress = index / 41
            x = -5.0 + progress * 10.0
            z = -3.1 + progress * 6.2 + math.sin(progress * math.tau * 2 + line) * 0.2
            points.append((x, offset, z))
        add_curve(f"EnergyLine{line:02d}", points, 0.008 + (line % 3) * 0.003, mats["glow"] if line % 4 else mats["orange"])
    root_scene("ShardStream")
    export("shard-stream.glb")


if __name__ == "__main__":
    build_hero()
    build_split()
    build_footer()
    build_shards()
