import { 
  LiveEvent, 
  TechnicalStats, 
  TechnicalAlert, 
  DJCheckIn, 
  DJReport, 
  ChatMessage,
  Equipment,
  Maintenance
} from '../types';
import type { Crop, CropTask, DailyRecord } from '../types';

// Datos de prueba para eventos en vivo
export const mockLiveEvents: LiveEvent[] = [
  {
    id: 'event-1',
    name: 'Boda María & Juan',
    date: '2024-08-15',
    djId: 'dj-001',
    djName: 'DJ Carlos',
    status: 'active',
    equipmentStatus: {
      operational: 8,
      issues: 2,
      total: 10
    },
    lastCheckIn: '2024-08-14T15:30:00Z'
  },
  {
    id: 'event-2',
    name: 'Cumpleaños 15 Años',
    date: '2024-08-16',
    djId: 'dj-002',
    djName: 'DJ Ana',
    status: 'upcoming',
    equipmentStatus: {
      operational: 10,
      issues: 0,
      total: 10
    }
  },
  {
    id: 'event-3',
    name: 'Evento Corporativo TechCorp',
    date: '2024-08-14',
    djId: 'dj-003',
    djName: 'DJ Miguel',
    status: 'completed',
    equipmentStatus: {
      operational: 9,
      issues: 1,
      total: 10
    },
    lastCheckIn: '2024-08-14T10:00:00Z'
  }
];

// Estadísticas de prueba
export const mockStats: TechnicalStats = {
  totalEquipment: 45,
  operationalEquipment: 38,
  maintenanceNeeded: 5,
  criticalAlerts: 2,
  activeEvents: 1,
  pendingReports: 3,
  onlineDjs: 2
};

// Alertas del sistema
export const mockAlerts: TechnicalAlert[] = [
  {
    id: 1,
    title: 'Amplificador Principal - Sobrecalentamiento',
    description: 'El amplificador principal está registrando temperaturas anormalmente altas. Se recomienda revisión inmediata.',
    type: 'error',
    time: '2024-08-14T16:05:00Z',
    equipmentId: 101
  },
  {
    id: 2,
    title: 'Mantenimiento Preventivo - CDJ 2000',
    description: 'CDJ 2000 requiere mantenimiento preventivo programado para mañana.',
    type: 'warning',
    time: '2024-08-14T15:30:00Z',
    equipmentId: 205
  },
  {
    id: 3,
    title: 'Nuevo DJ Conectado',
    description: 'DJ Ana se ha conectado al sistema y está preparando el evento de mañana.',
    type: 'info',
    time: '2024-08-14T15:15:00Z'
  },
  {
    id: 4,
    title: 'Check-in Completado - Boda María & Juan',
    description: 'DJ Carlos ha completado el check-in técnico para el evento actual.',
    type: 'info',
    time: '2024-08-14T15:00:00Z'
  }
];

// Check-ins de DJs
export const mockCheckIns: DJCheckIn[] = [
  {
    id: 1,
    djId: 'dj-001',
    djName: 'DJ Carlos',
    eventId: 'event-1',
    eventName: 'Boda María & Juan',
    checkInTime: '2024-08-14T15:00:00Z',
    equipmentStatus: {
      mixer: 'ok',
      cdj1: 'ok',
      cdj2: 'issue',
      amplifier: 'issue',
      speakers: 'ok'
    },
    notes: 'CDJ2 tiene problema con el pitch bend. Amplificador haciendo ruido extraño.',
    status: 'pending'
  },
  {
    id: 2,
    djId: 'dj-002',
    djName: 'DJ Ana',
    eventId: 'event-2',
    eventName: 'Cumpleaños 15 Años',
    checkInTime: '2024-08-14T14:30:00Z',
    equipmentStatus: {
      mixer: 'ok',
      cdj1: 'ok',
      cdj2: 'ok',
      amplifier: 'ok',
      speakers: 'ok'
    },
    notes: 'Todo el equipamiento funcionando perfectamente.',
    status: 'reviewed'
  }
];

// Reportes de DJs
export const mockReports: DJReport[] = [
  {
    id: 1,
    djId: 'dj-001',
    djName: 'DJ Carlos',
    eventId: 'event-1',
    eventName: 'Boda María & Juan - Sala Principal',
    reportDate: '2024-08-14T15:05:00Z',
    issueType: 'technical',
    description: 'CDJ2 no responde correctamente al pitch bend. Necesita calibración o posible reemplazo del potenciómetro.',
    priority: 'high',
    status: 'open'
  },
  {
    id: 2,
    djId: 'dj-001',
    djName: 'DJ Carlos',
    eventId: 'event-1',
    eventName: 'Boda María & Juan - Sala Principal',
    reportDate: '2024-08-14T15:10:00Z',
    issueType: 'equipment',
    description: 'Amplificador principal emite un zumbido constante. Posible problema con la fuente de alimentación.',
    priority: 'critical',
    status: 'in-progress',
    assignedTechnician: 'Técnico Juan'
  },
  {
    id: 3,
    djId: 'dj-003',
    djName: 'DJ Miguel',
    eventId: 'event-3',
    eventName: 'Evento Corporativo TechCorp - Sala Principal',
    reportDate: '2024-08-14T12:00:00Z',
    issueType: 'sound',
    description: 'Los altavoces laterales tienen distorsión en frecuencias altas. Se resolvió ajustando el crossover.',
    priority: 'medium',
    status: 'resolved',
    assignedTechnician: 'Técnico María',
    resolution: 'Ajustado crossover de altavoces laterales. Problema resuelto.'
  },
  {
    id: 4,
    djId: 'dj-002',
    djName: 'DJ Ana',
    eventId: 'event-4',
    eventName: 'Cumpleaños 15 Años - Sala VIP',
    reportDate: '2024-08-14T14:30:00Z',
    issueType: 'equipment',
    description: 'El proyector no enciende correctamente. Necesita revisión de la fuente de alimentación.',
    priority: 'high',
    status: 'open'
  },
  {
    id: 5,
    djId: 'dj-004',
    djName: 'DJ Roberto',
    eventId: 'event-5',
    eventName: 'Fiesta de Graduación - Sala Exterior',
    reportDate: '2024-08-14T13:15:00Z',
    issueType: 'sound',
    description: 'Los altavoces exteriores tienen volumen bajo. Posible problema con el amplificador.',
    priority: 'medium',
    status: 'in-progress',
    assignedTechnician: 'Técnico Pedro'
  },
  {
    id: 6,
    djId: 'dj-005',
    djName: 'DJ Laura',
    eventId: 'event-6',
    eventName: 'Evento Social - Sala Principal',
    reportDate: '2024-08-14T11:45:00Z',
    issueType: 'technical',
    description: 'El sistema de iluminación no responde a los controles DMX.',
    priority: 'critical',
    status: 'resolved',
    assignedTechnician: 'Técnico Juan',
    resolution: 'Reemplazado cable DMX defectuoso. Sistema funcionando correctamente.'
  },
  {
    id: 7,
    djId: 'dj-006',
    djName: 'DJ Marcos',
    eventId: 'event-7',
    eventName: 'Boda de Verano - Sala VIP',
    reportDate: '2024-08-14T10:20:00Z',
    issueType: 'other',
    description: 'El aire acondicionado no funciona en la sala VIP.',
    priority: 'low',
    status: 'open'
  },
  {
    id: 8,
    djId: 'dj-007',
    djName: 'DJ Sofia',
    eventId: 'event-8',
    eventName: 'Evento Corporativo - Sala Exterior',
    reportDate: '2024-08-14T09:30:00Z',
    issueType: 'sound',
    description: 'Los micrófonos inalámbricos tienen interferencia.',
    priority: 'high',
    status: 'resolved',
    assignedTechnician: 'Técnico María',
    resolution: 'Cambiado canal de frecuencia. Interferencia eliminada.'
  }
];

// Mensajes del chat
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'dj-001',
    senderName: 'DJ Carlos',
    senderType: 'dj',
    message: 'Hola técnicos, tengo un problema con el CDJ2. El pitch bend no funciona correctamente.',
    timestamp: '2024-08-14T15:05:00Z',
    eventId: 'event-1',
    isUrgent: true
  },
  {
    id: 'msg-2',
    senderId: 'tech-001',
    senderName: 'Técnico Juan',
    senderType: 'technician',
    message: 'Hola Carlos, ya veo el reporte. Voy a revisar el CDJ2 en 10 minutos.',
    timestamp: '2024-08-14T15:07:00Z',
    eventId: 'event-1',
    isUrgent: false
  },
  {
    id: 'msg-3',
    senderId: 'dj-001',
    senderName: 'DJ Carlos',
    senderType: 'dj',
    message: 'Perfecto, gracias. También el amplificador está haciendo un ruido extraño.',
    timestamp: '2024-08-14T15:08:00Z',
    eventId: 'event-1',
    isUrgent: true
  },
  {
    id: 'msg-4',
    senderId: 'tech-001',
    senderName: 'Técnico Juan',
    senderType: 'technician',
    message: 'Entendido. Voy a revisar ambos equipos. ¿Puedes continuar con el evento mientras tanto?',
    timestamp: '2024-08-14T15:09:00Z',
    eventId: 'event-1',
    isUrgent: false
  },
  {
    id: 'msg-5',
    senderId: 'dj-001',
    senderName: 'DJ Carlos',
    senderType: 'dj',
    message: 'Sí, puedo continuar. El CDJ1 funciona perfectamente. Gracias por la rápida respuesta.',
    timestamp: '2024-08-14T15:10:00Z',
    eventId: 'event-1',
    isUrgent: false
  }
];

// Equipamiento de prueba
export const mockEquipment: Equipment[] = [
  {
    id: 101,
    name: 'Amplificador Principal',
    model: 'Crown XLS 2502',
    serialNumber: 'CRW-2024-001',
    category: 'Amplificación',
    location: 'Sala Principal',
    status: 'repair',
    purchaseDate: '2023-01-15',
    warranty: '2025-01-15',
    lastMaintenance: '2024-07-15',
    nextMaintenance: '2024-09-15',
    assignedTo: 'Técnico Juan',
    notes: 'Problema de zumbido reportado por DJ Carlos'
  },
  {
    id: 102,
    name: 'CDJ 2000 NXS2',
    model: 'Pioneer CDJ-2000NXS2',
    serialNumber: 'PIO-2024-001',
    category: 'Reproducción',
    location: 'Sala Principal',
    status: 'maintenance',
    purchaseDate: '2023-03-20',
    warranty: '2025-03-20',
    lastMaintenance: '2024-06-20',
    nextMaintenance: '2024-09-20',
    assignedTo: 'Técnico Juan',
    notes: 'Pitch bend defectuoso'
  },
  {
    id: 103,
    name: 'Mixer DJM 900 NXS2',
    model: 'Pioneer DJM-900NXS2',
    serialNumber: 'PIO-2024-002',
    category: 'Mezcla',
    location: 'Sala Principal',
    status: 'operational',
    purchaseDate: '2023-03-20',
    warranty: '2025-03-20',
    lastMaintenance: '2024-07-10',
    nextMaintenance: '2024-10-10',
    assignedTo: 'Sistema',
    notes: 'Funcionando perfectamente'
  }
];

// Mantenimientos de prueba
export const mockMaintenance: Maintenance[] = [
  {
    id: 1,
    title: 'Mantenimiento Preventivo - CDJ 2000',
    equipment: 'CDJ 2000 NXS2',
    type: 'Preventivo',
    status: 'scheduled',
    scheduledDate: '2024-08-15',
    assignedTo: 'Técnico Juan',
    priority: 'Media',
    description: 'Mantenimiento preventivo mensual del CDJ 2000 NXS2',
    estimatedDuration: '2 horas',
    location: 'Sala Principal',
    notes: 'Incluir limpieza de cabezal y calibración de pitch'
  },
  {
    id: 2,
    title: 'Reparación Amplificador Principal',
    equipment: 'Amplificador Principal',
    type: 'Correctivo',
    status: 'in-progress',
    scheduledDate: '2024-08-14',
    assignedTo: 'Técnico Juan',
    priority: 'Alta',
    description: 'Reparar problema de zumbido en amplificador principal',
    estimatedDuration: '3 horas',
    location: 'Sala Principal',
    notes: 'Posible problema con fuente de alimentación'
  },
  {
    id: 3,
    title: 'Calibración Sistema de Sonido',
    equipment: 'Sistema Completo',
    type: 'Predictivo',
    status: 'completed',
    scheduledDate: '2024-08-13',
    assignedTo: 'Técnico María',
    priority: 'Baja',
    description: 'Calibración completa del sistema de sonido',
    estimatedDuration: '4 horas',
    location: 'Todas las Salas',
    notes: 'Calibración exitosa, sistema optimizado'
  }
];

// Función para simular actualizaciones en tiempo real
export const simulateRealTimeUpdates = (callback: (data: any) => void) => {
  const interval = setInterval(() => {
    // Simular nuevas alertas
    const newAlert: TechnicalAlert = {
      id: Date.now(),
      title: 'Simulación - Nueva Alerta',
      description: 'Esta es una alerta simulada para probar el sistema en tiempo real.',
      type: 'info',
      time: new Date().toISOString()
    };
    
    callback({ type: 'new-alert', data: newAlert });
  }, 30000); // Cada 30 segundos

  return () => clearInterval(interval);
};

// Función para simular mensajes de chat
export const simulateChatMessage = (callback: (message: ChatMessage) => void) => {
  const messages = [
    'Hola técnicos, ¿cómo va todo?',
    'Necesito ayuda con el equipo',
    'Todo funcionando perfectamente',
    'Gracias por la asistencia'
  ];
  
  const senders = [
    { id: 'dj-001', name: 'DJ Carlos', type: 'dj' as const },
    { id: 'dj-002', name: 'DJ Ana', type: 'dj' as const },
    { id: 'tech-001', name: 'Técnico Juan', type: 'technician' as const }
  ];
  
  const interval = setInterval(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomSender = senders[Math.floor(Math.random() * senders.length)];
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: randomSender.id,
      senderName: randomSender.name,
      senderType: randomSender.type,
      message: randomMessage,
      timestamp: new Date().toISOString(),
      eventId: 'event-1',
      isUrgent: Math.random() > 0.8
    };
    
    callback(newMessage);
  }, 45000); // Cada 45 segundos

  return () => clearInterval(interval);
};

// ==========================
// Datos mock para Gestión de Cultivos (2 personas)
// ==========================

const STORAGE_KEYS = {
  crops: 'crop_crops',
  records: 'crop_records',
  tasks: 'crop_tasks'
};

const inMemory: {
  crops?: Crop[];
  records?: DailyRecord[];
  tasks?: CropTask[];
} = {};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const mockCropPartners = [
  { id: 'partner-1', name: 'Socio A', email: 'socioa@example.com' },
  { id: 'partner-2', name: 'Socio B', email: 'sociob@example.com' }
];

export function getCrops(): Crop[] {
  if (!inMemory.crops) {
    inMemory.crops = loadFromStorage<Crop[]>(STORAGE_KEYS.crops, [
      {
        id: 'crop-1',
        name: 'Tomates Cherry',
        location: 'Invernadero Norte',
        startDate: new Date().toISOString().slice(0, 10),
        photoUrl: undefined,
        partners: mockCropPartners,
        status: 'active'
      }
    ]);
  }
  return inMemory.crops;
}

export function saveCrops(crops: Crop[]) {
  inMemory.crops = crops;
  saveToStorage(STORAGE_KEYS.crops, crops);
}

export function getDailyRecords(cropId: string): DailyRecord[] {
  if (!inMemory.records) {
    const today = new Date();
    const isoDate = today.toISOString().slice(0, 10);
    inMemory.records = loadFromStorage<DailyRecord[]>(STORAGE_KEYS.records, [
      {
        id: 'rec-1',
        cropId: 'crop-1',
        date: isoDate,
        params: { temperatureC: 24, humidityPct: 65, soilMoisturePct: 45, ph: 6.3, ecMs: 1.8 },
        notes: 'Riego ligero por la mañana. Plantas vigorosas.',
        photos: [],
        createdBy: 'partner-1',
        createdAt: new Date().toISOString()
      }
    ]);
  }
  return inMemory.records.filter(r => r.cropId === cropId);
}

export function addDailyRecord(record: DailyRecord) {
  const records = inMemory.records ?? getDailyRecords(record.cropId);
  const updated = [record, ...records];
  inMemory.records = updated;
  saveToStorage(STORAGE_KEYS.records, updated);
}

export function getTasks(cropId: string): CropTask[] {
  if (!inMemory.tasks) {
    inMemory.tasks = loadFromStorage<CropTask[]>(STORAGE_KEYS.tasks, [
      {
        id: 'task-1',
        cropId: 'crop-1',
        title: 'Revisión de plagas',
        description: 'Inspeccionar hojas nuevas',
        assignedTo: 'partner-2',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        createdBy: 'partner-1'
      }
    ]);
  }
  return inMemory.tasks.filter(t => t.cropId === cropId);
}

export function upsertTask(task: CropTask) {
  const tasks = inMemory.tasks ?? [];
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) {
    tasks[idx] = task;
  } else {
    tasks.unshift(task);
  }
  inMemory.tasks = tasks;
  saveToStorage(STORAGE_KEYS.tasks, tasks);
}

