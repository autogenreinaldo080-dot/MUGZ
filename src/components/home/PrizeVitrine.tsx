'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Ticket, Star, Crown } from 'lucide-react';

export default function PrizeVitrine() {
  const prizes = [
    { image: "/images/camiseta_cdi.png", title: 'Camiseta CDI Oficial', desc: 'Autografiada por el plantel', qty: '5x', gradient: null },
    { image: "/images/balon_molten.png", title: 'Balón firmado CDI', desc: 'Balón Molten Vantaggio', qty: '5x', gradient: null, objectPosition: 'center 30%', objectScale: true },
    { image: "/images/indumentaria_personal.png", title: 'Indumentaria Deportiva Personal', desc: 'Camiseta, pantalón corto, medias, zapatos', qty: '5x', gradient: null },
    { image: "/images/indumentaria_equipo.png", title: 'Indumentaria Equipos', desc: 'Para 15 personas: Camiseta, pantalón corto, medias. Incluye guantes y camiseta mangas largas.', qty: '5x', gradient: null },
    { image: null, icon: <Ticket className="w-10 h-10 text-warning drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]" />, title: 'Andes Numerada', desc: 'Acceso total al estadio · 1 temporada completa', qty: '1x', gradient: 'from-yellow-900/80 via-warning/20 to-orange-900/60', emoji: '🎟️' },
    { image: null, icon: <Star className="w-10 h-10 text-warning drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]" />, title: 'Andes Accionista', desc: 'Beneficios exclusivos de socio · 1 año completo', qty: '1x', gradient: 'from-amber-900/80 via-yellow-700/30 to-warning/20', emoji: '⭐' },
    { image: null, icon: <Crown className="w-10 h-10 text-warning drop-shadow-[0_0_16px_rgba(234,179,8,0.7)]" />, title: 'Pacífico VIP', desc: 'Sector premium frente al mar · 1 temporada', qty: '1x', gradient: 'from-blue-900/80 via-primary/30 to-cyan-900/60', emoji: '🌊' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black italic text-white uppercase italic">🎁 Vitrina de Premios</h2>
        <Badge className="bg-warning text-warning-foreground font-black animate-pulse">23 PREMIOS TOTAL</Badge>
      </div>

      <Card className="bg-gradient-to-br from-warning/20 to-primary/10 border-2 border-warning/50 shadow-lg shadow-warning/10 overflow-hidden">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-warning/20 p-2 rounded-lg">
              <Trophy className="h-8 w-8 text-warning" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-warning tracking-widest leading-none mb-1">FECHA DEL SORTEO</p>
              <p className="text-xl font-black text-white leading-none">04/07/2026</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-warning tracking-widest leading-none mb-1">HORA</p>
            <p className="text-xl font-black text-white leading-none">12:00 HRS</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {prizes.map((item, i) => (
          <Card key={i} className="bg-gradient-to-b from-card to-card/50 border-border overflow-hidden relative group hover:border-warning/30 transition-all shadow-md">
            <div className="aspect-square relative flex flex-col items-center justify-center bg-white/5 p-4 gap-3">
              {item.image ? (
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className={`object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 blur-[0.3px] group-hover:blur-0 ${'objectScale' in item && item.objectScale ? 'group-hover:scale-110 scale-105' : 'group-hover:scale-110'}`} 
                    style={'objectPosition' in item && item.objectPosition ? { objectPosition: item.objectPosition } : {}} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                </div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-all duration-700 group-hover:opacity-90`} />
              )}
              {!item.image && (
                <>
                  <div className="absolute top-3 left-3 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">{item.emoji}</div>
                  <div className="absolute bottom-3 right-3 text-3xl opacity-10 group-hover:opacity-20 transition-opacity rotate-12">{item.emoji}</div>
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-warning/30 shadow-[0_0_20px_rgba(234,179,8,0.2)] group-hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                  </div>
                </>
              )}
              <div className="absolute top-2 right-2 z-20">
                <Badge className="bg-warning text-warning-foreground font-black shadow-lg border-2 border-warning/20 italic">{item.qty}</Badge>
              </div>
            </div>
            <CardContent className="p-3 text-center border-t border-white/5 relative z-10">
              <p className="text-[11px] font-black text-white leading-tight uppercase tracking-tighter drop-shadow-md">{item.title}</p>
              <p className="text-[9px] text-warning/90 mt-1 leading-tight font-bold italic drop-shadow-sm">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
