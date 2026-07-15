import { motion } from 'motion/react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loader({ message = 'Retrieving real-time metrics...', size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative">
        {/* Outer glowing pulse ring */}
        <div className="absolute -inset-1 rounded-full bg-orange-500/20 blur animate-pulse" />
        
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className={`${sizeClasses[size]} rounded-full border-t-orange-500 border-r-transparent border-b-slate-700 border-l-slate-700`}
        />
      </div>
      
      {message && (
        <p className="mt-4 text-sm text-slate-400 font-medium tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
