import { ConciergeFab } from "@/components/humano-web/ConciergeFab"

export default function HumanoWebEnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ConciergeFab />
    </>
  )
}
