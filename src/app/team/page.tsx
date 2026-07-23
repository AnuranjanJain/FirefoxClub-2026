"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import ApprovedScene from "@/components/3d/ApprovedScene";
import { teamMembers, type TeamMember } from "@/constants/club";

const leadership = teamMembers.filter((member) => member.tier === "leadership");
const leads = teamMembers.filter((member) => member.tier === "leads");
const members = teamMembers.filter((member) => member.tier === "members");

function Brand({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`absolute top-6 left-6 z-50 flex items-center gap-3 md:top-8 md:left-7 ${className}`}
      aria-label="Firefox Club home"
    >
      <span className="relative block size-10 md:size-12">
        <Image src="/firefox-logo.svg" alt="" fill priority className="object-contain" />
      </span>
      <span className="text-[9px] font-bold uppercase leading-4 tracking-[0.18em] text-white">
        Firefox Club
        <span className="block text-[#9a65ff]">VIT Bhopal</span>
      </span>
    </Link>
  );
}

function TeamRail({ active }: { active: "leadership" | "leads" | "members" }) {
  const items = [
    { id: "leadership", number: "01", label: "Leadership" },
    { id: "leads", number: "02", label: "Leads" },
    { id: "members", number: "03", label: "Team" },
  ] as const;

  return (
    <aside className="absolute inset-y-0 left-0 z-40 hidden w-[156px] border-r border-white/10 bg-[#03020a]/65 backdrop-blur-md md:block">
      <Brand />
      <nav className="absolute top-[25%] left-7 grid gap-10">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`group grid gap-1 text-[9px] uppercase tracking-[0.18em] ${
              active === item.id ? "text-white" : "text-white/35 hover:text-white/70"
            }`}
          >
            <span className={active === item.id ? "text-[#9a65ff]" : ""}>{item.number}</span>
            <span>{item.label}</span>
            <span
              className={`mt-2 h-10 w-px ${
                active === item.id ? "bg-gradient-to-b from-[#9a65ff] to-[#ff7139]" : "bg-white/20"
              }`}
            />
          </a>
        ))}
      </nav>
      <div className="absolute bottom-8 left-7 grid gap-5 text-white/35">
        <Mail size={15} />
        <Instagram size={15} />
      </div>
    </aside>
  );
}

function Cutout({
  member,
  className = "",
  imageClassName = "",
  priority = false,
}: {
  member: TeamMember;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  if (!member.cutout) return null;

  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 80, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image
        src={member.cutout}
        alt={member.name}
        fill
        priority={priority}
        sizes="(max-width: 768px) 90vw, 45vw"
        className={`origin-bottom object-contain object-bottom drop-shadow-[0_0_24px_rgba(124,58,237,0.75)] ${imageClassName}`}
      />
    </motion.div>
  );
}

function Leadership() {
  const reducedMotion = Boolean(useReducedMotion());
  const [president, vicePresident] = leadership;

  return (
    <section
      id="leadership"
      className="team-cinematic relative min-h-[100svh] overflow-hidden bg-[#03020a] md:pl-[156px]"
    >
      <TeamRail active="leadership" />
      <Brand className="md:hidden" />
      <ApprovedScene
        variant="team"
        sectionIndex={0}
        fallback="/Background2.jpg"
        interactive={false}
        className="approved-live-scene absolute inset-0 z-0 [opacity:.32]"
      />
      <div className="team-stars pointer-events-none absolute inset-0" />
      <div className="absolute inset-x-[8%] bottom-[8%] h-[38%] rounded-[50%] bg-[#5520a7]/20 blur-[90px]" />

      <motion.div
        className="absolute top-[8%] left-1/2 z-20 hidden w-[38%] -translate-x-1/2 md:block"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">
          <span className="text-[#9a65ff]">01 / 03</span>
          <span className="ml-5">Our team</span>
        </p>
        <h1 className="font-display text-[clamp(4rem,6.3vw,7.5rem)] leading-[0.72]">
          The people
          <span className="block">who move</span>
          <span className="block">
            us <em className="text-[#9a65ff]">forward</em><span className="text-[#ff7139]">.</span>
          </span>
        </h1>
        <p className="mt-7 max-w-sm text-sm leading-6 text-white/55">
          Builders, thinkers, and dreamers driven by curiosity and a shared belief
          in open, better, together.
        </p>
      </motion.div>

      <Cutout
        member={president}
        priority
        className="bottom-[6%] left-[8%] hidden h-[79%] w-[42%] md:block"
        imageClassName="scale-[1.14]"
      />
      <Cutout
        member={vicePresident}
        priority
        className="right-[2%] bottom-[6%] hidden h-[79%] w-[39%] md:block"
        imageClassName="scale-[1.14]"
      />

      {!reducedMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute bottom-[11%] left-[13%] hidden h-[65%] w-[27%] border-l border-[#8b5cf6]/25 md:block"
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute right-[7%] bottom-[10%] hidden h-[64%] w-[26%] border-r border-[#ff7139]/20 md:block"
            animate={{ x: [8, -8, 8] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="absolute bottom-[8%] left-[13%] z-30 hidden max-w-[29%] md:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a56dff]">
          {president.role}
        </p>
        <p className="font-display mt-3 text-4xl">{president.name}</p>
        <p className="mt-3 text-xs text-white/50">{president.statement}</p>
      </div>
      <div className="absolute right-[7%] bottom-[8%] z-30 hidden max-w-[29%] md:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a56dff]">
          {vicePresident.role}
        </p>
        <p className="font-display mt-3 text-4xl">{vicePresident.name}</p>
        <p className="mt-3 text-xs text-white/50">{vicePresident.statement}</p>
      </div>
      <p className="absolute bottom-[4%] left-1/2 z-30 hidden -translate-x-1/2 text-[8px] uppercase tracking-[0.3em] text-[#a56dff] md:block">
        Scroll to meet the leads
      </p>

      <div className="relative z-20 px-6 pt-28 pb-24 md:hidden">
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/60">
          <span className="text-[#9a65ff]">01 / 03</span>
          <span className="ml-4">Our team</span>
        </p>
        <h1 className="font-display mt-5 text-6xl leading-[0.8]">
          The people who move us <em className="text-[#9a65ff]">forward</em>
          <span className="text-[#ff7139]">.</span>
        </h1>
        <p className="mt-6 text-sm leading-6 text-white/52">
          Builders, thinkers, and dreamers driven by curiosity and a shared belief
          in open, better, together.
        </p>
        <div className="mt-10 grid gap-10">
          {leadership.map((member) => (
            <article key={member.name}>
              <div className="relative h-[440px] overflow-hidden border-b border-[#8b5cf6]/35">
                <Image
                  src={member.cutout!}
                  alt={member.name}
                  fill
                  priority
                  sizes="90vw"
                  className="origin-bottom scale-[1.22] object-contain object-bottom drop-shadow-[0_0_28px_rgba(124,58,237,0.8)]"
                />
              </div>
              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#a56dff]">
                {member.role}
              </p>
              <h2 className="font-display mt-2 text-4xl">{member.name}</h2>
              <p className="mt-2 text-xs leading-5 text-white/45">{member.statement}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Leads() {
  const displayLeads = [
    leads.find((member) => member.name === "Jishan Ashraf"),
    leads.find((member) => member.name === "Sidhant Kumar"),
    leads.find((member) => member.name === "Heeral Jiwnani"),
    leads.find((member) => member.name === "Anuranjan Jain"),
    leads.find((member) => member.name === "Ayaan Pervez Khan"),
    leads.find((member) => member.name === "Ayush Agrawal"),
    leads.find((member) => member.name === "Sara Mollick"),
  ].filter(Boolean) as TeamMember[];

  const placements = [
    "left-[0%] bottom-[10%] h-[47%] w-[17%] opacity-80",
    "left-[12%] bottom-[9%] h-[57%] w-[19%]",
    "left-[25%] bottom-[8%] h-[64%] w-[21%]",
    "left-1/2 bottom-[6%] z-10 h-[80%] w-[28%] -translate-x-1/2",
    "right-[25%] bottom-[8%] h-[64%] w-[21%]",
    "right-[12%] bottom-[9%] h-[57%] w-[19%]",
    "right-[0%] bottom-[10%] h-[47%] w-[17%] opacity-80",
  ];

  return (
    <section
      id="leads"
      className="team-cinematic relative min-h-[100svh] overflow-hidden bg-[#03020a] md:pl-[156px]"
    >
      <TeamRail active="leads" />
      <ApprovedScene
        variant="team"
        sectionIndex={1}
        fallback="/Background2.jpg"
        interactive={false}
        className="approved-live-scene absolute inset-0 z-0 [opacity:.44]"
      />
      <div className="team-stars pointer-events-none absolute inset-0 opacity-70" />
      <div className="absolute inset-x-[10%] bottom-[-18%] h-[50%] rounded-[50%] border-t-2 border-[#ff7139] bg-[#531da4]/25 shadow-[0_-20px_100px_rgba(124,58,237,0.45)]" />
      <div className="absolute top-[12%] left-[12%] z-30 hidden md:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a65ff]">
          Section 02
        </p>
        <h2 className="font-display mt-3 text-7xl">Our Team</h2>
        <p className="mt-4 max-w-xs text-sm leading-6 text-white/52">
          The minds behind the mission. Designing, building, and leading with purpose.
        </p>
      </div>

      {displayLeads.map((member, index) => (
        <Cutout
          key={member.name}
          member={member}
          className={`${placements[index]} hidden md:block`}
          imageClassName={index === 3 ? "scale-[1.3]" : "scale-[1.22]"}
        />
      ))}

      <div className="absolute inset-x-[7%] bottom-[8%] z-30 hidden grid-cols-7 gap-2 text-center md:grid">
        {displayLeads.map((member, index) => (
          <div
            key={member.name}
            className={index === 3 ? "translate-y-4" : index === 0 || index === 6 ? "opacity-75" : ""}
          >
            <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#9a65ff]">
              {member.role}
            </p>
            <p className="font-display mt-2 text-[clamp(0.9rem,1.5vw,1.6rem)]">
              {member.name}
            </p>
          </div>
        ))}
      </div>

      <div className="relative z-20 px-6 pt-24 pb-20 md:hidden">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9a65ff]">
          Section 02
        </p>
        <h2 className="font-display mt-3 text-6xl">Our Team</h2>
        <p className="mt-4 text-sm leading-6 text-white/50">
          The minds behind the mission. Designing, building, and leading with purpose.
        </p>
        <div className="mt-10 grid gap-8">
          {displayLeads.map((member) => (
            <article key={member.name} className="border-b border-white/10 pb-6">
              <div className="relative h-[390px] overflow-hidden bg-[#080411]">
                <Image
                  src={member.cutout!}
                  alt={member.name}
                  fill
                  sizes="90vw"
                  className="origin-bottom scale-[1.2] object-contain object-bottom drop-shadow-[0_0_26px_rgba(124,58,237,0.75)]"
                />
              </div>
              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9a65ff]">
                {member.role}
              </p>
              <h3 className="font-display mt-2 text-3xl">{member.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Initials({ member }: { member: TeamMember }) {
  const letters = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="grid h-full place-items-center bg-[#10091f] font-display text-5xl text-[#9a65ff]">
      {letters}
    </div>
  );
}

function Members() {
  return (
    <section
      id="members"
      className="relative min-h-[100svh] bg-[radial-gradient(circle_at_50%_0%,#13082a_0%,#03020a_48%)] px-6 py-24 md:pl-[205px] md:pr-12"
    >
      <TeamRail active="members" />
      <div className="mx-auto max-w-[1480px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
          <span className="text-[#9a65ff]">03</span>
          <span className="mx-3 text-[#ff7139]">/</span>
          All members
        </p>
        <h2 className="font-display mt-4 text-6xl leading-none md:text-7xl">
          The crew behind the builds
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
          Designers, developers, writers, and dreamers building, learning, and
          shipping together.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {members.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: (index % 6) * 0.04, duration: 0.55 }}
              className={index % 7 === 1 ? "lg:translate-y-5" : ""}
            >
              <div className="relative aspect-[1.05/1] overflow-hidden border border-white/8 bg-[#10091f]">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                    className="object-cover object-[50%_34%] grayscale-[0.08] transition duration-500 hover:scale-105 hover:grayscale-0"
                  />
                ) : (
                  <Initials member={member} />
                )}
              </div>
              <h3 className="font-display mt-3 text-xl leading-none">{member.name}</h3>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[#9a65ff]">
                {member.team}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-white/10 pt-7 text-white/45">
          <p className="text-sm">Curious how we build and ship?</p>
          <div className="flex gap-5">
            <Github size={17} />
            <Instagram size={17} />
            <Linkedin size={17} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TeamPage() {
  return (
    <main className="bg-[#03020a]">
      <Leadership />
      <Leads />
      <Members />
    </main>
  );
}
