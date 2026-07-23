export const clubConfig = {
  name: "Mozilla Firefox Club",
  campus: "VIT Bhopal",
  email: "hello@mozilla-vitbhopal.club",
  socials: {
    github: "https://github.com/mozilla-vitbhopal",
    instagram: "https://instagram.com/firefoxclub_vit",
    linkedin: "https://linkedin.com/company/mozilla-firefox-club-vitbhopal",
  },
};

export type EventAlbum = {
  title: string;
  year: string;
  type: string;
  image: string;
  video?: string;
  description: string;
};

export const eventAlbums: EventAlbum[] = [
  {
    title: "Firefox Expedition",
    year: "AdVITya 2024",
    type: "Flagship",
    image: "/Background2.jpg",
    description: "An open-web quest through privacy, browser tools, and Mozilla culture.",
  },
  {
    title: "Dev Inferno",
    year: "August 2024",
    type: "Hackathon",
    image: "/Background.jpg",
    description: "An eight-hour build sprint shaped by pressure, teamwork, and working code.",
  },
  {
    title: "IdeaForge",
    year: "December 2024",
    type: "Ideathon",
    image: "/Background2.jpg",
    description: "Students turned open-web problems into sharp, pitchable product ideas.",
  },
  {
    title: "Mozverse",
    year: "AdVITya 2025",
    type: "Mega event",
    image: "/Background.jpg",
    description: "A multiverse of Firefox, design, web tooling, and community challenges.",
  },
  {
    title: "Red Light Code Right",
    year: "July 2025",
    type: "Code challenge",
    image: "/Background2.jpg",
    description: "Algorithms, speed, and a live room built around solving under pressure.",
  },
  {
    title: "Mozzi-Fire",
    year: "August 2025",
    type: "Community",
    image: "/Background.jpg",
    description: "Hands-on workshops and Mozilla-first conversations with the campus community.",
  },
];

export type TeamTier = "leadership" | "leads" | "members";

export type TeamMember = {
  name: string;
  role: string;
  team: string;
  tier: TeamTier;
  image?: string;
  cutout?: string;
  statement?: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Ashhar Khan",
    role: "President",
    team: "Leadership",
    tier: "leadership",
    image: "/team/ashhar-khan.webp",
    cutout: "/team/cutouts/ashhar-khan.png",
    statement: "Lead with purpose. Leave the web more open than we found it.",
  },
  {
    name: "Keya Kalpit Dave",
    role: "Vice President",
    team: "Leadership",
    tier: "leadership",
    image: "/team/keya-kalpit-dave.webp",
    cutout: "/team/cutouts/keya-kalpit-dave.png",
    statement: "Make room for ideas, people, and the courage to build them.",
  },
  {
    name: "Sidhant Kumar",
    role: "General Secretary",
    team: "Leadership",
    tier: "leads",
    image: "/team/sidhant-kumar.webp",
    cutout: "/team/cutouts/sidhant-kumar.png",
  },
  {
    name: "Anuranjan Jain",
    role: "Technical Team Leader",
    team: "Technical",
    tier: "leads",
    image: "/team/anuranjan-jain.webp",
    cutout: "/team/cutouts/anuranjan-jain.png",
  },
  {
    name: "Heeral Jiwnani",
    role: "Event Management Lead & Student Coordinator",
    team: "Events",
    tier: "leads",
    image: "/team/heeral-jiwnani.webp",
    cutout: "/team/cutouts/heeral-jiwnani.png",
  },
  {
    name: "Ayaan Pervez Khan",
    role: "Social Media Lead",
    team: "Social Media",
    tier: "leads",
    image: "/team/ayaan-pervez-khan.webp",
    cutout: "/team/cutouts/ayaan-pervez-khan.png",
  },
  {
    name: "Ayush Agrawal",
    role: "Finance Team Lead",
    team: "Finance",
    tier: "leads",
    image: "/team/ayush-agrawal.webp",
    cutout: "/team/cutouts/ayush-agrawal.png",
  },
  {
    name: "Jishan Ashraf",
    role: "Creative Team Lead",
    team: "Creative",
    tier: "leads",
    image: "/team/jishan-ashraf.webp",
    cutout: "/team/cutouts/jishan-ashraf.png",
  },
  {
    name: "Sara Mollick",
    role: "PR Team Lead",
    team: "Public Relations",
    tier: "leads",
    image: "/team/sara-mollick.webp",
    cutout: "/team/cutouts/sara-mollick.png",
  },
  {
    name: "Awais Khan",
    role: "Technical Team Member",
    team: "Technical",
    tier: "members",
    image: "/team/awais-khan.webp",
  },
  {
    name: "Tanishi Rai",
    role: "Technical Team Member",
    team: "Technical",
    tier: "members",
    image: "/team/tanishi-rai.webp",
  },
  {
    name: "Vatsal Mahajan",
    role: "Technical Team Member",
    team: "Technical",
    tier: "members",
    image: "/team/vatsal-mahajan.webp",
  },
  {
    name: "Prem Patro",
    role: "Technical Team Member",
    team: "Technical",
    tier: "members",
    image: "/team/prem-patro.webp",
  },
  {
    name: "Deepti Singh",
    role: "Technical Team Member",
    team: "Technical",
    tier: "members",
    image: "/team/deepti-singh.webp",
  },
  {
    name: "Malishka Paradkar",
    role: "Technical Team Member",
    team: "Technical",
    tier: "members",
    image: "/team/malishka-paradkar.webp",
  },
  {
    name: "Padma Tripathi",
    role: "Technical Team Member",
    team: "Technical",
    tier: "members",
    image: "/team/padma-tripathi.webp",
  },
  {
    name: "Pratyush Dubey",
    role: "Event Management Team Member",
    team: "Events",
    tier: "members",
  },
  {
    name: "Ashwin S Pillai",
    role: "Event Management Team Member",
    team: "Events",
    tier: "members",
  },
  {
    name: "Mitul Khanna",
    role: "Event Management Team Member",
    team: "Events",
    tier: "members",
    image: "/team/mitul-khanna.webp",
  },
  {
    name: "Avilamb Bhushan",
    role: "Social Media Team Member",
    team: "Social Media",
    tier: "members",
    image: "/team/avilamb-bhushan.webp",
  },
  {
    name: "Siddhant",
    role: "Creative Team Member",
    team: "Creative",
    tier: "members",
    image: "/team/siddhant.webp",
  },
  {
    name: "Amita Maria Abraham",
    role: "Creative Team Member",
    team: "Creative",
    tier: "members",
    image: "/team/amita-maria-abraham.webp",
  },
  {
    name: "Vaishnavi Tiwari",
    role: "Creative Team Member",
    team: "Creative",
    tier: "members",
    image: "/team/vaishnavi-tiwari.webp",
  },
  {
    name: "Bhumika Gupta",
    role: "Content & Editorial Team Member",
    team: "Editorial",
    tier: "members",
    image: "/team/bhumika-gupta.webp",
  },
];
