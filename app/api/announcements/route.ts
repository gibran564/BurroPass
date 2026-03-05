import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { announcementSchema } from '@/lib/schemas';
import { store } from '@/lib/store';

export async function GET() {
  const announcements = await store.listAnnouncements();
  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = announcementSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const announcement = await store.saveAnnouncement({
    id: uuidv4(),
    titulo: parsed.data.titulo,
    imagen: parsed.data.imagen || undefined,
    link: parsed.data.link || undefined,
    fecha_inicio: parsed.data.fecha_inicio,
    fecha_fin: parsed.data.fecha_fin,
    activo: parsed.data.activo
  });

  return NextResponse.json(announcement, { status: 201 });
}
