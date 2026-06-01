export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/categories" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
] as const;

export const footerNav = [
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/categories" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Disclosure", href: "/disclosure" },
] as const;

export const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Posts", href: "/admin/posts", icon: "FileText" },
  { label: "Products", href: "/admin/products", icon: "ShoppingBag" },
  { label: "Affiliate Links", href: "/admin/links", icon: "Link" },
  { label: "Categories", href: "/admin/categories", icon: "Tag" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Newsletter", href: "/admin/newsletter", icon: "Mail" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart2" },
  { label: "SEO", href: "/admin/seo", icon: "Search" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;
