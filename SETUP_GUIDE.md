# 🚀 DeepNeurax Website - Quick Start Guide

## What You Have

A complete Next.js website with **11 fully editable sections**:

1. ✅ Hero Section (video background + animated blobs)
2. ✅ Metrics Counter (animated stats)
3. ✅ Core Services Grid
4. ✅ Featured Products
5. ✅ Why Choose Us (Features)
6. ✅ Case Studies
7. ✅ Client Testimonials (carousel)
8. ✅ Blog & Resources
9. ✅ CTA Section
10. ✅ Footer
11. ✅ Dynamic Header (shrinks on scroll)

## 📝 Next Steps to Go Live

### Step 1: Set Up Sanity (5 minutes)

1. Open terminal in project folder
2. Run: `sanity init`
3. Create a new project (or select existing)
4. Copy your **Project ID**
5. Update `.env.local` with your Project ID:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
   ```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Add Your Content

1. Go to: **http://localhost:3000/studio**
2. Add content for each section:

#### Must-Add Content (Required):
- **Hero Section** (1 document)
  - Title, tagline, description
  - Button texts & links
  - Video URL or background image

- **CTA Section** (1 document)
  - Call-to-action title
  - Button text & link

- **Footer** (1 document)
  - Company description
  - Social links
  - Contact info

#### Optional Content (Add as needed):
- **Services** (create 3-6 items)
- **Products** (create 3-6 items)
- **Features** (create 4-6 items)
- **Metrics** (create 4 items like "150+ Projects")
- **Case Studies** (create 2-3 items)
- **Testimonials** (create 3-5 items)
- **Blog Posts** (create articles)

### Step 4: Preview Your Site

Go to: **http://localhost:3000**

Your site will automatically display all the content you added!

## 🎨 Customization Tips

### Change Colors
Edit component files in `/components` folder
- Current theme: Purple-Pink gradient
- Search for: `purple-600` and `pink-600` to change colors

### Add Your Logo
Replace the `∆N` logo in:
- `components/Header.tsx`
- `components/Footer.tsx`

### Change Fonts
Edit `app/globals.css` - update font family

### Modify Animations
Components use Framer Motion - adjust timings in each component file

## 🚢 Deploy to Production

### Option 1: Vercel (Recommended - Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables (Project ID)
6. Click "Deploy"

**Done!** Your site is live in ~2 minutes.

### Option 2: Netlify / Other Platforms

Similar process - import from GitHub and add environment variables.

## 🎓 How to Edit Content Later

1. Go to your deployed Studio: `your-domain.com/studio`
2. Or run locally: `npm run dev` → `localhost:3000/studio`
3. Edit any content
4. Changes appear instantly on the website!

## 📱 Mobile Optimization

The site is **fully responsive**:
- Mobile: Video background becomes static image
- All sections adapt to screen size
- Touch-friendly carousels

## 🔧 Common Issues & Fixes

### "No content showing"
→ Add content in Sanity Studio at `/studio`

### "Studio not loading"
→ Check `.env.local` has correct Project ID

### "Build errors"
→ Run: `npm install` then `npm run dev`

## 💡 Pro Tips

1. **Add content gradually** - Start with Hero, CTA, and Footer
2. **Test on mobile** - Use browser dev tools
3. **Use high-quality images** - Especially for hero background
4. **Keep text concise** - Shorter descriptions work better
5. **Update regularly** - Add new blog posts and case studies

## 📞 Need Help?

- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Sanity Docs: [sanity.io/docs](https://www.sanity.io/docs)
- Vercel Support: Built-in chat support

## ✅ Launch Checklist

- [ ] Sanity project initialized
- [ ] All required content added (Hero, CTA, Footer)
- [ ] Optional content added (Services, Products, etc.)
- [ ] Site tested locally
- [ ] Colors/branding customized
- [ ] Logo replaced
- [ ] Deployed to Vercel
- [ ] Custom domain connected (optional)

---

**You're all set!** 🎉

The site is production-ready. Just add your content and deploy!
