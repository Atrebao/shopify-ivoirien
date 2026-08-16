'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  Coins,
  CreditCard,
  Crown,
  Eye,
  ExternalLink,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand'
import { useStore, formatCFA } from '@/lib/store'

const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Vue d’Ensemble', icon: LayoutDashboard },
  { href: '/admin/boutiques', label: 'Boutiques Marchandes', icon: Building2 },
  { href: '/admin/vendeurs', label: 'Vendeurs & Utilisateurs', icon: Users },
  { href: '/admin/tresorerie', label: 'Trésorerie & Payouts', icon: Wallet },
  { href: '/admin/transactions', label: 'Journal Transactions', icon: CreditCard },
  { href: '/admin/monetisation', label: 'Monétisation & Plans', icon: Coins },
  { href: '/admin/parametres', label: 'Paramètres Plateforme', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { shops, orders, payouts, getGlobalAdminStats } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const stats = getGlobalAdminStats()

  return (
    <div className="flex min-h-dvh bg-muted/20">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Modern SAAS Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-border/80 bg-card/95 backdrop-blur-md transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 p-5">
          {/* Brand & Super-Admin Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo href="/admin" />
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-amber-700 uppercase">
                SAAS ADMIN
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary md:hidden"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* SAAS Quick Stats Card */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
              <span>Volume Global (GMV)</span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="font-display text-lg font-extrabold text-foreground">
              {formatCFA(stats.totalGMV)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Commissions perçues : <span className="font-bold text-primary">{formatCFA(stats.totalCommissions)}</span>
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Menu Administration
            </p>
            {ADMIN_NAV_LINKS.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              let badgeCount: number | null = null

              if (link.href === '/admin/boutiques') badgeCount = shops.length
              if (link.href === '/admin/tresorerie') badgeCount = payouts.length
              if (link.href === '/admin/transactions') badgeCount = orders.length

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`size-4 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                    {link.label}
                  </span>
                  {badgeCount !== null && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-secondary text-foreground border border-border'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="border-t border-border/70 p-4 space-y-2 bg-secondary/20">
          <Button asChild variant="outline" size="sm" className="w-full justify-start text-xs h-9 font-semibold">
            <Link href="/tableau-de-bord">
              <Store className="size-3.5 mr-2 text-primary" />
              Basculer vers Espace Vendeur
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="w-full justify-start text-xs h-8 text-muted-foreground">
            <Link href="/boutique/chez-awa" target="_blank">
              <Eye className="size-3.5 mr-2" />
              Voir une vitrine acheteur
              <ExternalLink className="size-3 ml-auto opacity-60" />
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area with Top Bar */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/80 bg-background/90 px-4 sm:px-8 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="grid size-9 place-items-center rounded-xl border border-border bg-card text-foreground md:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                Système Opérationnel · Wave, Orange, MTN, Moov CI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="h-9 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="/admin/monetisation">
                <Coins className="size-3.5 mr-1.5" /> Gérer les Tarifs
              </Link>
            </Button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
