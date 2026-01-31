
import React from 'react';
import { Mail, Phone, MapPin, Globe, MessageCircle } from 'lucide-react';
import { SITE_NAME } from '../constants.ts';
import { SiteSettings } from '../types.ts';

interface FooterProps {
  settings?: SiteSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0B1120] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-8">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={SITE_NAME} className="h-8 md:h-10 w-auto object-contain" />
              ) : (
                <div className="flex items-center">
                  <h2 className="text-3xl font-black tracking-tighter uppercase text-primary">{SITE_NAME}</h2>
                  <div className="w-3 h-3 bg-accent rounded-full ml-1.5 mt-1 shadow-sm"></div>
                </div>
              )}
            </div>
            <p className="text-gray-400 leading-relaxed font-medium">
              Premium custom web development for startups and visionaries. Focused on speed, aesthetics, and results.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-primary text-sm font-black uppercase tracking-[0.2em] mb-8">Quick Links</h3>
            <ul className="space-y-4">
              <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors font-medium">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors font-medium">About</button></li>
              <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors font-medium">Services</button></li>
              <li><button onClick={() => scrollToSection('portfolio')} className="text-gray-400 hover:text-white transition-colors font-medium">Portfolio</button></li>
              <li><button onClick={() => scrollToSection('reviews')} className="text-gray-400 hover:text-white transition-colors font-medium">Reviews</button></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-primary text-sm font-black uppercase tracking-[0.2em] mb-8">Specialties</h3>
            <ul className="space-y-4">
              <li className="text-gray-400 font-medium">React Applications</li>
              <li className="text-gray-400 font-medium">Tailwind Design</li>
              <li className="text-gray-400 font-medium">E-Commerce Stores</li>
              <li className="text-gray-400 font-medium">Performance Tuning</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-primary text-sm font-black uppercase tracking-[0.2em] mb-8">Contact</h3>
            <ul className="space-y-6">
              <li className="flex items-center space-x-4">
                <div className="text-primary"><Mail size={20} /></div>
                <span className="text-gray-400 font-medium">{settings?.contact_email || 'riddhaanleo@gmail.com'}</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="text-primary"><MessageCircle size={20} className="text-[#25D366]" /></div>
                <span className="text-gray-400 font-medium">{settings?.contact_phone || '+91 95212 07156'}</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="text-primary"><MapPin size={20} /></div>
                <span className="text-gray-400 font-medium">{settings?.address || 'India - Remote Global'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase">
            &copy; {new Date().getFullYear()} {SITE_NAME} STUDIO. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
