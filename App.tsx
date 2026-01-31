
import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, Layout as LayoutIcon, Smartphone, 
  ShoppingCart, Search, ShieldCheck, Database, Zap, 
  Loader2, MessageSquare, Globe, Sparkles, MessageCircle,
  ArrowRight, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar.tsx';
import Button from './components/Button.tsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.tsx';
import PricingTable from './components/PricingTable.tsx';
import FAQ from './components/FAQ.tsx';
import Footer from './components/Footer.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { 
  PRICING_PLANS as DEFAULT_PRICING, 
  SERVICES as DEFAULT_SERVICES, 
  PORTFOLIO_ITEMS as DEFAULT_PORTFOLIO, 
  TESTIMONIALS as DEFAULT_TESTIMONIALS,
  SITE_NAME as DEFAULT_NAME, 
  WHATSAPP_NUMBER as DEFAULT_WA 
} from './constants.ts';
import * as db from './services/supabase.ts';
import { SiteSettings, PricingPlan, Service, Project, Testimonial } from './types.ts';

// --- ICON MAPPER ---
const IconMap: Record<string, React.ReactNode> = {
  Layout: <LayoutIcon className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  ShoppingCart: <ShoppingCart className="w-8 h-8" />,
  Search: <Search className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  Database: <Database className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Globe: <Globe className="w-8 h-8" />
};

// --- UTILS ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  } else {
    window.location.hash = '';
  }
};

// --- SHARED COMPONENTS ---
const SectionHeader = ({ title, subtitle, centered = true }: { title: string, subtitle?: string, centered?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`mb-10 md:mb-16 ${centered ? 'text-center' : 'text-left'}`}
  >
    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 tracking-tight leading-tight">{title}</h2>
    {subtitle && <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">{subtitle}</p>}
    <div className={`mt-4 md:mt-6 h-1.5 md:h-2 bg-primary w-16 md:w-24 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
  </motion.div>
);

// --- FRONTEND SECTIONS ---
const Hero = ({ settings }: { settings: SiteSettings }) => {
  const [activePopup, setActivePopup] = useState(0);
  
  const popups = [
    { text: "⚡ Ultra Fast Loading", color: "bg-blue-600", pos: "top-[20%] left-[5%] md:top-[15%]" },
    { text: "🛡️ 100% Secure Code", color: "bg-indigo-600", pos: "top-[25%] right-[5%] md:top-[25%]" },
    { text: "🔍 SEO Optimized", color: "bg-amber-500", pos: "bottom-[25%] left-[5%] md:bottom-[30%] md:left-[8%]" },
    { text: "🎨 Pixel Perfect UI", color: "bg-pink-600", pos: "top-[45%] right-[3%] md:right-[10%]" },
    { text: "🤖 Smart AI Features", color: "bg-purple-600", pos: "bottom-[12%] right-[5%] md:bottom-[15%]" },
    { text: "💬 24/7 Expert Support", color: "bg-green-600", pos: "top-[55%] left-[2%] md:bottom-[45%] md:left-[3%]" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePopup((prev) => (prev + 1) % popups.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-[75vh] md:min-h-[90vh] flex items-center pt-28 md:pt-32 pb-16 md:pb-20 bg-[#F8FAFC] overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[60%] md:w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[80px] md:blur-[120px] -z-10"></div>
      
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePopup}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className={`absolute ${popups[activePopup].pos} p-3.5 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl flex items-center gap-2 md:gap-3 backdrop-blur-lg border border-white/40 text-white font-black text-[9px] md:text-xs uppercase tracking-widest ${popups[activePopup].color}`}
          >
            {popups[activePopup].text}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="inline-flex items-center py-1.5 md:py-2 px-4 md:px-6 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-blue-600 text-[9px] md:text-xs font-black mb-6 md:mb-10 shadow-sm uppercase tracking-widest">
            ✨ {settings.tagline}
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-gray-900 leading-[1.05] md:leading-[0.9] mb-6 md:mb-10 tracking-tighter">
            Design. Develop. <br className="hidden sm:block" />
            <span className="text-primary italic">Deploy.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-gray-500 mb-8 md:mb-14 leading-relaxed max-w-2xl mx-auto font-medium px-4 md:px-0">
            {settings.seo_description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4 md:px-0">
            <Button size="lg" className="rounded-2xl px-10 md:px-12 py-3.5 md:py-5 w-full sm:w-auto text-xs md:text-sm" onClick={() => scrollToSection('pricing')}>View Plans</Button>
            <Button variant="outline" size="lg" className="rounded-2xl px-10 md:px-12 py-3.5 md:py-5 w-full sm:w-auto text-xs md:text-sm" onClick={() => scrollToSection('portfolio')}>Our Work</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="py-16 md:py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          className="relative h-full min-h-[300px] sm:min-h-[500px] lg:min-h-[700px]"
        >
          <motion.img 
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            src="https://i.postimg.cc/g0Q0Zb5y/b-jowline-visible-kro.jpg" 
            alt="Riddhaan - Full Stack Developer" 
            className="rounded-[24px] md:rounded-[40px] shadow-2xl w-full h-full object-cover block" 
          />
          <div className="absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 w-32 h-32 md:w-80 md:h-80 bg-primary/10 rounded-full blur-[60px] md:blur-[100px] -z-10"></div>
        </motion.div>

        <div className="flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter">
            Hi, I'm <span className="text-primary italic">Riddhaan<span className="text-accent">.</span></span>
          </h2>

          <div className="space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 font-medium leading-relaxed px-2 md:px-0">
            <p>
              A passionate <span className="text-gray-900 font-black">Full Stack Web & App Developer</span> who builds beautiful, functional, and high-performing digital experiences. I craft websites and apps using JavaScript, React, Python, Tailwind CSS, and Kotlin — blending clean code with creative design.
            </p>
            <p>
              Whether building from scratch or accelerating development with AI, I focus on delivering seamless, modern solutions. I specialize in responsive web design, dynamic front-ends, robust back-ends, and native Android applications.
            </p>
          </div>

          <div className="my-6 md:my-8 lg:pl-6 lg:border-l-4 lg:border-primary bg-blue-50/30 p-5 md:p-6 rounded-[20px] lg:rounded-r-[24px] shadow-sm">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl italic font-bold text-gray-900 leading-snug">
              Every project I take is a step toward turning ideas into reality <span className="text-primary">— with precision, passion, and purpose.</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-6 md:gap-y-8 gap-x-4 md:gap-x-8 mt-4 text-left">
            <motion.div whileHover={{ scale: 1.08 }} className="flex items-center group cursor-pointer">
              <div className="mr-3 md:mr-4 text-primary p-2 bg-blue-50 rounded-lg md:rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-lg border border-transparent group-hover:border-primary/20"><Zap size={18} className="md:w-[22px]" /></div>
              <div>
                <h4 className="font-black text-gray-900 uppercase tracking-wide text-[8px] md:text-[11px] mb-0.5 group-hover:text-primary transition-colors">Full Stack</h4>
                <p className="hidden sm:block text-[8px] md:text-[10px] text-gray-500 font-bold">JS, React, Kotlin.</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.08 }} className="flex items-center group cursor-pointer">
              <div className="mr-3 md:mr-4 text-primary p-2 bg-blue-50 rounded-lg md:rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-lg border border-transparent group-hover:border-primary/20"><ShieldCheck size={18} className="md:w-[22px]" /></div>
              <div>
                <h4 className="font-black text-gray-900 uppercase tracking-wide text-[8px] md:text-[11px] mb-0.5 group-hover:text-primary transition-colors">Solutions</h4>
                <p className="hidden sm:block text-[8px] md:text-[10px] text-gray-500 font-bold">Clean & creative.</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.08 }} className="flex items-center group cursor-pointer">
              <div className="mr-3 md:mr-4 text-primary p-2 bg-blue-50 rounded-lg md:rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-lg border border-transparent group-hover:border-primary/20"><Smartphone size={18} className="md:w-[22px]" /></div>
              <div>
                <h4 className="font-black text-gray-900 uppercase tracking-wide text-[8px] md:text-[11px] mb-0.5 group-hover:text-primary transition-colors">Mobile First</h4>
                <p className="hidden sm:block text-[8px] md:text-[10px] text-gray-500 font-bold">Responsive Web.</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.08 }} className="flex items-center group cursor-pointer">
              <div className="mr-3 md:mr-4 text-primary p-2 bg-blue-50 rounded-lg md:rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-lg border border-transparent group-hover:border-primary/20"><Sparkles size={18} className="md:w-[22px]" /></div>
              <div>
                <h4 className="font-black text-gray-900 uppercase tracking-wide text-[8px] md:text-[11px] mb-0.5 group-hover:text-primary transition-colors">AI Powered</h4>
                <p className="hidden sm:block text-[8px] md:text-[10px] text-gray-500 font-bold">Fast results.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Services = ({ services }: { services: Service[] }) => (
  <section id="services" className="py-16 md:py-32 bg-[#F8FAFC]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="Expert Services" subtitle="Specialized solutions for modern businesses." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {services.map(s => (
          <div key={s.id} className="p-8 md:p-12 bg-white rounded-[24px] md:rounded-[40px] border border-gray-100 hover:shadow-2xl transition-all group">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
              {IconMap[s.icon] || IconMap['Zap']}
            </div>
            <h3 className="text-lg md:text-2xl font-black text-gray-900 mb-2 md:mb-4">{s.title}</h3>
            <p className="text-xs md:text-base text-gray-500 leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Portfolio = ({ items }: { items: Project[] }) => (
  <section id="portfolio" className="py-16 md:py-32 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="Featured Work" subtitle="A selection of high-end projects delivered recently" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="transition-all duration-300"
          >
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block relative rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl aspect-[16/9] bg-gray-100"
            >
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-base md:text-2xl font-black mb-1">{item.title}</h3>
                <p className="text-gray-300 text-[8px] md:text-sm mb-3 md:mb-4 font-medium uppercase tracking-widest">{item.category}</p>
                <div className="text-white text-[10px] md:text-sm font-black flex items-center group-hover:translate-x-2 transition-transform duration-300">
                  VIEW PROJECT <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Reviews = ({ testimonials }: { testimonials: Testimonial[] }) => (
  <section id="reviews" className="py-16 md:py-32 bg-[#F8FAFC]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title="Client Reviews" subtitle="What our partners say about working with us." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {testimonials.map((t, idx) => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[40px] border border-gray-100 shadow-sm relative group hover:shadow-xl transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 border-primary/10" />
              <div>
                <h4 className="text-sm md:text-lg font-black text-gray-900 leading-tight">{t.name}</h4>
                <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
            <p className="text-xs md:text-base text-gray-600 mb-6 md:mb-8 font-medium leading-relaxed italic flex-grow">"{t.content}"</p>
            <div className="flex items-center gap-1 mt-auto text-accent">
              {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} className="md:w-4" fill="currentColor" />)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section id="pricing" className="py-16 md:py-32 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader 
        title="Choose Plans" 
        subtitle="Detailed feature comparison to help you decide" 
      />
      <PricingTable />
      <div className="mt-8 md:mt-12 text-center px-4">
        <Button size="lg" className="rounded-2xl px-10 md:px-12 py-3.5 md:py-5 w-full sm:w-auto text-xs md:text-sm" onClick={() => scrollToSection('contact')}>Get A Custom Quote</Button>
      </div>
    </div>
  </section>
);

// --- MAIN APP ---
const App = () => {
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState(window.location.hash);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [settings, setSettings] = useState<SiteSettings>({
    id: '1', site_name: DEFAULT_NAME, tagline: 'PREMIUM FREELANCE STUDIO', logo_url: '', 
    whatsapp_number: DEFAULT_WA, contact_phone: '+91 95212 07156', contact_email: 'riddhaanleo@gmail.com',
    address: 'India', instagram_url: '#', twitter_url: '#', linkedin_url: '#', footer_text: '',
    seo_description: 'Premium hand-crafted websites designed specifically for Indian startups and professionals.'
  });
  
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [portfolio, setPortfolio] = useState<Project[]>(DEFAULT_PORTFOLIO);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    const init = async () => {
      const handleHash = () => setHash(window.location.hash);
      window.addEventListener('hashchange', handleHash);
      
      try {
        const [s, sv, pt, t] = await Promise.all([
          db.getSiteSettings(), db.getServices(), db.getPortfolio(), db.getTestimonials()
        ]);
        if (s) setSettings(s);
        if (sv && sv.length) setServices(sv);
        if (pt && pt.length) setPortfolio(pt);
        if (t && t.length) setTestimonials(t);
      } catch (err) {
        console.warn("Using local fallbacks.", err);
      }
      
      setLoading(false);
      return () => window.removeEventListener('hashchange', handleHash);
    };
    init();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    const payload = { name, email, phone, message };

    try {
      // Step 1: Save to Database
      const success = await db.submitInquiry(payload);
      
      if (success) {
        alert("Success! Inquiry Saved. I will contact you soon.");
      } else {
        // Log the failure but don't show the scary alert immediately
        console.warn("Database save failed, falling back to direct contact.");
      }
      
      // Step 2: Immediate email notification via mailto (Ensures you get the message no matter what)
      const mailtoUrl = `mailto:${settings.contact_email}?subject=New Inquiry from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0AMessage: ${message}`;
      window.open(mailtoUrl, '_blank');
      
      (e.target as HTMLFormElement).reset();
      
    } catch (err) {
      console.error("Submission error:", err);
      // Even if everything breaks, let them know how to reach you
      alert("Note: Please contact me directly via WhatsApp or Email if the form doesn't work. Thank you!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;

  if (hash === '#admin' || window.location.pathname === '/admin') return <AdminPanel />;

  return (
    <div className="antialiased selection:bg-primary selection:text-white">
      <Navbar settings={settings} />
      <Hero settings={settings} />
      <About />
      <Services services={services} />
      <Portfolio items={portfolio} />
      <Reviews testimonials={testimonials} />
      <Pricing />
      <FAQ />
      
      <section id="contact" className="py-16 md:py-32 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
             <div className="text-center lg:text-left lg:-mt-24">
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter leading-tight">Let's talk about <br className="hidden lg:block" /> your big idea.</h2>
              <p className="text-sm md:text-xl text-gray-400 mb-8 md:mb-12 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
                I'm currently accepting new projects. Fill out the form or send an email to get a response within 12 hours.
              </p>
              <div className="space-y-6 md:space-y-8 flex flex-col items-center lg:items-start">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center group transition-all cursor-pointer"
                  onClick={() => window.location.href = `mailto:${settings.contact_email}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -10 }}
                    className="mr-4 p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/40 transition-colors"
                  >
                    <Mail className="w-8 h-8 text-primary" />
                  </motion.div>
                  <span className="text-base md:text-2xl font-black group-hover:text-primary transition-colors">{settings.contact_email}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center group transition-all cursor-pointer"
                  onClick={() => window.open(`https://wa.me/${settings.whatsapp_number}`, '_blank')}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="mr-4 p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-[#25D366]/20 group-hover:border-[#25D366]/40 transition-colors"
                  >
                    <MessageCircle className="w-8 h-8 text-[#25D366]" />
                  </motion.div>
                  <span className="text-base md:text-2xl font-black group-hover:text-[#25D366] transition-colors">{settings.contact_phone}</span>
                </motion.div>
              </div>
            </div>
            <div className="bg-white rounded-[24px] md:rounded-[48px] p-8 md:p-12 text-gray-900 shadow-2xl">
              <form className="space-y-6 md:space-y-8" onSubmit={handleContactSubmit}>
                <input required name="name" placeholder="Your Name" className="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 outline-none focus:ring-2 focus:ring-primary" />
                <input required name="email" type="email" placeholder="Email Address" className="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 outline-none focus:ring-2 focus:ring-primary" />
                <input required name="phone" type="tel" placeholder="Phone Number" className="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 outline-none focus:ring-2 focus:ring-primary" />
                <textarea required name="message" rows={4} placeholder="Your project..." className="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 outline-none focus:ring-2 focus:ring-primary resize-none" />
                <Button fullWidth disabled={isSubmitting} className="rounded-xl py-4">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'SUBMIT ENQUIRY'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      <Footer settings={settings} />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
