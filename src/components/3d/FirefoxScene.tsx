"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import {
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Vector2,
} from "three";

type FirefoxSceneProps = {
  className?: string;
  interactive?: boolean;
  variant?: "hero" | "about" | "footer";
};

const nightlyPurple = new Color("#6d28d9");
const nightlyViolet = new Color("#a855f7");
const firefoxOrange = new Color("#ff7139");
const firefoxCoral = new Color("#ff2a68");

function FirefoxModel({
  interactive,
  variant,
  reducedMotion,
}: {
  interactive: boolean;
  variant: NonNullable<FirefoxSceneProps["variant"]>;
  reducedMotion: boolean;
}) {
  const root = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const pointer = useRef(new Vector2());
  const { scene } = useGLTF("/models/firefox-nightly.glb");

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      child.castShadow = false;
      child.receiveShadow = false;
      if (child.material instanceof MeshStandardMaterial) {
        child.material = child.material.clone();
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    document.body.style.cursor = hovered && interactive ? "grab" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, interactive]);

  useFrame((state, delta) => {
    const group = root.current;
    if (!group) return;

    const time = state.clock.elapsedTime;
    const scroll = typeof window === "undefined" ? 0 : window.scrollY;
    const targetRotation = variant === "footer" ? -0.4 : scroll * 0.00048;

    if (!reducedMotion) {
      group.rotation.y = MathUtils.damp(
        group.rotation.y,
        targetRotation + pointer.current.x * 0.22,
        3.2,
        delta,
      );
      group.rotation.x = MathUtils.damp(
        group.rotation.x,
        pointer.current.y * 0.14 + Math.sin(time * 0.45) * 0.035,
        3.2,
        delta,
      );
      group.position.y = Math.sin(time * 0.55) * 0.06;
    }

    const normalMode = variant === "about" && hovered;
    model.traverse((child) => {
      if (!(child instanceof Mesh) || !(child.material instanceof MeshStandardMaterial)) return;
      const mat = child.material;
      if (mat.name === "NightlyPurple") {
        mat.color.lerp(normalMode ? firefoxOrange : nightlyPurple, 0.07);
        mat.emissive.lerp(normalMode ? firefoxCoral : nightlyViolet, 0.07);
      }
      if (mat.name === "FirefoxOrange" || mat.name === "FirefoxCoral") {
        mat.color.lerp(normalMode ? firefoxCoral : firefoxOrange, 0.07);
      }
    });
  });

  const scale = variant === "footer" ? 0.78 : variant === "about" ? 0.94 : 0.9;

  return (
    <group
      ref={root}
      scale={scale}
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
      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={0.05} floatIntensity={0.08}>
        <primitive object={model} />
      </Float>
    </group>
  );
}

export default function FirefoxScene({
  className = "",
  interactive = true,
  variant = "hero",
}: FirefoxSceneProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const [webgl, setWebgl] = useState(true);
  const frameClass = className || "relative min-h-80";

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
      <div className={frameClass}>
        <Image
          src="/firefox-logo.svg"
          alt="Firefox Nightly logo"
          fill
          priority
          className="object-contain p-[12%] drop-shadow-[0_0_80px_rgba(124,58,237,0.7)]"
        />
      </div>
    );
  }

  return (
    <div className={frameClass} aria-label="Interactive Firefox Nightly sculpture">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.1], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 5]} intensity={3.2} color="#ff7139" />
        <pointLight position={[-4, -1, 3]} intensity={34} distance={10} color="#7c3aed" />
        <pointLight position={[1, 3, -2]} intensity={22} distance={8} color="#ec4899" />
        <Suspense fallback={null}>
          <FirefoxModel
            interactive={interactive}
            variant={variant}
            reducedMotion={reducedMotion}
          />
        </Suspense>
        <Sparkles
          count={reducedMotion ? 28 : 72}
          scale={[7, 4.5, 3]}
          size={1.7}
          speed={reducedMotion ? 0 : 0.22}
          opacity={0.5}
          color="#b26cff"
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/firefox-nightly.glb");
