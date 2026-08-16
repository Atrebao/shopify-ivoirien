'use client'

import { useState } from 'react'
import {
  CreditCard,
  Filter,
  Package,
  Search,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useStore, formatCFA, PAYMENT_PROVIDERS, STATUS_LABELS, type PaymentProvider } from '@/lib/store'

export default function AdminTransactionsPage() {
  const { orders, shops, platformSettings } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [providerFilter, setProviderFilter] = useState<'all' | PaymentProvider>('all')

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shopSlug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.commune.toLowerCase().includes(searchTerm.toLowerCase())

    const matchProvider = providerFilter === 'all' || o.paymentProvider === providerFilter
    return matchSearch && matchProvider
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Journal des Transactions en Temps Réel
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Historique exhaustif de tous les paiements Mobile Money enregistrés sur l&apos;ensemble des boutiques de Côte d&apos;Ivoire.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par référence, client, commune ou boutique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 text-xs sm:text-sm"
          />
        </div>

        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value as any)}
          className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Tous les opérateurs</option>
          <option value="wave">Wave</option>
          <option value="orange">Orange Money</option>
          <option value="mtn">MTN MoMo</option>
          <option value="moov">Moov Money</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Réf Commande</th>
                <th className="px-4 py-4">Boutique</th>
                <th className="px-4 py-4">Client & Commune</th>
                <th className="px-4 py-4">Opérateur Mobile Money</th>
                <th className="px-4 py-4">Montant Total</th>
                <th className="px-4 py-4">Commission Djassa</th>
                <th className="px-4 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    Aucune transaction trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const shop = shops.find((s) => s.slug === order.shopSlug)
                  const providerInfo = PAYMENT_PROVIDERS[order.paymentProvider]
                  const commission = Math.round((order.subtotal * platformSettings.defaultCommissionRate) / 100)

                  return (
                    <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-xs text-foreground">
                        #{order.id}
                      </td>

                      <td className="px-4 py-4 font-semibold text-foreground">
                        {shop?.name || order.shopSlug}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.commune} · {order.customerPhone}</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: providerInfo?.color || '#0f9d6b' }}
                          />
                          {providerInfo?.label}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-extrabold text-foreground">
                        {formatCFA(order.total)}
                      </td>

                      <td className="px-4 py-4 font-bold text-primary">
                        {formatCFA(commission)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            order.status === 'paye'
                              ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                              : order.status === 'livre'
                              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
