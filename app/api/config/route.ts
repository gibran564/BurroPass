import { NextResponse } from 'next/server';
import { configSchema } from '@/lib/schemas';
import { store } from '@/lib/store';

export async function GET() {
  const config = await store.getConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const payload = await request.json();
  const parsed = configSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const saved = await store.setConfig(parsed.data);
  return NextResponse.json(saved);
}
