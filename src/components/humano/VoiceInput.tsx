import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
    isListening: boolean
    onToggle: () => void
    className?: string
    size?: "small" | "large"
}

export function VoiceInput({ isListening, onToggle, className, size = "large" }: VoiceInputProps) {
    const isSmall = size === "small"

    return (
        <div className={cn("relative flex flex-col items-center gap-4", isSmall && "gap-0")}>
            <button
                onClick={onToggle}
                className={cn(
                    "relative rounded-full backdrop-blur-sm transition-all duration-300 shadow-2xl flex items-center justify-center group cursor-pointer",
                    isSmall ? "h-10 w-10 shadow-lg" : "h-24 w-24",
                    isListening
                        ? "bg-red-500/20 border-2 border-red-500/50 scale-110 shadow-red-500/20"
                        : "bg-primary dark:bg-[#4A5D54] border-2 border-primary/30 dark:border-white/10 hover:scale-105 shadow-primary/20",
                    className
                )}
                aria-label={isListening ? "Detener grabación" : "Iniciar grabación"}
            >
                {isListening && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
                )}
                {isListening ? (
                    <MicOff className={cn(isSmall ? "h-4 w-4" : "h-8 w-8", "text-red-600 dark:text-red-400")} />
                ) : (
                    <Mic className={cn(isSmall ? "h-4 w-4" : "h-8 w-8", "text-[#003035] dark:text-foreground")} />
                )}
                <span className="sr-only">
                    {isListening ? "Detener grabación" : "Iniciar grabación"}
                </span>
            </button>
        </div>
    )
}
