'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/lib/products';
import { useCart } from '@/context/cart-context';
import { useBrowsingHistory } from '@/hooks/use-browsing-history';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { placeholderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { RecommendedProducts } from '@/components/recommended-products';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = getProductById(id);

  const { addToCart } = useCart();
  const { addProductToHistory } = useBrowsingHistory();

  useEffect(() => {
    if (product) {
      addProductToHistory(product.id);
    }
  }, [product, addProductToHistory]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist.</p>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product);
    toast({
        title: "Added to cart",
        description: `${product.name} has been successfully added to your cart.`,
    });
  };

  const image = placeholderImages.find((img) => img.id === product.imageId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          {image && (
            <Image
              src={image.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              data-ai-hint={image.imageHint}
              priority
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-headline">{product.name}</h1>
          <p className="text-2xl font-bold text-primary my-4">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <Button size="lg" className="mt-6" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
      <Separator className="my-12" />
      <RecommendedProducts currentProductId={product.id} />
    </div>
  );
}
