'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Timer, ShieldCheck, Lock } from 'lucide-react';

interface PreSeasonGateProps {
  onBypass: () => void;
}

export default function PreSeasonGate({ onBypass }: PreSeasonGateProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [code, setCode] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fecha de lanzamiento: 1 de Junio de 2026
    const launchDate = new Date('2026-06-01T09:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAccess = () => {
    // Código simple para el equipo de desarrollo durante abril/mayo
    if (code === 'MUG2026' || code === 'Iquique') {
      onBypass();
    } else {
      alert('Código de acceso a pre-temporada incorrecto.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/crack_oyarzo.png" alt="BG" fill className="object-cover opacity-10 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 text-center">
        {/* Logos */}
        <div className="flex justify-center items-center gap-12 mb-4">
          <div className="relative w-[150px] h-[70px] transition-all duration-500 hover:scale-110">
            <Image 
              src="/images/logo_sesp.png" 
              alt="SESP" 
              fill 
              className="object-contain invert contrast-[1.5] brightness-200 mix-blend-screen opacity-90" 
            />
          </div>
          <div className="relative w-[150px] h-[70px] transition-all duration-500 hover:scale-110">
            <Image 
              src="/images/logo_impacta.png" 
              alt="Impacta" 
              fill 
              className="object-contain invert contrast-[1.2] brightness-200 mix-blend-screen opacity-90" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 font-black px-4 py-1 uppercase tracking-widest animate-pulse">
            MODO PRE-TEMPORADA
          </Badge>
          <h1 className="text-4xl font-black italic text-white uppercase leading-none tracking-tighter">
            EL ESTADIO ESTÁ EN <br /> <span className="text-primary italic">MANTENIMIENTO</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.3em]">Preparando el gran debut - Junio 2026</p>
        </div>

        {/* Counter */}
        <div className="grid grid-cols-4 gap-2">
          {mounted ? Object.entries(timeLeft).map(([label, value]) => (
            <Card key={label} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-3">
                <p className="text-3xl font-black text-white leading-none">{String(value).padStart(2, '0')}</p>
                <p className="text-[8px] font-black text-primary uppercase mt-1 tracking-tighter">{label}</p>
              </CardContent>
            </Card>
          )) : (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm animate-pulse">
                <CardContent className="p-3 h-16" />
              </Card>
            ))
          )}
        </div>

        <div className="bg-card/50 border border-white/5 p-6 rounded-3xl space-y-4 shadow-2xl">
          <Trophy className="w-12 h-12 text-warning mx-auto animate-bounce" />
          <p className="text-sm text-balance leading-relaxed">
            Estamos afinando los últimos detalles para la campaña de prevención de cáncer de próstata más grande del norte grande.
          </p>
          <div className="pt-4 space-y-3">
              {!showAccessCode ? (
                <Button 
                  variant="outline" 
                  className="w-full border-primary/20 bg-primary/5 text-primary-foreground text-xs font-black uppercase tracking-[0.2em] hover:bg-primary/20 hover:border-primary/40 transition-all py-6 rounded-2xl group"
                  onClick={() => setShowAccessCode(true)}
                >
                  <Lock className="w-4 h-4 mr-2 group-hover:animate-bounce" /> ACCESO STAFF TÉCNICO
                </Button>
              ) : (
               <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <input 
                   type="password" 
                   autoFocus
                   placeholder="Código de Staff" 
                   className="w-full bg-black/40 border-2 border-primary/30 rounded-xl px-4 py-3 text-center font-black tracking-widest focus:border-primary outline-none"
                   value={code}
                   onChange={(e) => setCode(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
                 />
                 <Button onClick={handleAccess} className="w-full bg-primary text-black font-black uppercase">
                   Entrar a la Cancha
                 </Button>
               </div>
             )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8">
           <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              <ShieldCheck className="w-4 h-4 text-success" /> Iquique • Pozo Al Monte • Alto Hospicio • Pica
           </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
