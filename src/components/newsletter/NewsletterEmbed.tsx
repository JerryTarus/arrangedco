export function NewsletterEmbed() {
  const embedUrl = process.env.NEXT_PUBLIC_BEEHIIV_EMBED_URL;

  if (!embedUrl) {
    return (
      <div className="rounded-xl border bg-muted/30 p-8 text-center text-muted-foreground text-sm">
        Newsletter embed not configured. Set NEXT_PUBLIC_BEEHIIV_EMBED_URL.
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="320"
      className="rounded-xl border-0"
      style={{ background: "transparent" }}
      title="Newsletter signup"
    />
  );
}
