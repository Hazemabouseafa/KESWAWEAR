import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle, ShieldCheck, MapPin, Phone, User, Truck, CreditCard } from 'lucide-react';
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

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    shippingCost, 
    cartTotal, 
    createOrder,
    language,
    t
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

  const currency = t('actions.egp');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert(language === 'ar' ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder(formData);
      setCompletedOrder(order);
      setSubmitting(false);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 600);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0e0e12] border border-white/20 rounded-sm shadow-2xl overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-900">
          <div>
            <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
              {completedOrder ? t('checkout.orderSuccessTitle') : t('checkout.title')}
            </h3>
            <p className="text-xs font-sans text-gray-400 mt-0.5">
              {completedOrder ? t('checkout.orderSuccessDesc') : t('checkout.subtitle')}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle size={36} />
            </div>

            <div>
              <h4 className="text-2xl font-black font-display uppercase text-white mb-2">
                {t('checkout.orderNumber')} #{completedOrder.id}
              </h4>
              <p className="text-sm text-gray-300 max-w-md mx-auto font-sans">
                {language === 'ar' ? (
                  <>تم استلام طلبك بنجاح، <strong className="text-white">{completedOrder.customer.name}</strong>. سنتواصل معك هاتفياً على <strong className="text-white">{completedOrder.customer.phone}</strong> لتأكيد الشحن.</>
                ) : (
                  <>Order received, <strong className="text-white">{completedOrder.customer.name}</strong>. We will call you on <strong className="text-white">{completedOrder.customer.phone}</strong> before dispatching.</>
                )}
              </p>
            </div>

            <div className="bg-neutral-900 border border-white/10 p-5 rounded text-left rtl:text-right max-w-md mx-auto space-y-2 text-xs font-sans">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">{t('checkout.deliveryAddress')}:</span>
                <span className="text-white font-bold">{completedOrder.customer.address}, {completedOrder.customer.city}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">{t('checkout.payment')}:</span>
                <span className="text-white font-bold">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span className="text-gray-300 font-bold">{t('checkout.totalPaid')}:</span>
                <span className="text-emerald-400 font-black text-base font-mono">{completedOrder.total} {currency}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="bg-white hover:bg-neutral-200 text-black font-black text-xs tracking-wider uppercase px-8 py-3.5 transition-all shadow-xl font-sans"
            >
              {t('actions.continueShopping')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2 font-sans">
                <User size={14} className="text-white" />
                <span>{t('checkout.customerInfo')}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-sans text-gray-400 mb-1">
                    {t('checkout.fullName')}
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder={t('checkout.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded-none outline-none focus:border-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans text-gray-400 mb-1">
                    {t('checkout.phone')}
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder={t('checkout.phonePlaceholder')}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded-none outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-sans text-gray-400 mb-1">
                    {t('checkout.governorate')}
                  </label>
                  <select 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded-none outline-none focus:border-white font-sans"
                  >
                    {EGYPT_GOVERNORATES.map(gov => (
                      <option key={gov.en} value={gov.en}>
                        {language === 'ar' ? `${gov.ar} (${gov.en})` : `${gov.en} - ${gov.ar}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-sans text-gray-400 mb-1">
                    {t('checkout.address')}
                  </label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    placeholder={t('checkout.addressPlaceholder')}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded-none outline-none focus:border-white font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans text-gray-400 mb-1">
                  {t('checkout.notes')}
                </label>
                <input 
                  type="text" 
                  name="notes"
                  placeholder={t('checkout.notesPlaceholder')}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded-none outline-none focus:border-white font-sans"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2 font-sans">
                <Truck size={14} className="text-white" />
                <span>{t('checkout.paymentMethod')}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-center gap-3 p-3 border rounded-none cursor-pointer transition-all ${
                  formData.paymentMethod === 'Cash on Delivery (COD)' 
                    ? 'border-white bg-neutral-800' 
                    : 'border-white/10 bg-neutral-900 opacity-60'
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Cash on Delivery (COD)"
                    checked={formData.paymentMethod === 'Cash on Delivery (COD)'}
                    onChange={handleChange}
                    className="accent-white"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white font-sans">{t('checkout.cod')}</span>
                    <span className="block text-[10px] text-gray-400 font-sans">{t('checkout.codDesc')}</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 border rounded-none cursor-pointer transition-all ${
                  formData.paymentMethod === 'Card Online' 
                    ? 'border-white bg-neutral-800' 
                    : 'border-white/10 bg-neutral-900 opacity-60'
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Card Online"
                    checked={formData.paymentMethod === 'Card Online'}
                    onChange={handleChange}
                    className="accent-white"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white font-sans">{t('checkout.card')}</span>
                    <span className="block text-[10px] text-gray-400 font-sans">{t('checkout.cardDesc')}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-neutral-900/80 border border-white/10 p-4 rounded-none space-y-2 font-sans">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{t('cart.subtotal')} ({cart.length}):</span>
                <span className="text-white font-bold font-mono">{cartSubtotal} {currency}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{t('cart.shipping')}:</span>
                <span className="text-white font-bold font-mono">
                  {shippingCost === 0 ? <span className="text-emerald-400">{t('actions.freeShipping')}</span> : `${shippingCost} ${currency}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-2">
                <span>{t('cart.total')}:</span>
                <span className="font-mono text-emerald-400 text-lg">{cartTotal} {currency}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="w-full bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-black text-xs tracking-wider uppercase py-4 transition-all shadow-xl flex items-center justify-center gap-2 font-sans"
            >
              <ShieldCheck size={16} />
              <span>{submitting ? t('checkout.confirming') : t('checkout.placeOrder')}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
