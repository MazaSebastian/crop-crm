export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dj' | 'technician';
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  client: string;
  guests: number;
  type: 'wedding' | 'birthday' | 'corporate' | 'other';
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  dj?: string;
  technician?: string;
  equipment: Equipment[];
  notes?: string;
}

export interface Equipment {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  category: string;
  location: string;
  status: 'operational' | 'maintenance' | 'repair' | 'retired';
  purchaseDate: string;
  warranty: string;
  lastMaintenance: string;
  nextMaintenance: string;
  assignedTo: string;
  notes: string;
}

export interface Playlist {
  id: string;
  name: string;
  eventId: string;
  songs: Song[];
  duration: number;
  createdBy: string;
  createdAt: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  bpm?: number;
  key?: string;
}

export interface Maintenance {
  id: number;
  title: string;
  equipment: string;
  type: 'Preventivo' | 'Correctivo' | 'Predictivo';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  scheduledDate: string;
  assignedTo: string;
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  description: string;
  estimatedDuration: string;
  location: string;
  notes: string;
}

export interface TechnicalAlert {
  id: number;
  title: string;
  description: string;
  type: 'error' | 'warning' | 'info';
  time: string;
  equipmentId?: number;
}

export interface TechnicalTask {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  time: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// Tipos para comunicación con el sistema de DJs
export interface DJCheckIn {
  id: number;
  djId: string;
  djName: string;
  eventId: string;
  eventName: string;
  checkInTime: string;
  equipmentStatus: {
    mixer: 'ok' | 'issue' | 'not-checked';
    cdj1: 'ok' | 'issue' | 'not-checked';
    cdj2: 'ok' | 'issue' | 'not-checked';
    amplifier: 'ok' | 'issue' | 'not-checked';
    speakers: 'ok' | 'issue' | 'not-checked';
  };
  notes: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface DJReport {
  id: number;
  djId: string;
  djName: string;
  eventId: string;
  eventName: string;
  reportDate: string;
  issueType: 'technical' | 'equipment' | 'sound' | 'other';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  assignedTechnician?: string;
  resolution?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'dj' | 'technician' | 'admin';
  message: string;
  timestamp: string;
  eventId?: string;
  isUrgent: boolean;
}

export interface LiveEvent {
  id: string;
  name: string;
  date: string;
  djId: string;
  djName: string;
  status: 'upcoming' | 'active' | 'completed';
  equipmentStatus: {
    operational: number;
    issues: number;
    total: number;
  };
  lastCheckIn?: string;
}

export interface TechnicalStats {
  totalEquipment: number;
  operationalEquipment: number;
  maintenanceNeeded: number;
  criticalAlerts: number;
  activeEvents: number;
  pendingReports: number;
  onlineDjs: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Tipos para el sistema de coordinación
export interface EventCode {
  code: string;
  clientName: string;
  eventType: 'Casamiento' | 'Cumpleaños' | 'XV' | 'Corporativo' | 'Graduación' | 'Otro';
  eventDate: string;
  eventTime: string;
  guestCount: number;
  venue: string;
}

export interface CoordinationQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'time';
  options?: string[];
  required: boolean;
  order: number;
  category: 'general' | 'music' | 'logistics' | 'special_requests';
}

export interface CoordinationAnswer {
  questionId: string;
  answer: string | string[] | number;
}

export interface CoordinationSession {
  id: string;
  eventCode: string;
  eventInfo: EventCode;
  answers: CoordinationAnswer[];
  currentStep: number;
  totalSteps: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  questions: CoordinationQuestion[];
  eventTypes: EventCode['eventType'][];
}

// ==========================
// Tipos para Gestión de Cultivos (CRM de Cultivo)
// ==========================

export interface CropPartner {
  id: string;
  name: string;
  email: string;
}

export interface Crop {
  id: string;
  name: string;
  location?: string;
  startDate: string; // ISO
  photoUrl?: string;
  partners: CropPartner[]; // pensado para 2 personas
  status: 'active' | 'paused' | 'completed';
}

export interface EnvParams {
  temperatureC: number; // °C
  humidityPct: number; // %
  soilMoisturePct?: number; // %
  ph?: number; // 0-14
  ecMs?: number; // mS/cm
}

export interface DailyRecord {
  id: string;
  cropId: string;
  date: string; // ISO date
  params: EnvParams;
  notes?: string;
  photos?: string[];
  createdBy: string; // partner id
  createdAt: string; // ISO timestamp
}

export interface CropTask {
  id: string;
  cropId: string;
  title: string;
  description?: string;
  assignedTo?: string; // partner id
  status: 'pending' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO date
  createdAt: string;
  createdBy: string;
  completedAt?: string;
}

// ==========================
// Tipos para Gestión de Insumos (Materia Prima)
// ==========================

export interface Insumo {
  id: string;
  nombre: string;
  categoria: 'semillas' | 'fertilizantes' | 'sustratos' | 'herramientas' | 'pesticidas' | 'otros';
  unidad_medida: string;
  precio_actual: number;
  precio_anterior?: number;
  proveedor?: string;
  fecha_ultima_compra?: string;
  fecha_ultimo_precio: string;
  stock_actual: number;
  stock_minimo: number;
  notas?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface HistorialPrecio {
  id: string;
  insumo_id: string;
  precio: number;
  fecha_cambio: string;
  motivo_cambio?: 'compra' | 'ajuste' | 'inflación' | 'oferta' | 'otro';
  proveedor?: string;
  cantidad_comprada?: number;
  costo_total?: number;
  created_at: string;
  created_by?: string;
}

export interface InsumoConHistorial extends Insumo {
  historial_precios: HistorialPrecio[];
  variacion_precio?: number;
  porcentaje_variacion?: number;
}
