'use client';

import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import type { TicketDoc } from '@/lib/types';

export function TicketCard({ ticket }: { ticket: TicketDoc }) {
  const [img, setImg] = useState('');

  useEffect(() => {
    QRCode.toDataURL(ticket.token_qr).then(setImg).catch(() => setImg(''));
  }, [ticket.token_qr]);

  return (
    <div className="card space-y-2">
      <p className="text-xs uppercase text-cyan-300">Boleto {ticket.estado}</p>
      <p className="text-[11px] text-slate-400">ID: {ticket.id}</p>
      {img && <img alt="QR del boleto" src={img} className="mx-auto w-44 rounded-lg bg-white p-2" />}
      <p className="text-[11px] break-all text-slate-500">Firma: {ticket.signature.slice(0, 18)}...</p>
    </div>
  );
}
