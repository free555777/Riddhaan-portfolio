
import { PricingPlan, Service, Project, Testimonial, FAQItem } from './types';

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
