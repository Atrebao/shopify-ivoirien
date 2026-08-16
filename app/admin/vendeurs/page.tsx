'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  ExternalLink,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore, formatCFA, PAYMENT_PROVIDERS, generateWhatsAppLink } from '@/lib/store'
import { ShopAvatar } from '@/components/shop-avatar'

export default function AdminVendeursPage() {
  const { shops, products, getFinancials } = useStore()
  const [searchTerm, setSearchTerm] = useState('')

  const sellers = shops.map((shop) => {
    const shopProducts = products.filter((p) => p.shopSlug === shop.slug)
    const fin = getFinancials(shop.slug)
    return {
      shop,
      productsCount: shopProducts.length,
      grossSales: fin.grossSales,
      ordersCount: fin.ordersCount,
      payoutProvider: shop.payoutProvider || 'wave',
      payoutPhone: shop.payoutPhone || shop.phone,
    }
  }).filter((s) =>
    s.shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shop.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Annuaire des Vendeurs & Marchands
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Suivez les commerçants ivoiriens inscrits sur la plateforme, leurs coordonnées de paiement et leurs performances de vente.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un vendeur par nom ou numéro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-10 text-xs sm:text-sm"
        />
      </div>

      {/* Seller Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sellers.map(({ shop, productsCount, grossSales, ordersCount, payoutProvider, payoutPhone }) => {
          const providerInfo = PAYMENT_PROVIDERS[payoutProvider]
          const whatsappUrl = generateWhatsAppLink(
            shop.whatsapp || shop.phone,
            `Bonjour ${shop.ownerName} ! L'équipe Djassa CI vous contacte au sujet de votre boutique ${shop.name}.`,
          )

          return (
            <div
              key={shop.slug}
              className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ShopAvatar shop={shop} className="size-11 text-sm shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground flex items-center gap-1.5">
                      {shop.ownerName}
                      {shop.status === 'verifiee' && (
                        <ShieldCheck className="size-3.5 text-blue-500" />
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">Boutique : {shop.name}</p>
                  </div>
                </div>

                <Button asChild size="sm" variant="ghost" className="size-8 p-0 text-emerald-600 hover:bg-emerald-500/10">
                  <Link href={whatsappUrl} target="_blank">
                    <MessageCircle className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="rounded-2xl bg-secondary/40 p-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Téléphone / Contact :</span>
                  <span className="font-bold text-foreground">{shop.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Compte Payout Mobile Money :</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: providerInfo?.color || '#0f9d6b' }}
                    />
                    {providerInfo?.label} ({payoutPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Articles au catalogue :</span>
                  <span className="font-bold text-foreground">{productsCount} articles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chiffre d&apos;Affaires :</span>
                  <span className="font-bold text-primary">{formatCFA(grossSales)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {ordersCount} commande{ordersCount > 1 ? 's' : ''} passée{ordersCount > 1 ? 's' : ''}
                </span>

                <Button asChild size="sm" variant="outline" className="h-8 text-xs font-semibold">
                  <Link href={`/boutique/${shop.slug}`} target="_blank">
                    Visiter la boutique <ExternalLink className="size-3 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
