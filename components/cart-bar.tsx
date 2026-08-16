'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { formatCFA } from '@/lib/data'

export function CartBar({ shopSlug }: { shopSlug: string }) {
  const { count, subtotal, shopSlug: cartShop } = useCart()

  // Only show if the current cart belongs to this shop and has items.
  if (count === 0 || (cartShop && cartShop !== shopSlug)) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4">
      <Link
        href={`/boutique/${shopSlug}/panier`}
        className="pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-4 rounded-2xl bg-primary px-5 py-3.5 text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-[0.99]"
      >
        <span className="flex items-center gap-3">
          <span className="relative">
            <ShoppingBag className="size-5" />
            <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {count}
            </span>
          </span>
          <span className="font-semibold">Voir le panier</span>
        </span>
        <span className="font-display font-extrabold">
          {formatCFA(subtotal)}
        </span>
      </Link>
    </div>
  )
}
