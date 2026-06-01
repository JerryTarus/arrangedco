import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function MediaPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Media Library</h1>
      <MediaLibrary />
    </div>
  );
}
