// The corner shop the promo material shows. Everything here is made up; the emails end in
// @pos.local so the seed can tell demo accounts from real ones.
const PASSWORD = 'demo12345';

const OWNER = { email: 'demo.promo@pos.local', password: PASSWORD, name: 'Lupita', lastName: 'Hernández' };
const CASHIER = {
  email: 'demo.cajero@pos.local',
  password: PASSWORD,
  name: 'Carlos',
  lastName: 'Ramos',
  role: 'CASHIER',
};
const TEAM = [
  { email: 'demo.ana@pos.local', password: PASSWORD, name: 'Ana', lastName: 'Torres', role: 'CASHIER' },
  { email: 'demo.jorge@pos.local', password: PASSWORD, name: 'Jorge', lastName: 'Méndez', role: 'OWNER' },
];

const STORE = {
  name: 'Abarrotes La Esquina',
  phone: '55 1234 5678',
  address: 'Av. Hidalgo 120, Col. Centro, CDMX',
  timezone: 'America/Mexico_City',
};

const CUSTOMERS = [
  { name: 'Público general' },
  { name: 'Doña Mary', phone: '55 2345 6789', notes: 'Paga los viernes' },
  { name: 'Tortillería El Maizal', phone: '55 3456 7890' },
  { name: 'Don Beto', phone: '55 4567 8901' },
  { name: 'Fonda La Güera', phone: '55 5678 9012', email: 'fonda.laguera@example.com' },
];

// price: what the shop pays; priceSell: what the customer pays (whole pesos, the API stores ints)
const PRODUCTS = [
  { name: 'Leche entera 1 L', code: '7501000000011', price: 22, priceSell: 28, stock: 40, isPublic: true },
  { name: 'Huevo blanco 12 pzas', code: '7501000000028', price: 38, priceSell: 48, stock: 30, isPublic: true },
  { name: 'Pan de caja grande', code: '7501000000035', price: 42, priceSell: 52, stock: 20, isPublic: true },
  { name: 'Frijol negro 1 kg', code: '7501000000042', price: 30, priceSell: 38, stock: 25, isPublic: true },
  { name: 'Arroz 1 kg', code: '7501000000059', price: 24, priceSell: 32, stock: 25, isPublic: true },
  { name: 'Aceite vegetal 1 L', code: '7501000000066', price: 36, priceSell: 45, stock: 18, isPublic: true },
  { name: 'Refresco de cola 2 L', code: '7501000000073', price: 28, priceSell: 38, stock: 36, isPublic: true },
  { name: 'Café soluble 120 g', code: '7501000000080', price: 62, priceSell: 79, stock: 12, isPublic: true },
  { name: 'Azúcar 1 kg', code: '7501000000097', price: 26, priceSell: 34, stock: 22, isPublic: false },
  { name: 'Atún en agua 140 g', code: '7501000000103', price: 17, priceSell: 23, stock: 48, isPublic: false },
  { name: 'Papel higiénico 4 rollos', code: '7501000000110', price: 32, priceSell: 42, stock: 16, isPublic: false },
  { name: 'Jabón de barra', code: '7501000000127', price: 14, priceSell: 19, stock: 30, isPublic: false },
  { name: 'Tortillas 1 kg', code: '7501000000134', price: 18, priceSell: 24, stock: 15, isPublic: false },
  { name: 'Galletas surtidas', code: '7501000000141', price: 20, priceSell: 27, stock: 28, isPublic: false },
];

// customer and product are indexes into the lists above
const ORDERS = [
  {
    daysAgo: 6,
    customer: 0,
    items: [
      { product: 0, quantity: 2 },
      { product: 2, quantity: 1 },
    ],
  },
  {
    daysAgo: 6,
    customer: 1,
    items: [
      { product: 1, quantity: 1 },
      { product: 4, quantity: 1 },
      { product: 8, quantity: 1 },
    ],
  },
  {
    daysAgo: 5,
    customer: 4,
    items: [
      { product: 5, quantity: 2 },
      { product: 3, quantity: 2 },
    ],
  },
  {
    daysAgo: 5,
    customer: 0,
    items: [
      { product: 6, quantity: 1 },
      { product: 13, quantity: 2 },
    ],
  },
  { daysAgo: 4, customer: 2, items: [{ product: 12, quantity: 3 }] },
  {
    daysAgo: 3,
    customer: 3,
    items: [
      { product: 7, quantity: 1 },
      { product: 0, quantity: 1 },
    ],
  },
  {
    daysAgo: 3,
    customer: 0,
    items: [
      { product: 9, quantity: 3 },
      { product: 2, quantity: 1 },
    ],
  },
  {
    daysAgo: 2,
    customer: 1,
    items: [
      { product: 10, quantity: 1 },
      { product: 11, quantity: 2 },
    ],
  },
  { daysAgo: 2, customer: 0, items: [{ product: 6, quantity: 2 }] },
  {
    daysAgo: 1,
    customer: 4,
    items: [
      { product: 1, quantity: 2 },
      { product: 5, quantity: 1 },
      { product: 3, quantity: 1 },
    ],
  },
  {
    daysAgo: 0,
    customer: 3,
    items: [
      { product: 0, quantity: 1 },
      { product: 13, quantity: 1 },
    ],
  },
  {
    daysAgo: 0,
    customer: 0,
    items: [
      { product: 7, quantity: 1 },
      { product: 4, quantity: 2 },
    ],
  },
];

module.exports = { OWNER, CASHIER, TEAM, STORE, CUSTOMERS, PRODUCTS, ORDERS };
