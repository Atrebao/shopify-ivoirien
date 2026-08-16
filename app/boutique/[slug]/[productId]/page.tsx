'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ShieldCheck, Truck, Camera } from 'lucide-react'
import { useStore, formatCFA, formatProductPriceRange } from '@/lib/store'
import { ShopAvatar } from '@/components/shop-avatar'
import { ShareButton } from '@/components/share-button'
import { ProductBuyBox } from '@/components/add-to-cart'
import { MobileMoneyBadges } from '@/components/mobile-money-badges'
import { CartBar } from '@/components/cart-bar'

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>
}) {
  const { slug, productId } = use(params)
  const { getShop, getProduct, isHydrated } = useStore()
  const shop = getShop(slug)
  const product = getProduct(productId)

  const [activePhotoIdx, setActivePhotoIdx] = useState(0)

  if (!isHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!shop || !product || product.shopSlug !== slug) notFound()

  const soldOut = product.stock <= 0
  const photos = product.images && product.images.length > 0 ? product.images : [product.image || '/placeholder.svg']
  const currentPhoto = photos[activePhotoIdx] || photos[0]

  return (
    <div className="flex min-h-dvh flex-col pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href={`/boutique/${slug}`}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            {shop.name}
          </Link>
          <ShareButton
            path={`/boutique/${slug}/${product.id}`}
            label="Partager"
            variant="ghost"
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Photo Gallery with Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-muted">
              <Image
                src={currentPhoto}
                alt={product.title}
                fill
                priority
                className="object-cover transition-all duration-300"
              />
              {soldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="rounded-full bg-destructive px-4 py-1.5 text-sm font-bold text-white">
                    Rupture de stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails if multi-photos */}
            {photos.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      activePhotoIdx === idx
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={photo} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {product.category}
            </span>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-balance">
              {product.title}
            </h1>
            <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-primary">
              {formatProductPriceRange(product)}
            </p>
            {!soldOut ? (
              <span className="mt-1 text-sm text-muted-foreground">
                {product.stock} disponible{product.stock > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="mt-1 text-sm font-medium text-destructive">
                Rupture de stock
              </span>
            )}

            <p className="mt-4 leading-relaxed text-foreground/85 text-sm sm:text-base">
              {product.description}
            </p>

            <div className="my-5 h-px bg-border" />

            {/* Buy Box with interactive Size, Color, and Material options */}
            <ProductBuyBox product={product} />

            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-secondary/40 p-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Paiement sécurisé Mobile Money (Wave, Orange, MTN, Moov)
              </div>
              <MobileMoneyBadges />
              <div className="flex items-center gap-3 text-muted-foreground">
                <Truck className="size-4 text-primary" />
                Livraison à domicile partout à Abidjan
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <ShopAvatar shop={shop} className="size-10 text-sm" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">{shop.name}</p>
                <Link
                  href={`/boutique/${slug}`}
                  className="text-xs text-primary hover:underline"
                >
                  Voir toute la boutique
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartBar shopSlug={slug} />
    </div>
  )
}
