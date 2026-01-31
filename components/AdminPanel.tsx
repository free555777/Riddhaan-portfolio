
import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, MessageSquare, Trash2, 
  Loader2, BarChart3, Mail, Phone, 
  Calendar, Layout, Briefcase, Star, Settings, 
  Plus, Edit, Save, X, Globe, Eye, TrendingUp, Users, MousePointer2, HelpCircle
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

  // Analytics Simulation
  const [liveVisitors, setLiveVisitors] = useState(Math.floor(Math.random() * 5) + 2);
  const [totalViews, setTotalViews] = useState(1248);

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
      // Fix: Sanitize ID - if it's not a valid DB id (like a temporary string from constants), remove it
      // so Supabase generates a new valid ID.
      const payload = { ...data };
      if (!payload.id || typeof payload.id === 'string' && payload.id.length < 5) {
        delete payload.id;
      }

      if (type === 'services') await db.upsertService(payload);
      if (type === 'portfolio') await db.upsertProject(payload);
      if (type === 'testimonials') await db.upsertTestimonial(payload);
      if (type === 'faqs') await db.upsertFAQ(payload);
      
      setEditingItem(null);
      await fetchAllData();
      alert("Successfully Saved!");
    } catch (err: any) {
      console.error("Save error details:", err);
      alert(`Save failed: ${err.message || "Please check your database tables."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: Tab, id: string) => {
    if (!confirm("Remove this item?")) return;
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
          <h2 className="text-3xl font-black text-center mb-2 tracking-tight">ADMIN <span className="text-primary">PANEL</span></h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            <input required type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <Button fullWidth disabled={loading} className="rounded-2xl py-4">
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
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col fixed inset-y-0 z-50 shadow-sm">
        <div className="p-8 border-b border-gray-50 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <h1 className="font-black text-xl tracking-tighter uppercase">Admin<span className="text-primary">Portal</span></h1>
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

      {/* Main */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight capitalize">{activeTab}</h2>
              <p className="text-gray-500 font-medium">Manage your website content in real-time.</p>
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
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-primary"><Users size={24} /></div>
                    <div className="text-3xl font-black text-gray-900">{liveVisitors}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Visitors Now</div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600"><Eye size={24} /></div>
                    <div className="text-3xl font-black text-gray-900">{totalViews}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Views</div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600"><MessageSquare size={24} /></div>
                    <div className="text-3xl font-black text-gray-900">{inquiries.length}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Leads</div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600"><TrendingUp size={24} /></div>
                    <div className="text-3xl font-black text-gray-900">+15%</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Weekly Growth</div>
                  </div>
                </div>
              )}

              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  {inquiries.length === 0 ? <p className="text-center py-10 text-gray-400">No messages yet.</p> : inquiries.map(inq => (
                    <div key={inq.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex-1">
                        <h3 className="font-black text-xl mb-2">{inq.name}</h3>
                        <div className="flex flex-wrap gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                          <span className="flex items-center gap-1"><Mail size={12} /> {inq.email}</span>
                          <span className="flex items-center gap-1"><Phone size={12} /> {inq.phone}</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl italic text-gray-600 border border-gray-100">"{inq.message}"</div>
                      </div>
                      <button onClick={() => handleDelete('inquiries', inq.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl"><Trash2 size={24} /></button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(s => (
                    <div key={s.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 relative group">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary"><Layout size={24} /></div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">{s.title}</h3>
                      <p className="text-gray-500 text-sm mb-8 line-clamp-3">{s.description}</p>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(s)} className="p-3 bg-blue-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit size={16} /></button>
                        <button onClick={() => handleDelete('services', s.id || '')} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.map(p => (
                    <div key={p.id} className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden group">
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button onClick={() => setEditingItem(p)} className="p-4 bg-white rounded-2xl text-primary"><Edit size={24} /></button>
                          <button onClick={() => handleDelete('portfolio', p.id || '')} className="p-4 bg-white rounded-2xl text-red-500"><Trash2 size={24} /></button>
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

              {activeTab === 'testimonials' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 relative group">
                      <div className="flex items-center gap-4 mb-6">
                        <img src={t.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-primary/10" alt={t.name} />
                        <div>
                          <h4 className="font-black text-gray-900 text-sm">{t.name}</h4>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{t.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm italic mb-8 line-clamp-4">"{t.content}"</p>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(t)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-black text-[10px] uppercase hover:bg-primary hover:text-white transition-all"><Edit size={14} /> Edit</button>
                        <button onClick={() => handleDelete('testimonials', t.id || '')} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  {faqs.map(f => (
                    <div key={f.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-black text-gray-900 mb-2">{f.question}</h3>
                        <p className="text-gray-500 text-sm">{f.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(f)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-primary transition-colors"><Edit size={20} /></button>
                        <button onClick={() => handleDelete('faqs', f.id || '')} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                      </div>
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
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[40px] w-full max-w-2xl p-10 relative">
            <button onClick={() => setEditingItem(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X size={32} /></button>
            <h3 className="text-3xl font-black mb-10 tracking-tight uppercase">Edit <span className="text-primary">{activeTab.slice(0, -1)}</span></h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpsert(activeTab, editingItem); }} className="space-y-6">
              {activeTab === 'services' && (
                <>
                  <input required placeholder="Title" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <textarea required placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[120px]" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  <input placeholder="Icon (Layout, Zap, etc)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.icon || 'Layout'} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} />
                </>
              )}
              {activeTab === 'portfolio' && (
                <>
                  <input required placeholder="Title" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <input required placeholder="Category" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                  <input required placeholder="Image URL" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                  <textarea required placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[100px]" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                </>
              )}
              {activeTab === 'testimonials' && (
                <>
                  <input required placeholder="Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  <input required placeholder="Role" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.role || ''} onChange={e => setEditingItem({...editingItem, role: e.target.value})} />
                  <textarea required placeholder="Message" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[120px]" value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                  <input placeholder="Avatar URL" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.avatar || ''} onChange={e => setEditingItem({...editingItem, avatar: e.target.value})} />
                </>
              )}
              {activeTab === 'faqs' && (
                <>
                  <input required placeholder="Question" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.question || ''} onChange={e => setEditingItem({...editingItem, question: e.target.value})} />
                  <textarea required placeholder="Answer" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[120px]" value={editingItem.answer || ''} onChange={e => setEditingItem({...editingItem, answer: e.target.value})} />
                </>
              )}
              <div className="pt-4">
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
