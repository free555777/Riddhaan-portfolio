
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
    title: 'A Technical Guide to Configuring Google Search Console and Indexing parameters',
    slug: 'technical-seo-checklist-google-search-console-setup',
    excerpt: 'Step-by-step setup parameters to fix indexing anomalies, organize structure maps, and optimize website crawlability for Googlebot.',
    cover_image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800',
    category: 'Technical SEO',
    tags: ['Search Console', 'SEO Guide', 'Crawl Optimization', 'Google Index'],
    read_time: '6 min read',
    published_at: '2026-05-21',
    status: 'published',
    meta_title: 'Configure Google Search Console & Fix Crawl Errors | Riddhaan',
    meta_description: 'An expert engineering guide on setting up index feeds, robots directories, sitemaps, and correcting Google Search Console crawling issues.',
    content: `## Bridging Code Quality and Search Visibility

A beautifully designed website needs to be perfectly visible to indexing spiders. Many developers build modern single-page applications but forget that Google bot crawlers parse raw HTML differently than desktop browsers do. To turn your React architecture into an indexable machine, you must align technical benchmarks with search protocols.

### 1. Initiating proper Google Search Console Settings

Getting your site verified inside **Google Search Console** is your first step. It is your direct control panel to check how crawlers interact with your site:

- **XML Sitemap Registration**: Add a valid \`sitemap.xml\` in your public directory containing absolute clean canonical links.
- **Handling Sandbox Resource Limits**: Googlebot allocates a limited "crawl budget" and small timeout windows for rendering JavaScript pages. If your site queries external APIs or loads heavy fonts, Googlebot may report minor XHR loading warnings. These do not affect your actual ranking, but can be prevented easily by incorporating static pre-rendered HTML fallback skeletons.
- **Validating Touch Targets**: Ensure that all buttons have touch targets of at least 44px to prevent usability errors.

### 2. Crafting Clean Robots.txt Policies

Your root folder must contain a clear \`robots.txt\` file. This document dictates which sections are safe for public indexers and which private dashboards (like your admin login panels) should be kept completely un-indexed:

\`\`\`txt
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://www.riddhaan.in/sitemap.xml
\`\`\`

By ensuring clean semantic hierarchy, utilizing descriptive alt tags for images, and providing direct HTML text pathways, you ensure Google catalogs your custom platform instantly.`
  }
];

