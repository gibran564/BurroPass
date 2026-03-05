'use client';

import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase-client';

export function AuthGate({ onUid }: { onUid: (uid: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('No autenticado');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        onUid(user.uid);
        setStatus(`Sesión: ${user.email || user.uid}`);
      }
    });
    return () => unsub();
  }, [onUid]);

  const login = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onUid(result.user.uid);
    } catch {
      setStatus('Error de autenticación. Verifica Firebase Auth.');
    }
  };

  return (
    <div className="card space-y-2">
      <p className="text-sm font-semibold">Firebase Authentication</p>
      <input placeholder="correo institucional" className="w-full rounded bg-slate-800 p-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="contraseña" type="password" className="w-full rounded bg-slate-800 p-2 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login} className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900">
        Iniciar sesión
      </button>
      <p className="text-xs text-slate-400">{status}</p>
    </div>
  );
}
