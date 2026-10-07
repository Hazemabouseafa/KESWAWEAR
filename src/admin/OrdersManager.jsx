import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { InvoiceModal } from '../components/InvoiceModal';
import { 
  ShoppingBag, Search, Plus, Trash2, Edit2, Printer, 
  MessageSquare, Phone, FileSpreadsheet, CheckCircle2, 
  Clock, AlertCircle, X, Save, RefreshCw
} from 'lucide-react';

export const OrdersManager = () => {
  const { 
    orders, 
    updateOrderStatus, 
    updateOrderDetails, 
    createManualOrder, 
    exportOrdersCSV, 
    deleteOrder, 
    clearAllOrders, 
    addTestOrder, 
    showToast,
    language 
  } = useStore();

  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Modals for Orders
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  const [manualOrderForm, setManualOrderForm] = useState({
    name: '',
    phone: '',
    city: 'Alexandria',
    address: '',
    notes: '',
    paymentMethod: 'الدفع عند الاستلام (COD)',
    total: 850
  });

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const processingCount = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'ALL' && o.status !== orderFilter) return false;
    if (orderSearchQuery) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = (o.id || '').toLowerCase().includes(q);
      const matchName = (o.customer?.name || '').toLowerCase().includes(q);
      const matchPhone = String(o.customer?.phone || '').includes(q);
      const matchCity = (o.customer?.city || '').toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchCity;
    }
    return true;
  });

  const getCleanPhone = (phone) => {
    return String(phone || '').replace(/[^0-9]/g, '');
  };

  const handleSaveManualOrder = (e) => {
    e.preventDefault();
    if (!manualOrderForm.name || !manualOrderForm.phone) {
      alert(language === 'ar' ? 'يرجى إدخال اسم العميل ورقم الهاتف' : 'Please provide customer name and phone');
      return;
    }
    createManualOrder({
      customer: {
        name: manualOrderForm.name,
        phone: manualOrderForm.phone,
        city: manualOrderForm.city,
        address: manualOrderForm.address,
        notes: manualOrderForm.notes
      },
      paymentMethod: manualOrderForm.paymentMethod,
      total: Number(manualOrderForm.total) || 850,
      items: [
        {
          id: 'manual-item-1',
          name_ar: 'طلب يدوي خاص',
          name_en: 'Custom Manual Order',
          quantity: 1,
          price: Number(manualOrderForm.total) || 850,
          size: 'L',
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop'
        }
      ]
    });
    setIsManualOrderOpen(false);
    setManualOrderForm({
      name: '',
      phone: '',
      city: 'Alexandria',
      address: '',
      notes: '',
      paymentMethod: 'الدفع عند الاستلام (COD)',
      total: 850
    });
  };

  const handleSaveEditedOrder = (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateOrderDetails(editingOrder.id, {
      customer: { ...editingOrder.customer },
      status: editingOrder.status,
      total: Number(editingOrder.total) || 0
    });
    setIsEditOrderOpen(false);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white mb-1 flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-400 shrink-0" />
            <span>إدارة وتتبع طلبات العملاء ({orders.length} طلب)</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400">
            متابعة الطلبات، طباعة الفواتير، تحديث الحالات، ومراسلة العملاء بالواتساب بنقرة واحدة.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pt-1 sm:pt-0">
          <button
            onClick={() => setIsManualOrderOpen(true)}
            className="bg-white hover:bg-neutral-200 text-black text-xs font-black px-3 py-2 rounded flex items-center justify-center gap-1.5 transition-all shadow-md touch-manipulation"
          >
            <Plus size={14} />
            <span>إضافة طلب يدوي</span>
          </button>

          <button
            onClick={addTestOrder}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-2 rounded flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
          >
            <Plus size={14} />
            <span>طلب تجريبي</span>
          </button>

          <button
            onClick={exportOrdersCSV}
            className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-white/10 text-xs font-bold px-3 py-2 rounded flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
            title="تصدير ملف إكسل CSV"
          >
            <FileSpreadsheet size={14} className="text-emerald-400" />
            <span>تصدير Excel</span>
          </button>

          {orders.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من مسح جميع الطلبات؟')) {
                  clearAllOrders();
                }
              }}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
            >
              <Trash2 size={14} />
              <span>مسح الكل</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-[#16161f] p-2.5 sm:p-3.5 rounded border border-white/10 shadow-lg">
          <span className="text-[10px] sm:text-[11px] text-gray-400 block mb-0.5">إجمالي المبيعات</span>
          <span className="text-base sm:text-xl font-black text-emerald-400 font-mono">{totalRevenue.toLocaleString()} ج.م</span>
        </div>
        <div className="bg-[#16161f] p-2.5 sm:p-3.5 rounded border border-white/10 shadow-lg">
          <span className="text-[10px] sm:text-[11px] text-gray-400 block mb-0.5">قيد المراجعة</span>
          <span className="text-base sm:text-xl font-black text-amber-400 font-mono">{pendingCount}</span>
        </div>
        <div className="bg-[#16161f] p-2.5 sm:p-3.5 rounded border border-white/10 shadow-lg">
          <span className="text-[10px] sm:text-[11px] text-gray-400 block mb-0.5">جاري التجهيز والشحن</span>
          <span className="text-base sm:text-xl font-black text-blue-400 font-mono">{processingCount}</span>
        </div>
        <div className="bg-[#16161f] p-2.5 sm:p-3.5 rounded border border-white/10 shadow-lg">
          <span className="text-[10px] sm:text-[11px] text-gray-400 block mb-0.5">مكتمل</span>
          <span className="text-base sm:text-xl font-black text-emerald-400 font-mono">{deliveredCount}</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-[#16161f] p-2.5 sm:p-3 rounded border border-white/10">
        <div className="relative flex-1">
          <Search size={14} className="absolute top-2.5 right-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="ابحث برقم الطلب، اسم العميل، الهاتف..."
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 pr-9 pl-3 py-1.5 text-xs text-white rounded outline-none focus:border-white font-sans"
          />
        </div>

        {/* Scrollable status filter pills */}
        <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 shrink-0 scrollbar-none touch-manipulation">
          {[
            { id: 'ALL', label: `الكل (${orders.length})` },
            { id: 'Pending', label: `قيد المراجعة (${pendingCount})` },
            { id: 'Processing', label: 'جاري التجهيز' },
            { id: 'Shipped', label: 'تم الشحن' },
            { id: 'Delivered', label: `مكتمل (${deliveredCount})` },
            { id: 'Cancelled', label: 'ملغي' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setOrderFilter(f.id)}
              className={`px-2.5 py-1 text-xs rounded whitespace-nowrap transition-colors touch-manipulation ${
                orderFilter === f.id ? 'bg-white text-black font-bold shadow' : 'bg-neutral-900 text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#16161f] border border-white/10 p-8 sm:p-12 text-center rounded shadow-lg">
          <ShoppingBag size={38} className="mx-auto text-gray-600 mb-3" />
          <p className="text-sm font-bold text-gray-300">لا توجد طلبات تطابق بحثك حالياً</p>
          <p className="text-xs text-gray-500 mt-1">اضغط على زر "إضافة طلب تجريبي" أو "إضافة طلب يدوي" بالأعلى للتجربة الفورية!</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded space-y-3 sm:space-y-4 shadow-xl hover:border-white/20 transition-all">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-white text-base">#{order.id}</span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-gray-400 bg-neutral-900 px-2 py-0.5 rounded border border-white/5">
                      {new Date(order.date || Date.now()).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    العميل: <strong className="text-white">{order.customer?.name || 'غير محدد'}</strong> • الهاتف: <strong className="text-white font-mono">{String(order.customer?.phone || '')}</strong>
                  </div>
                </div>

                {/* Status Switcher & Actions */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto pt-1 sm:pt-0">
                  
                  {/* Print Invoice Button */}
                  <button
                    onClick={() => {
                      setSelectedInvoiceOrder(order);
                      setIsInvoiceOpen(true);
                    }}
                    className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs px-2.5 py-1.5 rounded flex items-center justify-center gap-1 transition-colors border border-white/10 shadow-sm touch-manipulation"
                    title="طباعة الفاتورة وبوليصة الشحن"
                  >
                    <Printer size={13} className="text-amber-400" />
                    <span>الفاتورة</span>
                  </button>

                  {/* Edit Order Button */}
                  <button
                    onClick={() => {
                      setEditingOrder({ ...order });
                      setIsEditOrderOpen(true);
                    }}
                    className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs px-2.5 py-1.5 rounded flex items-center justify-center gap-1 transition-colors border border-white/10 shadow-sm touch-manipulation"
                    title="تعديل بيانات الطلب"
                  >
                    <Edit2 size={13} className="text-cyan-400" />
                    <span>تعديل</span>
                  </button>

                  {/* WhatsApp Chat Shortcut (Safe phone string) */}
                  {order.customer?.phone && (
                    <a
                      href={`https://wa.me/2${getCleanPhone(order.customer.phone)}?text=${encodeURIComponent(`مرحباً ${order.customer.name || ''}، بخصوص طلبك رقم ${order.id} من متجر KESWA WEAR`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1.5 rounded flex items-center justify-center gap-1 transition-colors shadow touch-manipulation"
                      title="مراسلة واتساب"
                    >
                      <MessageSquare size={13} />
                      <span>واتساب</span>
                    </a>
                  )}

                  {/* Direct Call Shortcut */}
                  {order.customer?.phone && (
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs px-2.5 py-1.5 rounded flex items-center justify-center gap-1 transition-colors border border-white/5 touch-manipulation"
                      title="اتصال هاتفي"
                    >
                      <Phone size={13} />
                      <span>اتصال</span>
                    </a>
                  )}

                  {/* Status Dropdown with explicit styling */}
                  <select 
                    value={order.status || 'Pending'}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`col-span-2 sm:col-span-1 text-xs font-bold px-2.5 py-1.5 rounded outline-none border cursor-pointer w-full sm:w-auto touch-manipulation ${
                      order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                      order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                      order.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      order.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                      'bg-neutral-800 text-gray-200 border-white/20'
                    }`}
                  >
                    <option value="Pending" className="bg-neutral-900 text-white">قيد المراجعة (Pending)</option>
                    <option value="Processing" className="bg-neutral-900 text-white">جاري التجهيز (Processing)</option>
                    <option value="Shipped" className="bg-neutral-900 text-white">تم الشحن (Shipped)</option>
                    <option value="Delivered" className="bg-neutral-900 text-white">تم التوصيل بنجاح (Delivered)</option>
                    <option value="Cancelled" className="bg-neutral-900 text-white">ملغي (Cancelled)</option>
                  </select>

                  {/* Delete Order Button */}
                  <button
                    onClick={() => {
                      if (window.confirm(`حذف الطلب #${order.id} نهائياً؟`)) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="col-span-2 sm:col-span-1 p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors flex items-center justify-center touch-manipulation"
                    title="حذف الطلب"
                  >
                    <Trash2 size={13} />
                    <span className="sm:hidden text-xs mr-1">حذف الطلب</span>
                  </button>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-neutral-900/70 p-3 rounded space-y-1.5 border border-white/5">
                  <p className="text-gray-400">عنوان التوصيل:</p>
                  <p className="text-white font-bold">{order.customer?.address || 'غير محدد'}، {order.customer?.city || 'مصر'}</p>
                  {order.customer?.notes && (
                    <p className="text-amber-300 text-[11px]">ملاحظات العميل: {order.customer.notes}</p>
                  )}
                  <p className="text-gray-400 pt-1">طريقة الدفع: <span className="text-white font-bold">{order.paymentMethod || 'الدفع عند الاستلام (COD)'}</span></p>
                </div>

                <div className="bg-neutral-900/70 p-3 rounded space-y-2 border border-white/5">
                  <p className="text-gray-400">المنتجات المطلوبة ({order.items?.length || 0}):</p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-gray-300">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img src={item.image} alt="" className="w-7 h-9 object-cover rounded border border-white/10 shrink-0" />
                          )}
                          <span>{item.quantity}x {item.name_ar || item.name} ({item.size})</span>
                        </div>
                        <span className="font-bold text-white font-mono">{(item.price || 0) * (item.quantity || 1)} ج.م</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-1.5 flex justify-between font-bold text-white">
                    <span>الإجمالي الكلي:</span>
                    <span className="text-emerald-400 text-sm font-mono">{order.total} ج.م</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Manual Order Creation Modal */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-[#16161f] border border-white/15 rounded-lg max-w-lg w-full p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Plus size={18} className="text-amber-400 shrink-0" />
                <span>إضافة طلب يدوي جديد (Manual Order)</span>
              </h3>
              <button onClick={() => setIsManualOrderOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveManualOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">اسم العميل بالكامل *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: أحمد محمود"
                  value={manualOrderForm.name}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">رقم الهاتف *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="010xxxxxxxx"
                    value={manualOrderForm.phone}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">المحافظة / المدينة</label>
                  <input 
                    type="text" 
                    value={manualOrderForm.city}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, city: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">العنوان بالتفصيل</label>
                <input 
                  type="text" 
                  placeholder="الشارع، رقم العمارة، الشقة..."
                  value={manualOrderForm.address}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, address: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">إجمالي الطلب (ج.م) *</label>
                  <input 
                    type="number" 
                    required
                    value={manualOrderForm.total}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, total: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">طريقة الدفع</label>
                  <select 
                    value={manualOrderForm.paymentMethod}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, paymentMethod: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  >
                    <option value="الدفع عند الاستلام (COD)">الدفع عند الاستلام (COD)</option>
                    <option value="فودافون كاش / إنستاباي">فودافون كاش / إنستاباي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">ملاحظات إضافية (اختياري)</label>
                <textarea 
                  rows={2}
                  placeholder="مثال: تم التواصل عبر صفحة الفيسبوك"
                  value={manualOrderForm.notes}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, notes: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-neutral-800 text-gray-300 hover:text-white rounded transition-colors text-center"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded transition-all shadow-lg flex items-center justify-center gap-1.5 touch-manipulation"
                >
                  <Save size={14} />
                  <span>💾 تأكيد وحفظ الطلب</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditOrderOpen && editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-[#16161f] border border-white/15 rounded-lg max-w-lg w-full p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Edit2 size={18} className="text-cyan-400 shrink-0" />
                <span>تعديل بيانات الطلب #{editingOrder.id}</span>
              </h3>
              <button onClick={() => setIsEditOrderOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">اسم العميل</label>
                <input 
                  type="text"
                  value={editingOrder.customer?.name || ''}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, name: e.target.value }
                  })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">رقم الهاتف</label>
                  <input 
                    type="text"
                    value={editingOrder.customer?.phone || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, phone: e.target.value }
                    })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">المدينة / المحافظة</label>
                  <input 
                    type="text"
                    value={editingOrder.customer?.city || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, city: e.target.value }
                    })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">العنوان</label>
                <input 
                  type="text"
                  value={editingOrder.customer?.address || ''}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, address: e.target.value }
                  })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">إجمالي الطلب (ج.م)</label>
                  <input 
                    type="number"
                    value={editingOrder.total || 0}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      total: Number(e.target.value)
                    })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">حالة الطلب</label>
                  <select 
                    value={editingOrder.status || 'Pending'}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      status: e.target.value
                    })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  >
                    <option value="Pending">قيد المراجعة (Pending)</option>
                    <option value="Processing">جاري التجهيز (Processing)</option>
                    <option value="Shipped">تم الشحن (Shipped)</option>
                    <option value="Delivered">تم التوصيل (Delivered)</option>
                    <option value="Cancelled">ملغي (Cancelled)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditOrderOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-neutral-800 text-gray-300 hover:text-white rounded transition-colors text-center"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded transition-all shadow-lg flex items-center justify-center gap-1.5 touch-manipulation"
                >
                  <Save size={14} />
                  <span>💾 حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceOpen && selectedInvoiceOrder && (
        <InvoiceModal 
          order={selectedInvoiceOrder} 
          onClose={() => {
            setIsInvoiceOpen(false);
            setSelectedInvoiceOrder(null);
          }} 
        />
      )}
    </div>
  );
};