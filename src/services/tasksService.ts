import { supabase } from './supabaseClient';
import { Task } from '../types';

export interface CreateTaskInput {
    title: string;
    description?: string;
    type: 'info' | 'warning' | 'danger';
    due_date?: string;
    crop_id?: string;
}

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

    async createTask(task: CreateTaskInput): Promise<Task | null> {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('chakra_tasks')
            .insert([{
                title: task.title,
                description: task.description,
                type: task.type,
                due_date: task.due_date,
                crop_id: task.crop_id,
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
