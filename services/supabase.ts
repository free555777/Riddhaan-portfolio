
import { createClient } from '@supabase/supabase-js';
import { SiteSettings, PricingPlan, Service, Project, Testimonial, Inquiry, FAQItem } from '../types';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gajyeusnyawrpdcjveov.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_5TufyblCS0IUUvxA_OqB5g_iDnarZpp';

export const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// Helper to handle fallbacks to LocalStorage when Supabase tables are missing
const localDB = {
  get: (key: string) => {
    const data = localStorage.getItem(`riddhaan_db_${key}`);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, data: any) => {
    localStorage.setItem(`riddhaan_db_${key}`, JSON.stringify(data));
  }
};

const handleRequest = async (tableName: string, operation: () => Promise<any>, fallbackData: any = []) => {
  try {
    if (!supabase) throw new Error("No Supabase connection");
    const result = await operation();
    if (result.error) {
      // If table doesn't exist (42P01 error in Postgres), use local storage
      if (result.error.code === '42P01' || result.error.message?.includes('not found')) {
        console.warn(`Table ${tableName} missing. Using LocalStorage.`);
        return localDB.get(tableName) || fallbackData;
      }
      throw result.error;
    }
    // Sync local storage with successful DB fetch for offline resilience
    if (result.data && Array.isArray(result.data)) {
      localDB.set(tableName, result.data);
    }
    return result.data;
  } catch (err) {
    console.warn(`Database error for ${tableName}, falling back to LocalStorage:`, err);
    return localDB.get(tableName) || fallbackData;
  }
};

/**
 * SITE SETTINGS
 */
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error) return localDB.get('site_settings');
  return data;
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  localDB.set('site_settings', settings);
  if (!supabase) return;
  await supabase.from('site_settings').upsert(settings);
};

/**
 * SERVICES
 */
export const getServices = async (): Promise<Service[]> => {
  return handleRequest('services', () => supabase!.from('services').select('*').order('id', { ascending: true }));
};

export const upsertService = async (service: Partial<Service>) => {
  const current = localDB.get('services') || [];
  const index = current.findIndex((item: any) => item.id === service.id);
  if (index >= 0) current[index] = { ...current[index], ...service };
  else current.push({ ...service, id: service.id || Date.now().toString() });
  localDB.set('services', current);

  if (!supabase) return;
  await supabase.from('services').upsert(service);
};

export const deleteService = async (id: string) => {
  const current = localDB.get('services') || [];
  localDB.set('services', current.filter((item: any) => item.id !== id));
  if (!supabase) return;
  await supabase.from('services').delete().eq('id', id);
};

/**
 * PORTFOLIO
 */
export const getPortfolio = async (): Promise<Project[]> => {
  return handleRequest('portfolio', () => supabase!.from('portfolio').select('*').order('id', { ascending: false }));
};

export const upsertProject = async (project: Partial<Project>) => {
  const current = localDB.get('portfolio') || [];
  const index = current.findIndex((item: any) => item.id === project.id);
  if (index >= 0) current[index] = { ...current[index], ...project };
  else current.push({ ...project, id: project.id || Date.now().toString() });
  localDB.set('portfolio', current);

  if (!supabase) return;
  await supabase.from('portfolio').upsert(project);
};

export const deleteProject = async (id: string) => {
  const current = localDB.get('portfolio') || [];
  localDB.set('portfolio', current.filter((item: any) => item.id !== id));
  if (!supabase) return;
  await supabase.from('portfolio').delete().eq('id', id);
};

/**
 * TESTIMONIALS
 */
export const getTestimonials = async (): Promise<Testimonial[]> => {
  return handleRequest('testimonials', () => supabase!.from('testimonials').select('*').order('id', { ascending: false }));
};

export const upsertTestimonial = async (testimonial: Partial<Testimonial>) => {
  const current = localDB.get('testimonials') || [];
  const index = current.findIndex((item: any) => item.id === testimonial.id);
  if (index >= 0) current[index] = { ...current[index], ...testimonial };
  else current.push({ ...testimonial, id: testimonial.id || Date.now().toString() });
  localDB.set('testimonials', current);

  if (!supabase) return;
  await supabase.from('testimonials').upsert(testimonial);
};

export const deleteTestimonial = async (id: string) => {
  const current = localDB.get('testimonials') || [];
  localDB.set('testimonials', current.filter((item: any) => item.id !== id));
  if (!supabase) return;
  await supabase.from('testimonials').delete().eq('id', id);
};

/**
 * FAQS
 */
export const getFAQs = async (): Promise<FAQItem[]> => {
  const data = await handleRequest('faqs', () => supabase!.from('faqs').select('*').order('id', { ascending: true }));
  if (!data) return [];
  // Filter out the junk entries specified by the user
  return data.filter((f: any) => {
    const q = f.question.toLowerCase();
    const isJunk = q.includes('zzzzzz') || q === 'bnm';
    return !isJunk;
  });
};

export const upsertFAQ = async (faq: Partial<FAQItem>) => {
  const current = localDB.get('faqs') || [];
  const id = faq.id || Date.now().toString();
  const index = current.findIndex((item: any) => item.id === id);
  if (index >= 0) current[index] = { ...current[index], ...faq, id };
  else current.push({ ...faq, id });
  localDB.set('faqs', current);

  if (!supabase) return;
  // Try supabase, but don't throw if it fails (it will already be in LocalStorage)
  try {
    await supabase.from('faqs').upsert({ ...faq, id });
  } catch (e) {
    console.error("Supabase sync failed, using LocalStorage only.");
  }
};

export const deleteFAQ = async (id: string) => {
  const current = localDB.get('faqs') || [];
  localDB.set('faqs', current.filter((item: any) => item.id !== id));
  if (!supabase) return;
  await supabase.from('faqs').delete().eq('id', id);
};

/**
 * INQUIRIES
 */
export const getInquiries = async (): Promise<Inquiry[]> => {
  return handleRequest('inquiries', () => supabase!.from('inquiries').select('*').order('created_at', { ascending: false }));
};

export const deleteInquiry = async (id: string) => {
  if (!supabase) return;
  await supabase.from('inquiries').delete().eq('id', id);
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
  }
  return true;
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
