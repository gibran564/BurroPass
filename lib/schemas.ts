import { z } from 'zod';

export const createTicketSchema = z.object({
  usuario_id: z.string().min(1),
  area: z.string().min(1)
});

export const scanSchema = z.object({
  ticketId: z.string().uuid(),
  role: z.enum(['sociedad_alumnos', 'cafeteria']),
  actorUserId: z.string().min(1),
  signature: z.string().min(1)
});

export const announcementSchema = z.object({
  titulo: z.string().min(2),
  imagen: z.string().url().optional().or(z.literal('')),
  link: z.string().url().optional().or(z.literal('')),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  activo: z.boolean()
});

export const configSchema = z.object({
  limiteDiarioPorEstudiante: z.number().int().positive(),
  limiteDiarioPorArea: z.number().int().positive(),
  requiereValidacionSociedad: z.boolean(),
  expiracionHoras: z.number().int().positive()
});
