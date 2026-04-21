import { ConciergeFab } from "@/components/humano-web/ConciergeFab"

export default function HumanoWebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ConciergeFab />
    </>
  )
}
