
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
  upsertItem: (key: string, item: any) => {
    const data = localDB.get(key) || [];
    if (!item.id) {
      item.id = `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    const index = data.findIndex((i: any) => i.id === item.id);
    if (index > -1) {
      data[index] = { ...data[index], ...item };
    } else {
      data.unshift(item);
    }
    localDB.set(key, data);
    return item;
  },
  removeItem: (key: string, id: string) => {
    const data = localDB.get(key) || [];
    const filtered = data.filter((i: any) => i.id !== id);
    localDB.set(key, filtered);
  }
};

const handleRequest = async (tableName: string, operation: () => Promise<any>, fallbackData: any = []) => {
  const localItems = localDB.get(tableName) || [];
  
  try {
    if (!supabase) return localItems.length > 0 ? localItems : fallbackData;
    
    const { data, error } = await operation();
    if (error) throw error;
    
    const serverItems = (data && Array.isArray(data)) ? data : [];
    
    // Merge logic:
    // 1. Start with Fallbacks
    // 2. Overwrite with Cloud Data (Source of Truth)
    // 3. Add Local items only if they are NEW (not in cloud yet)
    const mergedMap = new Map();
    fallbackData.forEach((item: any) => mergedMap.set(item.id, item));
    serverItems.forEach((item: any) => mergedMap.set(item.id, item));
    
    // Only keep local items that are truly local-only (not synced)
    localItems.forEach((item: any) => {
      if (typeof item.id === 'string' && item.id.startsWith('local_')) {
        mergedMap.set(item.id, item);
      }
    });
    
    const finalData = Array.from(mergedMap.values());
    localDB.set(tableName, finalData);
    return finalData;
  } catch (err: any) {
    console.warn(`Sync Issue with ${tableName}:`, err.message);
    return localItems.length > 0 ? localItems : fallbackData;
  }
};

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  if (!supabase) return localDB.get('site_settings');
  try {
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (error) throw error;
    localDB.set('site_settings', data);
    return data;
  } catch (e) {
    return localDB.get('site_settings');
  }
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  localDB.set('site_settings', settings);
  if (!supabase) return { success: true, cloud: false };
  const { error } = await supabase.from('site_settings').upsert(settings);
  return { success: !error, cloud: !error };
};

export const getServices = async (): Promise<Service[]> => {
  return handleRequest('services', async () => await supabase!.from('services').select('*').order('id', { ascending: true }), []);
};

export const upsertService = async (service: Partial<Service>) => {
  const updated = localDB.upsertItem('services', service);
  if (!supabase) return { success: true, cloud: false };
  const { error } = await supabase.from('services').upsert(updated);
  return { success: true, cloud: !error };
};

export const deleteService = async (id: string) => {
  localDB.removeItem('services', id);
  if (!supabase) return;
  await supabase.from('services').delete().eq('id', id);
};

export const getPortfolio = async (): Promise<Project[]> => {
  return handleRequest('portfolio', async () => await supabase!.from('portfolio').select('*').order('created_at', { ascending: false }), []);
};

export const upsertProject = async (project: Partial<Project>) => {
  const updated = localDB.upsertItem('portfolio', project);
  if (!supabase) return { success: true, cloud: false };
  
  // If it's a new project and RLS allows it, Supabase will return it
  const { error } = await supabase.from('portfolio').upsert(updated);
  if (error) {
    console.error("Cloud Save Failed:", error.message);
    return { success: true, cloud: false, error: error.message };
  }
  return { success: true, cloud: true };
};

export const deleteProject = async (id: string) => {
  localDB.removeItem('portfolio', id);
  if (!supabase) return;
  await supabase.from('portfolio').delete().eq('id', id);
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  return handleRequest('testimonials', async () => await supabase!.from('testimonials').select('*').order('id', { ascending: false }), []);
};

export const upsertTestimonial = async (testimonial: Partial<Testimonial>) => {
  const updated = localDB.upsertItem('testimonials', testimonial);
  if (!supabase) return { success: true, cloud: false };
  const { error } = await supabase.from('testimonials').upsert(updated);
  return { success: true, cloud: !error };
};

export const deleteTestimonial = async (id: string) => {
  localDB.removeItem('testimonials', id);
  if (!supabase) return;
  await supabase.from('testimonials').delete().eq('id', id);
};

export const getFAQs = async (): Promise<FAQItem[]> => {
  return handleRequest('faqs', async () => await supabase!.from('faqs').select('*').order('id', { ascending: true }), []);
};

export const upsertFAQ = async (faq: Partial<FAQItem>) => {
  const updated = localDB.upsertItem('faqs', faq);
  if (!supabase) return { success: true, cloud: false };
  const { error } = await supabase.from('faqs').upsert(updated);
  return { success: true, cloud: !error };
};

export const deleteFAQ = async (id: string) => {
  localDB.removeItem('faqs', id);
  if (!supabase) return;
  await supabase.from('faqs').delete().eq('id', id);
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  return handleRequest('inquiries', async () => await supabase!.from('inquiries').select('*').order('created_at', { ascending: false }), []);
};

export const deleteInquiry = async (id: string) => {
  localDB.removeItem('inquiries', id);
  if (!supabase) return;
  await supabase.from('inquiries').delete().eq('id', id);
};

export const submitInquiry = async (formData: any) => {
  if (!supabase) return false;
  const inquiry = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone || '',
    message: formData.message,
    plan: formData.plan || 'General Inquiry'
  };
  try {
    const { error } = await supabase.from('inquiries').insert([inquiry]);
    return !error;
  } catch (err) {
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
