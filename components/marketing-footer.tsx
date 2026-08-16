import Link from 'next/link'
import { Logo } from '@/components/brand'
import { MobileMoneyBadges } from '@/components/mobile-money-badges'

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            La façon la plus simple de vendre en ligne en Côte d&apos;Ivoire.
            Un lien, des prix affichés, et le paiement Mobile Money. Fini le
            «&nbsp;prix en inbox&nbsp;».
          </p>
          <MobileMoneyBadges />
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="space-y-3">
            <p className="font-semibold text-foreground">Produit</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/inscription" className="hover:text-foreground">
                  Créer ma boutique
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-foreground">
                  Connexion Vendeur
                </Link>
              </li>
              <li>
                <Link href="/boutique/chez-awa" className="hover:text-foreground">
                  Boutique démo
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-foreground">Villes couvertes</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Abidjan (Toutes communes)</li>
              <li>Bouaké</li>
              <li>Yamoussoukro</li>
              <li>San-Pédro</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Djassa CI — Plateforme E-commerce Mobile Money Côte d&apos;Ivoire.
        </div>
      </div>
    </footer>
  )
}
