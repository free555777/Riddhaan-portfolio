
import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingTable = () => {
  const features = [
    { name: 'Number of Pages', basic: '3-4', standard: '8-10', premium: 'up to 30' },
    { name: 'Responsive Design', basic: true, standard: true, premium: true },
    { name: 'Custom Design', basic: 'Simple', standard: true, premium: true },
    { name: 'Admin Panel (CMS)', basic: true, standard: true, premium: 'Advanced' },
    { name: 'WhatsApp Integration', basic: true, standard: true, premium: true },
    { name: 'Contact Forms', basic: 'Basic', standard: 'Advanced', premium: 'Advanced' },
    { name: 'SEO Optimization', basic: 'Basic', standard: true, premium: 'Advanced' },
    { name: 'Performance Optimization', basic: false, standard: 'Standard', premium: 'Advanced' },
    { name: 'Security Features', basic: 'Basic', standard: 'Standard', premium: 'Enhanced' },
    { name: 'Delivery Time', basic: '5-7 days', standard: '7-10 days', premium: 'Priority' },
    { name: 'Support Duration', basic: '15 days', standard: '30 days', premium: '6 months' },
  ];

  const renderValue = (val: string | boolean) => {
    if (val === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
    if (val === false) return <X className="w-5 h-5 text-red-500 mx-auto" />;
    return <span className="text-gray-700 font-medium text-xs md:text-sm">{val}</span>;
  };

  return (
    <div className="w-full overflow-x-auto rounded-[20px] md:rounded-[30px] shadow-2xl bg-white border border-gray-100">
      <table className="w-full text-center border-collapse min-w-[600px] md:min-w-[800px]">
        <thead>
          <tr className="bg-[#7C3AED] text-white">
            <th className="py-4 md:py-6 px-4 md:px-8 text-left font-black uppercase tracking-widest text-[10px] md:text-sm w-1/4">Features</th>
            <th className="py-4 md:py-6 px-2 md:px-4 w-1/4">
              <div className="font-black text-sm md:text-xl">Basic</div>
              <div className="text-[10px] md:text-sm opacity-80 font-bold">₹2,999</div>
            </th>
            <th className="py-4 md:py-6 px-2 md:px-4 w-1/4">
              <div className="font-black text-sm md:text-xl">Standard</div>
              <div className="text-[10px] md:text-sm opacity-80 font-bold">₹5,999</div>
            </th>
            <th className="py-4 md:py-6 px-2 md:px-4 w-1/4">
              <div className="font-black text-sm md:text-xl">Premium</div>
              <div className="text-[10px] md:text-sm opacity-80 font-bold">₹9,999</div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {features.map((f, idx) => (
            <motion.tr 
              key={f.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="py-3 md:py-5 px-4 md:px-8 text-left font-bold text-gray-900 border-r border-gray-50 text-xs md:text-sm">{f.name}</td>
              <td className="py-3 md:py-5 px-2 md:px-4 border-r border-gray-50">{renderValue(f.basic)}</td>
              <td className="py-3 md:py-5 px-2 md:px-4 border-r border-gray-50">{renderValue(f.standard)}</td>
              <td className="py-3 md:py-5 px-2 md:px-4">{renderValue(f.premium)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
