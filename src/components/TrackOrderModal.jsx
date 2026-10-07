import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { InvoiceModal } from './InvoiceModal';
import { 
  X, Search, ShoppingBag, Clock, CheckCircle2, 
  Truck, PackageCheck, Printer, MessageSquare, Phone
} from 'lucide-react';

export const TrackOrderModal = () => {
  const { 
    isTrackOrderOpen, 
    setIsTrackOrderOpen, 
    orders, 
    language, 
    t 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  if (!isTrackOrderOpen) return null;

  // Search orders by query, or display all recent orders if query is empty
  const matchingOrders = orders.filter(o => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    const matchId = (o.id || '').toLowerCase().includes(q);
    const matchPhone = String(o.customer?.phone || '').includes(q);
    const matchName = (o.customer?.name || '').toLowerCase().includes(q);
    return matchId || matchPhone || matchName;
  });

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return language === 'ar' ? 'قيد المراجعة' : 'Pending Review';
      case 'Processing': return language === 'ar' ? 'جاري التجهيز والتعقيم' : 'Processing & Packing';
      case 'Shipped': return language === 'ar' ? 'في طريق الشحن والتوصيل' : 'Out for Delivery';
      case 'Delivered': return language === 'ar' ? 'تم التوصيل بنجاح' : 'Delivered';
      case 'Cancelled': return language === 'ar' ? 'تم إلغاء الطلب' : 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-[#121217] border border-white/15 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans text-right">
        
        {/* Header */}
        <div className="bg-[#181822] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-black rounded shadow">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {language === 'ar' ? 'تتبع الطلبات والشحنات • KESWA' : 'Track Your Orders • KESWA'}
              </h2>
              <p className="text-[11px] text-gray-400">
                {language === 'ar' ? 'ابحث برقم الهاتف أو رقم الطلب لمتابعة حالة شحنتك' : 'Search by phone number or order ID'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackOrderOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-white/10 bg-[#14141c] shrink-0">
          <div className="relative">
            <Search size={16} className="absolute top-3.5 right-3.5 text-gray-400" />
            <input 
              type="text"
              placeholder={language === 'ar' ? 'أدخل رقم الهاتف أو رقم الطلب (مثال: 010... أو KSW-...)' : 'Enter phone number or order number...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 pr-10 pl-4 py-2.5 text-xs text-white rounded-lg outline-none focus:border-white font-sans shadow-inner"
              autoFocus
            />
          </div>
        </div>

        {/* Orders Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {matchingOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-3">
              <ShoppingBag size={48} className="mx-auto text-gray-600" />
              <p className="text-sm font-bold text-gray-300">
                {language === 'ar' ? 'لم يتم العثور على أي طلبات بهذا الرقم' : 'No orders found matching this search'}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ar' ? 'تأكد من إدخال رقم الهاتف المسجل به الطلب أو كود الشحنة' : 'Make sure to check your phone number or order ID'}
              </p>
            </div>
          ) : (
            matchingOrders.map(order => {
              const step = getStatusStep(order.status);
              const isCancelled = order.status === 'Cancelled';

              return (
                <div key={order.id} className="bg-[#181822] border border-white/10 p-5 rounded-xl space-y-5 shadow-xl">
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-white text-base">#{order.id}</span>
                        <span className="text-[10px] font-mono text-gray-400 bg-neutral-900 px-2 py-0.5 rounded border border-white/5">
                          {new Date(order.date || Date.now()).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        {language === 'ar' ? 'اسم العميل:' : 'Customer:'} <strong className="text-white">{order.customer?.name}</strong> • {order.customer?.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded border ${
                        order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                        order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                        order.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                        order.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                        'bg-neutral-800 text-gray-200 border-white/20'
                      }`}>
                        {getStatusLabel(order.status)}
                      </span>

                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1 border border-white/10 transition-colors"
                        title="عرض الفاتورة"
                      >
                        <Printer size={13} className="text-amber-400" />
                        <span>{language === 'ar' ? 'الفاتورة' : 'Invoice'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Shipment Progress Timeline */}
                  {!isCancelled && (
                    <div className="py-2">
                      <div className="grid grid-cols-4 text-center text-[10px] sm:text-xs font-bold mb-2">
                        <span className={step >= 1 ? 'text-amber-400' : 'text-gray-500'}>1. تم الاستلام</span>
                        <span className={step >= 2 ? 'text-amber-400' : 'text-gray-500'}>2. جاري التجهيز</span>
                        <span className={step >= 3 ? 'text-blue-400' : 'text-gray-500'}>3. خرج للشحن</span>
                        <span className={step >= 4 ? 'text-emerald-400' : 'text-gray-500'}>4. تم التوصيل</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${(step / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <p className="text-xs text-gray-400 font-bold">
                      {language === 'ar' ? 'المنتجات في الشحنة:' : 'Ordered Items:'}
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-neutral-900/60 p-2 rounded border border-white/5">
                          <div className="flex items-center gap-2.5">
                            {item.image && (
                              <img src={item.image} alt="" className="w-8 h-10 object-cover rounded border border-white/10 shrink-0" />
                            )}
                            <div>
                              <p className="font-bold text-white">{item.name_ar || item.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">
                                {language === 'ar' ? 'المقاس:' : 'Size:'} {item.size} • {language === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold font-mono text-emerald-400">
                            {(item.price || 0) * (item.quantity || 1)} {language === 'ar' ? 'ج.م' : 'EGP'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total & Support Shortcut */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-white/10 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400">{language === 'ar' ? 'الإجمالي المطلوب للدفع عند الاستلام:' : 'Total due:'} </span>
                      <strong className="text-white text-sm font-mono">{order.total} {language === 'ar' ? 'ج.م' : 'EGP'}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/201012345678?text=${encodeURIComponent(`مرحباً KESWA WEAR، أستفسر عن طلبي رقم ${order.id}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded flex items-center gap-1 font-bold transition-colors"
                      >
                        <MessageSquare size={13} />
                        <span>{language === 'ar' ? 'استفسار عبر واتساب' : 'WhatsApp Support'}</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal 
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};