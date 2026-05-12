import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl">🎁</span>

      <span className="text-xl font-bold text-rose-500">
        Job Tracker
      </span>
    </Link>
  );
}