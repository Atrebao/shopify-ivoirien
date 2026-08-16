'use client'

import { use, useMemo, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Phone, ShieldCheck } from 'lucide-react'
import { useStore, formatCFA } from '@/lib/store'
import { Logo } from '@/components/brand'
import { ShopAvatar } from '@/components/shop-avatar'
import { ShareButton } from '@/components/share-button'
import { ProductCard } from '@/components/product-card'
import { CartBar } from '@/components/cart-bar'
import { MobileMoneyBadges } from '@/components/mobile-money-badges'
import { cn } from '@/lib/utils'

export default function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { getShop, getProducts, isHydrated } = useStore()
  const shop = getShop(slug)
  const products = getProducts(slug)
  const [category, setCategory] = useState<string>('Tout')

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['Tout', ...Array.from(set)]
  }, [products])

  const filtered = useMemo(
    () =>
      category === 'Tout'
        ? products
        : products.filter((p) => p.category === category),
    [products, category],
  )

  if (!isHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!shop) notFound()

  const fromPrice = products.length
    ? Math.min(...products.map((p) => p.price))
    : 0

  return (
    <div className="flex min-h-dvh flex-col pb-24">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Logo />
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            Boutique vérifiée
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4">
        {/* Shop hero */}
        <section className="flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <ShopAvatar shop={shop} className="size-16" />
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-extrabold tracking-tight">
                {shop.name}
              </h1>
              <p className="text-sm text-muted-foreground">{shop.tagline}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> Abidjan
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="size-3.5" /> {shop.phone}
                </span>
                <span>À partir de {formatCFA(fromPrice)}</span>
              </div>
            </div>
          </div>
          <ShareButton
            path={`/boutique/${shop.slug}`}
            label="Partager la boutique"
            className="shrink-0"
          />
        </section>

        <div className="mb-4 rounded-2xl border border-border bg-secondary/40 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Paiement à la commande
          </p>
          <MobileMoneyBadges />
        </div>

        {/* Category filter */}
        <div className="sticky top-0 z-30 -mx-4 mb-4 bg-background/90 px-4 py-2 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  category === c
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Aucun produit dans cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <p className="py-8 text-center text-xs text-muted-foreground">
          Cette boutique tourne sur{' '}
          <Link href="/" className="font-semibold text-primary">
            Djassa
          </Link>
          . Crée la tienne gratuitement.
        </p>
      </main>

      <CartBar shopSlug={shop.slug} />
    </div>
  )
}
