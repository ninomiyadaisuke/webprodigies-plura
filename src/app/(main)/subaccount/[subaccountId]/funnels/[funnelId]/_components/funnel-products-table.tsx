/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Funnel } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Stripe from 'stripe';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { saveActivityLogsNotification, updateFunnelProducts } from '@/lib/queries';

type Props = {
  defaultData: Funnel;
  products: Stripe.Product[];
};

const FunnelProductsTable = ({ defaultData, products }: Props) => {
  const data = JSON.parse(defaultData.liveProducts || '[]') as { productId: string; recurring: boolean }[] | [];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [liveProducts, setLiveProducts] = useState<{ productId: string; recurring: boolean }[] | []>(data);

  const handleAddProduct = (product: Stripe.Product) => {
    const productIdExists = liveProducts.find(
      //@ts-ignore
      (prod) => prod.productId === product.default_price.id,
    );
    productIdExists
      ? setLiveProducts(
          liveProducts.filter(
            (prod) =>
              prod.productId !==
              //@ts-ignore
              product.default_price?.id,
          ),
        )
      : //@ts-ignore
        setLiveProducts([
          ...liveProducts,
          {
            //@ts-ignore
            productId: product.default_price.id as string,
            //@ts-ignore
            recurring: !!product.default_price.recurring,
          },
        ]);
  };

  const handleSaveProducts = async () => {
    setIsLoading(true);
    const response = await updateFunnelProducts(JSON.stringify(liveProducts), defaultData.id);
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel products | ${response.name}`,
      subaccountId: defaultData.subAccountId,
    });
    setIsLoading(false);
    router.refresh();
  };
  return (
    <>
      <Table className="rounded-md border-[1px] border-border bg-card">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead>Live</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="truncate font-medium">
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Input
                  className="size-4"
                  defaultChecked={
                    !!liveProducts.find(
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      (prod) => prod.productId === product.default_price.id,
                    )
                  }
                  onChange={() => handleAddProduct(product)}
                  type="checkbox"
                />
              </TableCell>
              <TableCell>
                <Image alt="product Image" height={60} src={product.images[0]!} width={60} />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {
                  //@ts-ignore
                  product.default_price?.recurring ? 'Recurring' : 'One Time'
                }
              </TableCell>
              <TableCell className="text-right">
                $
                {
                  //@ts-ignore
                  product.default_price?.unit_amount / 100
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="mt-4" disabled={isLoading} onClick={handleSaveProducts}>
        Save Products
      </Button>
    </>
  );
};

export default FunnelProductsTable;
