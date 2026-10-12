import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';

/**
 * QuickViewModal is retired in favor of the dedicated standalone ProductPage (/product/:id).
 * If any trigger calls setQuickViewProduct, this component immediately routes to the standalone page.
 */
export const QuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    navigateToProduct
  } = useStore();

  useEffect(() => {
    if (quickViewProduct) {
      if (navigateToProduct) {
        navigateToProduct(quickViewProduct.id);
      }
      setQuickViewProduct(null);
    }
  }, [quickViewProduct, navigateToProduct, setQuickViewProduct]);

  return null;
};
