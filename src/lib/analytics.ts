"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
  }
}

export function trackPageview(url: string) {
  window.gtag?.("config", process.env.NEXT_PUBLIC_GA4_ID!, { page_path: url });
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
) {
  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackAffiliateClick(
  productName: string,
  destinationUrl: string,
) {
  trackEvent("affiliate_click", "Affiliate", productName);
  window.pintrk?.("track", "Checkout", {
    content_name: productName,
    content_category: "affiliate",
  });
}
