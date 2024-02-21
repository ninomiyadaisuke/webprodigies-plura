import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ModeToggle } from '@/components/global/mode-toggle';

const Navigation = () => {
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-4">
      <aside className="flex items-center gap-2">
        <Image alt="plur logo" height={40} src={'./assets/plura-logo.svg'} width={40} />
        <span className="text-xl font-bold"> Plura.</span>
      </aside>
      <nav className="absolute left-[50%] top-[50%] hidden translate-x-[-50%] translate-y-[-50%] md:block">
        <ul className="flex items-center justify-center gap-8">
          <Link href={'#'}>Pricing</Link>
          <Link href={'#'}>About</Link>
          <Link href={'#'}>Documentation</Link>
          <Link href={'#'}>Features</Link>
        </ul>
      </nav>
      <aside className="flex items-center gap-2">
        <Link className="rounded-md bg-primary p-2 px-4 text-white hover:bg-primary/80" href={'/agency'}>
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
