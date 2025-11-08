
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, Lock, Briefcase, User, Bot, VenetianMask, Mail, ShieldQuestion } from 'lucide-react';

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
          Manage your account, preferences, and application settings.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
           <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6 text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-primary" />
                    Profile
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-4">
                      Update your personal information. This is visible only to you.
                  </p>
                  <div className="space-y-4">
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
                            readOnly
                        />
                        </div>
                    </div>
                    <Button>Save Profile</Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="px-6 text-lg font-semibold">
                  <div className="flex items-center gap-3">
                    <Bot className="size-5 text-primary" />
                    AI Provider
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                    <p className="text-muted-foreground mb-4">
                      Choose the model for AI tasks. This setting is unique to your user account.
                    </p>
                    <div className="space-y-6">
                      <RadioGroup value={provider} onValueChange={handleProviderChange} className="grid md:grid-cols-2 gap-4">
                          <Label htmlFor="google-provider" className="flex flex-col gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-sm">
                              <div className="flex items-center justify-between">
                                  <span className="font-semibold">Google Gemini</span>
                                  <RadioGroupItem value="google" id="google-provider" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                  Uses the default app configuration with a globally available model.
                              </p>
                          </Label>
                          <Label htmlFor="openai-provider" className="flex flex-col gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-sm">
                              <div className="flex items-center justify-between">
                                  <span className="font-semibold">OpenAI</span>
                                  <RadioGroupItem value="openai" id="openai-provider" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                  Uses your personal OpenAI API key, stored securely in your browser.
                              </p>
                          </Label>
                      </RadioGroup>

                      {provider === 'openai' && (
                          <div className="space-y-4 p-4 border rounded-lg bg-card">
                          <div className="space-y-2">
                              <Label htmlFor="openai-key">Your OpenAI API Key</Label>
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
                    </div>
                </AccordionContent>
              </AccordionItem>
              
               <AccordionItem value="item-3">
                <AccordionTrigger className="px-6 text-lg font-semibold">
                   <div className="flex items-center gap-3">
                    <VenetianMask className="size-5 text-primary" />
                    Admin
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-4">
                      Global settings for application integrations. Connect to third-party services.
                  </p>
                  <Button asChild>
                    <Link href="/admin">
                        <Lock className="mr-2" />
                        Go to Admin Integrations Page
                    </Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="px-6 text-lg font-semibold">
                   <div className="flex items-center gap-3">
                    <Mail className="size-5 text-primary" />
                    Newsletter
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                    <p className="text-muted-foreground mb-4">
                      Subscribe to our newsletter to receive updates on new features and best practices.
                    </p>
                     <div className="flex gap-2">
                        <Input placeholder="Enter your email" type="email" />
                        <Button>Subscribe</Button>
                    </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b-0">
                <AccordionTrigger className="px-6 text-lg font-semibold">
                   <div className="flex items-center gap-3">
                    <ShieldQuestion className="size-5 text-primary" />
                    Legal
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-4">
                      Review our legal documents and policies.
                  </p>
                  <div className="space-y-2">
                    <Button variant="link" className="p-0 h-auto" asChild><Link href="/privacy-policy">Privacy Policy</Link></Button>
                    <br/>
                    <Button variant="link" className="p-0 h-auto" asChild><Link href="/terms-of-service">Terms of Service</Link></Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
       <Card>
          <CardHeader>
          <CardTitle className="font-headline">Subscription</CardTitle>
          <CardDescription>
              Manage your current plan and billing details.
          </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
              <p className="font-medium">Current Plan: Beta</p>
              <p className="text-sm text-muted-foreground">
                  Free access during the beta period.
              </p>
              </div>
              <Button variant="outline" disabled>Manage</Button>
          </div>
          </CardContent>
      </Card>
    </div>
  );
}
