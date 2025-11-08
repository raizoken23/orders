
import { getSecret } from '@/lib/secretStore';
import { VenetianMask, CreditCard } from 'lucide-react';
import { AdminClient } from './admin-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default async function AdminPage() {
  const stripe = (await getSecret<any>('stripe')) || {};
  const qbo = (await getSecret<any>('qbo')) || {};
  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                <VenetianMask className="size-8"/>
                Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
            Manage users, roles, and third-party integrations. This page is for administrators only.
            </p>
        </div>
        <Button asChild>
            <Link href="/admin/stripe">
                <CreditCard className="mr-2" />
                Manage Stripe Products
            </Link>
        </Button>
      </div>
      <AdminClient stripe={stripe} qbo={qbo} />
    </div>
  );
}

    
