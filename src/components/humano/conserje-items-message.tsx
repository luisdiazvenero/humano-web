import { Logo } from "@/components/humano/Logo"
import { ConserjeItemCard } from "@/components/humano/ConserjeItemCard"
import type { ConserjeItem } from "@/lib/conserje/types"

interface ConserjeItemsMessageProps {
  items: ConserjeItem[]
  onAction?: (action: string, item: ConserjeItem) => void
}

export function ConserjeItemsMessage({ items, onAction }: ConserjeItemsMessageProps) {
  const gridClass = items.length <= 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"

  return (
    <div className="flex gap-4 items-start">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-azul)] text-white shadow-md">
        <Logo className="h-5 w-auto text-white" />
      </div>
      <div className="conserje-items-message">
        <div className={`grid ${gridClass} gap-4`}>
          {items.map((item) => (
            <ConserjeItemCard key={item.id} item={item} onAction={onAction} />
          ))}
        </div>
      </div>
    </div>
  )
}
