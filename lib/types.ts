export type Role = 'estudiante' | 'sociedad_alumnos' | 'cafeteria' | 'admin';
export type TicketState = 'generado' | 'validado' | 'consumido';

export interface UserDoc {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  area: string;
  fecha_creacion: string;
}

export interface TicketDoc {
  id: string;
  usuario_id: string;
  estado: TicketState;
  fecha_generado: string;
  fecha_validado?: string;
  fecha_consumido?: string;
  token_qr: string;
  signature: string;
}

export interface ScanDoc {
  id: string;
  boleto_id: string;
  usuario_id: string;
  tipo: 'validacion' | 'consumo';
  timestamp: string;
}

export interface AnnouncementDoc {
  id: string;
  titulo: string;
  imagen?: string;
  link?: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface TicketConfig {
  limiteDiarioPorEstudiante: number;
  limiteDiarioPorArea: number;
  requiereValidacionSociedad: boolean;
  expiracionHoras: number;
}
