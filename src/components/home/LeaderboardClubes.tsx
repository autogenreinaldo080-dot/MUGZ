'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface LeaderboardItem {
  id: string | number;
  nombre: string;
  miembros: number;
  logo?: string;
}

interface LeaderboardClubesProps {
  clubLeaderboard: LeaderboardItem[];
}

export default function LeaderboardClubes({ clubLeaderboard }: LeaderboardClubesProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-card/90 border-border overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-warning/5 pointer-events-none" />
        <div className="flex flex-col items-center justify-center p-6 text-center border-b border-white/5 bg-gradient-to-b from-primary/5 to-transparent relative z-10">
          <Trophy className="h-10 w-10 text-warning mb-2 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] transition-transform group-hover:scale-110 duration-500" />
          <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Ranking de Clubes</h3>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">¡El club con más hinchas gana indumentaria completa!</p>
        </div>
        <CardContent className="py-4 relative z-10">
          <div className="space-y-2">
            {clubLeaderboard.map((item, i) => (
              <div key={item.id || i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group/item">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs italic ${i === 0 ? 'bg-warning text-warning-foreground shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-muted/30 text-muted-foreground'}`}>
                  {i + 1}
                </div>
                {item.logo && (
                  <div className="relative w-8 h-8 shrink-0">
                    <img src={item.logo} alt={item.nombre} className="object-contain w-full h-full" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-black text-white text-sm uppercase italic tracking-tight">{item.nombre}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.miembros} EXÁMENES REALIZADOS</p>
                </div>
                <div className="text-right">
                  <div className="bg-primary/20 px-3 py-1 rounded-lg border border-primary/20 shadow-inner group-hover/item:bg-primary/30 transition-colors">
                    <p className="font-black text-primary text-sm leading-none">{item.miembros}</p>
                    <p className="text-[8px] font-black text-warning mt-0.5 whitespace-nowrap uppercase">Hinchas</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
