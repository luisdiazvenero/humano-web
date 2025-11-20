# 📦 Guía de Despliegue: GitHub + Vercel

Esta guía te llevará paso a paso desde tu código local hasta tener tu sitio web publicado en internet.

---

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener:
- ✅ Una cuenta en [GitHub](https://github.com) (gratis)
- ✅ Una cuenta en [Vercel](https://vercel.com) (gratis)

---

## 🚀 Parte 1: Subir a GitHub

### Paso 1: Agregar todos los archivos a Git

```bash
cd /Users/luisdiaz/Desktop/humano-web
git add .
```

Este comando prepara todos tus archivos para ser guardados.

### Paso 2: Hacer un commit (guardar los cambios)

```bash
git commit -m "Initial commit: Humano hotel website"
```

Esto guarda tus archivos con un mensaje descriptivo.

### Paso 3: Ir a GitHub y crear un repositorio

1. Abre tu navegador y ve a [github.com](https://github.com)
2. Haz clic en el botón **"+"** en la esquina superior derecha
3. Selecciona **"New repository"**
4. Dale un nombre: `humano-web`
5. Déjalo como **público** o **privado** (tú decides)
6. **NO marques** "Initialize this repository with a README"
7. Haz clic en **"Create repository"**

### Paso 4: Conectar tu proyecto local con GitHub

Después de crear el repositorio, GitHub te mostrará unos comandos. Usa estos:

```bash
# Si el repositorio es nuevo (no tiene nada):
git remote add origin https://github.com/TU_USUARIO/humano-web.git
git branch -M main
git push -u origin main
```

**IMPORTANTE**: Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

### Paso 5: Ingresar tus credenciales

Cuando hagas `git push`, te pedirá:
- **Username**: Tu nombre de usuario de GitHub
- **Password**: Un **Personal Access Token** (PAT), NO tu contraseña regular

#### ¿Cómo crear un Personal Access Token?

1. Ve a GitHub → Click en tu foto de perfil → **Settings**
2. En el menú izquierdo, ve a **Developer settings** (al final)
3. Click en **Personal access tokens** → **Tokens (classic)**
4. Click en **Generate new token** → **Generate new token (classic)**
5. Dale un nombre: "Humano Web Deployment"
6. Marca el checkbox **repo** (esto da acceso a repositorios)
7. Click en **Generate token** al final
8. **COPIA EL TOKEN** (solo lo verás una vez)
9. Usa este token como "password" cuando hagas git push

✅ **Resultado**: Tu código ahora está en GitHub!

---

## 🌐 Parte 2: Deploy en Vercel

### Paso 1: Ir a Vercel

1. Abre [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** o **"Login"**
3. Usa **"Continue with GitHub"** (es más fácil)

### Paso 2: Importar tu proyecto

1. Una vez dentro de Vercel, haz clic en **"Add New..."**
2. Selecciona **"Project"**
3. Vercel mostrará tus repositorios de GitHub
4. Busca **humano-web** y haz clic en **"Import"**

### Paso 3: Configurar el proyecto

Vercel detectará automáticamente que es un proyecto Next.js. Configura así:

- **Project Name**: `humano-web` (o el nombre que quieras)
- **Framework Preset**: Next.js (auto-detectado)
- **Root Directory**: `./` (dejar como está)
- **Build Command**: `npm run build` (auto-detectado)
- **Output Directory**: `.next` (auto-detectado)

### Paso 4: Variables de entorno (si las necesitas)

Si tu proyecto necesita variables de entorno (API keys, etc.):
1. Click en **"Environment Variables"**
2. Agrega las que necesites
3. Por ahora, probablemente no necesites ninguna

### Paso 5: Deploy!

1. Haz clic en **"Deploy"**
2. Espera 1-3 minutos mientras Vercel construye tu sitio
3. ✅ **¡Listo!** Vercel te dará una URL tipo: `humano-web.vercel.app`

---

## 🔄 Actualizaciones Futuras

Cada vez que quieras actualizar tu sitio:

```bash
# 1. Agregar cambios
git add .

# 2. Guardar cambios con mensaje
git commit -m "Descripción de lo que cambiaste"

# 3. Subir a GitHub
git push
```

**¡Automático!** Vercel detectará el cambio en GitHub y actualizará tu sitio automáticamente en ~2 minutos.

---

## 🎯 Comandos Rápidos

### Subir cambios a GitHub
```bash
git add .
git commit -m "Tu mensaje aquí"
git push
```

### Ver estado de tus archivos
```bash
git status
```

### Ver historial de cambios
```bash
git log --oneline
```

---

## 🐛 Solución de Problemas

### "Permission denied" al hacer push
- Usa un Personal Access Token en lugar de tu contraseña
- Sigue los pasos de la sección "¿Cómo crear un Personal Access Token?"

### "Build failed" en Vercel
- Revisa los logs en Vercel (te dirá exactamente qué falló)
- Asegúrate de que `npm run build` funciona localmente primero

### "Repository not found"
- Verifica que el URL de tu remote sea correcto:
  ```bash
  git remote -v
  ```
- Si está mal, cámbialo:
  ```bash
  git remote set-url origin https://github.com/TU_USUARIO/humano-web.git
  ```

---

## 📱 ¿Y ahora qué?

Una vez desplegado:

1. **Tu sitio estará en vivo** en `https://tu-proyecto.vercel.app`
2. Puedes **compartir ese link** con quien quieras
3. Puedes **agregar un dominio personalizado** en Vercel (Settings → Domains)
4. Cada push a GitHub **actualiza el sitio automáticamente**

---

## 💡 Tips Pro

- **Branches**: Crea ramas para probar cosas nuevas sin afectar el main
  ```bash
  git checkout -b feature/nueva-funcionalidad
  ```

- **Preview Deployments**: Vercel crea URLs de preview para cada branch

- **Rollback**: Si algo sale mal, puedes volver a una versión anterior en Vercel → Deployments

---

¡Listo! Tu sitio está en el mundo 🌍
