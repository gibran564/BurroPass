'use client';

import type { Role } from '@/lib/types';

const roles: Role[] = ['estudiante', 'sociedad_alumnos', 'cafeteria', 'admin'];

export function RolePicker({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  return (
    <div className="card">
      <p className="mb-2 text-sm font-semibold">Rol activo</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => onChange(role)}
            className={`rounded-xl border px-3 py-2 ${value === role ? 'border-cyan-400 bg-cyan-500/20' : 'border-slate-700'}`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
