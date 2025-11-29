'use client';

import Link from 'next/link';
import { Sprout } from 'lucide-react';
import { AuthButton } from './auth-button';
import { Cart } from './cart';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60")}>
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Sprout className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">eComVoyage</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Cart />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
