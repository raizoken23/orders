import { getSecret, mask } from '@/lib/secretStore';

export default async function AdminPage() {
  const stripe = (await getSecret<any>('stripe')) || {};
  const qbo = (await getSecret<any>('qbo')) || {};
  return (
    <div style={{maxWidth:720, margin:'40px auto', padding:20}}>
      <h1>Admin · Integrations</h1>

      <section style={{border:'1px solid #ddd', padding:16, marginTop:16}}>
        <h2>Stripe (Test/Sandbox)</h2>
        <p>Saved: {stripe.secretKey ? 'Yes' : 'No'} {stripe.secretKey ? `(${mask(stripe.secretKey)})` : ''}</p>
        <StripeForm />
        <StripeTest />
      </section>

      <section style={{border:'1px solid #ddd', padding:16, marginTop:16}}>
        <h2>QuickBooks Online (Sandbox)</h2>
        <p>Saved: {(qbo.clientId && qbo.clientSecret) ? 'Yes' : 'No'}</p>
        <QboForm />
        <QboConnect />
      </section>
    </div>
  );
}

function field(label: string, props: any) {
  return (
    <label style={{display:'block', marginBottom:8}}>
      <div style={{fontSize:12, color:'#555'}}>{label}</div>
      <input {...props} style={{width:'100%', padding:8, border:'1px solid #ccc'}} />
    </label>
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
      e.preventDefault(); setMsg('saving…');
      const r = await fetch('/api/admin/stripe/save', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ secretKey, publishableKey, webhookSecret }) });
      setMsg(r.ok ? 'saved' : 'error'); if(r.ok) location.reload();
    }}>
      {field('Secret key (sk_test_…)', { value:secretKey, onChange:e=>setSK(e.target.value), type:'password', required:true })}
      {field('Publishable key (pk_test_…)', { value:publishableKey, onChange:e=>setPK(e.target.value), type:'text' })}
      {field('Webhook signing secret (whsec_…)', { value:webhookSecret, onChange:e=>setWH(e.target.value), type:'password' })}
      <button type="submit">Save Stripe Keys</button> <span>{msg}</span>
    </form>
  );
}

function StripeTest() {
  return (
    <div style={{marginTop:10}}>
      <button onClick={async ()=>{
        const r = await fetch('/api/admin/stripe/test', { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ amount: 500, description: 'ScopeSheet Test Charge'}) });
        const { url } = await r.json(); window.location.href = url;
      }}>Create $5 Test Checkout</button>
      <div style={{fontSize:12, color:'#555', marginTop:6}}>Set webhook to {location.origin}/api/pay/webhook</div>
    </div>
  );
}

function QboForm() {
  const [clientId, setId] = useState(''); const [clientSecret, setSec] = useState(''); const [redirectUrl, setRU] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <form onSubmit={async e=>{
      e.preventDefault(); setMsg('saving…');
      const r = await fetch('/api/admin/qbo/save', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ clientId, clientSecret, redirectUrl }) });
      setMsg(r.ok ? 'saved' : 'error'); if(r.ok) location.reload();
    }}>
      {field('Client ID', { value:clientId, onChange:e=>setId(e.target.value), required:true })}
      {field('Client Secret', { value:clientSecret, onChange:e=>setSec(e.target.value), type:'password', required:true })}
      {field('Redirect URL', { value:redirectUrl, onChange:e=>setRU(e.target.value), placeholder:'/api/qbo/callback' })}
      <button type="submit">Save QBO App</button> <span>{msg}</span>
    </form>
  );
}

function QboConnect() {
  return (
    <div style={{marginTop:10}}>
      <button onClick={async ()=>{
        const r = await fetch('/api/admin/qbo/authurl'); const { url } = await r.json(); window.location.href = url;
      }}>Connect QuickBooks Sandbox</button>
    </div>
  );
}
