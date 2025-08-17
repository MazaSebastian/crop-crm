import 'styled-components';
import type { AppTheme } from './theme';

declare module 'styled-components' {
  // Extiende el tema por defecto con nuestro tipo
  export interface DefaultTheme extends AppTheme {}
}


