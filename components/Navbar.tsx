
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_NAME } from '../constants';
import Button from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Portfolio', id: 'portfolio' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Pricing', id: 'pricing' },
  ];

  const handleScrollTo = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    // Prevent default anchor behavior
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    // Close the mobile menu first
    setIsOpen(false);
    
    // Special handling for admin/privacy/terms hashes if they were implemented as separate pages
    const isSpecialPage = ['#privacy', '#terms', '#admin'].includes(window.location.hash);
    if (isSpecialPage) {
      window.location.hash = id;
      return;
    }

    // Scroll to the element with ID
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 85; // Compensation for the fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL hash without causing a jump
      if (history.pushState) {
        history.pushState(null, '', `#${id}`);
      } else {
        window.location.hash = id;
      }
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 md:py-4 bg-white/95 backdrop-blur-md shadow-lg' : 'py-6 md:py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-shrink-0 flex items-center cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className={`font-black text-2xl md:text-3xl tracking-tighter transition-colors ${scrolled ? 'text-gray-900' : 'text-primary'}`}>
              {SITE_NAME}
            </span>
            <div className="ml-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full group-hover:scale-150 transition-transform"></div>
          </motion.div>

          {/* Desktop Nav - visible only on lg screens (1024px+) */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative group"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleScrollTo(e, link.id)}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: hoveredLink === link.id ? "100%" : "0%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute -bottom-1 left-0 h-[2px] bg-primary rounded-full"
                />
              </div>
            ))}
            <Button 
              variant="primary" 
              size="sm"
              className="rounded-xl px-6"
              onClick={(e) => handleScrollTo(e as any, 'contact')}
            >
              Start Project
            </Button>
          </div>

          {/* Mobile/Tablet menu button - hidden on lg screens */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 focus:outline-none p-2 rounded-xl bg-gray-100 shadow-sm border border-gray-200"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Nav Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl overflow-hidden z-50 lg:hidden"
          >
            <div className="p-8 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.id}`}
                  className="block text-2xl md:text-3xl font-black text-gray-900 hover:text-primary transition-colors py-2"
                  onClick={(e) => handleScrollTo(e, link.id)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-8">
                <Button 
                  fullWidth 
                  size="lg"
                  className="rounded-2xl py-5 md:py-6"
                  onClick={(e) => handleScrollTo(e as any, 'contact')}
                >
                  Get a Free Proposal
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
