
import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, MessageSquare, Trash2, 
  Loader2, ChevronLeft, BarChart3, Mail, Phone, Calendar
} from 'lucide-react';
import * as db from '../services/supabase';
import { Inquiry } from '../types';
import Button from './Button';

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (db.isAdminLoggedIn()) {
      setIsLogged(true);
      fetchInquiries();
    }
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await db.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await db.adminLogin(email, password);
      if (res.success) {
        setIsLogged(true);
        fetchInquiries();
      } else {
        setError("Invalid Credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
      try {
        await db.deleteInquiry(id);
        setInquiries(prev => prev.filter(inq => inq.id !== id));
      } catch (err) {
        alert("Failed to delete inquiry.");
      }
    }
  };

  const handleLogout = () => {
    db.logoutAdmin();
    setIsLogged(false);
    window.location.hash = '#home';
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-8 md:p-12 max-w-md w-full shadow-2xl border border-gray-200">
          <div className="flex justify-center mb-8">
            <div className="p-5 bg-primary/10 rounded-3xl text-primary">
              <Lock size={40} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-center mb-2 tracking-tighter uppercase">Admin Login</h2>
          <p className="text-gray-400 text-center mb-8 font-medium">Enter your credentials to manage inquiries.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                required 
                type="email" 
                placeholder="Email Address" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent outline-none focus:border-primary transition-all font-medium" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <input 
                required 
                type="password" 
                placeholder="Password" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent outline-none focus:border-primary transition-all font-medium" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            
            <Button fullWidth disabled={loading} className="rounded-2xl py-4 shadow-blue-200">
              {loading ? <Loader2 className="animate-spin" /> : 'SECURE LOGIN'}
            </Button>
            
            <button 
              type="button" 
              onClick={() => window.location.hash = '#home'} 
              className="w-full text-gray-400 font-black text-[10px] py-4 tracking-widest flex items-center justify-center gap-2 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft size={14} /> BACK TO WEBSITE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="font-black text-2xl tracking-tighter text-gray-900 uppercase">
            Admin<span className="text-primary">Panel</span>
          </h1>
          <div className="hidden md:block h-6 w-[1px] bg-gray-200"></div>
          <p className="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest">Dashboard v1.0</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchInquiries} 
            className={`p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 ${loading ? 'animate-spin text-primary' : ''}`}
          >
            <Loader2 size={20} />
          </button>
          <button 
            onClick={handleLogout} 
            className="text-red-500 font-black text-xs flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all uppercase tracking-wider"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>
      
      <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex-grow">
        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
              <h4 className="text-4xl font-black text-gray-900">{inquiries.length}</h4>
            </div>
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <BarChart3 size={24} />
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Today</p>
              <h4 className="text-4xl font-black text-gray-900">
                {inquiries.filter(i => new Date(i.created_at).toDateString() === new Date().toDateString()).length}
              </h4>
            </div>
            <div className="p-4 bg-green-50 text-green-500 rounded-2xl">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="text-primary" size={28} />
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recent Inquiries</h2>
        </div>

        <div className="grid gap-6">
          {inquiries.map((inq, idx) => (
            <div 
              key={inq.id} 
              className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="font-black text-2xl text-gray-900 leading-none">{inq.name}</h3>
                  <span className="text-[10px] bg-blue-50 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest border border-blue-100">
                    {inq.plan || 'General Inquiry'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                    <Mail size={14} className="text-gray-300" /> {inq.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                    <Phone size={14} className="text-gray-300" /> {inq.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 font-medium text-xs">
                    <Calendar size={14} className="text-gray-200" /> {new Date(inq.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 italic border-l-4 border-primary font-medium text-sm leading-relaxed">
                  "{inq.message}"
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(inq.id)} 
                className="md:self-start bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 p-4 rounded-2xl transition-all"
                title="Delete Inquiry"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}

          {inquiries.length === 0 && !loading && (
            <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
              <div className="inline-block p-6 bg-gray-50 rounded-full text-gray-200 mb-4">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-xl font-black text-gray-300 uppercase tracking-widest">No inquiries found yet</h3>
              <p className="text-gray-400 font-medium mt-2">Marketing efforts will bring leads here.</p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="py-8 text-center border-t border-gray-100 bg-white">
        <p className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">
          RIDDHAAN Management Console &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default AdminPanel;
