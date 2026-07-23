# Mozilla Firefox Club - VIT Bhopal

A modern, minimalistic website for the Mozilla Firefox Club at VIT Bhopal University. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

- **Modern Design**: Clean, minimalistic interface with light theme
- **Responsive**: Fully responsive design for all devices
- **Fast**: Built with Next.js App Router and Turbopack for optimal performance
- **Accessible**: Semantic HTML and WCAG compliant
- **SEO Optimized**: Meta tags, OpenGraph, and structured data
- **Smooth Animations**: Framer Motion for interactive experiences
- **Type Safe**: Full TypeScript support

## Pages

- **Home** (`/`) - Landing page with hero, about, events, and team previews
- **About** (`/about`) - Club history, mission, and team information
- **Events** (`/events`) - Upcoming events and workshops
- **Projects** (`/projects`) - Showcase of community projects
- **Team** (`/team`) - Team members and leadership
- **Gallery** (`/gallery`) - Event photos and memories
- **Blog** (`/blog`) - Articles and news
- **Contact** (`/contact`) - Get in touch
- **Join** (`/join`) - Membership signup
- **Resources** (`/resources`) - Learning materials and links

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Frontend**: React 19.2.3 with TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS 4
- **Animations**: Framer Motion 12.34.3
- **Animations (JSON)**: Lottie React 2.4.1
- **Icons**: Lucide React 0.575.0
- **UI Components**: FlyOnUI 2.4.1
- **Linting**: ESLint 9

## Design System

### Colors
- **Primary**: Orange (#ff7139)
- **Secondary**: Yellow (#ffb800)
- **Accent Red**: #e66000
- **Purple**: #8a37f5
- **Indigo**: #20123a
- **Theme**: Light background with dark accents

### Typography
- **Font**: Space Grotesk (Google Fonts)
- **Default**: System fonts fallback

## Installation

### Prerequisites
- Node.js 18+ (v16.14 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/[your-username]/firefox-club.git
cd firefox-club

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in browser
```

## Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── [routes]/            # Route pages
├── components/
│   ├── home/                # Home page sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── UpcomingEvents.tsx
│   │   ├── TeamGalleryPreview.tsx
│   │   └── CTASection.tsx
│   └── layout/              # Layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
└── constants/
    └── data.tsx             # Data variables
```

## Key Features Explained

### Navbar
- Sticky header with scroll detection
- Responsive mobile menu
- Active link indicators
- Smooth transitions

### Home Page
- Hero section with CTA buttons
- About section with feature grid
- Events carousel
- Team member preview
- Call-to-action section

### Footer
- Multi-column layout
- Social media links
- Quick navigation
- Contact information
- Copyright notice

## Development

### Code Style
- TypeScript for type safety
- JSX/TSX for components
- Tailwind CSS for styling
- Framer Motion for animations

### Best Practices
- Component-based architecture
- Server and Client components separation
- Responsive design patterns
- Accessibility standards
- Performance optimization

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

### Other Platforms
- Netlify
- AWS Amplify
- GitHub Pages
- Traditional VPS

## Environment Variables

Create a `.env.local` file:

```
# Add any environment variables here
# NEXT_PUBLIC_API_URL=https://api.example.com
```

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

- **Email**: hello@mozilla-vitbhopal.club
- **Location**: VIT Bhopal University, India
- **Website**: https://mozilla-vitbhopal.club

---

Built with ❤️ by the Mozilla Firefox Club Community
