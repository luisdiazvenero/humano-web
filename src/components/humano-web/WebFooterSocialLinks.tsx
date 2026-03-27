import Link from "next/link"

export function InstagramBalancedIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookSolidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.62 22v-7.3h2.45l.37-2.85h-2.82V10c0-.82.23-1.38 1.41-1.38h1.5V6.07c-.73-.08-1.46-.11-2.19-.1-2.16 0-3.63 1.32-3.63 3.73v2.15H8.25v2.85h2.46V22h2.91Z" />
    </svg>
  )
}

const socialLinks = [
  {
    label: "Instagram Humano Lima",
    href: "https://www.instagram.com/humanolima/?hl=es",
    Icon: InstagramBalancedIcon,
    iconClassName: "h-[24px] w-[24px]",
  },
  {
    label: "Facebook Humano Lima",
    href: "https://www.facebook.com/humanolima/",
    Icon: FacebookSolidIcon,
    iconClassName: "h-7 w-7",
  },
]

export function WebFooterSocialLinks() {
  return (
    <div className="flex items-center justify-center gap-5 md:justify-start">
      {socialLinks.map(({ label, href, Icon, iconClassName }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex h-7 w-7 items-center justify-center text-white transition hover:text-[var(--color-amarillo)]"
        >
          <Icon className={iconClassName} />
        </Link>
      ))}
    </div>
  )
}
