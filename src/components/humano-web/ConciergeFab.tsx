"use client"

import Link from "next/link"

function ConciergeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 66 66"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M65 41.2c-.4 8.8-7.7 15.7-16.5 15.7-6.5 0-12.7-3.7-15.5-9.1-2.8 5.2-8.8 9.1-15.4 9.1-9 0-16.1-6.7-16.6-15.7 0-.5.4-1 .9-1.1.5 0 1 .4 1.1.9.5 4.7 5.2 9.1 15.1 3 3.5-2.2 7.5-4.7 14.9-4.7 7.3 0 11.3 2.5 14.9 4.7 9.2 5.6 14.5 2.4 15.1-3 .1-.5.5-.9 1.1-.9.5 0 .9.5.9 1.1z" />
      <path d="M48.1 9.2c-4.8 0-9 2.8-10.9 6.9-2.7-.9-5.7-1-8.5-.1-2-4-6.1-6.8-10.8-6.8-6.7 0-12.1 5.4-12.1 12.1s5.4 12.1 12.1 12.1c5.8 0 10.7-4.1 11.8-9.6 2.2-.6 4.5-.5 6.6.1 1.2 5.4 6 9.5 11.8 9.5 6.7 0 12.1-5.4 12.1-12.1s-5.4-12.1-12.1-12.1zm-12 12.5c-2-.5-4.1-.5-6.1-.1.1-.9-.1-2.4-.5-3.8 2.3-.7 4.8-.6 7.1.1-.6 1.7-.5 2.7-.5 3.8z" />
    </svg>
  )
}

export function ConciergeFab() {
  return (
    <Link
      href="/conserje"
      aria-label="Ir al conserje"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-azul-rgb)] text-white shadow-[0_4px_20px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-105 hover:shadow-[0_6px_28px_rgba(0,0,0,0.36)] sm:bottom-8 sm:right-8"
    >
      <ConciergeIcon className="h-6 w-6" />
    </Link>
  )
}
