import { EventCode } from '../types';

// Simulación de base de datos de eventos
const mockEvents: Record<string, EventCode> = {
  'EVT-2024-001': {
    code: 'EVT-2024-001',
    clientName: 'María González',
    eventType: 'Casamiento',
    eventDate: '2024-12-15',
    eventTime: '20:00',
    guestCount: 150,
    venue: 'Salón Principal'
  },
  'EVT-2024-002': {
    code: 'EVT-2024-002',
    clientName: 'Carlos Rodríguez',
    eventType: 'Cumpleaños',
    eventDate: '2024-11-20',
    eventTime: '19:00',
    guestCount: 80,
    venue: 'Salón VIP'
  },
  'EVT-2024-003': {
    code: 'EVT-2024-003',
    clientName: 'Empresa TechCorp',
    eventType: 'Corporativo',
    eventDate: '2024-12-10',
    eventTime: '18:30',
    guestCount: 200,
    venue: 'Salón Corporativo'
  },
  'EVT-2024-004': {
    code: 'EVT-2024-004',
    clientName: 'Ana Martínez',
    eventType: 'XV',
    eventDate: '2024-11-25',
    eventTime: '21:00',
    guestCount: 120,
    venue: 'Salón Principal'
  },
  'EVT-2024-005': {
    code: 'EVT-2024-005',
    clientName: 'Universidad Central',
    eventType: 'Graduación',
    eventDate: '2024-12-05',
    eventTime: '19:30',
    guestCount: 300,
    venue: 'Auditorio Principal'
  }
};

export class JanosService {
  /**
   * Verifica un código de evento en el sistema de Janos
   * @param code - Código del evento a verificar
   * @returns Promise con la información del evento
   */
  static async verifyEventCode(code: string): Promise<EventCode> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const event = mockEvents[code];
    
    if (!event) {
      throw new Error('Código de evento no encontrado en el sistema');
    }
    
    return event;
  }

  /**
   * Obtiene todos los eventos disponibles (para testing)
   * @returns Lista de códigos de eventos válidos
   */
  static getValidEventCodes(): string[] {
    return Object.keys(mockEvents);
  }

  /**
   * Simula el envío de la coordinación completada al sistema de Janos
   * @param sessionData - Datos de la sesión de coordinación
   * @returns Promise con confirmación
   */
  static async submitCoordination(sessionData: any): Promise<{ success: boolean; message: string }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular éxito en el 95% de los casos
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        message: 'Coordinación enviada exitosamente al sistema de Janos'
      };
    } else {
      throw new Error('Error al enviar la coordinación. Inténtalo de nuevo.');
    }
  }

  /**
   * Obtiene estadísticas de coordinaciones por tipo de evento
   * @returns Estadísticas simuladas
   */
  static async getCoordinationStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    recent: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      total: 156,
      byType: {
        wedding: 45,
        birthday: 38,
        corporate: 28,
        quinceanera: 25,
        graduation: 20
      },
      recent: 12 // Últimos 7 días
    };
  }
}

// Función helper para generar códigos de evento válidos para testing
export const generateTestEventCode = (): string => {
  const codes = Object.keys(mockEvents);
  return codes[Math.floor(Math.random() * codes.length)];
};
