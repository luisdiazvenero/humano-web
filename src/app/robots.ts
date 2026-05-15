import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/conserje"],
      },
    ],
    sitemap: "https://humanohoteles.com/sitemap.xml",
    host: "https://humanohoteles.com",
  }
}
