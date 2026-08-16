import Link from 'next/link'
import { Logo } from '@/components/brand'
import { Button } from '@/components/ui/button'

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/#comment" className="transition-colors hover:text-foreground">
            Comment ça marche
          </Link>
          <Link href="/#avantages" className="transition-colors hover:text-foreground">
            Avantages
          </Link>
          <Link
            href="/boutique/chez-awa"
            className="transition-colors hover:text-foreground flex items-center gap-1 font-semibold text-primary"
          >
            Boutique démo
          </Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <Button asChild variant="ghost" size="sm" className="font-semibold text-xs sm:text-sm">
            <Link href="/connexion">Se connecter</Link>
          </Button>
          <Button asChild size="sm" className="font-bold text-xs sm:text-sm bg-primary text-primary-foreground">
            <Link href="/inscription">Créer ma boutique</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
