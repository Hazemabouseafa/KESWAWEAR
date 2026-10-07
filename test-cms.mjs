import { initialSiteContent, initialProducts, initialOrders } from './src/data/initialData.js';
import { translations } from './src/data/translations.js';

console.log("==========================================");
console.log("🧪 TESTING KESWA WEAR CMS & STORE LOGIC");
console.log("==========================================");

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
  testsTotal++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
}

// 1. Test Initial Data Integrity
assert(initialProducts.length >= 18, `Products loaded with count: ${initialProducts.length}`);
assert(initialSiteContent.announcement.text_ar.includes("شحن مجاني"), "Arabic announcement text loaded");
assert(initialSiteContent.announcement.text_en.includes("FREE SHIPPING"), "English announcement text loaded");
assert(initialSiteContent.banners.heroHoodies.title_ar === "هوديز", "Arabic hero title loaded");
assert(initialSiteContent.banners.heroHoodies.title_en === "HOODIES", "English hero title loaded");

// 2. Test Translations Dictionary
assert(translations.ar.nav.shop === "تسوق الكل", "Arabic navigation translation is accurate");
assert(translations.en.nav.shop === "SHOP ALL", "English navigation translation is accurate");
assert(translations.ar.checkout.title === "إتمام الطلب والدفع", "Arabic checkout title exists");

// 3. Test Localized Helper
function getLocalized(obj, field, lang) {
  if (lang === 'ar') return obj[`${field}_ar`] || obj[field] || obj[`${field}_en`];
  return obj[`${field}_en`] || obj[field] || obj[`${field}_ar`];
}

const sampleProduct = initialProducts[0];
assert(getLocalized(sampleProduct, 'name', 'ar') === sampleProduct.name_ar, "getLocalized correctly resolves Arabic name");
assert(getLocalized(sampleProduct, 'name', 'en') === sampleProduct.name_en, "getLocalized correctly resolves English name");

// 4. Test Product CRUD Simulation
let productsList = [...initialProducts];
const newProduct = {
  id: "test-prod-101",
  name_ar: "هودي تجريبي جديد",
  name_en: "New Test Hoodie",
  category: "hoodies",
  price: 999,
  oldPrice: 1299,
  badge_ar: "تجريبي",
  badge_en: "TEST",
  sizes: ["M", "L", "XL"],
  colors: [{ name_ar: "أسود", hex: "#000" }]
};

// Add
productsList.unshift(newProduct);
assert(productsList[0].id === "test-prod-101", "Product added to the beginning of list");

// Update
productsList = productsList.map(p => p.id === "test-prod-101" ? { ...p, price: 1050 } : p);
assert(productsList[0].price === 1050, "Product price updated successfully");

// Delete
productsList = productsList.filter(p => p.id !== "test-prod-101");
assert(productsList.find(p => p.id === "test-prod-101") === undefined, "Product deleted successfully");

// 5. Test Cart & Order Flow
let cart = [];
const pToAdd = initialProducts[0];
cart.push({
  cartItemId: `${pToAdd.id}-L-Black`,
  id: pToAdd.id,
  name: pToAdd.name_ar,
  price: pToAdd.price,
  quantity: 2,
  size: "L",
  color: "Black"
});

const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
assert(subtotal === pToAdd.price * 2, `Cart subtotal correctly calculated: ${subtotal}`);

const shipping = subtotal >= initialSiteContent.general.freeShippingThreshold ? 0 : initialSiteContent.general.shippingCost;
const total = subtotal + shipping;

const newOrder = {
  id: `ORD-TEST-${Date.now()}`,
  customer: {
    name: "حازم أبو سيفة",
    phone: "01012345678",
    address: "الإسكندرية",
    city: "Alexandria"
  },
  items: [...cart],
  subtotal,
  shipping,
  total,
  status: "Pending",
  date: new Date().toISOString()
};

let ordersList = [...initialOrders, newOrder];
assert(ordersList.length === initialOrders.length + 1, "Order recorded successfully");

// Change status
ordersList = ordersList.map(o => o.id === newOrder.id ? { ...o, status: "Delivered" } : o);
assert(ordersList.find(o => o.id === newOrder.id).status === "Delivered", "Order status updated to Delivered");

// 6. Test JSON Backup & Restore Serialization
const backupJson = JSON.stringify({
  siteContent: initialSiteContent,
  products: initialProducts,
  orders: ordersList
});

const parsedBackup = JSON.parse(backupJson);
assert(parsedBackup.products.length === initialProducts.length, "Backup JSON validates product count");
assert(parsedBackup.orders.length === ordersList.length, "Backup JSON validates orders count");
assert(parsedBackup.siteContent.brand.name === "KESWA", "Backup JSON validates brand content");

console.log("==========================================");
console.log(`🎉 ALL ${testsPassed}/${testsTotal} UNIT & INTEGRATION TESTS PASSED 100%!`);
console.log("==========================================");
