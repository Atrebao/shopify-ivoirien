'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import {
  DEMO_SHOPS,
  DEMO_PRODUCTS,
  DEMO_ORDERS,
  DEMO_PAYOUTS,
  DEFAULT_PLATFORM_SETTINGS,
  SAAS_PLANS,
  CATEGORY_ATTRIBUTES,
  type Shop,
  type Product,
  type Order,
  type OrderStatus,
  type Payout,
  type PaymentProvider,
  type ShopStatus,
  type ShopPlan,
  type PlatformSettings,
  type SubscriptionPlan,
  type ColorVariant,
} from '@/lib/data'

// Re-export data types and helpers
export {
  formatCFA,
  getProductPrice,
  formatProductPriceRange,
  PAYMENT_PROVIDERS,
  STATUS_LABELS,
  DELIVERY_LABELS,
  ABIDJAN_COMMUNES,
  SHOP_CATEGORIES,
  CATEGORY_ATTRIBUTES,
  DEFAULT_PRODUCT_IMAGES,
  SAAS_PLANS,
  DEFAULT_PLATFORM_SETTINGS,
  generateWhatsAppLink,
  cleanPhone,
} from '@/lib/data'
export type {
  Shop,
  Product,
  ProductVariant,
  Order,
  OrderItem,
  OrderStatus,
  DeliveryMethod,
  PaymentProvider,
  Payout,
  ShopStatus,
  ShopPlan,
  PlatformSettings,
  SubscriptionPlan,
  ColorVariant,
} from '@/lib/data'

export interface GlobalAdminStats {
  totalGMV: number // Total Gross Merchandise Volume in FCFA
  totalCommissions: number // Total commission earned by Djassa platform
  totalShops: number
  totalShopsCount: number
  verifiedShopsCount: number
  totalOrders: number
  totalOrdersCount: number
  totalPayoutsCount: number
  totalPayoutsAmount: number
  activeSellersCount: number
  mobileMoneyShare: Record<string, number>
}

interface StoreContextValue {
  isHydrated: boolean
  shops: Shop[]
  products: Product[]
  orders: Order[]
  payouts: Payout[]
  platformSettings: PlatformSettings
  currentShopSlug: string
  setCurrentShopSlug: (slug: string) => void
  getShop: (slug: string) => Shop | undefined
  getProducts: (slug: string) => Product[]
  getProduct: (id: string) => Product | undefined
  getOrders: (slug: string) => Order[]
  getPayouts: (slug: string) => Payout[]
  createShop: (s: Omit<Shop, 'createdAt'>) => Shop
  updateShop: (slug: string, updates: Partial<Shop>) => void
  verifyShop: (slug: string) => void
  suspendShop: (slug: string) => void
  updateShopPlan: (slug: string, plan: ShopPlan) => void
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => Product
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  createOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void
  requestPayout: (params: {
    shopSlug: string
    amount: number
    provider: PaymentProvider
    phone: string
  }) => { success: boolean; payout?: Payout; error?: string }
  updatePayoutStatus: (id: string, status: 'effectue' | 'rejete') => void
  getFinancials: (slug: string) => {
    grossSales: number
    platformFee: number
    netEarnings: number
    totalWithdrawn: number
    availableBalance: number
    pendingOrdersCount: number
    paidOrdersCount: number
    deliveredOrdersCount: number
  }
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void
  getGlobalAdminStats: () => GlobalAdminStats
}

const StoreContext = createContext<StoreContextValue | null>(null)

const STORAGE_KEY_SHOPS = 'djassa_shops_v4'
const STORAGE_KEY_PRODUCTS = 'djassa_products_v4'
const STORAGE_KEY_ORDERS = 'djassa_orders_v4'
const STORAGE_KEY_PAYOUTS = 'djassa_payouts_v4'
const STORAGE_KEY_SETTINGS = 'djassa_settings_v4'
const STORAGE_KEY_CURRENT_SHOP = 'djassa_current_shop_v4'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<Shop[]>(DEMO_SHOPS)
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS)
  const [payouts, setPayouts] = useState<Payout[]>(DEMO_PAYOUTS)
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(
    DEFAULT_PLATFORM_SETTINGS,
  )
  const [currentShopSlug, setCurrentShopSlugState] = useState<string>('chez-awa')
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const savedShops = localStorage.getItem(STORAGE_KEY_SHOPS)
      if (savedShops) setShops(JSON.parse(savedShops))

      const savedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS)
      if (savedProducts) setProducts(JSON.parse(savedProducts))

      const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS)
      if (savedOrders) setOrders(JSON.parse(savedOrders))

      const savedPayouts = localStorage.getItem(STORAGE_KEY_PAYOUTS)
      if (savedPayouts) setPayouts(JSON.parse(savedPayouts))

      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS)
      if (savedSettings) setPlatformSettings(JSON.parse(savedSettings))

      const savedCurrentShop = localStorage.getItem(STORAGE_KEY_CURRENT_SHOP)
      if (savedCurrentShop) setCurrentShopSlugState(savedCurrentShop)
    } catch {
      // Ignore JSON parsing errors
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Sync to localStorage
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(shops))
    } catch {}
  }, [shops, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products))
    } catch {}
  }, [products, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders))
    } catch {}
  }, [orders, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(payouts))
    } catch {}
  }, [payouts, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(platformSettings))
    } catch {}
  }, [platformSettings, isHydrated])

  const setCurrentShopSlug = useCallback((slug: string) => {
    setCurrentShopSlugState(slug)
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_SHOP, slug)
    } catch {}
  }, [])

  const getShop = useCallback(
    (slug: string) => shops.find((s) => s.slug === slug),
    [shops],
  )

  const getProducts = useCallback(
    (slug: string) => products.filter((p) => p.shopSlug === slug),
    [products],
  )

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const getOrders = useCallback(
    (slug: string) =>
      orders
        .filter((o) => o.shopSlug === slug)
        .sort((a, b) => b.createdAt - a.createdAt),
    [orders],
  )

  const getPayouts = useCallback(
    (slug: string) =>
      payouts
        .filter((p) => p.shopSlug === slug)
        .sort((a, b) => b.createdAt - a.createdAt),
    [payouts],
  )

  const createShop = useCallback((s: Omit<Shop, 'createdAt'>) => {
    const newShop: Shop = {
      ...s,
      status: s.status || 'verifiee',
      plan: s.plan || 'starter',
      createdAt: Date.now(),
    }
    setShops((prev) => {
      const filtered = prev.filter((item) => item.slug !== newShop.slug)
      const updated = [newShop, ...filtered]
      try {
        localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(updated))
        localStorage.setItem(STORAGE_KEY_CURRENT_SHOP, newShop.slug)
      } catch {}
      return updated
    })
    setCurrentShopSlugState(newShop.slug)
    return newShop
  }, [])

  const updateShop = useCallback((slug: string, updates: Partial<Shop>) => {
    setShops((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, ...updates } : s)),
    )
  }, [])

  const verifyShop = useCallback((slug: string) => {
    setShops((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, status: 'verifiee' } : s)),
    )
  }, [])

  const suspendShop = useCallback((slug: string) => {
    setShops((prev) =>
      prev.map((s) =>
        s.slug === slug
          ? { ...s, status: s.status === 'suspendue' ? 'active' : 'suspendue' }
          : s,
      ),
    )
  }, [])

  const updateShopPlan = useCallback((slug: string, plan: ShopPlan) => {
    setShops((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, plan } : s)),
    )
  }, [])

  const addProduct = useCallback(
    (p: Omit<Product, 'id' | 'createdAt'>) => {
      const newProduct: Product = {
        ...p,
        id: `p-${Date.now()}`,
        images: p.images && p.images.length > 0 ? p.images : [p.image],
        createdAt: Date.now(),
      }
      setProducts((prev) => [newProduct, ...prev])
      return newProduct
    },
    [],
  )

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    )
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const createOrder = useCallback(
    (o: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
      const order: Order = {
        ...o,
        id: `CMD-${Math.floor(1043 + Math.random() * 9000)}`,
        createdAt: Date.now(),
        status: 'paye',
      }
      setOrders((prev) => [order, ...prev])

      // Decrease stock for ordered items
      setProducts((prev) =>
        prev.map((p) => {
          const item = o.items.find((it) => it.productId === p.id)
          if (item) {
            return { ...p, stock: Math.max(0, p.stock - item.qty) }
          }
          return p
        }),
      )

      return order
    },
    [],
  )

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }, [])

  const getFinancials = useCallback(
    (slug: string) => {
      const shopOrders = orders.filter((o) => o.shopSlug === slug)
      const shopPayouts = payouts.filter(
        (p) => p.shopSlug === slug && p.status === 'effectue',
      )

      const targetShop = shops.find((s) => s.slug === slug)
      const shopPlanObj = SAAS_PLANS.find((p) => p.id === (targetShop?.plan || 'starter'))
      const commissionRate = (shopPlanObj?.commissionRate ?? platformSettings.defaultCommissionRate) / 100

      const validOrders = shopOrders.filter(
        (o) => o.status === 'paye' || o.status === 'livre',
      )
      const grossSales = validOrders.reduce((sum, o) => sum + o.subtotal, 0)
      const platformFee = Math.round(grossSales * commissionRate)
      const netEarnings = grossSales - platformFee

      const totalWithdrawn = shopPayouts.reduce((sum, p) => sum + p.amount, 0)
      const availableBalance = Math.max(0, netEarnings - totalWithdrawn)

      return {
        grossSales,
        platformFee,
        netEarnings,
        totalWithdrawn,
        availableBalance,
        pendingOrdersCount: shopOrders.filter((o) => o.status === 'en_attente').length,
        paidOrdersCount: shopOrders.filter((o) => o.status === 'paye').length,
        deliveredOrdersCount: shopOrders.filter((o) => o.status === 'livre').length,
      }
    },
    [orders, payouts, shops, platformSettings],
  )

  const requestPayout = useCallback(
    (params: {
      shopSlug: string
      amount: number
      provider: PaymentProvider
      phone: string
    }) => {
      const { availableBalance } = getFinancials(params.shopSlug)
      if (params.amount < platformSettings.minWithdrawalAmount) {
        return {
          success: false,
          error: `Le montant minimum de retrait est de ${formatCFA(platformSettings.minWithdrawalAmount)}`,
        }
      }
      if (params.amount > availableBalance) {
        return { success: false, error: 'Solde disponible insuffisant' }
      }

      const withdrawalFee = platformSettings.fixedWithdrawalFee
      const newPayout: Payout = {
        id: `VIR-${Math.floor(1000 + Math.random() * 9000)}`,
        shopSlug: params.shopSlug,
        amount: params.amount,
        fee: withdrawalFee,
        netAmount: Math.max(0, params.amount - withdrawalFee),
        provider: params.provider,
        phone: params.phone,
        status: 'effectue',
        createdAt: Date.now(),
      }

      setPayouts((prev) => [newPayout, ...prev])
      return { success: true, payout: newPayout }
    },
    [getFinancials, platformSettings],
  )

  const updatePayoutStatus = useCallback((id: string, status: 'effectue' | 'rejete') => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }, [])

  const updatePlatformSettings = useCallback((settings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => ({ ...prev, ...settings }))
  }, [])

  const getGlobalAdminStats = useCallback((): GlobalAdminStats => {
    const validOrders = orders.filter((o) => o.status === 'paye' || o.status === 'livre')
    const totalGMV = validOrders.reduce((sum, o) => sum + o.subtotal, 0)
    const totalCommissions = validOrders.reduce((sum, o) => {
      const s = shops.find((shop) => shop.slug === o.shopSlug)
      const plan = SAAS_PLANS.find((p) => p.id === (s?.plan || 'starter'))
      const rate = (plan?.commissionRate ?? platformSettings.defaultCommissionRate) / 100
      return sum + Math.round(o.subtotal * rate)
    }, 0)

    const completedPayouts = payouts.filter((p) => p.status === 'effectue')
    const totalPayoutsAmount = completedPayouts.reduce((sum, p) => sum + p.amount, 0)

    const mobileMoneyShare: Record<string, number> = {
      wave: 0,
      orange: 0,
      mtn: 0,
      moov: 0,
    }
    orders.forEach((o) => {
      if (mobileMoneyShare[o.paymentProvider] !== undefined) {
        mobileMoneyShare[o.paymentProvider]++
      } else {
        mobileMoneyShare[o.paymentProvider] = 1
      }
    })

    return {
      totalGMV,
      totalCommissions,
      totalShops: shops.length,
      totalShopsCount: shops.length,
      verifiedShopsCount: shops.filter((s) => s.status === 'verifiee').length,
      totalOrders: orders.length,
      totalOrdersCount: orders.length,
      totalPayoutsCount: payouts.length,
      totalPayoutsAmount,
      activeSellersCount: new Set(shops.map((s) => s.phone)).size,
      mobileMoneyShare,
    }
  }, [orders, shops, payouts, platformSettings])

  const value = useMemo(
    () => ({
      isHydrated,
      shops,
      products,
      orders,
      payouts,
      platformSettings,
      currentShopSlug,
      setCurrentShopSlug,
      getShop,
      getProducts,
      getProduct,
      getOrders,
      getPayouts,
      createShop,
      updateShop,
      verifyShop,
      suspendShop,
      updateShopPlan,
      addProduct,
      updateProduct,
      deleteProduct,
      createOrder,
      updateOrderStatus,
      requestPayout,
      updatePayoutStatus,
      getFinancials,
      updatePlatformSettings,
      getGlobalAdminStats,
    }),
    [
      shops,
      products,
      orders,
      payouts,
      platformSettings,
      currentShopSlug,
      setCurrentShopSlug,
      getShop,
      getProducts,
      getProduct,
      getOrders,
      getPayouts,
      createShop,
      updateShop,
      verifyShop,
      suspendShop,
      updateShopPlan,
      addProduct,
      updateProduct,
      deleteProduct,
      createOrder,
      updateOrderStatus,
      requestPayout,
      updatePayoutStatus,
      getFinancials,
      updatePlatformSettings,
      getGlobalAdminStats,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
