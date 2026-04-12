'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Operativo {
  id: number;
  fecha: string;
  hora: string;
  lugar: string;
  direccion: string;
  cupos: number;
  cuposDisponibles: number;
  estado: 'disponible' | 'completo' | 'finalizado';
  imagen: string;
}

interface OperativoCardProps {
  operativo: Operativo;
  onSchedule: (operativo: Operativo) => void;
}

export default function OperativoCard({ operativo, onSchedule }: OperativoCardProps) {
  return (
    <Card 
      className={`bg-card/90 border-2 border-dashed border-border/50 relative overflow-hidden transition-all group ${operativo.estado === 'completo' ? 'opacity-50 grayscale' : 'hover:border-primary/50 hover:shadow-lg shadow-primary/5 shadow-[0_0_15px_rgba(0,212,255,0.05)] cursor-pointer'}`}
      onClick={() => operativo.estado !== 'completo' && onSchedule(operativo)}
    >
      {/* Tick de Estadio - Perforación Visual Responsiva */}
      <div className="absolute top-0 bottom-0 left-[25%] border-l-2 border-dashed border-border/30 z-20" />
      
      {/* Muescas del ticket */}
      <div className="absolute top-[-10px] left-[25%] w-5 h-5 bg-background rounded-full -translate-x-1/2 z-30 shadow-inner" />
      <div className="absolute bottom-[-10px] left-[25%] w-5 h-5 bg-background rounded-full -translate-x-1/2 z-30 shadow-inner" />

      <div className="flex h-36 xs:h-32">
        {/* Lado Fecha (Stub) */}
        <div className="w-[25%] bg-primary/10 flex flex-col items-center justify-center border-r border-border/20 p-2 text-center shrink-0">
          <span className="text-[9px] font-black text-primary uppercase tracking-tighter">FECHA</span>
          <span className="text-xl xs:text-2xl font-black text-white leading-none">{operativo.fecha.split(' ')[0]}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{operativo.fecha.split(' ')[1]}</span>
        </div>

        {/* Cuerpo de la Entrada */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-20 xs:w-24 h-full relative shrink-0">
            <Image 
              src={operativo.imagen} 
              alt={operativo.lugar} 
              fill 
              className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/40 to-transparent" />
          </div>

          <CardContent className="py-3 px-3 xs:px-4 flex-1 flex flex-col justify-between min-w-0">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">PARTIDO PREVENTIVO ⚽</p>
              <p className="font-black text-white text-base xs:text-lg leading-tight uppercase italic truncate">{operativo.lugar}</p>
              <div className="flex flex-col gap-0.5 text-xs text-muted-foreground font-bold">
                <span className="flex items-center gap-1 truncate"><Clock className="h-3 w-3 text-primary shrink-0" /> {operativo.hora}</span>
                <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 text-primary shrink-0" /> {operativo.direccion}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              {operativo.estado === 'completo' ? (
                <Badge variant="destructive" className="text-[10px] font-black uppercase italic h-5">AGOTADO</Badge>
              ) : (
                <Badge className="bg-success text-success-foreground text-[10px] font-black uppercase animate-pulse-slow h-5">
                  {operativo.cuposDisponibles} CUPOS
                </Badge>
              )}
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest hidden xs:inline">ADMIT ONE</span>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
