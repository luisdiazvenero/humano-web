# Correo de los formularios de la web

Tres formularios envían correo: **Eventos** (`/eventos`), **Contacto**
(`/contacto`) y **Libro de reclamaciones** (`/libro-de-reclamaciones`).
Cada envío deja además un registro en Supabase (tabla `form_submissions`).

## A quién llega cada formulario

Están a la vista en **`src/lib/web/form-recipients.ts`**. Para cambiar un
destinatario se edita ese archivo y se despliega: git deja constancia de qué
cambió y cuándo.

No se usan variables de entorno para esto a propósito. Un correo de destino no
es un secreto, y tenerlo oculto en el panel de Vercel llevó a que durante dos
semanas las cotizaciones de eventos llegaran a un correo personal sin que se
notara. Cambiar una variable en Vercel tampoco evita el despliegue: no surte
efecto hasta que se redespliega.

## Variables de entorno (solo credenciales y ajustes)

| Variable | Para qué | Dónde |
|---|---|---|
| `MAILJET_API_KEY` / `MAILJET_SECRET_KEY` | Credenciales de Mailjet | Vercel (secretas) |
| `MAIL_FROM` | Remitente común: `Hotel Humano <web@humanolima.com>` | Vercel |
| `SUPABASE_URL` / `SUPABASE_SECRET_KEY` | Histórico de solicitudes | Vercel (secretas) |
| `FORM_BCC` | Copia oculta de todos los avisos internos. Vacía = sin copia | Vercel |
| `FORM_EVENTS_TO`, `FORM_CONTACT_TO`, `FORM_CLAIMS_TO` | Redirigen el aviso; **solo para desarrollo**, en `.env.local` | No poner en producción |

Las tres últimas siguen funcionando como override para poder probar en local
sin escribirle al hotel. Si alguna aparece en producción, gana sobre el archivo
y vuelve el problema de origen: no deben existir allí.

## Cómo comprobar a dónde llegó un correo

En **Mailjet → Estadísticas → Mensajes** aparece cada envío con su
destinatario, la fecha y si se entregó o abrió. Es la fuente definitiva.
El histórico de Supabase guarda la solicitud y si el aviso salió
(`email_sent`), pero no la dirección a la que se envió.

## Qué correo recibe cada quien

Por cada solicitud salen dos mensajes:

1. El **aviso interno**, al buzón del hotel (más `FORM_BCC` en copia oculta).
   Responder a ese correo escribe directamente a quien rellenó el formulario.
2. La **copia para el visitante**, a su propia dirección. En el libro de
   reclamaciones es la constancia con el número de hoja, obligatoria por ley.
