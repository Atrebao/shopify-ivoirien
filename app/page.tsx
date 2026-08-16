import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Link2,
  Wallet,
  Truck,
  Store,
  MessageCircle,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MarketingHeader } from '@/components/marketing-header'
import { MarketingFooter } from '@/components/marketing-footer'
import { MobileMoneyBadges } from '@/components/mobile-money-badges'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Fait pour la Côte d&apos;Ivoire
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            Ta boutique en ligne en{' '}
            <span className="text-primary">2 minutes</span>.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Transforme ton statut WhatsApp et ta bio Instagram en vraie
            boutique. Prix affichés, commandes claires, paiement Mobile Money.
            Fini le «&nbsp;prix en inbox&nbsp;».
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 text-base">
              <Link href="/inscription">
                Créer ma boutique gratuitement
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 text-base">
              <Link href="/boutique/chez-awa">Voir une boutique</Link>
            </Button>
          </div>
          <div className="space-y-2 pt-2">
            <p className="text-xs font-medium text-muted-foreground">
              Paiements acceptés
            </p>
            <MobileMoneyBadges />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-primary/10 blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl">
            <Image
              src="/hero-vendeuse.png"
              alt="Vendeuse ivoirienne gérant sa boutique en ligne sur son téléphone"
              width={720}
              height={720}
              priority
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-lg sm:-left-6">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Wallet className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">Nouvelle commande</p>
              <p className="text-xs text-muted-foreground">
                Payée via Wave · 26 500 FCFA
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemSolution() {
  const problems = [
    'Le client doit demander le prix en message privé',
    'Négociations interminables sur WhatsApp',
    'Pas de suivi clair des commandes',
    'Paiement compliqué, beaucoup abandonnent',
  ]
  const solutions = [
    'Les prix sont affichés, tout le monde les voit',
    'Le client commande seul, en quelques clics',
    'Un tableau de bord avec le statut de chaque commande',
    'Paiement Mobile Money direct : Wave, Orange, MTN, Moov',
  ]
  return (
    <section id="avantages" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
            Le problème du «&nbsp;prix en inbox&nbsp;», réglé.
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Vendre sur les réseaux, c&apos;est bien. Mais ça fait perdre des
            clients. Djassa rend la vente aussi simple qu&apos;un lien.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Sans Djassa
            </p>
            <ul className="space-y-3">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                    <X className="size-3.5" />
                  </span>
                  <span className="text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-6">
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-primary">
              Avec Djassa
            </p>
            <ul className="space-y-3">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                  <span className="font-medium text-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: Store,
      title: 'Crée ta boutique',
      text: "Inscris-toi avec ton numéro de téléphone. Ajoute une photo, un titre, un prix. C'est prêt.",
    },
    {
      icon: Link2,
      title: 'Partage ton lien',
      text: 'Colle ton lien djassa.ci dans ta bio Instagram ou ton statut WhatsApp. Tes clients voient tout.',
    },
    {
      icon: Wallet,
      title: 'Encaisse en Mobile Money',
      text: 'Le client commande et paie via Wave, Orange, MTN ou Moov. Tu suis tout depuis ton tableau de bord.',
    },
  ]
  return (
    <section id="comment" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
          Trois étapes, zéro prise de tête.
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-3xl border border-border bg-card p-6"
          >
            <span className="absolute right-5 top-5 font-display text-3xl font-extrabold text-primary/15">
              {i + 1}
            </span>
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <s.icon className="size-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: Wallet,
      title: 'Paiement Mobile Money',
      text: 'Wave, Orange Money, MTN MoMo et Moov Money. Le client paie sans quitter la commande.',
    },
    {
      icon: Truck,
      title: 'Livraison locale',
      text: 'Domicile, point relais ou retrait. Choisis les communes que tu livres.',
    },
    {
      icon: MessageCircle,
      title: 'Connecté à WhatsApp',
      text: 'Chaque commande arrive avec le numéro du client pour confirmer la livraison.',
    },
    {
      icon: Store,
      title: 'Léger comme une PWA',
      text: 'Rien à installer, rien qui sature le téléphone. Ça marche même en connexion faible.',
    },
  ]
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-accent/20 text-accent-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground md:px-16">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
          Prête à vendre sans négocier ?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-primary-foreground/85 text-pretty">
          Crée ta boutique gratuitement et partage ton premier lien
          aujourd&apos;hui.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-12 text-base"
          >
            <Link href="/inscription">
              Créer ma boutique
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-primary-foreground/30 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/boutique/chez-awa">Explorer une boutique</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
