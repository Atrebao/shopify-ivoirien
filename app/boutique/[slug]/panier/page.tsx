'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore, formatCFA } from '@/lib/store'
import { useCart } from '@/lib/cart'
import { ShopAvatar } from '@/components/shop-avatar'

export default function CartPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { getShop, isHydrated } = useStore()
  const { lines, subtotal, setQty, remove, count } = useCart()
  const shop = getShop(slug)

  if (!isHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!shop) return null

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-background pb-40">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href={`/boutique/${slug}`}
          className="grid size-9 place-items-center rounded-full text-foreground hover:bg-secondary"
          aria-label="Retour à la boutique"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-2">
          <ShopAvatar shop={shop} className="size-8 text-xs" />
          <div>
            <p className="text-sm font-semibold leading-tight">Mon panier</p>
            <p className="text-xs text-muted-foreground leading-tight">
              {shop.name}
            </p>
          </div>
        </div>
      </header>

      {count === 0 ? (
        <div className="flex flex-col items-center gap-4 px-6 py-24 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <ShoppingBag className="size-7" />
          </div>
          <div>
            <p className="text-lg font-semibold">Ton panier est vide</p>
            <p className="text-sm text-muted-foreground text-pretty">
              Ajoute des articles depuis la boutique pour commander.
            </p>
          </div>
          <Button asChild>
            <Link href={`/boutique/${slug}`}>Voir la boutique</Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-border px-4">
            {lines.map((line) => (
              <li key={line.lineId} className="flex gap-3 py-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  <Image
                    src={line.product.image || '/placeholder.svg'}
                    alt={line.product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium leading-snug text-pretty">
                        {line.product.title}
                      </p>
                      {(line.size || line.color || line.material) && (
                        <p className="text-xs text-primary font-medium mt-0.5">
                          {[
                            line.size && `Taille: ${line.size}`,
                            line.color && `Couleur: ${line.color}`,
                            line.material && `Matière: ${line.material}`,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.lineId)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Retirer ${line.product.title}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => setQty(line.lineId, line.qty - 1)}
                        className="grid size-8 place-items-center text-foreground"
                        aria-label="Diminuer"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.lineId, line.qty + 1)}
                        className="grid size-8 place-items-center text-foreground"
                        aria-label="Augmenter"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold">
                      {formatCFA(line.product.price * line.qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-2xl border-t border-border bg-background/95 p-4 backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Sous-total ({count} article{count > 1 ? 's' : ''})
              </span>
              <span className="text-lg font-bold text-primary">{formatCFA(subtotal)}</span>
            </div>
            <Button
              size="lg"
              className="h-12 w-full text-base font-bold bg-primary"
              onClick={() => router.push(`/boutique/${slug}/commander`)}
            >
              Passer la commande
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
