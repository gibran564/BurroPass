'use client';

import { useEffect, useMemo, useState } from 'react';
import { AuthGate } from './components/AuthGate';
import { RolePicker } from './components/RolePicker';
import { Scanner } from './components/Scanner';
import { TicketCard } from './components/TicketCard';
import type { AnnouncementDoc, Role, TicketDoc } from '@/lib/types';

export default function HomePage() {
  const [role, setRole] = useState<Role>('estudiante');
  const [userId, setUserId] = useState('student-demo');
  const [area, setArea] = useState('ingenieria');
  const [tickets, setTickets] = useState<TicketDoc[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementDoc[]>([]);
  const [manualScan, setManualScan] = useState('');
  const [message, setMessage] = useState('');

  const canGenerate = role === 'estudiante';
  const canScan = role === 'sociedad_alumnos' || role === 'cafeteria';

  const loadTickets = async () => {
    const data = await fetch(`/api/tickets?userId=${encodeURIComponent(userId)}`).then((r) => r.json());
    setTickets(Array.isArray(data) ? data : []);
  };

  const loadAnnouncements = async () => {
    const data = await fetch('/api/announcements').then((r) => r.json());
    setAnnouncements(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadTickets();
    loadAnnouncements();
  }, [userId]);

  const createTicket = async () => {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: userId, area })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'No se pudo generar boleto');
      return;
    }
    setMessage('Boleto generado exitosamente');
    loadTickets();
  };

  const handleScanPayload = async (payload: string) => {
    try {
      const qr = JSON.parse(payload);
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: qr.ticketId, signature: qr.signature, role, actorUserId: userId })
      });
      const data = await response.json();
      setMessage(response.ok ? `Éxito: ${data.ticket.estado}` : `Error: ${data.error}`);
      loadTickets();
    } catch {
      setMessage('Payload QR inválido');
    }
  };

  const title = useMemo(() => (role === 'estudiante' ? 'Mis boletos' : 'Modo escáner rápido'), [role]);

  return (
    <main className="space-y-4 pb-12">
      <header>
        <h1 className="text-2xl font-bold">BurroPass PWA</h1>
        <p className="text-sm text-slate-400">Boletos digitales de descuento universitario con QR seguro.</p>
      </header>

      <AuthGate onUid={setUserId} />

      <RolePicker value={role} onChange={setRole} />

      <div className="card space-y-2">
        <p className="text-sm font-semibold">Identidad de sesión (demo)</p>
        <input className="w-full rounded-lg bg-slate-800 p-2 text-sm" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input className="w-full rounded-lg bg-slate-800 p-2 text-sm" value={area} onChange={(e) => setArea(e.target.value)} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {canGenerate && (
          <button onClick={createTicket} className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-900">
            Generar boleto de desayuno
          </button>
        )}

        {canScan && <Scanner onResult={handleScanPayload} />}

        {canScan && (
          <div className="card space-y-2">
            <p className="text-xs text-slate-400">Fallback manual</p>
            <textarea
              className="h-20 w-full rounded-lg bg-slate-800 p-2 text-xs"
              value={manualScan}
              onChange={(e) => setManualScan(e.target.value)}
            />
            <button className="rounded-lg bg-slate-700 px-3 py-2 text-xs" onClick={() => handleScanPayload(manualScan)}>
              Procesar payload
            </button>
          </div>
        )}

        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Anuncios institucionales</h2>
        {announcements.map((a) => (
          <div key={a.id} className="card">
            <p className="font-medium">{a.titulo}</p>
            {a.link && (
              <a href={a.link} target="_blank" className="text-xs text-cyan-300" rel="noreferrer">
                {a.link}
              </a>
            )}
          </div>
        ))}
      </section>

      {role === 'admin' && (
        <a className="block rounded-xl bg-fuchsia-500 px-4 py-3 text-center font-semibold text-slate-950" href="/admin">
          Ir al dashboard administrativo
        </a>
      )}

      {message && <p className="rounded-xl bg-slate-800 p-3 text-sm">{message}</p>}
    </main>
  );
}
