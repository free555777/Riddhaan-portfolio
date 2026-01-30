
import { createClient } from '@supabase/supabase-js';
import { SiteSettings, PricingPlan, Service, Project, Testimonial, Inquiry } from '../types';

// Using provided credentials as defaults
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gajyeusnyawrpdcjveov.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5TufyblCS0IUUvxA_OqB5g_iDnarZpp';

export const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/**
 * GENERIC FETCHERS
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

export const getPricingPlans = async (): Promise<PricingPlan[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('pricing_plans').select('*').order('price', { ascending: true });
  if (error) return [];
  return data;
};

export const getServices = async (): Promise<Service[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('services').select('*').eq('status', 'active');
  if (error) return [];
  return data;
};

export const getPortfolio = async (): Promise<Project[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('portfolio').select('*').eq('status', 'published');
  if (error) return [];
  return data;
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('testimonials').select('*').eq('status', 'approved');
  if (error) return [];
  return data;
};

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
  console.log("Submitting inquiry:", formData);
  
  if (supabase) {
    // 1. Insert into Database
    const { error: dbError } = await supabase.from('inquiries').insert([{
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      plan: formData.plan
    }]);

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    // 2. Trigger Edge Function (using official SDK method)
    // The .invoke() method handles headers, apiKey, and base URL automatically.
    const { data, error: funcError } = await supabase.functions.invoke('send-inquiry-email', {
      body: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      }
    });

    if (funcError) {
      console.error("Edge Function call failed:", funcError);
      // NOTE: "Failed to fetch" often means your Edge Function is missing CORS headers 
      // or the URL is incorrect. Using .invoke() helps ensure the URL is correct.
      throw new Error(`DB saved, but notification failed: ${funcError.message || 'CORS or Network Error'}`);
    }
  } else {
    // Fallback for local testing if Supabase isn't reachable
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return true;
};

/**
 * AUTH HELPERS
 */
export const adminLogin = async (email: string, pass: string) => {
  // Demo check for specified credentials as requested
  if (email === 'riddhaan@gmail.com' && pass === 'Riddhaan@55') {
    localStorage.setItem('admin_token', 'demo_token_riddhaan');
    return { success: true };
  }
  
  if (!supabase) return { success: false, error: 'Supabase not connected' };
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: pass,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, user: data.user };
};

export const isAdminLoggedIn = () => {
  return !!localStorage.getItem('admin_token');
};

export const logoutAdmin = () => {
  localStorage.removeItem('admin_token');
  window.location.hash = '#home';
};
