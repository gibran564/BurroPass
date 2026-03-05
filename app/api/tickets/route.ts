import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createTicketSchema } from '@/lib/schemas';
import { signTicket } from '@/lib/security';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
  const tickets = await store.listTicketsByUser(userId);
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = createTicketSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const config = await store.getConfig();
  const userCount = await store.countTodayByUser(parsed.data.usuario_id);
  if (userCount >= config.limiteDiarioPorEstudiante) {
    return NextResponse.json({ error: 'Límite diario por estudiante alcanzado' }, { status: 409 });
  }

  const areaCount = await store.countTodayByArea(parsed.data.area);
  if (areaCount >= config.limiteDiarioPorArea) {
    return NextResponse.json({ error: 'Límite diario por área alcanzado' }, { status: 409 });
  }

  const id = uuidv4();
  const fecha_generado = new Date().toISOString();
  const signature = signTicket(id, parsed.data.usuario_id, fecha_generado);
  const token_qr = JSON.stringify({ ticketId: id, userId: parsed.data.usuario_id, issuedAt: fecha_generado, signature });

  const ticket = await store.createTicket({
    id,
    usuario_id: parsed.data.usuario_id,
    estado: 'generado',
    fecha_generado,
    token_qr,
    signature
  });

  return NextResponse.json(ticket, { status: 201 });
}
