"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ApprovedScene, {
  type ApprovedSceneVariant,
} from "@/components/3d/ApprovedScene";

type FrameProps = {
  id: string;
  src: string;
  alt: string;
  priority?: boolean;
  scene: ApprovedSceneVariant;
  sectionIndex: number;
  sceneClassName?: string;
  children?: React.ReactNode;
};

function CinematicFrame({
  id,
  src,
  alt,
  scene,
  sectionIndex,
  sceneClassName = "",
  priority = false,
  children,
}: FrameProps) {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.035, 1, 1.035]);

  return (
    <section
      ref={section}
      id={id}
      className="approved-frame relative min-h-[100svh] overflow-hidden bg-[#020108]"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={reducedMotion ? undefined : { y, scale }}
      >
        <Image
          src={src}
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
        fallback={src}
        interactive={scene !== "footer"}
        className={`approved-live-scene absolute inset-0 z-[1] ${sceneClassName}`}
      />
      <div className="approved-frame-vignette pointer-events-none absolute inset-0" />
      <div className="approved-particles pointer-events-none absolute inset-0" />
      {children}
    </section>
  );
}

function DesktopHotspots() {
  return (
    <>
      <nav className="absolute top-[3.2%] right-[4.6%] z-30 hidden h-12 items-center gap-10 md:flex">
        <Link href="/" className="h-full w-14" aria-label="Home" />
        <Link href="/about" className="h-full w-14" aria-label="About" />
        <Link href="/team" className="h-full w-14" aria-label="Team" />
      </nav>
      <a
        href="#moments"
        className="absolute bottom-[16%] left-1/2 z-30 hidden size-20 -translate-x-1/2 md:block"
        aria-label="Scroll to club moments"
      />
    </>
  );
}

export default function HomePage() {
  return (
    <main className="bg-[#020108]">
      <CinematicFrame
        id="hero"
        src="/design-reference/home-hero.png"
        alt="Firefox Club crystalline fox orbiting an open globe"
        scene="hero"
        sectionIndex={0}
        sceneClassName="approved-scene-hero"
        priority
      >
        <DesktopHotspots />
      </CinematicFrame>

      <CinematicFrame
        id="moments"
        src="/design-reference/home-events.png"
        alt="Firefox Club event moments presented as a cinematic horizontal gallery"
        scene="shards"
        sectionIndex={1}
        sceneClassName="approved-scene-events"
      />

      <CinematicFrame
        id="footer"
        src="/design-reference/home-footer.png"
        alt="Keep the web open call to action and Firefox Club footer"
        scene="footer"
        sectionIndex={2}
        sceneClassName="approved-scene-footer"
      >
        <Link
          href="/about"
          className="absolute top-[2%] left-[34%] z-30 hidden h-14 w-20 md:block"
          aria-label="About"
        />
        <Link
          href="/team"
          className="absolute top-[2%] left-[51%] z-30 hidden h-14 w-24 md:block"
          aria-label="Team"
        />
        <a
          href="mailto:hello@mozilla-vitbhopal.club"
          className="absolute top-[76%] left-[39%] z-30 hidden h-16 w-[18%] md:block"
          aria-label="Join the Firefox Club"
        />
      </CinematicFrame>
    </main>
  );
}
