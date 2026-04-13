# ============================================================
# MUG Z - SCRIPT DE FINALIZACIÓN AUTOMÁTICA
# ============================================================

Write-Host "⚽ Iniciando la sincronización final con Supabase..." -ForegroundColor Cyan

# 1. Empujar el esquema a Supabase
Write-Host "📦 Creando tablas en la base de datos de la nube..." -ForegroundColor Yellow
npx prisma db push

# 2. Cargar los datos iniciales (canciones, etc)
Write-Host "🎵 Cargando las 10 canciones y ranking inicial..." -ForegroundColor Yellow
npx prisma db seed

Write-Host "============================================================" -ForegroundColor Green
Write-Host "✅ ¡TODO LISTO! Tu App ya es independiente en la nube." -ForegroundColor Green
Write-Host "🔗 Enlace oficial: https://mugz-rose.vercel.app" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Green
