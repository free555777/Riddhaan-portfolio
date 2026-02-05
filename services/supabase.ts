
import { createClient } from '@supabase/supabase-js';
import { SiteSettings, PricingPlan, Service, Project, Testimonial, Inquiry, FAQItem } from '../types';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gajyeusnyawrpdcjveov.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5TufyblCS0IUUvxA_OqB5g_iDnarZpp';

export const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const localDB = {
  get: (key: string) => {
    const data = localStorage.getItem(`riddhaan_db_${key}`);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, data: any) => {
    localStorage.setItem(`riddhaan_db_${key}`, JSON.stringify(data));
  },
  // New helper to update an item in a local array
  upsertItem: (key: string, item: any) => {
    const data = localDB.get(key) || [];
    const index = data.findIndex((i: any) => i.id === item.id);
    if (index > -1) {
      data[index] = { ...data[index], ...item };
    } else {
      // If no ID, generate a temporary one
      if (!item.id) item.id = `local_${Date.now()}`;
      data.unshift(item);
    }
    localDB.set(key, data);
  },
  // New helper to remove an item from a local array
  removeItem: (key: string, id: string) => {
    const data = localDB.get(key) || [];
    const filtered = data.filter((i: any) => i.id !== id);
    localDB.set(key, filtered);
  }
};

const handleRequest = async (tableName: string, operation: () => Promise<any>, fallbackData: any = []) => {
  try {
    if (!supabase) throw new Error("No Supabase connection");
    const result = await operation();
    if (result.error) {
      console.error(`Supabase error for ${tableName}:`, result.error);
      // Always fallback to local storage if there's an error
      return localDB.get(tableName) || fallbackData;
    }
    if (result.data && Array.isArray(result.data)) {
      localDB.set(tableName, result.data);
    }
    return result.data;
  } catch (err) {
    console.error(`Critical error for ${tableName}:`, err);
    return localDB.get(tableName) || fallbackData;
  }
};

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error) return localDB.get('site_settings');
  return data;
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  const current = localDB.get('site_settings') || {};
  localDB.set('site_settings', { ...current, ...settings });
  if (!supabase) return;
  await supabase.from('site_settings').upsert(settings);
};

export const getServices = async (): Promise<Service[]> => {
  return handleRequest('services', async () => await supabase!.from('services').select('*').order('id', { ascending: true }));
};

export const upsertService = async (service: Partial<Service>) => {
  localDB.upsertItem('services', service);
  if (!supabase) return;
  const { error } = await supabase.from('services').upsert(service);
  if (error) console.warn("Supabase Sync Failed (RLS/Auth): Saving locally only.");
};

export const deleteService = async (id: string) => {
  localDB.removeItem('services', id);
  if (!supabase) return;
  await supabase.from('services').delete().eq('id', id);
};

export const getPortfolio = async (): Promise<Project[]> => {
  return handleRequest('portfolio', async () => await supabase!.from('portfolio').select('*').order('id', { ascending: false }));
};

export const upsertProject = async (project: Partial<Project>) => {
  localDB.upsertItem('portfolio', project);
  if (!supabase) return;
  const { error } = await supabase.from('portfolio').upsert(project);
  if (error) {
    console.warn("Supabase Sync Failed (RLS/Auth): Saving locally only.", error);
    // We don't throw error here so the UI thinks it succeeded locally
  }
};

export const deleteProject = async (id: string) => {
  localDB.removeItem('portfolio', id);
  if (!supabase) return;
  await supabase.from('portfolio').delete().eq('id', id);
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  return handleRequest('testimonials', async () => await supabase!.from('testimonials').select('*').order('id', { ascending: false }));
};

export const upsertTestimonial = async (testimonial: Partial<Testimonial>) => {
  localDB.upsertItem('testimonials', testimonial);
  if (!supabase) return;
  const { error } = await supabase.from('testimonials').upsert(testimonial);
  if (error) console.warn("Supabase Sync Failed locally only.");
};

export const deleteTestimonial = async (id: string) => {
  localDB.removeItem('testimonials', id);
  if (!supabase) return;
  await supabase.from('testimonials').delete().eq('id', id);
};

export const getFAQs = async (): Promise<FAQItem[]> => {
  return handleRequest('faqs', async () => await supabase!.from('faqs').select('*').order('id', { ascending: true }));
};

export const upsertFAQ = async (faq: Partial<FAQItem>) => {
  localDB.upsertItem('faqs', faq);
  if (!supabase) return;
  const { error } = await supabase.from('faqs').upsert(faq);
  if (error) console.warn("Supabase Sync Failed locally only.");
};

export const deleteFAQ = async (id: string) => {
  localDB.removeItem('faqs', id);
  if (!supabase) return;
  await supabase.from('faqs').delete().eq('id', id);
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  return handleRequest('inquiries', async () => await supabase!.from('inquiries').select('*').order('created_at', { ascending: false }));
};

export const deleteInquiry = async (id: string) => {
  localDB.removeItem('inquiries', id);
  if (!supabase) return;
  await supabase.from('inquiries').delete().eq('id', id);
};

export const submitInquiry = async (formData: any) => {
  if (!supabase) {
    console.error("Supabase client is not available.");
    return false;
  }

  const inquiry = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone || '',
    message: formData.message,
    plan: formData.plan || 'General Inquiry'
  };

  try {
    const { error } = await supabase.from('inquiries').insert([inquiry]);
    if (error) {
      console.error("DB Save Error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Network error during submission:", err);
    return false;
  }
};

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
