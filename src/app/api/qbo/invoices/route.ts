export const runtime = 'nodejs';
import { createTestInvoice, ensureConnected } from '@/lib/qbo';

export async function POST() {
  if (!(await ensureConnected())) return new Response('Not connected', { status: 412 });
  // For demo, create an invoice for an existing or new customer:
  const customerRef = { value: '1' }; // replace with real Customer.Id from your sandbox
  const inv = await createTestInvoice(customerRef);
  return Response.json(inv);
}
