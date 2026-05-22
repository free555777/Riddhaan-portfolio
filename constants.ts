
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
    title: 'How to Choose the Best Full Stack Web Developer in Sri Ganganagar & Jaipur',
    slug: 'choose-best-full-stack-developer-sri-ganganagar-jaipur',
    excerpt: 'Looking for a professional developer? Learn how to hire a top-tier freelance devloper or website builder in Sri Ganganagar, Jaipur, or anywhere in India.',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    category: 'Web Development',
    tags: ['Full Stack', 'Sri Ganganagar', 'Jaipur', 'Riddhan Portfolio'],
    read_time: '6 min read',
    published_at: '2026-05-20',
    status: 'published',
    meta_title: 'Full Stack Developer in Sri Ganganagar & Jaipur | Freelance Web Creator',
    meta_description: 'Discover how to hire the best full stack developer in Sri Ganganagar or Jaipur. Read about Riddhan Portfolio webcite design, cost-effective frameworks, and smart custom layouts.',
    content: `## Finding a Competent Full Stack Developer in Sri Ganganagar, Rajasthan

In the digital era, building a premium custom website isn't just about matching static templates anymore—it is about clean server rendering pipelines, mobile fluid interactions, and absolute speed. If you have been searching Google for a high-quality **Full Stack Developer in sri ganganagar** or a **webcite designer jaipur**, you are striving to build a platform that attracts real traffic.

Many fast-growing startups face difficulty securing top-tier engineering talent locally. Often, searches are typed with minor typos—such as searching for a *freelance web devloper*, looking up *Ridhaan Web Developer*, or browsing *Riddhan Portfolio* items. Regardless of spelling, the core requirement is identical: you need someone who understands native frontend systems, handles relational databases, and configures modern web structures.

For custom projects, we recommend learning more through official specifications such as [Mozilla Developer Network (MDN) Web Docs](https://developer.mozilla.org/en-US/) to understand the standards behind responsive grid structures and fast JavaScript execution.

## The Synergy of React and Custom CMS Structures

When evaluating professional builders, a common question is whether you should utilize generic builders like WordPress or select dedicated components. A customized system guarantees that there are no un-minified script blocks clogging up the browser thread.

As demonstrated on the **Riddhan Portfolio**, choosing a React and Tailwind CSS environment permits blazing-fast cold starts and optimized layout paint metrics. Adding a robust fallback system (using localStorage or Supabase relational tables) permits perfect admin panels where business owners can modify textual components instantly without needing any coding expertise.

## How Local Businesses Can Drive Organic Conversions

Whether you operate a digital product catalog in Jaipur or an agricultural trade network in Sri Ganganagar, your website should double as a continuous customer acquisition pipeline.

1. **Perfect Screen Responsiveness**: Ensure that touch targets on mobile layouts cover a minimum of 48px to keep engagement high.
2. **Speed-First Compression**: Make sure to optimize images or load fallback static layouts to achieve instant paint.
3. **Structured Local Schemas**: Load valid JSON-LD schemas so search engines recognize your primary address, contact phone lines, and service products instantly.

If you are looking to kickstart your next customized business project with an expert freelance professional, exploring **Riddhaan** web solutions with secure API pipelines will provide you with a stellar competitive advantage.`
  },
  {
    id: 'blog_2',
    title: 'The Ultimate SEO Checklist for Business Websites: goggle search cansole & Technical Setup',
    slug: 'ultimate-seo-checklist-google-search-console-technical-setup_seo',
    excerpt: 'Demystifying technical SEO for startups. Learn the secrets behind proper meta structures, crawlable files, and complete search console parameters.',
    cover_image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800',
    category: 'SEO Expert',
    tags: ['SEO Expert', 'Search Console', 'Technical SEO', 'Index Optimization'],
    read_time: '8 min read',
    published_at: '2026-05-18',
    status: 'published',
    meta_title: 'Ultimate Technical SEO Checklist & Google Console Guide',
    meta_description: 'An expert-guided SEO checklist covering responsive markup, robots crawling maps, and proper configuration in the Google Search suite for local startups.',
    content: `## Demystifying Advanced Technical SEO & Web Positioning

Many builders construct beautiful creative portfolios but wonder why they do not appear on search result pages. The secret lies in technical search engine optimization (SEO). Google spider bots analyze structural parameters—like proper meta representations, optimized image weights, semantic markup, and the ratio of H2 tags to plain text.

If you are seeking support from a **low budget website maker** or are looking for a certified **SEO Expert** or *seo expret*, setting up your foundations correctly is the single most vital investment.

To ensure your web architectures adhere to appropriate standards, you should always consult the official [Google Search Central Webmaster Guidelines](https://developers.google.com/search/docs/essential/webmaster-guideline) to keep your links authentic and avoid spam penalties.

## Integrating Google Search Console & XML Layout Maps

The very first action after custom deployment is initiating a **goggle search cansole setup** (properly known as Google Search Console). 

- **Check Robots Permissions**: Ensure that a valid \`robots.txt\` is published in your root folder listing the location of your XML index feeds.
- **Provide Custom HTML Maps**: An elegant, readable \`sitemap.html\` allows bot crawlers and real human readers to navigate your complete folder architecture in one click.
- **Resolve Spelling Mistakes Phonetical Association**: By listing phonetic synonyms like *riddhan*, *ridhan*, or *freelancer developer*, search schemas naturally help crawlers resolve spelling variations back to your top landing pages.

## Real Balance: Headings vs Plain Text

Search engine algorithms evaluate structural formatting. Placing keywords unnaturally into raw HTML layouts is called "keyword stuffing" and gets heavily penalized. Instead, weave them elegantly into logical article segments:

- **H2 Headers**: Introduce topics using natural terminology (e.g. "Practical SEO Expret Support" or "Custom Interface Design").
- **Quality External Links**: Connect your content to authenticated directories of high domain rank (like Schema.org schemas or MDN reference sheets).

By keeping layouts clear, fast, and structured, you guarantee maximum search engine visibility and top-tier customer trust.`
  }
];

