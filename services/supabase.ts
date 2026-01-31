
import { createClient } from '@supabase/supabase-js';
import { SiteSettings, PricingPlan, Service, Project, Testimonial, Inquiry } from '../types';

// Using provided credentials as defaults
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gajyeusnyawrpdcjveov.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5TufyblCS0IUUvxA_OqB5g_iDnarZpp';

export const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/**
 * SITE SETTINGS
 */
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error) return null;
  return data;
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  if (!supabase) return;
  const { error } = await supabase.from('site_settings').update(settings).eq('id', settings.id);
  if (error) throw error;
};

/**
 * SERVICES
 */
export const getServices = async (): Promise<Service[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
  if (error) return [];
  return data;
};

export const upsertService = async (service: Partial<Service>) => {
  if (!supabase) return;
  const { error } = await supabase.from('services').upsert(service);
  if (error) throw error;
};

export const deleteService = async (id: string) => {
  if (!supabase) return;
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
};

/**
 * PORTFOLIO
 */
export const getPortfolio = async (): Promise<Project[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('portfolio').select('*').order('id', { ascending: false });
  if (error) return [];
  return data;
};

export const upsertProject = async (project: Partial<Project>) => {
  if (!supabase) return;
  const { error } = await supabase.from('portfolio').upsert(project);
  if (error) throw error;
};

export const deleteProject = async (id: string) => {
  if (!supabase) return;
  const { error } = await supabase.from('portfolio').delete().eq('id', id);
  if (error) throw error;
};

/**
 * TESTIMONIALS
 */
export const getTestimonials = async (): Promise<Testimonial[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('testimonials').select('*').order('id', { ascending: false });
  if (error) return [];
  return data;
};

export const upsertTestimonial = async (testimonial: Partial<Testimonial>) => {
  if (!supabase) return;
  const { error } = await supabase.from('testimonials').upsert(testimonial);
  if (error) throw error;
};

export const deleteTestimonial = async (id: string) => {
  if (!supabase) return;
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
};

/**
 * INQUIRIES
 */
export const getInquiries = async (): Promise<Inquiry[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data;
};

export const deleteInquiry = async (id: string) => {
  if (!supabase) return;
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
};

export const submitInquiry = async (formData: any) => {
  if (supabase) {
    const { error: dbError } = await supabase.from('inquiries').insert([{
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      plan: formData.plan
    }]);

    if (dbError) throw dbError;

    try {
      await supabase.functions.invoke('send-inquiry-email', {
        body: formData
      });
    } catch (e) {
      console.warn("Email function failed - expected if not deployed.");
    }
  }
  return true;
};

/**
 * PRICING
 */
export const getPricingPlans = async (): Promise<PricingPlan[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('pricing_plans').select('*').order('id', { ascending: true });
  if (error) return [];
  return data;
};

/**
 * AUTH
 */
export const adminLogin = async (email: string, pass: string) => {
  if (email === 'riddhaan@gmail.com' && pass === 'Riddhaan@55') {
    localStorage.setItem('admin_token', 'demo_token_riddhaan');
    return { success: true };
  }
  return { success: false };
};

export const isAdminLoggedIn = () => {
  return !!localStorage.getItem('admin_token');
};

export const logoutAdmin = () => {
  localStorage.removeItem('admin_token');
};
