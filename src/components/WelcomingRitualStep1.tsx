import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface WelcomingRitualStep1Props {
  onNext: (name: string) => void;
}

export function WelcomingRitualStep1({ onNext }: WelcomingRitualStep1Props) {
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF6E3] via-[#FAF0E6] to-[#FDF6E3] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-12 w-40 h-40 bg-gradient-to-br from-[#D4AF37]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl" />
      </motion.div>

      {/* Pulsing center light */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeatType: "loop",
          ease: "easeInOut"
        }}
        style={{ 
          boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)" 
        }}
      />

      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <img 
            src={logo} 
            alt="Divine Counter" 
            className="w-20 h-20 mx-auto drop-shadow-lg opacity-90" 
          />
        </motion.div>

        {/* Namaste Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <motion.h1 
            className="text-4xl text-[#D4AF37] mb-4"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            {name ? `Namaste, ${name}` : "Namaste"}
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            The divine light in me honors the divine light in you
          </motion.p>
        </motion.div>

        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <motion.p 
            className="text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            How may we address you<br />on your sacred journey?
          </motion.p>
          
          <div className="relative">
            <motion.input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your name"
              className="w-full text-center text-xl bg-transparent border-0 border-b-2 border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none py-4 text-[#D4AF37] placeholder-[#D4AF37]/50 transition-all duration-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                fontSize: '1.25rem',
                fontWeight: '400'
              }}
            />
            <motion.div
              className="absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: name ? '100%' : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            
            {/* Gentle glow effect when typing */}
            {name && (
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent rounded-full blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="group flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
          >
            <span>Continue</span>
            <ChevronRight 
              size={18} 
              className="group-hover:translate-x-1 transition-transform duration-300" 
            />
          </button>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12"
        >
          <div className="flex justify-center gap-2">
            <div className="w-8 h-1 bg-[#D4AF37] rounded-full" />
            <div className="w-2 h-1 bg-[#D4AF37]/30 rounded-full" />
            <div className="w-2 h-1 bg-[#D4AF37]/30 rounded-full" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Step 1 of 3</p>
        </motion.div>
      </div>
    </div>
  );
}