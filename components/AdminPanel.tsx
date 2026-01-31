
import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, MessageSquare, Trash2, 
  Loader2, ChevronLeft, BarChart3, Mail, Phone, Calendar
} from 'lucide-react';
import * as db from '../services/supabase.ts';
import { Inquiry } from '../types.ts';
import Button from './Button.tsx';

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
    if (confirm("Are you sure you want to delete this inquiry?")) {
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
    // Use href to clear the /admin pathname and return to the main site
    window.location.href = '/';
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-black text-center mb-8 uppercase">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            <input required type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <Button fullWidth disabled={loading} className="rounded-2xl py-4">
              {loading ? <Loader2 className="animate-spin" /> : 'SECURE LOGIN'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="font-black text-2xl uppercase">Admin<span className="text-primary">Panel</span></h1>
        <button onClick={handleLogout} className="text-red-500 font-black text-xs uppercase bg-red-50 px-4 py-2 rounded-xl">Logout</button>
      </nav>
      <div className="max-w-6xl mx-auto w-full p-6">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="text-primary" size={28} />
          <h2 className="text-3xl font-black text-gray-900">Recent Inquiries ({inquiries.length})</h2>
        </div>
        <div className="grid gap-6">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-white p-6 rounded-[32px] shadow-sm border flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl">{inq.name}</h3>
                <p className="text-gray-500 text-sm">{inq.email} | {inq.phone}</p>
                <div className="bg-gray-50 p-4 rounded-xl mt-4 italic text-sm">"{inq.message}"</div>
              </div>
              <button onClick={() => handleDelete(inq.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={24} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
