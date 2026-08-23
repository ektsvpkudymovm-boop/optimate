"use client";

import { usePathname } from "next/navigation";
import { CookieBanner } from "./cookie-banner";
import { Footer } from "./footer";
import { Header } from "./header";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/landing-v2") return <main className="flex-1">{children}</main>;
  return <><Header /><main className="flex-1">{children}</main><Footer /><CookieBanner /></>;
}
