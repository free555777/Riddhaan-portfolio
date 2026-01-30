
import React from 'react';
import { Check, Star } from 'lucide-react';
import { PricingPlan } from '../types';
import Button from './Button';

interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (planName: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect }) => {
  return (
    <div className={`relative bg-white rounded-[40px] shadow-xl overflow-hidden border-2 flex flex-col h-full transform transition-all duration-500 hover:scale-[1.02] ${plan.is_popular ? 'border-primary ring-8 ring-blue-50/50 bg-blue-50/10' : 'border-gray-100 hover:border-gray-200'}`}>
      
      {plan.is_popular && (
        <div className="absolute top-8 right-8 bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] flex items-center shadow-lg">
          <Star className="w-3 h-3 mr-2 fill-current" />
          MOST POPULAR
        </div>
      )}

      <div className="p-12 pb-6">
        <h3 className="text-xl font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{plan.name}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-6xl font-black text-gray-900 tracking-tighter">{plan.price}</span>
        </div>
        <div className="text-sm font-black text-primary bg-primary/10 px-4 py-2 rounded-xl w-fit inline-block">
          {plan.pages}
        </div>
      </div>

      <div className="px-12 pb-12 flex-1">
        <ul className="space-y-5">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <p className="ml-4 text-gray-600 font-medium leading-tight">{feature}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-10 bg-gray-50/50 mt-auto border-t border-gray-100">
        <Button 
          fullWidth 
          variant={plan.is_popular ? 'primary' : 'outline'}
          className="rounded-[20px] py-5 font-black tracking-[0.1em]"
          onClick={() => onSelect(plan.name)}
        >
          SELECT {plan.name}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
