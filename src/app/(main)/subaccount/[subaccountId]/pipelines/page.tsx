import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

type Props = {
  params: { subaccountId: string };
};

const Pipelines = async ({ params }: Props) => {
  console.log('start');

  const pipelineExists = await db.pipeline.findFirst({
    where: { subAccountId: params.subaccountId },
  });

  if (pipelineExists) return redirect(`/subaccount/${params.subaccountId}/pipelines/${pipelineExists.id}`);

  const response = await db.pipeline.create({
    data: { name: 'First Pipeline', subAccountId: params.subaccountId },
  });
  if (!response) return;
  return redirect(`/subaccount/${params.subaccountId}/pipelines/${response.id}`);
};

export default Pipelines;
