import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Briefcase, Coffee, Compass } from "lucide-react"

export type IntentId = "work" | "rest" | "adventure"

interface IntentSelectorProps {
    selectedIntent: IntentId | null
    onSelect: (intent: IntentId) => void
}

const INTENTS: { id: IntentId; label: string; icon: React.ElementType; description: string }[] = [
    {
        id: "work",
        label: "Trabajo",
        icon: Briefcase,
        description: "Wifi rápido, reuniones y foco.",
    },
    {
        id: "rest",
        label: "Descanso",
        icon: Coffee,
        description: "Relax, silencio y confort.",
    },
    {
        id: "adventure",
        label: "Aventura",
        icon: Compass,
        description: "Explorar Lima como local.",
    },
]

export function IntentSelector({ selectedIntent, onSelect }: IntentSelectorProps) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {INTENTS.map((item) => {
                const isActive = selectedIntent === item.id
                const Icon = item.icon

                return (
                    <Button
                        key={item.id}
                        type="button"
                        variant="outline"
                        className={cn(
                            "h-auto flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-3 p-4 sm:p-5 text-left transition-all duration-300 min-h-[64px] sm:min-h-[140px] cursor-pointer group relative overflow-hidden border-2",
                            isActive
                                ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/30 scale-[1.03] shadow-2xl shadow-primary/30"
                                : "glass-card border-white/15 hover:bg-[#ECE7D0] hover:text-[#003035] hover:border-primary hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.03] text-foreground"
                        )}
                        onClick={() => onSelect(item.id)}
                    >
                        {/* Hover Glow Effect */}
                        {!isActive && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}
                        <div className={cn(
                            "p-2.5 rounded-full bg-[#FFC85D] w-fit mb-0 sm:mb-1 relative z-10 transition-colors shrink-0",
                            isActive && "bg-[#FFC85D]",
                            "group-hover:bg-[#FFC85D]"
                        )}>
                            <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6 transition-colors text-[#003035]", isActive && "text-[#003035]", "group-hover:text-[#003035]")} />
                        </div>
                        <div className="w-full relative z-10">
                            <span className="block font-semibold text-base sm:text-lg tracking-wide mb-0 sm:mb-1">
                                {item.label}
                            </span>
                            <span className={cn(
                                "text-xs leading-relaxed block w-full text-balance opacity-90 transition-colors hidden sm:block",
                                isActive ? "text-primary-foreground/90" : "text-muted-foreground group-hover:text-[#003035]/80"
                            )}>
                                {item.description}
                            </span>
                        </div>
                    </Button>
                )
            })}
        </div>
    )
}
