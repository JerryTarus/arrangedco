import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path, tag } = await request.json().catch(() => ({}));

  if (tag) {
    revalidateTag(tag, "default");
    return NextResponse.json({ revalidated: true, tag });
  }

  if (path) {
    revalidatePath(path, "page");
    return NextResponse.json({ revalidated: true, path });
  }

  return NextResponse.json({ error: "path or tag required" }, { status: 400 });
}
