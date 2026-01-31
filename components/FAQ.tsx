
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { FAQ_DATA } from '../constants.ts';
import * as db from '../services/supabase.ts';
import { FAQItem } from '../types.ts';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQ_DATA);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await db.getFAQs();
        if (data && data.length > 0) setFaqs(data);
      } catch (e) {
        console.warn("Could not fetch FAQs from DB, using defaults.");
      }
    };
    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6">Frequently Asked Questions</h2>
          <p className="text-base md:text-xl text-gray-600">Everything you need to know about our process and services.</p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((item, index) => (
            <div 
              key={item.id || index} 
              className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
              >
                <span className="text-base md:text-lg font-black text-gray-900 pr-4">{item.question}</span>
                <div className={`p-1.5 md:p-2 rounded-full transition-colors flex-shrink-0 ${activeIndex === index ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'}`}>
                  {activeIndex === index ? <Minus size={18} className="md:w-5" /> : <Plus size={18} className="md:w-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 text-sm md:text-base text-gray-600 leading-relaxed font-medium">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
