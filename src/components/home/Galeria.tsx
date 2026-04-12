'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ThumbsUp, MessageCircle, ExternalLink, Camera, Share2 
} from 'lucide-react';

interface GaleriaItem {
  id: number;
  tipo: 'foto' | 'video';
  titulo: string;
  descripcion: string;
  fecha: string;
  likes: number;
  comentarios: number;
  imagen: string;
}

interface GaleriaProps {
  items: GaleriaItem[];
  onOpenItem: (item: GaleriaItem) => void;
}

export default function Galeria({ items, onOpenItem }: GaleriaProps) {
  return (
    <div className="px-1 py-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-primary/50 rounded-full" />
          <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Campaña 2026</p>
          <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-primary/50 rounded-full" />
        </div>
        <h1 className="text-3xl font-black italic text-white uppercase tracking-tight leading-none">📸 Galería</h1>
        <div className="flex items-center justify-center gap-2">
          <p className="text-primary text-sm font-bold uppercase tracking-widest">Los mejores momentos</p>
          <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px]">{items.length} FOTOS</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <Card
            key={item.id}
            className="bg-card/90 border-border overflow-hidden group cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
            onClick={() => onOpenItem(item)}
          >
            <div className="aspect-square relative overflow-hidden">
              <Image 
                src={item.imagen} 
                alt={item.titulo} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              
              {idx === 0 && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-success text-success-foreground font-black text-[9px] uppercase animate-pulse shadow-md border-none">🆕 NUEVA</Badge>
                </div>
              )}
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
                  <ExternalLink className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <p className="font-black text-xs text-white uppercase italic leading-tight tracking-tight truncate">{item.titulo}</p>
                <div className="flex items-center gap-3 text-[10px] text-white/80 mt-1">
                  <span className="flex items-center gap-1 font-bold"><ThumbsUp className="w-2.5 h-2.5 text-primary" />{item.likes}</span>
                  <span className="flex items-center gap-1 font-bold"><MessageCircle className="w-2.5 h-2.5 text-primary" />{item.comentarios}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary/10 via-card to-success/10 border-primary/20 overflow-hidden relative group">
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
            <Camera className="w-32 h-32" />
        </div>
        <CardContent className="py-6 text-center relative z-10">
          <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/30">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <p className="font-black text-white uppercase italic text-sm">¿Tienes fotos de la campaña?</p>
          <p className="text-xs text-muted-foreground mb-4">Ayúdanos a mostrar la pasión del equipo</p>
          <Button variant="outline" className="border-primary/50 font-black uppercase text-xs px-6 py-5 rounded-xl hover:bg-primary/20 transition-all">
            <Share2 className="w-4 h-4 mr-2" />
            Subir contenido
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
