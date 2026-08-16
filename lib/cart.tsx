'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type { Product } from '@/lib/data'

export interface CartLine {
  lineId: string
  product: Product
  qty: number
  size?: string
  color?: string
  material?: string
}

interface CartContextValue {
  shopSlug: string | null
  lines: CartLine[]
  count: number
  subtotal: number
  add: (
    product: Product,
    qty?: number,
    variants?: { size?: string; color?: string; material?: string },
  ) => void
  setOrAdd: (
    product: Product,
    qty: number,
    variants?: { size?: string; color?: string; material?: string },
  ) => void
  setQty: (lineId: string, qty: number) => void
  remove: (lineId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [shopSlug, setShopSlug] = useState<string | null>(null)
  const [lines, setLines] = useState<CartLine[]>([])

  const add = useCallback(
    (
      product: Product,
      qty = 1,
      variants?: { size?: string; color?: string; material?: string },
    ) => {
      const lineId = `${product.id}-${variants?.size || ''}-${variants?.color || ''}-${variants?.material || ''}`

      setShopSlug((prevSlug) => {
        if (prevSlug && prevSlug !== product.shopSlug) {
          setLines([
            {
              lineId,
              product,
              qty,
              size: variants?.size,
              color: variants?.color,
              material: variants?.material,
            },
          ])
          return product.shopSlug
        }

        setLines((prev) => {
          const existing = prev.find((l) => l.lineId === lineId)
          if (existing) {
            return prev.map((l) =>
              l.lineId === lineId
                ? { ...l, qty: Math.min(l.qty + qty, Math.max(product.stock, 1)) }
                : l,
            )
          }
          return [
            ...prev,
            {
              lineId,
              product,
              qty,
              size: variants?.size,
              color: variants?.color,
              material: variants?.material,
            },
          ]
        })
        return product.shopSlug
      })
    },
    [],
  )

  const setOrAdd = useCallback(
    (
      product: Product,
      qty = 1,
      variants?: { size?: string; color?: string; material?: string },
    ) => {
      const lineId = `${product.id}-${variants?.size || ''}-${variants?.color || ''}-${variants?.material || ''}`

      setShopSlug((prevSlug) => {
        if (prevSlug && prevSlug !== product.shopSlug) {
          setLines([
            {
              lineId,
              product,
              qty,
              size: variants?.size,
              color: variants?.color,
              material: variants?.material,
            },
          ])
          return product.shopSlug
        }

        setLines((prev) => {
          const existing = prev.find((l) => l.lineId === lineId)
          if (existing) {
            return prev.map((l) =>
              l.lineId === lineId
                ? { ...l, qty: Math.max(1, Math.min(qty, Math.max(product.stock, 1))) }
                : l,
            )
          }
          return [
            ...prev,
            {
              lineId,
              product,
              qty,
              size: variants?.size,
              color: variants?.color,
              material: variants?.material,
            },
          ]
        })
        return product.shopSlug
      })
    },
    [],
  )

  const setQty = useCallback((lineId: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.lineId === lineId
            ? { ...l, qty: Math.max(0, Math.min(qty, Math.max(l.product.stock, 1))) }
            : l,
        )
        .filter((l) => l.qty > 0),
    )
  }, [])

  const remove = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId))
  }, [])

  const clear = useCallback(() => {
    setLines([])
    setShopSlug(null)
  }, [])

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines])
  const subtotal = useMemo(
    () => lines.reduce((n, l) => n + l.qty * l.product.price, 0),
    [lines],
  )

  const value = useMemo(
    () => ({ shopSlug, lines, count, subtotal, add, setOrAdd, setQty, remove, clear }),
    [shopSlug, lines, count, subtotal, add, setOrAdd, setQty, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
