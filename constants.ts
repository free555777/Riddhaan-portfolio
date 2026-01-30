import { PricingPlan, Service, Project, Testimonial } from './types';
import { Layout, Smartphone, ShoppingCart, ShieldCheck, Search, Database } from 'lucide-react';

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
    // Fix: Change isPopular to is_popular to match PricingPlan interface
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
    // Fix: Change isPopular to is_popular to match PricingPlan interface
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
    // Fix: Change isPopular to is_popular to match PricingPlan interface
    is_popular: false
  }
];

export const SERVICES: Service[] = [
  {
    id: 'webdev',
    title: 'Custom Website Development',
    description: 'Custom websites built with precision using React, JavaScript & Tailwind — responsive, fast, and tailored to your brand’s unique identity.',
    icon: 'Layout',
    // Fix: Add missing status property
    status: 'active'
  },
  {
    id: 'responsive',
    title: 'Mobile-First Design',
    description: 'I design websites prioritizing mobile users first — ensuring seamless responsiveness, fast loading, and flawless UX across all devices.',
    icon: 'Smartphone',
    // Fix: Add missing status property
    status: 'active'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    description: 'I build secure, scalable online stores with custom product catalogs, payment gateways, inventory management & mobile‑ready shopping experiences.',
    icon: 'ShoppingCart',
    // Fix: Add missing status property
    status: 'active'
  },
  {
    id: 'seo',
    title: 'SEO & Performance',
    description: 'I optimize websites for top search rankings & blazing‑fast loading speeds through technical SEO, code refinement & performance tuning.',
    icon: 'Search',
    // Fix: Add missing status property
    status: 'active'
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    description: 'Regular updates, backups, and security checks to keep your business running smooth.',
    icon: 'ShieldCheck',
    // Fix: Add missing status property
    status: 'active'
  },
  {
    id: 'cms',
    title: 'CMS Integration',
    description: 'Easy-to-use admin panels allowing you to update text and images without coding.',
    icon: 'Database',
    // Fix: Add missing status property
    status: 'active'
  }
];

export const PORTFOLIO_ITEMS: Project[] = [
  {
    id: '1',
    title: 'ReelMaster',
    category: 'Digital Product Selling',
    // Replaced with user provided link
    image: 'https://i.postimg.cc/nhxBXB7z/1000170217.jpg',
    description: 'A clean, trustworthy buying social media grow reels bundle and full costomized and integrat payment gateway.',
    link: 'https://reelmaster.vercel.app/',
    // Fix: Add missing status property
    status: 'published'
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'ReelMaster',
    role: 'Digital Product Selling',
    content: 'The website has helped me get 30% more small creators. Very professional service!',
    avatar: 'https://i.postimg.cc/BZKX0by0/eh2mxvk9xxrmy0cvkqy9fy3h84.png',
    // Fix: Add missing rating and status properties
    rating: 5,
    status: 'approved'
  },
  
];