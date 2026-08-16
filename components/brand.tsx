import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  href = '/',
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2 font-display', className)}
    >
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <span className="text-lg font-extrabold leading-none">D</span>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        Djassa
      </span>
    </Link>
  )
}
