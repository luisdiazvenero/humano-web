import { cn } from "@/lib/utils"
import { Logo } from "@/components/humano/Logo"

interface AssistantBubbleProps {
  message: string | React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function AssistantBubble({ message, className, style }: AssistantBubbleProps) {
  return (
    <div className={cn("flex gap-3 items-start max-w-full", className)} style={style}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003744] text-white shadow-md">
        <Logo className="h-4 w-auto text-white" />
      </div>
      <div className="bg-card/60 backdrop-blur-sm rounded-2xl rounded-tl-none px-5 py-3.5 text-sm leading-relaxed shadow-md max-w-[85%]">
        <div className="text-card-foreground">{message}</div>
      </div>
    </div>
  )
}
