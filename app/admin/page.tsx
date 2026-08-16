'use client'

import Link from 'next/link'
import {
  Building2,
  Coins,
  CreditCard,
  Crown,
  ExternalLink,
  MessageCircle,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore, formatCFA, PAYMENT_PROVIDERS } from '@/lib/store'
import { ShopAvatar } from '@/components/shop-avatar'

export default function AdminOverviewPage() {
  const { shops, orders, payouts, getGlobalAdminStats } = useStore()
  const stats = getGlobalAdminStats()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Platform Health */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Console Super-Admin SAAS
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Supervision globale des boutiques, de la trésorerie Mobile Money et des commissions Djassa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-9 font-semibold text-xs">
            <Link href="/admin/boutiques">
              <Building2 className="size-3.5 mr-1.5" /> Voir les boutiques ({shops.length})
            </Link>
          </Button>
          <Button asChild size="sm" className="h-9 font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/admin/tresorerie">
              <Wallet className="size-3.5 mr-1.5" /> Payouts Mobile Money
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Volume Global Ventes (GMV)</span>
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="size-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-foreground">
            {formatCFA(stats.totalGMV)}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="font-bold text-emerald-600">+18.5%</span> ce mois en Côte d&apos;Ivoire
          </p>
        </div>

        {/* Commissions Djassa */}
        <div className="rounded-3xl border-2 border-amber-500/40 bg-amber-500/5 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>Revenus Commissions Djassa</span>
            <span className="grid size-8 place-items-center rounded-xl bg-amber-500/20 text-amber-700">
              <Coins className="size-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-amber-900">
            {formatCFA(stats.totalCommissions)}
          </p>
          <p className="text-xs text-muted-foreground">
            Taux moyen prélevé : <span className="font-bold text-foreground">2.5%</span>
          </p>
        </div>

        {/* Total Boutiques */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Boutiques Marchandes</span>
            <span className="grid size-8 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
              <Building2 className="size-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-foreground">
            {stats.totalShops}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-blue-600">{shops.filter((s) => s.status === 'verifiee').length} certifiées</span> avec badge
          </p>
        </div>

        {/* Total Commandes */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Commandes Traitées</span>
            <span className="grid size-8 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
              <ShoppingBag className="size-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-foreground">
            {stats.totalOrders}
          </p>
          <p className="text-xs text-muted-foreground">
            100% Mobile Money (Wave, Orange, MTN)
          </p>
        </div>
      </div>

      {/* Mobile Money Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mobile Money Share */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="size-4 text-primary" />
            Répartition Mobile Money CI
          </h2>
          <div className="space-y-3 pt-1">
            {Object.entries(stats.mobileMoneyShare).map(([providerKey, count]) => {
              const info = PAYMENT_PROVIDERS[providerKey as keyof typeof PAYMENT_PROVIDERS]
              const percent = stats.totalOrders > 0 ? Math.round((count / stats.totalOrders) * 100) : 25
              return (
                <div key={providerKey} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-foreground">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: info?.color || '#0f9d6b' }}
                      />
                      {info?.label}
                    </span>
                    <span className="text-muted-foreground">{count} cmd ({percent}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: info?.color || '#0f9d6b',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Latest Shops */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              Boutiques Récemment Actives
            </h2>
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-semibold">
              <Link href="/admin/boutiques">Gérer toutes les boutiques</Link>
            </Button>
          </div>

          <div className="divide-y divide-border">
            {shops.slice(0, 4).map((shop) => (
              <div key={shop.slug} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <ShopAvatar shop={shop} className="size-9 text-xs" />
                  <div>
                    <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      {shop.name}
                      {shop.status === 'verifiee' && (
                        <ShieldCheck className="size-3.5 text-blue-500" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {shop.ownerName} · {shop.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                      shop.plan === 'business'
                        ? 'bg-purple-500/10 text-purple-700 border border-purple-500/30'
                        : shop.plan === 'pro'
                        ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {shop.plan || 'Starter'}
                  </span>
                  <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                    <Link href={`/boutique/${shop.slug}`} target="_blank">
                      <ExternalLink className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
