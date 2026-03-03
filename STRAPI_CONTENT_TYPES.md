# Strapi Content Types JSON Export

This file contains the JSON schema for all content types that need to be created in Strapi. You can use these as reference when creating content types manually, or import them if your Strapi version supports it.

## API Endpoints Reference

Once content types are created, your API endpoints will be:

- `GET /api/heroes` - Hero section (single type, use pagination: { limit: 1 })
- `GET /api/services` - Services list
- `GET /api/products` - Products list
- `GET /api/features` - Features list
- `GET /api/why-choose-us` - Why Choose Us section (single type, use pagination: { limit: 1 })
- `GET /api/metrics` - Metrics counters
- `GET /api/case-studies` - Case studies
- `GET /api/testimonials` - Testimonials
- `GET /api/blog-posts` - Blog posts
- `GET /api/ctas` - CTA section (single type, use pagination: { limit: 1 })
- `GET /api/footers` - Footer (single type, use pagination: { limit: 1 })

## Query Parameters Example

```javascript
// Fetch with population and sorting
fetchAPI('/services', {
  populate: '*',
  sort: 'order:asc',
  pagination: { limit: 10 }
})

// Fetch specific blog post by slug
fetchAPI('/blog-posts', {
  filters: { slug: { $eq: 'my-post-slug' } },
  populate: '*',
  pagination: { limit: 1 }
})
```

## Field Types Mapping

When creating content types in Strapi:

| Our Field Type | Strapi Field Type | Notes |
|---------------|-------------------|-------|
| Text | Text (Short text) | Default max 255 chars |
| Rich Text | Rich Text (Markdown) | Use Markdown editor |
| Number | Number (Integer) | For metrics, order fields |
| Media | Media (Single) | For images/videos |
| JSON | JSON | For complex data like tags, social links |
| Email | Email | For email addresses |
| UID | UID | Attached to title for slugs |
| Date | Date | For publishedAt |

## Content Type Details

### 1. Hero (Single Type)
**API ID:** `hero`

**Fields:**
```json
{
  "title": "Text",
  "tagline": "Text",
  "description": "Rich Text",
  "primaryButtonText": "Text",
  "primaryButtonLink": "Text",
  "secondaryButtonText": "Text",
  "secondaryButtonLink": "Text",
  "backgroundImage": "Media (Single)",
  "overlayColor": "Text",
  "titleColor": "Text",
  "textColor": "Text",
  "primaryButtonColor": "Text",
  "secondaryButtonColor": "Text"
}
```

### 2. Service (Collection Type)
**API ID:** `service`

**Fields:**
```json
{
  "title": "Text (Required)",
  "icon": "Text",
  "image": "Media (Single)",
  "description": "Text (Long text)",
  "link": "Text",
  "order": "Number (Integer)",
  "cardBackgroundColor": "Text",
  "borderColor": "Text",
  "titleColor": "Text",
  "textColor": "Text"
}
```

### 3. Product (Collection Type)
**API ID:** `product`

**Fields:**
```json
{
  "name": "Text (Required)",
  "icon": "Text",
  "image": "Media (Single)",
  "description": "Text (Long text)",
  "link": "Text",
  "order": "Number (Integer)",
  "cardBackgroundColor": "Text",
  "borderColor": "Text",
  "titleColor": "Text",
  "textColor": "Text"
}
```

### 4. Feature (Collection Type)
**API ID:** `feature`

**Fields:**
```json
{
  "title": "Text (Required)",
  "icon": "Text",
  "image": "Media (Single)",
  "description": "Text (Long text)",
  "order": "Number (Integer)",
  "cardBackgroundColor": "Text",
  "borderColor": "Text",
  "titleColor": "Text",
  "textColor": "Text"
}
```

### 4a. Why Choose Us (Single Type)
**API ID:** `why-choose-us`

**Fields:**
```json
{
  "sectionTitle": "Text (Required)",
  "sectionDescription": "Text (Long text)",
  "items": "Component (Repeatable)"
}
```

**Component Name:** `why-choose-us-item`
**Component Fields:**
```json
{
  "title": "Text (Required)",
  "description": "Text (Long text, Required)",
  "image": "Media (Single, Required)",
  "link": "Text",
  "order": "Number (Integer)"
}
```

**Example Data:**
```json
{
  "sectionTitle": "Why Choose Us",
  "sectionDescription": "We deliver exceptional results through innovation, expertise, and dedication",
  "items": [
    {
      "title": "24/7 Support",
      "description": "Round-the-clock assistance whenever you need it",
      "image": {...},
      "link": "/support",
      "order": 1
    },
    {
      "title": "Innovation First",
      "description": "Cutting-edge solutions for modern challenges",
      "image": {...},
      "link": "/innovation",
      "order": 2
    }
  ]
}
```

### 5. Metric (Collection Type)
**API ID:** `metric`

**Fields:**
```json
{
  "label": "Text (Required)",
  "value": "Number (Integer, Required)",
  "suffix": "Text",
  "icon": "Text",
  "order": "Number (Integer)",
  "sectionBackgroundColor": "Text",
  "cardBackgroundColor": "Text",
  "borderColor": "Text",
  "numberColor": "Text",
  "labelColor": "Text"
}
```

### 6. Case Study (Collection Type)
**API ID:** `case-study`

**Fields:**
```json
{
  "title": "Text (Required)",
  "description": "Text (Long text)",
  "metrics": "JSON",
  "link": "Text",
  "order": "Number (Integer)"
}
```

**Metrics JSON Example:**
```json
[
  { "label": "Revenue Growth", "value": "300%" },
  { "label": "Time Saved", "value": "40h/week" }
]
```

### 7. Testimonial (Collection Type)
**API ID:** `testimonial`

**Fields:**
```json
{
  "text": "Rich Text (Required)",
  "author": "Text (Required)",
  "role": "Text",
  "avatar": "Media (Single)",
  "order": "Number (Integer)"
}
```

### 8. Blog Post (Collection Type)
**API ID:** `blog-post`

**Fields:**
```json
{
  "title": "Text (Required)",
  "slug": "UID (Required, attached to title)",
  "publishedAt": "Date",
  "excerpt": "Text (Long text)",
  "coverImage": "Media (Single)",
  "tags": "JSON",
  "content": "Rich Text (Markdown)",
  "author": "Text"
}
```

**Tags JSON Example:**
```json
["AI", "Machine Learning", "Technology"]
```

### 9. CTA (Single Type)
**API ID:** `cta`

**Fields:**
```json
{
  "title": "Text (Required)",
  "subtitle": "Text",
  "buttonText": "Text (Required)",
  "buttonLink": "Text (Required)"
}
```

### 10. Footer (Single Type)
**API ID:** `footer`

**Fields:**
```json
{
  "companyDescription": "Text (Long text)",
  "socialLinks": "JSON",
  "contactEmail": "Email",
  "contactPhone": "Text",
  "address": "Text (Long text)",
  "copyrightText": "Text"
}
```

**Social Links JSON Example:**
```json
[
  { "platform": "LinkedIn", "url": "https://linkedin.com/company/deepneurax" },
  { "platform": "Twitter", "url": "https://twitter.com/deepneurax" }
]
```

## Creating Content Types Step-by-Step

1. Open Strapi Admin Panel: http://localhost:1337/admin
2. Go to **Content-Type Builder** (in the left sidebar)
3. Click **"+ Create new collection type"** or **"+ Create new single type"**
4. Enter the API ID (use lowercase with hyphens)
5. Click **"Continue"**
6. Add fields one by one using the **"+ Add another field"** button
7. Select the field type and configure options
8. Click **"Finish"** when all fields are added
9. Click **"Save"** to create the content type
10. Strapi will restart automatically

## Setting Permissions

After creating all content types:

1. Go to **Settings → Roles → Public**
2. For each content type, enable:
   - ✅ `find` (to fetch all records)
   - ✅ `findOne` (to fetch single records)
3. Click **"Save"**

## Data Migration

If you have existing data from Sanity:

1. Export data from Sanity
2. Transform the data format to match Strapi's structure
3. Import via Strapi's REST API or admin interface
4. Upload media files separately through Strapi's Media Library

## Testing the API

You can test your Strapi API using:

```bash
# Get all services
curl http://localhost:1337/api/services?populate=*

# Get hero data
curl http://localhost:1337/api/heroes?populate=*
```

Or use tools like Postman or Insomnia for a better testing experience.
