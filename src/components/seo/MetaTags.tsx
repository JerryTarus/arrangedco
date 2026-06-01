import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

type Props = Parameters<typeof buildMetadata>[0];

export function generateMeta(props?: Props): Metadata {
  return buildMetadata(props);
}
