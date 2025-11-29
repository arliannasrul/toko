'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { useBrowsingHistory } from '@/hooks/use-browsing-history';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-product-recommendations';
import { getProductsByIds } from '@/lib/products';
import type { Product } from '@/lib/types';
import { ProductList } from './product-list';
import { Skeleton } from './ui/skeleton';

export function RecommendedProducts({ currentProductId }: { currentProductId?: string }) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();
  const { browsingHistory } = useBrowsingHistory();

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      try {
        const cartProductIds = cartItems.map((item) => item.product.id);
        const result = await getPersonalizedRecommendations({
          browsingHistory: browsingHistory,
          shoppingCartItems: cartProductIds,
        });
        
        // Filter out the current product and duplicates
        const recommendedIds = result.recommendedProducts
          .filter(id => id !== currentProductId)
          .filter((id, index, self) => self.indexOf(id) === index);
        
        const recommendedProducts = getProductsByIds(recommendedIds);
        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch recommendations if there's some user activity
    if (browsingHistory.length > 0 || cartItems.length > 0) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [cartItems, browsingHistory, currentProductId]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Recommended For You</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show the section if there are no recommendations
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Recommended For You</h2>
      <ProductList products={recommendations} />
    </div>
  );
}
