"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SignOutButton from "@/components/sign-out-btn";

export default function NavbarActions() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">Dashboard</Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full">
            G
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}