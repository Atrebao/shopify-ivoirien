import Link from 'next/link'
import Image from 'next/image'
import { formatProductPriceRange, type Product } from '@/lib/store'
import { QuickAdd } from '@/components/add-to-cart'
import { Button } from '@/components/ui/button'
import { Layers, Palette } from 'lucide-react'

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0
  const hasVariants =
    (product.sizes && product.sizes.length > 0) ||
    (product.colors && product.colors.length > 0) ||
    (product.materials && product.materials.length > 0)

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/40">
      <Link
        href={`/boutique/${product.shopSlug}/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.title}
          width={500}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/90 px-3 py-1 text-xs font-bold text-background shadow-xs">
            Épuisé
          </span>
        )}
        {!soldOut && product.stock <= 5 && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 text-white px-2.5 py-1 text-[11px] font-extrabold shadow-xs">
            Plus que {product.stock} en stock
          </span>
        )}
        {product.images && product.images.length > 1 && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 text-[10px] font-bold">
            {product.images.length} photos
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {product.category}
          </span>
          <Link href={`/boutique/${product.shopSlug}/${product.id}`}>
            <h3 className="line-clamp-1 font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="font-display text-base sm:text-lg font-extrabold text-primary">
            {formatProductPriceRange(product)}
          </p>

          {/* Visual Variant Badges & Color Swatches */}
          {hasVariants && (
            <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
              {/* Color dots */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center -space-x-1 mr-1">
                  {product.colors.slice(0, 4).map((c) => (
                    <span
                      key={c.name}
                      title={c.name}
                      className="size-3.5 rounded-full border border-card shadow-xs ring-1 ring-border shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  {product.colors.length > 4 && (
                    <span className="text-[9px] font-bold pl-1.5 text-muted-foreground">
                      +{product.colors.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Sizes pill */}
              {product.sizes && product.sizes.length > 0 && (
                <span className="rounded-md bg-secondary/80 px-1.5 py-0.5 font-semibold text-[10px] text-foreground">
                  {product.sizes.slice(0, 3).join(', ')}
                  {product.sizes.length > 3 ? '...' : ''}
                </span>
              )}

              {/* Material pill */}
              {product.materials && product.materials.length > 0 && (
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold text-[10px] text-primary">
                  {product.materials[0]}
                </span>
              )}
            </div>
          )}
        </div>

        <div>
          {hasVariants ? (
            <Button
              asChild
              size="sm"
              className="w-full h-9 font-semibold text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30"
            >
              <Link href={`/boutique/${product.shopSlug}/${product.id}`}>
                Choisir les options
              </Link>
            </Button>
          ) : (
            <QuickAdd product={product} />
          )}
        </div>
      </div>
    </div>
  )
}
