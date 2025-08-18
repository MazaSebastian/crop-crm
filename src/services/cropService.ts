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

function shouldSeedDemo(): boolean {
  try {
    if (supabase) return false; // si hay backend, no sembrar demo
    const flag = localStorage.getItem('demo_seed');
    if (flag === 'off') return false;
  } catch {}
  return true;
}

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
    const demoFallback: Crop[] = shouldSeedDemo()
      ? [
          { id: 'crop-richard', name: 'Carpa Richard', location: 'Sector A', startDate: today, partners: mockCropPartners, status: 'active' },
          { id: 'crop-robert', name: 'Carpa Robert', location: 'Sector B', startDate: today, partners: mockCropPartners, status: 'active' },
          { id: 'crop-chad', name: 'Carpa Chad', location: 'Sector C', startDate: today, partners: mockCropPartners, status: 'active' },
          { id: 'crop-sala-superior', name: 'Sala Superior', location: 'Edificio Principal - Piso 2', startDate: today, partners: mockCropPartners, status: 'active' }
        ]
      : [];
    inMemory.crops = loadFromStorage<Crop[]>(STORAGE_KEYS.crops, demoFallback);
  }
  return inMemory.crops;
}

export function saveCrops(crops: Crop[]) {
  inMemory.crops = crops;
  saveToStorage(STORAGE_KEYS.crops, crops);
}

// Supabase sync for Crops
export async function syncCropsFromSupabase(): Promise<Crop[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('crops')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('Supabase select error (crops):', error); return null; }
  const mapped: Crop[] = (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    location: r.location || undefined,
    startDate: r.start_date || new Date().toISOString().slice(0,10),
    photoUrl: r.photo_url || undefined,
    partners: Array.isArray(r.partners) ? r.partners : (r.partners ? r.partners : []),
    status: (r.status || 'active') as Crop['status'],
  }));
  inMemory.crops = mapped;
  saveToStorage(STORAGE_KEYS.crops, mapped);
  return mapped;
}

export function getDailyRecords(cropId: string): DailyRecord[] {
  if (!inMemory.records) {
    const today = new Date();
    const isoDate = today.toISOString().slice(0, 10);
    const demoFallback: DailyRecord[] = shouldSeedDemo()
      ? [
          { id: 'rec-1', cropId: 'crop-1', date: isoDate, params: { temperatureC: 24, humidityPct: 65, soilMoisturePct: 45, ph: 6.3, ecMs: 1.8 }, notes: 'Riego ligero por la mañana. Plantas vigorosas.', photos: [], createdBy: 'partner-1', createdAt: new Date().toISOString() }
        ]
      : [];
    inMemory.records = loadFromStorage<DailyRecord[]>(STORAGE_KEYS.records, demoFallback);
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

export function removeDailyRecordLocal(id: string) {
  const all = inMemory.records ?? [];
  const updated = all.filter(r => r.id !== id);
  inMemory.records = updated;
  saveToStorage(STORAGE_KEYS.records, updated);
}

// Supabase sync for Daily Records
export async function syncDailyRecordsFromSupabase(cropId: string): Promise<DailyRecord[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('daily_records')
    .select('*')
    .eq('crop_id', cropId)
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) { console.error('Supabase select error (daily_records):', error); return null; }
  const mapped: DailyRecord[] = (data || []).map((r: any) => ({
    id: r.id,
    cropId: r.crop_id,
    date: r.date,
    params: r.params,
    notes: r.notes || undefined,
    photos: r.photos || undefined,
    createdBy: r.created_by,
    createdAt: r.created_at,
  }));
  // merge en memoria solo del crop
  const others = (inMemory.records || []).filter(x => x.cropId !== cropId);
  inMemory.records = [...mapped, ...others];
  saveToStorage(STORAGE_KEYS.records, inMemory.records);
  return mapped;
}

export async function createDailyRecordSupabase(rec: DailyRecord): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('daily_records').insert({
    id: rec.id,
    crop_id: rec.cropId,
    date: rec.date,
    params: rec.params,
    notes: rec.notes || null,
    photos: rec.photos || null,
    created_by: rec.createdBy,
    created_at: rec.createdAt,
  });
  if (error) { console.error('Supabase insert error (daily_records):', error); return false; }
  return true;
}

export async function deleteDailyRecordSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('daily_records').delete().eq('id', id);
  if (error) { console.error('Supabase delete error (daily_records):', error); return false; }
  return true;
}

// ==========================
// Gastos (Saldo Chakra) - Supabase sync
// Tabla sugerida: cash_movements(id text pk, type text, concept text, amount numeric, date text, owner text, created_at timestamptz)
export interface CashMovement {
  id: string;
  type: 'INGRESO' | 'EGRESO';
  concept: string;
  amount: number;
  date: string; // ISO
  owner: string;
}

export async function syncCashMovementsFromSupabase(): Promise<CashMovement[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('cash_movements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);
  if (error) { console.error('Supabase select error (cash_movements):', error); return null; }
  return (data || []).map((r: any) => ({
    id: r.id,
    type: r.type,
    concept: r.concept,
    amount: Number(r.amount || 0),
    date: r.date,
    owner: r.owner
  }));
}

export async function createCashMovementSupabase(m: CashMovement): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('cash_movements').insert({
    id: m.id,
    type: m.type,
    concept: m.concept,
    amount: m.amount,
    date: m.date,
    owner: m.owner
  });
  if (error) { console.error('Supabase insert error (cash_movements):', error); return false; }
  return true;
}

// ==========================
// Stock - Supabase sync
// Tabla sugerida: stock_items(id text pk, name text, qty int, unit text, created_at timestamptz)
export interface StockItem {
  id: string;
  name: string;
  qty: number;
  unit?: string;
}

export async function syncStockItemsFromSupabase(): Promise<StockItem[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('stock_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2000);
  if (error) { console.error('Supabase select error (stock_items):', error); return null; }
  return (data || []).map((r: any) => ({ id: r.id, name: r.name, qty: r.qty, unit: r.unit || 'g' }));
}

export async function createStockItemSupabase(it: StockItem): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('stock_items').insert({
    id: it.id, name: it.name, qty: it.qty, unit: it.unit || 'g'
  });
  if (error) { console.error('Supabase insert error (stock_items):', error); return false; }
  return true;
}

export async function updateStockQtySupabase(id: string, qty: number): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('stock_items').update({ qty }).eq('id', id);
  if (error) { console.error('Supabase update error (stock_items):', error); return false; }
  return true;
}

export async function deleteStockItemSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('stock_items').delete().eq('id', id);
  if (error) { console.error('Supabase delete error (stock_items):', error); return false; }
  return true;
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
    const demoFallback: Announcement[] = shouldSeedDemo()
      ? [ { id: 'ann-1', message: 'Recordatorio: revisar humedad mañana 8:00', type: 'info', createdBy: 'partner-1', createdAt: new Date().toISOString() } ]
      : [];
    inMemory.announcements = loadFromStorage<Announcement[]>(STORAGE_KEYS.announcements, demoFallback);
  }
  // Limitar a 4 últimos en memoria
  inMemory.announcements = (inMemory.announcements || []).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)).slice(0, 4);
  return inMemory.announcements;
}

export function addAnnouncement(a: Announcement) {
  const list = inMemory.announcements ?? getAnnouncements();
  const updated = [a, ...list].slice(0, 4);
  inMemory.announcements = updated;
  saveToStorage(STORAGE_KEYS.announcements, updated);
}

// ============ Supabase Sync (Announcements) ============
export async function syncAnnouncementsFromSupabase(): Promise<Announcement[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Supabase select error (announcements):', error);
    return null;
  }
  // map records
  const mapped: Announcement[] = (data || []).map((r: any) => ({
    id: r.id,
    message: r.message,
    type: r.type || 'info',
    createdBy: r.created_by || r.createdBy || 'partner-1',
    createdAt: r.created_at || r.createdAt,
  }));
  const limited = mapped.slice(0, 4);
  inMemory.announcements = limited;
  saveToStorage(STORAGE_KEYS.announcements, limited);
  return limited;
}

export async function createAnnouncementSupabase(a: Announcement): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('announcements').insert({
    id: a.id,
    message: a.message,
    type: a.type,
    created_by: a.createdBy,
    created_at: a.createdAt,
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Supabase insert error (announcements):', error);
    return false;
  }
  return true;
}

// Activities (acciones realizadas: fertilización, té de compost, etc.)
export function getActivities(cropId?: string): Activity[] {
  if (!inMemory.activities) {
    const demoFallback: Activity[] = shouldSeedDemo()
      ? [
          { id: 'act-1', cropId: 'crop-1', type: 'fertilization', title: 'Fertilización NPK 10-10-10', details: 'Aplicación ligera en raíces', date: new Date().toISOString().slice(0, 10) },
          { id: 'act-2', cropId: 'crop-1', type: 'compost_tea', title: 'Té de compost aireado', details: 'Dilución 1:10', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10) }
        ]
      : [];
    inMemory.activities = loadFromStorage<Activity[]>(STORAGE_KEYS.activities, demoFallback);
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
  const updated = [{ ...event, status: event.status || 'yellow', createdAt: new Date().toISOString() }, ...list];
  inMemory.planned = updated;
  saveToStorage(STORAGE_KEYS.planned, updated);
  bumpInbox(event.cropId);
}

// Supabase sync for Planned Events
export async function syncPlannedEventsFromSupabase(cropId: string): Promise<PlannedEvent[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('planned_events')
    .select('*')
    .eq('crop_id', cropId)
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) { console.error('Supabase select error (planned_events):', error); return null; }
  const mapped: PlannedEvent[] = (data || []).map((r: any) => ({
    id: r.id,
    cropId: r.crop_id,
    date: r.date,
    title: r.title,
    type: r.type || 'other',
    status: r.status || 'yellow',
    createdAt: r.created_at,
  }));
  const others = (inMemory.planned || []).filter(x => x.cropId !== cropId);
  inMemory.planned = [...mapped, ...others];
  saveToStorage(STORAGE_KEYS.planned, inMemory.planned);
  return mapped;
}

export async function createPlannedEventSupabase(ev: PlannedEvent): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('planned_events').insert({
    id: ev.id,
    crop_id: ev.cropId,
    date: ev.date,
    title: ev.title,
    type: ev.type || 'other',
    status: ev.status || null,
    created_at: new Date().toISOString(),
  });
  if (error) { console.error('Supabase insert error (planned_events):', error); return false; }
  return true;
}

export function removePlannedEvent(id: string) {
  const list = inMemory.planned ?? [];
  const updated = list.filter(p => p.id !== id);
  inMemory.planned = updated;
  saveToStorage(STORAGE_KEYS.planned, updated);
}

export async function deletePlannedEventSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('planned_events').delete().eq('id', id);
  if (error) { console.error('Supabase delete error (planned_events):', error); return false; }
  return true;
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

// ============ Limpieza de datos de demo ============
export async function clearAllLocalData(): Promise<void> {
  try {
    const keys = [
      STORAGE_KEYS.crops,
      STORAGE_KEYS.records,
      STORAGE_KEYS.tasks,
      STORAGE_KEYS.announcements,
      STORAGE_KEYS.activities,
      STORAGE_KEYS.planned,
      STORAGE_KEYS.inbox,
      'chakra_movs',
      'chakra_balance',
      'chakra_stock'
    ];
    for (const k of keys) localStorage.removeItem(k);
    inMemory.crops = [];
    inMemory.records = [];
    inMemory.tasks = [];
    inMemory.announcements = [];
    inMemory.activities = [];
    inMemory.planned = [];
    inMemory.inbox = {};
    // bandera para no re-sembrar demo
    localStorage.setItem('demo_seed', 'off');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error limpiando datos locales:', e);
  }
}

export async function clearSupabaseDemoData(): Promise<{ ok: boolean; errors: string[] }>{
  const errors: string[] = [];
  if (!supabase) return { ok: false, errors: ['Supabase no configurado'] };

  async function tryDelete(table: string) {
    const { error } = await supabase.from(table).delete().neq('id', '');
    if (error) errors.push(`${table}: ${error.message}`);
  }

  // No borrar crops por defecto; solo datos transaccionales
  await tryDelete('announcements');
  await tryDelete('daily_records');
  await tryDelete('planned_events');
  await tryDelete('cash_movements');
  await tryDelete('stock_items');

  return { ok: errors.length === 0, errors };
}
