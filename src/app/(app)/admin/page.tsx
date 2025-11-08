import { getSecret, mask } from '@/lib/secretStore';
import { Briefcase, Building, FileSpreadsheet, HeartHandshake, LayoutList, Mail, Shield, VenetianMask } from 'lucide-react';

export default async function AdminPage() {
  const stripe = (await getSecret<any>('stripe')) || {};
  const qbo = (await getSecret<any>('qbo')) || {};
  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
            <VenetianMask className="size-8"/>
            Admin · Integrations
        </h1>
        <p className="text-muted-foreground">
          Manage third-party integrations and application keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold font-headline flex items-center gap-2"><Briefcase /> Stripe (Payments)</h2>
            <p className="text-sm text-muted-foreground">Status: {stripe.secretKey ? <span className="text-green-500 font-medium">Connected ({mask(stripe.secretKey)})</span> : <span className="text-red-500 font-medium">Not Connected</span>}</p>
            <StripeForm />
            <StripeTest />
        </section>

        <section className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold font-headline flex items-center gap-2"><Building /> QuickBooks (Accounting)</h2>
            <p className="text-sm text-muted-foreground">Status: {(qbo.clientId && qbo.clientSecret) ? <span className="text-green-500 font-medium">App Configured</span> : <span className="text-red-500 font-medium">App Not Configured</span>}</p>
            <QboForm />
            <QboConnect />
        </section>
        
        <section className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold font-headline flex items-center gap-2"><FileSpreadsheet /> Excel / Google Sheets</h2>
             <p className="text-sm text-muted-foreground">Export inspection data for reporting and analysis.</p>
            <Button variant="outline" className="w-full" disabled>Configure Export (Coming Soon)</Button>
        </section>
        
        <section className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold font-headline flex items-center gap-2"><HeartHandshake /> CRM (HubSpot)</h2>
             <p className="text-sm text-muted-foreground">Sync client data with your Customer Relationship Manager.</p>
            <Button variant="outline" className="w-full" disabled>Connect HubSpot (Coming Soon)</Button>
        </section>

        <section className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold font-headline flex items-center gap-2"><LayoutList /> Project Management (Trello)</h2>
             <p className="text-sm text-muted-foreground">Create Trello cards for new inspections automatically.</p>
            <Button variant="outline" className="w-full" disabled>Connect Trello (Coming Soon)</Button>
        </section>
      </div>

    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function field(label: string, props: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="text-sm font-medium">{label}</Label>
      <Input {...props} className="text-sm" />
    </div>
  );
}

'use client';
import { useState } from 'react';

function StripeForm() {
  const [secretKey, setSK] = useState('');
  const [publishableKey, setPK] = useState('');
  const [webhookSecret, setWH] = useState('');
  const [msg, setMsg] = useState('');

  return (
    <form onSubmit={async e=>{
      e.preventDefault(); setMsg('Saving…');
      const r = await fetch('/api/admin/stripe/save', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ secretKey, publishableKey, webhookSecret }) });
      setMsg(r.ok ? 'Saved successfully' : 'Error saving'); 
      if(r.ok) setTimeout(() => location.reload(), 1000);
    }}>
        <div className="space-y-4">
          {field('Secret key (sk_test_…)', { id: 'sk', value:secretKey, onChange:e=>setSK(e.target.value), type:'password', required:true })}
          {field('Publishable key (pk_test_…)', { id: 'pk', value:publishableKey, onChange:e=>setPK(e.target.value), type:'text' })}
          {field('Webhook signing secret (whsec_…)', { id: 'wh', value:webhookSecret, onChange:e=>setWH(e.target.value), type:'password' })}
          <div className="flex items-center gap-4">
              <Button type="submit">Save Stripe Keys</Button>
              <span className="text-sm text-muted-foreground">{msg}</span>
          </div>
        </div>
    </form>
  );
}

function StripeTest() {
  return (
    <div className="pt-2">
      <Button variant="secondary" onClick={async ()=>{
        const r = await fetch('/api/admin/stripe/test', { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ amount: 500, description: 'ScopeSheet Test Charge'}) });
        const { url } = await r.json(); window.location.href = url;
      }}>Create $5 Test Checkout</Button>
      <div className="text-xs text-muted-foreground mt-2">Webhook Endpoint: <code className="bg-muted px-1 py-0.5 rounded">{location.origin}/api/pay/webhook</code></div>
    </div>
  );
}

function QboForm() {
  const [clientId, setId] = useState(''); const [clientSecret, setSec] = useState(''); const [redirectUrl, setRU] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <form onSubmit={async e=>{
      e.preventDefault(); setMsg('Saving…');
      const r = await fetch('/api/admin/qbo/save', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ clientId, clientSecret, redirectUrl }) });
      setMsg(r.ok ? 'Saved successfully' : 'Error saving');
       if(r.ok) setTimeout(() => location.reload(), 1000);
    }}>
      <div className="space-y-4">
        {field('Client ID', { id: 'qbo-id', value:clientId, onChange:e=>setId(e.target.value), required:true })}
        {field('Client Secret', { id: 'qbo-sec', value:clientSecret, onChange:e=>setSec(e.target.value), type:'password', required:true })}
        {field('Redirect URL', { id: 'qbo-ru', value:redirectUrl, onChange:e=>setRU(e.target.value), placeholder: (typeof window !== 'undefined') ? `${window.location.origin}/api/qbo/callback` : '/api/qbo/callback' })}
         <div className="flex items-center gap-4">
            <Button type="submit">Save QuickBooks App</Button>
            <span className="text-sm text-muted-foreground">{msg}</span>
         </div>
      </div>
    </form>
  );
}

function QboConnect() {
  return (
    <div className="pt-2">
      <Button variant="secondary" onClick={async ()=>{
        const r = await fetch('/api/admin/qbo/authurl'); const { url } = await r.json(); window.location.href = url;
      }}>Connect QuickBooks Sandbox</Button>
    </div>
  );
}