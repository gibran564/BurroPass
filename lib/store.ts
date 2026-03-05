import { v4 as uuidv4 } from 'uuid';
import type { AnnouncementDoc, ScanDoc, TicketConfig, TicketDoc } from './types';

const defaultConfig: TicketConfig = {
  limiteDiarioPorEstudiante: 1,
  limiteDiarioPorArea: 100,
  requiereValidacionSociedad: true,
  expiracionHoras: 24
};

const state: {
  tickets: TicketDoc[];
  scans: ScanDoc[];
  announcements: AnnouncementDoc[];
  config: TicketConfig;
} = {
  tickets: [],
  scans: [],
  announcements: [
    {
      id: uuidv4(),
      titulo: 'Bienvenido a BurroPass',
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      activo: true,
      link: 'https://www.ipn.mx'
    }
  ],
  config: defaultConfig
};

export const store = {
  getConfig: async () => state.config,
  setConfig: async (config: TicketConfig) => {
    state.config = config;
    return config;
  },
  createTicket: async (ticket: TicketDoc) => {
    state.tickets.unshift(ticket);
    return ticket;
  },
  findTicket: async (id: string) => state.tickets.find((t) => t.id === id),
  updateTicket: async (id: string, partial: Partial<TicketDoc>) => {
    const idx = state.tickets.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    state.tickets[idx] = { ...state.tickets[idx], ...partial };
    return state.tickets[idx];
  },
  listTicketsByUser: async (userId: string) => state.tickets.filter((t) => t.usuario_id === userId),
  countTodayByUser: async (userId: string) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return state.tickets.filter((t) => t.usuario_id === userId && new Date(t.fecha_generado) >= start).length;
  },
  countTodayByArea: async (_area: string) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return state.tickets.filter((t) => new Date(t.fecha_generado) >= start).length;
  },
  createScan: async (scan: ScanDoc) => {
    state.scans.unshift(scan);
    return scan;
  },
  listAnnouncements: async () => {
    const now = Date.now();
    return state.announcements.filter(
      (a) => a.activo && new Date(a.fecha_inicio).getTime() <= now && new Date(a.fecha_fin).getTime() >= now
    );
  },
  saveAnnouncement: async (announcement: AnnouncementDoc) => {
    state.announcements.unshift(announcement);
    return announcement;
  }
};
