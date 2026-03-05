import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { scanSchema } from '@/lib/schemas';
import { verifyTicketSignature } from '@/lib/security';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = scanSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const config = await store.getConfig();
  const ticket = await store.findTicket(parsed.data.ticketId);
  if (!ticket) return NextResponse.json({ error: 'Boleto no encontrado' }, { status: 404 });

  const isAuthentic = verifyTicketSignature(ticket.id, ticket.usuario_id, ticket.fecha_generado, parsed.data.signature);
  if (!isAuthentic) return NextResponse.json({ error: 'Firma inválida' }, { status: 403 });

  const expiresAt = new Date(ticket.fecha_generado).getTime() + config.expiracionHoras * 3600 * 1000;
  if (Date.now() > expiresAt) {
    return NextResponse.json({ error: 'Boleto expirado' }, { status: 410 });
  }

  if (parsed.data.role === 'sociedad_alumnos') {
    if (ticket.estado !== 'generado') return NextResponse.json({ error: 'El boleto ya fue procesado' }, { status: 409 });
    const updated = await store.updateTicket(ticket.id, { estado: 'validado', fecha_validado: new Date().toISOString() });
    await store.createScan({
      id: uuidv4(),
      boleto_id: ticket.id,
      usuario_id: parsed.data.actorUserId,
      tipo: 'validacion',
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ ok: true, ticket: updated });
  }

  if (config.requiereValidacionSociedad && ticket.estado !== 'validado') {
    return NextResponse.json({ error: 'Debe ser validado por sociedad de alumnos primero' }, { status: 409 });
  }

  if (!config.requiereValidacionSociedad && ticket.estado === 'consumido') {
    return NextResponse.json({ error: 'Boleto ya consumido' }, { status: 409 });
  }

  if (ticket.estado === 'consumido') {
    return NextResponse.json({ error: 'Boleto ya consumido' }, { status: 409 });
  }

  const updated = await store.updateTicket(ticket.id, { estado: 'consumido', fecha_consumido: new Date().toISOString() });
  await store.createScan({
    id: uuidv4(),
    boleto_id: ticket.id,
    usuario_id: parsed.data.actorUserId,
    tipo: 'consumo',
    timestamp: new Date().toISOString()
  });

  return NextResponse.json({ ok: true, ticket: updated });
}
