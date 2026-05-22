
import { PricingPlan, Service, Project, Testimonial, FAQItem, BlogPost } from './types.ts';

export const SITE_NAME = "RIDDHAAN";
export const WHATSAPP_NUMBER = "919521207156";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'BASIC PLAN',
    price: '₹2,999',
    pages: '3-4 Pages',
    features: [
      'Responsive Design',
      'Simple Custom UI',
      'WhatsApp Integration',
      'Contact Form',
      'Basic SEO Structure',
      'Delivery in 3-5 Days'
    ],
    color: 'border-green-500',
    is_popular: false
  },
  {
    id: 'standard',
    name: 'STANDARD PLAN',
    price: '₹5,999',
    pages: '8-10 Pages',
    features: [
      'Professional Custom Design',
      'Mobile & Desktop Responsive',
      'Easy Admin Panel (CMS)',
      'WhatsApp, Call & Enquiry',
      'SEO-Ready Structure',
      'Fast Loading Speed',
      'Delivery in 7-10 Days'
    ],
    color: 'border-blue-600',
    is_popular: true
  },
  {
    id: 'premium',
    name: 'PREMIUM PLAN',
    price: '₹9,999',
    pages: 'Up to 30 Pages',
    features: [
      'Advanced CMS Controls',
      'Performance Optimization',
      'Enhanced Security',
      'Portfolio Management',
      'Priority Support',
      'Hosting Setup Assistance',
      'Delivery in 14-20 Days'
    ],
    color: 'border-purple-600',
    is_popular: false
  }
];

export const SERVICES: Service[] = [
  {
    id: 'webdev',
    title: 'Custom Website Development',
    description: 'Custom websites built with precision using React, JavaScript & Tailwind — responsive, fast, and tailored to your brand’s unique identity.',
    icon: 'Layout',
    status: 'active'
  },
  {
    id: 'responsive',
    title: 'Mobile-First Design',
    description: 'I design websites prioritizing mobile users first — ensuring seamless responsiveness, fast loading, and flawless UX across all devices.',
    icon: 'Smartphone',
    status: 'active'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    description: 'I build secure, scalable online stores with custom product catalogs, payment gateways, inventory management & mobile‑ready shopping experiences.',
    icon: 'ShoppingCart',
    status: 'active'
  },
  {
    id: 'seo',
    title: 'SEO & Performance',
    description: 'I optimize websites for top search rankings & blazing‑fast loading speeds through technical SEO, code refinement & performance tuning.',
    icon: 'Search',
    status: 'active'
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    description: 'Regular updates, backups, and security checks to keep your business running smooth.',
    icon: 'ShieldCheck',
    status: 'active'
  },
  {
    id: 'cms',
    title: 'CMS Integration',
    description: 'Easy-to-use admin panels allowing you to update text and images without coding.',
    icon: 'Database',
    status: 'active'
  }
];

export const PORTFOLIO_ITEMS: Project[] = [
  {
    id: '1',
    title: 'ReelMaster',
    category: 'Digital Product Selling',
    image: 'https://i.postimg.cc/nhxBXB7z/1000170217.jpg',
    description: 'A clean, trustworthy buying social media grow reels bundle and full costomized and integrat payment gateway.',
    link: 'https://reelmaster.vercel.app/',
    status: 'published',
    project_type: 'real'
  },
  {
    id: '2',
    title: 'PixelSpark',
    category: 'Cafe and Restaurent',
    image: 'https://i.postimg.cc/ryjRr7Pf/a-iss-image-ko-4k-or-h.jpg',
    description: 'A high-end restaurant and cafe management landing page with a modern UI and food ordering simulation.',
    link: 'http://restaurant-cafe-55.netlify.app/',
    status: 'published',
    project_type: 'demo'
  },
  {
    id: '3',
    title: 'LArtiste',
    category: 'Coffee Cafe',
    image: 'https://i.postimg.cc/7YJLftGp/a-iss-image-ko-4k-or-h-(1).jpg',
    description: 'A high-end cafe management landing page with a modern UI and food ordering simulation.',
    link: 'https://artiste-cafe.netlify.app/',
    status: 'published',
    project_type: 'demo'
  },
  {
    id: '4',
    title: 'ApexFinance',
    category: 'Stock Market Institut',
    image: 'https://i.postimg.cc/1RksWLK5/1770310607554-019c2ebb-16e6-7d54-b454-e09efd96cd71.jpg',
    description: 'Ultra-sleek, fast-loading stock market website with stunning dark UI, smooth hover animations, vibrant colors, and mobile-friendly design—eye-catchy yet professional!',
    link: 'https://stock-market-institute.netlify.app/',
    status: 'published',
    project_type: 'demo'
  },
  {
    id: '5',
    title: 'LUXECUTS',
    category: 'Hair cut selon',
    image: 'https://i.postimg.cc/HWSKc86h/a-iss-image-ko-4k-or-h-(2).jpg',
    description: 'Ultra-sleek, fast-loading hair cut website with stunning dark UI, smooth hover animations, vibrant colors, and mobile-friendly design—eye-catchy yet professional!',
    link: 'https://luxecuts-salon.netlify.app/',
    status: 'published',
    project_type: 'demo'
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'ReelMaster',
    role: 'Digital Product Selling',
    content: 'The website has helped me get 30% more small creators. Very professional service!',
    avatar: 'https://i.postimg.cc/BZKX0by0/eh2mxvk9xxrmy0cvkqy9fy3h84.png',
    rating: 5,
    status: 'approved'
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: "How long does it take to build a website?",
    answer: "The timeline depends on the complexity of the project. A basic landing page can be delivered in 3-5 days, while a standard business website takes 7-10 days."
  },
  {
    id: '2',
    question: "Do you provide hosting and domain services?",
    answer: "We assist you in setting up your hosting and domain. While we don't sell them directly, we recommend the best providers based on your budget."
  },
  {
    id: '3',
    question: "Will my website be mobile-responsive?",
    answer: "Absolutely. Every website we build is 'Mobile-First'. It will look and perform flawlessly on smartphones, tablets, and desktops."
  },
  {
    id: '4',
    question: "What is the payment process?",
    answer: "Typically, we work with a 50% advance to start the project and the remaining 50% upon completion and your approval."
  },
  {
    id: '5',
    question: "Do you offer post-launch support?",
    answer: "Yes, we provide free support for a specific duration depending on your plan (15 days to 6 months)."
  }
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog_1',
    title: 'Why Custom React Websites Outperform Drag-and-Drop Builders for Businesses',
    slug: 'custom-react-websites-vs-drag-and-drop-builders',
    excerpt: 'Explore why choosing modern React architectures offers superior speed, customized administrative control, and exceptional long-term business return on investment.',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    category: 'Web Development',
    tags: ['React', 'Web Design', 'Performance', 'Custom Code'],
    read_time: '5 min read',
    published_at: '2026-05-20',
    status: 'published',
    meta_title: 'Custom React Web Development vs Builders | Riddhaan Portfolio',
    meta_description: 'Discover why custom web systems built in React outperform WordPress and generic template builders. Understand speed optimizations and clean rendering pipelines.',
    content: `## The Modern Standard for Digital Infrastructure

When building a digital presence, businesses often face a choice: deploy a quick template on a drag-and-drop builder, or invest in custom development. While generic template builders appear straightforward initially, they frequently introduce severe performance bottlenecks, unminified script blocks, and rigid design limitations that harm your conversion rates over time.

Selecting a custom stack using **React** and **Tailwind CSS** ensures your platform is engineered strictly for speed. Your website loads in milliseconds because it compiles only the code needed for your users—without extraneous plugin overhead. 

### Core Advantages of Custom Development

1. **Lightweight and Fast Loading**: Search engines prioritize load speed. Lightweight code means you achieve high Core Web Vitals rankings, leading to organic market positioning.
2. **Infinite Scalability**: A custom database connection or dynamic client-side state engine can grow effortlessly with your startup, adapting to thousands of daily active users.
3. **Tailored Administration Systems**: Rather than struggling with chaotic legacy backends, custom development allows you to craft focused, elegant control dashboards designed specifically for your daily operations.

## Establishing Real Domain Authority

On the **Riddhaan Portfolio**, every single page is crafted to load immediately, maximizing user engagement. For custom enterprise apps, utilizing secure database layers like Supabase or Firebase guarantees real-time updates and seamless state-level synchronization.

When you invest in custom web architecture, you are not merely hosting static images; you are launching a high-performance commercial engine optimized to convert casual visitors into dedicated clients.`
  },
  {
    id: 'blog_2',
    title: 'How to Build a Modern Portfolio Website That Actually Gets Clients in 2026',
    slug: 'modern-portfolio-website-guide-2026',
    excerpt: 'Learn how to build a fast, SEO-friendly, and modern portfolio website that attracts clients, ranks on Google, and performs well in AI search engines.',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    category: 'Web Development',
    tags: ['Portfolio Website', 'Web Development', 'SEO', 'Next.js', 'Developer Portfolio', 'Performance Optimization'],
    read_time: '8 min read',
    published_at: '2026-05-22',
    status: 'published',
    meta_title: 'Modern Portfolio Website Guide for Developers (2026 SEO + Performance Tips)',
    meta_description: 'Learn how to build a fast, SEO-friendly, and modern portfolio website that attracts clients, ranks on Google, and performs well in AI search engines.',
    content: `Most developers create beautiful portfolio websites but struggle to get real traffic, rankings, or clients.

A portfolio website should do more than showcase projects. It should:
* Rank on Google
* Load fast on mobile
* Build trust
* Convert visitors into clients
* Perform well in AI search engines (GEO)

In this guide, we will cover the exact structure, technologies, SEO setup, and performance techniques used in modern developer portfolios.

---

## Why Every Developer Needs a Portfolio Website

A portfolio website acts as your digital identity. Instead of sending resumes everywhere, your website allows clients and recruiters to instantly:
* View your projects
* Understand your skills
* Contact you directly
* Trust your work

A strong portfolio website also improves your personal branding and creates long-term visibility online.

---

## Best Tech Stack for Modern Portfolio Websites

For 2026, one of the best combinations is:
* **Next.js** / React: Check the official [Next.js Documentation](https://nextjs.org/docs) to learn about routing and static site generation (SSG).
* **TypeScript** for absolute safety
* **Tailwind CSS** for layout styling
* **Framer Motion** for buttery-smooth animations
* **Markdown Blogs** for SEO topical coverage

This stack helps create fast websites, search engine optimization friendly pages, fluid responsive grids, smooth interactives, and pristine mobile Core Web Vitals.

---

## Essential Pages Every Portfolio Website Should Have

### 1. Homepage & Hero Section
Your homepage should clearly explain who you are, what problems you solve, the core tools you specialize in, and call-to-actions to contact you.

### 2. Case-Study Projects
Do not simply upload standard mockups. Detail the problem statement, your technical architecture solution, exact framework libraries, page-speed benchmarks, and search indices results. See the [MDN Web Docs Core Web Vitals Guide](https://developer.mozilla.org/en-US/docs/Glossary/Core_Web_Vitals) to understand key loading milestones like LCP and CLS.

### 3. High-Value Services
Describe specific high-conversion services like Custom web dev, Mobile-First designs, E-Commerce platforms, and Tech SEO performance audits.

### 4. Blog & Article Library
Publishing clear solutions helps capture high-intent organic searches (e.g., "fast loading website guide in Rajasthan") directly to your web presence.

---

## Making Your Technical Stack Search Engine & AI-Friendly

Modern SEO has evolved from basic keyword stuffing into **Generative Engine Optimization (GEO)** to ensure AI platforms (like Google Gemini and OpenAI search engines) can discover and read your portfolio. Review [Google Search Central Guidelines](https://developers.google.com/search/docs/essentials) to ensure your content respects clean indexing structures:

* **Semantic Hierarchy**: Structure code naturally utilizing strict markdown tags (\`H2\` for primary divisions, \`H3\` for detailed cards).
* **Clean Canonical Links**: Use meaningful folder structures instead of query parameters (e.g., \`/blog/react-vs-nextjs\` instead of \`/blog?id=3929\`).
* **OpenGraph Metadata**: Define rich titles, optimized meta descriptions, and custom card thumbnails.

---

## Performance Audits That Matter

Ensure your mobile web scores hit near 100 which you can test directly via the [Google PageSpeed Insights Engine](https://pagespeed.web.dev/):
* Compress assets to modern lightweight extensions like **WebP** or **AVIF**.
* Restrict heavy, non-blocking render animations on small displays.
* Utilize static site generators to cache lightweight builds.

---

## AI Search Engine Optimization (GEO) FAQs

### What is a portfolio website?
A portfolio website showcases your custom client projects, engineering skills, and freelance services in an easily discoverable online folder.

### Why is speed important for technical SEO?
Page loading speeds directly determine visitor dropoffs and mobile crawl scores. Fast React architectures secure much higher authority ranking.`
  }
];

