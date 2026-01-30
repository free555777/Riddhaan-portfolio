
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_NAME } from '../constants.ts';
import Button from './Button.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: any, id: string) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all ${scrolled ? 'py-4 bg-white/95 shadow-lg' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="font-black text-2xl text-primary uppercase cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          {SITE_NAME}
        </div>
        <div className="hidden lg:flex items-center space-x-8">
          {['home', 'about', 'services', 'portfolio', 'pricing'].map(id => (
            <a key={id} href={`#${id}`} onClick={(e) => handleScrollTo(e, id)} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">
              {id}
            </a>
          ))}
          <Button variant="primary" size="sm" onClick={(e) => handleScrollTo(e, 'contact')}>Start Project</Button>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 bg-gray-100 rounded-xl"><Menu /></button>
      </div>
    </nav>
  );
};

export default Navbar;
