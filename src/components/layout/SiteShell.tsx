"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
];

function NightlyLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-[#03020a]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="relative size-28"
            animate={{ rotate: 360, scale: [0.92, 1.04, 0.92] }}
            transition={{ rotate: { duration: 2.8, repeat: Infinity, ease: "linear" } }}
          >
            <Image
              src="/firefox-logo.svg"
              alt="Firefox Club loading"
              fill
              priority
              className="object-contain drop-shadow-[0_0_48px_rgba(124,58,237,0.9)]"
            />
          </motion.div>
          <span className="absolute bottom-9 text-[9px] font-bold uppercase tracking-[0.35em] text-white/45">
            Entering Nightly
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 0.82, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}

function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-[100] flex border border-white/15 bg-[#070511]/90 p-1 shadow-2xl backdrop-blur-xl md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex-1 px-3 py-3 text-center text-[9px] font-bold uppercase ${
            pathname === item.href ? "bg-white text-black" : "text-white/55"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <NightlyLoader />
      {children}
      <MobileNav />
    </>
  );
}
