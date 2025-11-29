'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useAuth } from '@/context/auth-context';
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch, getDocs, type Firestore } from 'firebase/firestore';
import { getProductsByIds } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, firestore } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && firestore) {
      setLoading(true);
      const cartCollectionRef = collection(firestore, 'users', user.uid, 'cart_items');
      
      const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          productId: doc.id,
          ...doc.data()
        }));

        const productIds = items.map(item => item.productId);
        const products = getProductsByIds(productIds);
        
        const populatedCart = items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return { product: product!, quantity: item.quantity };
        }).filter(item => item.product); // Filter out items where product wasn't found

        setCartItems(populatedCart);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching cart:", error);
        toast({ title: 'Error fetching cart', description: 'Could not load your shopping cart.', variant: 'destructive' });
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // User is logged out, clear the cart
      setCartItems([]);
      setLoading(false);
    }
  }, [user, firestore, toast]);
  
  const getCartDocRef = (productId: string) => {
      if (!user || !firestore) return null;
      return doc(firestore, 'users', user.uid, 'cart_items', productId);
  }

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
    if (!user || !firestore) {
      toast({ title: 'Please log in', description: 'You need to be logged in to add items to your cart.', variant: 'destructive'});
      return false;
    }
    const docRef = getCartDocRef(product.id);
    if (!docRef) return false;

    const existingItem = cartItems.find(item => item.product.id === product.id);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
    
    try {
        await setDoc(docRef, { productId: product.id, quantity: newQuantity }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error adding to cart:", error);
        toast({ title: 'Error', description: 'Could not add item to cart.', variant: 'destructive'});
        return false;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    const docRef = getCartDocRef(productId);
    if (!docRef) return;
    
    try {
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error removing from cart:", error);
        toast({ title: 'Error', description: 'Could not remove item from cart.', variant: 'destructive'});
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const docRef = getCartDocRef(productId);
    if (!docRef) return;

    try {
        await setDoc(docRef, { quantity: quantity }, { merge: true });
    } catch (error) {
        console.error("Error updating quantity:", error);
        toast({ title: 'Error', description: 'Could not update item quantity.', variant: 'destructive'});
    }
  };
  
  const clearCart = async () => {
    if (!user || !firestore) return;
    const cartCollectionRef = collection(firestore, 'users', user.uid, 'cart_items');
    try {
        const querySnapshot = await getDocs(cartCollectionRef);
        const batch = writeBatch(firestore);
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        console.error("Error clearing cart:", error);
        toast({ title: 'Error', description: 'Could not clear your cart.', variant: 'destructive'});
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
