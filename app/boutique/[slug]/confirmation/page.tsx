'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useStore,
  formatCFA,
  PAYMENT_PROVIDERS,
  DELIVERY_LABELS,
  STATUS_LABELS,
  generateWhatsAppLink,
} from '@/lib/store'
import { ShopAvatar } from '@/components/shop-avatar'

export default function ConfirmationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const searchParams = useSearchParams()
  const orderId = searchParams.get('cmd')
  const { getShop, orders, isHydrated } = useStore()
  const shop = getShop(slug)

  const order = useMemo(() => {
    if (!orderId) return orders.find((o) => o.shopSlug === slug)
    return orders.find((o) => o.id === orderId) || orders.find((o) => o.shopSlug === slug)
  }, [orders, orderId, slug])

  if (!isHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-lg place-items-center px-4 text-center">
        <div className="space-y-4">
          <p className="text-lg font-semibold">Boutique introuvable</p>
          <Button asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-lg place-items-center px-4 text-center">
        <div className="space-y-4">
          <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
          <p className="text-lg font-semibold">Aucune commande récente trouvée</p>
          <Button asChild>
            <Link href={`/boutique/${slug}`}>Retour à la boutique</Link>
          </Button>
        </div>
      </div>
    )
  }

  const paymentInfo = PAYMENT_PROVIDERS[order.paymentProvider]

  const whatsappMessage = `Bonjour ${shop.name} ! 👋
Je viens de passer la commande *#${order.id}* d'un montant de *${formatCFA(order.total)}* payée par *${paymentInfo?.label || 'Mobile Money'}*.

📦 *Détails de ma commande :*
${order.items
  .map(
    (it) =>
      `• ${it.qty}x ${it.title} ${
        it.size || it.color || it.material
          ? `(${[it.size, it.color, it.material].filter(Boolean).join(', ')})`
          : ''
      } — ${formatCFA(it.price * it.qty)}`,
  )
  .join('\n')}

📍 *Livraison :*
• Nom : ${order.customerName}
• Téléphone : ${order.customerPhone}
• Commune : ${order.commune}
• Mode : ${DELIVERY_LABELS[order.deliveryMethod]}

Merci de me confirmer la préparation et l'expédition de mon colis ! 🙏`

  const whatsappUrl = generateWhatsAppLink(
    shop.whatsapp || shop.phone || '07000000',
    whatsappMessage,
  )

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-background pb-20">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href={`/boutique/${slug}`}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          {shop.name}
        </Link>
        <span className="flex items-center gap-1 text-xs font-semibold text-primary">
          <ShieldCheck className="size-3.5" /> Reçu certifié
        </span>
      </header>

      <main className="space-y-6 px-4 py-6">
        {/* Success Banner */}
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center shadow-xs">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
            <CheckCircle2 className="size-9" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">
            Commande Confirmée !
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Merci pour votre achat chez <span className="font-semibold text-foreground">{shop.name}</span>.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-background px-3 py-1 text-xs font-bold text-emerald-600">
            <span>Réf: {order.id}</span>
            <span>•</span>
            <span>{STATUS_LABELS[order.status]}</span>
          </div>
        </div>

        {/* WhatsApp Direct Action */}
        <div className="rounded-2xl border-2 border-emerald-600/40 bg-emerald-600/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white shadow-xs">
              <MessageCircle className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                Informer le vendeur sur WhatsApp
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Envoyez automatiquement votre reçu et vos coordonnées à la vendeuse pour une expédition ultra-rapide.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="mt-4 w-full h-11 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm shadow-sm"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4 mr-2" />
              Ouvrir WhatsApp et envoyer le reçu
              <ExternalLink className="size-3.5 ml-1.5 opacity-70" />
            </a>
          </Button>
        </div>

        {/* Delivery & Contact info */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <h2 className="font-display text-base font-bold flex items-center gap-2 text-foreground">
            <Truck className="size-4 text-primary" />
            Informations de livraison
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Destinataire</p>
              <p className="font-semibold text-foreground mt-0.5">{order.customerName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Phone className="size-3" /> {order.customerPhone}
              </p>
            </div>

            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Lieu & Mode</p>
              <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" /> {order.commune}, Abidjan
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {DELIVERY_LABELS[order.deliveryMethod]}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <h2 className="font-display text-base font-bold flex items-center gap-2 text-foreground">
            <ReceiptText className="size-4 text-primary" />
            Détails des articles
          </h2>

          <div className="divide-y divide-border">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-bold text-foreground">{item.title}</p>
                  {(item.size || item.color || item.material) && (
                    <p className="text-xs text-primary font-medium">
                      {[
                        item.size && `Taille: ${item.size}`,
                        item.color && `Couleur: ${item.color}`,
                        item.material && `Matière: ${item.material}`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Quantité : {item.qty} × {formatCFA(item.price)}
                  </p>
                </div>
                <span className="font-semibold text-foreground">
                  {formatCFA(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Sous-total</span>
              <span>{formatCFA(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Frais de livraison</span>
              <span>{order.deliveryFee === 0 ? 'Gratuit' : formatCFA(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground items-center">
              <span>Mode de paiement</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: paymentInfo?.color || '#0f9d6b' }}
                />
                {paymentInfo?.label || 'Mobile Money'} (Payé)
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <span>Total payé</span>
              <span className="text-primary">{formatCFA(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shop Contact & Return buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild variant="outline" className="h-11 flex-1">
            <Link href={`/boutique/${slug}`}>
              <ShoppingBag className="size-4 mr-2" />
              Retourner à la boutique
            </Link>
          </Button>
          <Button asChild className="h-11 flex-1">
            <Link href="/">
              Découvrir d&apos;autres boutiques
            </Link>
          </Button>
        </div>

        <div className="rounded-xl bg-muted/40 p-4 text-center text-xs text-muted-foreground">
          <p>
            Une question sur votre commande ? Contactez directement{' '}
            <span className="font-semibold text-foreground">{shop.ownerName || shop.name}</span> au{' '}
            <span className="font-semibold text-foreground">{shop.phone}</span>.
          </p>
        </div>
      </main>
    </div>
  )
}
