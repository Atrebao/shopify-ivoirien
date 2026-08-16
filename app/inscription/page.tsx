'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Lock,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/brand'
import {
  useStore,
  ABIDJAN_COMMUNES,
  SHOP_CATEGORIES,
  DEFAULT_PRODUCT_IMAGES,
} from '@/lib/store'

export default function InscriptionPage() {
  const router = useRouter()
  const { createShop, addProduct } = useStore()

  const [step, setStep] = useState<1 | 2>(1)
  const [shopName, setShopName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState(SHOP_CATEGORIES[0])
  const [tagline, setTagline] = useState('')
  const [selectedCommunes, setSelectedCommunes] = useState<string[]>([
    'Cocody',
    'Marcory',
    'Yopougon',
    'Plateau',
  ])

  // Step 2 OTP State
  const [otpCode, setOtpCode] = useState('')
  const [demoCode, setDemoCode] = useState('2250')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const phoneValid = /^(\+?225)?\s?[0-9\s]{8,}$/.test(phone.trim())
  const step1Valid = shopName.trim().length >= 3 && ownerName.trim().length >= 2 && phoneValid

  function toggleCommune(c: string) {
    setSelectedCommunes((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c],
    )
  }

  function handleGoToOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!step1Valid) return
    setError('')
    setStep(2)
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (otpCode !== demoCode && otpCode !== '1234') {
      setError('Code incorrect. Entrez le code affiché ci-dessous (2250).')
      return
    }

    setLoading(true)
    const generatedSlug =
      shopName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `boutique-${Date.now()}`

    const newShop = createShop({
      slug: generatedSlug,
      name: shopName.trim(),
      tagline: tagline.trim() || `Les meilleurs articles de ${category} à Abidjan`,
      category,
      ownerName: ownerName.trim(),
      phone: phone.trim().startsWith('+225') ? phone.trim() : `+225 ${phone.trim()}`,
      whatsapp: phone.trim().startsWith('+225') ? phone.trim() : `+225 ${phone.trim()}`,
      payoutPhone: phone.trim().startsWith('+225') ? phone.trim() : `+225 ${phone.trim()}`,
      payoutProvider: 'wave',
      color: 'oklch(0.58 0.15 158)',
      communes: selectedCommunes.length > 0 ? selectedCommunes : ['Cocody', 'Marcory'],
    })

    // Seed 1 starter product for this new shop
    addProduct({
      shopSlug: newShop.slug,
      title: `Article vedette de ${newShop.name}`,
      price: 15000,
      description: `Produit authentique et de haute qualité proposé par ${newShop.name}. Commandez dès maintenant !`,
      image: DEFAULT_PRODUCT_IMAGES[0].url,
      stock: 10,
      category,
    })

    setTimeout(() => {
      setLoading(false)
      router.push('/tableau-de-bord')
    }, 600)
  }

  return (
    <div className="min-h-dvh bg-muted/20 flex flex-col justify-between">
      <header className="border-b border-border/70 bg-background/85 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo />
          <Link
            href="/connexion"
            className="text-xs sm:text-sm font-semibold text-primary hover:underline"
          >
            Déjà une boutique ? Se connecter
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-semibold text-muted-foreground">
            <span className={step === 1 ? 'text-primary font-bold' : ''}>
              1. Détails de la boutique
            </span>
            <span className="h-0.5 w-12 bg-border" />
            <span className={step === 2 ? 'text-primary font-bold' : ''}>
              2. Vérification OTP WhatsApp
            </span>
          </div>

          {step === 1 ? (
            <form onSubmit={handleGoToOtp} className="space-y-5">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Rocket className="size-3.5" /> Création express en 2 minutes
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Lance ta boutique ivoirienne
                </h1>
                <p className="text-sm text-muted-foreground">
                  Génère un lien unique pour ta bio Instagram et ton statut WhatsApp.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="shopName">Nom de ta boutique *</Label>
                  <Input
                    id="shopName"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Ex. Mode Chic Abidjan, Gadgets 225..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ownerName">Ton prénom et nom *</Label>
                    <Input
                      id="ownerName"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Ex. Awa Koné"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="category">Catégorie principale</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {SHOP_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Numéro WhatsApp / Mobile Money (+225) *</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      required
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07 00 00 00 00"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Tu recevras les notifications de commandes et tes reversements Mobile Money sur ce numéro.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tagline">Slogan ou courte description</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Ex. Robes de soirée & pagnes wax cousus main"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Communes de livraison couvertes à Abidjan</Label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ABIDJAN_COMMUNES.map((commune) => {
                      const isSelected = selectedCommunes.includes(commune)
                      return (
                        <button
                          key={commune}
                          type="button"
                          onClick={() => toggleCommune(commune)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {isSelected && <Check className="inline-block size-3 mr-1" />}
                          {commune}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!step1Valid}
                className="w-full h-12 text-base font-semibold"
              >
                Continuer
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                <ArrowLeft className="size-3.5" /> Modifier les informations
              </button>

              <div className="space-y-2 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <MessageCircle className="size-7" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  Vérifie ton numéro WhatsApp
                </h2>
                <p className="text-sm text-muted-foreground">
                  Nous avons simulé l&apos;envoi d&apos;un code de sécurité à 4 chiffres au{' '}
                  <span className="font-semibold text-foreground">{phone}</span>.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">Code de démonstration instantané :</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl font-extrabold tracking-widest text-emerald-600">
                    {demoCode}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-emerald-500/30"
                    onClick={() => setOtpCode(demoCode)}
                  >
                    Remplir automatiquement
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Entre le code à 4 chiffres</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  autoFocus
                  className="text-center font-mono text-xl tracking-widest h-12"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="2250"
                />
                {error && <p className="text-xs text-destructive text-center">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading || otpCode.length < 4}
                className="w-full h-12 text-base font-semibold bg-primary"
              >
                {loading ? 'Création de ta boutique...' : 'Activer ma boutique et accéder au Dashboard'}
                <Sparkles className="size-4 ml-2" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Pas de mot de passe à retenir. Connexion 100% sécurisée par OTP.</span>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        Djassa Côte d&apos;Ivoire · Révolutionner le commerce en ligne sans « prix en inbox »
      </footer>
    </div>
  )
}
