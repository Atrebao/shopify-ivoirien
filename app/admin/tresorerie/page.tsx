'use client'

import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CreditCard,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore, formatCFA, PAYMENT_PROVIDERS, type PaymentProvider } from '@/lib/store'

export default function AdminTresoreriePage() {
  const { payouts, updatePayoutStatus, getGlobalAdminStats, shops } = useStore()
  const stats = getGlobalAdminStats()
  const [statusFilter, setStatusFilter] = useState<'all' | 'effectue' | 'en_cours' | 'rejete'>('all')

  const filteredPayouts = payouts.filter((p) => {
    if (statusFilter === 'all') return true
    return p.status === statusFilter
  })

  const totalWithdrawn = payouts
    .filter((p) => p.status === 'effectue')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalWithdrawalFees = payouts
    .filter((p) => p.status === 'effectue')
    .reduce((sum, p) => sum + p.fee, 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Trésorerie & Payouts Mobile Money
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Suivez les demandes de retraits Wave et Orange Money des marchands et validez les virements.
        </p>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Fonds Totaux Décaissés</span>
            <span className="grid size-8 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
              <ArrowDownLeft className="size-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-foreground">
            {formatCFA(totalWithdrawn)}
          </p>
          <p className="text-xs text-muted-foreground">
            Reversés directement sur les comptes Wave / OM
          </p>
        </div>

        <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Frais Fixes de Retrait Collectés</span>
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-700">
              <Wallet className="size-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-emerald-900">
            {formatCFA(totalWithdrawalFees)}
          </p>
          <p className="text-xs text-muted-foreground">
            100 FCFA fixes par virement effectué
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Demandes en attente</span>
            <span className="grid size-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <RefreshCw className="size-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-extrabold text-foreground">
            {payouts.filter((p) => p.status === 'en_cours').length}
          </p>
          <p className="text-xs text-muted-foreground">
            À vérifier et envoyer via les APIs opérateurs
          </p>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">
            Historique des Virements & Retraits
          </h2>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tous les états</option>
            <option value="effectue">Effectués</option>
            <option value="en_cours">En attente</option>
            <option value="rejete">Rejetés</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Réf Virement</th>
                <th className="px-4 py-3">Boutique</th>
                <th className="px-4 py-3">Opérateur & Numéro</th>
                <th className="px-4 py-3">Montant Brut</th>
                <th className="px-4 py-3">Frais Fixe</th>
                <th className="px-4 py-3">Net Envoyé</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Action Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground text-sm">
                    Aucun virement enregistré.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => {
                  const shop = shops.find((s) => s.slug === payout.shopSlug)
                  const providerInfo = PAYMENT_PROVIDERS[payout.provider]

                  return (
                    <tr key={payout.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-xs text-foreground">
                        #{payout.id}
                      </td>

                      <td className="px-4 py-3 font-semibold text-foreground">
                        {shop?.name || payout.shopSlug}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: providerInfo?.color || '#0f9d6b' }}
                          />
                          {providerInfo?.label} · {payout.phone}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-bold text-foreground">
                        {formatCFA(payout.amount)}
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatCFA(payout.fee)}
                      </td>

                      <td className="px-4 py-3 font-bold text-emerald-600">
                        {formatCFA(payout.netAmount)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            payout.status === 'effectue'
                              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                              : payout.status === 'en_cours'
                              ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                              : 'bg-destructive/10 text-destructive border border-destructive/30'
                          }`}
                        >
                          {payout.status === 'effectue'
                            ? 'Envoyé'
                            : payout.status === 'en_cours'
                            ? 'En cours'
                            : 'Rejeté'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        {payout.status === 'en_cours' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => updatePayoutStatus(payout.id, 'effectue')}
                              className="h-7 px-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Check className="size-3 mr-1" /> Valider
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePayoutStatus(payout.id, 'rejete')}
                              className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        )}
                        {payout.status === 'effectue' && (
                          <span className="text-xs text-muted-foreground">Virement confirmé</span>
                        )}
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
