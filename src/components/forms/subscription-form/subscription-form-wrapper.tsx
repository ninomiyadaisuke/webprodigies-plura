'use client';
import { Plan } from '@prisma/client';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import Loading from '@/components/global/loading';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

import { pricingCards } from '@/lib/constants';
import { getStripe } from '@/lib/stripe/stripe-client';
import { useModal } from '@/providers/modal-provider';

import SubscriptionForm from '.';

type Props = {
  customerId: string;
  planExists: boolean;
};

const SubscriptionFormWrapper = ({ customerId, planExists }: Props) => {
  const { data, setClose } = useModal();
  const router = useRouter();

  const [selectedPriceId, setSelectedPriceId] = useState<Plan | ''>(data.plans?.defaultPriceId || '');

  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({ subscriptionId: '', clientSecret: '' });

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: 'flat',
      },
    }),
    [subscription],
  );

  useEffect(() => {
    if (!selectedPriceId) return;
    const createSecret = async () => {
      const subscriptionResponse = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId: selectedPriceId,
        }),
      });

      const subscriptionResponseData = (await subscriptionResponse.json()) as {
        clientSecret: string;
        subscriptionId: string;
      };
      setSubscription({
        clientSecret: subscriptionResponseData.clientSecret,
        subscriptionId: subscriptionResponseData.subscriptionId,
      });
      if (planExists) {
        toast({
          title: 'Success',
          description: 'Your plan has been successfully upgraded!',
        });
        setClose();
        router.refresh();
      }
    };
    void createSecret();
  }, [data, selectedPriceId, customerId, planExists, setClose, router]);

  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        {data.plans?.plans.map((price) => (
          <Card
            className={clsx('relative cursor-pointer transition-all', {
              'border-primary': selectedPriceId === price.id,
            })}
            key={price.id}
            onClick={() => setSelectedPriceId(price.id as Plan)}
          >
            <CardHeader>
              <CardTitle>
                ${price.unit_amount ? price.unit_amount / 100 : '0'}
                <p className="text-sm text-muted-foreground">{price.nickname}</p>
                <p className="text-sm text-muted-foreground">
                  {pricingCards.find((p) => p.priceId === price.id)?.description}
                </p>
              </CardTitle>
            </CardHeader>
            {selectedPriceId === price.id && (
              <div className="absolute right-4 top-4 size-2 rounded-full bg-emerald-500" />
            )}
          </Card>
        ))}

        {options.clientSecret && !planExists && (
          <>
            <h1 className="text-xl">Payment Method</h1>
            <Elements options={options} stripe={getStripe()}>
              <SubscriptionForm selectedPriceId={selectedPriceId} />
            </Elements>
          </>
        )}

        {!options.clientSecret && selectedPriceId && (
          <div className="flex h-40 w-full items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionFormWrapper;
