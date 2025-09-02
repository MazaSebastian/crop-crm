import { supabase } from './supabaseClient';

export interface StockItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  category: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Función mock temporal hasta conectar con Supabase
export async function syncStockItemsFromSupabase(): Promise<StockItem[]> {
  // Por ahora retornamos datos mock
  return [
    {
      id: '1',
      name: 'Macetas 20cm',
      qty: 50,
      unit: 'unidades',
      category: 'herramientas',
      location: 'Almacén A',
      notes: 'Macetas plásticas con drenaje',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Fertilizante NPK',
      qty: 25,
      unit: 'kg',
      category: 'fertilizantes',
      location: 'Almacén B',
      notes: 'Fertilizante balanceado',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
}

export async function createStockItemSupabase(item: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>): Promise<StockItem | null> {
  try {
    const { data, error } = await supabase
      .from('crosti_stock_items')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error al crear item de stock:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error en createStockItemSupabase:', error);
    return null;
  }
}

export async function updateStockQtySupabase(id: string, newQty: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('crosti_stock_items')
      .update({ qty: newQty, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error al actualizar cantidad:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en updateStockQtySupabase:', error);
    return false;
  }
}

export async function deleteStockItemSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('crosti_stock_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteStockItemSupabase:', error);
    return false;
  }
}
