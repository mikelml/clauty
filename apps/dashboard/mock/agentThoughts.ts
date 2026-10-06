// Bitácora interna de cada agente — pensamientos y pasos que dieron durante el día.
// Representa "lo que el agente pensó" antes/durante/después de sus intervenciones públicas.
// No siempre lee al usuario — es su monólogo interno.

export type Thought = {
  ts: string;              // "09:12"
  text: string;
  kind?: 'thought' | 'action' | 'query' | 'note';
};

export const agentThoughts: Record<string, Thought[]> = {
  // ============ ROBERTO ============
  proveedores: [
    { ts: '08:15', text: 'Monitoreando WhatsApp Business. 4 proveedores activos hoy.', kind: 'note' },
    { ts: '10:22', text: 'Distribuidor Puebla escribió. Analizando tono del mensaje.', kind: 'thought' },
    { ts: '10:24', text: 'Detectado: "aumento de 8% desde el lunes". Buscando histórico.', kind: 'query' },
    { ts: '10:26', text: 'Cruzando con CONTPAQi: en 6 meses subieron 2 veces. Media: +4%.', kind: 'query' },
    { ts: '10:28', text: 'Este aumento es el doble de su promedio. Vale explorar alternativas.', kind: 'thought' },
    { ts: '10:29', text: 'Distribuidor Aceites GDL tiene Castrol 20W-50 a $318. Comparable.', kind: 'query' },
    { ts: '10:30', text: 'Cotización lista. Enviada al chat de Roberto.', kind: 'action' },
  ],
  ventas: [
    { ts: '07:00', text: 'Cierre de ayer: $47,380. +12% vs martes pasado. Ticket promedio estable.', kind: 'note' },
    { ts: '07:01', text: 'Bosch P/N 0986: 3u en stock, venta media 8/sem. Alerta reposición.', kind: 'thought' },
    { ts: '11:00', text: 'Ventas corriendo 9% arriba para ser martes. Sigue patrón.', kind: 'note' },
    { ts: '14:30', text: 'Inventario Zapopan bajo en filtros aceite. Ping a Proveedores.', kind: 'action' },
  ],
  nomina: [
    { ts: '09:00', text: 'Revisando histórico del empleado que pidió adelanto.', kind: 'query' },
    { ts: '09:02', text: 'Limpio: 0 retardos, 0 faltas, 18 meses. Adelantos anteriores: 2, devueltos sin fricción.', kind: 'note' },
    { ts: '12:55', text: 'WhatsApp entrante: solicita $3,500. Contable ya validó BBVA.', kind: 'thought' },
    { ts: '12:58', text: 'Propuesta: aprobar con descuento en 2 quincenas. Genera prompt.', kind: 'action' },
  ],
  familiar: [
    { ts: '08:30', text: 'Calendario de cumpleaños: Sofía en 9 días.', kind: 'note' },
    { ts: '15:28', text: 'Señal entrante desde red de confianza: interés repetido en zapato deportivo.', kind: 'thought' },
    { ts: '15:29', text: 'Cruzo con calendario + presupuesto familiar Roberto.', kind: 'query' },
    { ts: '15:30', text: 'Amazon MX $1,890 vs Liverpool $2,090. Amazon llega antes. Prompt listo.', kind: 'action' },
  ],
  contable: [
    { ts: '10:00', text: 'Revisión diaria SAT. Nada pendiente esta semana.', kind: 'note' },
    { ts: '11:45', text: 'Validando flujo BBVA Empresas para Nómina.', kind: 'query' },
  ],
  compras: [
    { ts: '15:31', text: 'Familiar pidió validar Amazon MX. Confirmado stock + tiempo envío.', kind: 'action' },
  ],
  operaciones: [
    { ts: '06:00', text: 'Recién nacido. Leyendo datos históricos de Ventas y Proveedores.', kind: 'thought' },
    { ts: '06:12', text: 'Patrón encontrado: martes Tlaquepaque -40% vs promedio semanal.', kind: 'query' },
    { ts: '06:18', text: 'Hipótesis: staff reducido + reasignación 4h = ahorro + prospección.', kind: 'thought' },
    { ts: '17:55', text: 'Convergiendo con Ventas, Nómina y Proveedores. Plan listo.', kind: 'action' },
  ],

  // ============ MARIANA ============
  clientes: [
    { ts: '06:30', text: '14 correos nocturnos triados. 2 urgentes detectados.', kind: 'note' },
    { ts: '10:28', text: 'Mariana pidió enviar los 3 conceptos al cliente Monterrey.', kind: 'thought' },
    { ts: '10:29', text: 'Convocando a Creativo para exportar frames desde Figma.', kind: 'action' },
    { ts: '10:30', text: 'Email redactado en tono Mariana. Archivos en Drive. Enviado.', kind: 'action' },
  ],
  finanzas: [
    { ts: '09:00', text: 'Sincronizando Belvo con BBVA. Todo clean.', kind: 'note' },
    { ts: '13:00', text: 'Depósito $28,500. Aplicando regla: 30/20/50.', kind: 'action' },
    { ts: '13:01', text: 'SAT trimestral: aparté $8,550 en sub-cuenta de ahorro.', kind: 'action' },
  ],
  creativo: [
    { ts: '09:15', text: 'Biblioteca Figma sincronizada. 142 componentes activos.', kind: 'note' },
    { ts: '10:29', text: 'Exportando 3 frames para cliente Monterrey en PNG 2x y PDF.', kind: 'action' },
    { ts: '14:45', text: 'Concepto Guadalajara atorado. Sugiriendo pausa a Bienestar.', kind: 'thought' },
  ],
  bienestar: [
    { ts: '07:00', text: 'Apple Health: pasos bajos para esta hora.', kind: 'note' },
    { ts: '15:28', text: 'Mariana 4h sentada. Hueco de 45 min en calendario.', kind: 'thought' },
    { ts: '15:30', text: 'Creativo sugiere pausa creativa. Propongo playlist de estiramiento.', kind: 'action' },
  ],
  contenido: [
    { ts: '11:00', text: 'Cliente Monterrey firma mañana. Posible post para portafolio.', kind: 'thought' },
  ],
  focus_coach: [
    { ts: '10:15', text: 'Mariana en flow. No interrumpir. Solo Bienestar habla.', kind: 'note' },
  ],
  negocio: [
    { ts: '06:00', text: 'Recién nacido. Revisando últimos 3 meses de proyectos rechazados.', kind: 'thought' },
    { ts: '06:20', text: '4 rechazos por tiempo en 3 semanas. Todos diseñadores UX senior.', kind: 'query' },
    { ts: '06:45', text: 'Benchmarks: Glassdoor MX ($75K), DesignPro LATAM ($72K), ADCE ($78K).', kind: 'query' },
    { ts: '06:50', text: 'Mariana cobra $55K. 30% bajo el mercado. Propuesta en marcha.', kind: 'thought' },
    { ts: '17:55', text: 'Convergiendo con Clientes y Finanzas para plan de tarifas.', kind: 'action' },
  ],

  // ============ SOFÍA ============
  academico: [
    { ts: '07:00', text: 'Canvas: parcial IO viernes. Avance 45%. Faltan 3 temas.', kind: 'note' },
    { ts: '07:02', text: 'Calendario: bloque libre 17:00-17:20. Propongo simulación.', kind: 'thought' },
    { ts: '13:32', text: 'Ping a Sofía con plan de estudio alineado a horneado.', kind: 'action' },
  ],
  postres: [
    { ts: '10:25', text: 'Instagram DM entrante: 2 pedidos nuevos. Brownies x6 y Red velvet individual.', kind: 'note' },
    { ts: '10:26', text: 'Cost precios: 68/pza brownie, 45/pza red velvet. Aplicando margen 45%.', kind: 'query' },
    { ts: '10:28', text: 'Drafts listos. Política Sofía: no enviar sin aprobación.', kind: 'action' },
  ],
  social: [
    { ts: '15:20', text: 'Sofía guardó story. Detectado: Adidas Samba rosa.', kind: 'thought' },
    { ts: '15:22', text: 'Es la 4ª vez esta semana que interactúa con este producto.', kind: 'note' },
    { ts: '15:25', text: 'Red de confianza contiene a Roberto (papá). Señal enviada discretamente.', kind: 'action' },
  ],
  finanzas: [
    { ts: '13:01', text: 'Uber Eats depositó $487. Distribución: 40/30/30.', kind: 'action' },
  ],
  comercio: [
    { ts: '06:00', text: 'Recién nacido. Analizando los últimos 82 pedidos de IG DM.', kind: 'thought' },
    { ts: '06:30', text: '60% con @tec_monterrey en bio. Cluster súper concentrado.', kind: 'query' },
    { ts: '07:00', text: 'Maqueta Framer armada. Integración Mercado Pago lista.', kind: 'action' },
    { ts: '17:55', text: 'Convergiendo con Postres y Académico para plan de canal directo.', kind: 'action' },
  ],
};

export function getThoughtsFor(agentId: string): Thought[] {
  return agentThoughts[agentId] ?? [];
}
