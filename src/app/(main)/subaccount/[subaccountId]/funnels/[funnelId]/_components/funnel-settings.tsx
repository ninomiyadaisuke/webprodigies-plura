import { Funnel } from '@prisma/client';
import React from 'react';

import FunnelForm from '@/components/forms/funnel-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { db } from '@/lib/db';
import { getConnectAccountProducts } from '@/lib/stripe/stripe-actions';

import FunnelProductsTable from './funnel-products-table';

type Props = {
  subaccountId: string;
  defaultData: Funnel;
};

const FunnelSettings = async ({ subaccountId, defaultData }: Props) => {
  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });

  if (!subaccountDetails) return;
  if (!subaccountDetails.connectAccountId) return;

  const products = await getConnectAccountProducts(subaccountDetails.connectAccountId);

  return (
    <div className="flex flex-col gap-4 xl:!flex-row">
      <Card className="flex-1 shrink">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel. You can sell one time and recurring
            products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {subaccountDetails.connectAccountId ? (
              <FunnelProductsTable defaultData={defaultData} products={products} />
            ) : (
              ' "Connect your stripe account to sell products."'
            )}
          </>
        </CardContent>
        <FunnelForm defaultData={defaultData} subAccountId={subaccountId} />
      </Card>
    </div>
  );
};

export default FunnelSettings;
