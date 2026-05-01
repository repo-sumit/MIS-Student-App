"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="app-shell flex min-h-[100dvh] flex-col items-center justify-center bg-white p-6">
      <Card padded className="text-center max-w-[320px]">
        <div className="text-[40px] font-bold text-brand">404</div>
        <CardTitle>Page not found</CardTitle>
        <CardSubtitle>The page you're looking for has moved or doesn't exist.</CardSubtitle>
        <Link href="/dashboard" className="block mt-4">
          <Button block>Go to dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
