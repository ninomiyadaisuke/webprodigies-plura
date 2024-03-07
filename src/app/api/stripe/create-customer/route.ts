import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { StripeCustomerType } from '@/lib/types';

export async function POST(req: Request) {
  const { address, email, name, shipping } = (await req.json()) as StripeCustomerType;

  if (!email || !address || !name || !shipping)
    return new NextResponse('Missing data', {
      status: 400,
    });

  try {
    console.log(req);

    const customer = await stripe.customers.create({
      email,
      name,
      address,
      shipping,
    });
    return Response.json({ customerId: customer.id });
  } catch (error) {
    console.log('🔴 Error', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}