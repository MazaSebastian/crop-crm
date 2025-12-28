import { supabase } from './supabaseClient';

export interface DailyLog {
    id: string;
    crop_id: string;
    date: string;
    notes: string;
    // Other fields can be added later (temp, humidity, etc.)
}

export const dailyLogsService = {
    async getLogByDate(cropId: string, date: string): Promise<DailyLog | null> {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('chakra_daily_logs')
            .select('*')
            .eq('crop_id', cropId)
            .eq('date', date)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
            console.error('Error fetching daily log:', error);
            return null;
        }

        return data as DailyLog;
    },

    async upsertLog(log: Omit<DailyLog, 'id'>): Promise<DailyLog | null> {
        if (!supabase) return null;

        // First check if exists to get ID (or use upsert with constraint)
        const { data, error } = await supabase
            .from('chakra_daily_logs')
            .upsert(log, { onConflict: 'crop_id,date' }) // Assuming composite unique constraint or handling via logic
            .select()
            .single();

        if (error) {
            // Fallback if no unique constraint: check existence manually
            // But for now let's try standard insert/update logic if upsert fails or assuming UI handles it
            console.error('Error upserting log:', error);
            return null;
        }

        return data as DailyLog;
    },

    async getLogsByCropId(cropId: string): Promise<DailyLog[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('chakra_daily_logs')
            .select('*')
            .eq('crop_id', cropId);

        if (error) {
            console.error('Error fetching logs:', error);
            return [];
        }

        return data as DailyLog[];
    }
};
