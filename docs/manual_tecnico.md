# 🛠️ Manual Técnico - Métele un Gol al Cáncer (MUG Z)

Este documento detalla la arquitectura técnica, lógica de datos y procesos de mantenimiento de la aplicación MUG Z.

---

## 🏗️ 1. Stack Tecnológico

La aplicación está construida sobre una arquitectura moderna y escalable:

* **Frontend & Fullstack Framework:** Next.js 15 (App Router).
* **Lenguaje:** TypeScript.
* **Estilos:** Tailwind CSS v4 (Ajustado para tema oscuro y estética premium).
* **Componentes UI:** shadcn/ui + Lucide React (iconografía).
* **Base de Datos:** SQLite (desarrollo/local) controlado vía Prisma ORM.
* **Runtime:** Node.js / Bun.

---

## 💾 2. Modelo de Datos (Prisma Schema)

La base de datos se estructura en torno a cinco entidades principales:

1. **User:** Almacena datos del ciudadano (RUT, email, club, puntos, rol).
2. **Club:** Entidad competitiva que agrupa usuarios y centraliza el conteo de exámenes realizados.
3. **Operativo:** Eventos de salud con fecha, lugar, dirección y capacidad de cupos.
4. **Badge:** Logros visuales asignados a los usuarios por hitos cumplidos.
5. **Photo:** Almacenamiento de registros visuales para la galería con sistema de aprobación.

---

## 🔌 3. Arquitectura de API y Lógica de Negocio

### Endpoints Principales

* `/api/register`: Maneja el flujo de inscripción, validación de RUT único y asignación al club.
* `/api/admin/auth`: Gestiona el acceso al **Panel VAR** mediante sesiones seguras.
* `/api/admin/stats`: Genera datos agregados para gráficos de gestión (grupos etarios, tasa de conversión).

### Lógica de Gamificación

* **Fichaje (Conversión):** El término "Registro" se ha reemplazado por **"Fichar"** para reforzar el compromiso del usuario y la identidad de equipo.
* **Opción Acceso:** El acceso a cuenta existente se denomina **"Soy del equipo"**, eliminando la fricción técnica y reforzando la identidad de grupo.
* **Validación Médica:** La participación en el sorteo final se habilita tras la validación del examen PSA por parte del laboratorio.

### Gestión de Rankings

* **Ranking Amateur:** El ranking se basa en la **cantidad de exámenes realizados (`exams`)** por cada club. El sistema filtra automáticamente las entidades profesionales (ej: CDI) del ranking competitivo para mantener la competencia enfocada en ligas locales y amateur.

---

## 🎨 4. Sistema de Diseño (Premium Aesthetics)

* **Configuración Global:** Ubicada en `src/app/globals.css`.
* **Efecto Cristal (Crystal Blue):** Implementado mediante clases de utilidad CSS que combinan:
  * `backdrop-blur-sm`: Desenfoque de fondo.
  * `bg-primary/20`: Fondo semi-transparente del color marca.
  * `border-primary/50`: Bordes definidos pero sutiles.
  * `shadow-primary/30`: Resplandor exterior (glow).
* **Manejo de Imágenes:** Sistema de "caché-busting" para evitar que el navegador muestre versiones antiguas de logos e iconografía.

---

## 🚀 5. Despliegue y Mantenimiento

### Despliegue en Vercel

1. **Integración Continua:** Cada "push" a la rama `main` en GitHub dispara una nueva compilación.
2. **Serverless Functions:** Las rutas de `/api` se ejecutan como funciones lambdas, lo que garantiza rapidez.

### Comandos de Mantenimiento

```bash
# Actualizar esquema de base de datos
npx prisma db push

# Ver panel administrativo de datos (local)
npx prisma studio

# Compilar proyecto para producción
npm run build
```

---

## 📊 6. Panel de Gestión (Panel VAR)

Ubicado en `/admin`, permite a los coordinadores regionales:

* Visualizar el mapa de calor de participación por comuna.
* Validar la asistencia de los usuarios a los operativos de salud.
* Gestionar la galería de fotos de la campaña.

---
*Documento técnico actualizado a Marzo 2026.*
