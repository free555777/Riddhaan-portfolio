
import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, MessageSquare, Trash2, 
  Loader2, ChevronLeft, BarChart3, Mail, Phone, 
  Calendar, Layout, Briefcase, Star, Settings, 
  Plus, Edit, Save, X, Globe, Eye
} from 'lucide-react';
// Added missing motion import
import { motion } from 'framer-motion';
import * as db from '../services/supabase.ts';
import { Inquiry, Service, Project, Testimonial, SiteSettings } from '../types.ts';
import Button from './Button.tsx';

type Tab = 'dashboard' | 'inquiries' | 'services' | 'portfolio' | 'testimonials' | 'settings';

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
      const [inq, serv, port, test, sett] = await Promise.all([
        db.getInquiries(),
        db.getServices(),
        db.getPortfolio(),
        db.getTestimonials(),
        db.getSiteSettings()
      ]);
      setInquiries(inq);
      setServices(serv);
      setProjects(port);
      setTestimonials(test);
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

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    try {
      await db.updateSiteSettings(settings);
      alert("Settings updated successfully!");
    } catch (err) {
      alert("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD HELPERS ---
  const handleDelete = async (type: Tab, id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      if (type === 'inquiries') await db.deleteInquiry(id);
      if (type === 'services') await db.deleteService(id);
      if (type === 'portfolio') await db.deleteProject(id);
      if (type === 'testimonials') await db.deleteTestimonial(id);
      fetchAllData();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleUpsert = async (type: Tab, data: any) => {
    setLoading(true);
    try {
      if (type === 'services') await db.upsertService(data);
      if (type === 'portfolio') await db.upsertProject(data);
      if (type === 'testimonials') await db.upsertTestimonial(data);
      setEditingItem(null);
      fetchAllData();
    } catch (err) {
      alert("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-gray-100">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl font-black text-center mb-2 uppercase tracking-tight">Admin <span className="text-primary">Portal</span></h2>
          <p className="text-gray-400 text-center mb-8 font-medium">Please enter your secure credentials.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
            <input required type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}
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
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col fixed inset-y-0 shadow-sm z-50">
        <div className="p-8 border-b border-gray-50">
          <h1 className="font-black text-2xl uppercase tracking-tighter">Admin<span className="text-primary">Panel</span></h1>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { id: 'inquiries', icon: MessageSquare, label: 'Inquiries' },
            { id: 'services', icon: Layout, label: 'Services' },
            { id: 'portfolio', icon: Briefcase, label: 'Portfolio' },
            { id: 'testimonials', icon: Star, label: 'Reviews' },
            { id: 'settings', icon: Settings, label: 'Site Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-50">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 capitalize tracking-tight">{activeTab}</h2>
              <p className="text-gray-500 font-medium">Manage your website content and track growth.</p>
            </div>
            {['services', 'portfolio', 'testimonials'].includes(activeTab) && (
              <Button size="sm" className="rounded-xl flex items-center gap-2" onClick={() => setEditingItem({})}>
                <Plus size={16} /> ADD NEW
              </Button>
            )}
          </header>

          {loading && !editingItem ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
          ) : (
            <>
              {/* DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-primary"><MessageSquare /></div>
                      <div className="text-3xl font-black text-gray-900">{inquiries.length}</div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Total Inquiries</div>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600"><Layout /></div>
                      <div className="text-3xl font-black text-gray-900">{services.length}</div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Active Services</div>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600"><Briefcase /></div>
                      <div className="text-3xl font-black text-gray-900">{projects.length}</div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Portfolio Items</div>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600"><Eye /></div>
                      <div className="text-3xl font-black text-gray-900">1.2k</div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Approx Views</div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                    <h3 className="text-xl font-black mb-6">Recent Traffic Graph (Simulated)</h3>
                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                      {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/10 rounded-t-xl group relative cursor-pointer hover:bg-primary transition-colors" style={{ height: `${h}%` }}>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h * 12}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                  </div>
                </div>
              )}

              {/* INQUIRIES TAB */}
              {activeTab === 'inquiries' && (
                <div className="grid gap-6">
                  {inquiries.length === 0 ? <p className="text-center py-20 text-gray-400 font-bold">No inquiries found.</p> : inquiries.map((inq) => (
                    <div key={inq.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between md:items-start gap-6 hover:border-primary/20 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-black text-xl text-gray-900">{inq.name}</h3>
                          <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">{inq.plan || 'General'}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-gray-400 text-sm font-medium mb-4">
                          <span className="flex items-center gap-2"><Mail size={14} /> {inq.email}</span>
                          <span className="flex items-center gap-2"><Phone size={14} /> {inq.phone}</span>
                          <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl italic text-gray-600 border border-gray-100">"{inq.message}"</div>
                      </div>
                      <button onClick={() => handleDelete('inquiries', inq.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 self-end"><Trash2 size={24} /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* SERVICES TAB */}
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(s => (
                    <div key={s.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 relative group">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">{s.icon}</div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">{s.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-6">{s.description}</p>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(s)} className="p-3 bg-blue-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit size={16} /></button>
                        <button onClick={() => handleDelete('services', s.id)} className="p-3 bg-red-50 text-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PORTFOLIO TAB */}
              {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.map(p => (
                    <div key={p.id} className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden group">
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button onClick={() => setEditingItem(p)} className="p-4 bg-white rounded-2xl text-primary hover:scale-110 transition-transform shadow-xl"><Edit size={24} /></button>
                          <button onClick={() => handleDelete('portfolio', p.id)} className="p-4 bg-white rounded-2xl text-red-500 hover:scale-110 transition-transform shadow-xl"><Trash2 size={24} /></button>
                        </div>
                      </div>
                      <div className="p-8">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">{p.category}</span>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{p.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && settings && (
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                  <form onSubmit={saveSettings} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Site Name</label>
                        <input className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20" value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tagline</label>
                        <input className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20" value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
                        <input className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20" value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                        <input className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20" value={settings.contact_phone} onChange={e => setSettings({...settings, contact_phone: e.target.value})} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SEO Description</label>
                        <textarea className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" value={settings.seo_description} onChange={e => setSettings({...settings, seo_description: e.target.value})} />
                      </div>
                    </div>
                    <Button disabled={loading} className="rounded-2xl px-12 py-5 font-black flex items-center gap-3">
                      <Save size={18} /> SAVE CHANGES
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl relative my-8">
            <button onClick={() => setEditingItem(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X size={32} /></button>
            <h3 className="text-3xl font-black mb-10 tracking-tight uppercase">Update <span className="text-primary">{activeTab.slice(0, -1)}</span></h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpsert(activeTab, editingItem); }} className="space-y-6">
              {activeTab === 'services' && (
                <>
                  <input placeholder="Title" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <textarea placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[100px]" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  <input placeholder="Icon (e.g. Layout, Zap, Search)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.icon || ''} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} />
                </>
              )}
              {activeTab === 'portfolio' && (
                <>
                  <input placeholder="Title" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <input placeholder="Category" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                  <input placeholder="Image URL" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                  <textarea placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[100px]" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  <input placeholder="Live Link" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.link || ''} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                </>
              )}
              {activeTab === 'testimonials' && (
                <>
                  <input placeholder="Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  <input placeholder="Role" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.role || ''} onChange={e => setEditingItem({...editingItem, role: e.target.value})} />
                  <textarea placeholder="Review Content" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[100px]" value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                </>
              )}
              <div className="pt-4 flex gap-4">
                <Button fullWidth className="rounded-2xl py-5 h-14" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'SAVE CHANGES'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
