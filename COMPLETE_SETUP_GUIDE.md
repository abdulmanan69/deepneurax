# 🚀 Complete Setup Guide - DeepNeurax Website

Everything is ready! Follow these steps to get your website running with dummy content.

## Current Status ✅

- ✅ Next.js frontend migrated to Strapi
- ✅ Strapi backend created with 10 content types
- ✅ Seed script ready with dummy content
- ✅ Backend running at http://localhost:1337

## Setup Steps (5-10 minutes)

### Step 1: Create Admin Account (1 min)
The admin panel should already be open in your browser, or visit:
http://localhost:1337/admin

Fill in:
- First name
- Last name
- Email
- Password

Click **Let's start**

### Step 2: Set Public Permissions (2 min)
1. In Strapi admin, go to **Settings** (left sidebar)
2. Click **Roles** under USERS & PERMISSIONS PLUGIN
3. Click **Public**
4. For each content type, enable these permissions:
   - ✅ `find` - to fetch all records
   - ✅ `findOne` - to fetch single records

Content types to enable:
- Blog-post
- Case-study
- Cta
- Feature
- Footer
- Hero
- Metric
- Product
- Service
- Testimonial

5. Click **Save** at the top right

### Step 3: Generate API Token (1 min)
1. Still in **Settings**, click **API Tokens**
2. Click **Create new API Token**
3. Fill in:
   - **Name**: `Seeder` (for now) or `Next.js Frontend`
   - **Description**: `Full access token for seeding content`
   - **Token type**: **Full access** (needed for creating content)
   - **Token duration**: `Unlimited`
4. Click **Save**
5. **IMPORTANT**: Copy the token (you won't see it again!)

### Step 4: Seed Dummy Content (2 min)

Open a new PowerShell terminal in the backend folder and run:

```powershell
cd "c:\Users\syednomanshah\Desktop\deep neurax\deepneurax-backend"

# Run the interactive seeder
.\seed.bat
```

When prompted, paste your API token from Step 3.

The script will create:
- 1 Hero section
- 4 Services
- 3 Products
- 4 Features
- 4 Metrics
- 3 Case Studies
- 3 Testimonials
- 3 Blog Posts
- 1 CTA section
- 1 Footer

### Step 5: Publish Content (2 min)
1. Go back to Strapi admin
2. Click **Content Manager** in the left sidebar
3. For each content type:
   - Click the content type name
   - Select all entries (checkbox at top)
   - Click **Publish** button
   - Click **Confirm**

Repeat for all 10 content types.

### Step 6: Create Read-Only Token for Frontend (1 min)
1. Go to **Settings → API Tokens**
2. Create another token:
   - **Name**: `Next.js Frontend`
   - **Token type**: **Read-only** (for security)
   - **Duration**: `Unlimited`
3. Copy this new token

### Step 7: Update Frontend Environment (30 sec)
1. Open `deepneurax-website/.env.local`
2. Replace the placeholder with your read-only token:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=paste-your-read-only-token-here
```

### Step 8: View Your Website! 🎉

Your Next.js dev server should already be running. If not:

```bash
cd "c:\Users\syednomanshah\Desktop\deep neurax\deepneurax-website"
npm run dev
```

Visit: http://localhost:3000

You should now see your website with all the dummy content!

## What You'll See

### Homepage Sections:
1. **Hero** - "Transform Your Business with AI"
2. **Metrics** - 250+ Projects, 150+ Clients, etc.
3. **Services** - AI Consulting, ML, Data Analytics, Computer Vision
4. **Products** - NeuraxAI Platform, AutoML Suite, DataViz Pro
5. **Features** - Scalable, Real-time, Secure, 24/7 Support
6. **Case Studies** - E-commerce, Healthcare, Manufacturing
7. **Testimonials** - Client reviews
8. **Blog** - 3 sample blog posts
9. **CTA** - "Ready to Transform Your Business?"
10. **Footer** - Contact info and social links

## Customizing Content

### Through Strapi Admin:
1. Go to http://localhost:1337/admin
2. Click **Content Manager**
3. Edit any entry
4. Click **Save** and **Publish**
5. Refresh your Next.js app to see changes

### Adding Images:
1. Go to **Media Library** in Strapi
2. Click **Upload assets**
3. Upload your images
4. Go to **Content Manager**
5. Edit an entry (e.g., Service)
6. Click on image field
7. Select uploaded image
8. Save and publish

## Troubleshooting

### Frontend shows "Setup Required" page
- ✅ Check Strapi is running (http://localhost:1337)
- ✅ Verify content is published (not draft)
- ✅ Check Public permissions are enabled
- ✅ Verify API token in .env.local is correct

### Seed script fails
- ✅ Make sure admin account is created
- ✅ Use a **Full access** token for seeding
- ✅ Check Strapi is running
- ✅ Verify Public permissions are set

### Images not loading
- ✅ Check NEXT_PUBLIC_STRAPI_URL in .env.local
- ✅ Make sure images are uploaded to Media Library
- ✅ Verify next.config.ts has correct image domains

### API returns 403 Forbidden
- ✅ Double-check Public permissions (find, findOne)
- ✅ Make sure content is **published** (not draft)
- ✅ Verify API token is correct

## Quick Reference

**Strapi Admin**: http://localhost:1337/admin  
**Next.js App**: http://localhost:3000  
**API Endpoint**: http://localhost:1337/api  

**Test API** (after setup):
```bash
curl http://localhost:1337/api/services?populate=*
```

## Next Steps

1. **Customize Content**: Edit text, add your own descriptions
2. **Add Images**: Upload and attach images to services, products, etc.
3. **Create More Content**: Add more blog posts, services, etc.
4. **Style Adjustments**: Modify colors in components (if needed)
5. **Deploy**: When ready, deploy to Vercel (frontend) and Railway/Heroku (backend)

## File Structure

```
deep neurax/
├── deepneurax-backend/          # Strapi CMS
│   ├── src/api/                 # Content types
│   ├── seed.js                  # Seed script
│   ├── seed.bat                 # Windows seed runner
│   └── SEEDING.md              # Seeding guide
└── deepneurax-website/          # Next.js frontend
    ├── app/                     # Pages
    ├── components/              # React components
    ├── lib/strapi/             # Strapi client
    └── .env.local              # Environment variables
```

## Support

If you encounter any issues:
1. Check this guide's Troubleshooting section
2. Review [SEEDING.md](../deepneurax-backend/SEEDING.md)
3. Review [STRAPI_SETUP_GUIDE.md](STRAPI_SETUP_GUIDE.md)
4. Check Strapi docs: https://docs.strapi.io/

---

**You're all set!** Enjoy building with DeepNeurax! 🚀
