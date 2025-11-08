'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [provider, setProvider] = useState('google');
  const [openAIKey, setOpenAIKey] = useState('');
  const [keyInput, setKeyInput] = useState('');

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider') || 'google';
    const savedKey = localStorage.getItem('openAIKey') || '';
    setProvider(savedProvider);
    setOpenAIKey(savedKey);
    setKeyInput(savedKey);
  }, []);

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    localStorage.setItem('aiProvider', newProvider);
     toast({
      title: 'AI Provider Changed',
      description: `Your AI provider has been set to ${newProvider === 'google' ? 'Google Gemini' : 'OpenAI'}.`,
    });
  };

  const handleSaveKey = () => {
    setOpenAIKey(keyInput);
    localStorage.setItem('openAIKey', keyInput);
    toast({
      title: 'OpenAI API Key Saved',
      description: 'Your API key has been securely saved in your browser.',
    });
  };


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Profile</CardTitle>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@example.com"
              />
            </div>
          </div>
          <Button>Save Profile</Button>
        </CardContent>
      </Card>

      <Separator />

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI Provider</CardTitle>
          <CardDescription>
            Choose the generative model provider for AI tasks like error diagnosis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <RadioGroup value={provider} onValueChange={handleProviderChange} className="grid md:grid-cols-2 gap-4">
                <Label htmlFor="google-provider" className="flex flex-col gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Google Gemini</span>
                        <RadioGroupItem value="google" id="google-provider" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Uses the default configuration. Requires a Google Gemini API key to be set in the app's environment.
                    </p>
                </Label>
                <Label htmlFor="openai-provider" className="flex flex-col gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">OpenAI</span>
                        <RadioGroupItem value="openai" id="openai-provider" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Uses your personal OpenAI API key. The key is stored securely in your browser's local storage.
                    </p>
                </Label>
            </RadioGroup>

          {provider === 'openai' && (
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <div className="flex gap-2">
                    <Input
                        id="openai-key"
                        type="password"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="sk-..."
                    />
                    <Button onClick={handleSaveKey}>Save Key</Button>
                </div>
              </div>
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Your Key is Safe</AlertTitle>
                <AlertDescription>
                  Your API key is stored only in your browser's local storage. It is never sent to or stored on our servers.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Subscription</CardTitle>
          <CardDescription>
            Manage your subscription and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Current Plan: Pro</p>
              <p className="text-sm text-muted-foreground">
                Your subscription renews on December 31, 2024.
              </p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
