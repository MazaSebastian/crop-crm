import { supabase } from './supabaseClient';
import { Crop } from '../types';

export const cropsService = {
    async getCrops(): Promise<Crop[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('chakra_crops')
            .select('*')
            .order('start_date', { ascending: false });

        if (error) {
            console.error('Error fetching crops:', error);
            return [];
        }

        // Map DB fields to Frontend types if necessary (snake_case -> camelCase)
        return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            location: c.location,
            startDate: c.start_date,
            // estimatedHarvestDate: c.estimated_harvest_date, // To be added
            photoUrl: c.photo_url,
            partners: [], // Not yet implemented in DB fully
            status: c.status
        }));
    },

    async createCrop(crop: Omit<Crop, 'id' | 'partners' | 'status'> & { estimatedHarvestDate?: string }): Promise<Crop | null> {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('chakra_crops')
            .insert([{
                name: crop.name,
                location: crop.location,
                start_date: crop.startDate,
                // estimated_harvest_date: crop.estimatedHarvestDate, // To be added
                status: 'active'
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating crop:', error);
            return null;
        }

        return {
            id: data.id,
            name: data.name,
            location: data.location,
            startDate: data.start_date,
            photoUrl: data.photo_url,
            partners: [],
            status: data.status
        };
    }
};
