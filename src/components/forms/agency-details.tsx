'use client';
import { Agency } from '@prisma/client';
import React from 'react';

type Props = {
  data?: Partial<Agency>;
};

const AgencyDetails = ({ data }: Props) => {
  console.log(data);

  return <div>AgencyDetails</div>;
};

export default AgencyDetails;
