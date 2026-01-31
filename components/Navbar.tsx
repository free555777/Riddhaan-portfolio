
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

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled || isOpen ? 'py-4 bg-white/95 shadow-lg backdrop-blur-md' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center relative">
        <div 
          className="font-black text-2xl text-primary uppercase cursor-pointer select-none" 
          onClick={() => {
            setIsOpen(false);
            window.scrollTo({top: 0, behavior: 'smooth'});
          }}
        >
          {SITE_NAME}<span className="text-accent">.</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {['home', 'about', 'services', 'portfolio', 'pricing'].map(id => (
            <a 
              key={id} 
              href={`#${id}`} 
              onClick={(e) => handleScrollTo(e, id)} 
              className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
            >
              {id}
            </a>
          ))}
          <Button variant="primary" size="sm" onClick={(e) => handleScrollTo(e as any, 'contact')}>Start Project</Button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden p-2 bg-gray-100 rounded-xl transition-all hover:bg-gray-200 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="text-primary" size={24} /> : <Menu className="text-gray-900" size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 overflow-hidden z-[101]"
            >
              <div className="flex flex-col p-6 space-y-2">
                {['home', 'about', 'services', 'portfolio', 'pricing'].map(id => (
                  <a 
                    key={id} 
                    href={`#${id}`} 
                    onClick={(e) => handleScrollTo(e, id)} 
                    className="text-sm font-black uppercase tracking-widest text-gray-600 hover:text-primary py-4 px-2 border-b border-gray-50 last:border-0 transition-all cursor-pointer block"
                  >
                    {id}
                  </a>
                ))}
                <div className="pt-4">
                  <Button 
                    variant="primary" 
                    size="md" 
                    fullWidth 
                    onClick={(e) => handleScrollTo(e as any, 'contact')}
                    className="cursor-pointer"
                  >
                    Start Project
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
