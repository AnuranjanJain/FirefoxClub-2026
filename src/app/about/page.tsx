"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ApprovedScene, {
  type ApprovedSceneVariant,
} from "@/components/3d/ApprovedScene";

function AboutFrame({
  id,
  image,
  alt,
  scene,
  sectionIndex,
  priority = false,
}: {
  id: string;
  image: string;
  alt: string;
  scene: ApprovedSceneVariant;
  sectionIndex: number;
  priority?: boolean;
}) {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });
  const imageX = useTransform(scrollYProgress, [0, 1], ["-1.8%", "1.8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.04]);

  return (
    <section
      ref={section}
      id={id}
      className="approved-frame relative min-h-[100svh] overflow-hidden bg-[#020108]"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={reducedMotion ? undefined : { x: imageX, scale: imageScale }}
      >
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="approved-frame-image object-cover"
        />
      </motion.div>
      <ApprovedScene
        variant={scene}
        sectionIndex={sectionIndex}
        fallback={image}
        className={`approved-live-scene absolute inset-0 z-[1] ${
          scene === "split" ? "approved-scene-split" : "approved-scene-shards"
        }`}
      />
      <div className="approved-frame-vignette pointer-events-none absolute inset-0" />
      <div className="approved-particles pointer-events-none absolute inset-0" />
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-[#020108]">
      <AboutFrame
        id="modes"
        image="/design-reference/about-modes.png"
        alt="Firefox Normal and Nightly modes joined in one open web"
        scene="split"
        sectionIndex={0}
        priority
      />
      <AboutFrame
        id="values"
        image="/design-reference/about-values.png"
        alt="Firefox Club principles exploding through a field of crystalline shards"
        scene="shards"
        sectionIndex={1}
      />
      <nav className="fixed top-[25%] left-[2%] z-40 hidden h-[50%] w-[7%] md:block">
        <Link href="/" className="absolute inset-x-0 top-0 h-[14%]" aria-label="Home" />
        <a href="#values" className="absolute inset-x-0 top-[20%] h-[14%]" aria-label="Values" />
        <Link href="/team" className="absolute inset-x-0 bottom-0 h-[14%]" aria-label="Team" />
      </nav>
    </main>
  );
}
