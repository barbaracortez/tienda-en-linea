export interface Environment {
  production: boolean;
  apiUrl: string;
  /** Fuente de datos del catálogo: 'local' (por defecto) o la API de Platzi. */
  dataSource: 'local' | 'api';
}
