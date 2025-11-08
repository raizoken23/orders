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

export default function SettingsPage() {
  const [provider, setProvider] = useState('google');
  const [openAIKey, setOpenAIKey] = useState('');

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider') || 'google';
    const savedKey = localStorage.getItem('openAIKey') || '';
    setProvider(savedProvider);
    setOpenAIKey(savedKey);
  }, []);

  const handleProviderChange = (isGoogle: boolean) => {
    const newProvider = isGoogle ? 'google' : 'openai';
    setProvider(newProvider);
    localStorage.setItem('aiProvider', newProvider);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setOpenAIKey(newKey);
    localStorage.setItem('openAIKey', newKey);
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
            Choose the generative model provider for AI tasks. The OpenAI key is stored securely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="provider-switch" className={provider === 'openai' ? 'text-muted-foreground' : ''}>
              Google Gemini
            </Label>
            <Switch
              id="provider-switch"
              checked={provider === 'openai'}
              onCheckedChange={() => handleProviderChange(provider === 'google')}
            />
            <Label htmlFor="provider-switch" className={provider === 'google' ? 'text-muted-foreground' : ''}>
              OpenAI
            </Label>
          </div>
          {provider === 'openai' && (
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={openAIKey}
                onChange={handleKeyChange}
                placeholder="Enter your OpenAI API Key"
              />
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
