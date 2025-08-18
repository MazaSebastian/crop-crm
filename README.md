# 🌱 Crop CRM - Gestión de Cultivos

Sistema multi-usuario para gestión de cultivos, con sincronización en tiempo real (Supabase) y despliegue en Vercel.

## ✅ Estado Estable (snapshot)
- Tag: `v0.9.0-beta`
- Rama backup: `backup/beta-2025-08-18`

## 🔧 Requisitos
- Variables de entorno (Vercel):
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`

## 🗄️ Migración (SQL v1)
Ejecutá el archivo `sql/001_schema.sql` en el SQL Editor de Supabase (idempotente). Crea tablas, habilita RLS (modo demo) y activa Realtime.

## 🚀 Deploy
```bash
npm install
npm run build
# producir la build para Vercel
```
En Vercel, conectá el repo y desplegá. Si hay warnings de ESLint, hacé “Redeploy → Clear build cache”.

## 🔐 Demo credenciales
- seba@chakra.com / chakra4794
- santi@chakra.com / chakra4794

## 🧩 Funcionalidad principal
- Login y rutas protegidas
- Comunicaciones con “Leído” (borra en ambos dispositivos)
- Registro diario y eventos con Realtime y borrado
- Cultivos: crear/editar/eliminar con Realtime
- Tareas: límite 4, edición modal, toggle completado con animación y sync
- Gastos: “Saldo Chakra” + filtros por propietario
- Stock: +/− con sync
- Notificaciones por cultivo: contador basado en `notif_last_seen` por usuario (sincronizado)

## 🆘 Rollback rápido
```bash
git fetch --all --tags
git checkout v0.9.0-beta
# o promover el deployment del tag en Vercel a Production
```

## 📦 Backups (Sugerencias)
- Plan Pro: habilitar Backups y PITR en Supabase
- Free: `pg_dump` programado (GitHub Actions) hacia un bucket/artifacts

## 📂 Estructura
- `src/` app React
- `sql/001_schema.sql` migración idempotente

## 📄 Licencia
Uso interno.
