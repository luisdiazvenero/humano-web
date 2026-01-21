// Datos de conversaciones extraídos del Excel microsite-faqs.xlsx
// Cada perfil tiene múltiples conversaciones estructuradas

export interface Conversation {
  topic: string
  sub_tema: string
  intro?: string
  fase: string
  titulo: string
  contenido: string
  cierre?: string
  ctas: string
}

export interface Profile {
  name: string
  icon: string
  description: string
  conversations: Conversation[]
}

export const profiles: Profile[] = [
  {
    name: "Trabajo Solo",
    icon: "💼",
    description: "Viajero de negocios individual",
    conversations: [
      {
        topic: "UBICACIÓN",
        sub_tema: "MIRAFLORES",
        intro: "Genial, estás aquí por trabajo entonces",
        fase: "La experiencia Humano",
        titulo: "Ubicación privilegiada",
        contenido: "En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico, bares, restaurantes, cafés, museos y mucho más.",
        cierre: "Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con algunas recomendaciones",
        ctas: "Solo 24 horas / 3 días / Restaurantes"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "¿CÓMO LLEGAR?",
        intro: "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        fase: "Traslados",
        titulo: "Recojo del Aeropuerto",
        contenido: "Si no quieres lidiar con taxis y maletas, pide el transfer del hotel. Es cómodo y cuesta $30 desde el aeropuerto.",
        cierre: "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegas.",
        ctas: "Early Check In / Contacto / Reserva"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "ALREDEDORES",
        fase: "La experiencia Humano",
        titulo: "Ubicación privilegiada",
        contenido: "Cerca de todo lo que necesitas, Larcomar, casas de cambio, centros comerciales y mucho más.",
        cierre: "¿Buscas restaurantes, rutas de running o prefieres ir de shopping?",
        ctas: "Restaurantes / Bares / Actividades al aire libre"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "DISEÑO / COMODIDAD",
        intro: "Si lo que buscas es descansar bien y sentirte a gusto desde que entras, déjame contarte algo de nuestras habitaciones.",
        fase: "La experiencia Humano",
        titulo: "Superior King",
        contenido: "Sabes que para ti es importante el descanso pero también tener todo lo que necesitas en un sólo lugar. Nuestras camas son amplias y cómidas, wifi rápido, buena iluminación, enchufes bien ubicados, coffee kit y si desean room service a la habitación (24 horas)",
        cierre: "Cuéntame qué tipo de habitación buscas, ¿más espacio o mejor vista?",
        ctas: "Superior King / Deluxe / Coworking"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "FAM Y COMUNICANTES",
        fase: "",
        titulo: "",
        contenido: "",
        ctas: ""
      },
      {
        topic: "HABITACIONES",
        sub_tema: "SUITES",
        intro: "Si buscas un espacio donde puedas trabajar, descansar y sentirte en casa, espera a ver nuestras suites.",
        fase: "La experiencia Humano",
        titulo: "Junior Suite",
        contenido: "Ideal para quienes buscan descanso con un toque especial. Habitación de 32m2 con cama King, TV 50\", bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha.",
        cierre: "¿Ya cuentas con fechas de estadía? Confirma nuestra disponibilidad y reserva en marriott.com",
        ctas: "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    name: "Trabajo Pareja",
    icon: "💼👥",
    description: "Viajeros de negocios en pareja",
    conversations: [
      {
        topic: "UBICACIÓN",
        sub_tema: "MIRAFLORES",
        intro: "Nada como mezclar trabajo y relajo, mejor aún si es con tu compañía favorita.",
        fase: "La experiencia Humano",
        titulo: "Ubicación privilegiada",
        contenido: "En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico, bares, restaurantes, cafés, museos y mucho más.",
        cierre: "Dime cuántos días vienen y qué planes tienen para esos días, puedo ayudarte con algunas recomendaciones",
        ctas: "Solo 24 horas / 3 días / Restaurantes"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "¿CÓMO LLEGAR?",
        intro: "Si vienen del aeropuerto podemos recogerlos o brindarte las mejores opciones para que lleguen a Miraflores.",
        fase: "Traslados",
        titulo: "Recojo del Aeropuerto",
        contenido: "Si no quieres lidiar con taxis y maletas, pide el transfer del hotel. Es cómodo y cuesta $30 desde el aeropuerto.",
        cierre: "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegan.",
        ctas: "Early Check In / Contacto / Reserva"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "ALREDEDORES",
        fase: "La experiencia Humano",
        titulo: "Ubicación privilegiada",
        contenido: "Cerca de todo lo que necesitas, Larcomar, casas de cambio, centros comerciales y mucho más.",
        cierre: "¿Buscan restaurantes, rutas de running o prefieren ir de shopping?",
        ctas: "Restaurantes / Bares / Actividades al aire libre"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "DISEÑO / COMODIDAD",
        intro: "Si lo que buscas es descansar bien y sentirte a gusto desde que entras, déjame contarte algo de nuestras habitaciones.",
        fase: "La experiencia Humano",
        titulo: "Deluxe Doble",
        contenido: "Perfecta para parejas que buscan confort y funcionalidad. Con 28m2, esta habitación tiene todo lo que necesitan: camas queen o king, escritorio, wifi de alta velocidad, TV 42\", bata, pantuflas y baño completo. Coffee kit incluido.",
        cierre: "¿Ya cuentan con fechas de estadía?",
        ctas: "Deluxe / Junior Suite / Coworking"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "FAM Y COMUNICANTES",
        fase: "",
        titulo: "",
        contenido: "",
        ctas: ""
      },
      {
        topic: "HABITACIONES",
        sub_tema: "SUITES",
        intro: "Si buscan un espacio donde puedan trabajar, descansar y sentirse en casa, espera a ver nuestras suites.",
        fase: "La experiencia Humano",
        titulo: "Junior Suite",
        contenido: "Ideal para quienes buscan descanso con un toque especial. Habitación de 32m2 con cama King, TV 50\", bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha.",
        cierre: "¿Ya cuentas con fechas de estadía? Confirma nuestra disponibilidad y reserva en marriott.com",
        ctas: "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    name: "Descanso Pareja",
    icon: "🌴👥",
    description: "Pareja buscando relax y desconexión",
    conversations: [
      {
        topic: "UBICACIÓN",
        sub_tema: "MIRAFLORES",
        intro: "Qué bien que vengan a descansar juntos. Miraflores es el lugar perfecto para desconectarse sin salir de la ciudad.",
        fase: "La experiencia Humano",
        titulo: "Ubicación privilegiada",
        contenido: "En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico, bares, restaurantes, cafés, museos y mucho más.",
        cierre: "Dime cuántos días vienen y qué planes tienen para esos días, puedo ayudarte con algunas recomendaciones",
        ctas: "Solo 24 horas / 3 días / Restaurantes"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "¿CÓMO LLEGAR?",
        intro: "Si vienen del aeropuerto podemos recogerlos o brindarte las mejores opciones para que lleguen a Miraflores sin preocupaciones.",
        fase: "Traslados",
        titulo: "Recojo del Aeropuerto",
        contenido: "Si no quieres lidiar con taxis y maletas, pide el transfer del hotel. Es cómodo y cuesta $30 desde el aeropuerto.",
        cierre: "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegan.",
        ctas: "Early Check In / Contacto / Reserva"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "ALREDEDORES",
        intro: "Para parejas en modo relax, tenemos las mejores recomendaciones cerca del hotel.",
        fase: "La experiencia Humano",
        titulo: "Rutas románticas",
        contenido: "El malecón de Miraflores es perfecto para caminatas al atardecer. A 2 cuadras encuentras el Parque del Amor con vistas increíbles al mar. También hay restaurantes con terraza y ambiente íntimo.",
        cierre: "¿Buscan experiencias gastronómicas o prefieren actividades relajantes como spa?",
        ctas: "Restaurantes / Spa / Sunset spots"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "DISEÑO / COMODIDAD",
        intro: "Si lo que buscan es descansar bien en un ambiente acogedor, nuestras habitaciones están diseñadas pensando en parejas como ustedes.",
        fase: "La experiencia Humano",
        titulo: "Deluxe King",
        contenido: "Amplitud y confort en 28m2. Cama King tamaño XL, sábanas de 400 hilos, almohadas premium, TV 42\", blackout curtains para dormir hasta tarde, baño completo con amenities de lujo y coffee kit.",
        cierre: "¿Buscan algo más íntimo o prefieren más espacio?",
        ctas: "Deluxe / Junior Suite / Suite Vista Mar"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "FAM Y COMUNICANTES",
        fase: "",
        titulo: "",
        contenido: "",
        ctas: ""
      },
      {
        topic: "HABITACIONES",
        sub_tema: "SUITES",
        intro: "Para parejas que buscan una experiencia premium de descanso, nuestras suites son la elección perfecta.",
        fase: "La experiencia Humano",
        titulo: "Junior Suite Vista Mar",
        contenido: "32m2 de puro confort con vista al Pacífico. Cama King, sala de estar separada, TV 50\", bata y pantuflas, minibar premium, clóset walk-in y baño de lujo con tina y ducha rain shower. Detalles románticos disponibles bajo pedido.",
        cierre: "¿Les gustaría agregar algo especial como champagne, flores o chocolates?",
        ctas: "Reserva / Spa / Room Service 24h"
      }
    ]
  },
  {
    name: "Descanso Grupo",
    icon: "🌴👨‍👩‍👧‍👦",
    description: "Grupo de amigos o familia en modo relax",
    conversations: [
      {
        topic: "UBICACIÓN",
        sub_tema: "MIRAFLORES",
        intro: "Nada mejor que descansar en grupo. Miraflores tiene espacios perfectos para grupos que buscan relajarse juntos.",
        fase: "La experiencia Humano",
        titulo: "Ubicación privilegiada",
        contenido: "En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico, bares, restaurantes, cafés, museos y mucho más. Perfecto para grupos que quieren estar cerca de todo.",
        cierre: "¿Cuántas personas son y cuántos días vienen?",
        ctas: "Grupos / Habitaciones comunicantes / Actividades"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "¿CÓMO LLEGAR?",
        intro: "Para grupos, coordinamos el transporte para que lleguen todos cómodamente.",
        fase: "Traslados",
        titulo: "Traslado grupal",
        contenido: "Podemos coordinar vans o múltiples taxis desde el aeropuerto. El transfer grupal tiene tarifas especiales. Contacta con nosotros para cotizar según número de personas.",
        cierre: "¿Deseas que coordinemos el traslado? ¿Cuántas personas son?",
        ctas: "Contacto / Cotización / Early Check In"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "ALREDEDORES",
        intro: "Los grupos que vienen a descansar encuentran en Miraflores el equilibrio perfecto entre tranquilidad y diversión.",
        fase: "La experiencia Humano",
        titulo: "Experiencias grupales",
        contenido: "Cerca del hotel hay plazas con ambientes relajados, restaurantes con mesas grandes, bares tranquilos y el malecón para caminar en grupo. También organizamos experiencias como clases de cocina peruana o tours privados.",
        cierre: "¿Buscan actividades organizadas o prefieren explorar por su cuenta?",
        ctas: "Tours privados / Restaurantes / Beach clubs"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "DISEÑO / COMODIDAD",
        intro: "Para grupos, tenemos opciones que permiten estar juntos pero con privacidad individual.",
        fase: "La experiencia Humano",
        titulo: "Habitaciones múltiples",
        contenido: "Ofrecemos habitaciones cercanas o comunicantes para grupos. Cada habitación tiene camas queen o king, wifi, TV, coffee kit y baño privado. Pueden estar cerca pero cada quien con su espacio.",
        cierre: "¿Prefieren habitaciones comunicantes o en el mismo piso?",
        ctas: "Habitaciones comunicantes / Deluxe / Suites"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "FAM Y COMUNICANTES",
        intro: "Las habitaciones comunicantes son perfectas para grupos o familias que quieren estar conectados.",
        fase: "La experiencia Humano",
        titulo: "Habitaciones Comunicantes",
        contenido: "Dos habitaciones conectadas por puerta interna. Ideal para grupos de 4-6 personas. Cada habitación mantiene privacidad pero con acceso directo entre ambas. Perfectas para familias o amigos cercanos.",
        cierre: "¿Cuántas personas necesitan alojamiento?",
        ctas: "Reserva / Consultar disponibilidad / Tarifas grupales"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "SUITES",
        intro: "Para grupos que buscan más espacio, nuestras suites son ideales.",
        fase: "La experiencia Humano",
        titulo: "Suites amplias",
        contenido: "Las Junior Suites y Master Suites pueden alojar hasta 4 personas con sofá cama adicional. Tienen sala de estar amplia, perfecta para reunirse, y todas las comodidades premium.",
        cierre: "¿Necesitan suites o prefieren habitaciones separadas?",
        ctas: "Suites / Tarifas grupales / Servicios adicionales"
      }
    ]
  },
  {
    name: "Aventura Solo",
    icon: "🧭",
    description: "Viajero aventurero explorando solo",
    conversations: [
      {
        topic: "UBICACIÓN",
        sub_tema: "MIRAFLORES",
        intro: "Perfecto, vienes a explorar Lima. Miraflores es tu base ideal para aventuras urbanas.",
        fase: "La experiencia Humano",
        titulo: "Ubicación estratégica",
        contenido: "Desde aquí puedes moverte a todos lados: Centro histórico (30 min), Barranco bohemio (10 min), Chorrillos surf (15 min), y el malecón para running o parapente está a 2 cuadras.",
        cierre: "¿Qué tipo de aventuras buscas? ¿Urbanas, gastronómicas o deportivas?",
        ctas: "Rutas urbanas / Food tours / Deportes extremos"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "¿CÓMO LLEGAR?",
        intro: "Para aventureros, lo más práctico es llegar directo al hotel y desde ahí planear tus rutas.",
        fase: "Traslados",
        titulo: "Opciones de transporte",
        contenido: "Transfer del hotel $30, taxi oficial aeropuerto ~$25-30, o apps como Uber/Beat ~$20-25. También puedes usar el Metropolitano (bus rápido) por $2, aventura desde el inicio.",
        cierre: "¿Prefieres comodidad o ya quieres empezar la aventura desde el aeropuerto?",
        ctas: "Transfer / Apps transporte / Tips locales"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "ALREDEDORES",
        intro: "Los alrededores de Humano son perfectos para aventureros: tienes de todo a minutos.",
        fase: "La experiencia Humano",
        titulo: "Rutas de aventura",
        contenido: "A 2 cuadras: malecón con parapente y ciclismo. A 10 min: Barranco con arte callejero y nightlife. A 15 min: playas para surf. A 30 min: ruinas de Huaca Pucllana. Lima lo tiene todo.",
        cierre: "¿Qué te llama más? ¿Deportes, cultura, gastronomía o vida nocturna?",
        ctas: "Surf / Parapente / Food tour / Nightlife"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "DISEÑO / COMODIDAD",
        intro: "Para aventureros, necesitas una habitación que sea tu refugio cómodo después de explorar todo el día.",
        fase: "La experiencia Humano",
        titulo: "Superior King - Base de operaciones",
        contenido: "Cama cómoda para recuperarte, wifi rápido para planear rutas, ducha potente después de caminar todo el día, y coffee kit para empezar temprano. Todo lo esencial, sin lujos innecesarios.",
        cierre: "¿Solo duermes y sales a explorar, o también trabajas remotamente?",
        ctas: "Superior / Deluxe / Coworking"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "FAM Y COMUNICANTES",
        fase: "",
        titulo: "",
        contenido: "",
        ctas: ""
      },
      {
        topic: "HABITACIONES",
        sub_tema: "SUITES",
        intro: "Si planeas aventuras más largas o quieres espacio extra para tu equipo deportivo.",
        fase: "La experiencia Humano",
        titulo: "Junior Suite con espacio",
        contenido: "32m2 con área extra para guardar equipo de surf, bicicleta o mochila. Tiene sala de estar donde puedes planear tus rutas, y balcón en algunas para respirar el aire marino. Comodidad sin perder el espíritu aventurero.",
        cierre: "¿Traes mucho equipo o viajas ligero?",
        ctas: "Reserva / Storage / Actividades recomendadas"
      }
    ]
  },
  {
    name: "Aventura Pareja",
    icon: "🧭👥",
    description: "Pareja de aventureros explorando juntos",
    conversations: [
      {
        topic: "UBICACIÓN",
        sub_tema: "MIRAFLORES",
        intro: "Nada mejor que aventuras en pareja. Miraflores es el punto de partida perfecto para explorar Lima juntos.",
        fase: "La experiencia Humano",
        titulo: "Ubicación estratégica",
        contenido: "Desde aquí pueden moverse a todos lados: Centro histórico, Barranco, playas de Chorrillos, y el malecón para parapente o sunset está a 2 cuadras. Perfect para parejas aventureras.",
        cierre: "¿Qué aventuras tienen en mente? ¿Deportes, gastronomía, cultura?",
        ctas: "Tours / Deportes / Food experiences"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "¿CÓMO LLEGAR?",
        intro: "Para parejas que vienen a la aventura, recomendamos llegar sin complicaciones.",
        fase: "Traslados",
        titulo: "Opciones de transporte",
        contenido: "Transfer del hotel $30 total, taxi oficial ~$25-30, o apps como Uber ~$20-25. Si son aventureros de verdad, pueden tomar el Metropolitano (bus rápido) por $2 cada uno.",
        cierre: "¿Empezamos con comodidad o aventura desde el aeropuerto?",
        ctas: "Transfer / Apps / Tips de transporte"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "ALREDEDORES",
        intro: "Como pareja aventurera, tienen opciones increíbles alrededor del hotel.",
        fase: "La experiencia Humano",
        titulo: "Experiencias de pareja",
        contenido: "Malecón para parapente en tándem (2 min), Barranco para arte y bares (10 min), surf juntos en Makaha (15 min), clases de cocina peruana (5 min), bike tours por la costa. Lima tiene todo para ustedes.",
        cierre: "¿Buscan adrenalina pura o prefieren aventuras más culturales?",
        ctas: "Parapente / Surf / Cooking class / Bike tours"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "DISEÑO / COMODIDAD",
        intro: "Después de un día de aventuras, necesitan una habitación donde descansar bien.",
        fase: "La experiencia Humano",
        titulo: "Deluxe King - Refugio de aventureros",
        contenido: "Cama King XL para dormir profundo después de explorar, ducha potente, wifi para compartir fotos de sus aventuras, TV para planear el siguiente día, y coffee kit para salir temprano a nuevas experiencias.",
        cierre: "¿Necesitan espacio extra o la cama cómoda es lo más importante?",
        ctas: "Deluxe / Junior Suite / Amenidades"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "FAM Y COMUNICANTES",
        fase: "",
        titulo: "",
        contenido: "",
        ctas: ""
      },
      {
        topic: "HABITACIONES",
        sub_tema: "SUITES",
        intro: "Si buscan espacio para relajarse después de sus aventuras o traen equipo deportivo.",
        fase: "La experiencia Humano",
        titulo: "Junior Suite Vista Mar",
        contenido: "32m2 con vista al Pacífico, sala de estar para planear rutas juntos, espacio para guardar equipo de aventura (surf, bici, parapente), y amenidades premium para consentirse después de un día intenso.",
        cierre: "¿Traen equipo deportivo o viajan ligero?",
        ctas: "Reserva / Storage / Tours recomendados"
      }
    ]
  },
  {
    name: "Aventura Grupo",
    icon: "🧭👨‍👩‍👧‍👦",
    description: "Grupo de aventureros explorando Lima",
    conversations: [
      {
        topic: "UBICACIÓN",
        sub_tema: "MIRAFLORES",
        intro: "Un grupo de aventureros en Lima, qué buena onda! Miraflores es el spot perfecto como base.",
        fase: "La experiencia Humano",
        titulo: "Base de operaciones",
        contenido: "Céntrico para moverse a todos lados en grupo: Centro histórico, Barranco, playas, malecón para deportes. Todo cerca y con transporte fácil. Perfect para grupos que quieren explorar sin perder tiempo.",
        cierre: "¿Cuántos son y qué tipo de aventuras buscan?",
        ctas: "Tours grupales / Deportes / Nightlife"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "¿CÓMO LLEGAR?",
        intro: "Para grupos aventureros, coordinamos el transporte para que lleguen todos juntos.",
        fase: "Traslados",
        titulo: "Transporte grupal",
        contenido: "Van privada desde el aeropuerto con tarifas grupales, o pueden coordinar varios Uber. También el Metropolitano si quieren aventura desde el inicio ($2 por persona). Les damos tips según su estilo.",
        cierre: "¿Cuántos son? ¿Prefieren comodidad o empezar la aventura desde ya?",
        ctas: "Van privada / Apps / Transporte público"
      },
      {
        topic: "UBICACIÓN",
        sub_tema: "ALREDEDORES",
        intro: "Para grupos aventureros, los alrededores tienen actividades perfectas para todos.",
        fase: "La experiencia Humano",
        titulo: "Aventuras grupales",
        contenido: "Parapente en tándem (grupos hasta 10), surf lessons grupales, bike tours por la costa, food tours por Barranco, pub crawls, clases de cocina peruana en grupo. Organizamos lo que necesiten.",
        cierre: "¿Qué tipo de aventuras? ¿Deportes extremos, cultura, o fiesta?",
        ctas: "Parapente / Surf / Food tour / Bar hopping"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "DISEÑO / COMODIDAD",
        intro: "Para grupos aventureros, ofrecemos habitaciones que les den privacidad pero cerca para planear juntos.",
        fase: "La experiencia Humano",
        titulo: "Habitaciones grupales",
        contenido: "Habitaciones en el mismo piso o comunicantes. Cada una con camas cómodas, wifi, ducha potente y coffee kit. Pueden juntarse a planear el siguiente día pero cada quien tiene su espacio.",
        cierre: "¿Cuántas habitaciones necesitan? ¿Prefieren estar en el mismo piso?",
        ctas: "Habitaciones cercanas / Comunicantes / Suites"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "FAM Y COMUNICANTES",
        intro: "Las habitaciones comunicantes son ideales para grupos que quieren estar conectados.",
        fase: "La experiencia Humano",
        titulo: "Habitaciones Comunicantes",
        contenido: "Dos habitaciones conectadas por puerta interna. Perfectas para grupos de 4-6 aventureros. Pueden organizarse entre ambas, guardar equipo compartido, y salir juntos sin coordinación complicada.",
        cierre: "¿Cuántos son en total?",
        ctas: "Reserva grupal / Consultar / Tarifas especiales"
      },
      {
        topic: "HABITACIONES",
        sub_tema: "SUITES",
        intro: "Si son grupo pequeño o quieren espacio común, las suites son buena opción.",
        fase: "La experiencia Humano",
        titulo: "Suites con espacio",
        contenido: "Junior Suites alojan hasta 4 personas con sofá cama. Tienen sala de estar para juntarse a planear, espacio para equipo deportivo, y comodidades premium después de aventuras intensas.",
        cierre: "¿Prefieren suites compartidas o habitaciones individuales?",
        ctas: "Suites / Mix habitaciones / Tarifas grupales"
      }
    ]
  }
]
