/* Pure data, types and helpers — safe to import anywhere. */

export type OrderStatus = 'en_attente' | 'paye' | 'livre'

export type DeliveryMethod = 'domicile' | 'relais' | 'retrait'

export type PaymentProvider = 'wave' | 'orange' | 'mtn' | 'moov'

export type ShopStatus = 'active' | 'verifiee' | 'suspendue'

export type ShopPlan = 'starter' | 'pro' | 'business'

export interface ColorVariant {
  name: string
  hex: string
}

export interface ProductVariant {
  id: string
  name: string
  size?: string
  color?: string
  material?: string
  price: number // Specific price in FCFA for this variant combination
  stock: number
  image?: string
}

export interface Shop {
  slug: string
  name: string
  tagline: string
  category: string
  ownerName: string
  phone: string
  whatsapp: string
  payoutPhone?: string
  payoutProvider?: PaymentProvider
  color: string
  communes: string[]
  deliveryRates?: Record<string, number>
  defaultDeliveryFee?: number
  freeDelivery?: boolean
  status?: ShopStatus
  plan?: ShopPlan
  createdAt?: number
}

export interface Product {
  id: string
  shopSlug: string
  title: string
  price: number // Base price in FCFA
  minPrice?: number
  maxPrice?: number
  description: string
  image: string
  images?: string[] // Multi-photos
  stock: number
  category: string
  sizes?: string[] // Tailles disponibles
  colors?: ColorVariant[] // Couleurs disponibles
  materials?: string[] // Matières disponibles
  variants?: ProductVariant[] // Specific price & stock per variant combination
  createdAt?: number
}

export interface OrderItem {
  productId: string
  title: string
  price: number
  qty: number
  size?: string
  color?: string
  material?: string
  variantId?: string
}

export interface Order {
  id: string
  shopSlug: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  customerName: string
  customerPhone: string
  commune: string
  deliveryMethod: DeliveryMethod
  paymentProvider: PaymentProvider
  status: OrderStatus
  createdAt: number
}

export interface Payout {
  id: string
  shopSlug: string
  amount: number
  fee: number
  netAmount: number
  provider: PaymentProvider
  phone: string
  status: 'effectue' | 'en_cours' | 'rejete'
  createdAt: number
}

export interface SubscriptionPlan {
  id: ShopPlan
  name: string
  price: number // FCFA / month
  commissionRate: number // ex: 2.5, 1.5, 1.0
  features: string[]
  badge?: string
  popular?: boolean
}

export interface PlatformSettings {
  defaultCommissionRate: number // 2.5%
  fixedWithdrawalFee: number // 100 FCFA
  minWithdrawalAmount: number // 1000 FCFA
  platformName: string
  supportWhatsapp: string
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  defaultCommissionRate: 2.5,
  fixedWithdrawalFee: 100,
  minWithdrawalAmount: 1000,
  platformName: 'Djassa SAAS',
  supportWhatsapp: '+225 07 00 00 00',
}

export const SAAS_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Gratuit',
    price: 0,
    commissionRate: 2.5,
    features: [
      'Boutique en ligne & lien bio unique',
      'Jusqu’à 15 articles au catalogue',
      'Encaissement Wave, Orange, MTN, Moov',
      'Paiement sans négociation WhatsApp',
      'Commission : 2.5% par vente',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Commerçant',
    price: 3000,
    commissionRate: 1.5,
    popular: true,
    badge: 'Recommandé',
    features: [
      'Articles & photos illimités',
      'Badge « Boutique Certifiée »',
      'Variantes avec prix différenciés',
      'Commission réduite à 1.5%',
      'Gestion des livreurs partenaires Abidjan',
      'Statistiques des visites et conversions',
    ],
  },
  {
    id: 'business',
    name: 'Business VIP',
    price: 5000,
    commissionRate: 1.0,
    features: [
      'Nom de domaine personnalisé (.ci ou .com)',
      'Commission minimale de 1.0%',
      'Reversements Mobile Money automatiques H24',
      'Multi-utilisateurs & gestion de stock avancée',
      'Support VIP dédié sur WhatsApp 7j/7',
    ],
  },
]

export const ABIDJAN_COMMUNES = [
  'Cocody',
  'Yopougon',
  'Marcory',
  'Plateau',
  'Treichville',
  'Abobo',
  'Koumassi',
  'Port-Bouët',
  'Adjamé',
  'Attécoubé',
  'Bingerville',
  'Grand-Bassam',
]

export const SHOP_CATEGORIES = [
  'Mode & Wax',
  'Chaussures & Maroquinerie',
  'Beauté & Cosmétiques',
  'Bijoux & Accessoires',
  'Électronique & High-Tech',
  'Alimentation & Épices',
  'Maison & Décoration',
  'Autre',
]

export const CATEGORY_ATTRIBUTES: Record<
  string,
  {
    sizesLabel: string
    suggestedSizes: string[]
    suggestedColors: ColorVariant[]
    materialsLabel: string
    suggestedMaterials: string[]
  }
> = {
  'Mode & Wax': {
    sizesLabel: 'Tailles de vêtements',
    suggestedSizes: ['S', 'M', 'L', 'XL', 'XXL', 'Sur-mesure', 'Taille Unique'],
    suggestedColors: [
      { name: 'Bleu Wax', hex: '#1E40AF' },
      { name: 'Jaune Ocre', hex: '#D97706' },
      { name: 'Rouge Brique', hex: '#DC2626' },
      { name: 'Vert Forêt', hex: '#15803D' },
      { name: 'Noir Ébène', hex: '#18181B' },
      { name: 'Multicolore', hex: '#EC4899' },
    ],
    materialsLabel: 'Tissus & Matières',
    suggestedMaterials: [
      'Pagne Wax Vlisco / Uniwax',
      'Bogolan Traditionnel',
      'Bazin Riche Guezner',
      'Coton Kente / Kita',
      'Soie & Mousseline',
      'Lin Naturel',
    ],
  },
  'Chaussures & Maroquinerie': {
    sizesLabel: 'Pointures & Dimensions',
    suggestedSizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    suggestedColors: [
      { name: 'Noir', hex: '#09090B' },
      { name: 'Marron Foncé', hex: '#582F0E' },
      { name: 'Camel / Fauve', hex: '#B07D62' },
      { name: 'Beige Sable', hex: '#E6CCB2' },
      { name: 'Bleu Nuit', hex: '#1E293B' },
    ],
    materialsLabel: 'Matières du produit',
    suggestedMaterials: [
      'Cuir Véritable Artisanal',
      'Raphia Tissé Main',
      'Daim / Nubuck',
      'Cuir Verni',
      'Simili Cuir Premium',
      'Toile & Tissu Wax',
    ],
  },
  'Bijoux & Accessoires': {
    sizesLabel: 'Dimensions & Tailles',
    suggestedSizes: ['Taille Unique', 'Ajustable', 'Petit (16-17 cm)', 'Moyen (18-19 cm)', 'Grand (20-22 cm)'],
    suggestedColors: [
      { name: 'Doré / Or', hex: '#D4AF37' },
      { name: 'Argenté', hex: '#C0C0C0' },
      { name: 'Or Rose', hex: '#B76E79' },
      { name: 'Bronze', hex: '#CD7F32' },
      { name: 'Perles Mixtes', hex: '#06B6D4' },
    ],
    materialsLabel: 'Matières des bijoux',
    suggestedMaterials: [
      'Perles Africaines Traditionnelles',
      'Acier Inoxydable (ne noircit pas)',
      'Plaqué Or 18K',
      'Laiton Artisanal',
      'Argent 925',
      'Cauris & Bois d’Ébène',
    ],
  },
  'Électronique & High-Tech': {
    sizesLabel: 'Capacités / Modèles',
    suggestedSizes: ['Standard', '64 Go', '128 Go', '256 Go', '10 000 mAh', '20 000 mAh'],
    suggestedColors: [
      { name: 'Noir Mat', hex: '#18181B' },
      { name: 'Blanc Pur', hex: '#F4F4F5' },
      { name: 'Gris Sidéral', hex: '#4B5563' },
      { name: 'Bleu Minuit', hex: '#0F172A' },
    ],
    materialsLabel: 'Finition & Conception',
    suggestedMaterials: [
      'Aluminium Brossé',
      'Polymère Renforcé & Silicone',
      'Verre Trempé 9H',
      'Câble Tressé Anti-torsion',
    ],
  },
  'Beauté & Cosmétiques': {
    sizesLabel: 'Contenances / Formats',
    suggestedSizes: ['50 ml', '100 ml', '200 ml', '250 g', '500 g', 'Format Voyage'],
    suggestedColors: [
      { name: 'Naturel / Incolore', hex: '#FEF08A' },
      { name: 'Teint Ébène', hex: '#3E2723' },
      { name: 'Teint Caramel', hex: '#8D6E63' },
      { name: 'Teint Clair', hex: '#D7CCC8' },
    ],
    materialsLabel: 'Ingrédients Clés',
    suggestedMaterials: [
      'Beurre de Karité Pur Brut',
      'Huile de Coco Vierge Pressée à Froid',
      'Cacao Bio de Côte d’Ivoire',
      'Gel d’Aloe Vera Bio',
      'Savon Noir Traditionnel',
    ],
  },
  'Alimentation & Épices': {
    sizesLabel: 'Poids & Volumes',
    suggestedSizes: ['250 g', '500 g', '1 kg', '2 kg', '5 kg', 'Pot 300 ml'],
    suggestedColors: [
      { name: 'Nature', hex: '#FEF9C3' },
      { name: 'Pimenté Fort', hex: '#EF4444' },
      { name: 'Doux & Épicé', hex: '#F97316' },
      { name: 'Fumé', hex: '#78350F' },
    ],
    materialsLabel: 'Origine & Ingrédients',
    suggestedMaterials: [
      'Attiéké Traditionnel Séché',
      'Piment Bec d’Oiseau Bio',
      'Poivre Noir de Tiassalé',
      'Épices Kankankan 100% Naturelles',
      'Miel Pur de Savane',
    ],
  },
  'Maison & Décoration': {
    sizesLabel: 'Dimensions',
    suggestedSizes: ['Petit (30x30 cm)', 'Moyen (45x45 cm)', 'Grand (60x60 cm)', 'Standard'],
    suggestedColors: [
      { name: 'Écru / Naturel', hex: '#F5F5DC' },
      { name: 'Terracotta', hex: '#E07A5F' },
      { name: 'Indigo Baoulé', hex: '#3D405B' },
      { name: 'Vert Forêt', hex: '#2D6A4F' },
    ],
    materialsLabel: 'Matériaux nobles',
    suggestedMaterials: [
      'Bois d’Iroko Sculpté',
      'Tissu Pagne Baoulé Tissé',
      'Terre Cuite Artisanale',
      'Raphia & Rotin Naturel',
    ],
  },
  Autre: {
    sizesLabel: 'Tailles / Formats',
    suggestedSizes: ['Taille Unique', 'Standard', 'Petit', 'Grand'],
    suggestedColors: [
      { name: 'Noir', hex: '#000000' },
      { name: 'Blanc', hex: '#FFFFFF' },
      { name: 'Couleur Unique', hex: '#0f9d6b' },
    ],
    materialsLabel: 'Matières & Composants',
    suggestedMaterials: ['Qualité Supérieure', 'Artisanal Fait Main'],
  },
}

export const DEFAULT_PRODUCT_IMAGES = [
  { label: 'Robe Wax', url: '/products/robe-wax.png' },
  { label: 'Ensemble Bogolan', url: '/products/ensemble-bogolan.png' },
  { label: 'Sac Raphia', url: '/products/sac-raphia.png' },
  { label: 'Sandales Cuir', url: '/products/sandales-cuir.png' },
  { label: 'Foulard Wax', url: '/products/foulard-wax.png' },
  { label: 'Collier Perles', url: '/products/collier-perles.png' },
  { label: 'Écouteurs Bluetooth', url: '/products/ecouteurs.png' },
  { label: 'Montre Connectée', url: '/products/montre-connectee.png' },
  { label: 'Power Bank', url: '/products/powerbank.png' },
]

export const DEMO_SHOPS: Shop[] = [
  {
    slug: 'chez-awa',
    name: 'Chez Awa',
    tagline: 'Mode & wax faits main à Abidjan',
    category: 'Mode & Wax',
    ownerName: 'Awa Koné',
    phone: '+225 07 00 00 00',
    whatsapp: '+225 07 00 00 00',
    payoutPhone: '+225 07 00 00 00',
    payoutProvider: 'wave',
    color: 'oklch(0.58 0.15 158)',
    communes: ['Cocody', 'Yopougon', 'Marcory', 'Plateau', 'Abobo', 'Treichville'],
    defaultDeliveryFee: 1500,
    deliveryRates: {
      Cocody: 1000,
      Marcory: 1000,
      Plateau: 1500,
      Treichville: 1500,
      Yopougon: 2000,
      Abobo: 2000,
    },
    status: 'verifiee',
    plan: 'pro',
    createdAt: Date.now() - 3600 * 1000 * 24 * 30,
  },
  {
    slug: 'gadget-abidjan',
    name: 'Gadget Abidjan',
    tagline: 'High-tech au meilleur prix, livré partout',
    category: 'Électronique & High-Tech',
    ownerName: 'Ismaël Traoré',
    phone: '+225 05 11 22 33',
    whatsapp: '+225 05 11 22 33',
    payoutPhone: '+225 05 11 22 33',
    payoutProvider: 'orange',
    color: 'oklch(0.5 0.1 250)',
    communes: ['Cocody', 'Marcory', 'Plateau', 'Koumassi', 'Bingerville'],
    defaultDeliveryFee: 1500,
    deliveryRates: {
      Cocody: 1000,
      Plateau: 1500,
      Marcory: 1500,
      Koumassi: 2000,
      Bingerville: 2500,
    },
    status: 'verifiee',
    plan: 'starter',
    createdAt: Date.now() - 3600 * 1000 * 24 * 14,
  },
  {
    slug: 'cosmetique-naturel-ci',
    name: 'Karité & Glow 225',
    tagline: 'Soins naturels au karité pur & cacao ivoirien',
    category: 'Beauté & Cosmétiques',
    ownerName: 'Fatou Diallo',
    phone: '+225 01 44 55 66',
    whatsapp: '+225 01 44 55 66',
    payoutPhone: '+225 01 44 55 66',
    payoutProvider: 'wave',
    color: 'oklch(0.65 0.18 50)',
    communes: ['Cocody', 'Marcory', 'Riviera', 'Zone 4', 'Plateau'],
    defaultDeliveryFee: 1500,
    deliveryRates: {
      Cocody: 1000,
      Marcory: 1500,
      Plateau: 1500,
    },
    status: 'active',
    plan: 'starter',
    createdAt: Date.now() - 3600 * 1000 * 24 * 5,
  },
]

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p-robe-wax',
    shopSlug: 'chez-awa',
    title: 'Robe en pagne wax',
    price: 25000,
    minPrice: 25000,
    maxPrice: 32000,
    description:
      'Robe cousue main en pagne wax authentique. Coupe cintrée, idéale pour les cérémonies et sorties.',
    image: '/products/robe-wax.png',
    images: ['/products/robe-wax.png', '/products/foulard-wax.png'],
    stock: 12,
    category: 'Mode & Wax',
    sizes: ['S', 'M', 'L', 'XL', 'Sur-mesure'],
    colors: [
      { name: 'Bleu Wax', hex: '#1E40AF' },
      { name: 'Jaune Ocre', hex: '#D97706' },
      { name: 'Rouge Brique', hex: '#DC2626' },
    ],
    materials: ['Pagne Wax Vlisco / Uniwax', 'Bogolan Traditionnel'],
    variants: [
      { id: 'v1', name: 'Taille S / Pagne Wax', size: 'S', price: 25000, stock: 4 },
      { id: 'v2', name: 'Taille M / Pagne Wax', size: 'M', price: 25000, stock: 4 },
      { id: 'v3', name: 'Taille L / Pagne Wax', size: 'L', price: 27000, stock: 2 },
      { id: 'v4', name: 'Taille XL / Pagne Wax', size: 'XL', price: 29000, stock: 2 },
      { id: 'v5', name: 'Sur-mesure / Bogolan', size: 'Sur-mesure', material: 'Bogolan Traditionnel', price: 32000, stock: 2 },
    ],
    createdAt: Date.now() - 3600 * 1000 * 48,
  },
  {
    id: 'p-ensemble-bogolan',
    shopSlug: 'chez-awa',
    title: 'Ensemble bogolan 2 pièces',
    price: 32000,
    minPrice: 32000,
    maxPrice: 38000,
    description:
      'Ensemble haut + jupe en bogolan traditionnel. Tissu épais et confortable, motifs uniques faits à la main.',
    image: '/products/ensemble-bogolan.png',
    images: ['/products/ensemble-bogolan.png'],
    stock: 8,
    category: 'Mode & Wax',
    sizes: ['M', 'L', 'XL', 'Sur-mesure'],
    colors: [
      { name: 'Noir & Ocre', hex: '#78350F' },
      { name: 'Blanc & Indigo', hex: '#312E81' },
    ],
    materials: ['Bogolan Traditionnel', 'Bazin Riche Guezner'],
    variants: [
      { id: 'eb1', name: 'Taille M / Bogolan', size: 'M', material: 'Bogolan Traditionnel', price: 32000, stock: 3 },
      { id: 'eb2', name: 'Taille L / Bogolan', size: 'L', material: 'Bogolan Traditionnel', price: 34000, stock: 3 },
      { id: 'eb3', name: 'Taille XL / Bazin Riche', size: 'XL', material: 'Bazin Riche Guezner', price: 38000, stock: 2 },
    ],
    createdAt: Date.now() - 3600 * 1000 * 40,
  },
  {
    id: 'p-sac-raphia',
    shopSlug: 'chez-awa',
    title: 'Sac à main en raphia',
    price: 15000,
    minPrice: 15000,
    maxPrice: 20000,
    description:
      'Sac tissé main en raphia naturel avec anses en cuir véritable. Parfait pour la ville comme pour la plage.',
    image: '/products/sac-raphia.png',
    images: ['/products/sac-raphia.png'],
    stock: 12,
    category: 'Chaussures & Maroquinerie',
    sizes: ['Moyen (35x25 cm)', 'Grand (45x30 cm)'],
    colors: [
      { name: 'Naturel / Camel', hex: '#B07D62' },
      { name: 'Noir & Paille', hex: '#18181B' },
    ],
    materials: ['Raphia Tissé Main', 'Cuir Véritable Artisanal'],
    variants: [
      { id: 'sr1', name: 'Format Moyen', size: 'Moyen (35x25 cm)', price: 15000, stock: 8 },
      { id: 'sr2', name: 'Format Grand', size: 'Grand (45x30 cm)', price: 20000, stock: 4 },
    ],
    createdAt: Date.now() - 3600 * 1000 * 30,
  },
  {
    id: 'p-sandales',
    shopSlug: 'chez-awa',
    title: 'Sandales en cuir',
    price: 18000,
    minPrice: 18000,
    maxPrice: 18000,
    description:
      'Sandales artisanales en cuir véritable, semelle souple et résistante. Très confortables.',
    image: '/products/sandales-cuir.png',
    images: ['/products/sandales-cuir.png'],
    stock: 15,
    category: 'Chaussures & Maroquinerie',
    sizes: ['37', '38', '39', '40', '41', '42'],
    colors: [
      { name: 'Marron Cuir', hex: '#582F0E' },
      { name: 'Noir', hex: '#09090B' },
      { name: 'Doré', hex: '#D4AF37' },
    ],
    materials: ['Cuir Véritable Artisanal'],
    createdAt: Date.now() - 3600 * 1000 * 20,
  },
  {
    id: 'p-ecouteurs',
    shopSlug: 'gadget-abidjan',
    title: 'Écouteurs sans fil TWS',
    price: 22000,
    minPrice: 22000,
    maxPrice: 28000,
    description:
      'Écouteurs Bluetooth réduction de bruit avec boîtier de charge, autonomie 24h. Garantie 6 mois.',
    image: '/products/ecouteurs.png',
    images: ['/products/ecouteurs.png'],
    stock: 30,
    category: 'Électronique & High-Tech',
    sizes: ['Standard', 'Modèle Pro ANC'],
    colors: [
      { name: 'Noir Mat', hex: '#18181B' },
      { name: 'Blanc Pur', hex: '#F4F4F5' },
    ],
    materials: ['Polymère Renforcé'],
    variants: [
      { id: 'ec1', name: 'Standard Bluetooth 5.3', size: 'Standard', price: 22000, stock: 20 },
      { id: 'ec2', name: 'Modèle Pro Réduction Active', size: 'Modèle Pro ANC', price: 28000, stock: 10 },
    ],
    createdAt: Date.now() - 3600 * 1000 * 15,
  },
  {
    id: 'p-montre',
    shopSlug: 'gadget-abidjan',
    title: 'Montre connectée Smart Pro',
    price: 35000,
    minPrice: 35000,
    maxPrice: 42000,
    description:
      'Smartwatch avec suivi santé & sport, appels Bluetooth, notifications WhatsApp. Compatible Android & iOS.',
    image: '/products/montre-connectee.png',
    images: ['/products/montre-connectee.png'],
    stock: 14,
    category: 'Électronique & High-Tech',
    sizes: ['Boîtier 40 mm', 'Boîtier 44 mm'],
    colors: [
      { name: 'Noir Sidéral', hex: '#18181B' },
      { name: 'Argent / Blanc', hex: '#C0C0C0' },
      { name: 'Or Rose', hex: '#B76E79' },
    ],
    materials: ['Aluminium & Silicone'],
    variants: [
      { id: 'sm1', name: 'Boîtier 40 mm', size: 'Boîtier 40 mm', price: 35000, stock: 8 },
      { id: 'sm2', name: 'Boîtier 44 mm', size: 'Boîtier 44 mm', price: 42000, stock: 6 },
    ],
    createdAt: Date.now() - 3600 * 1000 * 10,
  },
]

export const DEMO_ORDERS: Order[] = [
  {
    id: 'CMD-1042',
    shopSlug: 'chez-awa',
    items: [
      {
        productId: 'p-robe-wax',
        title: 'Robe en pagne wax',
        price: 25000,
        qty: 1,
        size: 'M',
        color: 'Bleu Wax',
        material: 'Pagne Wax Vlisco / Uniwax',
      },
    ],
    subtotal: 25000,
    deliveryFee: 1500,
    total: 26500,
    customerName: 'Fatou Diabaté',
    customerPhone: '+225 07 88 88 88',
    commune: 'Cocody',
    deliveryMethod: 'domicile',
    paymentProvider: 'wave',
    status: 'paye',
    createdAt: Date.now() - 3600 * 1000 * 3,
  },
  {
    id: 'CMD-1041',
    shopSlug: 'chez-awa',
    items: [
      {
        productId: 'p-sandales',
        title: 'Sandales en cuir',
        price: 18000,
        qty: 1,
        size: '39',
        color: 'Marron Cuir',
        material: 'Cuir Véritable Artisanal',
      },
    ],
    subtotal: 18000,
    deliveryFee: 1000,
    total: 19000,
    customerName: 'Aïcha Bakayoko',
    customerPhone: '+225 05 77 77 77',
    commune: 'Marcory',
    deliveryMethod: 'relais',
    paymentProvider: 'orange',
    status: 'livre',
    createdAt: Date.now() - 3600 * 1000 * 24,
  },
]

export const DEMO_PAYOUTS: Payout[] = [
  {
    id: 'VIR-9021',
    shopSlug: 'chez-awa',
    amount: 19000,
    fee: 100,
    netAmount: 18900,
    provider: 'wave',
    phone: '+225 07 00 00 00',
    status: 'effectue',
    createdAt: Date.now() - 3600 * 1000 * 20,
  },
]

export function formatCFA(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

/** Determines the exact price of a product depending on chosen size, color, or material */
export function getProductPrice(
  product: Product,
  options?: { size?: string; color?: string; material?: string },
): number {
  if (!product.variants || product.variants.length === 0) {
    return product.price
  }

  // 1. Check exact match for (size, material, color)
  if (options?.size && options?.material) {
    const match = product.variants.find(
      (v) =>
        (!v.size || v.size === options.size) &&
        (!v.material || v.material === options.material) &&
        (!v.color || v.color === options.color),
    )
    if (match) return match.price
  }

  // 2. Check match for size
  if (options?.size) {
    const match = product.variants.find((v) => v.size === options.size)
    if (match) return match.price
  }

  // 3. Check match for material
  if (options?.material) {
    const match = product.variants.find((v) => v.material === options.material)
    if (match) return match.price
  }

  return product.price
}

/** Formats the price or price range (e.g. "25 000 — 32 000 FCFA") */
export function formatProductPriceRange(product: Product): string {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => v.price)
    const min = Math.min(product.price, ...prices)
    const max = Math.max(product.price, ...prices)
    if (min !== max) {
      return `${min.toLocaleString('fr-FR')} — ${max.toLocaleString('fr-FR')} FCFA`
    }
  }

  if (product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice) {
    return `${product.minPrice.toLocaleString('fr-FR')} — ${product.maxPrice.toLocaleString('fr-FR')} FCFA`
  }

  return formatCFA(product.price)
}

export const PAYMENT_PROVIDERS: Record<
  PaymentProvider,
  { label: string; color: string; short: string }
> = {
  wave: { label: 'Wave', color: '#1DC8FF', short: 'W' },
  orange: { label: 'Orange Money', color: '#FF7900', short: 'OM' },
  mtn: { label: 'MTN MoMo', color: '#FFCC00', short: 'MTN' },
  moov: { label: 'Moov Money', color: '#0A5CB8', short: 'M' },
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  en_attente: 'En attente de paiement',
  paye: 'Payé — À livrer',
  livre: 'Livré avec succès',
}

export const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  domicile: 'Livraison à domicile',
  relais: 'Point relais',
  retrait: 'Retrait en boutique',
}

export function cleanPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '')
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const digits = cleanPhone(phone)
  const fullPhone = digits.startsWith('225') ? digits : `225${digits}`
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`
}
