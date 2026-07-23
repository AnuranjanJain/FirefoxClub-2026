"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import {
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector2,
} from "three";

export type ApprovedSceneVariant = "hero" | "split" | "footer" | "shards" | "team";

type ApprovedSceneProps = {
  className?: string;
  variant: ApprovedSceneVariant;
  sectionIndex?: number;
  fallback: string;
  interactive?: boolean;
};

const sceneConfig: Record<
  ApprovedSceneVariant,
  {
    path: string;
    camera: [number, number, number];
    fov: number;
    scale: number;
    position: [number, number, number];
    rotation: [number, number, number];
  }
> = {
  hero: {
    path: "/models/hero-crystal-fox.glb",
    camera: [0, 0.15, 7.2],
    fov: 39,
    scale: 0.92,
    position: [0, 0.35, 0],
    rotation: [0, 0, 0],
  },
  split: {
    path: "/models/split-firefox.glb",
    camera: [0, 0.05, 6.1],
    fov: 38,
    scale: 1.03,
    position: [0.95, -0.05, 0],
    rotation: [0, 0, 0],
  },
  footer: {
    path: "/models/footer-horizon.glb",
    camera: [0, 0.2, 7.3],
    fov: 43,
    scale: 0.98,
    position: [0, -0.25, 0],
    rotation: [0, 0, 0],
  },
  shards: {
    path: "/models/shard-stream.glb",
    camera: [0, 0.15, 7.4],
    fov: 42,
    scale: 0.94,
    position: [0.45, 0, 0],
    rotation: [0, 0, -0.05],
  },
  team: {
    path: "/models/shard-stream.glb",
    camera: [0, 0.4, 8.4],
    fov: 45,
    scale: 0.72,
    position: [0, -2.25, -0.8],
    rotation: [0.1, 0, -0.04],
  },
};

function cloneWithMaterials(scene: Object3D) {
  const clone = scene.clone(true);
  clone.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.castShadow = false;
    child.receiveShadow = false;
    if (child.material instanceof MeshStandardMaterial) {
      child.material = child.material.clone();
      child.material.toneMapped = false;
    }
  });
  return clone;
}

function ApprovedModel({
  variant,
  sectionIndex,
  interactive,
}: {
  variant: ApprovedSceneVariant;
  sectionIndex: number;
  interactive: boolean;
}) {
  const config = sceneConfig[variant];
  const root = useRef<Group>(null);
  const pointer = useRef(new Vector2());
  const [hovered, setHovered] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());
  const { scene } = useGLTF(config.path);
  const model = useMemo(() => cloneWithMaterials(scene), [scene]);

  useEffect(() => {
    document.body.style.cursor = interactive && hovered ? "grab" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, interactive]);

  useFrame((state, delta) => {
    const group = root.current;
    if (!group) return;

    const viewport = typeof window === "undefined" ? 1 : window.innerHeight;
    const page = typeof window === "undefined" ? 0 : window.scrollY / viewport;
    const local = MathUtils.clamp(page - sectionIndex, 0, 1);
    const time = state.clock.elapsedTime;

    const pointerWeight = variant === "footer" ? 0.04 : variant === "shards" ? 0.08 : 0.14;
    const targetY = config.rotation[1] + pointer.current.x * pointerWeight + local * 0.24;
    const targetX =
      config.rotation[0] - pointer.current.y * pointerWeight * 0.65 + local * 0.06;

    if (!reducedMotion) {
      group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 3.5, delta);
      group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 3.5, delta);
      group.rotation.z = MathUtils.damp(
        group.rotation.z,
        config.rotation[2] + Math.sin(time * 0.35) * 0.012,
        3,
        delta,
      );
      group.position.y = config.position[1] + Math.sin(time * 0.52) * 0.045 - local * 0.13;
    }

    const hoverScale = variant === "split" && hovered ? config.scale * 1.045 : config.scale;
    const nextScale = MathUtils.damp(group.scale.x, hoverScale, 4, delta);
    group.scale.setScalar(nextScale);

    if (variant === "split") {
      model.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        if (child.name.startsWith("Normal")) {
          child.position.z = MathUtils.damp(child.position.z, hovered ? 0.18 : 0, 4, delta);
        }
        if (child.name.startsWith("Nightly")) {
          child.position.z = MathUtils.damp(child.position.z, hovered ? -0.12 : 0, 4, delta);
        }
      });
    }
  });

  return (
    <group
      ref={root}
      scale={config.scale}
      position={config.position}
      rotation={config.rotation}
      onPointerMove={(event) => {
        if (!interactive) return;
        pointer.current.set(event.pointer.x, event.pointer.y);
      }}
      onPointerEnter={() => interactive && setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        pointer.current.set(0, 0);
      }}
    >
      <Float
        speed={reducedMotion ? 0 : variant === "shards" ? 0.35 : 0.7}
        rotationIntensity={variant === "shards" ? 0.015 : 0.025}
        floatIntensity={variant === "footer" ? 0.02 : 0.05}
      >
        <primitive object={model} />
      </Float>
    </group>
  );
}

function GroundGrid() {
  return (
    <group position={[0, -2.25, -0.4]} rotation={[0.12, 0, 0]}>
      <gridHelper args={[18, 34, "#6d28d9", "#20103b"]} />
      <mesh position={[0, -0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial color="#03020a" transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

export default function ApprovedScene({
  className = "",
  variant,
  sectionIndex = 0,
  fallback,
  interactive = true,
}: ApprovedSceneProps) {
  const [webgl, setWebgl] = useState(true);
  const config = sceneConfig[variant];

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const supported = Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
    const frame = requestAnimationFrame(() => setWebgl(supported));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!webgl) {
    return (
      <div className={className}>
        <Image src={fallback} alt="" fill priority className="object-cover" />
      </div>
    );
  }

  return (
    <div className={className} aria-label={`Interactive ${variant} Firefox 3D scene`}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: config.camera, fov: config.fov }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#020108", 0);
        }}
      >
        <ambientLight intensity={0.38} />
        <directionalLight position={[5, 6, 7]} intensity={3.8} color="#ff7139" />
        <pointLight position={[-4, 2, 4]} intensity={58} distance={12} color="#6d28d9" />
        <pointLight position={[4, -1, 3]} intensity={46} distance={11} color="#ff2a68" />
        <pointLight position={[0, 4, -2]} intensity={32} distance={10} color="#b56cff" />
        {variant === "hero" && <GroundGrid />}
        <Stars
          radius={18}
          depth={8}
          count={variant === "shards" ? 350 : 650}
          factor={2.2}
          saturation={0.7}
          fade
          speed={0.18}
        />
        <Suspense fallback={null}>
          <ApprovedModel
            variant={variant}
            sectionIndex={sectionIndex}
            interactive={interactive}
          />
        </Suspense>
        <Sparkles
          count={variant === "shards" ? 110 : 72}
          scale={[10, 6, 5]}
          size={1.5}
          speed={0.18}
          opacity={0.52}
          color={variant === "footer" ? "#ff7139" : "#a56dff"}
        />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.4}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.22}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/hero-crystal-fox.glb");
useGLTF.preload("/models/split-firefox.glb");
useGLTF.preload("/models/footer-horizon.glb");
useGLTF.preload("/models/shard-stream.glb");
