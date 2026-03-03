# DeepNeurax Technologies Website

A modern, fully editable marketing website built with **Next.js 14**, **Strapi CMS**, **Tailwind CSS**, and **Framer Motion**.

## 🚀 Features

- ✨ **11 Fully Editable Sections** via Strapi CMS
- 🎥 **Hero Section** with video background & animated blobs
- 📊 **Animated Metrics Counter** with CountUp
- 🎨 **Gradient Animations** & smooth transitions
- 📱 **Fully Responsive** design
- ⚡ **Optimized Performance** with Next.js 14 App Router
- 🎭 **Framer Motion** animations throughout
- 🔄 **Dynamic Header** that shrinks on scroll

## 📐 Website Sections

1. **Header/Navigation** - Fixed header with scroll-triggered transition
2. **Hero Section** - Video background with floating blobs
3. **Metrics Counter** - Animated completion stats
4. **Core Services** - Grid of editable service cards
5. **Featured Products** - Carousel-style product showcase
6. **Why Choose Us** - Features grid
7. **Case Studies** - Results and metrics
8. **Testimonials** - Carousel with client reviews
9. **Blog & Resources** - Latest blog posts
10. **CTA Section** - Call to action
11. **Footer** - Multi-column footer with links

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **CMS:** Strapi
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Counter:** React CountUp
- **Language:** TypeScript

## ⚙️ Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Setup Strapi Backend

Create a new Strapi project in a separate directory:

\`\`\`bash
npx create-strapi-app@latest deepneurax-strapi --quickstart
\`\`\`

See **[STRAPI_SETUP_GUIDE.md](STRAPI_SETUP_GUIDE.md)** for detailed instructions on:
- Creating content types
- Setting up permissions
- Getting API tokens

### 3. Configure Environment Variables

Update `.env.local`:

\`\`\`env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token-here
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit:
- **Website:** http://localhost:3000
- **Strapi Admin:** http://localhost:1337/admin

### 5. Add Content

Go to Strapi admin panel and populate all content sections (hero, services, products, features, etc.)

## 📂 Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main homepage
│   └── blog/              # Blog post pages
├── components/            # React components (11 sections)
├── lib/                   # Utility functions
│   └── strapi/           # Strapi client utilities
└── STRAPI_SETUP_GUIDE.md # Detailed Strapi setup guide
\`\`\`

## 🚢 Deployment

**Vercel:**
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## 📄 More Info

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi Setup Guide](STRAPI_SETUP_GUIDE.md)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
