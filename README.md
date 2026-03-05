# BurroPass (PWA)

PWA con Next.js para digitalizar boletos de descuento universitario con flujo seguro por QR:

- `estudiante`: genera boletos QR.
- `sociedad_alumnos`: valida boletos (`generado → validado`).
- `cafeteria`: consume boletos (`validado → consumido`).
- `admin`: configura límites y anuncios.

## Stack

- Next.js App Router + Tailwind
- next-pwa (service worker y soporte instalable)
- Firebase Auth / Firestore (estructura lista)
- Validación con Zod
- UUID + firma HMAC SHA-256 para evitar falsificación

## Colecciones (Firestore)

- `usuarios`
- `boletos`
- `escaneos`
- `anuncios`
- `config`

## Flujo de boleto

1. Estudiante genera boleto.
2. Se crea UUID y firma digital (`signature`) junto al payload QR.
3. Sociedad de alumnos valida QR (cambia estado a `validado`).
4. Cafetería confirma consumo (cambia a `consumido`).
5. Cada escaneo se registra con actor y timestamp.

## Variables de entorno

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
QR_SIGNING_SECRET=
```

## Ejecutar

```bash
npm install
npm run dev
```

> En este prototipo se usa un store en memoria para demo local de API. Cambiar a Firestore en `lib/store.ts` para producción.
