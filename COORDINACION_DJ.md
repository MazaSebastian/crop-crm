# Sistema de Coordinación con DJ

## Descripción

El Sistema de Coordinación con DJ es una funcionalidad que permite recopilar información detallada de los clientes antes de la coordinación oficial con el DJ. El sistema funciona mediante preguntas consecutivas que se adaptan según el tipo de evento.

## Características Principales

### 1. Verificación de Código de Evento
- **Primer paso**: El cliente debe ingresar el código de su evento
- **Integración**: Se conecta con el sistema de Janos para verificar la información
- **Validación**: Confirma que el evento existe y obtiene datos básicos

### 2. Preguntas Específicas por Tipo de Evento
El sistema presenta preguntas específicas según el tipo de evento (sin preguntas generales de contacto):

#### Casamiento (5 preguntas)
1. Canción para el ingreso del novio/a en la ceremonia
2. Coreografías durante la boda
3. Canción para el momento del brindis
4. Canción para tirar el ramo (mujeres) y whisky (hombres)
5. Canción para la entrada en carioca

#### Cumpleaños (4 preguntas)
1. Canción de ingreso al salón o canción para comenzar la primera tanda de baile
2. ¿Habrá coreografías?
3. Canción para el brindis
4. Canción para la entrada en carioca o para iniciar la tanda carioca

#### Corporativo (2 preguntas)
1. Tipo de evento corporativo
2. Nivel de formalidad requerido

#### XV (8 preguntas)
1. ¿Hace ingreso a recepción?
2. Canción para ingreso a recepción
3. Canción para el ingreso al salón
4. Canciones para bailar el vals
5. ¿Hace ceremonia de velas?
6. ¿Habrá coreografías?
7. Canción para el momento del brindis
8. Canción para la entrada en carioca

#### Graduaciones (Graduation)
- Tipo de graduación
- Estilo musical

#### Otros Eventos
- Descripción del tipo de evento
- Detalles específicos

### 3. Flujo de Preguntas
- **Preguntas consecutivas**: Una pregunta por página
- **Navegación**: Botones "Anterior" y "Siguiente"
- **Progreso visual**: Barra de progreso que muestra el avance
- **Validación**: Campos requeridos marcados con asterisco

### 4. Información del Evento
Durante el proceso se muestra:
- Nombre del cliente
- Tipo de evento
- Fecha y hora
- Número de invitados
- Lugar del evento

## Códigos de Prueba Disponibles

Para facilitar las pruebas, se han configurado los siguientes códigos:

| Código | Cliente | Tipo de Evento | Fecha | Preguntas Específicas |
|--------|---------|----------------|-------|---------------------|
| EVT-2024-001 | María González | Casamiento | 15/12/2024 | 5 preguntas de casamiento |
| EVT-2024-002 | Carlos Rodríguez | Cumpleaños | 20/11/2024 | 4 preguntas de cumpleaños |
| EVT-2024-003 | Empresa TechCorp | Corporativo | 10/12/2024 | 2 preguntas corporativas |
| EVT-2024-004 | Ana Martínez | XV | 25/11/2024 | 8 preguntas de XV |
| EVT-2024-005 | Universidad Central | Graduación | 05/12/2024 | 2 preguntas de graduación |

## Tipos de Preguntas Soportadas

### Texto Simple
- Para nombres, descripciones cortas
- Validación de campos requeridos

### Área de Texto
- Para descripciones largas
- Comentarios especiales

### Número
- Para edades, cantidades
- Validación numérica

### Selector
- Lista desplegable con opciones predefinidas
- Una sola selección

### Radio Buttons
- Opciones mutuamente excluyentes
- Visualización clara de todas las opciones

### Checkboxes
- Múltiples selecciones permitidas
- Para preferencias musicales, etc.

## Integración con Sistema Janos

### Verificación de Evento
```typescript
const eventInfo = await JanosService.verifyEventCode(code);
```

### Envío de Coordinación
```typescript
const result = await JanosService.submitCoordination(sessionData);
```

## Estructura de Datos

### EventCode
```typescript
interface EventCode {
  code: string;
  clientName: string;
  eventType: 'wedding' | 'birthday' | 'corporate' | 'quinceanera' | 'graduation' | 'other';
  eventDate: string;
  eventTime: string;
  guestCount: number;
  venue: string;
}
```

### CoordinationQuestion
```typescript
interface CoordinationQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'time';
  options?: string[];
  required: boolean;
  order: number;
  category: 'general' | 'music' | 'logistics' | 'special_requests';
}
```

## Uso del Sistema

### 1. Acceso
- Navegar a "Coordinación DJ" en el menú lateral
- El sistema requiere autenticación

### 2. Ingreso de Código
- Ingresar el código del evento
- Usar códigos de prueba para testing
- El sistema valida automáticamente

### 3. Proceso de Preguntas
- Responder cada pregunta
- Navegar entre preguntas con los botones
- Ver el progreso en la barra superior

### 4. Finalización
- Completar todas las preguntas
- Revisar resumen del evento
- Confirmar coordinación

## Personalización

### Agregar Nuevos Tipos de Evento
1. Actualizar el enum `EventCode['eventType']`
2. Agregar preguntas específicas en `getQuestionsByEventType()`
3. Actualizar el servicio de Janos con nuevos eventos

### Modificar Preguntas
1. Editar el array de preguntas en el contexto
2. Ajustar validaciones según necesidades
3. Actualizar tipos de respuesta

### Integración con APIs Reales
1. Reemplazar `JanosService` con llamadas reales
2. Implementar manejo de errores específicos
3. Agregar autenticación si es necesario

## Consideraciones Técnicas

### Estado de la Aplicación
- Contexto React para manejo de estado global
- Reducer para acciones complejas
- Persistencia opcional en localStorage

### Validaciones
- Campos requeridos
- Formatos específicos (email, teléfono)
- Validación en tiempo real

### UX/UI
- Diseño responsivo
- Indicadores de progreso
- Mensajes de error claros
- Navegación intuitiva

## Próximas Mejoras

1. **Persistencia**: Guardar progreso en localStorage
2. **Previsualización**: Vista previa de respuestas
3. **Exportación**: Generar PDF con respuestas
4. **Notificaciones**: Email de confirmación
5. **Analytics**: Estadísticas de uso
6. **Multiidioma**: Soporte para diferentes idiomas
