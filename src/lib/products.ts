import type { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Pro Laptop X1',
    description: 'The ultimate laptop for professionals. Powerful, sleek, and lightweight.',
    price: 1499.99,
    category: 'Electronics',
    imageId: 'prod1',
  },
  {
    id: '2',
    name: 'SoundWave Headphones',
    description: 'Immersive sound quality with noise-cancellation. All-day comfort.',
    price: 249.99,
    category: 'Electronics',
    imageId: 'prod2',
  },
  {
    id: '3',
    name: 'Connect Smartphone',
    description: 'Stay connected with our latest smartphone. Brilliant display and a pro-grade camera.',
    price: 999.99,
    category: 'Electronics',
    imageId: 'prod3',
  },
  {
    id: '4',
    name: 'The Art of Code',
    description: 'A deep dive into the beauty and structure of software design.',
    price: 49.99,
    category: 'Books',
    imageId: 'prod4',
  },
  {
    id: '5',
    name: 'Timeless Classics Collection',
    description: 'A set of five must-read classic novels in beautiful hardcover editions.',
    price: 129.99,
    category: 'Books',
    imageId: 'prod5',
  },
  {
    id: '6',
    name: 'Galaxy Adventures Comic',
    description: 'The first issue of the epic space saga, Galaxy Adventures. Full color.',
    price: 9.99,
    category: 'Books',
    imageId: 'prod6',
  },
  {
    id: '7',
    name: 'Classic Blue T-Shirt',
    description: 'A high-quality, 100% cotton t-shirt for everyday comfort and style.',
    price: 29.99,
    category: 'Apparel',
    imageId: 'prod7',
  },
  {
    id: '8',
    name: 'Urban Denim Jacket',
    description: 'A timeless denim jacket that adds a touch of cool to any outfit.',
    price: 89.99,
    category: 'Apparel',
    imageId: 'prod8',
  },
  {
    id: '9',
    name: 'City-Trek Sneakers',
    description: 'Comfortable and stylish sneakers perfect for urban exploration.',
    price: 119.99,
    category: 'Apparel',
    imageId: 'prod9',
  },
  {
    id: '10',
    name: 'Minimalist Ceramic Mug',
    description: 'Start your day with a sip from this beautifully crafted ceramic mug.',
    price: 19.99,
    category: 'Home Goods',
    imageId: 'prod10',
  },
  {
    id: '11',
    name: 'Velvet Throw Pillows',
    description: 'Add a touch of elegance to your living space with these soft velvet pillows. Set of two.',
    price: 59.99,
    category: 'Home Goods',
    imageId: 'prod11',
  },
  {
    id: '12',
    name: 'Modern LED Desk Lamp',
    description: 'Illuminate your workspace with this sleek and adjustable LED desk lamp.',
    price: 79.99,
    category: 'Home Goods',
    imageId: 'prod12',
  },
  {
    id: '13',
    name: 'Chrono Smartwatch',
    description: 'Track your fitness and stay connected with the stylish Chrono Smartwatch.',
    price: 349.99,
    category: 'Electronics',
    imageId: 'prod13',
  },
  {
    id: '14',
    name: 'The Dragon\'s Heir',
    description: 'An epic fantasy novel of magic, war, and destiny. A must-read for fans of the genre.',
    price: 24.99,
    category: 'Books',
    imageId: 'prod14',
  },
  {
    id: '15',
    name: 'Cozy Wool Sweater',
    description: 'Stay warm and stylish in this 100% merino wool sweater.',
    price: 99.99,
    category: 'Apparel',
    imageId: 'prod15',
  },
  {
    id: '16',
    name: 'Scented Soy Candle',
    description: 'Create a relaxing ambiance with our lavender and vanilla scented soy candle.',
    price: 24.99,
    category: 'Home Goods',
    imageId: 'prod16',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByIds = (ids: string[]): Product[] => {
  return products.filter((product) => ids.includes(product.id));
}

export const getCategories = (): string[] => {
  return [...new Set(products.map((product) => product.category))];
};
