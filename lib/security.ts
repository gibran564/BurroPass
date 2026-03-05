import { createHmac, timingSafeEqual } from 'crypto';

const secret = process.env.QR_SIGNING_SECRET || 'dev_secret_change_me';

export function signTicket(ticketId: string, userId: string, issuedAt: string) {
  return createHmac('sha256', secret).update(`${ticketId}.${userId}.${issuedAt}`).digest('hex');
}

export function verifyTicketSignature(ticketId: string, userId: string, issuedAt: string, signature: string) {
  const expected = signTicket(ticketId, userId, issuedAt);
  const expectedBuffer = Buffer.from(expected);
  const currentBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== currentBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, currentBuffer);
}
