"use client"

import { Star, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface FeaturedRoomProps {
    image?: string
}

export function FeaturedRoom({ image }: FeaturedRoomProps) {
    const router = useRouter()

    return (
        <div
            onClick={() => router.push('/habitacion')}
            className="h-full glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:border-primary/30 transition-all"
        >
            {/* Room Image */}
            <div className="relative h-40 bg-gradient-to-br from-secondary/30 to-muted overflow-hidden">
                {image ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${image}')` }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground/40 text-sm font-serif">Junior Suite</p>
                    </div>
                )}

                {/* Featured Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <div className="px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm">
                        <p className="text-xs font-bold text-primary-foreground">Destacada</p>
                    </div>
                </div>
            </div>

            {/* Room Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="space-y-2">
                    <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                        Junior Suite Vista Mar
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        Amplias ventanas con vista al océano Pacífico. Ideal para trabajo y relax.
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="h-3 w-3 fill-primary text-primary"
                            />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div>
                        <p className="text-xl font-bold text-foreground">$180</p>
                        <p className="text-xs text-muted-foreground">por noche</p>
                    </div>
                    <Button
                        size="sm"
                        className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:scale-105 transition-transform"
                    >
                        Ver más
                        <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
