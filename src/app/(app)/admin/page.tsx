
import { getSecret } from '@/lib/secretStore';
import { VenetianMask } from 'lucide-react';
import { AdminClient } from './admin-client';


export default async function AdminPage() {
  const stripe = (await getSecret<any>('stripe')) || {};
  const qbo = (await getSecret<any>('qbo')) || {};
  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
            <VenetianMask className="size-8"/>
            Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage users, roles, and third-party integrations. This page is for administrators only.
        </p>
      </div>
      <AdminClient stripe={stripe} qbo={qbo} />
    </div>
  );
}

    