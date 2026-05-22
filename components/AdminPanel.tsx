
import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, MessageSquare, Trash2, 
  Loader2, BarChart3, Mail, Phone, 
  Layout, Briefcase, Star, Settings, 
  Plus, Edit, Save, X, Globe, Eye, TrendingUp, Users, HelpCircle, ExternalLink, CloudOff, CloudCheck,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as db from '../services/supabase.ts';
import { Inquiry, Service, Project, Testimonial, SiteSettings, FAQItem, BlogPost } from '../types.ts';
import { DEFAULT_BLOG_POSTS } from '../constants.ts';
import Button from './Button.tsx';

type Tab = 'dashboard' | 'inquiries' | 'services' | 'portfolio' | 'testimonials' | 'faqs' | 'settings' | 'blog';

const generateAllBlogPostsTS = (allPosts: BlogPost[], updatedPost: BlogPost) => {
  let list = [...allPosts];
  const postToSave = { ...updatedPost };
  if (!postToSave.id) {
    postToSave.id = 'blog_' + Date.now();
  }
  
  const idx = list.findIndex(p => p.id === postToSave.id);
  if (idx !== -1) {
    list[idx] = postToSave;
  } else {
    list.push(postToSave);
  }

  const postsTS = list.map(post => {
    const slug = post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '');
    const tags = post.tags && post.tags.length ? post.tags : [post.category || 'Web Development'];
    return `  {
    id: ${JSON.stringify(post.id)},
    title: ${JSON.stringify(post.title || '')},
    slug: ${JSON.stringify(slug)},
    excerpt: ${JSON.stringify(post.excerpt || '')},
    cover_image: ${JSON.stringify(post.cover_image || '')},
    category: ${JSON.stringify(post.category || '')},
    tags: ${JSON.stringify(tags)},
    read_time: ${JSON.stringify(post.read_time || '5 min read')},
    published_at: ${JSON.stringify(post.published_at || new Date().toISOString().split('T')[0])},
    status: ${JSON.stringify(post.status || 'published')},
    meta_title: ${JSON.stringify(post.meta_title || '')},
    meta_description: ${JSON.stringify(post.meta_description || '')},
    content: \`${(post.content || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`
  }`;
  }).join(',\n');

  return `export const DEFAULT_BLOG_POSTS: BlogPost[] = [\n${postsTS}\n];`;
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [showBlogCodeSnippet, setShowBlogCodeSnippet] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const logged = await db.isAdminLoggedIn();
    if (logged) {
      setIsLogged(true);
      await fetchAllData();
    } else {
      setLoading(false);
    }
  };

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
      setInquiries(inq || []);
      setServices(serv || []);
      setProjects(port || []);
      setTestimonials(test || []);
      setFaqs(fqs || []);
      setSettings(sett);
      setBlogPosts(DEFAULT_BLOG_POSTS);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    setSuccessNotice('');
    
    if (isSignUp) {
      // Attempt registration
      const res = await db.adminSignUp(email, password);
      if (res.success) {
        if (res.session) {
          setIsLogged(true);
          await fetchAllData();
          setSuccessNotice("Account created and logged in!");
        } else {
          setSuccessNotice("Account registered successfully! If you are required to confirm your email, please check your inbox (or check spam). Otherwise, switch to 'Login' to authorized your session.");
          setIsSignUp(false);
        }
      } else {
        setError(res.error || "Registration failed. Make sure your password has at least 6 characters.");
      }
    } else {
      // Attempt real login
      const res = await db.adminLogin(email, password);
      
      if (res.success) {
        setIsLogged(true);
        await fetchAllData();
      } else {
        // Better error messaging
        const errMsg = res.error?.toLowerCase();
        if (errMsg?.includes('invalid login credentials')) {
          setError("Incorrect password or Account not found. Try switching to 'Create Account' below if you haven't created one yet.");
        } else if (errMsg?.includes('email not confirmed')) {
          setError("Email confirmation is required. Please check your inbox to confirm your address, or disable 'Confirm Email' in Supabase console!");
        } else {
          setError(res.error || "Login Failed.");
        }
      }
    }
    setSaveLoading(false);
  };

  const handleLogout = async () => {
    await db.logoutAdmin();
    setIsLogged(false);
    window.location.href = '/';
  };

  const handleUpsert = async (type: Tab, data: any) => {
    setSaveLoading(true);
    try {
      let res: any;
      if (type === 'services') res = await db.upsertService(data);
      else if (type === 'portfolio') res = await db.upsertProject(data);
      else if (type === 'testimonials') res = await db.upsertTestimonial(data);
      else if (type === 'faqs') res = await db.upsertFAQ(data);
      else if (type === 'settings') res = await db.updateSiteSettings(data);
      else if (type === 'blog') res = await db.upsertBlogPost(data);
      
      if (res && res.error) {
        alert(`Cloud Sync Error: ${res.error}`);
      } else {
        setEditingItem(null);
        await fetchAllData();
      }
    } catch (err: any) {
      alert("Operation failed.");
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (type: Tab, id: string) => {
    if (type === 'blog') {
      const confirmed = confirm("This post is static in your code inside '/constants.ts'. To permanently remove it, delete its object inside that file. Would you like to exclude it from your current list and copy the updated TypeScript code array now?");
      if (confirmed) {
        const list = blogPosts.filter(p => p.id !== id);
        setBlogPosts(list);
        
        // Generate and copy the code with this post removed
        const postsTS = list.map(post => {
          const slug = post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '');
          const tags = post.tags && post.tags.length ? post.tags : [post.category || 'Web Development'];
          return `  {
    id: ${JSON.stringify(post.id)},
    title: ${JSON.stringify(post.title || '')},
    slug: ${JSON.stringify(slug)},
    excerpt: ${JSON.stringify(post.excerpt || '')},
    cover_image: ${JSON.stringify(post.cover_image || '')},
    category: ${JSON.stringify(post.category || '')},
    tags: ${JSON.stringify(tags)},
    read_time: ${JSON.stringify(post.read_time || '5 min read')},
    published_at: ${JSON.stringify(post.published_at || new Date().toISOString().split('T')[0])},
    status: ${JSON.stringify(post.status || 'published')},
    meta_title: ${JSON.stringify(post.meta_title || '')},
    meta_description: ${JSON.stringify(post.meta_description || '')},
    content: \`${(post.content || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`
  }`;
        }).join(',\n');
        const code = `export const DEFAULT_BLOG_POSTS: BlogPost[] = [\n${postsTS}\n];`;
        navigator.clipboard.writeText(code);
        alert("Success! The updated array (with this article removed) has been copied to your clipboard. Open '/constants.ts' and replace the DEFAULT_BLOG_POSTS declaration with it!");
      }
      return;
    }

    if (!confirm("Confirm permanent deletion? This cannot be undone.")) return;
    try {
      if (type === 'inquiries') await db.deleteInquiry(id);
      else if (type === 'services') await db.deleteService(id);
      else if (type === 'portfolio') await db.deleteProject(id);
      else if (type === 'testimonials') await db.deleteTestimonial(id);
      else if (type === 'faqs') await db.deleteFAQ(id);
      await fetchAllData();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (loading && !isLogged) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  }

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl border border-gray-100">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock className="text-primary" size={32} /></div>
          <h2 className="text-2xl font-black text-center mb-2 tracking-tight">
            ADMIN <span className="text-primary">{isSignUp ? 'REGISTER' : 'LOGIN'}</span>
          </h2>
          <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">
            {isSignUp ? 'Create New Admin Credentials' : 'Official Access Only'}
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Account Email</label>
              <input required type="email" placeholder="email@example.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all font-bold" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Secure Password</label>
              <input required type="password" placeholder="••••••••" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all font-bold" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest leading-relaxed">
                  {error}
                </p>
              </div>
            )}
            {successNotice && (
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <p className="text-emerald-600 text-[10px] font-black text-center uppercase tracking-widest leading-relaxed">
                  {successNotice}
                </p>
              </div>
            )}
            <Button fullWidth disabled={saveLoading} className="rounded-2xl py-4 h-14 mt-4">
              {saveLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'CREATE ACCOUNT' : 'AUTHORIZE SESSION')}
            </Button>
          </form>
          <div className="mt-8 pt-8 border-t border-gray-50">
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccessNotice('');
              }}
              className="w-full text-[10px] text-primary hover:underline text-center uppercase font-black tracking-widest block"
            >
              {isSignUp ? 'Already have an account? Back to Login' : "Don't have an admin account? Register one here!"}
            </button>
            <p className="text-[8px] text-gray-400 text-center uppercase font-bold tracking-wider mt-4 leading-relaxed">
              Note: If registration succeeds but log in fails, make sure "Confirm Email" is turned off in your Supabase Auth Providers settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const CloudStatus = ({ id }: { id: any }) => (
    <div className={`absolute top-4 right-4 p-2 rounded-full shadow-lg text-white z-10 ${String(id).startsWith('local_') ? 'bg-amber-500' : 'bg-green-500'}`} title={String(id).startsWith('local_') ? 'Local Data' : 'Cloud Data'}>
      {String(id).startsWith('local_') ? <CloudOff size={14} /> : <CloudCheck size={14} />}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center">
            <h1 className="font-black text-xl uppercase tracking-tighter">Admin<span className="text-primary">Panel</span></h1>
            <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Analytics' },
            { id: 'inquiries', icon: MessageSquare, label: 'Inquiries' },
            { id: 'services', icon: Layout, label: 'Services' },
            { id: 'portfolio', icon: Briefcase, label: 'Portfolio' },
            { id: 'testimonials', icon: Star, label: 'Reviews' },
            { id: 'faqs', icon: HelpCircle, label: 'FAQs' },
            { id: 'blog', icon: BookOpen, label: 'Blog Posts' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-xl shadow-blue-200' : 'text-gray-400 hover:bg-gray-50'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-50">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight capitalize">{activeTab}</h2>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Management Console</p>
            </div>
            {['services', 'portfolio', 'testimonials', 'faqs', 'blog'].includes(activeTab) && (
              <Button size="sm" className="rounded-xl flex items-center gap-2 shadow-blue-100" onClick={() => setEditingItem({})}>
                <Plus size={16} /> ADD ENTRY
              </Button>
            )}
          </header>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { label: 'Total Inquiries', val: inquiries.length, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Live Projects', val: projects.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Blog Articles', val: blogPosts.length, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Services', val: services.length, icon: Layout, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Reviews', val: testimonials.length, icon: Star, color: 'text-green-600', bg: 'bg-green-50' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                      <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><stat.icon size={28} /></div>
                      <div className="text-4xl font-black text-gray-900 tracking-tighter">{stat.val}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  {inquiries.length > 0 ? inquiries.map(inq => (
                    <div key={inq.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/20 transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-black text-xl text-gray-900">{inq.name}</h4>
                          <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md font-bold text-gray-500 uppercase">{new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
                          <a href={`mailto:${inq.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail size={14} /> {inq.email}</a>
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Phone size={14} /> {inq.phone}</a>
                        </div>
                        <div className="mt-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 italic text-gray-700 relative">
                          <span className="absolute -top-3 left-4 text-3xl text-gray-200">"</span>
                          {inq.message}
                        </div>
                      </div>
                      <button onClick={() => handleDelete('inquiries', inq.id)} className="p-4 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={24} /></button>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                      <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No inquiries found yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map(p => (
                    <div key={p.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 group shadow-sm hover:shadow-xl transition-all relative">
                      <CloudStatus id={p.id} />
                      <div className="h-56 relative bg-gray-50">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.title} />
                        <div className="absolute top-4 left-4">
                           <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm border border-white/20">
                             {p.project_type || 'real'}
                           </span>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest">{p.category}</div>
                        <h3 className="text-2xl font-black mb-6 text-gray-900 leading-tight truncate">{p.title}</h3>
                        <div className="flex gap-3">
                          <button onClick={() => setEditingItem(p)} className="flex-1 flex items-center justify-center gap-2 p-4 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-50 hover:text-primary transition-all"><Edit size={16} /> EDIT</button>
                          <button onClick={() => handleDelete('portfolio', p.id!)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map(s => (
                    <div key={s.id} className="bg-white p-8 rounded-[40px] border border-gray-100 relative group hover:border-primary/20 transition-all">
                      <CloudStatus id={s.id} />
                      <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Layout size={28} />
                      </div>
                      <h3 className="text-2xl font-black mb-3 text-gray-900">{s.title}</h3>
                      <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium line-clamp-3">{s.description}</p>
                      <div className="flex gap-3">
                        <button onClick={() => setEditingItem(s)} className="flex-1 flex items-center justify-center gap-2 p-4 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-50 hover:text-primary transition-all"><Edit size={16} /> EDIT</button>
                        <button onClick={() => handleDelete('services', s.id!)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-white p-8 rounded-[40px] border border-gray-100 relative group hover:border-primary/20 transition-all">
                      <CloudStatus id={t.id} />
                      <div className="flex items-center gap-4 mb-6">
                        <img src={t.avatar} className="w-12 h-12 rounded-full object-cover" alt={t.name} />
                        <div>
                          <h4 className="font-black text-gray-900">{t.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{t.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-8 italic leading-relaxed font-medium line-clamp-4">"{t.content}"</p>
                      <div className="flex gap-3">
                        <button onClick={() => setEditingItem(t)} className="flex-1 flex items-center justify-center gap-2 p-4 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-50 hover:text-primary transition-all"><Edit size={16} /> EDIT</button>
                        <button onClick={() => handleDelete('testimonials', t.id!)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  {faqs.map(f => (
                    <div key={f.id} className="bg-white p-8 rounded-[32px] border border-gray-100 flex justify-between items-start relative group hover:border-primary/20 transition-all">
                      <CloudStatus id={f.id} />
                      <div className="pr-16 flex-1">
                        <h4 className="font-black text-xl text-gray-900 mb-3">{f.question}</h4>
                        <p className="text-base text-gray-500 leading-relaxed font-medium">{f.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingItem(f)} className="p-3 text-primary hover:bg-blue-50 rounded-xl transition-all"><Edit size={20} /></button>
                        <button onClick={() => handleDelete('faqs', f.id!)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-[32px] flex items-start gap-4 shadow-sm">
                    <div className="p-3.5 bg-primary rounded-2xl text-white shadow-md shadow-blue-100">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase text-xs tracking-wider mb-1">Static Code-First Blog Enabled ⚡</h4>
                      <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                        Your articles are maintained directly in the code component (inside the <code className="bg-white px-2 py-0.5 rounded border border-blue-200 text-primary font-mono font-bold">/constants.ts</code> file) for lightning-fast speeds, zero hosting costs, and superior search engine optimization. 
                        Use the <strong>"ADD ENTRY"</strong> or <strong>"EDIT ARTICLE"</strong> buttons to draft and format posts in our clean UI, then click <strong>"GENERATE CODE SNIPPET"</strong> to instantly render and copy the updated TypeScript structure which you can paste straight into your code!
                      </p>
                    </div>
                  </div>

                  {blogPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {blogPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 group shadow-sm hover:shadow-xl transition-all relative">
                          <CloudStatus id={post.id} />
                          <div className="h-48 relative bg-gray-50 flex items-center justify-center overflow-hidden">
                            {post.cover_image ? (
                              <img src={post.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                            ) : (
                              <BookOpen size={48} className="text-gray-300" />
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                              <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
                                {post.category}
                              </span>
                              <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${post.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                {post.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-8">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {post.published_at} • {post.read_time || '5 min read'}
                            </span>
                            <h3 className="text-xl font-black mt-2 mb-4 text-gray-900 leading-tight line-clamp-2" title={post.title}>
                              {post.title}
                            </h3>
                            <p className="text-gray-500 text-xs font-semibold leading-relaxed line-clamp-3 mb-6">
                              {post.excerpt}
                            </p>
                            <div className="flex gap-3">
                              <button onClick={() => setEditingItem(post)} className="flex-1 flex items-center justify-center gap-2 p-4 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-50 hover:text-primary transition-all">
                                <Edit size={16} /> EDIT ARTICLE
                              </button>
                              <button onClick={() => handleDelete('blog', post.id!)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                      <BookOpen className="mx-auto text-gray-200 mb-4" size={48} />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No blog articles found. Start publishing!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && settings && (
                <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                  <form onSubmit={(e) => { e.preventDefault(); handleUpsert('settings', settings); }} className="space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                           <Globe className="text-primary" size={20} />
                           <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Brand Identity</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Studio Name</label>
                            <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Motto / Tagline</label>
                            <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Logo SVG/Image URL</label>
                            <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" value={settings.logo_url} onChange={e => setSettings({...settings, logo_url: e.target.value})} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                           <Phone className="text-primary" size={20} />
                           <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Reach & Support</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">WhatsApp No. (With Code)</label>
                            <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Display Phone</label>
                            <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" value={settings.contact_phone} onChange={e => setSettings({...settings, contact_phone: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Display Email</label>
                            <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-8 border-t border-gray-50">
                      <Button fullWidth disabled={saveLoading} size="lg" className="rounded-3xl h-16 shadow-blue-200">
                        {saveLoading ? <Loader2 className="animate-spin" /> : 'SYNCHRONIZE ALL SETTINGS'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Robust Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white rounded-[48px] w-full max-w-2xl p-10 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <button onClick={() => { setEditingItem(null); setShowBlogCodeSnippet(false); setCopiedCode(false); }} className="absolute top-10 right-10 text-gray-400 hover:text-gray-900 transition-colors"><X size={32} /></button>
            <h3 className="text-4xl font-black mb-10 tracking-tight uppercase">
              {activeTab === 'blog' && showBlogCodeSnippet ? 'Generated Code' : 'Update'} <span className="text-primary">{activeTab.slice(0,-1)}</span>
            </h3>
            
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              if (activeTab === 'blog') {
                setShowBlogCodeSnippet(true);
              } else {
                handleUpsert(activeTab, editingItem); 
              }
            }} className="space-y-6">
              {activeTab === 'portfolio' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Project Type</label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" value={editingItem.project_type || 'real'} onChange={e => setEditingItem({...editingItem, project_type: e.target.value})}>
                        <option value="real">Official Client Project</option>
                        <option value="demo">Demo / Practice</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Category</label>
                      <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" placeholder="Web App, UI/UX..." value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Project Title</label>
                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Thumbnail Image URL</label>
                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">External Link (Live Site)</label>
                    <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" value={editingItem.link || ''} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Description</label>
                    <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 outline-none resize-none font-bold" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </div>
                </>
              )}
              {activeTab === 'services' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Service Title</label>
                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Detailed Description</label>
                    <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-40 outline-none resize-none font-bold" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Icon Identifier (Lucide Name)</label>
                    <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={editingItem.icon || 'Zap'} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} />
                  </div>
                </>
              )}
              {activeTab === 'testimonials' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Client Name</label>
                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Client Role / Company</label>
                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={editingItem.role || ''} onChange={e => setEditingItem({...editingItem, role: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Avatar Image URL</label>
                    <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={editingItem.avatar || ''} onChange={e => setEditingItem({...editingItem, avatar: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Testimonial Content</label>
                    <textarea required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-32 outline-none resize-none font-bold" value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                  </div>
                </>
              )}
              {activeTab === 'faqs' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Common Question</label>
                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={editingItem.question || ''} onChange={e => setEditingItem({...editingItem, question: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Official Answer</label>
                    <textarea required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-40 outline-none resize-none font-bold" value={editingItem.answer || ''} onChange={e => setEditingItem({...editingItem, answer: e.target.value})} />
                  </div>
                </>
              )}
              {activeTab === 'blog' && (
                showBlogCodeSnippet ? (
                  <div className="space-y-6 bg-slate-900 text-slate-100 p-8 rounded-[32px] font-mono text-xs overflow-hidden relative">
                    <div className="flex justify-between items-center text-slate-400 pb-3 mb-4 border-b border-slate-800">
                      <span>constants.ts CONFIG CONFIGURATION</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          const blogCode = generateAllBlogPostsTS(blogPosts, editingItem);
                          navigator.clipboard.writeText(blogCode);
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 3005);
                        }}
                        className="bg-primary hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all"
                      >
                        {copiedCode ? 'Copied ✅' : 'Copy All Code'}
                      </button>
                    </div>
                    <p className="text-[10px] text-yellow-400 font-sans leading-relaxed font-bold mb-4">
                      Instructions: Click "Copy All Code" above, then open "/constants.ts" in your editor, search for "export const DEFAULT_BLOG_POSTS: BlogPost[] = [ ... ]", and paste this newly generated structure in place of it!
                    </p>
                    <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap p-4 bg-slate-950 rounded-xl scrollbar-thin text-[11px] leading-relaxed text-slate-300">
                      {generateAllBlogPostsTS(blogPosts, editingItem)}
                    </pre>
                    <div className="flex gap-4 pt-4 font-sans mt-2">
                      <button 
                        type="button"
                        onClick={() => setShowBlogCodeSnippet(false)}
                        className="flex-1 rounded-2xl py-3.5 text-slate-900 font-bold bg-white hover:bg-slate-100 border border-slate-200 transition-all text-xs"
                      >
                        ← Back to Editing Form
                      </button>
                      <button 
                        type="button"
                        className="flex-1 rounded-2xl py-3.5 text-white font-bold bg-primary hover:bg-opacity-90 transition-all text-xs"
                        onClick={() => {
                          const list = [...blogPosts];
                          const idx = list.findIndex(p => p.id === editingItem.id);
                          if (idx !== -1) {
                            list[idx] = editingItem;
                          } else {
                            const newPost = { ...editingItem };
                            if (!newPost.id) newPost.id = 'blog_' + Date.now();
                            list.push(newPost);
                          }
                          setBlogPosts(list);
                          setEditingItem(null);
                          setShowBlogCodeSnippet(false);
                          setCopiedCode(false);
                        }}
                      >
                        Apply Locally & Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Article Title</label>
                        <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={editingItem.title || ''} onChange={e => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          setEditingItem({
                            ...editingItem,
                            title,
                            slug: editingItem.slug ? editingItem.slug : slug
                          });
                        }} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">URL Slug</label>
                        <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold select-all" placeholder="my-awesome-pwa-guide" value={editingItem.slug || ''} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Category</label>
                        <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="SEO, Business, Web Dev" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Read Time (e.g., '6 min read')</label>
                        <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="6 min read" value={editingItem.read_time || '5 min read'} onChange={e => setEditingItem({...editingItem, read_time: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Status</label>
                        <select required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm" value={editingItem.status || 'published'} onChange={e => setEditingItem({...editingItem, status: e.target.value as any})}>
                          <option value="published">Published</option>
                          <option value="draft">Draft / Private</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Cover Image URL</label>
                        <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-xs" placeholder="https://images.unsplash.com/..." value={editingItem.cover_image || ''} onChange={e => setEditingItem({...editingItem, cover_image: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Publication Date (YYYY-MM-DD)</label>
                        <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder={new Date().toISOString().split('T')[0]} value={editingItem.published_at || new Date().toISOString().split('T')[0]} onChange={e => setEditingItem({...editingItem, published_at: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Brief Excerpt/Mini Description</label>
                      <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="A compelling 2-sentence summary that appears in search indexes and card lists." value={editingItem.excerpt || ''} onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">SEO Meta Title (Optional)</label>
                        <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-xs" placeholder="Optimized target keyword title" value={editingItem.meta_title || ''} onChange={e => setEditingItem({...editingItem, meta_title: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">SEO Meta Description (Optional)</label>
                        <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-xs" placeholder="Human readable mini advert" value={editingItem.meta_description || ''} onChange={e => setEditingItem({...editingItem, meta_description: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Article Body (Supports Markdown formatting)</label>
                      <textarea required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl h-80 outline-none resize-none font-mono text-sm leading-relaxed" placeholder="## Welcome to my Blog post&#10;Write clean copy naturally with human readers in mind. Use lists, bold text, and subtitles." value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                    </div>
                  </>
                )
              )}
              {(!showBlogCodeSnippet || activeTab !== 'blog') && (
                <Button fullWidth className="mt-8 rounded-3xl py-5 shadow-blue-100" disabled={saveLoading}>
                  {saveLoading ? <Loader2 className="animate-spin" /> : (activeTab === 'blog' ? 'GENERATE CODE SNIPPET' : 'PUBLISH CHANGES')}
                </Button>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
