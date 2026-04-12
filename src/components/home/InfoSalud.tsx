'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, Shield, Clock, Users, Target, HelpCircle, 
  BookOpen, Scale, Download, AlertCircle 
} from 'lucide-react';

export default function InfoSalud() {
  return (
    <div className="px-1 py-2 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black italic text-white uppercase italic">Segundo Tiempo</h1>
        <p className="text-primary text-sm font-bold uppercase tracking-widest">El equipo te necesita para ganar</p>
      </div>

      <Tabs defaultValue="psa" className="w-full">
        <TabsList className="bg-background/50 border border-border w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="psa" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-xs">Examen PSA</TabsTrigger>
          <TabsTrigger value="riesgo" className="data-[state=active]:bg-warning/20 data-[state=active]:text-warning font-bold text-xs">Riesgos</TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-xs">Preguntas</TabsTrigger>
        </TabsList>

        <TabsContent value="psa" className="mt-4">
          <Card className="bg-card/90 border-border overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Marcador de Salud PSA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                El Antígeno Prostático Específico (PSA) es el "marcador del partido". 
                Detectarlo a tiempo es la clave para ganar el encuentro antes de que avance.
              </p>

              {/* Marcador Electrónico PSA */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-black/60 to-black/40 p-4 rounded-2xl border-2 border-success/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-success uppercase tracking-widest mb-1">RESULTADO ÓPTIMO</p>
                      <p className="text-sm font-bold text-white">Riesgo Bajo / Detección Normal</p>
                    </div>
                    <div className="bg-black border border-success/50 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all">
                      <span className="text-4xl font-black text-success font-mono italic">{"<"}4.0</span>
                      <p className="text-[8px] text-center font-bold text-success/70">ng/mL</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gradient-to-r from-black/60 to-black/40 p-4 rounded-2xl border-2 border-warning/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-warning/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-warning uppercase tracking-widest mb-1">REVISIÓN NECESARIA</p>
                      <p className="text-sm font-bold text-white">Consultar con el Director Técnico</p>
                    </div>
                    <div className="bg-black border border-warning/50 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all">
                      <span className="text-4xl font-black text-warning font-mono italic">{">"}4.0</span>
                      <p className="text-[8px] text-center font-bold text-warning/70">ng/mL</p>
                    </div>
                  </div>
                </div>

              <Alert className="border-warning/30 bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-xs font-medium">
                  Un PSA elevado <strong>no siempre significa cáncer</strong>. Existen inflamaciones o crecimientos benignos. ¡Pide tu revisión oficial!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="riesgo" className="mt-4">
          <Card className="bg-card/90 border-border overflow-hidden">
            <CardHeader className="bg-warning/10 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-warning" /> Factores de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {[
                { icon: <Clock className="h-5 w-5 text-warning" />, title: 'Edad de Juego', text: 'Hombres mayores a 40-50 años' },
                { icon: <Users className="h-5 w-5 text-warning" />, title: 'ADN Futbolero', text: 'Antecedentes familiares directos' },
                { icon: <Activity className="h-5 w-5 text-warning" />, title: 'Condición Física', text: 'Obesidad y sedentarismo' },
                { icon: <Target className="h-5 w-5 text-warning" />, title: 'Dieta del Equipo', text: 'Consumo alto de grasas saturadas' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-warning/20 transition-all overflow-hidden group">
                  <div className="bg-warning/10 p-2 rounded-lg group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div>
                    <p className="text-[10px] font-black text-warning uppercase tracking-widest leading-none mb-1">{item.title}</p>
                    <p className="font-bold text-white text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-4 space-y-3">
          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 mb-4 flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-black text-white uppercase italic tracking-wider">Charla Técnica: Preguntas del Equipo</p>
          </div>
          {[
            { q: '¿El examen duele?', a: '¡Para nada! Es un análisis de sangre rápido. Menos doloroso que un roce en el área.' },
            { q: '¿Es totalmente gratis?', a: 'Afirmativo. El PSA no tiene costo en nuestros operativos oficiales de campaña.' },
            { q: '¿Cuándo sale el resultado?', a: 'El VAR de la salud demora entre 3 a 5 días hábiles en darte el veredicto.' },
            { q: '¿Qué pasa si rindo alto?', a: 'No te preocupes. Te contactamos para agendar con un especialista (el DT médico).' },
          ].map((item, index) => (
            <Card key={index} className="bg-card/90 border-border hover:border-primary/20 transition-all cursor-help group">
              <CardContent className="py-4">
                <div className="flex gap-3">
                  <HelpCircle className="h-5 w-5 text-warning shrink-0 group-hover:rotate-12 transition-transform" />
                  <div>
                    <p className="font-black text-white text-sm uppercase leading-tight mb-2 tracking-tight">{item.q}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Manual y Legal Section */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-card/90 border-border overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Manual de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4 text-sm">
              {[
                { n: '01', t: 'Fichaje (Registro)', d: 'Completa tu ficha técnica para saltar a la cancha y participar en sorteos.' },
                { n: '02', t: 'Agendamiento', d: 'Selecciona un operativo en "1er Tiempo" y asegura tu titularidad.' },
                { n: '03', t: 'Premios', d: 'Cada examen validado por el VAR médico te da acceso al sorteo final.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg h-fit text-primary font-black italic text-xs">{step.n}</div>
                  <div>
                    <p className="font-black text-white uppercase italic">{step.t}</p>
                    <p className="text-muted-foreground text-xs leading-tight">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="bg-border/50" />
            <Button variant="outline" className="w-full border-primary/30 group py-6 rounded-xl" asChild>
              <a href="#" className="flex items-center justify-center gap-2">
                <Download className="h-4 w-4 group-hover:animate-bounce" /> Descargar Manual Completo (PDF)
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 border-border overflow-hidden">
          <CardHeader className="bg-secondary/10 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="h-5 w-5 text-secondary" /> Propiedad y Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-xs leading-relaxed text-muted-foreground">
            <div className="space-y-3">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="font-bold text-white mb-2 uppercase tracking-widest text-[9px]">Propiedad Intelectual</p>
                <p>MUG Z (Métele un Gol al Cáncer) es propiedad exclusiva de la <strong>Fundación SESP</strong> e <strong>Impacta</strong>.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="font-bold text-white mb-2 uppercase tracking-widest text-[9px]">Responsabilidad Técnica</p>
                <p>Las entidades médicas autorizadas son responsables de los resultados clínicos y su confidencialidad.</p>
              </div>
            </div>
            <p className="text-center italic mt-4 opacity-50">© 2026 Fundación SESP / Impacta. Todos los derechos reservados.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
