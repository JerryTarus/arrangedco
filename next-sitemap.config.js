// @ts-check

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://arranged.co",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/api/"] },
    ],
  },
  exclude: ["/admin/*", "/api/*"],

  // Defaults applied to every URL not listed in additionalPaths
  changefreq: "weekly",
  priority: 0.7,

  /**
   * Add dynamic content that isn't present in the .next build output:
   *   • /categories/[slug]  — dynamic route, generated from config
   *   • /blog/[slug]        — SSG only when Supabase is configured at build time
   */
  additionalPaths: async (config) => {
    /** @type {import('next-sitemap').ISitemapField[]} */
    const paths = [];

    // ── Config categories ─────────────────────────────────────────────────
    const categorySlugs = [
      "kitchen",
      "bedroom",
      "bathroom",
      "living-room",
      "home-office",
      "closet",
      "entryway",
      "garage",
    ];

    for (const slug of categorySlugs) {
      paths.push({
        loc: `/categories/${slug}`,
        changefreq: "weekly",
        priority: 0.7,
      });
    }

    // ── Published posts from Supabase ─────────────────────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = require("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const [postsResult, catsResult] = await Promise.all([
          supabase
            .from("posts")
            .select("slug, updated_at, published_at")
            .eq("status", "published"),
          supabase.from("categories").select("slug"),
        ]);

        // Blog posts
        for (const post of postsResult.data ?? []) {
          paths.push({
            loc: `/blog/${post.slug}`,
            changefreq: "monthly",
            priority: 0.8,
            lastmod: post.updated_at || post.published_at || undefined,
          });
        }

        // Any Supabase categories not already covered by config slugs
        const dbSlugs = (catsResult.data ?? []).map((c) => c.slug);
        const extraSlugs = dbSlugs.filter((s) => !categorySlugs.includes(s));
        for (const slug of extraSlugs) {
          paths.push({
            loc: `/categories/${slug}`,
            changefreq: "weekly",
            priority: 0.7,
          });
        }
      } catch (err) {
        // Non-fatal: sitemap is still generated without dynamic content
        console.warn(
          "[next-sitemap] Supabase fetch skipped:",
          /** @type {Error} */ (err).message,
        );
      }
    }

    return paths;
  },
};
