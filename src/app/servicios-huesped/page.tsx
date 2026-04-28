import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Servicios para Huéspedes · Hotel Humano",
}

export default function ServiciosHuesped() {
  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Manrope:wght@400;500;600&display=swap");

        :root {
          --bg:        #ece7d0;
          --ink:       #003744;
          --ink-mid:   rgba(0, 55, 68, 0.55);
          --ink-faint: rgba(0, 55, 68, 0.2);
          --serif: "Playfair Display", Georgia, serif;
          --sans:  "Manrope", "Avenir Next", sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; }

        html, body {
          margin: 0;
          background: var(--bg);
          color: var(--ink);
        }

        body { font-family: var(--sans); }

        a { color: inherit; text-decoration: none; }

        .sh-page {
          max-width: 42rem;
          margin: 0 auto;
          padding: clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,3rem) clamp(2rem,5vw,3.5rem);
        }

        .sh-site-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.1rem;
          padding-bottom: clamp(2rem,5vw,3rem);
          border-bottom: 1px solid var(--ink-faint);
          margin-bottom: clamp(2.5rem,5vw,3.5rem);
        }

        .sh-logo-shell { width: min(30vw, 8rem); }
        .sh-logo { width: 100%; height: auto; display: block; }

        .sh-page-title {
          margin: 0;
          font-family: var(--sans);
          font-size: clamp(0.62rem,1vw,0.72rem);
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--ink-mid);
        }

        .sh-service {
          padding-bottom: clamp(2rem,4vw,2.8rem);
          margin-bottom: clamp(2rem,4vw,2.8rem);
          border-bottom: 1px solid var(--ink-faint);
        }

        .sh-service:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

        .sh-service-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1.2rem;
          margin-bottom: 0.6rem;
        }

        .sh-service-name {
          margin: 0;
          font-family: var(--serif);
          font-size: clamp(1.15rem,2.5vw,1.5rem);
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.1;
          color: var(--ink);
        }

        .sh-service-badge {
          font-family: var(--sans);
          font-size: clamp(0.62rem,1vw,0.68rem);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a5500;
          background: rgba(255,200,93,0.25);
          border-radius: 4px;
          padding: 0.2em 0.55em;
          white-space: nowrap;
        }

        .sh-service-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }

        .sh-service-meta-item {
          font-family: var(--sans);
          font-size: clamp(0.62rem,1vw,0.68rem);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
          background: rgba(0,55,68,0.07);
          border-radius: 4px;
          padding: 0.2em 0.55em;
        }

        .sh-service-desc {
          margin: 0 0 0.3rem;
          font-family: var(--sans);
          font-size: clamp(0.82rem,1.1vw,0.9rem);
          line-height: 1.7;
          color: rgba(0,55,68,0.75);
          font-weight: 400;
        }

        .sh-service-desc--en {
          margin: 0 0 1.1rem;
          font-family: var(--sans);
          font-size: clamp(0.82rem,1.1vw,0.9rem);
          line-height: 1.7;
          color: rgba(0,55,68,0.6);
          font-weight: 400;
          font-style: italic;
        }

        .sh-service-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }

        .sh-btn-carta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--sans);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--bg);
          background: var(--ink);
          border: 1px solid var(--ink);
          border-radius: 999px;
          padding: 0.6em 1.3em;
          cursor: pointer;
          transition: background 200ms ease, color 200ms ease;
          text-decoration: none;
        }

        .sh-btn-carta:hover,
        .sh-btn-carta:focus-visible {
          background: rgba(0,55,68,0.78);
          outline: none;
        }

        .sh-btn-carta:focus-visible { box-shadow: 0 0 0 3px rgba(0,55,68,0.25); }

        .sh-btn-carta-icon { width: 0.85rem; height: 0.85rem; flex-shrink: 0; opacity: 0.8; }

        .sh-footer {
          margin-top: clamp(2.5rem,5vw,3.5rem);
          padding-top: 1rem;
          border-top: 1px solid var(--ink-faint);
        }

        .sh-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .sh-footer-copy {
          margin: 0;
          font-family: var(--sans);
          font-size: clamp(0.58rem,0.78vw,0.68rem);
          line-height: 1.5;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-mid);
        }

        .sh-socials { display: flex; align-items: center; gap: 0.9rem; flex-shrink: 0; }

        .sh-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.15rem;
          opacity: 0.5;
          transition: opacity 200ms ease;
        }

        .sh-social-link:hover,
        .sh-social-link:focus-visible { opacity: 1; outline: none; }

        .sh-icon { width: 1.2rem; height: 1.2rem; }

        @media (max-width: 600px) {
          .sh-service-head { flex-wrap: wrap; }
          .sh-footer-bar { flex-direction: column; text-align: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sh-btn-carta, .sh-social-link { transition: none; }
        }
      `}</style>

      <div className="sh-page">

        <header className="sh-site-header">
          <div className="sh-logo-shell">
            <img className="sh-logo" src="/logo-humano-hotel.svg" alt="Logo de Humano Hotel" />
          </div>
          <p className="sh-page-title">Servicios para Huéspedes</p>
        </header>

        <main aria-label="Servicios del hotel">

          <div className="sh-service">
            <div className="sh-service-head">
              <h2 className="sh-service-name">Room Service</h2>
            </div>
            <div className="sh-service-meta">
              <span className="sh-service-meta-item">Habitación</span>
              <span className="sh-service-meta-item">24 hrs</span>
            </div>
            <p className="sh-service-desc">Pedidos directamente a tu habitación, disponible las 24 hrs.</p>
            <p className="sh-service-desc--en">Orders straight to your room, available 24 hours.</p>
            <div className="sh-service-actions">
              <a className="sh-btn-carta" href="/cartas/room-service/carta-room-service-esp.pdf" target="_blank" rel="noopener noreferrer">
                <PdfIcon />
                Ver carta ESP
              </a>
              <a className="sh-btn-carta" href="/cartas/room-service/carta-room-service-eng.pdf" target="_blank" rel="noopener noreferrer">
                <PdfIcon />
                Ver carta ENG
              </a>
            </div>
          </div>

          <div className="sh-service">
            <div className="sh-service-head">
              <h2 className="sh-service-name">Café de Lima</h2>
            </div>
            <div className="sh-service-meta">
              <span className="sh-service-meta-item">Restaurante · Piso 1</span>
              <span className="sh-service-meta-item">06:30 – 22:00 hrs</span>
            </div>
            <p className="sh-service-desc">Un espacio que celebra los sabores locales en un ambiente relajado y contemporáneo. Desayuno buffet disponible.</p>
            <p className="sh-service-desc--en">A space that celebrates local flavors in a relaxed, contemporary setting. Buffet breakfast available.</p>
          </div>

          <div className="sh-service">
            <div className="sh-service-head">
              <h2 className="sh-service-name">Entrañable</h2>
              <span className="sh-service-badge">Abrirá en Mayo</span>
            </div>
            <div className="sh-service-meta">
              <span className="sh-service-meta-item">Restaurante · Piso 18</span>
              <span className="sh-service-meta-item">12:00 – 22:00 hrs</span>
            </div>
            <p className="sh-service-desc">En lo alto del hotel, Entrañable invita a disfrutar carnes, bebidas y buenas conversaciones.</p>
            <p className="sh-service-desc--en">On the 18th floor, Entrañable invites you to enjoy meat, drinks, and even better conversations.</p>
          </div>

          <div className="sh-service">
            <div className="sh-service-head">
              <h2 className="sh-service-name">Sala de Masajes</h2>
            </div>
            <div className="sh-service-meta">
              <span className="sh-service-meta-item">Consulta en recepción</span>
            </div>
            <p className="sh-service-desc">Reserva tu sesión en recepción. Disponibilidad sujeta a agenda.</p>
            <p className="sh-service-desc--en">Book your session at our front desk. Availability is subject to schedule.</p>
            <div className="sh-service-actions">
              <a className="sh-btn-carta" href="/cartas/masajes/servicios-masajes.pdf" target="_blank" rel="noopener noreferrer">
                <PdfIcon />
                Ver servicios
              </a>
            </div>
          </div>

          <div className="sh-service">
            <div className="sh-service-head">
              <h2 className="sh-service-name">Piscina</h2>
            </div>
            <div className="sh-service-meta">
              <span className="sh-service-meta-item">Piso 17</span>
              <span className="sh-service-meta-item">08:00 – 20:00 hrs</span>
            </div>
            <p className="sh-service-desc">Nuestra piscina, un oasis urbano ideal para relajarte y desconectar.</p>
            <p className="sh-service-desc--en">Our pool, your urban escape to unwind and disconnect.</p>
          </div>

          <div className="sh-service">
            <div className="sh-service-head">
              <h2 className="sh-service-name">Gimnasio</h2>
            </div>
            <div className="sh-service-meta">
              <span className="sh-service-meta-item">Piso 9</span>
              <span className="sh-service-meta-item">24 hrs</span>
            </div>
            <p className="sh-service-desc">Equipado para que mantengas tu rutina durante tu estadía.</p>
            <p className="sh-service-desc--en">Everything you need to maintain your routine during your stay.</p>
          </div>

        </main>

        <footer className="sh-footer">
          <div className="sh-footer-bar">
            <p className="sh-footer-copy">
              2026 Hotel Humano · Malecón Balta 710, Miraflores. Desarrollado por Armando Hoteles
            </p>
            <nav className="sh-socials" aria-label="Redes sociales de Humano Hotel">
              <a className="sh-social-link" href="https://www.facebook.com/humanolima/" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Humano Hotel">
                <svg className="sh-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-7.3h2.45l.37-2.84H13.5V9.06c0-.82.23-1.38 1.4-1.38H16.4V5.15c-.26-.03-1.16-.11-2.2-.11-2.18 0-3.67 1.33-3.67 3.77v2.06H8v2.84h2.53V21h2.97Z" />
                </svg>
              </a>
              <a className="sh-social-link" href="https://www.instagram.com/humanolima/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Humano Hotel">
                <svg className="sh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="3.8" />
                  <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </nav>
          </div>
        </footer>

      </div>
    </>
  )
}

function PdfIcon() {
  return (
    <svg className="sh-btn-carta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
