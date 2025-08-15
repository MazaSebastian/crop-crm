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

export type GrowthStage = 'vegetative' | 'flowering';

export interface DailyRecord {
  id: string;
  cropId: string;
  date: string; // ISO date
  params: EnvParams;
  notes?: string;
  photos?: string[];
  createdBy: string; // partner id
  createdAt: string; // ISO timestamp
  stage?: GrowthStage;
  isCritical?: boolean;
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

// Comunicaciones entre socios
export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  createdBy: string; // partner id
  createdAt: string; // ISO
}

// Acciones/actividades relevantes realizadas en el cultivo
export type ActivityType = 'fertilization' | 'compost_tea' | 'watering' | 'pruning' | 'harvest' | 'other';

export interface Activity {
  id: string;
  cropId: string;
  type: ActivityType;
  title: string;
  details?: string;
  date: string; // ISO date
}

// Eventos planificados/manuales sobre el calendario (futuro)
export type PlannedEventType = 'milestone' | 'phase' | 'fertilization' | 'watering' | 'other';

export interface PlannedEvent {
  id: string;
  cropId: string;
  date: string; // ISO date YYYY-MM-DD
  title: string;
  type?: PlannedEventType;
  status?: 'green' | 'yellow' | 'red';
  createdAt?: string; // ISO timestamp
}
