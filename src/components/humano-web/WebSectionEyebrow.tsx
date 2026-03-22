import { cn } from "@/lib/utils"

interface WebSectionEyebrowProps {
  label: string
  tone?: "dark" | "light"
  centered?: boolean
  className?: string
}

export function WebSectionEyebrow({
  label,
  tone = "dark",
  centered = false,
  className,
}: WebSectionEyebrowProps) {
  const lineClass =
    tone === "light" ? "bg-white/45" : "bg-[var(--color-azul-rgb)]/28"
  const textClass =
    tone === "light"
      ? "text-white/78"
      : "text-[var(--color-azul-rgb)]/72"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3",
        centered && "justify-center",
        className
      )}
    >
      <span className={cn("h-px w-10 shrink-0", lineClass)} />
      <span
        className={cn(
          "text-[11px] font-semibold uppercase leading-none tracking-[0.32em]",
          textClass
        )}
      >
        {label}
      </span>
      {centered ? <span className={cn("h-px w-10 shrink-0", lineClass)} /> : null}
    </div>
  )
}
