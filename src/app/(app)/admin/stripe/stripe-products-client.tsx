
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, MoreHorizontal, AlertTriangle, Package } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


type Price = {
  id: string;
  unit_amount: number | null;
  currency: string;
  type: 'one_time' | 'recurring';
  recurring: {
    interval: string;
  } | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  default_price: Price | null;
  images: string[];
};

interface StripeProductsClientProps {
  initialProducts: Product[];
}

export function StripeProductsClient({ initialProducts }: StripeProductsClientProps) {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state for new product dialog
    const [newProductName, setNewProductName] = useState('');
    const [newProductDescription, setNewProductDescription] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');

    const handleCreateProduct = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/admin/stripe/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: newProductName, 
                    description: newProductDescription,
                    price: Number(newProductPrice) * 100 // convert to cents
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create product.');
            }

            const newProduct = await response.json();
            setProducts(prev => [newProduct, ...prev]);
            toast({
                title: 'Product Created',
                description: `${newProduct.name} has been added successfully.`,
            });
            setIsDialogOpen(false);
            setNewProductName('');
            setNewProductDescription('');
            setNewProductPrice('');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error creating product',
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const formatPrice = (price: Price | null) => {
        if (!price || price.unit_amount === null) return 'N/A';
        const amount = (price.unit_amount / 100).toFixed(2);
        if (price.type === 'recurring') {
            return `$${amount}/${price.recurring?.interval}`;
        }
        return `$${amount}`;
    }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Package /> Products</CardTitle>
            <CardDescription>
              A list of all products configured in your Stripe account.
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2" />
            Create Product
          </Button>
        </CardHeader>
        <CardContent>
            {initialProducts.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Could not load Stripe products.</h3>
                    <p className="mt-2 text-sm text-muted-foreground">This may be due to an invalid or missing API key. Please check your configuration in the main Admin Dashboard.</p>
                     <Button variant="outline" className="mt-4" asChild>
                        <a href="/admin">Go to Admin Dashboard</a>
                     </Button>
                </div>
            )}
            {initialProducts.length > 0 && (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {product.description}
                        </div>
                        </TableCell>
                        <TableCell>{formatPrice(product.default_price)}</TableCell>
                        <TableCell>
                        <Badge variant={product.active ? 'default' : 'secondary'}>
                            {product.active ? 'Active' : 'Archived'}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="mr-2" /> Edit Product
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
                <DialogDescription>
                    This will create a new product and a corresponding price in your Stripe account.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={newProductName} onChange={e => setNewProductName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input id="description" value={newProductDescription} onChange={e => setNewProductDescription(e.target.value)} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price (USD)</Label>
                    <Input id="price" type="number" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleCreateProduct} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
