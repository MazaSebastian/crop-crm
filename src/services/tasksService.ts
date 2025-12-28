import { supabase } from './supabaseClient';
import { Task } from '../types';

export const tasksService = {
    async getPendingTasks(): Promise<Task[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('chakra_tasks')
            .select('*')
            .neq('status', 'dismissed')
            .neq('status', 'done')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }

        return data as Task[];
    },

    async createTask(task: Omit<Task, 'id' | 'created_at' | 'status'>): Promise<Task | null> {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('chakra_tasks')
            .insert([{
                ...task,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error);
            return null;
        }

        return data as Task;
    },

    async updateStatus(id: string, status: 'done' | 'dismissed'): Promise<boolean> {
        if (!supabase) return false;

        const { error } = await supabase
            .from('chakra_tasks')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating task status:', error);
            return false;
        }

        return true;
    }
};
