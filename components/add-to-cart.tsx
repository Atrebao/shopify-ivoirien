'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, ShoppingBag, Check, Layers, Palette, Ruler, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { getProductPrice, formatCFA, type Product, type ColorVariant } from '@/lib/store'

/** Compact add button used on product cards in the grid. */
export function QuickAdd({ product }: { product: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const soldOut = product.stock <= 0

  function handleAdd() {
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : undefined
    const defaultMaterial = product.materials && product.materials.length > 0 ? product.materials[0] : undefined

    const price = getProductPrice(product, {
      size: defaultSize,
      color: defaultColor,
      material: defaultMaterial,
    })

    add({ ...product, price }, 1, {
      size: defaultSize,
      color: defaultColor,
      material: defaultMaterial,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={added ? 'secondary' : 'default'}
      disabled={soldOut}
      onClick={handleAdd}
      className="w-full h-9 font-semibold text-xs"
    >
      {soldOut ? (
        'Rupture de stock'
      ) : added ? (
        <>
          <Check className="size-3.5 mr-1" /> Ajouté
        </>
      ) : (
        <>
          <Plus className="size-3.5 mr-1" /> Ajouter
        </>
      )}
    </Button>
  )
}

/** Full quantity & variants selector + add/checkout used on the product detail page. */
export function ProductBuyBox({ product }: { product: Product }) {
  const { add, setOrAdd } = useCart()
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
  )
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : undefined,
  )
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>(
    product.materials && product.materials.length > 0 ? product.materials[0] : undefined,
  )
  const [added, setAdded] = useState(false)

  const soldOut = product.stock <= 0
  const max = Math.max(product.stock, 1)

  const currentVariants = {
    size: selectedSize,
    color: selectedColor,
    material: selectedMaterial,
  }

  const currentPrice = getProductPrice(product, currentVariants)
  const priceDiffers = currentPrice !== product.price

  function buyNow() {
    setOrAdd({ ...product, price: currentPrice }, qty, currentVariants)
    router.push(`/boutique/${product.shopSlug}/panier`)
  }

  function handleAddToCart() {
    add({ ...product, price: currentPrice }, qty, currentVariants)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="space-y-5">
      {/* 1. Size Selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground">
              <Ruler className="size-3.5 text-primary" /> Taille / Format :
            </span>
            <span className="font-bold text-primary">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const active = selectedSize === size
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 2. Color Selector */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground">
              <Palette className="size-3.5 text-primary" /> Couleur :
            </span>
            <span className="font-bold text-primary">{selectedColor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const active = selectedColor === color.name
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? 'border-primary bg-primary/10 ring-1 ring-primary text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span
                    className="size-3 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. Material Selector */}
      {product.materials && product.materials.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground">
              <Scissors className="size-3.5 text-primary" /> Matière / Tissu :
            </span>
            <span className="font-bold text-primary">{selectedMaterial}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((mat) => {
              const active = selectedMaterial === mat
              return (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setSelectedMaterial(mat)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mat}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {!soldOut && (
        <div className="flex items-center gap-4 pt-1">
          <span className="text-sm font-semibold text-foreground">Quantité</span>
          <div className="flex items-center rounded-xl border border-border bg-card">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-10 place-items-center text-foreground disabled:opacity-40"
              disabled={qty <= 1}
              aria-label="Diminuer la quantité"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center text-sm font-bold tabular-nums">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(max, q + 1))}
              className="grid size-10 place-items-center text-foreground disabled:opacity-40"
              disabled={qty >= max}
              aria-label="Augmenter la quantité"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            {product.stock} en stock
          </span>
        </div>
      )}

      {/* Active Price for Selected Variant */}
      <div className="flex items-baseline justify-between rounded-2xl bg-secondary/50 p-3 border border-border">
        <span className="text-xs font-semibold text-muted-foreground">
          Prix pour cette variante :
        </span>
        <div className="text-right">
          <span className="font-display text-2xl font-extrabold text-primary">
            {formatCFA(currentPrice)}
          </span>
          {priceDiffers && (
            <span className="block text-[10px] font-bold text-emerald-600">
              (Ajusté selon la variante choisie)
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 sm:flex-row pt-1">
        <Button
          type="button"
          size="lg"
          className="h-12 flex-1 text-base font-bold bg-primary text-primary-foreground"
          disabled={soldOut}
          onClick={buyNow}
        >
          <ShoppingBag className="size-5 mr-2" />
          {soldOut ? 'Rupture de stock' : 'Commander maintenant'}
        </Button>
        {!soldOut && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-12 font-semibold"
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="size-4 text-emerald-600 mr-1.5" /> Ajouté au panier
              </>
            ) : (
              'Ajouter au panier'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
