/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/ToastContainer';
import { FloatingActions } from './components/FloatingActions';
import { CocoAssistant } from './components/CocoAssistant';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { CustomOrdersPage } from './pages/CustomOrdersPage';
import { PolicyPage } from './components/PolicyPage';
import { NotFoundPage } from './components/NotFoundPage';

const AppContent: React.FC = () => {
  const { route } = useStore();
  const [isCocoOpen, setIsCocoOpen] = useState(false);
  const [isCocoMinimized, setIsCocoMinimized] = useState(false);

  const renderPage = () => {
    switch (route.view) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return (
          <ShopPage
            initialCategory={route.category}
            initialFilter={route.filter}
            initialQuery={route.query}
            initialPrice={route.price}
            initialSort={route.sort}
          />
        );
      case 'product':
        return <ProductDetailPage slug={route.slug} />;
      case 'wishlist':
        return <WishlistPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'custom-orders':
        return <CustomOrdersPage />;
      case 'about':
        return <AboutPage />;
      case 'policy':
        return <PolicyPage policyType={route.policyType} />;
      case 'not-found':
        return <NotFoundPage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF9F2] text-[#4A3531]">
      <Navbar />
      <div className="flex-1">{renderPage()}</div>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <ToastContainer />
      <FloatingActions
        isCocoOpen={isCocoOpen}
        isCocoMinimized={isCocoMinimized}
        onOpenCoco={() => {
          setIsCocoOpen(true);
          setIsCocoMinimized(false);
        }}
      />
      <CocoAssistant
        isOpen={isCocoOpen}
        isMinimized={isCocoMinimized}
        onClose={() => {
          setIsCocoOpen(false);
          setIsCocoMinimized(false);
        }}
        onMinimize={() => setIsCocoMinimized(true)}
        onRestore={() => setIsCocoMinimized(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
