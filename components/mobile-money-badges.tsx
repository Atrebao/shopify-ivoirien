import { PAYMENT_PROVIDERS, type PaymentProvider } from '@/lib/data'
import { cn } from '@/lib/utils'

const ORDER: PaymentProvider[] = ['wave', 'orange', 'mtn', 'moov']

export function MobileMoneyBadges({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {ORDER.map((p) => {
        const info = PAYMENT_PROVIDERS[p]
        return (
          <span
            key={p}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground"
          >
            <span
              className="grid size-4 place-items-center rounded-full text-[8px] font-bold text-white"
              style={{ backgroundColor: info.color }}
              aria-hidden="true"
            >
              {info.short}
            </span>
            {info.label}
          </span>
        )
      })}
    </div>
  )
}
