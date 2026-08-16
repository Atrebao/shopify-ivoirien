'use client'

import { useState } from 'react'
import {
  Check,
  Coins,
  Crown,
  HelpCircle,
  Percent,
  Save,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore, formatCFA, SAAS_PLANS } from '@/lib/store'

export default function AdminMonetisationPage() {
  const { platformSettings, updatePlatformSettings } = useStore()
  const [commRate, setCommRate] = useState(platformSettings.defaultCommissionRate.toString())
  const [withdrawFee, setWithdrawFee] = useState(platformSettings.fixedWithdrawalFee.toString())
  const [minAmount, setMinAmount] = useState(platformSettings.minWithdrawalAmount.toString())
  const [saved, setSaved] = useState(false)

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    updatePlatformSettings({
      defaultCommissionRate: parseFloat(commRate) || 2.5,
      fixedWithdrawalFee: parseInt(withdrawFee, 10) || 100,
      minWithdrawalAmount: parseInt(minAmount, 10) || 1000,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Monétisation, Commissions & Plans SAAS
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Définissez la politique tarifaire de Djassa CI : prélèvement de commissions sur les ventes Mobile Money et formules d&apos;abonnements récurrents.
        </p>
      </div>

      {/* Financial Parameters Settings Form */}
      <form
        onSubmit={handleSaveSettings}
        className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Coins className="size-5 text-amber-600" />
            <h2 className="font-display text-base font-bold text-foreground">
              Paramètres Financiers de la Plateforme
            </h2>
          </div>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
              <Check className="size-3.5" /> Paramètres enregistrés !
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="comm-rate" className="text-xs font-bold">
              Commission par défaut sur vente (%)
            </Label>
            <div className="relative">
              <Input
                id="comm-rate"
                type="number"
                step="0.1"
                value={commRate}
                onChange={(e) => setCommRate(e.target.value)}
                className="pr-8 font-bold"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">%</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Prélevé automatiquement lors du paiement de chaque commande client.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payout-fee" className="text-xs font-bold">
              Frais fixe de retrait (FCFA)
            </Label>
            <div className="relative">
              <Input
                id="payout-fee"
                type="number"
                value={withdrawFee}
                onChange={(e) => setWithdrawFee(e.target.value)}
                className="pr-12 font-bold"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">FCFA</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Couvre les coûts des APIs Wave et Orange Money lors des virements marchands.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-payout" className="text-xs font-bold">
              Seuil minimum de retrait (FCFA)
            </Label>
            <div className="relative">
              <Input
                id="min-payout"
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="pr-12 font-bold"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">FCFA</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Montant minimum requis dans la cagnotte pour demander un décaissement.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="h-10 px-6 font-bold bg-amber-600 hover:bg-amber-700 text-white">
            <Save className="size-4 mr-2" /> Enregistrer les taux
          </Button>
        </div>
      </form>

      {/* Subscription Plans Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Formules d&apos;Abonnements Mensuels Vendeurs
          </h2>
          <p className="text-xs text-muted-foreground">
            Ces forfaits sont proposés aux commerçants pour débloquer des fonctionnalités premium et réduire leurs commissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAAS_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border-2 p-6 space-y-5 bg-card relative shadow-xs flex flex-col justify-between ${
                plan.popular ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 text-[10px] font-extrabold text-primary-foreground uppercase tracking-wider">
                  {plan.badge}
                </span>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {plan.id === 'starter' && <Zap className="size-5 text-muted-foreground" />}
                  {plan.id === 'pro' && <Sparkles className="size-5 text-primary" />}
                  {plan.id === 'business' && <Crown className="size-5 text-purple-600" />}
                  <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold text-foreground">
                    {plan.price === 0 ? 'Gratuit' : formatCFA(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs text-muted-foreground">/ mois</span>
                  )}
                </div>

                <div className="rounded-xl bg-secondary/50 p-2.5 text-xs font-semibold text-foreground">
                  Commission : <span className="text-primary font-bold">{plan.commissionRate}%</span> par vente
                </div>

                <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Formule active pour les marchands
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
