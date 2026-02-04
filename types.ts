
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  pages: string;
  features: string[];
  is_popular: boolean;
  color?: string;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'hidden';
}

export interface Project {
  id?: string;
  title: string;
  category: string;
  image: string;
  description: string;
  link?: string;
  status: 'published' | 'draft';
  project_type?: 'real' | 'demo';
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  status: 'pending' | 'approved';
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  plan?: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  logo_url: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  footer_text: string;
  seo_description: string;
}

export interface AdminUser {
  id: string;
  email: string;
}
