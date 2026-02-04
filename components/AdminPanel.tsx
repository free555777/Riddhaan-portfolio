
import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, MessageSquare, Trash2, 
  Loader2, BarChart3, Mail, Phone, 
  Calendar, Layout, Briefcase, Star, Settings, 
  Plus, Edit, Save, X, Globe, Eye, TrendingUp, Users, HelpCircle, ExternalLink
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
      const payload = { ...data };
      if (payload.id && (payload.id.length < 5 || typeof payload.id === 'number')) {
        delete payload.id;
      }

      if (type === 'services') await db.upsertService(payload);
      if (type === 'portfolio') await db.upsertProject(payload);
      if (type === 'testimonials') await db.upsertTestimonial(payload);
      if (type === 'faqs') await db.upsertFAQ(payload);
      
      setEditingItem(null);
      await fetchAllData();
      alert("Saved successfully!");
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`Save error: ${err.message}. Changes saved to local cache.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: Tab, id: string) => {
    if (!confirm("Delete this item permanently?")) return;
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
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600"><Layout size={24} /></div>
                    <div className="text-3xl font-black text-gray-900">{services.length}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Active Services</div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-600"><Star size={24} /></div>
                    <div className="text-3xl font-black text-gray-900">{testimonials.length}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Reviews</div>
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
                          <span className="flex items-center gap-1"><Phone size={12} /> {inq.phone}</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl text-gray-600 border border-gray-100 italic break-words">"{inq.message}"</div>
                      </div>
                      <button onClick={() => handleDelete('inquiries', inq.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl flex-shrink-0"><Trash2 size={24} /></button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(s => (
                    <div key={s.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 relative flex flex-col h-full">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary"><Layout size={24} /></div>
                      <h3 className="text-xl font-black text-gray-900 mb-2 break-words">{s.title}</h3>
                      <p className="text-gray-500 text-sm mb-8 line-clamp-3 break-words">{s.description}</p>
                      <div className="flex gap-2 mt-auto">
                        <button onClick={() => setEditingItem(s)} className="p-3 bg-blue-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit size={16} /></button>
                        <button onClick={() => handleDelete('services', s.id!)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="space-y-12">
                   {/* Real Projects List */}
                   <div>
                    <h3 className="text-xl font-black mb-6 text-gray-400 uppercase tracking-widest">Real Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.filter(p => p.project_type === 'real' || !p.project_type).map(p => (
                        <div key={p.id} className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden flex flex-col">
                          <div className="h-48 w-full bg-gray-100 relative">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{p.category}</div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">{p.title}</h3>
                            <div className="flex gap-2 mt-auto">
                              <button onClick={() => setEditingItem(p)} className="p-3 bg-blue-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit size={16} /></button>
                              <button onClick={() => handleDelete('portfolio', p.id!)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Demo Projects List */}
                  <div>
                    <h3 className="text-xl font-black mb-6 text-gray-400 uppercase tracking-widest">Demo Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.filter(p => p.project_type === 'demo').map(p => (
                        <div key={p.id} className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden flex flex-col">
                          <div className="h-48 w-full bg-gray-100 opacity-60">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-8 flex-1 flex flex-col">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{p.category}</div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">{p.title}</h3>
                            <div className="flex gap-2 mt-auto">
                              <button onClick={() => setEditingItem(p)} className="p-3 bg-blue-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit size={16} /></button>
                              <button onClick={() => handleDelete('portfolio', p.id!)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {projects.filter(p => p.project_type === 'demo').length === 0 && (
                        <div className="col-span-full py-12 border-2 border-dashed border-gray-100 rounded-[32px] text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No demo projects added yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/10" />
                        <div>
                          <h3 className="font-black text-gray-900">{t.name}</h3>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.role}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mb-6">"{t.content}"</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex text-amber-400">
                          {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingItem(t)} className="p-3 bg-blue-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"><Edit size={16} /></button>
                          <button onClick={() => handleDelete('testimonials', t.id!)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  {faqs.map(f => (
                    <div key={f.id} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-between gap-6 overflow-hidden">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 mb-1 break-all line-clamp-2">{f.question}</h3>
                        <p className="text-gray-500 text-sm line-clamp-1 break-all">{f.answer}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setEditingItem(f)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-primary transition-colors"><Edit size={20} /></button>
                        <button onClick={() => handleDelete('faqs', f.id!)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
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
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[40px] w-full max-w-2xl p-10 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingItem(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X size={32} /></button>
            <h3 className="text-3xl font-black mb-10 tracking-tight uppercase">Update <span className="text-primary">{activeTab === 'testimonials' ? 'Review' : activeTab.slice(0, -1)}</span></h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpsert(activeTab, editingItem); }} className="space-y-6">
              {activeTab === 'services' && (
                <>
                  <input required placeholder="Title" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <textarea required placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[120px]" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  <input placeholder="Icon Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.icon || 'Layout'} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} />
                </>
              )}
              {activeTab === 'faqs' && (
                <>
                  <input required placeholder="Question" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.question || ''} onChange={e => setEditingItem({...editingItem, question: e.target.value})} />
                  <textarea required placeholder="Answer" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[120px]" value={editingItem.answer || ''} onChange={e => setEditingItem({...editingItem, answer: e.target.value})} />
                </>
              )}
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
                      <input required placeholder="e.g. E-Commerce" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                    </div>
                  </div>
                  <input required placeholder="Title" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <input required placeholder="Image URL" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                  <input placeholder="Project Live URL (e.g. https://...)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.link || ''} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                  <textarea required placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[100px]" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                </>
              )}
              {activeTab === 'testimonials' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Client Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                    <input required placeholder="Role (e.g. CEO, Startup Founder)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.role || ''} onChange={e => setEditingItem({...editingItem, role: e.target.value})} />
                  </div>
                  <input required placeholder="Avatar Image URL" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.avatar || ''} onChange={e => setEditingItem({...editingItem, avatar: e.target.value})} />
                  <input required type="number" min="1" max="5" placeholder="Rating (1-5)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={editingItem.rating || 5} onChange={e => setEditingItem({...editingItem, rating: parseInt(e.target.value) || 5})} />
                  <textarea required placeholder="Review Content" className="w-full p-4 bg-gray-50 rounded-2xl outline-none min-h-[120px]" value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                </>
              )}
              <div className="pt-4">
                <Button fullWidth className="rounded-2xl py-5 h-14" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'CONFIRM CHANGES'}
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
