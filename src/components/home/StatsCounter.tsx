'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

import { motion } from 'framer-motion';

interface StatsCounterProps {
  displayCount: number;
  progressPercent: number;
}

export default function StatsCounter({ displayCount, progressPercent }: StatsCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Card className="bg-card/90 backdrop-blur border-border overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <CardContent className="pt-6">
          <div className="flex justify-between items-end mb-4">
            <div className="space-y-1">
              <p className="text-xs uppercase font-black text-primary tracking-widest">MARCADOR CAMPAMENTO</p>
              <h3 className="text-3xl font-black text-white italic tracking-tighter">HINCHAS FICHADOS</h3>
            </div>
            <div className="text-right">
              <motion.p 
                key={displayCount}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-black text-primary leading-none"
              >
                {displayCount}
              </motion.p>
              <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Meta: 800 Goles</p>
            </div>
          </div>
          
          <div className="relative h-6 w-full bg-muted/50 rounded-full border-2 border-border overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary/80 to-success"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[10px] font-black text-white drop-shadow-md">{Math.round(progressPercent)}% COMPLETADO</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1 opacity-70">
              <Target className="w-3 h-3" /> TODO IQUIQUE EN LA CANCHA
            </p>
            <p className="text-xs text-success font-black italic uppercase tracking-tighter">Camino al Gran Sorteo</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
