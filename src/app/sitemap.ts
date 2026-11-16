import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mentormindai-137a0.web.app";
  const now = new Date();

  const publicRoutes = [
    "",
    "/about",
    "/features",
    "/how-it-works",
    "/pricing",
    "/faq",
    "/blog",
    "/contact",
    "/help-center",
    "/sitemap",
    "/login",
    "/signup",
  ];

  const legalRoutes = [
    "/privacy",
    "/terms",
    "/tos",
    "/cookies",
    "/cookie-preferences",
    "/disclaimer",
    "/acceptable-use",
    "/copyright",
    "/data-retention",
    "/account-deletion",
    "/grievance",
    "/accessibility",
    "/third-party",
    "/ai-disclaimer",
    "/community-guidelines",
    "/refunds",
    "/shipping",
    "/subscription-terms",
  ];

  const publicEntries = publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  const legalEntries = legalRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...publicEntries, ...legalEntries];
}
