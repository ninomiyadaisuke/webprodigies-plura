import { CheckCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { db } from '@/lib/db';

type Props = {
  params: {
    agencyId: string;
  };
  searchParams: { code: string };
};

const LaunchPadPage = async ({ params }: Props) => {
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="size-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started</CardTitle>
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
