# How to Add Dummy Data to Your Website

You have two options to add sample data:

## Option 1: Run the Seed Script (Automated)

### Step 1: Get Your Sanity API Token
1. Go to https://www.sanity.io/manage
2. Select your project (ga39dqv2)
3. Go to **API** → **Tokens**
4. Click **Add API token**
5. Name it "Seed Token"
6. Set permissions to **Editor**
7. Copy the token

### Step 2: Add Token to .env.local
Add this line to your `.env.local` file:
```
SANITY_API_TOKEN=your_token_here
```

### Step 3: Run the Seed Script
```bash
cd deepneurax-website
npx tsx scripts/seed-data.ts
```

This will automatically create:
- ✅ Hero Section with sample text
- ✅ 6 Services (AI Consulting, ML, Computer Vision, etc.)
- ✅ 3 Products (NeuraxVision, DeepChat, PredictX)
- ✅ 4 Features
- ✅ 4 Metrics (500+ Clients, 99% Success Rate, etc.)
- ✅ 2 Case Studies
- ✅ 3 Testimonials
- ✅ 2 Blog Posts
- ✅ CTA Section
- ✅ Footer with contact info

---

## Option 2: Add Data Manually in Sanity Studio

### Step 1: Access Sanity Studio
Go to: http://localhost:3000/studio

### Step 2: Add Hero Section
1. Click **"Hero Section"**
2. Fill in:
   - Title: "Transform Your Business with AI"
   - Tagline: "Cutting-Edge Neural Networks & Deep Learning"
   - Description: "We deliver enterprise-grade AI solutions..."
   - Primary Button Text: "Get Started"
   - Primary Button Link: "#contact"
   - Secondary Button Text: "View Services"
   - Secondary Button Link: "#services"
3. Add 2-5 background video URLs (optional)
4. Click **Publish**

### Step 3: Add Services (Create 3-6 items)
1. Click **"Services"** → **Create new**
2. Example Service:
   - Title: "AI Consulting"
   - Icon: 🤖
   - Description: "Strategic guidance to implement AI solutions"
   - Link: "/services/ai-consulting"
   - Order: 1
3. Repeat for other services
4. Click **Publish** for each

### Step 4: Add Products (Create 2-3 items)
1. Click **"Products"** → **Create new**
2. Example:
   - Name: "NeuraxVision Pro"
   - Icon: 📸
   - Description: "Computer vision platform"
   - Order: 1
3. Click **Publish**

### Step 5: Add Features (Create 4 items)
1. Click **"Features"** → **Create new**
2. Example:
   - Title: "Scalable Infrastructure"
   - Icon: ☁️
   - Description: "Cloud-native architecture"
3. Click **Publish**

### Step 6: Add Metrics (Create 4 items)
1. Click **"Metrics"** → **Create new**
2. Example:
   - Label: "Satisfied Clients"
   - Value: 500
   - Suffix: "+"
   - Icon: 😊
3. Click **Publish**

### Step 7: Add Case Studies (Create 2 items)
1. Click **"Case Studies"** → **Create new**
2. Example:
   - Title: "E-Commerce Giant Increases Sales by 40%"
   - Description: "Implemented AI-powered recommendation engine"
   - Add metrics array with results
3. Click **Publish**

### Step 8: Add Testimonials (Create 3 items)
1. Click **"Testimonials"** → **Create new**
2. Example:
   - Text: "DeepNeurax transformed our business operations..."
   - Author: "Sarah Johnson"
   - Role: "CTO"
   - Company: "TechCorp International"
3. Click **Publish**

### Step 9: Add Blog Posts (Create 2-3 items)
1. Click **"Blog Posts"** → **Create new**
2. Example:
   - Title: "The Future of AI in 2025"
   - Slug: "future-of-ai-2025"
   - Excerpt: "Explore the latest trends..."
   - Tags: AI, Trends, Technology
3. Click **Publish**

### Step 10: Add CTA Section
1. Click **"CTA Section"**
2. Fill in:
   - Title: "Ready to Transform Your Business?"
   - Subtitle: "Join hundreds of companies..."
   - Button Text: "Get Started"
   - Button Link: "#contact"
3. Click **Publish**

### Step 11: Add Footer
1. Click **"Footer"**
2. Fill in:
   - Company Name: "DeepNeurax Technologies"
   - Email: "contact@deepneurax.com"
   - Phone: "+1 (555) 123-4567"
   - Add social links, footer links, etc.
3. Click **Publish**

---

## After Adding Data

1. **Refresh your website**: http://localhost:3000
2. All sections should now display with sample content
3. You can edit any content in Sanity Studio anytime
4. Changes appear immediately after publishing

---

## Tips

- Start with Option 1 (seed script) for fastest setup
- Use Option 2 if you want full control over content
- You can mix both: seed first, then customize in Studio
- Remember to **Publish** after making changes in Studio
