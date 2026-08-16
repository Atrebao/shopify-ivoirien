'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2,
  Check,
  Crown,
  ExternalLink,
  Filter,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Store,
  Trash2,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore, formatCFA, generateWhatsAppLink, type ShopStatus, type ShopPlan } from '@/lib/store'
import { ShopAvatar } from '@/components/shop-avatar'

export default function AdminBoutiquesPage() {
  const { shops, verifyShop, suspendShop, updateShopPlan, getFinancials } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ShopStatus>('all')
  const [planFilter, setPlanFilter] = useState<'all' | ShopPlan>('all')

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchSearch =
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.slug.toLowerCase().includes(searchTerm.toLowerCase())

      const matchStatus = statusFilter === 'all' || shop.status === statusFilter
      const matchPlan = planFilter === 'all' || shop.plan === planFilter

      return matchSearch && matchStatus && matchPlan
    })
  }, [shops, searchTerm, statusFilter, planFilter])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Gestion des Boutiques Marchandes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Supervisez les boutiques créées, attribuez le badge vérifié et gérez les formules d&apos;abonnements.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, commerçant, catégorie ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="verifiee">Vérifiée</option>
            <option value="active">Active</option>
            <option value="suspendue">Suspendue</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as any)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Toutes les formules</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro Commerçant</option>
            <option value="business">Business VIP</option>
          </select>
        </div>
      </div>

      {/* Table of Shops */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Boutique</th>
                <th className="px-4 py-4">Commerçant</th>
                <th className="px-4 py-4">Catégorie</th>
                <th className="px-4 py-4">Formule</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-4 py-4">Ventes</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredShops.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    Aucune boutique trouvée avec ces filtres.
                  </td>
                </tr>
              ) : (
                filteredShops.map((shop) => {
                  const fin = getFinancials(shop.slug)
                  const isVerified = shop.status === 'verifiee'
                  const isSuspended = shop.status === 'suspendue'

                  const whatsappUrl = generateWhatsAppLink(
                    shop.whatsapp || shop.phone,
                    `Bonjour ${shop.ownerName}, ici l'équipe support de Djassa CI concernant votre boutique ${shop.name} ! 👋`,
                  )

                  return (
                    <tr key={shop.slug} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <ShopAvatar shop={shop} className="size-10 text-xs shrink-0" />
                          <div>
                            <p className="font-bold text-foreground flex items-center gap-1.5">
                              {shop.name}
                              {isVerified && (
                                <ShieldCheck className="size-4 text-blue-500 shrink-0" title="Boutique Vérifiée" />
                              )}
                            </p>
                            <span className="text-xs text-muted-foreground font-mono">
                              djassa.ci/boutique/{shop.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-foreground">{shop.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{shop.phone}</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                          {shop.category}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={shop.plan || 'starter'}
                          onChange={(e) => updateShopPlan(shop.slug, e.target.value as any)}
                          className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                        >
                          <option value="starter">Starter (0 F)</option>
                          <option value="pro">Pro (3 000 F)</option>
                          <option value="business">Business (5 000 F)</option>
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        {isSuspended ? (
                          <span className="rounded-full bg-destructive/10 border border-destructive/30 px-2.5 py-0.5 text-xs font-bold text-destructive">
                            Suspendue
                          </span>
                        ) : isVerified ? (
                          <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-xs font-bold text-blue-600">
                            Certifiée
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold text-foreground">{formatCFA(fin.grossSales)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {fin.ordersCount} commande{fin.ordersCount > 1 ? 's' : ''}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verify / Unverify */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => verifyShop(shop.slug, !isVerified)}
                            className={`h-8 px-2.5 text-xs font-semibold ${
                              isVerified ? 'text-blue-600 hover:bg-blue-500/10' : 'text-muted-foreground'
                            }`}
                            title={isVerified ? 'Retirer la certification' : 'Certifier cette boutique'}
                          >
                            <ShieldCheck className="size-3.5 mr-1" />
                            {isVerified ? 'Certifiée' : 'Certifier'}
                          </Button>

                          {/* Suspend / Reactivate */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => suspendShop(shop.slug, !isSuspended)}
                            className={`h-8 px-2.5 text-xs font-semibold ${
                              isSuspended
                                ? 'text-emerald-600 hover:bg-emerald-500/10'
                                : 'text-destructive hover:bg-destructive/10'
                            }`}
                          >
                            {isSuspended ? 'Réactiver' : 'Suspendre'}
                          </Button>

                          {/* Contact WhatsApp */}
                          <Button asChild size="sm" variant="ghost" className="size-8 p-0 text-emerald-600 hover:bg-emerald-500/10">
                            <Link href={whatsappUrl} target="_blank" title="Contacter sur WhatsApp">
                              <MessageCircle className="size-4" />
                            </Link>
                          </Button>

                          {/* Visit Store */}
                          <Button asChild size="sm" variant="outline" className="size-8 p-0">
                            <Link href={`/boutique/${shop.slug}`} target="_blank" title="Ouvrir la vitrine">
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </Button>
                        </div>
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
