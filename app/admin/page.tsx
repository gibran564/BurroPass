'use client';

import { FormEvent, useEffect, useState } from 'react';

export default function AdminPage() {
  const [titulo, setTitulo] = useState('');
  const [link, setLink] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [config, setConfig] = useState({
    limiteDiarioPorEstudiante: 1,
    limiteDiarioPorArea: 100,
    requiereValidacionSociedad: true,
    expiracionHoras: 24
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setMsg('No se pudo cargar configuración'));
  }, []);

  const saveAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo,
        link,
        fecha_inicio: inicio,
        fecha_fin: fin,
        activo: true
      })
    });
    setMsg(response.ok ? 'Anuncio guardado' : 'Error al guardar anuncio');
  };

  const saveConfig = async () => {
    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    setMsg(response.ok ? 'Configuración actualizada' : 'Error al guardar configuración');
  };

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard admin</h1>
      <section className="card space-y-2">
        <h2 className="font-semibold">Configurar límites</h2>
        <label className="text-xs">Límite diario por estudiante</label>
        <input
          type="number"
          className="w-full rounded bg-slate-800 p-2"
          value={config.limiteDiarioPorEstudiante}
          onChange={(e) => setConfig((s) => ({ ...s, limiteDiarioPorEstudiante: Number(e.target.value) }))}
        />
        <label className="text-xs">Límite diario por área</label>
        <input
          type="number"
          className="w-full rounded bg-slate-800 p-2"
          value={config.limiteDiarioPorArea}
          onChange={(e) => setConfig((s) => ({ ...s, limiteDiarioPorArea: Number(e.target.value) }))}
        />
        <label className="text-xs">Expiración (horas)</label>
        <input
          type="number"
          className="w-full rounded bg-slate-800 p-2"
          value={config.expiracionHoras}
          onChange={(e) => setConfig((s) => ({ ...s, expiracionHoras: Number(e.target.value) }))}
        />
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={config.requiereValidacionSociedad}
            onChange={(e) => setConfig((s) => ({ ...s, requiereValidacionSociedad: e.target.checked }))}
          />
          Requerir validación de sociedad de alumnos
        </label>
        <button className="rounded bg-cyan-500 px-3 py-2 font-semibold text-slate-900" onClick={saveConfig}>
          Guardar configuración
        </button>
      </section>

      <section className="card space-y-2">
        <h2 className="font-semibold">Publicar anuncio</h2>
        <form onSubmit={saveAnnouncement} className="space-y-2">
          <input className="w-full rounded bg-slate-800 p-2" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          <input className="w-full rounded bg-slate-800 p-2" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
          <input type="datetime-local" className="w-full rounded bg-slate-800 p-2" value={inicio} onChange={(e) => setInicio(e.target.value)} required />
          <input type="datetime-local" className="w-full rounded bg-slate-800 p-2" value={fin} onChange={(e) => setFin(e.target.value)} required />
          <button className="rounded bg-fuchsia-500 px-3 py-2 font-semibold text-slate-900" type="submit">
            Crear anuncio
          </button>
        </form>
      </section>
      {msg && <p className="card">{msg}</p>}
    </main>
  );
}
