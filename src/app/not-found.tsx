import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF8F5] px-6 text-center">
      <span className="font-serif text-[96px] font-semibold leading-none text-[#EAE4DB]">
        404
      </span>
      <h1 className="font-serif text-2xl font-medium text-[#3D3834]">
        Page not found
      </h1>
      <p className="text-sm text-[#8A8580]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <button
          className="mt-2 cursor-pointer rounded-xl border-none px-7 py-3 text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #C4533A, #E8724F)" }}
        >
          Go home
        </button>
      </Link>
    </div>
  );
}
