import Link from "next/link";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-playfair font-bold text-lg mb-2">{siteConfig.name}</p>
          <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>
        <nav className="flex flex-col gap-2">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-muted-foreground">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>
            We may earn a commission from links.{" "}
            <Link href="/disclosure" className="underline underline-offset-2">
              Disclosure
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
