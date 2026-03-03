# Strapi Backend Migration Guide

This project has been migrated from Sanity CMS to Strapi CMS. Below are the instructions to set up and use the Strapi backend.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setting Up Strapi Backend

### Option 1: Local Strapi Installation

1. **Create a new Strapi project** (in a separate directory):
   ```bash
   npx create-strapi-app@latest deepneurax-strapi --quickstart
   ```

2. **Start Strapi**:
   ```bash
   cd deepneurax-strapi
   npm run develop
   ```

3. **Create an admin account** when prompted in the browser (http://localhost:1337/admin)

### Option 2: Use Existing Strapi Instance

If you already have a Strapi instance, skip to the Content Types section.

## Environment Configuration

Update your `.env.local` file with your Strapi configuration:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token-here
```

### Getting Your API Token

1. Go to Strapi Admin Panel: http://localhost:1337/admin
2. Navigate to Settings → API Tokens
3. Click "Create new API Token"
4. Name it (e.g., "Next.js Frontend")
5. Set Token type to "Read-only" or "Full access"
6. Set Token duration to "Unlimited"
7. Copy the token and add it to your `.env.local`

## Content Types to Create in Strapi

Create the following collection types in Strapi Admin Panel (Settings → Content-Types Builder):

### 1. Hero
- **Type**: Single Type
- **Fields**:
  - title (Text)
  - tagline (Text)
  - description (Rich Text)
  - primaryButtonText (Text)
  - primaryButtonLink (Text)
  - secondaryButtonText (Text)
  - secondaryButtonLink (Text)
  - backgroundImage (Media - Single)
  - overlayColor (Text)
  - titleColor (Text)
  - textColor (Text)
  - primaryButtonColor (Text)
  - secondaryButtonColor (Text)

### 2. Service
- **Type**: Collection Type
- **Fields**:
  - title (Text)
  - icon (Text)
  - image (Media - Single)
  - description (Text)
  - link (Text)
  - order (Number)
  - cardBackgroundColor (Text)
  - borderColor (Text)
  - titleColor (Text)
  - textColor (Text)

### 3. Product
- **Type**: Collection Type
- **Fields**:
  - name (Text)
  - icon (Text)
  - image (Media - Single)
  - description (Text)
  - link (Text)
  - order (Number)
  - cardBackgroundColor (Text)
  - borderColor (Text)
  - titleColor (Text)
  - textColor (Text)

### 4. Feature
- **Type**: Collection Type
- **Fields**:
  - title (Text)
  - icon (Text)
  - image (Media - Single)
  - description (Text)
  - order (Number)
  - cardBackgroundColor (Text)
  - borderColor (Text)
  - titleColor (Text)
  - textColor (Text)

### 5. Metric
- **Type**: Collection Type
- **Fields**:
  - label (Text)
  - value (Number)
  - suffix (Text)
  - icon (Text)
  - order (Number)
  - sectionBackgroundColor (Text)
  - cardBackgroundColor (Text)
  - borderColor (Text)
  - numberColor (Text)
  - labelColor (Text)

### 6. Case Study
- **Type**: Collection Type
- **API ID**: case-study
- **Fields**:
  - title (Text)
  - description (Text)
  - metrics (JSON)
  - link (Text)
  - order (Number)

### 7. Testimonial
- **Type**: Collection Type
- **Fields**:
  - text (Rich Text)
  - author (Text)
  - role (Text)
  - avatar (Media - Single)
  - order (Number)

### 8. Blog Post
- **Type**: Collection Type
- **API ID**: blog-post
- **Fields**:
  - title (Text)
  - slug (UID - attached to title)
  - publishedAt (Date)
  - excerpt (Text)
  - coverImage (Media - Single)
  - tags (JSON)
  - content (Rich Text - use Markdown)
  - author (Text)

### 9. CTA
- **Type**: Single Type
- **Fields**:
  - title (Text)
  - subtitle (Text)
  - buttonText (Text)
  - buttonLink (Text)

### 10. Footer
- **Type**: Single Type
- **Fields**:
  - companyDescription (Text)
  - socialLinks (JSON)
  - contactEmail (Email)
  - contactPhone (Text)
  - address (Text)
  - copyrightText (Text)

## Permissions Setup

Make sure to set proper permissions for public access:

1. Go to Settings → Roles → Public
2. Enable the following permissions for each content type:
   - find (to fetch all records)
   - findOne (to fetch single records)

## Installing Dependencies

Run the following command to install the new dependencies:

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

## Key Changes from Sanity

### API Differences

- **Sanity**: Used GROQ queries
- **Strapi**: Uses REST API with query parameters

### Image Handling

- **Sanity**: Used `@sanity/image-url` for image URLs
- **Strapi**: Images are accessed via `STRAPI_URL + image.url`

### Content Editing

- **Sanity**: Embedded studio at `/studio`
- **Strapi**: Separate admin panel at `http://localhost:1337/admin`

### Rich Text

- **Sanity**: Used Portable Text
- **Strapi**: Uses Markdown (rendered with react-markdown)

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Go to Strapi config/middlewares.js
2. Update the CORS settings to allow your Next.js origin

### API Token Issues
If API calls fail:
1. Verify your token in `.env.local`
2. Check token permissions in Strapi admin
3. Ensure the token hasn't expired

### Missing Content
If content doesn't appear:
1. Verify content types are created correctly
2. Check permissions (Settings → Roles → Public)
3. Ensure content is published (not in draft)

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
