export type Lang = "es" | "en"

export const I18N: Record<Lang, {
  // UI básico
  inputPlaceholder: string
  langToggleES: string
  langToggleEN: string
  websiteLabel: string
  weatherUnavailable: string
  micUnsupported: string
  microphone: string
  send: string
  // Saludo + onboarding
  greetings: string[]
  greetingsReturning: string[]
  initialIntentQuestions: string[]
  intentLabels: { trabajo: string; descanso: string; aventura: string }
  intentDescriptions: { trabajo: string; descanso: string; aventura: string }
  freeTextPrompts: string[]
  // Sugerencias por defecto
  defaultSuggestions: string[]
  // Disclaimer
  disclaimer: string
  // Caminata dispatcher
  caminataDispatcherReply: string
  caminataMirafloresLabel: string
  caminataBarrancoLabel: string
  // Running dispatcher
  runningDispatcherReply: string
  runningRoutes: Array<{ label: string; description: string; url: string }>
  // Profile / group flow
  groupSuggestions: Array<{ label: string; key: string }>
  intentToProfilePrompt: { trabajo: string[]; descanso: string[]; aventura: string[] }
  profileFallback: string
  profileCompletionPrompts: string[]
}> = {
  es: {
    inputPlaceholder: "Escribe tu pregunta...",
    langToggleES: "ES",
    langToggleEN: "EN",
    websiteLabel: "Website",
    weatherUnavailable: "Clima no disponible",
    micUnsupported: "Tu navegador no soporta micrófono.",
    microphone: "Micrófono",
    send: "Enviar",
    greetings: [
      "Hola, bienvenido a Humano. Estoy por aquí para ayudarte.",
      "Hola, qué gusto saludarte. Soy tu anfitrión en Humano.",
    ],
    greetingsReturning: [
      "Hola, bienvenido a Humano. Empezamos cuando quieras.",
      "Hola de nuevo, qué bueno verte por aquí.",
    ],
    initialIntentQuestions: [
      "Si te parece, arrancamos por aquí: ¿trabajo, descanso o aventura?",
      "Para empezar, ¿tu plan es trabajo, descanso o aventura?",
      "Cuéntame el enfoque del viaje: ¿trabajo, descanso o aventura?",
      "Empecemos por tu viaje: ¿trabajo, descanso o aventura?",
      "Para orientarte bien, dime: ¿trabajo, descanso o aventura?",
    ],
    intentLabels: { trabajo: "Trabajo", descanso: "Descanso", aventura: "Aventura" },
    intentDescriptions: {
      trabajo: "Wifi rápido, reuniones y foco",
      descanso: "Relax, silencio y confort",
      aventura: "Explorar Lima como local",
    },
    freeTextPrompts: [
      "También puedes contarme qué tienes en mente",
      "O cuéntame tu plan libremente",
      "Si te sirve más, escríbeme tu plan tal cual",
      "También puedes decirme qué te gustaría hacer",
    ],
    defaultSuggestions: ["Habitaciones", "Servicios", "Instalaciones", "Recomendaciones"],
    disclaimer:
      "Las respuestas son generadas por IA y pueden contener inexactitudes. Hotel Humano no se responsabiliza por la información proporcionada. Consulta siempre con recepción para confirmar disponibilidad y condiciones.",
    caminataDispatcherReply: "Tenemos dos rutas curadas por nuestros vecinos. ¿Por dónde te gustaría empezar?",
    caminataMirafloresLabel: "Caminata por Miraflores",
    caminataBarrancoLabel: "Caminata por Barranco",
    runningDispatcherReply: "Ruta plana a lo largo del malecón, muy usada para running. Según tu ritmo, elige una:",
    runningRoutes: [
      {
        label: "Ruta 5k",
        description: "Malecón de Miraflores, a pasos del hotel. Ideal para empezar el día.",
        url: "https://maps.app.goo.gl/fhR19kbvtHCbM7Hs9",
      },
      {
        label: "Ruta 10k",
        description: "Malecones de Miraflores y San Isidro, con vista al mar todo el recorrido.",
        url: "https://maps.app.goo.gl/NgPJj6Th8kd64Y2n8",
      },
      {
        label: "Ruta 21k",
        description: "Miraflores, San Isidro y Barranco. Para runners con ritmo y media maratón.",
        url: "https://maps.app.goo.gl/eED4mGia5fud6NYn6",
      },
    ],
    groupSuggestions: [
      { label: "Solo", key: "solo" },
      { label: "En pareja", key: "en pareja" },
      { label: "En grupo", key: "en grupo" },
    ],
    intentToProfilePrompt: {
      trabajo: [
        "Perfecto, vamos por trabajo. ¿Viajas solo, en pareja o en grupo?",
        "Genial, lo tomamos en clave trabajo. ¿Viajas solo, en pareja o en grupo?",
        "Listo, vamos por un viaje de trabajo. ¿Vienes solo, en pareja o en grupo?",
      ],
      descanso: [
        "Perfecto, vamos con plan de descanso. ¿Viajas solo, en pareja o en grupo?",
        "Excelente, descanso entonces. ¿Viajas solo, en pareja o en grupo?",
        "Genial, ya voy entendiendo tu viaje. ¿Solo, en pareja o en grupo?",
      ],
      aventura: [
        "Perfecto, vamos por aventura. ¿Viajas solo, en pareja o en grupo?",
        "Excelente, aventura entonces. ¿Solo, en pareja o en grupo?",
        "Genial, ya me ubico mejor. ¿Viajas solo, en pareja o en grupo?",
      ],
    },
    profileFallback: "Perfecto. ¿Viajas solo, en pareja o en grupo?",
    profileCompletionPrompts: [
      "Listo, ya tengo contexto para recomendarte con criterio. ¿Qué quieres explorar primero?",
      "Perfecto, con eso puedo orientarte mejor. ¿Qué te gustaría revisar primero?",
      "Genial, ya tengo una base clara de tu viaje. ¿Por dónde empezamos?",
    ],
  },
  en: {
    inputPlaceholder: "Type your question...",
    langToggleES: "ES",
    langToggleEN: "EN",
    websiteLabel: "Website",
    weatherUnavailable: "Weather unavailable",
    micUnsupported: "Your browser does not support microphone input.",
    microphone: "Microphone",
    send: "Send",
    greetings: [
      "Hi, welcome to Humano. I'm here to help.",
      "Hi, glad to see you. I'm your host at Humano.",
    ],
    greetingsReturning: [
      "Welcome back to Humano. Whenever you're ready.",
      "Good to see you again here.",
    ],
    initialIntentQuestions: [
      "To get started: work, rest, or adventure?",
      "What brings you here today: work, rest, or adventure?",
      "Tell me the focus of your trip: work, rest, or adventure?",
      "Let's start with your trip: work, rest, or adventure?",
      "To orient you well: work, rest, or adventure?",
    ],
    intentLabels: { trabajo: "Work", descanso: "Rest", aventura: "Adventure" },
    intentDescriptions: {
      trabajo: "Fast Wi-Fi, meetings and focus",
      descanso: "Relax, quiet and comfort",
      aventura: "Explore Lima like a local",
    },
    freeTextPrompts: [
      "You can also tell me what you have in mind",
      "Or share your plan in your own words",
      "Feel free to type your plan freely",
      "You can also tell me what you'd like to do",
    ],
    defaultSuggestions: ["Rooms", "Services", "Facilities", "Recommendations"],
    disclaimer:
      "Responses are AI-generated and may contain inaccuracies. Hotel Humano is not responsible for the information provided. Always check with the front desk to confirm availability and conditions.",
    caminataDispatcherReply: "We have two routes handpicked by our neighbors. Where would you like to start?",
    caminataMirafloresLabel: "Stroll through Miraflores",
    caminataBarrancoLabel: "Stroll through Barranco",
    runningDispatcherReply: "Flat route along the malecón, popular for running. Pick one to match your pace:",
    runningRoutes: [
      {
        label: "5k Route",
        description: "Miraflores malecón, steps from the hotel. A great way to start the day.",
        url: "https://maps.app.goo.gl/fhR19kbvtHCbM7Hs9",
      },
      {
        label: "10k Route",
        description: "Miraflores and San Isidro malecones, with ocean views the whole way.",
        url: "https://maps.app.goo.gl/NgPJj6Th8kd64Y2n8",
      },
      {
        label: "21k Route",
        description: "Miraflores, San Isidro and Barranco. For runners in shape and half-marathon training.",
        url: "https://maps.app.goo.gl/eED4mGia5fud6NYn6",
      },
    ],
    groupSuggestions: [
      { label: "Solo", key: "solo" },
      { label: "Couple", key: "en pareja" },
      { label: "Group", key: "en grupo" },
    ],
    intentToProfilePrompt: {
      trabajo: [
        "Great, work mode it is. Are you traveling solo, as a couple, or in a group?",
        "Got it, focused on work. Are you traveling solo, as a couple, or in a group?",
        "Perfect, work trip. Are you traveling solo, as a couple, or in a group?",
      ],
      descanso: [
        "Great, rest mode it is. Are you traveling solo, as a couple, or in a group?",
        "Sounds good, rest then. Are you traveling solo, as a couple, or in a group?",
        "Got it, a relaxing trip. Are you traveling solo, as a couple, or in a group?",
      ],
      aventura: [
        "Awesome, adventure mode. Are you traveling solo, as a couple, or in a group?",
        "Love it, adventure then. Are you traveling solo, as a couple, or in a group?",
        "Got it, an adventure trip. Are you traveling solo, as a couple, or in a group?",
      ],
    },
    profileFallback: "Perfect. Are you traveling solo, as a couple, or in a group?",
    profileCompletionPrompts: [
      "Got it, I have enough context to recommend with care. What would you like to explore first?",
      "Perfect, with that I can guide you better. What would you like to check first?",
      "Great, I have a clear picture of your trip. Where shall we start?",
    ],
  },
}

export function detectBrowserLang(): Lang {
  if (typeof window === "undefined") return "es"
  const nav = window.navigator
  const langs = nav.languages?.length ? nav.languages : [nav.language || "es"]
  for (const lang of langs) {
    if (lang.toLowerCase().startsWith("en")) return "en"
    if (lang.toLowerCase().startsWith("es")) return "es"
  }
  return "es"
}

const LANG_STORAGE_KEY = "humano:lang"

export function loadStoredLang(): Lang | null {
  if (typeof window === "undefined") return null
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
  return stored === "es" || stored === "en" ? stored : null
}

export function persistLang(lang: Lang): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LANG_STORAGE_KEY, lang)
}
