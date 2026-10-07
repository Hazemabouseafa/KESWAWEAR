import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle, ShieldCheck, MapPin, Phone, User, Truck, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

const EGYPT_GOVERNORATES = [
  "Alexandria", "Cairo", "Giza", "Dakahlia", "Red Sea", "Beheira", "Fayoum", 
  "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Suez", 
  "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai", 
  "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
];

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    shippingCost, 
    cartTotal, 
    siteContent,
    createOrder 
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

  const currency = siteContent.general?.currency || 'EGP';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder(formData);
      setCompletedOrder(order);
      setSubmitting(false);

      // Trigger Confetti Celebration!
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
              {completedOrder ? "ORDER CONFIRMED 🎉" : "CHECKOUT • إتمام الطلب"}
            </h3>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              {completedOrder ? "Thank you for shopping with KESWA" : "Fast delivery across all governorates of Egypt"}
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
                ORDER #{completedOrder.id} PLACED!
              </h4>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                We have received your order, <strong className="text-white">{completedOrder.customer.name}</strong>. Our team will contact you on <strong className="text-white">{completedOrder.customer.phone}</strong> before dispatching.
              </p>
            </div>

            <div className="bg-neutral-900 border border-white/10 p-5 rounded text-left max-w-md mx-auto space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Delivery Address:</span>
                <span className="text-white font-bold">{completedOrder.customer.address}, {completedOrder.customer.city}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Payment:</span>
                <span className="text-white font-bold">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span className="text-gray-300 font-bold">Total Amount:</span>
                <span className="text-emerald-400 font-black text-base">{completedOrder.total} {currency}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="bg-white hover:bg-neutral-200 text-black font-black text-xs tracking-widest uppercase px-8 py-3.5 transition-all shadow-xl"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <User size={14} className="text-white" />
                <span>CUSTOMER INFORMATION • بيانات العميل</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Full Name / الاسم بالكامل *
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="e.g. Hazem M."
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded-none outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Phone Number / رقم الهاتف *
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="010 / 011 / 012 / 015..."
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded-none outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Governorate / المحافظة *
                  </label>
                  <select 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded-none outline-none focus:border-white"
                  >
                    {EGYPT_GOVERNORATES.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                    Detailed Address / العنوان بالتفصيل *
                  </label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    placeholder="Street, Building No, Apartment..."
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded-none outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                  Order Notes / ملاحظات خاصة (اختياري)
                </label>
                <input 
                  type="text" 
                  name="notes"
                  placeholder="e.g. Please call before arriving"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded-none outline-none focus:border-white"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Truck size={14} className="text-white" />
                <span>PAYMENT METHOD • طريقة الدفع</span>
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
                    <span className="block text-xs font-bold text-white uppercase">Cash On Delivery</span>
                    <span className="block text-[10px] text-gray-400 font-mono">الدفع نقدًا عند الاستلام</span>
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
                    <span className="block text-xs font-bold text-white uppercase">Credit / Debit Card</span>
                    <span className="block text-[10px] text-gray-400 font-mono">فيزا / ماستركارد (تجريبي)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-neutral-900/80 border border-white/10 p-4 rounded-none space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>Items Subtotal ({cart.length} items):</span>
                <span className="text-white font-bold">{cartSubtotal} {currency}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>Delivery Shipping:</span>
                <span className="text-white font-bold">
                  {shippingCost === 0 ? <span className="text-emerald-400">FREE</span> : `${shippingCost} ${currency}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-2">
                <span>Total Due:</span>
                <span className="font-mono text-emerald-400 text-lg">{cartTotal} {currency}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="w-full bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-black text-xs tracking-[0.25em] uppercase py-4 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>{submitting ? "CONFIRMING ORDER..." : "PLACE ORDER NOW • تأكيد الطلب"}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
