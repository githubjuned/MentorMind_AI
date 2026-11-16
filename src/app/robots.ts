import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mentormindai-137a0.web.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/app/",
          "/dashboard/",
          "/admin/",
          "/api/",
          "/session-expired",
          "/account-suspended",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
