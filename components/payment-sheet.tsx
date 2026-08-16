'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, QrCode, Smartphone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCFA, PAYMENT_PROVIDERS, type PaymentProvider } from '@/lib/store'

interface PaymentSheetProps {
  provider: PaymentProvider
  phone: string
  amount: number
  onCancel: () => void
  onSuccess: () => void
}

export function PaymentSheet({
  provider,
  phone,
  amount,
  onCancel,
  onSuccess,
}: PaymentSheetProps) {
  const [step, setStep] = useState<'pending' | 'success'>('pending')
  const [countdown, setCountdown] = useState(3)
  const info = PAYMENT_PROVIDERS[provider]

  useEffect(() => {
    // Auto simulate user confirming on mobile phone after 3.5s
    const timer = setTimeout(() => {
      setStep('success')
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (step === 'success') {
      const countdownInterval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(countdownInterval)
            onSuccess()
            return 0
          }
          return c - 1
        })
      }, 1000)
      return () => clearInterval(countdownInterval)
    }
  }, [step, onSuccess])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs sm:items-center p-0 sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-300">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span
              className="grid size-10 place-items-center rounded-2xl font-bold text-white shadow-sm"
              style={{ backgroundColor: info.color }}
            >
              {info.short}
            </span>
            <div>
              <h3 className="font-display font-bold text-base leading-tight">
                Paiement {info.label}
              </h3>
              <p className="text-xs text-muted-foreground">Sécurisé par Mobile Money CI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="py-6 text-center">
          {step === 'pending' ? (
            <div className="space-y-5">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary animate-pulse">
                <Smartphone className="size-8" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Montant à régler
                </p>
                <p className="font-display text-3xl font-extrabold text-foreground mt-1">
                  {formatCFA(amount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Numéro débité : <span className="font-semibold text-foreground">{phone || '+225 07 00 00 00'}</span>
                </p>
              </div>

              {provider === 'wave' && (
                <div className="rounded-2xl border border-border/80 bg-secondary/50 p-4 text-xs text-left space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <QrCode className="size-4 text-primary" />
                    Validation Wave instantanée
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Une notification a été envoyée sur votre application Wave. Validez la transaction pour finaliser.
                  </p>
                </div>
              )}

              {provider === 'orange' && (
                <div className="rounded-2xl border border-border/80 bg-secondary/50 p-4 text-xs text-left space-y-2">
                  <p className="font-semibold text-foreground">Validation Orange Money :</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Composez le <span className="font-bold text-primary">#144#</span> ou confirmez le popup USSD sur votre téléphone.
                  </p>
                </div>
              )}

              {provider === 'mtn' && (
                <div className="rounded-2xl border border-border/80 bg-secondary/50 p-4 text-xs text-left space-y-2">
                  <p className="font-semibold text-foreground">Validation MTN MoMo :</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Entrez votre code secret dans l&apos;invite de validation apparue sur votre écran.
                  </p>
                </div>
              )}

              {provider === 'moov' && (
                <div className="rounded-2xl border border-border/80 bg-secondary/50 p-4 text-xs text-left space-y-2">
                  <p className="font-semibold text-foreground">Validation Moov Money :</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Confirmez la demande de paiement en tapant votre code secret Moov.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>En attente de votre confirmation mobile...</span>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  className="w-full h-11"
                  onClick={() => setStep('success')}
                >
                  J&apos;ai confirmé sur mon téléphone
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={onCancel}
                >
                  Annuler le paiement
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4 animate-in zoom-in-95 duration-300">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-10 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-display text-xl font-bold text-foreground">
                  Paiement Mobile Money validé !
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Transaction de {formatCFA(amount)} effectuée avec succès.
                </p>
                <p className="text-xs text-primary font-medium mt-3">
                  Redirection automatique vers votre reçu dans {countdown}s...
                </p>
              </div>
              <Button
                className="w-full h-11 mt-2"
                onClick={onSuccess}
              >
                Voir mon reçu de commande
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
