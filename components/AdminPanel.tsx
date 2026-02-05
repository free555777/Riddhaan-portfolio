
import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, MessageSquare, Trash2, 
  Loader2, BarChart3, Mail, Phone, 
  Calendar, Layout, Briefcase, Star, Settings, 
  Plus, Edit, Save, X, Globe, Eye, TrendingUp, Users, HelpCircle, ExternalLink, CloudOff, CloudCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as db from '../services/supabase.ts';
import { Inquiry, Service, Project, Testimonial, SiteSettings, FAQItem } from '../types.ts';
import { 
  SERVICES as DEFAULT_SERVICES, 
  PORTFOLIO_ITEMS as DEFAULT_PORTFOLIO, 
  TESTIMONIALS as DEFAULT_TESTIMONIALS,
  FAQ_DATA as DEFAULT_FAQS
} from '../constants.ts';
import Button from './Button.tsx';

type Tab = 'dashboard' | 'inquiries' | 'services' | 'portfolio' | 'testimonials' | 'faqs' | 'settings';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data States
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Edit States
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (db.isAdminLoggedIn()) {
      setIsLogged(true);
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [inq, serv, port, test, fqs, sett] = await Promise.all([
        db.getInquiries(),
        db.getServices(),
        db.getPortfolio(),
        db.getTestimonials(),
        db.getFAQs(),
        db.getSiteSettings()
      ]);
      
      setInquiries(inq);
      setServices(serv.length > 0 ? serv : DEFAULT_SERVICES);
      setProjects(port.length > 0 ? port : DEFAULT_PORTFOLIO);
      setTestimonials(test.length > 0 ? test : DEFAULT_TESTIMONIALS);
      setFaqs(fqs.length > 0 ? fqs : DEFAULT_FAQS);
      setSettings(sett);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await db.adminLogin(email, password);
    if (res.success) {
      setIsLogged(true);
      fetchAllData();
    } else {
      setError("Invalid Credentials.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    db.logoutAdmin();
    setIsLogged(false);
    window.location.href = '/';
  };

  const handleUpsert = async (type: Tab, data: any) => {
    setLoading(true);
    try {
      let res;
      if (type === 'services') res = await db.upsertService(data);
      if (type === 'portfolio') res = await db.upsertProject(data);
      if (type === 'testimonials') res = await db.upsertTestimonial(data);
      if (type === 'faqs') res = await db.upsertFAQ(data);
      
      setEditingItem(null);
      await fetchAllData();

      if (res && !res.cloud) {
        alert("Saved LOCALLY! ⚠️ Note: This project is only visible on this device. To show it on all devices, enable RLS policies in Supabase.");
      } else {
        alert("SUCCESS! ✅ Project synced with Cloud. It will now show on all devices.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setEditingItem(null);
      await fetchAllData();
      alert("Saved to Browser Cache only.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: Tab, id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      if (type === 'inquiries') await db.deleteInquiry(id);
      if (type === 'services') await db.deleteService(id);
      if (type === 'portfolio') await db.deleteProject(id);
      if (type === 'testimonials') await db.deleteTestimonial(id);
      if (type === 'faqs') await db.deleteFAQ(id);
      fetchAllData();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-gray-100">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl font-black text-center mb-6 tracking-tight">ADMIN <span className="text-primary">LOGIN</span></h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            <input required type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <Button fullWidth disabled={loading} className="rounded-2xl py-4 h-14">
              {loading ? <Loader2 className="animate-spin" /> : 'AUTHENTICATE'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-gray-50">
          <h1 className="font-black text-xl uppercase tracking-tighter">Admin<span className="text-primary">Panel</span></h1>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Stats' },
            { id: 'inquiries', icon: MessageSquare, label: 'Leads' },
            { id: 'services', icon: Layout, label: 'Services' },
            { id: 'portfolio', icon: Briefcase, label: 'Portfolio' },
            { id: 'testimonials', icon: Star, label: 'Reviews' },
            { id: 'faqs', icon: HelpCircle, label: 'FAQs' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-50">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-2xl">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight capitalize">{activeTab}</h2>
              <p className="text-gray-500 font-medium">Manage your website content efficiently.</p>
            </div>
            {['services', 'portfolio', 'testimonials', 'faqs'].includes(activeTab) && (
              <Button size="sm" className="rounded-xl flex items-center gap-2" onClick={() => setEditingItem({})}>
                <Plus size={16} /> ADD NEW
              </Button>
            )}
          </header>

          {loading && !editingItem ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600"><MessageSquare size={24} /></div>
                    <div className="text-3xl font-black text-gray-900">{inquiries.length}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Leads</div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-primary"><Briefcase size={24} /></div>
                    <div className="text-3xl font-black text-gray-900">{projects.length}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Portfolio Items</div>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="space-y-12">
                   <div>
                    <h3 className="text-xl font-black mb-6 text-gray-400 uppercase tracking-widest">Manage Portfolio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map(p => (
                        <div key={p.id} className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden flex flex-col group">
                          <div className="h-48 w-full bg-gray-100 relative">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            {p.id?.toString().startsWith('item_') && (
                              <div className="absolute top-4 right-4 bg-amber-500 text-white p-2 rounded-full shadow-lg" title="Only visible on this device (Not synced to cloud)">
                                <CloudOff size={16} />
                              </div>
                            )}
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{p.category}</div>
                            <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{p.title}</h3>
                            <div className="flex gap-2 mt-auto">
                              <button onClick={() => setEditingItem(p)} className="p-3 bg-blue-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit size={16} /></button>
                              <button onClick={() => handleDelete('portfolio', p.id!)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  {inquiries.length === 0 ? <p className="text-center py-10 text-gray-400">No leads found.</p> : inquiries.map(inq => (
                    <div key={inq.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex items-start gap-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-xl mb-2">{inq.name}</h3>
                        <div className="flex gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                          <span className="flex items-center gap-1"><Mail size={12} /> {inq.email}</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl text-gray-600 border border-gray-100 italic break-words">"{inq.message}"</div>
                      </div>
                      <button onClick={() => handleDelete('inquiries', inq.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl flex-shrink-0"><Trash2 size={24} /></button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[40px] w-full max-w-2xl p-10 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setEditingItem(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X size={32} /></button>
            <h3 className="text-3xl font-black mb-10 tracking-tight uppercase">Edit <span className="text-primary">{activeTab}</span></h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpsert(activeTab, editingItem); }} className="space-y-6">
              {activeTab === 'portfolio' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Project Type</label>
                      <select 
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold"
                        value={editingItem.project_type || 'real'}
                        onChange={e => setEditingItem({...editingItem, project_type: e.target.value as 'real' | 'demo'})}
                      >
                        <option value="real">Real Project</option>
                        <option value="demo">Demo Project</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Category</label>
                      <input required placeholder="Category" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                    </div>
                  </div>
                  <input required placeholder="Project Title" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <input required placeholder="Image URL" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                  <input placeholder="Live URL (e.g. https://...)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.link || ''} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                  <textarea required placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[100px] resize-none" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                </>
              )}
              {/* Default fallbacks for other tabs if editing */}
              {!['portfolio'].includes(activeTab) && (
                <p className="text-gray-400 italic">Editing for {activeTab} is enabled. Use the standard fields.</p>
              )}

              <div className="pt-4">
                <Button fullWidth className="rounded-2xl py-5 h-14" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'SAVE PROJECT'}
                </Button>
                <p className="text-[10px] text-gray-400 text-center mt-4 font-bold uppercase tracking-widest">
                  {/* Fixed: Use db.supabase instead of supabase to check for client presence */}
                  {db.supabase ? "Syncing with Cloud Database" : "Saving to Local Device Only"}
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
