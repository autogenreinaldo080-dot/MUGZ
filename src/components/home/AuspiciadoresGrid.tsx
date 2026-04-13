'use client';

import Image from 'next/image';

export default function AuspiciadoresGrid() {
  const sponsors = [
    // GORE: Tiene fondo claro y letras oscuras. invert + mix-blend-screen borra el fondo y vuelve blanco el logo.
    { src: "/images/logo_gorecolor.png", alt: "GORE Tarapacá", scale: "scale-110 sm:scale-125", filter: "invert grayscale contrast-[1.5] mix-blend-screen" },
    { src: "/images/logo_cdi_white.png", alt: "Club Deportes Iquique", scale: "scale-110 sm:scale-125", filter: "brightness-110" },
    { src: "/images/logo_collahuasi_trans_white.png", alt: "Collahuasi", scale: "scale-100 sm:scale-110", filter: "brightness-110" },
    // AFSI: Usando filtros para limpiar el fondo blanco si existe
    { src: "/images/logo_afsi_color.png", alt: "AFSI", scale: "scale-100 sm:scale-110", filter: "invert grayscale contrast-[1.2] mix-blend-screen brightness-125" }
  ];

  return (
    <div className="space-y-6 text-center pt-8">
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-black italic text-white uppercase tracking-tight opacity-70">Auspiciadores</h2>
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 px-6 bg-white/[0.02] py-10 rounded-3xl border border-white/5 backdrop-blur-sm">
        {sponsors.map((sponsor, i) => (
          <div key={i} className={`relative w-24 h-12 md:w-32 md:h-16 group ${sponsor.scale} transition-all duration-500 hover:scale-135`}>
            <Image
              src={sponsor.src}
              alt={sponsor.alt}
              fill
              className={`object-contain opacity-60 group-hover:opacity-100 transition-all duration-500 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${sponsor.filter || ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
