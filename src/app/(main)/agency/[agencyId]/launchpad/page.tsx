import { CheckCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { getStripeOAuthLink } from '@/lib/utils';

type Props = {
  params: {
    agencyId: string;
  };
  searchParams: { code: string };
};

const LaunchPadPage = async ({ params, searchParams }: Props) => {
  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
  });

  if (!agencyDetails) return;

  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  const stripeOAuthLink = getStripeOAuthLink('agency', `launchpad___${agencyDetails.id}`);

  let connectedStripeAccount = false;

  if (searchParams.code) {
    if (!agencyDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: 'authorization_code',
          code: searchParams.code,
        });
        await db.agency.update({
          where: { id: params.agencyId },
          data: { connectAccountId: response.stripe_user_id },
        });
        connectedStripeAccount = true;
      } catch (error) {
        console.log('🔴 Could not connect stripe account');
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="size-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>Follow the steps below to get your account setup.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-2 rounded-lg border p-4">
              <div className="flex flex-col gap-4 md:!flex-row md:items-center">
                <Image
                  alt="app logo"
                  className="rounded-md object-contain"
                  height={80}
                  src="/appstore.png"
                  width={80}
                />
                <p> Save the website as a shortcut on your mobile device</p>
              </div>
              <Button>Start</Button>
            </div>
            <div className="flex w-full items-center justify-between gap-2 rounded-lg border p-4">
              <div className="flex flex-col gap-4 md:!flex-row md:items-center">
                <Image
                  alt="app logo"
                  className="rounded-md object-contain"
                  height={80}
                  src="/stripelogo.png"
                  width={80}
                />
                <p>Connect your stripe account to accept payments and see your dashboard.</p>
              </div>
              {agencyDetails.connectAccountId || connectedStripeAccount ? (
                <CheckCircleIcon className=" shrink-0 p-2 text-primary" size={50} />
              ) : (
                <Link className="rounded-md bg-primary px-4 py-2 text-white" href={stripeOAuthLink}>
                  Start
                </Link>
              )}
            </div>
            <div className="flex w-full items-center justify-between gap-2 rounded-lg border p-4">
              <div className="flex flex-col gap-4 md:!flex-row md:items-center">
                <Image
                  alt="app logo"
                  className="rounded-md object-contain"
                  height={80}
                  src={agencyDetails.agencyLogo}
                  width={80}
                />
                <p> Fill in all your bussiness details</p>
              </div>
              {allDetailsExist ? (
                <CheckCircleIcon className="shrink-0 p-2 text-primary" size={50} />
              ) : (
                <Link
                  className="rounded-md bg-primary px-4 py-2 text-white"
                  href={`/agency/${params.agencyId}/settings`}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaunchPadPage;
