'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  Store,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/brand'
import { useStore } from '@/lib/store'

export default function ConnexionPage() {
  const router = useRouter()
  const { shops, setCurrentShopSlug } = useStore()

  const [phone, setPhone] = useState('+225 07 00 00 00')
  const [step, setStep] = useState<1 | 2>(1)
  const [otpCode, setOtpCode] = useState('')
  const [demoCode] = useState('2250')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) return
    setError('')
    setStep(2)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (otpCode !== demoCode && otpCode !== '1234') {
      setError('Code incorrect. Utilisez le code démo 2250.')
      return
    }

    setLoading(true)
    // Find shop matching phone or fallback to first shop
    const matchedShop =
      shops.find((s) => s.phone.includes(phone.replace(/[^0-9]/g, '')) || s.whatsapp.includes(phone.replace(/[^0-9]/g, ''))) ||
      shops[0]

    if (matchedShop) {
      setCurrentShopSlug(matchedShop.slug)
    }

    setTimeout(() => {
      setLoading(false)
      router.push('/tableau-de-bord')
    }, 500)
  }

  return (
    <div className="min-h-dvh bg-muted/20 flex flex-col justify-between">
      <header className="border-b border-border/70 bg-background/85 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo />
          <Link
            href="/inscription"
            className="text-xs sm:text-sm font-semibold text-primary hover:underline"
          >
            Pas encore de boutique ? S&apos;inscrire
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Store className="size-3.5" /> Espace Vendeur
            </span>
            <h1 className="font-display text-2xl font-extrabold text-foreground">
              Connexion rapide
            </h1>
            <p className="text-sm text-muted-foreground">
              Accède au tableau de bord de ta boutique Djassa.
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Numéro de téléphone (+225)</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    required
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 00 00 00"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Boutique de démo pré-enregistrée : <span className="font-medium text-foreground">+225 07 00 00 00 (Chez Awa)</span>
                </p>
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold">
                Recevoir mon code OTP
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                <ArrowLeft className="size-3.5" /> Changer de numéro
              </button>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Code de sécurité envoyé au <span className="font-semibold text-foreground">{phone}</span> :
                </p>
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
                    Auto-remplir
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="otp">Code de connexion à 4 chiffres</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  autoFocus
                  className="text-center font-mono text-xl tracking-widest h-11"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="2250"
                />
                {error && <p className="text-xs text-destructive text-center">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading || otpCode.length < 4}
                className="w-full h-11 text-sm font-semibold"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter au tableau de bord'}
              </Button>
            </form>
          )}

          <div className="pt-2 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Sécurité certifiée Mobile Money CI</span>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        Djassa Côte d&apos;Ivoire
      </footer>
    </div>
  )
}
