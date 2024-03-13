import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { customerId, priceId } = await req.json();

  if (!customerId || !priceId)
    return new NextResponse('Customer Id or price id is missing', {
      status: 400,
    });

  const subscriptionExists = await db.agency.findFirst({
    where: {
      customerId: customerId as string,
    },
    include: { Subscription: true },
  });

  try {
    if (subscriptionExists?.Subscription?.subscritiptionId && subscriptionExists.Subscription.active) {
      //update the subscription instead of creating one.
      if (!subscriptionExists.Subscription.subscritiptionId) {
        throw new Error('Could not find the subscription Id to update the subscription.');
      }
      console.log('Updating the subscription');

      const currentSubscriptionDetails = await stripe.subscriptions.retrieve(
        subscriptionExists.Subscription.subscritiptionId,
      );

      const subscription = await stripe.subscriptions.update(subscriptionExists.Subscription.subscritiptionId, {
        items: [{ id: currentSubscriptionDetails.items.data[0]?.id, deleted: true }, { price: priceId as string }],
        expand: ['latest_invoice.payment_intent'],
      });

      console.log('subscription yhoooooooooooo');

      return NextResponse.json({
        subscriptionId: subscription.id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        clientSecret: subscription.latest_invoice.payment_intent?.client_secret,
      });
    } else {
      console.log('Createing a sub');
      const subscription = await stripe.subscriptions.create({
        customer: customerId as string,
        items: [
          {
            price: priceId as string,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });
      return NextResponse.json({
        subscriptionId: subscription.id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      });
    }
  } catch (error) {
    console.log('🔴 Error', error);
    return new NextResponse('Internal Server Error', {
      status: 500,
    });
  }
}
