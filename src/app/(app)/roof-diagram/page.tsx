'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Ruler,
  AreaChart,
  TrendingUp,
  MousePointerSquareDashed,
  X,
  Circle,
  Wind,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

const stats = [
  {
    name: 'Total Surface Area',
    value: '2,450 sq ft',
    icon: AreaChart,
  },
  {
    name: 'Primary Slope',
    value: '6/12',
    icon: TrendingUp,
  },
  {
    name: 'Total Ridges & Hips',
    value: '180 ft',
    icon: Ruler,
  },
];

const keyItems = [
  { id: 'X', label: 'Wind Damage', icon: Wind },
  { id: 'B', label: 'Blistering', icon: Circle },
  { id: 'M', label: 'Mechanical Damage', icon: X },
  { id: 'TS', label: 'Test Square', icon: Plus },
];

type PlacedItem = {
  id: string;
  x: number;
  y: number;
  type: string;
};

export default function RoofDiagramPage() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);

  const handleDiagramClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!selectedKey) return;

    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const newItem: PlacedItem = {
      id: `${selectedKey}-${Date.now()}`,
      x: cursorPoint.x,
      y: cursorPoint.y,
      type: selectedKey,
    };

    setPlacedItems([...placedItems, newItem]);
  };
  
  const renderItemOnDiagram = (item: PlacedItem) => {
    const props = {
      x: item.x - 8,
      y: item.y - 8,
      width: 16,
      height: 16,
      className: "text-destructive",
      strokeWidth: 2
    }
    switch (item.type) {
      case 'X':
        return <Wind {...props} />;
      case 'B':
        return <Circle {...props} fill="currentColor" />;
      case 'M':
        return <X {...props} />;
      case 'TS':
        return <Plus {...props} className="text-blue-500" />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Roof Diagram Tool
        </h1>
        <p className="text-muted-foreground">
          Select an item from the key and click on the diagram to place it.
        </p>
      </div>

      <div className="grid flex-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Diagram</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <MousePointerSquareDashed className="size-4" />
              Current mode: {selectedKey ? `Placing '${selectedKey}'` : 'Viewing'}
            </CardDescription>
          </CardHeader>
          <CardContent
            className={cn(
              'flex items-center justify-center h-[500px] bg-muted/50 rounded-lg border-2 border-dashed',
              selectedKey ? 'cursor-crosshair' : 'cursor-default'
            )}
          >
            <svg
              className="w-full h-full text-muted-foreground/50"
              viewBox="0 0 400 300"
              onClick={handleDiagramClick}
            >
              {/* Static background diagram */}
              <polygon points="200,50 50,150 350,150" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="4" />
              <polygon points="50,150 50,250 200,300 200,200" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="4" />
              <polygon points="350,150 350,250 200,300 200,200" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="150" x2="200" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="2" />
              <line x1="350" y1="150" x2="200" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="2" />
              <line x1="200" y1="50" x2="200" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="2" />
              <text
                x="200"
                y="175"
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                className="font-sans pointer-events-none"
              >
                Interactive Drawing Area
              </text>
              
              {/* Render placed items */}
              {placedItems.map(item => (
                  <g key={item.id}>
                    {renderItemOnDiagram(item)}
                  </g>
              ))}
            </svg>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline">Statistics</CardTitle>
                <CardDescription>
                    Calculated measurements from the diagram.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-6">
                {stats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                    <div className="flex items-center gap-3">
                        <stat.icon className="size-5 text-accent" />
                        <h3 className="font-medium">{stat.name}</h3>
                    </div>
                    <p className="text-2xl font-bold ml-8">{stat.value}</p>
                    {index < stats.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Damage Key</CardTitle>
                     <CardDescription>
                        Select an item to place on the diagram.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ToggleGroup 
                        type="single"
                        value={selectedKey || ''}
                        onValueChange={(value) => setSelectedKey(value || null)}
                        className="grid grid-cols-2 gap-2"
                    >
                        {keyItems.map(item => (
                            <ToggleGroupItem key={item.id} value={item.id} aria-label={`Select ${item.label}`} className="flex flex-col h-auto p-2 gap-1">
                                <item.icon className="size-5" />
                                <span className="text-xs">{item.label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => setPlacedItems([])}
                        disabled={placedItems.length === 0}
                    >
                       <Trash2 className="mr-2" />
                        Clear All Items
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
