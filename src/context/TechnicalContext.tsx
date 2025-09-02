import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos para el contexto técnico
interface Equipment {
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

interface Maintenance {
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

interface TechnicalAlert {
  id: number;
  title: string;
  description: string;
  type: 'error' | 'warning' | 'info';
  time: string;
  equipmentId?: number;
}

interface TechnicalTask {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  time: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface TechnicalState {
  equipment: Equipment[];
  maintenance: Maintenance[];
  alerts: TechnicalAlert[];
  tasks: TechnicalTask[];
  stats: {
    totalEquipment: number;
    onlineEquipment: number;
    maintenanceNeeded: number;
    criticalAlerts: number;
  };
}

type TechnicalAction =
  | { type: 'ADD_EQUIPMENT'; payload: Equipment }
  | { type: 'UPDATE_EQUIPMENT'; payload: Equipment }
  | { type: 'DELETE_EQUIPMENT'; payload: number }
  | { type: 'ADD_MAINTENANCE'; payload: Maintenance }
  | { type: 'UPDATE_MAINTENANCE'; payload: Maintenance }
  | { type: 'DELETE_MAINTENANCE'; payload: number }
  | { type: 'COMPLETE_MAINTENANCE'; payload: number }
  | { type: 'ADD_ALERT'; payload: TechnicalAlert }
  | { type: 'REMOVE_ALERT'; payload: number }
  | { type: 'ADD_TASK'; payload: TechnicalTask }
  | { type: 'UPDATE_TASK'; payload: TechnicalTask }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'UPDATE_STATS' };

const initialState: TechnicalState = {
  equipment: [
    {
      id: 1,
      name: 'Mixer Pioneer DJM-900',
      model: 'DJM-900NXS2',
      serialNumber: 'PIO-2023-001',
      category: 'Audio',
      location: 'Sala Principal',
      status: 'operational',
      purchaseDate: '2023-01-15',
      warranty: '2026-01-15',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      assignedTo: 'DJ Carlos',
      notes: 'Equipo en excelente estado'
    },
    {
      id: 2,
      name: 'CDJ-3000 #1',
      model: 'CDJ-3000',
      serialNumber: 'PIO-2023-002',
      category: 'Player',
      location: 'Sala Principal',
      status: 'operational',
      purchaseDate: '2023-02-20',
      warranty: '2026-02-20',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      assignedTo: 'DJ Carlos',
      notes: 'Funcionando perfectamente'
    },
    {
      id: 3,
      name: 'CDJ-3000 #2',
      model: 'CDJ-3000',
      serialNumber: 'PIO-2023-003',
      category: 'Player',
      location: 'Sala Principal',
      status: 'maintenance',
      purchaseDate: '2023-02-20',
      warranty: '2026-02-20',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-02-20',
      assignedTo: 'Técnico Juan',
      notes: 'Requiere calibración de plato'
    },
    {
      id: 4,
      name: 'Amplificador Principal',
      model: 'Crown XLS 2502',
      serialNumber: 'CRO-2022-001',
      category: 'Amplification',
      location: 'Sala Principal',
      status: 'repair',
      purchaseDate: '2022-08-10',
      warranty: '2025-08-10',
      lastMaintenance: '2023-12-01',
      nextMaintenance: '2024-03-01',
      assignedTo: 'Servicio Técnico',
      notes: 'Sin señal de salida, enviado a reparación'
    },
    {
      id: 5,
      name: 'Servidor de Música',
      model: 'Dell PowerEdge R740',
      serialNumber: 'DEL-2023-004',
      category: 'Computer',
      location: 'Sala de Control',
      status: 'operational',
      purchaseDate: '2023-03-05',
      warranty: '2026-03-05',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05',
      assignedTo: 'Sistema',
      notes: 'Servidor principal funcionando correctamente'
    },
    {
      id: 6,
      name: 'Switch de Red',
      model: 'Cisco Catalyst 2960',
      serialNumber: 'CIS-2022-002',
      category: 'Network',
      location: 'Sala de Control',
      status: 'maintenance',
      purchaseDate: '2022-11-15',
      warranty: '2025-11-15',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-02-01',
      assignedTo: 'Técnico Juan',
      notes: 'Actualización de firmware pendiente'
    }
  ],
  maintenance: [
    {
      id: 1,
      title: 'Calibración CDJ-3000 #2',
      equipment: 'CDJ-3000 #2',
      type: 'Preventivo',
      status: 'scheduled',
      scheduledDate: '2024-02-20',
      assignedTo: 'Técnico Juan',
      priority: 'Alta',
      description: 'Calibración del plato y verificación de sincronización con el mixer',
      estimatedDuration: '2 horas',
      location: 'Sala Principal',
      notes: 'Equipo presenta problemas de sincronización'
    },
    {
      id: 2,
      title: 'Actualización Firmware Switch',
      equipment: 'Switch de Red',
      type: 'Preventivo',
      status: 'in-progress',
      scheduledDate: '2024-02-01',
      assignedTo: 'Técnico Juan',
      priority: 'Media',
      description: 'Actualización del firmware a la versión más reciente para mejorar la estabilidad',
      estimatedDuration: '1 hora',
      location: 'Sala de Control',
      notes: 'Mantenimiento programado mensual'
    },
    {
      id: 3,
      title: 'Revisión Amplificador Principal',
      equipment: 'Amplificador Principal',
      type: 'Correctivo',
      status: 'overdue',
      scheduledDate: '2024-01-15',
      assignedTo: 'Servicio Técnico',
      priority: 'Alta',
      description: 'Diagnóstico y reparación del amplificador que no produce señal de salida',
      estimatedDuration: '4 horas',
      location: 'Sala Principal',
      notes: 'Equipo enviado a servicio técnico externo'
    }
  ],
  alerts: [
    {
      id: 1,
      title: 'CDJ-3000 #2 sin respuesta',
      description: 'El equipo no responde a comandos de red',
      type: 'error',
      time: '5m',
      equipmentId: 3
    },
    {
      id: 2,
      title: 'Amplificador sobrecalentado',
      description: 'Temperatura crítica detectada',
      type: 'error',
      time: '12m',
      equipmentId: 4
    },
    {
      id: 3,
      title: 'Espacio en disco crítico',
      description: 'Solo 2GB disponibles en servidor',
      type: 'warning',
      time: '1h',
      equipmentId: 5
    },
    {
      id: 4,
      title: 'Actualización disponible',
      description: 'Nuevo firmware para switch de red',
      type: 'info',
      time: '2h',
      equipmentId: 6
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Calibrar CDJ-3000 #2',
      description: 'Problemas de sincronización detectados',
      priority: 'high',
      time: '2h',
      assignedTo: 'Técnico Juan',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Revisar amplificador principal',
      description: 'Sin señal de salida',
      priority: 'high',
      time: '1h',
      assignedTo: 'Servicio Técnico',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Actualizar firmware switch',
      description: 'Mantenimiento programado',
      priority: 'medium',
      time: '4h',
      assignedTo: 'Técnico Juan',
      status: 'pending'
    }
  ],
  stats: {
    totalEquipment: 6,
    onlineEquipment: 3,
    maintenanceNeeded: 2,
    criticalAlerts: 2
  }
};

const technicalReducer = (state: TechnicalState, action: TechnicalAction): TechnicalState => {
  switch (action.type) {
    case 'ADD_EQUIPMENT':
      return {
        ...state,
        equipment: [...state.equipment, action.payload]
      };
    
    case 'UPDATE_EQUIPMENT':
      return {
        ...state,
        equipment: state.equipment.map(eq => 
          eq.id === action.payload.id ? action.payload : eq
        )
      };
    
    case 'DELETE_EQUIPMENT':
      return {
        ...state,
        equipment: state.equipment.filter(eq => eq.id !== action.payload)
      };
    
    case 'ADD_MAINTENANCE':
      return {
        ...state,
        maintenance: [...state.maintenance, action.payload]
      };
    
    case 'UPDATE_MAINTENANCE':
      return {
        ...state,
        maintenance: state.maintenance.map(m => 
          m.id === action.payload.id ? action.payload : m
        )
      };
    
    case 'DELETE_MAINTENANCE':
      return {
        ...state,
        maintenance: state.maintenance.filter(m => m.id !== action.payload)
      };
    
    case 'COMPLETE_MAINTENANCE':
      return {
        ...state,
        maintenance: state.maintenance.map(m => 
          m.id === action.payload ? { ...m, status: 'completed' } : m
        )
      };
    
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts]
      };
    
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: {
          totalEquipment: state.equipment.length,
          onlineEquipment: state.equipment.filter(eq => eq.status === 'operational').length,
          maintenanceNeeded: state.equipment.filter(eq => eq.status === 'maintenance').length,
          criticalAlerts: state.alerts.filter(alert => alert.type === 'error').length
        }
      };
    
    default:
      return state;
  }
};

interface TechnicalContextType {
  state: TechnicalState;
  dispatch: React.Dispatch<TechnicalAction>;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (equipment: Equipment) => void;
  deleteEquipment: (id: number) => void;
  addMaintenance: (maintenance: Omit<Maintenance, 'id'>) => void;
  updateMaintenance: (maintenance: Maintenance) => void;
  deleteMaintenance: (id: number) => void;
  completeMaintenance: (id: number) => void;
  addAlert: (alert: Omit<TechnicalAlert, 'id'>) => void;
  removeAlert: (id: number) => void;
  addTask: (task: Omit<TechnicalTask, 'id'>) => void;
  updateTask: (task: TechnicalTask) => void;
  deleteTask: (id: number) => void;
  getEquipmentById: (id: number) => Equipment | undefined;
  getMaintenanceByEquipment: (equipmentName: string) => Maintenance[];
  getTasksByPriority: (priority: 'high' | 'medium' | 'low') => TechnicalTask[];
}

const TechnicalContext = createContext<TechnicalContextType | undefined>(undefined);

export const useTechnical = () => {
  const context = useContext(TechnicalContext);
  if (context === undefined) {
    throw new Error('useTechnical must be used within a TechnicalProvider');
  }
  return context;
};

interface TechnicalProviderProps {
  children: ReactNode;
}

export const TechnicalProvider: React.FC<TechnicalProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(technicalReducer, initialState);

  const addEquipment = (equipment: Omit<Equipment, 'id'>) => {
    const newEquipment = { ...equipment, id: Date.now() };
    dispatch({ type: 'ADD_EQUIPMENT', payload: newEquipment });
    dispatch({ type: 'UPDATE_STATS' });
  };

  const updateEquipment = (equipment: Equipment) => {
    dispatch({ type: 'UPDATE_EQUIPMENT', payload: equipment });
    dispatch({ type: 'UPDATE_STATS' });
  };

  const deleteEquipment = (id: number) => {
    dispatch({ type: 'DELETE_EQUIPMENT', payload: id });
    dispatch({ type: 'UPDATE_STATS' });
  };

  const addMaintenance = (maintenance: Omit<Maintenance, 'id'>) => {
    const newMaintenance = { ...maintenance, id: Date.now() };
    dispatch({ type: 'ADD_MAINTENANCE', payload: newMaintenance });
  };

  const updateMaintenance = (maintenance: Maintenance) => {
    dispatch({ type: 'UPDATE_MAINTENANCE', payload: maintenance });
  };

  const deleteMaintenance = (id: number) => {
    dispatch({ type: 'DELETE_MAINTENANCE', payload: id });
  };

  const completeMaintenance = (id: number) => {
    dispatch({ type: 'COMPLETE_MAINTENANCE', payload: id });
  };

  const addAlert = (alert: Omit<TechnicalAlert, 'id'>) => {
    const newAlert = { ...alert, id: Date.now() };
    dispatch({ type: 'ADD_ALERT', payload: newAlert });
    dispatch({ type: 'UPDATE_STATS' });
  };

  const removeAlert = (id: number) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id });
    dispatch({ type: 'UPDATE_STATS' });
  };

  const addTask = (task: Omit<TechnicalTask, 'id'>) => {
    const newTask = { ...task, id: Date.now() };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: TechnicalTask) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: number) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const getEquipmentById = (id: number) => {
    return state.equipment.find(eq => eq.id === id);
  };

  const getMaintenanceByEquipment = (equipmentName: string) => {
    return state.maintenance.filter(m => m.equipment === equipmentName);
  };

  const getTasksByPriority = (priority: 'high' | 'medium' | 'low') => {
    return state.tasks.filter(task => task.priority === priority);
  };

  const value: TechnicalContextType = {
    state,
    dispatch,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    completeMaintenance,
    addAlert,
    removeAlert,
    addTask,
    updateTask,
    deleteTask,
    getEquipmentById,
    getMaintenanceByEquipment,
    getTasksByPriority
  };

  return (
    <TechnicalContext.Provider value={value}>
      {children}
    </TechnicalContext.Provider>
  );
};



