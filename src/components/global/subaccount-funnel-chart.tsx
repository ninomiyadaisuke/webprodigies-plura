/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { DonutChart } from '@tremor/react';
import React from 'react';

type Props = { data: any };

const SubaccountFunnelChart = ({ data }: Props) => {
  return (
    <div className="flex h-fit items-start transition-all">
      <DonutChart
        category="totalFunnelVisits"
        className="size-40"
        colors={['blue-400', 'primary', 'blue-600', 'blue-700', 'blue-800']}
        customTooltip={customTooltip}
        data={data}
        index="name"
        showAnimation={true}
        variant="pie"
      />
    </div>
  );
};

export default SubaccountFunnelChart;

const customTooltip = ({ payload, active }: { payload: any; active: boolean }) => {
  if (!active || !payload) return null;

  const categoryPayload = payload?.[0];
  if (!categoryPayload) return null;
  return (
    <div className="ml-[100px] w-fit !rounded-lg bg-background/60 p-2 text-black shadow-2xl backdrop-blur-md dark:bg-muted/60 dark:text-white">
      <div className="flex flex-1 items-center space-x-2.5">
        <div
          // eslint-disable-next-line tailwindcss/no-custom-classname, @typescript-eslint/no-unsafe-member-access
          className={`bg- size-5 rounded-full${categoryPayload?.color} rounded`}
        />
        <div className="w-full">
          <div className="flex items-center justify-between space-x-8">
            <p className="whitespace-nowrap text-right">{categoryPayload.name}</p>
            <p className="whitespace-nowrap text-right font-medium ">{categoryPayload.value}</p>
          </div>
        </div>
      </div>
      {categoryPayload.payload.FunnelPages?.map((page: any) => (
        <div className="flex items-center justify-between text-black dark:text-white/70" key={page.id}>
          <small>{page.name}</small>
          <small>{page.visits}</small>
        </div>
      ))}
    </div>
  );
};
