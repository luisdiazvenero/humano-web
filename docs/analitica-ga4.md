# Analítica GA4 — Humano Lima

Propiedad `G-72C40YXW4P`. Todos los eventos salen de `trackEvent()`
(`src/lib/analytics.ts`), que es un envoltorio de `gtag('event', ...)`.

## Lo que hay que hacer en la interfaz de GA4

El código ya manda parámetros con casi todos los eventos, pero la propiedad **no
tiene ninguna dimensión personalizada registrada**. GA4 recibe el parámetro,
lo guarda y no lo muestra en ningún reporte. Por eso `web_nav_click` aparece
como un total de 902 clics sin saber a qué se hizo clic: el dato viaja, falta
registrarlo.

Administrar → Definiciones personalizadas → Crear dimensión personalizada,
ámbito **Evento**, nombre del parámetro **exactamente** como está en la columna
de abajo. **No son retroactivas**: GA4 solo reporta desde el momento en que se
registran, así que conviene crearlas antes de desplegar.

Límite de la propiedad: 50 dimensiones de ámbito evento. Aquí se usan 16.

| Parámetro | Eventos que lo mandan | Para qué |
|---|---|---|
| `label` | `web_nav_click` | Qué sección del menú se navega |
| `href` | `web_nav_click` | Destino del clic de menú |
| `location` | `web_reserve_click`, `web_video_play`, `web_video_progress`, `web_social_click`, `web_phone_click`, `web_mail_click` | Desde dónde se hizo el clic |
| `facility_name` | `web_restaurant_reserve_click`, `web_restaurant_whatsapp_click`, `web_restaurant_menu_click`, `web_facility_cta_click`, `web_facility_menu_click`, `web_phone_click`, `web_mail_click` | Qué instalación o restaurante |
| `facility_slug` | los mismos | Identificador estable de la instalación |
| `room_name` | `web_room_reserve_click`, `web_room_video_play` | Qué habitación |
| `room_slug` | `web_room_reserve_click` | Identificador estable de la habitación |
| `service_name` | `web_service_cta_click` | Qué servicio |
| `service_slug` | `web_service_cta_click` | Identificador estable del servicio |
| `space` | `web_event_whatsapp_click`, `web_event_quote_open`, `web_event_quote_sent` | Qué salón de eventos |
| `platform` | `web_social_click` | Instagram o Facebook |
| `video_name` | `web_video_play`, `web_video_progress` | Qué video |
| `progress` | `web_video_progress` | 25 / 50 / 75 / 100 |
| `intent` | `conserje_intent_select` | Qué le piden al Concierge |
| `suggestion` | `conserje_suggestion_click` | Qué sugerencia funciona |
| `cta_label` | `conserje_cta_click` | A qué empuja el Concierge |

Esta tabla es una selección, no el inventario completo: el Concierge manda
además `item_name`, `item_type`, `profile`, `field`, `input_type`, `source`,
`query`, `route_label` y `route_url`, y los formularios mandan `reason` en sus
eventos de error. Se pueden registrar después si hacen falta; no son necesarias
para los reportes de la web.

## Eventos clave

Marcar como evento clave, además de los que ya lo están:
`web_restaurant_reserve_click`, `web_phone_click`, `web_mail_click`.

## Cosas que parecen errores y no lo son

- **El doble conteo de Reservar.** Cada clic en Reservar dispara el evento propio
  (`web_reserve_click` / `web_room_reserve_click`) y además el `click` saliente
  automático de GA4 hacia `marriott.com`. Es el mismo clic visto dos veces. Los
  reportes usan el evento propio; el automático sirve de control y no hay que
  quitar ninguno.
- **`web_restaurant_menu_click` no es una reserva.** Abre el PDF de la carta.
- **`form_start` no es un envío.** El envío real es `web_contact_sent`,
  `web_event_quote_sent` y `web_claims_sent`. Mantener esa separación en
  cualquier formulario nuevo.

## Corte en la serie de `web_restaurant_whatsapp_click`

Hasta septiembre de 2026, el CTA *Reservar* de Entrañable y Café de Lima
disparaba `web_restaurant_whatsapp_click` aunque el enlace fuera a
`mesa247.pe`. Desde el commit que acompaña a este documento, ese clic dispara
`web_restaurant_reserve_click` y el nombre de WhatsApp queda solo para el caso
sin plataforma de reservas. **El histórico de `web_restaurant_whatsapp_click`
anterior a ese corte son, en realidad, reservas.**

## Enlaces `tel:` y `mailto:`

GA4 no los ve: la medición mejorada solo capta enlaces `http/https` a otro
dominio. Se instrumentan a mano con `TrackAnchor`
(`src/components/humano-web/TrackAnchor.tsx`). Cualquier teléfono o correo nuevo
que se agregue a la web tiene que usar ese componente o no se mide.

## UTM en los enlaces salientes

Los enlaces que salen a otro dominio llevan UTM. Esos parámetros **no se leen en
nuestra analítica**: se leen en la de Marriott y la de Mesa 247, para que puedan
atribuir el tráfico que les manda la web. Del lado nuestro el dato ya lo da el
evento propio (`web_reserve_click`, `web_room_reserve_click`,
`web_restaurant_reserve_click`).

Toda la convención vive en `src/lib/web/outbound.ts`. Cambiarla es cambiar ese
archivo, no ir enlace por enlace.

```
utm_source  = humanolima.com     (siempre)
utm_medium  = referral           (siempre)
utm_campaign= hotel-booking | restaurant-booking | bonvoy
utm_content = el sitio exacto del clic
```

| Enlace | Destino | `utm_campaign` | `utm_content` |
|---|---|---|---|
| Reservar del navbar (escritorio) | Marriott · rooms | `hotel-booking` | `navbar` |
| Reservar del navbar (móvil) | Marriott · rooms | `hotel-booking` | `navbar-mobile` |
| Reservar de cada habitación | Marriott · rooms | `hotel-booking` | `room-<slug>` |
| Reservar del Concierge | Marriott · rooms | `hotel-booking` | `conserje` |
| Reservar · Entrañable | entranable.mesa247.pe | `restaurant-booking` | `entranable` |
| Reservar · Café de Lima | cafedelima.mesa247.pe | `restaurant-booking` | `cafe-de-lima` |
| Logo Bonvoy del pie (10 páginas) | marriott.com | `bonvoy` | `footer` |

Las 8 habitaciones apuntan a la misma URL de Marriott, así que el `utm_content`
es lo único que distingue desde cuál se reservó:

```
room-superior-king    room-superior-double  room-deluxe-king
room-family-room      room-family-deluxe    room-junior-suite
room-signature-suite  room-accesible-room  (en inglés: room-accessible-room)
```

Ojo con la habitación accesible: el slug cambia entre idiomas, así que en los
reportes de Marriott aparece partida en dos filas. Es la única que se comporta
así.

### Enlaces que a propósito NO llevan UTM

- **WhatsApp** (`wa.me`, `wa.link`): descarta el query string al abrir el chat.
  `withUtm()` los devuelve intactos aunque se le pasen por error.
- **Instagram y Facebook**: la plataforma no expone esa atribución a la marca.
- **Google Maps** y los `mailto:` / `tel:`: no leen UTM.
- **Las URLs de Marriott que el Concierge escribe dentro del texto del chat**
  (`src/app/api/conserje/route.ts`, `src/app/api/humano/route.ts`). Van sin
  etiquetar a propósito: parte de esas URLs viaja dentro del prompt del modelo,
  y una URL larga ahí se presta a que salga cortada o mal copiada. El botón de
  reserva del Concierge sí está etiquetado (`utm_content=conserje`).
