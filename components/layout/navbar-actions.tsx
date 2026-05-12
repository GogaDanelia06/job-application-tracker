"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavbarActions() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">Dashboard</Link>

      <Button className="rounded-full">
        G
      </Button>
    </div>
  );
}