'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Copy,
  CreditCard,
  DollarSign,
  ExternalLink,
  Eye,
  Filter,
  ImagePlus,
  Layers,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  Palette,
  Phone,
  Plus,
  QrCode,
  RefreshCw,
  Ruler,
  Scissors,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Upload,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/brand'
import { ShopAvatar } from '@/components/shop-avatar'
import {
  useStore,
  formatCFA,
  PAYMENT_PROVIDERS,
  STATUS_LABELS,
  DELIVERY_LABELS,
  ABIDJAN_COMMUNES,
  SHOP_CATEGORIES,
  CATEGORY_ATTRIBUTES,
  DEFAULT_PRODUCT_IMAGES,
  generateWhatsAppLink,
  type OrderStatus,
  type PaymentProvider,
  type DeliveryMethod,
  type ColorVariant,
} from '@/lib/store'

type TabType = 'apercu' | 'commandes' | 'produits' | 'liens' | 'finances' | 'parametres'

export default function DashboardPage() {
  const {
    shops,
    currentShopSlug,
    setCurrentShopSlug,
    getShop,
    getProducts,
    getOrders,
    getPayouts,
    addProduct,
    deleteProduct,
    updateProduct,
    updateOrderStatus,
    requestPayout,
    updateShop,
    getFinancials,
  } = useStore()

  const shop = getShop(currentShopSlug) || shops[0]
  const [activeTab, setActiveTab] = useState<TabType>('apercu')
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Add Product Form state
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategory, setNewCategory] = useState(SHOP_CATEGORIES[0])
  const [newDescription, setNewDescription] = useState('')
  const [newStock, setNewStock] = useState('10')
  const [imagesList, setImagesList] = useState<string[]>([DEFAULT_PRODUCT_IMAGES[0].url])
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  // Category-dependent variants state
  const categoryConfig = CATEGORY_ATTRIBUTES[newCategory] || CATEGORY_ATTRIBUTES['Autre']
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [customSizeInput, setCustomSizeInput] = useState('')
  const [selectedColors, setSelectedColors] = useState<ColorVariant[]>([])
  const [customColorName, setCustomColorName] = useState('')
  const [customColorHex, setCustomColorHex] = useState('#0f9d6b')
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [customMaterialInput, setCustomMaterialInput] = useState('')
  const [variantCustomPrices, setVariantCustomPrices] = useState<Record<string, string>>({})
  const [commissionPayer, setCommissionPayer] = useState<'seller' | 'buyer'>('seller')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Automatically update suggested variants when category changes
  useEffect(() => {
    const config = CATEGORY_ATTRIBUTES[newCategory] || CATEGORY_ATTRIBUTES['Autre']
    setSelectedSizes(config.suggestedSizes.slice(0, 4))
    setSelectedColors(config.suggestedColors.slice(0, 3))
    setSelectedMaterials(config.suggestedMaterials.slice(0, 2))
  }, [newCategory])

  // Payout Modal / Form state
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState('')
  const [payoutProvider, setPayoutProvider] = useState<PaymentProvider>(
    shop?.payoutProvider || 'wave',
  )
  const [payoutPhone, setPayoutPhone] = useState(shop?.payoutPhone || shop?.phone || '')
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('')
  const [payoutErrorMsg, setPayoutErrorMsg] = useState('')

  // Shop settings form state
  const [editName, setEditName] = useState(shop?.name || '')
  const [editTagline, setEditTagline] = useState(shop?.tagline || '')
  const [editPhone, setEditPhone] = useState(shop?.phone || '')
  const [editWhatsapp, setEditWhatsapp] = useState(shop?.whatsapp || '')
  const [editCommunes, setEditCommunes] = useState<string[]>(shop?.communes || [])
  const [editDefaultDeliveryFee, setEditDefaultDeliveryFee] = useState(
    shop?.defaultDeliveryFee?.toString() || '1500',
  )
  const [editFreeDelivery, setEditFreeDelivery] = useState(shop?.freeDelivery || false)
  const [editDeliveryRates, setEditDeliveryRates] = useState<Record<string, number>>(
    shop?.deliveryRates || {},
  )
  const [settingsSaved, setSettingsSaved] = useState(false)

  const products = useMemo(() => getProducts(shop?.slug || ''), [getProducts, shop])
  const orders = useMemo(() => getOrders(shop?.slug || ''), [getOrders, shop])
  const payouts = useMemo(() => getPayouts(shop?.slug || ''), [getPayouts, shop])
  const financials = useMemo(() => getFinancials(shop?.slug || ''), [getFinancials, shop])

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return orders
    return orders.filter((o) => o.status === orderFilter)
  }, [orders, orderFilter])

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2500)
  }

  // Handle Photo Upload from Phone Camera or Gallery
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        if (result) {
          setImagesList((prev) => [result, ...prev])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImage(idx: number) {
    setImagesList((prev) => {
      const updated = prev.filter((_, i) => i !== idx)
      return updated.length > 0 ? updated : [DEFAULT_PRODUCT_IMAGES[0].url]
    })
    setActiveImageIdx(0)
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  }

  function addCustomSize() {
    if (!customSizeInput.trim()) return
    if (!selectedSizes.includes(customSizeInput.trim())) {
      setSelectedSizes((prev) => [...prev, customSizeInput.trim()])
    }
    setCustomSizeInput('')
  }

  function toggleColor(color: ColorVariant) {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.name.toLowerCase() === color.name.toLowerCase())
      return exists
        ? prev.filter((c) => c.name.toLowerCase() !== color.name.toLowerCase())
        : [...prev, color]
    })
  }

  function addCustomColor() {
    if (!customColorName.trim()) return
    setSelectedColors((prev) => [
      ...prev,
      { name: customColorName.trim(), hex: customColorHex },
    ])
    setCustomColorName('')
  }

  function toggleMaterial(material: string) {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material],
    )
  }

  function addCustomMaterial() {
    if (!customMaterialInput.trim()) return
    if (!selectedMaterials.includes(customMaterialInput.trim())) {
      setSelectedMaterials((prev) => [...prev, customMaterialInput.trim()])
    }
    setCustomMaterialInput('')
  }

  function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !newPrice.trim()) return

    const primaryImg = imagesList[activeImageIdx] || imagesList[0] || DEFAULT_PRODUCT_IMAGES[0].url
    const rawPrice = parseInt(newPrice, 10) || 0
    const currentPlan = SAAS_PLANS.find((p) => p.id === (shop?.plan || 'starter'))
    const commRate = currentPlan?.commissionRate ?? platformSettings.defaultCommissionRate
    const commAmt = Math.round((rawPrice * commRate) / 100)
    const basePriceNum = commissionPayer === 'buyer' ? rawPrice + commAmt : rawPrice
    const totalStockNum = parseInt(newStock, 10) || 1

    const variantsList: any[] = []

    if (selectedSizes.length > 0) {
      selectedSizes.forEach((size, idx) => {
        const customP = parseInt(variantCustomPrices[size], 10)
        variantsList.push({
          id: `v-${idx}-${Date.now()}`,
          name: `Taille ${size}`,
          size,
          price: customP && customP > 0 ? customP : basePriceNum,
          stock: Math.max(1, Math.floor(totalStockNum / selectedSizes.length) || 1),
        })
      })
    } else if (selectedMaterials.length > 0) {
      selectedMaterials.forEach((mat, idx) => {
        const customP = parseInt(variantCustomPrices[mat], 10)
        variantsList.push({
          id: `vm-${idx}-${Date.now()}`,
          name: mat,
          material: mat,
          price: customP && customP > 0 ? customP : basePriceNum,
          stock: Math.max(1, Math.floor(totalStockNum / selectedMaterials.length) || 1),
        })
      })
    }

    const allPrices = variantsList.length > 0 ? variantsList.map((v) => v.price) : [basePriceNum]
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)

    addProduct({
      shopSlug: shop.slug,
      title: newTitle.trim(),
      price: basePriceNum,
      minPrice,
      maxPrice,
      description: newDescription.trim() || 'Article disponible en stock.',
      category: newCategory,
      stock: totalStockNum,
      image: primaryImg,
      images: imagesList,
      sizes: selectedSizes,
      colors: selectedColors,
      materials: selectedMaterials,
      variants: variantsList,
    })

    setNewTitle('')
    setNewPrice('')
    setNewDescription('')
    setVariantCustomPrices({})
    setShowAddProduct(false)
  }

  function handleRequestPayout(e: React.FormEvent) {
    e.preventDefault()
    setPayoutErrorMsg('')
    setPayoutSuccessMsg('')

    const amountNum = parseInt(payoutAmount, 10)
    if (!amountNum || amountNum < 1000) {
      setPayoutErrorMsg('Le montant minimum de retrait est de 1 000 FCFA')
      return
    }

    const res = requestPayout({
      shopSlug: shop.slug,
      amount: amountNum,
      provider: payoutProvider,
      phone: payoutPhone,
    })

    if (!res.success) {
      setPayoutErrorMsg(res.error || 'Erreur lors du retrait')
    } else {
      setPayoutSuccessMsg(
        `Virement Mobile Money de ${formatCFA(res.payout?.netAmount || 0)} envoyé avec succès sur votre compte ${PAYMENT_PROVIDERS[payoutProvider].label} !`,
      )
      setPayoutAmount('')
      setTimeout(() => {
        setShowPayoutModal(false)
        setPayoutSuccessMsg('')
      }, 2500)
    }
  }

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    updateShop(shop.slug, {
      name: editName.trim(),
      tagline: editTagline.trim(),
      phone: editPhone.trim(),
      whatsapp: editWhatsapp.trim(),
      communes: editCommunes,
      defaultDeliveryFee: parseInt(editDefaultDeliveryFee, 10) || 1500,
      freeDelivery: editFreeDelivery,
      deliveryRates: editDeliveryRates,
    })
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2500)
  }

  function toggleSettingsCommune(commune: string) {
    setEditCommunes((prev) =>
      prev.includes(commune) ? prev.filter((c) => c !== commune) : [...prev, commune],
    )
  }

  if (!shop) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center p-6 text-center">
        <div className="space-y-4">
          <p className="text-lg font-semibold">Aucune boutique sélectionnée</p>
          <Button asChild>
            <Link href="/inscription">Créer une boutique</Link>
          </Button>
        </div>
      </div>
    )
  }

  const shopUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/boutique/${shop.slug}`
    : `https://djassa.ci/boutique/${shop.slug}`

  return (
    <div className="min-h-dvh bg-muted/20 pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary px-2.5 py-0.5">
              Vendeur
            </span>
          </div>

          {/* Seller Shop Identity & Quick Actions */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 border border-border/70 rounded-full py-1 px-2.5 bg-card/80">
              <ShopAvatar shop={shop} className="size-6 text-[10px]" />
              <span className="text-xs font-bold text-foreground max-w-[140px] truncate">
                {shop.name}
              </span>
            </div>

            <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <Link href={`/boutique/${shop.slug}`} target="_blank">
                <Eye className="size-3.5" />
                <span className="hidden sm:inline">Ma vitrine</span>
                <ExternalLink className="size-3 opacity-60" />
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive">
              <Link href="/connexion" title="Se déconnecter">
                <LogOut className="size-3.5" />
                <span className="hidden md:inline ml-1">Déconnexion</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-6xl px-4 flex gap-2 overflow-x-auto border-t border-border/40 py-2 scrollbar-none">
          {[
            { id: 'apercu', label: 'Aperçu & Stats', icon: TrendingUp },
            {
              id: 'commandes',
              label: 'Commandes',
              icon: PackageCheck,
              badge: financials.paidOrdersCount > 0 ? financials.paidOrdersCount : null,
            },
            { id: 'produits', label: 'Produits & Variantes', icon: Package, badge: products.length },
            { id: 'liens', label: 'Liens & Bio Instagram', icon: Share2 },
            { id: 'finances', label: 'Cagnotte & Retraits', icon: Wallet },
            { id: 'parametres', label: 'Paramètres', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/70'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
                {tab.badge !== null && tab.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                      active
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* TAB 1: APERÇU */}
        {activeTab === 'apercu' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-4">
                <ShopAvatar shop={shop} className="size-16 text-xl" />
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-foreground">
                    {shop.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">{shop.tagline}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Phone className="size-3" /> {shop.phone} · <MapPin className="size-3" /> Abidjan
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setActiveTab('produits')
                    setShowAddProduct(true)
                  }}
                  className="gap-1.5 h-10 font-semibold"
                >
                  <Plus className="size-4" /> Ajouter un article
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(shopUrl, 'shop-url-header')}
                  className="gap-1.5 h-10"
                >
                  {copiedKey === 'shop-url-header' ? (
                    <>
                      <Check className="size-4 text-emerald-600" /> Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" /> Copier mon lien
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>Solde disponible</span>
                  <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Wallet className="size-4" />
                  </span>
                </div>
                <p className="font-display text-2xl font-extrabold text-foreground">
                  {formatCFA(financials.availableBalance)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('finances')
                    setShowPayoutModal(true)
                  }}
                  className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 pt-1"
                >
                  Demander un retrait <ArrowUpRight className="size-3" />
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>Ventes totales</span>
                  <span className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="size-4" />
                  </span>
                </div>
                <p className="font-display text-2xl font-extrabold text-foreground">
                  {formatCFA(financials.grossSales)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Commission Djassa : {formatCFA(financials.platformFee)} (2.5%)
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>À expédier</span>
                  <span className="grid size-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Truck className="size-4" />
                  </span>
                </div>
                <p className="font-display text-2xl font-extrabold text-foreground">
                  {financials.paidOrdersCount}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('commandes')
                    setOrderFilter('paye')
                  }}
                  className="text-xs font-bold text-amber-600 hover:underline inline-flex items-center gap-1"
                >
                  Voir les commandes <ArrowRight className="size-3" />
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                  <span>Articles au catalogue</span>
                  <span className="grid size-8 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
                    <Package className="size-4" />
                  </span>
                </div>
                <p className="font-display text-2xl font-extrabold text-foreground">
                  {products.length}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('produits')}
                  className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Gérer le catalogue <ArrowRight className="size-3" />
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    Dernières commandes
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Acheteurs ayant commandé via vos liens
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('commandes')}
                  className="text-xs text-primary font-semibold"
                >
                  Toutes les commandes ({orders.length})
                </Button>
              </div>

              {orders.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm space-y-2">
                  <Package className="mx-auto size-10 opacity-40" />
                  <p>Aucune commande reçue pour le moment.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 gap-2 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-foreground">#{order.id}</span>
                        <div>
                          <p className="font-bold text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.commune} · {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <span className="font-extrabold text-foreground">{formatCFA(order.total)}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            order.status === 'paye'
                              ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                              : order.status === 'livre'
                              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                              : 'bg-secondary text-muted-foreground border border-border'
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMMANDES */}
        {activeTab === 'commandes' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-foreground">
                  Gestion des Commandes
                </h1>
                <p className="text-sm text-muted-foreground">
                  Suivez vos commandes et contactez les acheteurs directement sur WhatsApp avec détails de variantes.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 bg-card border border-border rounded-2xl p-1 text-xs">
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'paye', label: 'Payé — À livrer' },
                  { id: 'en_attente', label: 'En attente' },
                  { id: 'livre', label: 'Livré' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setOrderFilter(f.id as any)}
                    className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                      orderFilter === f.id
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground space-y-2">
                <ShoppingBag className="mx-auto size-12 opacity-30" />
                <p className="font-semibold">Aucune commande dans cette catégorie</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-extrabold text-foreground">
                          #{order.id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className={`rounded-xl border px-3 py-1 text-xs font-bold focus:outline-none ${
                            order.status === 'paye'
                              ? 'border-amber-500 bg-amber-500/10 text-amber-700'
                              : order.status === 'livre'
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700'
                              : 'border-muted-foreground/30 bg-secondary text-muted-foreground'
                          }`}
                        >
                          <option value="paye">Payé — À livrer</option>
                          <option value="livre">Livré</option>
                          <option value="en_attente">En attente de paiement</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* Customer info */}
                      <div className="space-y-1 rounded-2xl bg-secondary/40 p-3.5">
                        <p className="text-xs font-semibold text-muted-foreground">Acheteur</p>
                        <p className="font-bold text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="size-3" /> {order.customerPhone}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="size-3 text-primary" /> {order.commune} (
                          {DELIVERY_LABELS[order.deliveryMethod]})
                        </p>
                      </div>

                      {/* Items with Variants */}
                      <div className="space-y-1 rounded-2xl bg-secondary/40 p-3.5">
                        <p className="text-xs font-semibold text-muted-foreground">Articles & Variantes</p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-xs">
                              <p className="font-bold text-foreground">
                                {item.qty}x {item.title}
                              </p>
                              {(item.size || item.color || item.material) && (
                                <p className="text-[11px] text-primary font-medium">
                                  {[
                                    item.size && `Taille: ${item.size}`,
                                    item.color && `Couleur: ${item.color}`,
                                    item.material && `Matière: ${item.material}`,
                                  ]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </p>
                              )}
                              <p className="text-muted-foreground">{formatCFA(item.price * item.qty)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total & WhatsApp Button */}
                      <div className="space-y-2 rounded-2xl bg-secondary/40 p-3.5 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">Paiement</p>
                          <p className="text-base font-extrabold text-primary">
                            {formatCFA(order.total)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Via {PAYMENT_PROVIDERS[order.paymentProvider]?.label || 'Mobile Money'}
                          </p>
                        </div>

                        {(() => {
                          const msg = `Bonjour ${order.customerName} ! 👋
C'est ${shop.name}. Votre commande *#${order.id}* d'un montant de *${formatCFA(order.total)}* est enregistrée.

📍 *Livraison :* ${order.commune}
📦 *Articles :*
${order.items
  .map(
    (it) =>
      `• ${it.qty}x ${it.title} ${
        it.size || it.color || it.material
          ? `(${[it.size, it.color, it.material].filter(Boolean).join(', ')})`
          : ''
      }`,
  )
  .join('\n')}

Notre livreur va vous contacter au ${order.customerPhone}. Merci !`

                          const waLink = generateWhatsAppLink(order.customerPhone, msg)
                          return (
                            <Button
                              asChild
                              size="sm"
                              className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            >
                              <a href={waLink} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="size-3.5 mr-1" />
                                Contacter sur WhatsApp
                              </a>
                            </Button>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUITS AVEC VARIANTES DYNAMIQUES & UPLOAD PHOTO */}
        {activeTab === 'produits' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-foreground">
                  Catalogue Produits & Variantes ({products.length})
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gérez vos articles, vos photos multiples et vos variantes de tailles, couleurs et matières.
                </p>
              </div>
              <Button
                onClick={() => setShowAddProduct(true)}
                className="h-11 gap-1.5 font-semibold bg-primary text-primary-foreground"
              >
                <Plus className="size-4" />
                Ajouter un article avec variantes
              </Button>
            </div>

            {/* Complete Product Creation Form with Variants */}
            {showAddProduct && (
              <form
                onSubmit={handleCreateProduct}
                className="rounded-3xl border-2 border-primary/40 bg-card p-6 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Nouvel article avec photos & variantes
                    </h2>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddProduct(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                {/* Main Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="prod-cat">1. Catégorie de l&apos;article *</Label>
                      <select
                        id="prod-cat"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="h-11 w-full rounded-xl border border-primary/50 bg-primary/5 px-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {SHOP_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground">
                        Les suggestions de tailles, couleurs et matières s&apos;adaptent automatiquement à cette catégorie !
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="prod-title">Nom de l&apos;article *</Label>
                      <Input
                        id="prod-title"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ex. Robe trapèze en wax, Sandales cuir artisanales..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="prod-price">Prix de base (FCFA) *</Label>
                        <Input
                          id="prod-price"
                          type="number"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="Ex. 25000"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="prod-stock">Quantité en stock</Label>
                        <Input
                          id="prod-stock"
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          placeholder="10"
                        />
                      </div>
                    </div>

                    {/* Platform Commission Simulator */}
                    {parseInt(newPrice, 10) > 0 && (() => {
                      const currentPlan = SAAS_PLANS.find((p) => p.id === (shop?.plan || 'starter'))
                      const commRate = currentPlan?.commissionRate ?? platformSettings.defaultCommissionRate
                      const rawP = parseInt(newPrice, 10) || 0
                      const commAmt = Math.round((rawP * commRate) / 100)
                      const finalClientPrice = commissionPayer === 'buyer' ? rawP + commAmt : rawP
                      const netSellerGain = commissionPayer === 'buyer' ? rawP : Math.max(0, rawP - commAmt)

                      return (
                        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                              <Coins className="size-3.5 text-amber-600" /> Prise en charge commission Djassa ({commRate}%) :
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => setCommissionPayer('seller')}
                              className={`rounded-xl border p-2.5 text-left transition ${
                                commissionPayer === 'seller'
                                  ? 'border-primary bg-primary/10 ring-1 ring-primary font-bold text-foreground'
                                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>Le Vendeur (Moi)</span>
                                {commissionPayer === 'seller' && <Check className="size-3.5 text-primary" />}
                              </div>
                              <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                                Prix net rond pour le client
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setCommissionPayer('buyer')}
                              className={`rounded-xl border p-2.5 text-left transition ${
                                commissionPayer === 'buyer'
                                  ? 'border-primary bg-primary/10 ring-1 ring-primary font-bold text-foreground'
                                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>Le Client (Acheteur)</span>
                                {commissionPayer === 'buyer' && <Check className="size-3.5 text-primary" />}
                              </div>
                              <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                                Frais ajoutés au prix client
                              </p>
                            </button>
                          </div>

                          {/* Simulation Breakdown Cards */}
                          <div className="rounded-xl bg-card border border-border/80 p-2.5 text-[11px] space-y-1.5">
                            <div className="flex justify-between text-muted-foreground">
                              <span>Prix affiché sur la boutique (client) :</span>
                              <span className="font-bold text-foreground">{formatCFA(finalClientPrice)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Commission Djassa ({commRate}%) :</span>
                              <span className="font-semibold text-amber-700">-{formatCFA(commAmt)}</span>
                            </div>
                            <div className="flex justify-between text-foreground border-t border-border/60 pt-1.5 font-bold">
                              <span>Gain net crédité sur votre cagnotte :</span>
                              <span className="text-emerald-600 font-extrabold">{formatCFA(netSellerGain)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })()}

                    <div className="space-y-1.5">
                      <Label htmlFor="prod-desc">Description</Label>
                      <Input
                        id="prod-desc"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Détails, finitions, conseils d'entretien..."
                      />
                    </div>
                  </div>

                  {/* Multi-Photo Upload Section */}
                  <div className="space-y-3 rounded-2xl border border-border bg-secondary/30 p-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-1.5 text-xs font-bold">
                        <Camera className="size-4 text-primary" /> Photos de l&apos;article ({imagesList.length})
                      </Label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                      >
                        <Upload className="size-3" /> Importer / Caméra
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>

                    {/* Image Previews list */}
                    <div className="grid grid-cols-3 gap-2">
                      {imagesList.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                            activeImageIdx === idx ? 'border-primary ring-2 ring-primary/40' : 'border-border'
                          }`}
                        >
                          <Image
                            src={img}
                            alt="Aperçu produit"
                            fill
                            className="object-cover cursor-pointer"
                            onClick={() => setActiveImageIdx(idx)}
                          />
                          {activeImageIdx === idx && (
                            <span className="absolute top-1 left-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white">
                              Principale
                            </span>
                          )}
                          {imagesList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-black/70 text-white hover:bg-destructive"
                            >
                              <X className="size-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-muted-foreground pt-1">
                      Sélectionnez une photo pré-chargée de démonstration :
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {DEFAULT_PRODUCT_IMAGES.map((img) => (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => setImagesList((prev) => [img.url, ...prev])}
                          className="shrink-0 relative size-12 rounded-lg overflow-hidden border border-border hover:border-primary"
                        >
                          <Image src={img.url} alt={img.label} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category-Specific Variants Configuration */}
                <div className="space-y-5 pt-4 border-t border-border">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Layers className="size-4" /> Variantes adaptées : {newCategory}
                  </h3>

                  {/* 1. SIZES */}
                  <div className="space-y-2 rounded-2xl bg-secondary/30 p-4 border border-border">
                    <Label className="flex items-center gap-1.5 text-xs font-bold">
                      <Ruler className="size-3.5 text-primary" /> {categoryConfig.sizesLabel}
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {categoryConfig.suggestedSizes.map((size) => {
                        const active = selectedSizes.includes(size)
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                              active
                                ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                                : 'border-border bg-card text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {active && <Check className="inline-block size-3 mr-1" />}
                            {size}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex gap-2 pt-1 max-w-sm">
                      <Input
                        value={customSizeInput}
                        onChange={(e) => setCustomSizeInput(e.target.value)}
                        placeholder="Autre taille personnalisée..."
                        className="h-8 text-xs"
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 text-xs" onClick={addCustomSize}>
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* 2. COLORS */}
                  <div className="space-y-2 rounded-2xl bg-secondary/30 p-4 border border-border">
                    <Label className="flex items-center gap-1.5 text-xs font-bold">
                      <Palette className="size-3.5 text-primary" /> Couleurs disponibles
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {categoryConfig.suggestedColors.map((color) => {
                        const active = selectedColors.some(
                          (c) => c.name.toLowerCase() === color.name.toLowerCase(),
                        )
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => toggleColor(color)}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                              active
                                ? 'border-primary bg-primary/10 ring-1 ring-primary text-foreground'
                                : 'border-border bg-card text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <span
                              className="size-3.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                            {active && <Check className="size-3 text-primary ml-0.5" />}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex gap-2 pt-1 max-w-md items-center">
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(e.target.value)}
                        className="size-8 rounded-lg cursor-pointer border border-border"
                      />
                      <Input
                        value={customColorName}
                        onChange={(e) => setCustomColorName(e.target.value)}
                        placeholder="Nom de couleur personnalisée (ex: Vert Bazin)..."
                        className="h-8 text-xs flex-1"
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 text-xs" onClick={addCustomColor}>
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* 3. MATERIALS */}
                  <div className="space-y-2 rounded-2xl bg-secondary/30 p-4 border border-border">
                    <Label className="flex items-center gap-1.5 text-xs font-bold">
                      <Scissors className="size-3.5 text-primary" /> {categoryConfig.materialsLabel}
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {categoryConfig.suggestedMaterials.map((material) => {
                        const active = selectedMaterials.includes(material)
                        return (
                          <button
                            key={material}
                            type="button"
                            onClick={() => toggleMaterial(material)}
                            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                              active
                                ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                                : 'border-border bg-card text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {active && <Check className="inline-block size-3 mr-1" />}
                            {material}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex gap-2 pt-1 max-w-sm">
                      <Input
                        value={customMaterialInput}
                        onChange={(e) => setCustomMaterialInput(e.target.value)}
                        placeholder="Autre matière (ex: Bogolan)..."
                        className="h-8 text-xs"
                      />
                      <Button type="button" size="sm" variant="outline" className="h-8 text-xs" onClick={addCustomMaterial}>
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* 4. PRICING PER VARIANT */}
                  {(selectedSizes.length > 0 || selectedMaterials.length > 0) && (
                    <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <Label className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                          <Coins className="size-4 text-amber-600" /> Grille des Prix par Variante (Optionnel)
                        </Label>
                        <span className="text-[11px] text-muted-foreground">
                          Laissez vide si le prix est identique au prix de base ({formatCFA(parseInt(newPrice, 10) || 0)})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {(selectedSizes.length > 0 ? selectedSizes : selectedMaterials).map((variantKey) => (
                          <div key={variantKey} className="rounded-xl border border-border bg-card p-2.5 space-y-1">
                            <p className="text-xs font-bold text-foreground truncate">{variantKey}</p>
                            <div className="relative">
                              <Input
                                type="number"
                                value={variantCustomPrices[variantKey] || ''}
                                onChange={(e) =>
                                  setVariantCustomPrices((prev) => ({
                                    ...prev,
                                    [variantKey]: e.target.value,
                                  }))
                                }
                                placeholder={newPrice || '25000'}
                                className="h-8 text-xs font-semibold pr-11"
                              />
                              <span className="absolute right-2 top-2 text-[10px] font-bold text-muted-foreground">
                                FCFA
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="h-11 px-8 font-bold bg-primary text-primary-foreground">
                    Publier l&apos;article avec ses variantes
                  </Button>
                </div>
              </form>
            )}

            {/* Product Cards with Variants Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => {
                const productUrl = `${shopUrl}/${product.id}`
                const isOutOfStock = product.stock <= 0
                return (
                  <div
                    key={product.id}
                    className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square w-full bg-muted overflow-hidden">
                        <Image
                          src={product.image || '/placeholder.svg'}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-white">
                              Rupture de stock
                            </span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                          {product.category}
                        </span>
                        {product.images && product.images.length > 1 && (
                          <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1">
                            <Camera className="size-3" /> {product.images.length} photos
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="font-display text-lg font-extrabold text-primary">
                          {formatCFA(product.price)}
                        </p>

                        {/* Variants chips preview */}
                        <div className="space-y-1 pt-1 border-t border-border/60 text-[11px]">
                          {product.sizes && product.sizes.length > 0 && (
                            <p className="text-muted-foreground flex items-center gap-1">
                              <span className="font-semibold text-foreground">Tailles :</span>{' '}
                              {product.sizes.join(', ')}
                            </p>
                          )}
                          {product.colors && product.colors.length > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground flex-wrap">
                              <span className="font-semibold text-foreground">Couleurs :</span>
                              {product.colors.map((c) => (
                                <span key={c.name} className="inline-flex items-center gap-0.5">
                                  <span
                                    className="size-2 rounded-full border border-black/20"
                                    style={{ backgroundColor: c.hex }}
                                  />
                                  {c.name}
                                </span>
                              ))}
                            </div>
                          )}
                          {product.materials && product.materials.length > 0 && (
                            <p className="text-muted-foreground flex items-center gap-1">
                              <span className="font-semibold text-foreground">Matière :</span>{' '}
                              {product.materials.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
                        <span>Stock : {product.stock} dispo</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateProduct(product.id, {
                              stock: isOutOfStock ? 10 : 0,
                            })
                          }
                          className="font-semibold text-primary hover:underline"
                        >
                          {isOutOfStock ? 'Remettre en stock' : 'Marquer rupture'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8"
                          onClick={() => copyToClipboard(productUrl, `prod-${product.id}`)}
                        >
                          {copiedKey === `prod-${product.id}` ? (
                            <>
                              <Check className="size-3.5 text-emerald-600 mr-1" /> Lien copié !
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5 mr-1" /> Copier lien
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className="h-8 px-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 4: LIENS & BIO INSTAGRAM */}
        {activeTab === 'liens' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-foreground">
                Liens & Partage Bio Instagram / WhatsApp
              </h1>
              <p className="text-sm text-muted-foreground">
                Collez ces liens et modèles de messages pour convertir vos abonnés en acheteurs immédiats.
              </p>
            </div>

            {/* Main Shop Link Banner */}
            <div className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Lien unique de votre boutique
                  </span>
                  <p className="font-mono text-base sm:text-lg font-extrabold text-foreground mt-1 break-all">
                    {shopUrl}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    À placer dans votre bio Instagram, TikTok et statut WhatsApp.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="lg"
                    onClick={() => copyToClipboard(shopUrl, 'main-shop-link')}
                    className="font-semibold"
                  >
                    {copiedKey === 'main-shop-link' ? (
                      <>
                        <Check className="size-4 mr-1.5" /> Lien copié !
                      </>
                    ) : (
                      <>
                        <Copy className="size-4 mr-1.5" /> Copier le lien
                      </>
                    )}
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href={`/boutique/${shop.slug}`} target="_blank">
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Ready-to-use Marketing Scripts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instagram Bio Template */}
              <div className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-foreground">
                    Modèle pour Bio Instagram
                  </h3>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      const text = `✨ ${shop.name} | ${shop.tagline}
🛍️ Commandez directement sans « prix en inbox » 👇
🔗 ${shopUrl}
⚡ Paiement sécurisé Wave & Orange Money
🚚 Livraison partout à Abidjan`
                      copyToClipboard(text, 'bio-template')
                    }}
                  >
                    {copiedKey === 'bio-template' ? 'Copié !' : 'Copier le texte'}
                  </Button>
                </div>
                <div className="rounded-2xl bg-secondary/50 p-4 font-mono text-xs text-foreground/90 whitespace-pre-line leading-relaxed">
                  {`✨ ${shop.name} | ${shop.tagline}
🛍️ Commandez directement sans « prix en inbox » 👇
🔗 ${shopUrl}
⚡ Paiement sécurisé Wave & Orange Money
🚚 Livraison partout à Abidjan`}
                </div>
              </div>

              {/* Instagram DM Response Template */}
              <div className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-foreground">
                    Réponse automatique en DM
                  </h3>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      const text = `Bonjour ! 😊
Tous nos articles sont disponibles avec prix et stock transparents sur notre boutique :
👉 ${shopUrl}

Vous pouvez passer commande en 1 minute, payer directement par Wave ou Orange Money et être livré à domicile !`
                      copyToClipboard(text, 'dm-template')
                    }}
                  >
                    {copiedKey === 'dm-template' ? 'Copié !' : 'Copier la réponse'}
                  </Button>
                </div>
                <div className="rounded-2xl bg-secondary/50 p-4 font-mono text-xs text-foreground/90 whitespace-pre-line leading-relaxed">
                  {`Bonjour ! 😊
Tous nos articles sont disponibles avec prix et stock transparents sur notre boutique :
👉 ${shopUrl}

Vous pouvez passer commande en 1 minute, payer directement par Wave ou Orange Money et être livré à domicile !`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FINANCES & CAGNOTTE */}
        {activeTab === 'finances' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-foreground">
                  Cagnotte & Reversements Mobile Money
                </h1>
                <p className="text-sm text-muted-foreground">
                  Encaissez l&apos;argent de vos ventes et virez-le sur votre compte Wave ou Orange Money.
                </p>
              </div>

              <Button
                onClick={() => setShowPayoutModal(true)}
                className="h-11 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Wallet className="size-4" /> Demander un retrait
              </Button>
            </div>

            {/* Financial Balance Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Solde disponible à retirer
                </p>
                <p className="font-display text-3xl font-extrabold text-emerald-800">
                  {formatCFA(financials.availableBalance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Frais fixes de retrait : 100 FCFA
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Ventes brutes cumulées
                </p>
                <p className="font-display text-3xl font-extrabold text-foreground">
                  {formatCFA(financials.grossSales)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Commission Djassa retenue (2.5%) : {formatCFA(financials.platformFee)}
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Total déjà viré
                </p>
                <p className="font-display text-3xl font-extrabold text-foreground">
                  {formatCFA(financials.totalWithdrawn)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {payouts.length} virement{payouts.length > 1 ? 's' : ''} effectué{payouts.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Payout Request Modal / Form */}
            {showPayoutModal && (
              <form
                onSubmit={handleRequestPayout}
                className="rounded-3xl border-2 border-emerald-500/40 bg-card p-6 shadow-xl space-y-5 animate-in slide-in-from-top-4 duration-300"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <Wallet className="size-5 text-emerald-600" />
                    Virement Mobile Money instantané
                  </h2>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPayoutModal(false)}
                  >
                    Fermer
                  </Button>
                </div>

                {payoutSuccessMsg && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="size-5 shrink-0" />
                    {payoutSuccessMsg}
                  </div>
                )}

                {payoutErrorMsg && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                    {payoutErrorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="p-amount">Montant à retirer en FCFA *</Label>
                    <Input
                      id="p-amount"
                      type="number"
                      required
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder={`Max: ${financials.availableBalance}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                      <span>Min: 1 000 FCFA</span>
                      <button
                        type="button"
                        onClick={() => setPayoutAmount(financials.availableBalance.toString())}
                        className="text-primary font-bold hover:underline"
                      >
                        Retirer tout le solde
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="p-phone">Numéro de réception (+225) *</Label>
                    <Input
                      id="p-phone"
                      type="tel"
                      required
                      value={payoutPhone}
                      onChange={(e) => setPayoutPhone(e.target.value)}
                      placeholder="+225 07 00 00 00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Opérateur Mobile Money de destination</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(PAYMENT_PROVIDERS) as PaymentProvider[]).map((key) => {
                      const info = PAYMENT_PROVIDERS[key]
                      const active = payoutProvider === key
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPayoutProvider(key)}
                          className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                            active
                              ? 'border-emerald-600 bg-emerald-600/10 ring-1 ring-emerald-600'
                              : 'border-border bg-card hover:border-emerald-600/40'
                          }`}
                        >
                          <span
                            className="grid size-6 place-items-center rounded-full text-[10px] font-bold text-white"
                            style={{ backgroundColor: info.color }}
                          >
                            {info.short}
                          </span>
                          <span>{info.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPayoutModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 px-6"
                  >
                    Valider le virement Mobile Money
                  </Button>
                </div>
              </form>
            )}

            {/* Payout History */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="font-display text-lg font-bold text-foreground">
                Historique des retraits & virements
              </h2>

              {payouts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Aucun retrait effectué pour le moment.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {payouts.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">
                          <ArrowDownLeft className="size-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-foreground">
                            Virement {PAYMENT_PROVIDERS[p.provider]?.label} ({p.phone})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Réf: {p.id} · {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-foreground">{formatCFA(p.amount)}</p>
                        <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Virement réussi
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: PARAMÈTRES */}
        {activeTab === 'parametres' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-foreground">
                Paramètres de la Boutique
              </h1>
              <p className="text-sm text-muted-foreground">
                Configurez les détails visibles par vos acheteurs et vos zones de livraison.
              </p>
            </div>

            <form
              onSubmit={handleSaveSettings}
              className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5"
            >
              {settingsSaved && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="size-5 shrink-0" />
                  Modifications enregistrées avec succès !
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="s-name">Nom de la boutique</Label>
                  <Input
                    id="s-name"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="s-tagline">Slogan</Label>
                  <Input
                    id="s-tagline"
                    value={editTagline}
                    onChange={(e) => setEditTagline(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="s-phone">Numéro de contact</Label>
                  <Input
                    id="s-phone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="s-wa">Numéro WhatsApp (commandes)</Label>
                  <Input
                    id="s-wa"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                  />
                </div>
              </div>

              {/* Delivery Configuration */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <Label className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                      <Truck className="size-4 text-primary" /> Configuration des Frais de Livraison
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Définissez vos tarifs de livraison selon les communes d&apos;Abidjan ou offrez la livraison gratuite.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={editFreeDelivery}
                      onChange={(e) => setEditFreeDelivery(e.target.checked)}
                      className="size-4 rounded accent-primary"
                    />
                    Livraison 100% Gratuite (Offerte)
                  </label>
                </div>

                {!editFreeDelivery && (
                  <div className="space-y-3">
                    <div className="max-w-xs space-y-1">
                      <Label htmlFor="s-def-fee" className="text-xs font-semibold">
                        Tarif de livraison par défaut (FCFA)
                      </Label>
                      <Input
                        id="s-def-fee"
                        type="number"
                        value={editDefaultDeliveryFee}
                        onChange={(e) => setEditDefaultDeliveryFee(e.target.value)}
                        placeholder="1500"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        Tarifs personnalisés par commune (Optionnel) :
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {editCommunes.map((commune) => (
                          <div key={commune} className="rounded-xl border border-border bg-card p-2.5 space-y-1">
                            <p className="text-xs font-bold text-foreground truncate">{commune}</p>
                            <div className="relative">
                              <Input
                                type="number"
                                value={editDeliveryRates[commune] !== undefined ? editDeliveryRates[commune] : ''}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setEditDeliveryRates((prev) => ({
                                    ...prev,
                                    [commune]: val === '' ? (parseInt(editDefaultDeliveryFee, 10) || 1500) : parseInt(val, 10) || 0,
                                  }))
                                }}
                                placeholder={editDefaultDeliveryFee || '1500'}
                                className="h-8 text-xs font-semibold pr-11"
                              />
                              <span className="absolute right-2 top-2 text-[10px] font-bold text-muted-foreground">
                                FCFA
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <Label>Communes desservies à Abidjan</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {ABIDJAN_COMMUNES.map((commune) => {
                    const isSelected = editCommunes.includes(commune)
                    return (
                      <button
                        key={commune}
                        type="button"
                        onClick={() => toggleSettingsCommune(commune)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {isSelected && <Check className="inline-block size-3 mr-1" />}
                        {commune}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end">
                <Button type="submit" className="h-11 px-8 font-semibold">
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
