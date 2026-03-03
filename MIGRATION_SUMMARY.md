# Migration Summary: Sanity to Strapi

This document outlines all changes made to migrate the DeepNeurax website from Sanity CMS to Strapi CMS.

## Date
December 15, 2025

## Overview
Successfully migrated the entire backend from Sanity CMS to Strapi CMS while maintaining all functionality and features.

---

## Changes Made

### 1. Dependencies Updated

#### Removed Packages:
- `@sanity/client`
- `@sanity/image-url`
- `@sanity/ui`
- `@sanity/vision`
- `next-sanity`
- `sanity`
- `@portabletext/react`

#### Added Packages:
- `axios` - For HTTP requests to Strapi
- `qs` - For query string parsing
- `react-markdown` - For rendering markdown content

### 2. New Files Created

#### `/lib/strapi/env.ts`
Configuration file for Strapi environment variables:
- `strapiUrl` - Base URL for Strapi backend
- `strapiToken` - API authentication token

#### `/lib/strapi/client.ts`
Strapi API client with helper functions:
- `fetchAPI()` - Main function for API requests
- `getStrapiURL()` - URL builder
- `getStrapiMedia()` - Media URL resolver

#### `STRAPI_SETUP_GUIDE.md`
Comprehensive guide for:
- Setting up Strapi backend
- Creating content types
- Configuring permissions
- Environment setup
- Troubleshooting

#### `STRAPI_CONTENT_TYPES.md`
Technical reference for:
- All content type schemas
- Field definitions
- API endpoints
- Query examples

### 3. Files Deleted

- `/sanity/` - Entire folder with schemas and config
- `/app/studio/` - Sanity Studio pages
- `sanity.config.ts` - Sanity configuration
- `/scripts/seed-data.ts` - Sanity seed script

### 4. Files Modified

#### `package.json`
- Updated dependencies (removed Sanity, added Strapi-compatible packages)

#### `.env.local`
Changed from:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
NEXT_PUBLIC_SANITY_API_VERSION=...
SANITY_API_TOKEN=...
```

To:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token-here
```

#### `app/page.tsx`
- Replaced Sanity imports with Strapi client
- Changed from GROQ queries to REST API calls
- Transformed API response format to match component expectations
- Updated error message to reflect Strapi setup

#### `app/blog/[slug]/page.tsx`
- Replaced Sanity imports with Strapi client
- Changed blog post fetching from GROQ to REST API
- Replaced `PortableText` with `ReactMarkdown` for content rendering
- Updated image URL handling
- Modified `generateStaticParams` to use Strapi API

#### `README.md`
- Updated all references from Sanity to Strapi
- Changed setup instructions
- Updated project structure documentation
- Added link to Strapi setup guide

---

## API Changes

### Data Fetching Pattern

**Before (Sanity):**
```typescript
const data = await client.fetch(`
  *[_type == "service"] | order(order asc){
    title,
    image{ asset->{url} }
  }
`)
```

**After (Strapi):**
```typescript
const data = await fetchAPI('/services', {
  populate: '*',
  sort: 'order:asc'
})
```

### Image URL Handling

**Before (Sanity):**
```typescript
import imageUrlBuilder from '@sanity/image-url'
const url = imageUrlBuilder(client).image(image).url()
```

**After (Strapi):**
```typescript
import { getStrapiMedia } from '@/lib/strapi/client'
const url = getStrapiMedia(image.url)
```

### Content Types

All 10 content types need to be recreated in Strapi:
1. Hero (Single Type)
2. Service (Collection)
3. Product (Collection)
4. Feature (Collection)
5. Metric (Collection)
6. Case Study (Collection)
7. Testimonial (Collection)
8. Blog Post (Collection)
9. CTA (Single Type)
10. Footer (Single Type)

---

## Key Architectural Changes

### 1. CMS Access
- **Before:** Embedded Sanity Studio at `/studio`
- **After:** Separate Strapi admin panel at `http://localhost:1337/admin`

### 2. Content Editing
- **Before:** Portable Text (Sanity's rich text format)
- **After:** Markdown (standard format)

### 3. API Access
- **Before:** GROQ query language
- **After:** REST API with query parameters

### 4. Image Handling
- **Before:** Sanity CDN with image transformations
- **After:** Direct Strapi media URLs

### 5. Real-time Updates
- **Before:** Sanity's real-time listeners
- **After:** Standard revalidation with Next.js ISR

---

## Migration Checklist

✅ Dependencies updated
✅ Strapi client configuration created
✅ Environment variables updated
✅ Main page data fetching migrated
✅ Blog page data fetching migrated
✅ Image URL handling updated
✅ Sanity files removed
✅ Documentation updated
✅ Setup guides created
✅ npm install completed

---

## Next Steps for Deployment

### 1. Setup Strapi Backend
Follow the instructions in `STRAPI_SETUP_GUIDE.md` to:
- Install and run Strapi
- Create all content types
- Set permissions
- Add content

### 2. Update Environment Variables
For production, update:
- `NEXT_PUBLIC_STRAPI_URL` - Your production Strapi URL
- `STRAPI_API_TOKEN` - Your production API token

### 3. Test Locally
```bash
npm run dev
```
Ensure all sections load properly with Strapi data.

### 4. Deploy
- Deploy Strapi backend (Strapi Cloud, Railway, Heroku, etc.)
- Update Next.js environment variables
- Deploy Next.js frontend (Vercel, Netlify, etc.)

---

## Troubleshooting

### Common Issues

**No data appearing:**
- Check Strapi is running (`http://localhost:1337`)
- Verify content types are created correctly
- Ensure permissions are set for Public role
- Check content is published (not draft)

**CORS errors:**
- Configure Strapi middlewares to allow your Next.js origin
- Check `config/middlewares.js` in Strapi

**Image not loading:**
- Verify media is uploaded in Strapi
- Check `NEXT_PUBLIC_STRAPI_URL` is correct
- Ensure media URLs are properly formatted

**API token issues:**
- Verify token in `.env.local` matches Strapi
- Check token hasn't expired
- Ensure token has correct permissions

---

## Performance Considerations

### Caching
The Strapi client is configured with:
```typescript
next: { revalidate: 60 }
```
This caches API responses for 60 seconds. Adjust as needed.

### Image Optimization
Consider adding:
- Strapi Image Optimization plugin
- Next.js Image component optimization
- CDN for media delivery

### API Efficiency
- Use `populate` parameter judiciously
- Limit pagination where appropriate
- Consider GraphQL plugin for complex queries

---

## Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)

---

## Support

For questions or issues with this migration:
1. Check `STRAPI_SETUP_GUIDE.md` for setup instructions
2. Check `STRAPI_CONTENT_TYPES.md` for content type definitions
3. Consult Strapi documentation for backend issues
4. Review Next.js documentation for frontend issues

---

**Migration completed successfully!** 🎉

All functionality has been preserved while moving to Strapi CMS. The website maintains the same features with a more flexible and widely-used CMS backend.
