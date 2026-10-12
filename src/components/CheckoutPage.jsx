import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle, ShieldCheck, MapPin, Phone, User, Truck, 
  CreditCard, ArrowRight, ArrowLeft, ShoppingBag, 
  MessageCircle, Clock, ChevronRight, PackageCheck, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const EGYPT_GOVERNORATES = [
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Dakahlia", ar: "الدقهلية" },
  { en: "Red Sea", ar: "البحر الأحمر" },
  { en: "Beheira", ar: "البحيرة" },
  { en: "Fayoum", ar: "الفيوم" },
  { en: "Gharbia", ar: "الغربية" },
  { en: "Ismailia", ar: "الإسماعيلية" },
  { en: "Monufia", ar: "المنوفية" },
  { en: "Minya", ar: "المنيا" },
  { en: "Qalyubia", ar: "القليوبية" },
  { en: "New Valley", ar: "الوادي الجديد" },
  { en: "Suez", ar: "السويس" },
  { en: "Aswan", ar: "أسوان" },
  { en: "Assiut", ar: "أسيوط" },
  { en: "Beni Suef", ar: "بني سويف" },
  { en: "Port Said", ar: "بورسعيد" },
  { en: "Damietta", ar: "دمياط" },
  { en: "Sharkia", ar: "الشرقية" },
  { en: "South Sinai", ar: "جنوب سيناء" },
  { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { en: "Matrouh", ar: "مطروح" },
  { en: "Luxor", ar: "الأقصر" },
  { en: "Qena", ar: "قنا" },
  { en: "North Sinai", ar: "شمال سيناء" },
  { en: "Sohag", ar: "سوهاج" }
];

export const CheckoutPage = ({ onBackToStore }) => {
  const { 
    cart, 
    cartSubtotal, 
    shippingCost, 
    cartTotal, 
    createOrder,
    siteContent,
    language,
    t,
    navigateToHome,
    navigateToProduct,
    getLocalized,
    products
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Alexandria',
    address: '',
    notes: '',
    paymentMethod: 'Cash on Delivery (COD)'
  });

  const [completedOrder, setCompletedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currency = t('actions.egp');
  const storeSettings = siteContent?.storeSettings || {};
  const whatsappSettings = siteContent?.whatsapp || siteContent?.socialMedia?.whatsapp || siteContent?.footer || {};

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [completedOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleReturn = () => {
    if (onBackToStore) {
      onBackToStore();
    } else if (navigateToHome) {
      navigateToHome();
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage(language === 'ar' ? "يرجى استكمال جميع بيانات الشحن الإلزامية." : "Please fill in all required shipping fields.");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(language === 'ar' ? "سلة المشتريات فارغة." : "Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      try {
        const order = createOrder(formData);
        setCompletedOrder(order);
        setSubmitting(false);

        try {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.5 }
          });
        } catch (err) {}
      } catch (err) {
        setSubmitting(false);
        setErrorMessage(language === 'ar' ? "حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى." : "Error placing order, please try again.");
      }
    }, 500);
  };

  // WhatsApp Order Confirmation Link
  const getWhatsAppOrderUrl = () => {
    if (!completedOrder) return '';
    const rawPhone = whatsappSettings.phone || whatsappSettings.phoneNumber || siteContent?.footer?.whatsapp || '01023456789';
    const phone = rawPhone.replace(/[^0-9]/g, '') || '201023456789';
    const itemsText = (completedOrder.items || [])
      .map(item => `• ${item.name || item.name_ar || 'منتج'} (${item.size || ''} ${typeof item.color === 'string' ? item.color : item.color?.name_ar || ''}) x${item.quantity}`)
      .join('\n');

    const msg = `مرحباً KESWA WEAR 👋\nأود تأكيد طلبي رقم #${completedOrder.id}\n\nالاسم: ${completedOrder.customer.name}\nالهاتف: ${completedOrder.customer.phone}\nالمحافظة: ${completedOrder.customer.city}\nالعنوان: ${completedOrder.customer.address}\n\nالمنتجات:\n${itemsText}\n\nالإجمالي المطلوب: ${completedOrder.total} ج.م\nطريقة الدفع: ${completedOrder.paymentMethod}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  // =========================================================================
  // VIEW A: ORDER COMPLETED CONFIRMATION SCREEN
  // =========================================================================
  if (completedOrder) {
    return (
      <div className="min-h-[80vh] bg-[#f8f7f4] py-8 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="bg-white border border-[#e6e4dc] rounded-sm p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
            
            {/* Success Icon & Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-scaleIn">
                <CheckCircle size={38} className="stroke-[2.5]" />
              </div>
              
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block font-bold">
                {language === 'ar' ? 'تم استلام وتأكيد الطلب بنجاح' : 'ORDER CONFIRMED SUCCESSFULLY'}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-black">
                {t('checkout.orderSuccessTitle')}
              </h1>

              <div className="bg-[#f8f7f4] border border-[#e6e4dc] inline-block px-4 py-1.5 rounded-sm">
                <span className="text-xs font-mono text-neutral-500 block">{language === 'ar' ? 'رقم الطلب الخاص بك:' : 'Order ID:'}</span>
                <span className="text-lg sm:text-xl font-mono font-black text-black">#{completedOrder.id}</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto font-sans leading-relaxed pt-1">
                {language === 'ar' ? (
                  <>شكراً لتسوقك من <strong>KESWA WEAR</strong>، أ/ <strong className="text-black">{completedOrder.customer.name}</strong>. سنتواصل معك هاتفياً على الرقم <strong className="text-black font-mono">{completedOrder.customer.phone}</strong> لتأكيد الشحن والتسليم.</>
                ) : (
                  <>Thank you for shopping at <strong>KESWA WEAR</strong>, <strong className="text-black">{completedOrder.customer.name}</strong>. We will call you on <strong className="text-black font-mono">{completedOrder.customer.phone}</strong> to confirm dispatch.</>
                )}
              </p>
            </div>

            {/* Order Details Receipt Card */}
            <div className="bg-[#faf9f5] border border-[#e6e4dc] rounded-sm p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b border-[#e6e4dc] pb-2.5 flex items-center gap-2">
                <PackageCheck size={16} className="text-neutral-700" />
                <span>{language === 'ar' ? 'ملخص الفاتورة والشحن' : 'Invoice & Shipping Summary'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="text-neutral-500 block mb-0.5">{t('checkout.deliveryAddress')}:</span>
                  <p className="font-bold text-black">{completedOrder.customer.address}, {completedOrder.customer.city}</p>
                </div>

                <div>
                  <span className="text-neutral-500 block mb-0.5">{t('checkout.payment')}:</span>
                  <p className="font-bold text-black">{completedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="pt-3 border-t border-[#e6e4dc] space-y-2">
                <span className="text-[11px] font-mono text-neutral-500 uppercase block font-bold">
                  {language === 'ar' ? 'المنتجات المطلوبة:' : 'Ordered Items:'}
                </span>
                <div className="divide-y divide-[#eceae3]">
                  {(completedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-mono font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <div>
                          <span className="font-bold text-black">{item.name || item.name_ar || 'منتج'}</span>
                          {(item.size || item.color) && (
                            <span className="text-neutral-500 text-[11px] block font-mono">
                              {[item.size && `مقاس ${item.size}`, typeof item.color === 'string' ? item.color : item.color?.name_ar || item.color?.name_en].filter(Boolean).join(' • ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-black">{(Number(item.price) || 0) * (Number(item.quantity) || 1)} {currency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between">
                <span className="font-bold text-black text-sm">{t('checkout.totalPaid')}:</span>
                <span className="font-mono font-black text-xl text-black">{completedOrder.total} {currency}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3 pt-2">
              {whatsappSettings.enabled !== false && (
                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-4 rounded-sm flex items-center justify-center gap-2 transition-all shadow-md touch-manipulation"
                >
                  <MessageCircle size={18} />
                  <span>{language === 'ar' ? 'تأكيد واستفسار عن الطلب عبر واتساب فوراً' : 'Confirm & Inquire via WhatsApp'}</span>
                </a>
              )}

              <button
                onClick={handleReturn}
                className="w-full bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider py-4 rounded-sm flex items-center justify-center gap-2 transition-all shadow-md touch-manipulation"
              >
                <span>{t('actions.continueShopping')}</span>
                {language === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: EMPTY CART SCREEN
  // =========================================================================
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f8f7f4] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#e6e4dc] rounded-sm p-8 text-center space-y-5 shadow-lg animate-fadeIn">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black font-display uppercase tracking-tight text-black">
              {language === 'ar' ? 'سلة المشتريات فارغة' : 'Your Cart is Empty'}
            </h2>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              {language === 'ar' 
                ? 'لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد. تصفح تشكيلة أزياء كِسوة الحصرية واختر ما يناسبك.' 
                : 'You have not added any products to your cart yet. Explore KESWA WEAR collection.'}
            </p>
          </div>

          <button
            onClick={handleReturn}
            className="w-full bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-sm transition-all shadow-md"
          >
            {language === 'ar' ? '← تصفح المنتجات والعودة للمتجر' : '← Browse Store Products'}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW C: DEDICATED FULL CHECKOUT PAGE (No Popup / No Modal)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900 font-sans pb-16">
      
      {/* 1. Header / Breadcrumbs */}
      <div className="border-b border-[#e6e4dc] bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          
          <button
            onClick={handleReturn}
            className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1.5 transition-colors touch-manipulation"
          >
            {language === 'ar' ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              KESWA WEAR
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-black uppercase text-black font-display">
              {t('checkout.title')}
            </span>
          </div>

          {/* Secure Checkout Badge */}
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded text-[10px] font-bold">
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">{language === 'ar' ? 'شراء آمن 100%' : '100% Secure Checkout'}</span>
          </div>

        </div>
      </div>

      {/* 2. Main Checkout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-4 text-xs font-sans">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-5 h-5 rounded-full bg-neutral-200 text-black text-[10px] font-bold flex items-center justify-center">1</span>
            <span>{t('cart.title')}</span>
          </div>
          <ChevronRight size={14} className="text-neutral-300 rtl:rotate-180" />
          <div className="flex items-center gap-1.5 text-black font-bold">
            <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">2</span>
            <span>{t('checkout.customerInfo')} والشحن</span>
          </div>
          <ChevronRight size={14} className="text-neutral-300 rtl:rotate-180" />
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 text-[10px] font-bold flex items-center justify-center">3</span>
            <span>تأكيد الطلب</span>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 max-w-4xl mx-auto bg-rose-50 border border-rose-300 text-rose-800 p-3.5 rounded text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* LEFT/MAIN: Checkout Form (Cols 1-7 in LTR, Right in RTL) */}
          <div className="lg:col-span-7 space-y-6">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Card 1: Customer Contact Info */}
              <div className="bg-white border border-[#e6e4dc] p-5 sm:p-7 rounded-sm shadow-sm space-y-4">
                <div className="border-b border-[#eceae3] pb-3 flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-black uppercase text-black flex items-center gap-2">
                    <User size={18} className="text-neutral-800" />
                    <span>{t('checkout.customerInfo')}</span>
                  </h2>
                  <span className="text-[11px] text-neutral-500 font-sans">* حقول إلزامية للتوصيل</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      {t('checkout.fullName')} *
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder={language === 'ar' ? 'الاسم ثلاثي (مثال: أحمد محمد علي)' : 'Full name'}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#faf9f5] border border-[#d6d4cb] focus:border-black px-3.5 py-3 text-xs text-black rounded-none outline-none font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      {t('checkout.phone')} *
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="01012345678"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#faf9f5] border border-[#d6d4cb] focus:border-black px-3.5 py-3 text-xs text-black rounded-none outline-none font-mono transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Delivery & Address Info */}
              <div className="bg-white border border-[#e6e4dc] p-5 sm:p-7 rounded-sm shadow-sm space-y-4">
                <div className="border-b border-[#eceae3] pb-3">
                  <h2 className="text-sm sm:text-base font-black uppercase text-black flex items-center gap-2">
                    <MapPin size={18} className="text-neutral-800" />
                    <span>{t('checkout.deliveryAddress')} والشحن</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      {t('checkout.governorate')} *
                    </label>
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#faf9f5] border border-[#d6d4cb] focus:border-black px-3.5 py-3 text-xs text-black rounded-none outline-none font-sans transition-colors"
                    >
                      {EGYPT_GOVERNORATES.map(gov => (
                        <option key={gov.en} value={gov.en}>
                          {language === 'ar' ? `${gov.ar} (${gov.en})` : `${gov.en} - ${gov.ar}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      {t('checkout.address')} بالتفصيل *
                    </label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      placeholder={language === 'ar' ? 'المنطقة، الشارع، رقم العمارة والشقة...' : 'Street address, building, floor...'}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-[#faf9f5] border border-[#d6d4cb] focus:border-black px-3.5 py-3 text-xs text-black rounded-none outline-none font-sans transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    {t('checkout.notes')} (اختياري)
                  </label>
                  <input 
                    type="text" 
                    name="notes"
                    placeholder={language === 'ar' ? 'أي تعليمات خاصة للمندوب أو ميعاد التسليم المفضل...' : 'Special delivery instructions...'}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full bg-[#faf9f5] border border-[#d6d4cb] focus:border-black px-3.5 py-2.5 text-xs text-black rounded-none outline-none font-sans transition-colors"
                  />
                </div>
              </div>

              {/* Card 3: Payment Method */}
              <div className="bg-white border border-[#e6e4dc] p-5 sm:p-7 rounded-sm shadow-sm space-y-4">
                <div className="border-b border-[#eceae3] pb-3">
                  <h2 className="text-sm sm:text-base font-black uppercase text-black flex items-center gap-2">
                    <Truck size={18} className="text-neutral-800" />
                    <span>{t('checkout.paymentMethod')}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className={`flex items-start gap-3 p-4 border rounded-none cursor-pointer transition-all ${
                    formData.paymentMethod === 'Cash on Delivery (COD)' 
                      ? 'border-black bg-[#faf9f5] shadow-sm' 
                      : 'border-[#e6e4dc] hover:border-neutral-400 bg-white opacity-70'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Cash on Delivery (COD)"
                      checked={formData.paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={handleChange}
                      className="accent-black mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="block text-xs font-black text-black font-sans">{t('checkout.cod')}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {language === 'ar' ? 'مفضل وآمن' : 'Recommended'}
                        </span>
                      </div>
                      <span className="block text-[11px] text-neutral-500 font-sans mt-0.5">{t('checkout.codDesc')}</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border rounded-none cursor-pointer transition-all ${
                    formData.paymentMethod === 'Card Online' 
                      ? 'border-black bg-[#faf9f5] shadow-sm' 
                      : 'border-[#e6e4dc] hover:border-neutral-400 bg-white opacity-70'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Card Online"
                      checked={formData.paymentMethod === 'Card Online'}
                      onChange={handleChange}
                      className="accent-black mt-1"
                    />
                    <div>
                      <span className="block text-xs font-black text-black font-sans">{t('checkout.card')}</span>
                      <span className="block text-[11px] text-neutral-500 font-sans mt-0.5">{t('checkout.cardDesc')}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card 4: Assurance & Guarantees */}
              <div className="bg-[#f0eee6] border border-[#dedcd4] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-700 font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                  <span>{language === 'ar' ? 'معاينة وفحص المنتج قبل الاستلام والدفع' : 'Inspect product before paying'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-neutral-700 shrink-0" />
                  <span>{language === 'ar' ? 'توصيل سريع لجميع المحافظات خلال 48-72 ساعة' : 'Fast delivery 48-72h'}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || cart.length === 0}
                className="w-full bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider py-4 sm:py-5 transition-all shadow-xl flex items-center justify-center gap-2 font-sans touch-manipulation"
              >
                <ShieldCheck size={18} />
                <span>
                  {submitting 
                    ? t('checkout.confirming') 
                    : language === 'ar' 
                      ? `تأكيد وإتمام الطلب الآن (${cartTotal} ${currency})`
                      : `${t('checkout.placeOrder')} (${cartTotal} ${currency})`}
                </span>
              </button>

            </form>

          </div>

          {/* RIGHT/SIDEBAR: Order Summary (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            
            <div className="bg-white border border-[#e6e4dc] p-5 sm:p-6 rounded-sm shadow-sm space-y-4">
              <div className="border-b border-[#eceae3] pb-3 flex items-center justify-between">
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-black">
                  {language === 'ar' ? 'سلة المشتريات' : 'Order Items'} ({cart.length})
                </h3>
                <span className="text-xs font-mono text-neutral-500 font-bold">
                  {cartSubtotal} {currency}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#eceae3] max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 1;
                  const prod = products?.find(p => p.id === item.id);
                  const colorObj = item.color ? prod?.colors?.find(c => {
                    const cName = getLocalized(c, 'name');
                    return cName === item.color || c.name === item.color || c.name_ar === item.color || c.name_en === item.color;
                  }) : null;
                  const itemImg = item.image || colorObj?.images?.[0] || prod?.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop';
                  return (
                    <div key={item.cartItemId || item.id} className="py-3 flex items-center gap-3">
                      <img 
                        src={itemImg} 
                        alt={item.name || 'منتج'}
                        className="w-14 h-18 object-cover rounded-none border border-[#e6e4dc] bg-[#faf9f5] shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-black truncate">{item.name || item.name_ar || item.name_en}</h4>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          {[item.size && `مقاس ${item.size}`, typeof item.color === 'string' ? item.color : item.color?.name_ar || item.color?.name_en].filter(Boolean).join(' • ')}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[11px] text-neutral-600 font-sans">الكمية: {itemQty}</span>
                          <span className="text-xs font-mono font-bold text-black">{itemPrice * itemQty} {currency}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[#eceae3] pt-4 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-neutral-600">
                  <span>{t('cart.subtotal')}:</span>
                  <span className="font-mono font-bold text-black">{cartSubtotal} {currency}</span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>{t('cart.shipping')}:</span>
                  <span className="font-mono font-bold">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {t('actions.freeShipping')}
                      </span>
                    ) : (
                      <span className="text-black">{shippingCost} {currency}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-black border-t-2 border-black/10 pt-3">
                  <span>{t('cart.total')}:</span>
                  <span className="font-mono text-xl text-black">{cartTotal} {currency}</span>
                </div>
              </div>

            </div>

            {/* Support Box */}
            <div className="bg-[#faf9f5] border border-[#e6e4dc] p-4 text-xs font-sans text-neutral-600 space-y-2">
              <span className="font-bold text-black block">هل تحتاج مساعدة في إتمام الطلب؟</span>
              <p className="text-[11px] leading-relaxed">
                فريق خدمة العملاء متواجد للمساعدة وتأكيد مقاسك واختيار الأنسب لك فوراً.
              </p>
              {whatsappSettings.enabled !== false && (() => {
                const rawPhone = whatsappSettings.phone || whatsappSettings.phoneNumber || siteContent?.footer?.whatsapp || '01023456789';
                const supportPhone = rawPhone.replace(/[^0-9]/g, '') || '201023456789';
                return (
                  <a
                    href={`https://wa.me/${supportPhone}?text=${encodeURIComponent('مرحباً KESWA WEAR، أحتاج مساعدة في إتمام الشراء.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold underline pt-1"
                  >
                    <MessageCircle size={14} />
                    <span>تواصل مع الدعم الفني عبر واتساب</span>
                  </a>
                );
              })()}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
