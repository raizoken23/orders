
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Building, FileSpreadsheet, HeartHandshake, LayoutList, Lock, Shield, Users, MoreHorizontal, Link as LinkIcon, Percent } from 'lucide-react';
import { mask } from '@/lib/secretStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface AdminClientProps {
    stripe: any;
    qbo: any;
}

const mockUsers = [
    { id: 'usr_1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' as const, avatar: 'https://picsum.photos/seed/avatar1/40/40' },
    { id: 'usr_2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Manager' as const, avatar: 'https://picsum.photos/seed/avatar2/40/40' },
    { id: 'usr_3', name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Team Lead' as const, avatar: 'https://picsum.photos/seed/avatar3/40/40' },
    { id: 'usr_4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Field Inspector' as const, avatar: 'https://picsum.photos/seed/avatar4/40/40' },
    { id: 'usr_5', name: 'Chris Wilson', email: 'chris.wilson@example.com', role: 'Field Inspector' as const, avatar: 'https://picsum.photos/seed/avatar5/40/40' },
    { id: 'usr_6', name: 'Sarah Brown', email: 'sarah.brown@example.com', role: 'Viewer' as const, avatar: 'https://picsum.photos/seed/avatar6/40/40' },
];

const roles: ('Admin' | 'Manager' | 'Team Lead' | 'Field Inspector' | 'Viewer')[] = ['Admin', 'Manager', 'Team Lead', 'Field Inspector', 'Viewer'];


export function AdminClient({ stripe, qbo }: AdminClientProps) {
    
    const isStripeConnected = stripe && stripe.secretKey;
    const isQboConfigured = qbo && qbo.clientId && qbo.clientSecret;

    const [users, setUsers] = useState(mockUsers);

    const handleRoleChange = (userId: string, newRole: typeof roles[number]) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    };


    return (
      <div className="flex flex-col gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold font-headline flex items-center gap-2"><Users /> User Management</CardTitle>
                <CardDescription>View, manage, and assign roles to users in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="size-8 rounded-full" />
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="size-4" />
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                            {roles.map(role => (
                                                <DropdownMenuItem key={role} onSelect={() => handleRoleChange(user.id, role)}>
                                                    <Shield className="mr-2 size-4" />
                                                    <span>Set as {role}</span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold font-headline flex items-center gap-2"><Briefcase /> Stripe Configuration</CardTitle>
                    <CardDescription>Manage Stripe API keys and create products. Current Status: {isStripeConnected ? <span className="text-green-500 font-medium">Connected ({mask(stripe.secretKey)})</span> : <span className="text-red-500 font-medium">Not Connected</span>}</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold mb-4">API Keys</h3>
                        <StripeForm />
                        <StripeTest />
                    </div>
                     <div>
                        <h3 className="font-semibold mb-4">Stripe Controls</h3>
                        <StripeControls />
                    </div>
                </CardContent>
            </Card>

            <section className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-semibold font-headline flex items-center gap-2"><Building /> QuickBooks (Accounting)</h2>
                <p className="text-sm text-muted-foreground">Status: {isQboConfigured ? <span className="text-green-500 font-medium">App Configured</span> : <span className="text-red-500 font-medium">App Not Configured</span>}</p>
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


function field(label: string, props: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="text-sm font-medium">{label}</Label>
      <Input {...props} className="text-sm" />
    </div>
  );
}

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
    const [webhookUrl, setWebhookUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWebhookUrl(`${window.location.origin}/api/pay/webhook`);
        }
    }, []);

    return (
        <div className="pt-4 mt-4 border-t">
        <Button variant="secondary" onClick={async ()=>{
            const r = await fetch('/api/admin/stripe/test', { method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ amount: 500, description: 'ScopeSheet Test Charge'}) });
            const { url } = await r.json(); window.location.href = url;
        }}>Create $5 Test Checkout</Button>
        <div className="text-xs text-muted-foreground mt-2">Webhook Endpoint: <code className="bg-muted px-1 py-0.5 rounded">{webhookUrl}</code></div>
        </div>
    );
}

function StripeControls() {
    const { toast } = useToast();
    const [product, setProduct] = useState('report');
    const [price, setPrice] = useState(29);
    const [discount, setDiscount] = useState([0]);

    const handleGenerateLink = () => {
        const finalPrice = price * (1 - discount[0] / 100);
        toast({
            title: "Payment Link Generated (Mock)",
            description: `Product: ${product}, Final Price: $${finalPrice.toFixed(2)}`,
        });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Product / Service</Label>
                <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="report">Standard Report</SelectItem>
                        <SelectItem value="analysis">AI Image Analysis Pack</SelectItem>
                        <SelectItem value="diagram">Roof Diagram Service</SelectItem>
                        <SelectItem value="subscription">Pro Subscription (Monthly)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price (in USD)</Label>
                <Input id="price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="discount" className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-muted-foreground">{discount[0]}%</span>
                </Label>
                <div className="flex items-center gap-4">
                    <Percent className="text-muted-foreground" />
                    <Slider id="discount" min={0} max={100} step={5} value={discount} onValueChange={setDiscount} />
                </div>
            </div>
            <Button className="w-full" onClick={handleGenerateLink}>
                <LinkIcon className="mr-2" />
                Generate Payment Link
            </Button>
        </div>
    );
}


function QboForm() {
  const [clientId, setId] = useState('');
  const [clientSecret, setSec] = useState('');
  const [redirectUrl, setRU] = useState('');
  const [msg, setMsg] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setOrigin(window.location.origin);
    }
  }, []);


  return (
    <form onSubmit={async e=>{
      e.preventDefault(); setMsg('Saving…');
      const r = await fetch('/api/admin/qbo/save', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ clientId, clientSecret, redirectUrl: redirectUrl || `${origin}/api/qbo/callback` }) });
      setMsg(r.ok ? 'Saved successfully' : 'Error saving');
       if(r.ok) setTimeout(() => location.reload(), 1000);
    }}>
      <div className="space-y-4">
        {field('Client ID', { id: 'qbo-id', value:clientId, onChange:e=>setId(e.target.value), required:true })}
        {field('Client Secret', { id: 'qbo-sec', value:clientSecret, onChange:e=>setSec(e.target.value), type:'password', required:true })}
        {field('Redirect URL', { id: 'qbo-ru', value:redirectUrl, onChange:e=>setRU(e.target.value), placeholder: `${origin}/api/qbo/callback` })}
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

    