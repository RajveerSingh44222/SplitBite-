import Link from "next/link";
import { UtensilsCrossed, MessageCircle, Globe, Share2 } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: ["How it works", "Features", "Pricing", "Restaurants"],
  },
  {
    title: "Company",
    links: ["About us", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Help center", "Community", "Blog", "Guides"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookie policy"],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-subtle bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ember text-white">
                <UtensilsCrossed className="h-4 w-4" />
              </span>
              PartyPlatter
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              Collaborative food ordering for every gathering. One link, everyone orders, one delivery.
            </p>
            <div className="mt-5 flex gap-3">
              {[Globe, MessageCircle, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-ink-soft transition-colors hover:border-ember hover:text-ember"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-ink-soft transition-colors hover:text-ember">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-xs text-ink-soft sm:flex-row">
          <p>&copy; {new Date().getFullYear()} PartyPlatter Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Powered by Swiggy MCP &middot; Made for every gathering</p>
        </div>
      </div>
    </footer>
  );
}
