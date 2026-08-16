'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ShareButton({
  path,
  label = 'Partager',
  variant = 'outline',
  className,
}: {
  path: string
  label?: string
  variant?: 'outline' | 'secondary' | 'default' | 'ghost'
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url =
      typeof window !== 'undefined' ? `${window.location.origin}${path}` : path
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* user cancelled share or clipboard blocked — no-op */
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleShare}
      className={className}
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {copied ? 'Lien copié !' : label}
    </Button>
  )
}
