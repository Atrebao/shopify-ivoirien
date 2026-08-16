'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useStore,
  formatCFA,
  PAYMENT_PROVIDERS,
  DELIVERY_LABELS,
  ABIDJAN_COMMUNES,
} from '@/lib/store'
import type { DeliveryMethod, PaymentProvider } from '@/lib/store'
import { useCart } from '@/lib/cart'
import { PaymentSheet } from '@/components/payment-sheet'

const DELIVERY_OPTIONS: { method: DeliveryMethod; fee: number; note: string }[] =
  [
    { method: 'domicile', fee: 1000, note: 'Livré chez toi dans la commune' },
    { method: 'relais', fee: 500, note: 'Récupère au point relais le plus proche' },
    { method: 'retrait', fee: 0, note: 'Passe chercher directement en boutique' },
  ]

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { getShop, createOrder, isHydrated } = useStore()
  const { lines, subtotal, count, clear } = useCart()
  const shop = getShop(slug)

  const shopCommunes = useMemo(
    () => (shop?.communes && shop.communes.length > 0 ? shop.communes : ABIDJAN_COMMUNES),
    [shop],
  )

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [commune, setCommune] = useState(shopCommunes[0] ?? 'Cocody')
  const [delivery, setDelivery] = useState<DeliveryMethod>('domicile')
  const [provider, setProvider] = useState<PaymentProvider>('wave')
  const [paying, setPaying] = useState(false)
  const [touched, setTouched] = useState(false)

  const deliveryFee = useMemo(() => {
    if (delivery === 'retrait') return 0
    if (shop?.freeDelivery) return 0

    if (delivery === 'relais') {
      return 1000
    }

    // domicile
    if (commune && shop?.deliveryRates && shop.deliveryRates[commune] !== undefined) {
      return shop.deliveryRates[commune]
    }

    return shop?.defaultDeliveryFee ?? 1500
  }, [delivery, shop, commune])

  const total = subtotal + deliveryFee

  const phoneValid = /^(\+?225)?\s?[0-9\s]{8,}$/.test(phone.trim())
  const formValid = name.trim().length >= 2 && phoneValid && commune

  const summaryItems = useMemo(
    () =>
      lines.map((l) => ({
        productId: l.product.id,
        title: l.product.title,
        price: l.product.price,
        qty: l.qty,
        size: l.size,
        color: l.color,
        material: l.material,
      })),
    [lines],
  )

  if (!isHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!shop) return null

  if (count === 0 && !paying) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-2xl place-items-center px-6 text-center">
        <div className="space-y-3">
          <p className="text-lg font-semibold">Aucun article à commander</p>
          <Button asChild>
            <Link href={`/boutique/${slug}`}>Retour à la boutique</Link>
          </Button>
        </div>
      </div>
    )
  }

  function handlePaymentSuccess() {
    const order = createOrder({
      shopSlug: slug,
      items: summaryItems,
      subtotal,
      deliveryFee,
      total,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      commune,
      deliveryMethod: delivery,
      paymentProvider: provider,
    })
    clear()
    router.push(`/boutique/${slug}/confirmation?cmd=${order.id}`)
  }

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-background pb-40">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href={`/boutique/${slug}/panier`}
          className="grid size-9 place-items-center rounded-full text-foreground hover:bg-secondary"
          aria-label="Retour au panier"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <p className="text-sm font-semibold">Finaliser la commande</p>
      </header>

      <div className="space-y-8 px-4 py-6">
        {/* Coordonnées */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold">Tes coordonnées</h2>
          <div className="space-y-1.5">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Awa Koné"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+225 07 00 00 00 00"
            />
            {touched && !phoneValid && (
              <p className="text-xs text-destructive">
                Entre un numéro ivoirien valide.
              </p>
            )}
          </div>
        </section>

        {/* Livraison */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold">Livraison</h2>
          <div className="space-y-1.5">
            <Label htmlFor="commune">Commune de livraison</Label>
            <select
              id="commune"
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {shopCommunes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            {DELIVERY_OPTIONS.map((opt) => {
              const active = delivery === opt.method
              let currentOptionFee = opt.fee
              if (opt.method === 'retrait') {
                currentOptionFee = 0
              } else if (shop?.freeDelivery) {
                currentOptionFee = 0
              } else if (opt.method === 'domicile') {
                currentOptionFee =
                  commune && shop?.deliveryRates?.[commune] !== undefined
                    ? shop.deliveryRates[commune]
                    : shop?.defaultDeliveryFee ?? 1500
              }

              return (
                <button
                  type="button"
                  key={opt.method}
                  onClick={() => setDelivery(opt.method)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                    active
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">
                      {DELIVERY_LABELS[opt.method]}
                    </p>
                    <p className="text-xs text-muted-foreground text-pretty">
                      {opt.method === 'domicile' && commune
                        ? `Livraison directe à ${commune}`
                        : opt.note}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {currentOptionFee === 0 ? 'Gratuit' : formatCFA(currentOptionFee)}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Paiement */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold">Moyen de paiement</h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PAYMENT_PROVIDERS) as PaymentProvider[]).map((key) => {
              const info = PAYMENT_PROVIDERS[key]
              const active = provider === key
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setProvider(key)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    active
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: info.color }}
                  >
                    {info.short}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium leading-tight">
                    {info.label}
                  </span>
                  {active && <Check className="size-4 text-primary" />}
                </button>
              )
            })}
          </div>
        </section>

        {/* Récap */}
        <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-medium">{formatCFA(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Livraison</span>
            <span className="font-medium">
              {deliveryFee === 0 ? 'Gratuit' : formatCFA(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="font-semibold">Total à payer</span>
            <span className="text-lg font-bold text-primary">
              {formatCFA(total)}
            </span>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-2xl border-t border-border bg-background/95 p-4 backdrop-blur">
        <Button
          size="lg"
          className="h-12 w-full text-base font-bold bg-primary text-primary-foreground"
          onClick={() => {
            setTouched(true)
            if (formValid) setPaying(true)
          }}
        >
          Payer {formatCFA(total)} avec {PAYMENT_PROVIDERS[provider]?.label || 'Mobile Money'}
        </Button>
      </div>

      {paying && (
        <PaymentSheet
          provider={provider}
          phone={phone}
          amount={total}
          onCancel={() => setPaying(false)}
          onSuccess={handlePaymentSuccessProxy}
        />
      )}
    </div>
  )

  // Proxy avoids a stale closure issue with the misspelled handler above.
  function handlePaymentSuccessProxy() {
    handlePaymentSuccess()
  }
}
