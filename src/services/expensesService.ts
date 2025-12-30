
import { supabase } from './supabaseClient';

export interface CashMovement {
    id?: string;
    type: 'INGRESO' | 'EGRESO';
    concept: string;
    amount: number;
    date: string;
    owner: 'Sebastian' | 'Santiago' | string;
    created_at?: string;
    // Legacy fields likely not needed for new UI but present in DB
    owner_id?: string;
    organization_id?: string;
}

export const expensesService = {
    async getMovements() {
        if (!supabase) return [];
        console.log("Fetching movements...");
        const { data, error } = await supabase
            .from('cash_movements')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching movements:', error);
            return [];
        }
        return data as CashMovement[];
    },

    async createMovement(movement: CashMovement) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('cash_movements')
            .insert([movement])
            .select();

        if (error) {
            console.error('Error creating movement:', error);
            return null;
        }
        return data?.[0] as CashMovement;
    },

    async deleteMovement(id: string) {
        if (!supabase) return false;
        const { error } = await supabase
            .from('cash_movements')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting movement:', error);
            return false;
        }
        return true;
    }
};
