'use client';

import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, Check, QrCode, Crown, Share2, Download, LogOut, UserPlus, Users, 
  Play, Pause, Music, Star, Volume2
} from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

interface UserData {
  nombre: string;
  rut: string;
  edad: number;
  comuna: string;
  club?: string;
  esJugador: boolean;
  equipo?: string;
  badges: string[];
  ratings?: { songId: string, stars: number }[];
}

interface SongData {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
  averageRating: number;
  totalRatings: number;
}

interface PerfilUsuarioProps {
  user: UserData | null;
  allBadges: BadgeData[];
  onShowRegistration: () => void;
  onShowLogin: () => void;
  onShowQR: () => void;
  onShare: () => void;
  onLogout: () => void;
  isLoading: boolean;
  songs: SongData[];
  onRateSong: (songId: string, stars: number) => void;
}

function StarRating({ rating, onRate, size = 16 }: { rating: number; onRate: (stars: number) => void; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={(e) => {
            e.stopPropagation();
            onRate(s);
          }}
          className="focus:outline-none transition-transform active:scale-125"
        >
          <Star 
            size={size} 
            className={`${s <= rating ? 'fill-warning text-warning shadow-warning/50' : 'text-muted-foreground/30'} transition-colors`} 
          />
        </button>
      ))}
    </div>
  );
}

function SongItem({ song, userRating, onRate }: { song: SongData; userRating: number; onRate: (stars: number) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      const allAudios = document.querySelectorAll('audio');
      allAudios.forEach(a => {
        if (a !== audio) a.pause();
      });
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3 group/song hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 group/cover shadow-lg">
          {song.coverUrl ? (
            <Image src={song.coverUrl} alt={song.title} fill className="object-cover transition-transform group-hover/song:scale-110" />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary/40" />
            </div>
          )}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover/song:opacity-100'}`}>
            {isPlaying ? <Pause className="w-5 h-5 text-white fill-white" /> : <Play className="w-5 h-5 text-white fill-white" />}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm text-white uppercase italic tracking-tight truncate leading-none mb-1">
            {song.title}
          </p>
          <div className="flex items-center gap-2">
            <StarRating 
              rating={userRating || Math.round(song.averageRating || 0)} 
              onRate={onRate} 
              size={12} 
            />
            <span className="text-[9px] font-black text-primary uppercase tracking-tighter opacity-60">
              {(song.totalRatings || 0) > 0 ? `${(song.averageRating || 0).toFixed(1)} Pts` : 'Sin votos'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <audio ref={audioRef} id={`audio-${song.id}`} src={song.audioUrl} preload="none" />
          <Button 
            size="icon" 
            variant="ghost" 
            className={`w-10 h-10 rounded-full transition-all active:scale-90 ${isPlaying ? 'bg-primary text-black' : 'hover:bg-primary/20 hover:text-primary'}`}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
        </div>
      </div>

      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
        <div 
          className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_#00D4FF] transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function BadgeItem({ badge, earned }: { badge: BadgeData; earned: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = earned ? `${badge.color}20` : 'rgba(255,255,255,0.05)';
      containerRef.current.style.border = `2px solid ${earned ? badge.color : 'transparent'}`;
    }
    if (iconRef.current) {
      iconRef.current.style.color = earned ? badge.color : 'currentColor';
    }
  }, [earned, badge.color]);

  return (
    <Card className={`bg-card/90 border-2 transition-all duration-500 overflow-hidden relative group ${earned ? 'border-success/30 shadow-success/10' : 'border-white/5 opacity-40 grayscale'}`}>
      {earned && <div className="absolute inset-0 bg-gradient-to-b from-success/5 to-transparent pointer-events-none" />}
      <CardContent className="py-4 relative z-10">
        <div className="flex flex-col items-center text-center gap-2">
          <div ref={containerRef} className="w-14 h-14 rounded-full flex items-center justify-center relative transition-transform group-hover:scale-110 duration-500">
            {/* @ts-ignore */}
            <badge.icon ref={iconRef} className={`h-7 w-7 ${earned ? 'animate-pulse-slow shadow-glow' : ''}`} />
            {earned && (
              <div className="absolute -top-1 -right-1 bg-success rounded-full p-1 shadow-lg">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="font-black text-[11px] text-white uppercase leading-tight tracking-tight">{badge.name}</p>
            <p className="text-[9px] text-muted-foreground mt-1 leading-tight font-black uppercase italic tracking-tighter opacity-80">{badge.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PerfilUsuario({ 
  user, allBadges, onShowRegistration, onShowLogin, onShowQR, onShare, onLogout, isLoading, songs, onRateSong 
}: PerfilUsuarioProps) {
  if (!user) {
    return (
      <div className="px-4 py-12 text-center space-y-6">
        <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden bg-primary/10 mb-4 p-4 border-2 border-dashed border-primary/30 relative group">
          <Image src="/images/camiseta_cdi.png" alt="Perfil" width={100} height={100} className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-12 h-12 text-primary/30" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black italic text-white uppercase italic">¿Aún no estás en la lista?</h2>
          <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest leading-tight px-8">Inscríbete para ver tus trofeos y participar en el sorteo</p>
        </div>
        <div className="flex flex-col gap-3 justify-center max-w-xs mx-auto pt-4">
          <Button className="bg-primary text-primary-foreground text-lg py-7 rounded-2xl font-black shadow-xl shadow-primary/20 uppercase animate-pulse-glow" onClick={onShowRegistration}>
            <UserPlus className="w-6 h-6 mr-3" /> Fichar ahora
          </Button>
          <Button variant="ghost" onClick={onShowLogin} className="text-white font-black uppercase text-sm italic py-6">
            <LogOut className="w-4 h-4 mr-2" /> Soy del equipo
          </Button>
        </div>
      </div>
    );
  }

  const initials = (user.nombre || 'CZ').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') || 'CZ';
  const userBadges = Array.isArray(user.badges) ? user.badges : [];
  const userRatings = Array.isArray(user.ratings) ? user.ratings : [];
  const tracks = Array.isArray(songs) ? songs : [];

  return (
    <div className="px-1 py-4 space-y-6">
      <Card className="bg-card/90 border-border overflow-hidden relative border-none">
        <div className="h-28 relative overflow-hidden">
          <Image src="/images/camiseta_cdi.png" alt="Banner" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>
        <CardContent className="pt-14 pb-6 relative">
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-[2rem] border-4 border-card bg-gradient-to-br from-primary/60 via-primary/40 to-primary/10 flex items-center justify-center shadow-xl shadow-primary/30">
              <span className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                {initials}
              </span>
            </div>
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{user.nombre}</h2>
              <p className="text-primary text-xs font-black uppercase tracking-widest opacity-80">{user.comuna}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {user.club && (
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 font-black uppercase text-[10px] py-1 px-3 rounded-full">
                    🏆 {user.club}
                  </Badge>
                )}
                {user.esJugador && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] py-1 px-3 rounded-full">
                    ⚽ {user.equipo || 'Liga Amateur'}
                  </Badge>
                )}
              </div>
            </div>
            <Button size="icon" className="bg-primary/20 hover:bg-primary/30 text-primary rounded-xl" onClick={onShowQR}>
              <QrCode className="h-6 w-6" />
            </Button>
          </div>
          
          <Separator className="bg-white/5 my-6" />
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-50">RUT REGISTRADO</p>
              <p className="font-black text-white italic tracking-tighter">{user.rut}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-50">EDAD</p>
              <p className="font-black text-white italic tracking-tighter">{user.edad} AÑOS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participación Status */}
      <Card className="relative overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10 group bg-card/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-success/5 pointer-events-none" />
        <CardContent className="py-7 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">ESTADO DEL JUGADOR</p>
                <h3 className="text-2xl font-black text-white italic tracking-tight">LISTO PARA EL SORTEO</h3>
              </div>
              <div className="bg-primary/20 p-4 rounded-3xl rotate-12 group-hover:rotate-0 transition-all duration-700 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                <Check className="h-8 w-8 text-primary shadow-glow" />
              </div>
            </div>

            <div className="space-y-4">
              {[
                { n: '1', t: 'FICHADO', d: 'INSCRIPCIÓN EXITOSA', s: 'done' },
                { n: '2', t: 'PARTIDO JUGADO', d: 'TEST PSA REALIZADO', s: 'done' },
                { n: '3', t: 'CONFIRMADO', d: 'PARTICIPA EN SORTEO 04/07', s: 'pending' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${step.s === 'done' ? 'bg-success border-success shadow-lg shadow-success/20' : 'bg-warning border-warning animate-pulse'}`}>
                    <Check className={`w-3.5 h-3.5 text-black font-black`} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white leading-none mb-1 uppercase italic tracking-tight">{step.n}. {step.t}</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${step.s === 'done' ? 'text-success/80' : 'text-warning/80'}`}>{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
          <Crown className="w-6 h-6 text-warning drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" /> Vitrina de Trofeos
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {allBadges.map((badge) => (
            <BadgeItem key={badge.id} badge={badge} earned={(user?.badges || []).includes(badge.id)} />
          ))}
        </div>
      </div>
      
      {/* Banda Sonora Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
          <Music className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]" /> Banda Sonora MUG Z
        </h3>
        
        <Card className="bg-card/90 border-border overflow-hidden relative border-none">
          <CardContent className="p-0">
            <div className="flex flex-col">
              {tracks.map((song) => {
                const ratingObj = userRatings.find(r => r.songId === song.id);
                const userRating = ratingObj ? ratingObj.stars : 0;
                return (
                  <SongItem 
                    key={song.id}
                    song={song}
                    userRating={userRating}
                    onRate={(stars) => onRateSong(song.id, stars)}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viral Card */}
      <Card className="bg-gradient-to-br from-primary/30 to-background border-primary/40 overflow-hidden relative group shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 group-hover:scale-125 transition-all duration-700 pointer-events-none">
          <Share2 className="w-20 h-20" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-black text-white uppercase italic tracking-tight text-lg">Arma tu propio equipo</p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mt-1">Invita a tus amigos y rinde el examen juntos.</p>
            </div>
          </div>
          <Button 
            className="w-full bg-primary text-primary-foreground font-black uppercase italic py-7 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3" 
            onClick={onShare} 
            disabled={isLoading}
          >
            <Share2 className="w-5 h-5" /> 
            <span>Alienta al Equipo</span>
          </Button>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="space-y-3 pt-4">
        <Button variant="outline" className="w-full justify-between py-6 rounded-xl border-white/10 hover:border-primary/50 transition-all font-bold group">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-primary group-hover:animate-bounce" /> 
            <span className="uppercase text-xs tracking-widest">Descargar certificado</span>
          </div>
          <Check className="h-4 w-4 text-success opacity-50" />
        </Button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-4 text-destructive/70 hover:text-destructive font-black uppercase text-xs tracking-[0.2em] transition-all"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión técnica
        </button>
      </div>
    </div>
  );
}
