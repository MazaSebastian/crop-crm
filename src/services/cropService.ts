import type { Crop, CropTask, DailyRecord, Announcement, Activity, PlannedEvent } from '../types';
import { supabase } from './supabaseClient';

// ==========================
// Servicio de datos para Gestión de Cultivos (2 personas)
// ==========================

const STORAGE_KEYS = {
  crops: 'crop_crops',
  records: 'crop_records',
  tasks: 'crop_tasks',
  announcements: 'crop_announcements',
  activities: 'crop_activities',
  planned: 'crop_planned_events',
  inbox: 'crop_notification_inbox'
};

const inMemory: {
  crops?: Crop[];
  records?: DailyRecord[];
  tasks?: CropTask[];
  announcements?: Announcement[];
  activities?: Activity[];
  planned?: PlannedEvent[];
  inbox?: Record<string, number>; // cropId -> unread count
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
    const today = new Date().toISOString().slice(0, 10);
    inMemory.crops = loadFromStorage<Crop[]>(STORAGE_KEYS.crops, [
      {
        id: 'crop-richard',
        name: 'Carpa Richard',
        location: 'Sector A',
        startDate: today,
        partners: mockCropPartners,
        status: 'active'
      },
      {
        id: 'crop-robert',
        name: 'Carpa Robert',
        location: 'Sector B',
        startDate: today,
        partners: mockCropPartners,
        status: 'active'
      },
      {
        id: 'crop-chad',
        name: 'Carpa Chad',
        location: 'Sector C',
        startDate: today,
        partners: mockCropPartners,
        status: 'active'
      },
      {
        id: 'crop-sala-superior',
        name: 'Sala Superior',
        location: 'Edificio Principal - Piso 2',
        startDate: today,
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
  // Notificación: nuevo registro
  bumpInbox(record.cropId);
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

// Announcements (comunicaciones/avisos)
export function getAnnouncements(): Announcement[] {
  if (!inMemory.announcements) {
    inMemory.announcements = loadFromStorage<Announcement[]>(STORAGE_KEYS.announcements, [
      {
        id: 'ann-1',
        message: 'Recordatorio: revisar humedad mañana 8:00',
        type: 'info',
        createdBy: 'partner-1',
        createdAt: new Date().toISOString()
      }
    ]);
  }
  return inMemory.announcements;
}

export function addAnnouncement(a: Announcement) {
  const list = inMemory.announcements ?? getAnnouncements();
  const updated = [a, ...list];
  inMemory.announcements = updated;
  saveToStorage(STORAGE_KEYS.announcements, updated);
}

// ============ Supabase Sync (Announcements) ============
export async function syncAnnouncementsFromSupabase(): Promise<Announcement[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(100);
  if (error) return null;
  // map records
  const mapped: Announcement[] = (data || []).map((r: any) => ({
    id: r.id,
    message: r.message,
    type: r.type || 'info',
    createdBy: r.createdBy || 'partner-1',
    createdAt: r.createdAt,
  }));
  inMemory.announcements = mapped;
  saveToStorage(STORAGE_KEYS.announcements, mapped);
  return mapped;
}

export async function createAnnouncementSupabase(a: Announcement): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('announcements').insert({
    id: a.id,
    message: a.message,
    type: a.type,
    createdBy: a.createdBy,
    createdAt: a.createdAt,
  });
  return !error;
}

// Activities (acciones realizadas: fertilización, té de compost, etc.)
export function getActivities(cropId?: string): Activity[] {
  if (!inMemory.activities) {
    inMemory.activities = loadFromStorage<Activity[]>(STORAGE_KEYS.activities, [
      {
        id: 'act-1',
        cropId: 'crop-1',
        type: 'fertilization',
        title: 'Fertilización NPK 10-10-10',
        details: 'Aplicación ligera en raíces',
        date: new Date().toISOString().slice(0, 10)
      },
      {
        id: 'act-2',
        cropId: 'crop-1',
        type: 'compost_tea',
        title: 'Té de compost aireado',
        details: 'Dilución 1:10',
        date: new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      }
    ]);
  }
  return cropId ? inMemory.activities.filter(a => a.cropId === cropId) : inMemory.activities;
}

export function addActivity(activity: Activity) {
  const list = inMemory.activities ?? getActivities();
  const updated = [activity, ...list];
  inMemory.activities = updated;
  saveToStorage(STORAGE_KEYS.activities, updated);
  bumpInbox(activity.cropId);
}

// Planned events (calendario)
export function getPlannedEvents(cropId: string): PlannedEvent[] {
  if (!inMemory.planned) {
    inMemory.planned = loadFromStorage<PlannedEvent[]>(STORAGE_KEYS.planned, []);
  }
  return inMemory.planned.filter(p => p.cropId === cropId);
}

export function addPlannedEvent(event: PlannedEvent) {
  const list = inMemory.planned ?? getPlannedEvents(event.cropId);
  const updated = [{ ...event, createdAt: new Date().toISOString() }, ...list];
  inMemory.planned = updated;
  saveToStorage(STORAGE_KEYS.planned, updated);
  bumpInbox(event.cropId);
}

export function removePlannedEvent(id: string) {
  const list = inMemory.planned ?? [];
  const updated = list.filter(p => p.id !== id);
  inMemory.planned = updated;
  saveToStorage(STORAGE_KEYS.planned, updated);
}

// Inbox (notificaciones por cultivo)
function loadInbox(): Record<string, number> {
  if (!inMemory.inbox) {
    inMemory.inbox = loadFromStorage<Record<string, number>>(STORAGE_KEYS.inbox, {});
  }
  return inMemory.inbox;
}

function saveInbox(data: Record<string, number>) {
  inMemory.inbox = data;
  saveToStorage(STORAGE_KEYS.inbox, data);
}

export function bumpInbox(cropId: string, count: number = 1) {
  const box = loadInbox();
  box[cropId] = (box[cropId] || 0) + count;
  saveInbox(box);
}

export function readInbox(cropId: string) {
  const box = loadInbox();
  if (box[cropId]) {
    box[cropId] = 0;
    saveInbox(box);
  }
}

export function getInboxCount(cropId: string): number {
  const box = loadInbox();
  return box[cropId] || 0;
}
