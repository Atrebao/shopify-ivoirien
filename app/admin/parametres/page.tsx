'use client'

import { useState } from 'react'
import {
  Check,
  Globe,
  Headphones,
  MessageCircle,
  RotateCcw,
  Save,
  Server,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store'

export default function AdminParametresPage() {
  const { platformSettings, updatePlatformSettings, resetToDemoData } = useStore()
  const [name, setName] = useState(platformSettings.platformName)
  const [supportWhatsapp, setSupportWhatsapp] = useState(platformSettings.supportWhatsapp)
  const [saved, setSaved] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updatePlatformSettings({
      platformName: name.trim() || 'Djassa SAAS',
      supportWhatsapp: supportWhatsapp.trim() || '+225 07 00 00 00',
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleReset() {
    resetToDemoData()
    setResetConfirm(true)
    setTimeout(() => setResetConfirm(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Paramètres & Configuration SAAS
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configurez l&apos;identité de la plateforme, le support client et l&apos;état des passerelles de paiement.
        </p>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSave} className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-primary" />
            <h2 className="font-display text-base font-bold text-foreground">
              Identité de la Plateforme
            </h2>
          </div>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
              <Check className="size-3.5" /> Enregistré avec succès !
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="platform-name" className="text-xs font-bold">
              Nom de la plateforme
            </Label>
            <Input
              id="platform-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Djassa CI"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="platform-support" className="text-xs font-bold">
              Numéro WhatsApp Support Central (CI)
            </Label>
            <Input
              id="platform-support"
              value={supportWhatsapp}
              onChange={(e) => setSupportWhatsapp(e.target.value)}
              placeholder="+225 07 00 00 00"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="h-10 px-6 font-bold bg-primary text-primary-foreground">
            <Save className="size-4 mr-2" /> Enregistrer les paramètres
          </Button>
        </div>
      </form>

      {/* Infrastructure & Gateways status */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Server className="size-5 text-emerald-600" />
          <h2 className="font-display text-base font-bold text-foreground">
            État des Passerelles Mobile Money & Serveurs
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-border bg-secondary/30 p-3 text-center space-y-1">
            <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
            <p className="font-bold text-xs text-foreground">Wave CI</p>
            <span className="text-[10px] text-emerald-600 font-bold block">100% Opérationnel</span>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-3 text-center space-y-1">
            <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
            <p className="font-bold text-xs text-foreground">Orange Money</p>
            <span className="text-[10px] text-emerald-600 font-bold block">100% Opérationnel</span>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-3 text-center space-y-1">
            <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
            <p className="font-bold text-xs text-foreground">MTN MoMo</p>
            <span className="text-[10px] text-emerald-600 font-bold block">100% Opérationnel</span>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-3 text-center space-y-1">
            <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
            <p className="font-bold text-xs text-foreground">Moov Money</p>
            <span className="text-[10px] text-emerald-600 font-bold block">100% Opérationnel</span>
          </div>
        </div>
      </div>

      {/* Demo Reset */}
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 shadow-xs space-y-3">
        <h2 className="font-display text-base font-bold text-destructive flex items-center gap-2">
          <RotateCcw className="size-4" />
          Réinitialisation des Données Démo
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Cette action recharge les boutiques exemples de départ, les produits avec variantes de démo et les commandes tests.
        </p>
        <div className="pt-1 flex items-center gap-3">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleReset}
            className="font-bold text-xs h-9"
          >
            Recharger les données de démo
          </Button>
          {resetConfirm && (
            <span className="text-xs font-bold text-emerald-600">
              Données de démo rechargées !
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
