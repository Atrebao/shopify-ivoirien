import type { Shop } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ShopAvatar({
  shop,
  className,
}: {
  shop: Shop
  className?: string
}) {
  const initials = shop.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold text-white',
        className,
      )}
      style={{ backgroundColor: shop.color }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
