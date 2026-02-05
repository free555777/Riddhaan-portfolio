
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
    // Ensure item has an ID
    if (!item.id) {
      item.id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

/**
 * Enhanced handleRequest that merges server data with local cache.
 * Local data is preserved if the server returns an empty set or fails due to RLS.
 */
const handleRequest = async (tableName: string, operation: () => Promise<any>, fallbackData: any = []) => {
  const localItems = localDB.get(tableName) || [];
  
  try {
    if (!supabase) return localItems.length > 0 ? localItems : fallbackData;
    
    const result = await operation();
    
    // If the server returns data, we merge it with local items
    const serverItems = (result.data && Array.isArray(result.data)) ? result.data : [];
    
    // Use a Map to ensure unique items by ID
    const mergedMap = new Map();
    
    // 1. Add fallback/default items first
    fallbackData.forEach((item: any) => mergedMap.set(item.id, item));
    
    // 2. Add server items (these are source of truth for synced data)
    serverItems.forEach((item: any) => mergedMap.set(item.id, item));
    
    // 3. Add local items LAST (so local changes/unsynced items overwrite or add to the set)
    localItems.forEach((item: any) => mergedMap.set(item.id, item));
    
    const finalData = Array.from(mergedMap.values());
    
    // Sync back to local storage so the cache stays updated
    localDB.set(tableName, finalData);
    
    return finalData;
  } catch (err) {
    console.error(`Request error for ${tableName}:`, err);
    // On error, return whatever we have locally or the defaults
    return localItems.length > 0 ? localItems : fallbackData;
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
  return handleRequest('services', async () => await supabase!.from('services').select('*').order('id', { ascending: true }), []);
};

export const upsertService = async (service: Partial<Service>) => {
  localDB.upsertItem('services', service);
  if (!supabase) return;
  try {
    await supabase.from('services').upsert(service);
  } catch (e) {
    console.warn("Supabase Upsert failed, item exists only locally.");
  }
};

export const deleteService = async (id: string) => {
  localDB.removeItem('services', id);
  if (!supabase) return;
  await supabase.from('services').delete().eq('id', id);
};

export const getPortfolio = async (): Promise<Project[]> => {
  // Pass an empty array as fallback because we handle defaults in the App component/constants
  return handleRequest('portfolio', async () => await supabase!.from('portfolio').select('*').order('id', { ascending: false }), []);
};

export const upsertProject = async (project: Partial<Project>) => {
  const updatedItem = localDB.upsertItem('portfolio', project);
  if (!supabase) return;
  try {
    await supabase.from('portfolio').upsert(updatedItem);
  } catch (e) {
    console.warn("Supabase Sync Failed: Saved to local storage.");
  }
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
  localDB.upsertItem('testimonials', testimonial);
  if (!supabase) return;
  try {
    await supabase.from('testimonials').upsert(testimonial);
  } catch (e) {
    console.warn("Supabase Sync Failed: Saved to local storage.");
  }
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
  localDB.upsertItem('faqs', faq);
  if (!supabase) return;
  try {
    await supabase.from('faqs').upsert(faq);
  } catch (e) {
    console.warn("Supabase Sync Failed: Saved to local storage.");
  }
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
