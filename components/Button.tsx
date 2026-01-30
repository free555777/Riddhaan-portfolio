import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-blue-700 text-white shadow-lg",
    secondary: "bg-white hover:bg-gray-100 text-primary shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-sm",
    whatsapp: "bg-green-500 hover:bg-green-600 text-white shadow-lg"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs tracking-widest uppercase",
    md: "px-8 py-3 text-sm tracking-widest uppercase",
    lg: "px-10 py-4 text-base tracking-widest uppercase"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};

export default Button;