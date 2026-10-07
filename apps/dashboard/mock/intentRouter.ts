// Enrutador de intención: matchea keywords del texto del user con un agente.
// Cada intent tiene una respuesta inicial + cadena de followups (pensamientos / acciones).
// Determinista para que las grabaciones sean predecibles.

import type { PersonaId } from '@/mock/personas';

export type MessageFlavor = 'reply' | 'thought' | 'action';

export type IntentFollowup = {
  delayMs: number;           // ms después de la previa antes de empezar typing
  typingMs?: number;
  text: string;
  flavor: MessageFlavor;
  integrations?: string[];   // ids de integraciones mencionadas
};

export type Intent = {
  agentId: string;
  reply: string;
  typingMs?: number;
  integrations?: string[];
  followups?: IntentFollowup[];
};

type Rule = {
  pattern: RegExp;
} & Intent;

const rules: Record<PersonaId, Rule[]> = {
  roberto: [
    {
      pattern: /venta|factur|ingres|tlaqu|zapopan/i,
      agentId: 'ventas',
      reply: 'Hoy vas en $12,340 MXN a las 2pm. Tlaquepaque corre lento como esperábamos, Zapopan +8% vs martes pasado.',
      typingMs: 1400,
      integrations: ['contpaqi'],
      followups: [
        {
          delayMs: 1800,
          typingMs: 900,
          text: 'Reviso inventario Bosch en las 2 sucursales…',
          flavor: 'thought',
        },
        {
          delayMs: 1500,
          typingMs: 1100,
          text: 'Tlaquepaque: 3 balatas. Zapopan: 7. Sugiero reposición esta semana antes del viernes.',
          flavor: 'action',
          integrations: ['contpaqi'],
        },
      ],
    },
    {
      pattern: /proveedor|precio|aceite|bosch|puebla/i,
      agentId: 'proveedores',
      reply: 'Puebla sigue con el nuevo precio. Distribuidor GDL me cotizó ayer a $318 el Castrol 20W-50.',
      typingMs: 1300,
      integrations: ['whatsapp_business', 'contpaqi'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Cruzando el histórico de 6 meses para validar si es atípico…',
          flavor: 'thought',
        },
        {
          delayMs: 1500,
          typingMs: 1000,
          text: 'En 6 meses Puebla subió 2 veces, promedio +4%. Este 8% es el doble. Te paso la comparativa.',
          flavor: 'action',
          integrations: ['contpaqi'],
        },
      ],
    },
    {
      pattern: /empleado|nómin|adelant|quincen|n[oó]mina/i,
      agentId: 'nomina',
      reply: 'La quincena del 30 está limpia. Sin novedades además del adelanto de hoy que ya quedó programado.',
      typingMs: 1100,
      integrations: ['contpaqi', 'bbva_empresas'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 800,
          text: 'Validando con Contable los descuentos de las próximas 2 quincenas…',
          flavor: 'thought',
        },
        {
          delayMs: 1300,
          typingMs: 900,
          text: 'Listo. Contable confirma. Transferencia queda agendada para el 30.',
          flavor: 'action',
          integrations: ['bbva_empresas'],
        },
      ],
    },
    {
      pattern: /sat|impuest|declarac|contador/i,
      agentId: 'contable',
      reply: 'Próxima provisional: 17 de noviembre. Con el flujo de este mes estás al corriente.',
      typingMs: 1200,
      integrations: ['satws'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Preparando el borrador del pago para mandarle a Ernesto…',
          flavor: 'thought',
        },
        {
          delayMs: 1400,
          typingMs: 900,
          text: 'Borrador listo. ¿Lo mando por Gmail a tu contador?',
          flavor: 'action',
          integrations: ['satws', 'gmail'],
        },
      ],
    },
    {
      pattern: /sof[ií]a|hija|regalo|cumple|samba/i,
      agentId: 'familiar',
      reply: 'Cumple de Sofía: 23 de octubre. Los Adidas Samba rosa ya quedaron en carrito Amazon.',
      typingMs: 1400,
      integrations: ['amazon_mx'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Revisando fechas de envío a Monterrey para que llegue a tiempo…',
          flavor: 'thought',
        },
        {
          delayMs: 1400,
          typingMs: 1000,
          text: 'Amazon llega el 21. Tienes 2 días de margen. ¿Confirmo la compra?',
          flavor: 'action',
          integrations: ['amazon_mx'],
        },
      ],
    },
    {
      pattern: /compra|amazon|liverpool|walmart/i,
      agentId: 'compras',
      reply: 'Puedo cotizar contra Liverpool y Walmart. Amazon siempre llega primero en GDL.',
      typingMs: 1100,
      integrations: ['amazon_mx'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Comparando precios actuales en los 3 retailers…',
          flavor: 'thought',
        },
        {
          delayMs: 1400,
          typingMs: 900,
          text: 'Amazon sigue ganando en precio y tiempo. Walmart +$80, Liverpool +$200.',
          flavor: 'action',
        },
      ],
    },
    {
      pattern: /patr[oó]n|martes|oper|staff/i,
      agentId: 'operaciones',
      reply: 'Ya identifiqué 3 talleres cercanos para cold-call esta tarde. Mando la lista si te interesa.',
      typingMs: 1500,
      integrations: ['contpaqi'],
      followups: [
        {
          delayMs: 2200,
          typingMs: 900,
          text: 'Convergiendo con Ventas y Nómina para armar el plan completo…',
          flavor: 'thought',
        },
        {
          delayMs: 1500,
          typingMs: 1200,
          text: 'Plan cerrado. Staff mínimo martes + cold-calls = $3,200/sem ahorro + prospección activa. ROI 4x proyectado.',
          flavor: 'action',
          integrations: ['contpaqi'],
        },
      ],
    },
    {
      pattern: /hola|buenas|qu[eé] tal|c[oó]mo est/i,
      agentId: 'ventas',
      reply: 'Todo en orden, Roberto. ¿En qué estás pensando?',
      typingMs: 700,
    },
  ],

  mariana: [
    {
      pattern: /cliente|correo|email|mandar|enviar/i,
      agentId: 'clientes',
      reply: 'Ya está redactándose. Tono warm-professional como siempre.',
      typingMs: 1200,
      integrations: ['gmail'],
      followups: [
        {
          delayMs: 1800,
          typingMs: 900,
          text: 'Pido a Creativo los últimos frames del Figma…',
          flavor: 'thought',
        },
        {
          delayMs: 1500,
          typingMs: 1000,
          text: 'Listo. Email enviado, frames exportados, copia archivada en Drive.',
          flavor: 'action',
          integrations: ['gmail', 'figma'],
        },
      ],
    },
    {
      pattern: /dinero|pag|banco|ahorr|sat|impuest|bbva/i,
      agentId: 'finanzas',
      reply: 'Tu SAT trimestral está cubierto ($8,550 apartados hoy). Tienes $11,400 en operación.',
      typingMs: 1300,
      integrations: ['bbva_personal'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 800,
          text: 'Revisando gastos fijos de este mes para proyectar el cierre…',
          flavor: 'thought',
        },
        {
          delayMs: 1300,
          typingMs: 900,
          text: 'Cerramos el mes con +$4,200 arriba del breakeven. Notion actualizado.',
          flavor: 'action',
          integrations: ['notion'],
        },
      ],
    },
    {
      pattern: /concepto|idea|diseñ|figma|frame/i,
      agentId: 'creativo',
      reply: 'Tengo 3 variantes del concepto Guadalajara. Te las muestro cuando termines flow.',
      typingMs: 1400,
      integrations: ['figma'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Preparando preview en PDF para que lo revises en el celular…',
          flavor: 'thought',
        },
        {
          delayMs: 1400,
          typingMs: 900,
          text: 'PDF listo en Drive. Link enviado por Gmail para que lo abras cuando tengas 5 min.',
          flavor: 'action',
          integrations: ['figma', 'gmail'],
        },
      ],
    },
    {
      pattern: /cansad|pausa|estirar|salud|duerm|playlist/i,
      agentId: 'bienestar',
      reply: 'Si quieres 10 min de respiración + una vuelta afuera, yo te lo pongo. Llevas 5h parada.',
      typingMs: 1100,
      integrations: ['apple_health'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 800,
          text: 'Bloqueo tu calendario 10 min para que no te interrumpan…',
          flavor: 'thought',
        },
        {
          delayMs: 1300,
          typingMs: 900,
          text: 'Listo. 15:45 a 15:55 bloqueado. Focus Coach respeta el tiempo.',
          flavor: 'action',
          integrations: ['google_calendar'],
        },
      ],
    },
    {
      pattern: /tarifa|precio|cobrar|proyec|negoci/i,
      agentId: 'negocio',
      reply: 'Tienes el template de pitch listo para el próximo cliente nuevo.',
      typingMs: 1400,
      integrations: ['gmail'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Cruzando con tus últimos 3 cierres para calibrar precio sugerido…',
          flavor: 'thought',
        },
        {
          delayMs: 1400,
          typingMs: 1000,
          text: 'Recomendación: $68K MXN para cliente mediano. Benchmarks Glassdoor + DesignPro lo respaldan.',
          flavor: 'action',
          integrations: ['glassdoor'],
        },
      ],
    },
    {
      pattern: /post|redes|social|ig|instagram/i,
      agentId: 'contenido',
      reply: 'El cliente Monterrey firma mañana — caso de estudio ideal.',
      typingMs: 1200,
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Preparando draft de post con los frames del proceso…',
          flavor: 'thought',
        },
      ],
    },
    {
      pattern: /hola|buenas|qu[eé] tal|c[oó]mo est/i,
      agentId: 'clientes',
      reply: 'Todo tranquilo, Mariana. ¿Te ayudo con algo?',
      typingMs: 700,
    },
  ],

  sofia: [
    {
      pattern: /pedido|postre|brownie|red velvet|horne|dulce/i,
      agentId: 'postres',
      reply: '2 drafts pendientes tuyos: brownies x6 ($408) y red velvet individual ($45).',
      typingMs: 1300,
      integrations: ['instagram_dm'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Revisando inventario de ingredientes para los 2 pedidos…',
          flavor: 'thought',
        },
        {
          delayMs: 1300,
          typingMs: 1000,
          text: 'Tienes todo menos cocoa premium — compra antes del jueves. ¿Te armo la lista?',
          flavor: 'action',
        },
      ],
    },
    {
      pattern: /tec|canvas|parcial|tarea|escuela|clase|estudi/i,
      agentId: 'academico',
      reply: 'Parcial IO viernes: 45% cubierto. Te agendé 20 min a las 5pm.',
      typingMs: 1400,
      integrations: ['canvas_tec'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Bloqueando tu calendario para que Postres no colisione con el estudio…',
          flavor: 'thought',
        },
        {
          delayMs: 1300,
          typingMs: 900,
          text: '17:00 a 17:20 bloqueado. Luego vuelves a hornear sin perder ritmo.',
          flavor: 'action',
        },
      ],
    },
    {
      pattern: /instagram|ig|story|seguid|dm/i,
      agentId: 'social',
      reply: 'Feed orgánico sin cambios. 3 saves nuevos de cuentas del Tec.',
      typingMs: 1100,
      integrations: ['instagram_dm'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Analizando el perfil de las 3 cuentas nuevas…',
          flavor: 'thought',
        },
        {
          delayMs: 1400,
          typingMs: 900,
          text: 'Las 3 son de Ingeniería Industrial. Tu cluster es super concentrado ahí.',
          flavor: 'action',
        },
      ],
    },
    {
      pattern: /dinero|deposit|uber|mercado|pago|banco/i,
      agentId: 'finanzas',
      reply: '$487 de Uber Eats entraron hoy. Fondo Tec lleva $2,340 de $8,000.',
      typingMs: 1200,
      integrations: ['uber_eats', 'mercado_pago'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Proyectando el cierre del semestre con el ritmo actual…',
          flavor: 'thought',
        },
        {
          delayMs: 1300,
          typingMs: 1000,
          text: 'Con el plan de Comercio vas a alcanzar la meta en 3 semanas. Sin él, 6.',
          flavor: 'action',
        },
      ],
    },
    {
      pattern: /landing|web|p[aá]gina|oxxo|spei|canal/i,
      agentId: 'comercio',
      reply: 'Maqueta Framer en v2. Mercado Pago con OXXO/SPEI ya conectado en testing.',
      typingMs: 1400,
      integrations: ['mercado_pago', 'figma'],
      followups: [
        {
          delayMs: 2000,
          typingMs: 900,
          text: 'Validando que el flow de compra funcione en mobile para clientes del Tec…',
          flavor: 'thought',
        },
        {
          delayMs: 1400,
          typingMs: 1000,
          text: 'Compra mobile en 4 taps. Listo para ir live cuando digas.',
          flavor: 'action',
          integrations: ['mercado_pago'],
        },
      ],
    },
    {
      pattern: /hola|buenas|qu[eé] tal|c[oó]mo est/i,
      agentId: 'academico',
      reply: '¡Hola! ¿En qué andas?',
      typingMs: 600,
    },
  ],
};

// Detección de intenciones universales (afirmar / rechazar) que deberían
// continuar el thread con el último agente activo.
const AFFIRMATIVE = /^\s*(s[ií]|ok(ay)?|dale|hazlo|hazla|procede|adelante|confirmo|perfecto|de acuerdo|vale|va|por *favor|plis)\b/i;
const NEGATIVE   = /^\s*(no|cancela|mejor no|espera|m[aá]ñana|despu[eé]s|not? ahora)\b/i;

function affirmativeIntent(agentId: string): Intent {
  return {
    agentId,
    reply: 'Perfecto. Lo ejecuto ahora.',
    typingMs: 700,
    followups: [
      {
        delayMs: 1500,
        typingMs: 900,
        text: 'Procesando tu confirmación y notificando a los agentes involucrados…',
        flavor: 'thought',
      },
      {
        delayMs: 1500,
        typingMs: 1000,
        text: 'Acción completada. Te marco cualquier detalle en cuanto haya respuesta.',
        flavor: 'action',
      },
    ],
  };
}

function negativeIntent(agentId: string): Intent {
  return {
    agentId,
    reply: 'Entendido, lo dejo pendiente.',
    typingMs: 700,
    followups: [
      {
        delayMs: 1500,
        typingMs: 800,
        text: 'Archivando el contexto para retomarlo cuando me digas…',
        flavor: 'thought',
      },
      {
        delayMs: 1400,
        typingMs: 900,
        text: 'Guardado en bitácora. Sin ejecutar.',
        flavor: 'action',
      },
    ],
  };
}

const fallbacks: Record<PersonaId, Intent> = {
  roberto: {
    agentId: 'operaciones',
    reply: 'Déjame lo platico con Ventas y te vuelvo en breve.',
    typingMs: 900,
    followups: [
      {
        delayMs: 2000,
        typingMs: 900,
        text: 'Consultando con Ventas y Nómina sobre tu request…',
        flavor: 'thought',
      },
      {
        delayMs: 1500,
        typingMs: 900,
        text: 'Tengo contexto suficiente. Te paso una propuesta en un momento.',
        flavor: 'action',
      },
    ],
  },
  mariana: {
    agentId: 'clientes',
    reply: 'Déjame miro y te paso un status en unos minutos.',
    typingMs: 900,
    followups: [
      {
        delayMs: 2000,
        typingMs: 900,
        text: 'Revisando tu Gmail y Calendar para armar contexto…',
        flavor: 'thought',
        integrations: ['gmail', 'google_calendar'],
      },
      {
        delayMs: 1500,
        typingMs: 900,
        text: 'Listo, ya tengo el panorama. Te respondo con un plan concreto.',
        flavor: 'action',
      },
    ],
  },
  sofia: {
    agentId: 'academico',
    reply: 'Ok, lo cruzo con tu calendario y te propongo algo.',
    typingMs: 900,
    followups: [
      {
        delayMs: 2000,
        typingMs: 900,
        text: 'Revisando Canvas y tu agenda de pedidos…',
        flavor: 'thought',
        integrations: ['canvas_tec'],
      },
      {
        delayMs: 1500,
        typingMs: 900,
        text: 'Tengo una propuesta que no colisiona con tu horneado. Te la mando.',
        flavor: 'action',
      },
    ],
  },
};

export function routeIntent(
  text: string,
  personaId: PersonaId,
  lastAgentId?: string,
): Intent {
  const trimmed = text.trim();

  // 1. Reglas específicas de la persona
  const personaRules = rules[personaId];
  for (const rule of personaRules) {
    if (rule.pattern.test(trimmed)) {
      const { pattern, ...intent } = rule;
      return intent;
    }
  }

  // 2. Afirmación / negación que continúa thread con el último agente
  if (lastAgentId) {
    if (AFFIRMATIVE.test(trimmed)) return affirmativeIntent(lastAgentId);
    if (NEGATIVE.test(trimmed))    return negativeIntent(lastAgentId);
  }

  // 3. Fallback con 2 followups
  return fallbacks[personaId];
}
