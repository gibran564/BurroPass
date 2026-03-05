'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

export function Scanner({ onResult }: { onResult: (payload: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const scanner = new Html5Qrcode('reader');
    started.current = true;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 220 },
        (decodedText) => {
          onResult(decodedText);
          scanner.stop();
        },
        () => undefined
      )
      .catch(() => {
        setError('No se pudo abrir la cámara. Puedes pegar el payload manualmente.');
      });

    return () => {
      scanner.stop().catch(() => undefined);
      started.current = false;
    };
  }, [onResult]);

  return (
    <div className="card space-y-2">
      <p className="text-sm font-semibold">Escáner rápido</p>
      <div id="reader" className="min-h-40 overflow-hidden rounded-lg bg-slate-800" />
      {error && <p className="text-xs text-amber-300">{error}</p>}
    </div>
  );
}
