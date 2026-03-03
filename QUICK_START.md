# Quick Start Guide - Strapi Backend

This is a condensed quick start guide to get your DeepNeurax website running with Strapi as quickly as possible.

## Prerequisites
- Node.js 18+ installed
- npm or yarn installed

## Step 1: Install Dependencies (2 minutes)

```bash
cd deepneurax-website
npm install
```

## Step 2: Setup Strapi Backend (5 minutes)

### Option A: New Strapi Installation

```bash
# In a separate terminal/folder
npx create-strapi-app@latest deepneurax-strapi --quickstart
```

This will:
- Create a new Strapi project
- Install dependencies
- Start Strapi at http://localhost:1337
- Open admin panel in browser

### Option B: Existing Strapi

If you already have Strapi running, skip to Step 3.

## Step 3: Create Admin Account (1 minute)

When Strapi opens in browser:
1. Create your admin account
2. Click "Let's start"

## Step 4: Get API Token (2 minutes)

1. In Strapi admin, go to **Settings → API Tokens**
2. Click **"Create new API Token"**
3. Configure:
   - Name: `Next.js Frontend`
   - Token type: `Read-only`
   - Duration: `Unlimited`
4. **Copy the token** (you won't see it again!)

## Step 5: Configure Environment (1 minute)

Update `deepneurax-website/.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=paste-your-token-here
```

## Step 6: Create Content Types (10 minutes)

In Strapi admin, create these **10 content types**. For each:

### Quick Create Template:

**Go to:** Content-Type Builder → Create new collection type

#### 1. Service
- API ID: `service`
- Add fields:
  - `title` (Text, Required)
  - `description` (Text - Long)
  - `icon` (Text)
  - `image` (Media - Single)
  - `link` (Text)
  - `order` (Number)
  - `cardBackgroundColor` (Text)
  - `borderColor` (Text)
  - `titleColor` (Text)
  - `textColor` (Text)

#### 2. Product
- API ID: `product`
- Fields: same as Service, but use `name` instead of `title`

#### 3. Feature
- API ID: `feature`
- Fields: `title`, `description`, `icon`, `image`, `order`, color fields

#### 4. Metric
- API ID: `metric`
- Fields:
  - `label` (Text, Required)
  - `value` (Number, Required)
  - `suffix` (Text)
  - `icon` (Text)
  - `order` (Number)
  - color fields

#### 5. Case Study
- API ID: `case-study`
- Fields: `title`, `description`, `metrics` (JSON), `link`, `order`

#### 6. Testimonial
- API ID: `testimonial`
- Fields: `text`, `author`, `role`, `avatar` (Media), `order`

#### 7. Blog Post
- API ID: `blog-post`
- Fields:
  - `title` (Text, Required)
  - `slug` (UID, attached to title, Required)
  - `publishedAt` (Date)
  - `excerpt` (Text - Long)
  - `coverImage` (Media)
  - `tags` (JSON)
  - `content` (Rich Text - Markdown)
  - `author` (Text)

### Single Types (no plural API):

**Go to:** Content-Type Builder → Create new single type

#### 8. Hero
- API ID: `hero`
- Fields: `title`, `tagline`, `description`, `primaryButtonText`, `primaryButtonLink`, `secondaryButtonText`, `secondaryButtonLink`, `backgroundImage`, color fields

#### 9. CTA
- API ID: `cta`
- Fields: `title`, `subtitle`, `buttonText`, `buttonLink`

#### 10. Footer
- API ID: `footer`
- Fields: `companyDescription`, `socialLinks` (JSON), `contactEmail`, `contactPhone`, `address`, `copyrightText`

> 💡 **Tip:** See `STRAPI_CONTENT_TYPES.md` for complete field definitions

## Step 7: Set Permissions (2 minutes)

1. Go to **Settings → Roles → Public**
2. For EACH content type, check:
   - ✅ `find`
   - ✅ `findOne`
3. Click **Save**

## Step 8: Add Sample Content (5-10 minutes)

1. Go to **Content Manager**
2. Create at least one entry for each content type
3. For Single Types (Hero, CTA, Footer): create your single entry
4. For Collections: create 2-3 entries each
5. **Important:** Click "Publish" for each entry!

## Step 9: Start Next.js (30 seconds)

```bash
# In deepneurax-website folder
npm run dev
```

Open http://localhost:3000

## Verification Checklist

✅ Strapi running at http://localhost:1337
✅ All 10 content types created
✅ Public permissions set for all types
✅ Sample content added and published
✅ API token copied to .env.local
✅ Next.js running at http://localhost:3000
✅ Website displaying content from Strapi

## Common Quick Fixes

### No content showing?
```bash
# Check Strapi is running
# Visit: http://localhost:1337/api/services?populate=*
# Should see JSON data
```

### CORS error?
In Strapi project, edit `config/middlewares.js`:
```javascript
'strapi::cors': {
  enabled: true,
  origin: ['http://localhost:3000'],
},
```

### Token not working?
1. Generate new token in Strapi admin
2. Make sure it's "Read-only" type
3. Copy entire token
4. Update .env.local
5. Restart Next.js dev server

## What's Next?

### Add More Content
Fill out all sections with your actual content in Strapi admin.

### Customize Styling
Edit components in `/components` folder.

### Deploy
1. Deploy Strapi (Strapi Cloud, Railway, Heroku)
2. Update `NEXT_PUBLIC_STRAPI_URL` to production URL
3. Deploy Next.js (Vercel, Netlify)

## Need More Help?

- **Detailed Setup:** See `STRAPI_SETUP_GUIDE.md`
- **Content Types:** See `STRAPI_CONTENT_TYPES.md`
- **Migration Info:** See `MIGRATION_SUMMARY.md`

---

**Total Setup Time:** ~30 minutes
**Result:** Fully functional website with headless CMS! 🚀
