import React from 'react';
import { X, Printer, CheckCircle, Package, Truck, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';

export const InvoiceModal = ({ order, isOpen = true, onClose }) => {
  if (!order || isOpen === false) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4">
      <div className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-white text-black rounded shadow-2xl my-auto font-sans animate-fadeIn">
        
        {/* Modal Controls (Not printed) */}
        <div className="print:hidden bg-neutral-900 text-white px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b border-neutral-800 sticky top-0 z-10 shadow">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-400">بوليصة شحن وفاتورة</span>
            <span className="font-mono text-xs text-gray-400">#{order.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow touch-manipulation"
            >
              <Printer size={14} />
              <span>طباعة / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded touch-manipulation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div id="printable-invoice" className="p-4 sm:p-8 space-y-4 sm:space-y-6 text-right" dir="rtl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-black pb-4 sm:pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-black uppercase">
                KESWA WEAR
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-600 font-bold uppercase tracking-widest mt-0.5">
                CLOTHES • STYLE • YOU • براند الملابس الفاخرة
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                الإسكندرية والقاهرة • هاتف: 01023456789
              </p>
            </div>

            <div className="text-right sm:text-left font-mono text-xs space-y-1">
              <div className="bg-neutral-100 px-3 py-1.5 border border-neutral-300 rounded font-bold text-black text-sm inline-block sm:block">
                فاتورة رقم: #{order.id}
              </div>
              <p className="text-neutral-600">
                التاريخ: {new Date(order.date || Date.now()).toLocaleDateString('ar-EG', { dateStyle: 'long' })}
              </p>
              <p className="text-neutral-600">
                الحالة: <span className="font-bold text-black">{order.status || 'Pending'}</span>
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 bg-neutral-50 p-3 sm:p-4 border border-neutral-200 rounded text-xs">
            <div className="space-y-1.5">
              <h3 className="font-bold text-neutral-800 border-b border-neutral-200 pb-1">بيانات العميل المستلم:</h3>
              <p className="font-bold text-black text-sm">{order.customer?.name}</p>
              <p className="text-neutral-700 font-mono">الهاتف: {order.customer?.phone}</p>
              <p className="text-neutral-700">المحافظة: {order.customer?.city}</p>
              <p className="text-neutral-700">العنوان: {order.customer?.address}</p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-neutral-800 border-b border-neutral-200 pb-1">تفاصيل الشحن والدفع:</h3>
              <p className="text-neutral-700">طريقة الدفع: <span className="font-bold text-black">{order.paymentMethod || 'الدفع عند الاستلام (COD)'}</span></p>
              <p className="text-neutral-700">شركة الشحن: أكسبريس مصر (شحن منزلي)</p>
              {order.customer?.notes && (
                <div className="bg-amber-50 border border-amber-200 p-2 rounded text-[11px] text-amber-900 mt-2">
                  <strong>ملاحظات العميل:</strong> {order.customer.notes}
                </div>
              )}
            </div>
          </div>

          {/* Products Table */}
          <div className="border border-neutral-200 rounded overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-neutral-900 text-white font-bold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">المنتج والمواصفات</th>
                  <th className="p-3 text-center">المقاس / اللون</th>
                  <th className="p-3 text-center">الكمية</th>
                  <th className="p-3 text-center">سعر الوحدة</th>
                  <th className="p-3 text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items?.map((item, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="p-3 text-neutral-500 font-mono">{index + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img src={item.image} alt="" className="w-8 h-10 object-cover rounded border border-neutral-200 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-black">{item.name_ar || item.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">كود: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold">{item.size || 'L'} / {item.color || 'Standard'}</td>
                    <td className="p-3 text-center font-mono font-bold">{item.quantity || 1}</td>
                    <td className="p-3 text-center font-mono">{item.price} ج.م</td>
                    <td className="p-3 text-left font-mono font-bold text-black">
                      {(item.price || 0) * (item.quantity || 1)} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-72 bg-neutral-100 p-4 rounded border border-neutral-300 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-700">
                <span>المجموع الفرعي:</span>
                <span className="font-mono font-bold">{order.subtotal} ج.م</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>مصاريف الشحن:</span>
                <span className="font-mono font-bold">{order.shipping > 0 ? `${order.shipping} ج.م` : 'مجاناً'}</span>
              </div>
              <div className="border-t-2 border-black pt-2 flex justify-between text-sm font-black text-black">
                <span>المبلغ المطلوب تحصيله:</span>
                <span className="font-mono text-base">{order.total} ج.م</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-neutral-200 pt-4 text-center text-[10px] text-neutral-500">
            شكراً لتسوقكم من KESWA WEAR • يمكنكم إرجاع أو استبدال المنتجات خلال 14 يوماً بشرط حالتها الأصلية • www.keswawear.com
          </div>

        </div>

      </div>
    </div>
  );
};
