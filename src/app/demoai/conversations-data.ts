// Archivo generado automáticamente desde microsite-faqs.xlsx
// Para regenerar: python3 scripts/excel-to-json.py

export interface Conversation {
  topic: string
  sub_tema: string
  intro?: string
  fase: string
  titulo: string
  contenido: string
  imagen?: string
  cierre?: string
  proximo_paso?: string
  ctas: string
}

export interface Profile {
  name: string
  icon: string
  description: string
  caracteristica: string
  grupo: string
  conversations: Conversation[]
}

export const profiles: Profile[] = [
  {
    "name": "Trabajo Solo",
    "icon": "💼",
    "description": "Viajero de negocios individual",
    "caracteristica": "trabajo",
    "grupo": "solo",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Genial, estás aquí por trabajo entonces",
        "fase": "La experiencia Humano",
        "titulo": "Ubicación privilegiada",
        "contenido": "En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico, bares, restaurantes, cafés, museos y mucho más.",
        "imagen": "",
        "cierre": "Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con algunas recomendaciones",
        "proximo_paso": "",
        "ctas": "Solo 24 horas / 3 días / Restaurantes"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "Si no quieres lidiar con taxis y maletas, pide el transfer del hotel. Es cómodo y cuesta $30 desde el aeropuerto.",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegas.",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "",
        "fase": "La experiencia Humano",
        "titulo": "Ubicación privilegiada",
        "contenido": "Cerca de todo lo que necesitas, Larcomar, casas de cambio, centros comerciales y mucho más.",
        "imagen": "",
        "cierre": "¿Buscas restaurantes, rutas de running o prefieres ir de shopping?",
        "proximo_paso": "",
        "ctas": "Restaurantes / Bares / Actividades al aire libre"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Si lo que buscas es descansar bien y sentirte a gusto desde que entras, déjame contarte algo de nuestras habitaciones.",
        "fase": "La experiencia Humano",
        "titulo": "Superior King",
        "contenido": "Sabes que para ti es importante el descanso pero también tener todo lo que necesitas en un sólo lugar. Nuestras camas son amplias y cómidas, wifi rápido, buena iluminación, enchufes bien ubicados, coffee kit y si desean room service a la habitación (24 horas)",
        "imagen": "",
        "cierre": "Cuéntame qué tipo de habitación buscas, ¿más espacio o mejor vista?",
        "proximo_paso": "",
        "ctas": "Superior King / Deluxe / Coworking"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Si viajas con un colega o necesitas habitaciones cercanas para tu equipo, tenemos opciones de habitaciones comunicantes.",
        "fase": "La experiencia Humano",
        "titulo": "Habitaciones para equipos pequeños",
        "contenido": "Dos habitaciones conectadas por puerta interna. Perfectas para colegas que trabajan juntos o necesitan coordinarse. Cada habitación mantiene su privacidad pero con acceso directo entre ambas. Ideales para proyectos que requieren colaboración.",
        "imagen": "",
        "cierre": "¿Viajas con alguien más de tu equipo?",
        "proximo_paso": "",
        "ctas": "Consultar disponibilidad / Tarifas especiales / Reserva"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "SUITES",
        "intro": "Si buscas un espacio donde puedas trabajar, descansar y sentirte en casa, espera a ver nuestras suites.",
        "fase": "La experiencia Humano",
        "titulo": "Junior Suite",
        "contenido": "Ideal para quienes buscan descanso con un toque especial. Habitación de 32m2 con cama King, TV 50”, bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha. ",
        "imagen": "",
        "cierre": "¿Ya cuentas con fechas de estadía? Confirma nuestra disponibilidad y reserva en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    "name": "Trabajo Pareja",
    "icon": "💼👥",
    "description": "Viajeros de negocios en pareja",
    "caracteristica": "trabajo",
    "grupo": "pareja",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Nada como mezclar trabajo y relajo, mejor aún si es con tu compañía favorita.",
        "fase": "La experiencia Humano",
        "titulo": "Ubicación privilegiada",
        "contenido": "Miraflores es un distrito que tiene todo a la mano. Mientras tu trabajes tu esposa puede pasear por el malecón, ire de compras, visitar alguna galería de arte y muchas cosas más.",
        "imagen": "",
        "cierre": "Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con algunas recomendaciones",
        "proximo_paso": "",
        "ctas": "Solo 24 horas / 3 días / Restaurantes"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o si vienes por tu cuenta te recomendamos la mejor ruta (link a my googlemaps)",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "Si  quieres un servicio cómodo y seguro podemos nuestro equipo de recepción puede coordinarlo por solo $30.",
        "imagen": "",
        "cierre": "Para coordinarlo compártenos tu datos de vuelo y hora llegada. ¿Necesita early check in?",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "",
        "fase": "A pocos pasos de...",
        "titulo": "Ubicación privilegiada",
        "contenido": "Luego de un día largo de trabajo relájate conociendo algún restaurante o bar cercano, camina de noche por el malecón y llega hasta barranco. Si son de las parejas que les gsuta relajarse en el hotel pregunta en recepción cuál es el happening de la noche.",
        "imagen": "",
        "cierre": "¿Buscas restaurantes, bares, rutas fotográficas o prefieres ir de shopping?",
        "proximo_paso": "",
        "ctas": "Restaurantes / Bares / Actividades al aire libre"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Si lo que buscas es descansar bien y sentirte a gusto desde que entras, déjame contarte algo de nuestras habitaciones.",
        "fase": "La experiencia Humano",
        "titulo": "Diseño que abraza, comodidad que acompaña",
        "contenido": "Habitaciones cómodas y tranquilas para descansar juntos de verdad. Luz cálida, camas amplias, black out total y buena acústica. Espacios bien pensados para desconectar, relajarse y disfrutar el tiempo en pareja",
        "imagen": "",
        "cierre": "Cuéntame qué tipo de habitación buscas, ¿más espacio o mejor vista?",
        "proximo_paso": "",
        "ctas": "Superior King / Deluxe King / Coworking"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Si vienen con otros colegas o necesitan espacio extra, las habitaciones comunicantes son una gran opción.",
        "fase": "La experiencia Humano",
        "titulo": "Habitaciones Comunicantes",
        "contenido": "Dos habitaciones conectadas por puerta interna. Ideal si vienen dos parejas o necesitan espacio de trabajo adicional. Cada habitación con baño privado, escritorio y todas las comodidades, pero conectadas para facilitar la colaboración.",
        "imagen": "",
        "cierre": "¿Necesitan espacio adicional o vienen con más personas?",
        "proximo_paso": "",
        "ctas": "Consultar / Tarifas / Disponibilidad"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "SUITES",
        "intro": "Si buscas un espacio donde puedas trabajar, descansar y sentirte en casa, espera a ver nuestras suites.",
        "fase": "La experiencia Humano",
        "titulo": "Junior Suite King",
        "contenido": "Ideal para quienes buscan descanso con un toque especial. Habitación de 32m2 con cama King, TV 50”, bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha.",
        "imagen": "",
        "cierre": "¿Ya sabes en qué fechas nos visitarás? Confirma nuestra disponibilidad y reserva en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    "name": "Trabajo Grupo",
    "icon": "💼👨‍👩‍👧‍👦",
    "description": "Grupo de negocios o equipo de trabajo",
    "caracteristica": "trabajo",
    "grupo": "grupo",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Genial, vienen en grupo y por trabajo. Miraflores es perfecto para equipos que necesitan estar conectados pero cómodos.",
        "fase": "La experiencia Humano",
        "titulo": "Ubicación privilegiada",
        "contenido": "En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico, bares, restaurantes, cafés, museos y mucho más. Ideal para grupos de trabajo que también quieren aprovechar la ciudad.",
        "imagen": "",
        "cierre": "Dime cuántos son y cuántos días vienen. Puedo ayudarles con recomendaciones para el grupo.",
        "proximo_paso": "",
        "ctas": "Salas de reuniones / Actividades grupales / Restaurantes"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "Si no quieres lidiar con taxis y maletas, pide el transfer del hotel. Es cómodo y cuesta $30 desde el aeropuerto.",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegas.",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "",
        "fase": "La experiencia Humano",
        "titulo": "Ubicación privilegiada",
        "contenido": "Cerca de todo lo que necesitas, Larcomar, casas de cambio, centros comerciales y mucho más.",
        "imagen": "",
        "cierre": "¿Buscas restaurantes, rutas de running o prefieres ir de shopping?",
        "proximo_paso": "",
        "ctas": "Restaurantes / Bares / Actividades al aire libre"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Si vienen del aeropuerto podemos coordinar transporte grupal o brindarte las mejores opciones para que lleguen todos juntos a Miraflores.",
        "fase": "La experiencia Humano",
        "titulo": "Superior King",
        "contenido": "Para grupos, ofrecemos coordinación de vans privadas o múltiples taxis. El transfer grupal tiene tarifas especiales. Contacta con nosotros para cotizar según número de personas.",
        "imagen": "",
        "cierre": "¿Deseas que coordinemos el traslado grupal? ¿Cuántas personas son?",
        "proximo_paso": "",
        "ctas": "Cotización grupal / Early Check In / Contacto"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Las habitaciones comunicantes son perfectas para grupos de trabajo que necesitan estar cerca.",
        "fase": "La experiencia Humano",
        "titulo": "Habitaciones Comunicantes Empresariales",
        "contenido": "Dos o más habitaciones conectadas por puertas internas. Perfectas para equipos de 4-8 personas. Pueden tener reuniones rápidas entre habitaciones, compartir espacio de trabajo, y cada uno mantiene su privacidad. Incluyen escritorios en cada habitación.",
        "imagen": "",
        "cierre": "¿Cuántas personas son en total? ¿Necesitan salas de reuniones adicionales?",
        "proximo_paso": "",
        "ctas": "Reserva grupal / Salas de reuniones / Tarifas especiales"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "SUITES",
        "intro": "Si buscas un espacio donde puedas trabajar, descansar y sentirte en casa, espera a ver nuestras suites.",
        "fase": "La experiencia Humano",
        "titulo": "Junior Suite",
        "contenido": "Ideal para quienes buscan descanso con un toque especial. Habitación de 32m2 con cama King, TV 50”, bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha. ",
        "imagen": "",
        "cierre": "¿Ya cuentas con fechas de estadía? Confirma nuestra disponibilidad y reserva en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    "name": "Descanso Solo",
    "icon": "🌴",
    "description": "Viajero individual buscando relajación",
    "caracteristica": "descanso",
    "grupo": "solo",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Qué bien que vengas a descansar solo. Miraflores es el lugar perfecto para desconectarse sin salir de la ciudad.",
        "fase": "Cerca de todo",
        "titulo": "Ubicación privilegiada",
        "contenido": "En el corazón de Miraflores, a pasos del malecón y las mejores vistas del Pacífico. Perfecto para quienes buscan tranquilidad pero con todo cerca: cafés, parques, y el mar a minutos.",
        "imagen": "",
        "cierre": "¿Cuántos días vienes? Puedo darte recomendaciones de espacios tranquilos y relajantes.",
        "proximo_paso": "",
        "ctas": "Rutas de relax / Cafés tranquilos / Spa"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "Si no quieres lidiar con coordinar taxi o cargar tus maletas, nosotros nos encargamos de todo por $30 (one way)",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Solo necesitamos tus datos de vuelo",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "No tendrás espacio para las excusas, desde Humano tienes tu próximo plan a la vuelta de la esquina.",
        "fase": "A la vuelta de la aventura",
        "titulo": "Ubicación privilegiada",
        "contenido": "Desde un viaje en parapente con vistas al pacífico hasta tu próxima clase de surf. Desde Humano podrás disfrutar con actividades que te conecten con lo local a otro nivel. Y si lo que te gusta es relajarte en casa Humano también tiene algunos happenings en el hotel. Pregunta en recepción y te dirán cuál tenemos para el día",
        "imagen": "",
        "cierre": "Reserva tu próxima estadía en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Desayuno Buffet / Superior King"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Para que empieces a relajarte desde que llegas, te recomiendo el transfer del hotel.",
        "fase": "La experiencia Humano",
        "titulo": "Traslado sin complicaciones",
        "contenido": "Si no quieres lidiar con taxis y estrés, el transfer del hotel es tu mejor opción. Cómodo, seguro y cuesta $30 desde el aeropuerto. Llegas directo a tu refugio de descanso.",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Cuéntame qué día y a qué hora llegas.",
        "proximo_paso": "",
        "ctas": "Transfer / Early Check In / Room service"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Aunque viajas solo, si en algún momento recibes visita o prefieres más espacio, contamos con opciones amplias.",
        "fase": "La experiencia Humano",
        "titulo": "Opciones con espacio extra",
        "contenido": "Si decides compartir tu estadía con alguien o simplemente quieres más espacio para relajarte, las habitaciones comunicantes ofrecen flexibilidad. Puedes tener un área social separada manteniendo tu zona de descanso privada.",
        "imagen": "",
        "cierre": "¿Planeas recibir visitas o prefieres maximizar tu espacio personal?",
        "proximo_paso": "",
        "ctas": "Junior Suite / Habitaciones amplias / Consultar"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "SUITES",
        "intro": "Nada mejor que un buen descanso después de la aventura",
        "fase": "La experiencia Humano",
        "titulo": "Junior Suite King",
        "contenido": "Habitación de 32m2 con cama King, TV 50”, bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha.",
        "imagen": "",
        "cierre": "¿Ya cuentas con fechas de estadía? Confirma nuestra disponibilidad y reserva en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    "name": "Descanso Pareja",
    "icon": "🌴👥",
    "description": "Pareja buscando relax y desconexión",
    "caracteristica": "descanso",
    "grupo": "pareja",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Aquí empieza el próximo recuerdo que contarás en casa.",
        "fase": "La experiencia Humano",
        "titulo": "A pocos pasos de...",
        "contenido": "Miraflores los recibe con vistas al Pacífico, cafés para sentarse sin prisa, galerías por descubrir y planes que se disfrutan mejor de a dos.",
        "imagen": "",
        "cierre": "Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con algunas recomendaciones",
        "proximo_paso": "",
        "ctas": "Solo 24 horas / 3 días / Restaurantes"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "Si no quieres lidiar con taxis cargando maletas, pide el transfer del hotel. Es cómodo y cuesta $30 desde el aeropuerto.",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegas.",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "Cerca de todo lo que necesitas para conectar contigo mismo y lo local",
        "fase": "La experiencia Humano",
        "titulo": "A pocos pasos de...",
        "contenido": "Desde caminatas por el malecón con vista al Pacífico hasta planes de noche para dos. Nuestra ubicación los conecta fácilmente con distintas experiencias locales, según el plan que tengan en mente.",
        "imagen": "",
        "cierre": "¿Ya cuentan con fechas de estadía? Revisen las habitaciones que tenemos para ustedes.",
        "proximo_paso": "",
        "ctas": "Junior Suite King / Signature Suite"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Espacios pensados para dos",
        "fase": "Diseño y comodidad",
        "titulo": "Lo que necesitas en un solo lugar",
        "contenido": "Nuestras habitaciones combinan el ritmo de la ciudad con espacios cómodos para compartir. Luz natural, amplitud y detalles cálidos para disfrutar Lima juntos, sin apuros.",
        "imagen": "",
        "cierre": "¿Ya tienen fechas? Miren las habitaciones en las que podrían quedarse:",
        "proximo_paso": "",
        "ctas": "Superior King / Deluxe King / Coworking"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Si vienen con amigos o familia, las habitaciones comunicantes les permiten estar cerca pero con privacidad.",
        "fase": "La experiencia Humano",
        "titulo": "Habitaciones Comunicantes",
        "contenido": "Dos habitaciones conectadas por puerta interna. Perfectas si viajan dos parejas que quieren compartir momentos pero también tener su espacio íntimo. Cada habitación con cama King/Queen, baño privado y amenidades completas.",
        "imagen": "",
        "cierre": "¿Vienen con otra pareja o familia?",
        "proximo_paso": "",
        "ctas": "Consultar disponibilidad / Reserva / Tarifas"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "SUITES",
        "intro": "",
        "fase": "Habitaciones",
        "titulo": "Junior Suite King",
        "contenido": "Ideal para quienes buscan descanso con un toque especial. Habitación de 32m2 con cama King, TV 50”, bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha.",
        "imagen": "",
        "cierre": "¿Ya cuentas con fechas de estadía? Confirma nuestra disponibilidad y reserva en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    "name": "Descanso Grupo",
    "icon": "🌴👨‍👩‍👧‍👦",
    "description": "Grupo de amigos o familia en modo relax",
    "caracteristica": "descanso",
    "grupo": "grupo",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Aquí empieza el próximo recuerdo que contarás en casa.",
        "fase": "La experiencia Humano",
        "titulo": "Ubicación privilegiada",
        "contenido": "Miraflores los espera con el Pacífico listo para surfear, o con largas caminatas por el malecón.",
        "imagen": "",
        "cierre": "Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con algunas recomendaciones",
        "proximo_paso": "",
        "ctas": "Solo 24 horas / 3 días / Restaurantes"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "El transfer del hotel podría hacerles más fácil el transporte. Es cómodo y cuesta $50 desde el aeropuerto.",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegas.",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "Cerca de todo lo que necesitas para conectar contigo mismo y lo local",
        "fase": "La experiencia Humano",
        "titulo": "A pocos pasos de...",
        "contenido": "En Miraflores encontrarás actividades para complacer a todo el grupo, desde caminatas por el malecón con vista al Pacífico hasta tours de bares.",
        "imagen": "",
        "cierre": "¿Cuantos días te quedas? Podemos prepararte un itinerario",
        "proximo_paso": "",
        "ctas": "Reserva / Habitaciones / Happenings"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Espacios con propósito pensados para que disfrutes al máximo",
        "fase": "Diseño y comodidad",
        "titulo": "Lo que necesitan en un solo lugar",
        "contenido": "Espacio y tiempo para todo. En humano encontrarás espacios pensados para conectar contigo mismo, y también con lo local. Descanso de verdad en nuestras habitaciones, la piscina y el gym para mantenerte activo y el salon de masajes para un relax total.",
        "imagen": "",
        "cierre": "Cuéntame qué tipo de habitación buscas, ¿más espacio o mejor vista?",
        "proximo_paso": "",
        "ctas": "Salón de masajes / Deluxe King / Piscina"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Habitaciones que se adaptan si viajas en grupo",
        "fase": "Merecido descanso",
        "titulo": "Habitaciones",
        "contenido": "Si viajas en familia tenemos habitaciones con 1 cama king + 1 sofá cama de 2 plazas o si prefieren habitaciones separadas también contamos con comunicantes.",
        "imagen": "",
        "cierre": "¿Cual prefieres?",
        "proximo_paso": "",
        "ctas": "Reserva / Contacto"
      }
    ]
  },
  {
    "name": "Aventura Solo",
    "icon": "🧭",
    "description": "Viajero aventurero explorando solo",
    "caracteristica": "aventura",
    "grupo": "solo",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Aquí empieza la aventura.",
        "fase": "Cerca de todo",
        "titulo": "Ubicación privilegiada",
        "contenido": "Vive tu próxima aventura desde un lugar que está cerca de todo: mar, restaurantes, paisajes increíbles, bares y más.",
        "imagen": "",
        "cierre": "Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con algunas recomendaciones",
        "proximo_paso": "",
        "ctas": "5 días / 3 días / Actividades"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "Si no quieres lidiar con coordinar taxi o cargar tus maletas, nosotros nos encargamos de todo por $30 (one way)",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Solo necesitamos tus datos de vuelo",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "No tendrás espacio para las excusas, desde Humano tienes tu próximo plan a la vuelta de la esquina.",
        "fase": "A la vuelta de la aventura",
        "titulo": "Ubicación privilegiada",
        "contenido": "Desde un viaje en parapente con vistas al pacífico hasta tu próxima clase de surf. Desde Humano podrás disfrutar con actividades que te conecten con lo local a otro nivel. Y si lo que te gusta es relajarte en casa Humano también tiene algunos happenings en el hotel. Pregunta en recepción y te dirán cuál tenemos para el día",
        "imagen": "",
        "cierre": "Reserva tu próxima estadía en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Desayuno Buffet / Superior King"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Un espacio pensado para ti.",
        "fase": "La experiencia Humano",
        "titulo": "Lo que necesitas en un lugar",
        "contenido": "Espacio y tiempo para todo. Aquí  encontrarás espacios pensados para conectar contigo mismo, y también con lo local. Descanso de verdad en nuestras habitaciones, la piscina y el gym para mantenerte activo y el salon de masajes para un relax total.",
        "imagen": "",
        "cierre": "Cuéntame qué tipo de habitación buscas, ¿más espacio o mejor vista?",
        "proximo_paso": "",
        "ctas": "Superior King / Entrañable / Bar restaurante piso 1"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Si conoces otros aventureros en el camino o viajas con un compañero de aventuras, tenemos opciones flexibles.",
        "fase": "La experiencia Humano",
        "titulo": "Espacio para aventureros",
        "contenido": "Las habitaciones comunicantes son ideales si te juntas con otro viajero en el camino o planeas aventuras en pequeño grupo. Tienen espacio para guardar equipo compartido (bicicletas, tablas de surf) y área común para planear rutas.",
        "imagen": "",
        "cierre": "¿Viajas completamente solo o tienes compañeros de aventura?",
        "proximo_paso": "",
        "ctas": "Habitaciones / Storage para equipo / Consultar"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "SUITES",
        "intro": "Nada mejor que un buen descanso después de la aventura",
        "fase": "La experiencia Humano",
        "titulo": "Junior Suite King",
        "contenido": "Habitación de 32m2 con cama King, TV 50”, bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha.",
        "imagen": "",
        "cierre": "¿Ya cuentas con fechas de estadía? Confirma nuestra disponibilidad y reserva en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    "name": "Aventura Pareja",
    "icon": "🧭👥",
    "description": "Pareja de aventureros explorando juntos",
    "caracteristica": "aventura",
    "grupo": "pareja",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Aquí empieza la aventura.",
        "fase": "Cerca de todo",
        "titulo": "Ubicación privilegiada",
        "contenido": "Miraflores los recibe con vistas al Pacífico, museos y mercados artesanales. Planes que se disfrutan mejor en compañía.",
        "imagen": "",
        "cierre": "Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con algunas recomendaciones",
        "proximo_paso": "",
        "ctas": "5 días / 3 días / Traslados"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "Si no quieres lidiar con coordinar taxi o cargar tus maletas, nosotros nos encargamos de todo por $30 (one way)",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegas.",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "No tendrás espacio para las excusas, desde Humano tienes tu próximo plan a la vuelta de la esquina.",
        "fase": "A la vuelta de la aventura",
        "titulo": "Ubicación privilegiada",
        "contenido": "Parapente, surf o simplemente quedarte en el hotel. Vive lo local a tu manera. Pregunta en recepción qué está pasando hoy en la ciudad y en Humano.",
        "imagen": "",
        "cierre": "Podemos recomendarles su próxima aventura",
        "proximo_paso": "",
        "ctas": "Happenings / Actividades al aire libre / Deluxe King"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Un espacio pensado para los dos",
        "fase": "La experiencia Humano",
        "titulo": "Lo que necesitan en un lugar",
        "contenido": "Aqui todo avanza a tu ritmo. Habitaciones para descansar, piscina y gym para activarte, y masajes para desconectar. ",
        "imagen": "",
        "cierre": "Cuéntame qué tipo de habitación buscas, ¿más espacio o mejor vista?",
        "proximo_paso": "",
        "ctas": "Superior King / Deluxe King / Restaurantes"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Si viajan con otra pareja aventurera o quieren espacio extra para equipamiento, las habitaciones comunicantes son perfectas.",
        "fase": "La experiencia Humano",
        "titulo": "Habitaciones Comunicantes para Aventureros",
        "contenido": "Dos habitaciones conectadas ideales para parejas aventureras que viajan juntas. Espacio amplio para guardar equipo deportivo (surf, bici, parapente), área común para planear rutas, y cada pareja con su privacidad. Incluye duchas potentes para después de las aventuras.",
        "imagen": "",
        "cierre": "¿Viajan con otra pareja o necesitan espacio extra para equipamiento?",
        "proximo_paso": "",
        "ctas": "Reserva / Storage / Tours grupales"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "SUITES",
        "intro": "",
        "fase": "La experiencia Humano",
        "titulo": "Junior Suite King",
        "contenido": "Habitación de 32m2 con cama King, TV 50”, bata, pantuflas, Wi-Fi, cafetera, minibar, clóset amplio y baño completo con tina y ducha.",
        "imagen": "",
        "cierre": "¿Ya cuentas con fechas de estadía? Confirma nuestra disponibilidad y reserva en marriott.com",
        "proximo_paso": "",
        "ctas": "Reserva / Salas para reuniones / Coworking"
      }
    ]
  },
  {
    "name": "Aventura Grupo",
    "icon": "🧭👨‍👩‍👧‍👦",
    "description": "Grupo de aventureros explorando Lima",
    "caracteristica": "aventura",
    "grupo": "grupo",
    "conversations": [
      {
        "topic": "UBICACIÓN",
        "sub_tema": "MIRAFLORES",
        "intro": "Si el grupo ya se puso de acuerdo, lo demás fluye solo. Aquí estamos para acompañarlos en su próxima aventura",
        "fase": "Cerca de todo",
        "titulo": "Ubicación privilegiada",
        "contenido": "Nos encontramos en Miraflores, a unos pasos del Malecón del Pacífico, parques como John F. Kennedy park y parque del amor, mercado indio, tiendas y vida nocturna. Perfecto para explorar juntos y disfrutar lo mejor del barrio",
        "imagen": "",
        "cierre": "Dime cuántos días vienes y qué planes tienes para esos días, puedo ayudarte con algunas recomendaciones",
        "proximo_paso": "",
        "ctas": "Solo 24 horas / 3 días / Restaurantes"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "¿CÓMO LLEGAR?",
        "intro": "Si vienes del aeropuerto podemos recogerte o brindarte las mejores opciones para que llegues a Miraflores.",
        "fase": "Traslados",
        "titulo": "Recojo del Aeropuerto",
        "contenido": "Si no quieres coordinar una mini van o sprinter nosotros lo hacemos por ti. Solo confírmanos cuántas personas son para indicarte el precio",
        "imagen": "",
        "cierre": "¿Deseas coordinarlo? Cuéntanos qué día y a qué hora llegas.",
        "proximo_paso": "",
        "ctas": "Early Check In / Contacto / Reserva"
      },
      {
        "topic": "UBICACIÓN",
        "sub_tema": "ALREDEDORES",
        "intro": "No tendrás espacio para las excusas, desde Humano tienes tu próximo plan a la vuelta de la esquina.",
        "fase": "A la vuelta de la aventura",
        "titulo": "Ubicación privilegiada",
        "contenido": "Aventura en grupo, a tu ritmo. Clases de Surf en el Pacífico o bici por el malecón. Experiencias para moverse, reírse y conectar con Miraflores. Pregunta en recepción y lo armamos juntos",
        "imagen": "",
        "cierre": "¿Quieres que armemos un posible itinerario según los días de estancia?",
        "proximo_paso": "",
        "ctas": "Reserva / Actividades / Itinerario"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "DISEÑO / COMODIDAD",
        "intro": "Un espacio pensado para ustedes",
        "fase": "La experiencia Humano",
        "titulo": "Lo que necesitan en un lugar",
        "contenido": "Podemos asignarles habitaciones en el mismo piso. Nuestras habitaciones Superiores cuentan con 25m2 cama king o 2 camas de 2 plazas y son perfectas para descansar luego de un largo día de recorrer la ciudad.",
        "imagen": "",
        "cierre": "Cuéntanos cuántas habitaciones necesitas y cuántas personas son para acomodarlos de la mejor manera",
        "proximo_paso": "",
        "ctas": "Superior King / Deluxe King / Happenings"
      },
      {
        "topic": "HABITACIONES",
        "sub_tema": "FAM Y COMUNICANTES",
        "intro": "Habitaciones que se adaptan para familias",
        "fase": "Descanso profundo",
        "titulo": "Comodidad sin preocupaciones",
        "contenido": "Si viajas en familia tenemos habitaciones con 1 cama king + 1 sofá cama de 2 plazas o si prefieren habitaciones separadas también contamos con comunicantes.",
        "imagen": "",
        "cierre": "¿Cuál prefieres?",
        "proximo_paso": "",
        "ctas": "Familiar / Comunicante / Reserva"
      }
    ]
  }
]
