import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';

/**
 * CheckoutModal is retired in favor of the dedicated standalone CheckoutPage (/checkout).
 * If any trigger calls setIsCheckoutOpen(true), this component immediately routes to /checkout.
 */
export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    navigateToCheckout
  } = useStore();

  useEffect(() => {
    if (isCheckoutOpen) {
      if (navigateToCheckout) {
        navigateToCheckout();
      } else if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/checkout');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      setIsCheckoutOpen(false);
    }
  }, [isCheckoutOpen, navigateToCheckout, setIsCheckoutOpen]);

  // Permanently disabled in favor of dedicated standalone checkout page
  return null;
};
