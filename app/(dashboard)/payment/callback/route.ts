import { createClient } from '@/lib/supabase/server';
import { Json, Tables } from '@/types/database';
import { NextResponse } from 'next/server';
import { InvoiceCallback, InvoiceFee } from 'xendit-node/invoice/models';

function calculateTotalFee(fees?: Array<InvoiceFee>): number {
  if (!fees) {
    return 0;
  }
  return fees.reduce((total, fee) => total + fee.value, 0);
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const callbackToken = request.headers.get('x-callback-token');
  const code = requestUrl.searchParams.get('code');

  if (callbackToken !== process.env.XENDIT_WEBHOOK_KEY) {
    throw new Error('Invalid callback token');
  }

  const payload = (await request.json()) as InvoiceCallback;

  const totalFee = calculateTotalFee(payload.fees);

  const transaction: Partial<Tables<'user_transaction'>> = {
    id: payload.external_id,
    invoice_id: payload.id,
    amount: payload.amount,
    paid_amount: payload.paid_amount,
    fees: payload.fees as Json[] | undefined,
    adjusted_received_amount: payload.amount - totalFee,
    paid_at: payload.paid_at,
    payer_email: payload.payer_email,
    updated_at: payload.updated,
    currency: payload.currency,
    status: payload.status,
    payment_method: payload.payment_method,
    payment_channel: payload.payment_channel,
  };
  const supabase = createClient();

  const { error } = await supabase
    .from('user_transaction')
    .update(transaction)
    .eq('id', payload.external_id);

  if (error) {
    throw error;
  }
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
