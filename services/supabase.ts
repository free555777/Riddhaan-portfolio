
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
    
    const mergedMap = new Map();
    serverItems.forEach((item: any) => mergedMap.set(item.id, item));
    localItems.forEach((item: any) => {
      if (typeof item.id === 'string' && item.id.startsWith('local_')) {
        const alreadyExists = serverItems.some(si => (si.title || si.question) === (item.title || item.question));
        if (!alreadyExists) mergedMap.set(item.id, item);
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

export const getSiteSettings = async () => {
  if (!supabase) return localDB.get('site_settings');
  try {
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (!error) localDB.set('site_settings', data);
    return data || localDB.get('site_settings');
  } catch (e) { return localDB.get('site_settings'); }
};

export const updateSiteSettings = async (settings: any) => {
  localDB.set('site_settings', settings);
  if (!supabase) return { success: true, cloud: false };
  const { error } = await supabase.from('site_settings').upsert(settings);
  return { success: !error, cloud: !error, error: error?.message };
};

export const getServices = () => handleRequest('services', async () => await supabase!.from('services').select('*'), []);
export const upsertService = async (data: any) => {
  const local = localDB.upsertItem('services', data);
  if (!supabase) return { success: true, cloud: false };
  const { error } = await supabase.from('services').upsert(local);
  return { success: !error, cloud: !error, error: error?.message };
};
export const deleteService = async (id: string) => {
  localDB.removeItem('services', id);
  if (supabase) await supabase.from('services').delete().eq('id', id);
};

export const getPortfolio = () => handleRequest('portfolio', async () => await supabase!.from('portfolio').select('*').order('created_at', { ascending: false }), []);
export const upsertProject = async (project: Partial<Project>) => {
  const localItem = localDB.upsertItem('portfolio', project);
  if (!supabase) return { success: true, cloud: false };
  try {
    const isNew = String(localItem.id).startsWith('local_');
    const toSync = { ...localItem };
    if (isNew) toSync.id = `proj_${Date.now()}`;
    const { data, error } = await supabase.from('portfolio').upsert(toSync).select();
    if (error) return { success: true, cloud: false, error: error.message };
    if (data?.[0]) {
      if (isNew) localDB.removeItem('portfolio', localItem.id);
      localDB.upsertItem('portfolio', data[0]);
    }
    return { success: true, cloud: true };
  } catch (err: any) { return { success: true, cloud: false, error: err.message }; }
};
export const deleteProject = async (id: string) => {
  localDB.removeItem('portfolio', id);
  if (supabase) await supabase.from('portfolio').delete().eq('id', id);
};

export const getFAQs = () => handleRequest('faqs', async () => await supabase!.from('faqs').select('*'), []);
export const upsertFAQ = async (data: any) => {
  const local = localDB.upsertItem('faqs', data);
  if (!supabase) return { success: true, cloud: false };
  const { error } = await supabase.from('faqs').upsert(local);
  return { success: !error, cloud: !error, error: error?.message };
};
export const deleteFAQ = async (id: string) => {
  localDB.removeItem('faqs', id);
  if (supabase) await supabase.from('faqs').delete().eq('id', id);
};

export const getTestimonials = () => handleRequest('testimonials', async () => await supabase!.from('testimonials').select('*'), []);
export const upsertTestimonial = async (data: any) => {
  const local = localDB.upsertItem('testimonials', data);
  if (!supabase) return { success: true, cloud: false };
  const { error } = await supabase.from('testimonials').upsert(local);
  return { success: !error, cloud: !error, error: error?.message };
};
export const deleteTestimonial = async (id: string) => {
  localDB.removeItem('testimonials', id);
  if (supabase) await supabase.from('testimonials').delete().eq('id', id);
};

export const getInquiries = () => handleRequest('inquiries', async () => await supabase!.from('inquiries').select('*').order('created_at', { ascending: false }), []);
export const deleteInquiry = async (id: string) => {
  localDB.removeItem('inquiries', id);
  if (supabase) await supabase.from('inquiries').delete().eq('id', id);
};

export const submitInquiry = async (formData: any) => {
  if (!supabase) return false;
  const { error } = await supabase.from('inquiries').insert([formData]);
  return !error;
};

// --- REAL AUTHENTICATION ---
export const adminLogin = async (email: string, pass: string) => {
  if (!supabase) return { success: false, error: "Supabase not connected" };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error) return { success: false, error: error.message };
  return { success: true };
};

export const isAdminLoggedIn = async () => {
  if (!supabase) return false;
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const logoutAdmin = async () => {
  if (supabase) await supabase.auth.signOut();
};
