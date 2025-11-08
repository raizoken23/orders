
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader, AlertTriangle, Building, FileText, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function QboConnectedPage() {
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch('/api/qbo/company');
        if (!response.ok) {
          throw new Error('Failed to fetch company info.');
        }
        const data = await response.json();
        setCompanyInfo(data.CompanyInfo);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyInfo();
  }, []);

  const createCustomer = async () => {
    const res = await fetch('/api/qbo/customers', { method: 'POST' });
    alert('Customer created: ' + JSON.stringify(await res.json(), null, 2));
  };
  
  const createInvoice = async () => {
    const res = await fetch('/api/qbo/invoices', { method: 'POST' });
    alert('Invoice created: ' + JSON.stringify(await res.json(), null, 2));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader className="animate-spin h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Connecting to QuickBooks...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <p className="font-semibold text-destructive">Connection Failed</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" asChild>
             <Link href="/settings">Return to Settings</Link>
          </Button>
        </div>
      );
    }
    
    if (companyInfo) {
       return (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="font-semibold text-lg">Successfully Connected!</p>
          <p className="text-muted-foreground">
            Connected to QuickBooks company: <span className="font-bold text-foreground">{companyInfo.CompanyName}</span>
          </p>
           <div className="flex gap-4 mt-4">
             <Button onClick={createCustomer} variant="outline"><UserPlus/>Create Customer</Button>
             <Button onClick={createInvoice} variant="outline"><FileText/>Create Invoice</Button>
          </div>
           <Button variant="default" asChild className="mt-4">
             <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building/>QuickBooks Connection</CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
