'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  user: any;
  onShowRegistration: () => void;
  onShowLogin: () => void;
  onSetActiveTab: (tab: any) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export default function HeroSection({ user, onShowRegistration, onShowLogin, onSetActiveTab }: HeroSectionProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center space-y-6 pt-8"
    >
      {/* Logos Hero - A color completo, visibles en mobile */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center items-center gap-12 sm:gap-16 mb-8 p-4 rounded-2xl bg-black/10 md:bg-transparent border border-white/5 md:border-none backdrop-blur-sm md:backdrop-blur-none"
      >
        <div className="relative w-[120px] h-[80px] sm:w-[150px] sm:h-[100px] transition-all duration-300 hover:scale-125 active:scale-125 group cursor-pointer">
          <Image
            src="/images/logo_sesp_white.png"
            alt="Fundación SESP"
            fill
            className="object-contain opacity-85 hover:opacity-100 active:opacity-100 transition-all duration-300 drop-shadow-[0_0_24px_rgba(0,212,255,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(0,212,255,0.85)] group-active:drop-shadow-[0_0_40px_rgba(0,212,255,0.85)]"
          />
          <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/60 group-active:ring-primary/60 transition-all duration-300 blur-[1px]" />
        </div>
        <div className="relative w-[120px] h-[80px] sm:w-[150px] sm:h-[100px] transition-all duration-300 hover:scale-125 active:scale-125 group cursor-pointer">
          <Image
            src="/images/logo_impacta_white.png"
            alt="Consultora Impacta"
            fill
            className="object-contain opacity-85 hover:opacity-100 active:opacity-100 transition-all duration-300 drop-shadow-[0_0_24px_rgba(0,212,255,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(0,212,255,0.85)] group-active:drop-shadow-[0_0_40px_rgba(0,212,255,0.85)]"
          />
          <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/60 group-active:ring-primary/60 transition-all duration-300 blur-[1px]" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col items-center gap-1">
        <p className="text-[17px] sm:text-lg font-black text-primary uppercase tracking-[0.5em] mb-1 opacity-90">Campaña 2026</p>
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-black mt-2 tracking-tighter leading-tight drop-shadow-2xl">
        <span className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary animate-gradient-x">MÉTELE UN GOL</span>
        <br />
        <span className="text-white">AL CÁNCER</span>
      </motion.h1>

      <motion.p variants={itemVariants} className="text-white/95 text-xl sm:text-2xl max-w-lg mx-auto font-black uppercase italic leading-tight px-4">
        "Hazte el test de antígeno PSA y queda listo para el 2do tiempo"
      </motion.p>

      {!user ? (
        <motion.div variants={itemVariants} className="flex flex-col gap-3 justify-center mt-6 px-4">
          <Button 
            onClick={onShowRegistration} 
            className="bg-primary text-primary-foreground text-base xs:text-lg sm:text-xl px-4 sm:px-8 py-6 sm:py-8 rounded-2xl animate-pulse-glow font-black shadow-xl shadow-primary/20 uppercase w-full max-w-md mx-auto leading-tight flex items-center justify-center gap-2 whitespace-normal h-auto"
          >
            <span className="text-xl">⚽</span> <span>FICHAR POR MI EQUIPO</span>
          </Button>
          <Button variant="ghost" onClick={onShowLogin} className="text-white text-base font-bold uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity">
            Ya soy del equipo
          </Button>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="flex flex-col gap-3 justify-center mt-6 px-4">
          <Button onClick={() => onSetActiveTab('operativos')} className="bg-primary text-primary-foreground text-lg py-7 rounded-2xl font-black shadow-xl shadow-primary/20 uppercase w-full max-w-md mx-auto flex items-center justify-center gap-2 animate-pulse-glow">
            <Target className="h-6 w-6" /> <span>SALIR A LA CANCHA</span>
          </Button>
          <p className="text-xs text-white/70 italic uppercase font-bold tracking-widest">¡Es hora de jugar tu primer tiempo!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
