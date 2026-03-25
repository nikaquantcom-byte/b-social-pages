import FirmaLayout from "@/components/FirmaLayout";
import { useState } from "react";
import {
  CreditCard,
  Check,
  ArrowRight,
  Download,
  Receipt,
  Zap,
  Crown,
  Building2,
} from "lucide-react";

type Plan = "free" | "starter" | "pro" | "enterprise";

const PLANS: { id: Plan; name: string; price: string; features: string[]; highlight?: boolean }[] = [
  {
    id: "free",
    name: "Free",
    price: "0 kr/md",
    features: ["1 aktiv event", "Basis statistik", "Firma profil"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "199 kr/md",
    features: ["5 aktive events", "Tag-targeting", "Analytics dashboard", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "599 kr/md",
    highlight: true,
    features: ["Ubegr\u00e6nsede events", "Avanceret targeting", "Fuld analytics + geo", "Promoted events", "Prioriteret support", "API adgang"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Kontakt os",
    features: ["Alt i Pro", "Dedikeret account manager", "Custom integrationer", "SLA garanti", "Multi-lokation"],
  },
];

const INVOICES = [
  { id: "INV-2026-003", date: "2026-03-01", amount: "599,00 kr", status: "betalt" },
  { id: "INV-2026-002", date: "2026-02-01", amount: "599,00 kr", status: "betalt" },
  { id: "INV-2026-001", date: "2026-01-01", amount: "599,00 kr", status: "betalt" },
  { id: "INV-2025-012", date: "2025-12-01", amount: "199,00 kr", status: "betalt" },
  { id: "INV-2025-011", date: "2025-11-01", amount: "199,00 kr", status: "betalt" },
];

export default function FirmaFakturering() {
  const [currentPlan] = useState<Plan>("pro");

  return (
    <FirmaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Fakturering</h1>
          <p className="text-muted-foreground text-sm mt-1">Administrer din plan og se betalingshistorik.</p>
        </div>

        {/* Current plan banner */}
        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Crown size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold">Pro plan</p>
              <p className="text-sm text-muted-foreground">599 kr/md &middot; Fornyes 1. april 2026</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-white/5 rounded-lg text-muted-foreground hover:text-foreground">Annuller plan</button>
          </div>
        </div>

        {/* Plans grid */}
        <div>
          <h2 className="font-semibold mb-4">Alle planer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              return (
                <div
                  key={plan.id}
                  className={`glass-card rounded-xl p-4 flex flex-col ${
                    plan.highlight ? "border border-primary/30 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {plan.id === "enterprise" ? (
                      <Building2 size={16} className="text-primary" />
                    ) : plan.id === "pro" ? (
                      <Zap size={16} className="text-primary" />
                    ) : null}
                    <h3 className="font-semibold text-sm">{plan.name}</h3>
                  </div>
                  <p className="text-xl font-bold mb-4">{plan.price}</p>
                  <ul className="space-y-2 flex-1 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={14} className="text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm text-center font-medium">
                      Nuv\u00e6rende plan
                    </div>
                  ) : (
                    <button className="px-3 py-2 rounded-lg bg-white/5 text-sm text-foreground hover:bg-white/10 transition-colors text-center">
                      {plan.id === "enterprise" ? "Kontakt salg" : plan.id === "free" ? "Nedgrader" : "Opgrader"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment history */}
        <div className="glass-card rounded-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Receipt size={16} className="text-primary" />
              Betalingshistorik
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Faktura</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Dato</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Bel\u00f8b</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium">{inv.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                    <td className="px-4 py-3 text-right">{inv.amount}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded hover:bg-white/10 text-muted-foreground">
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment method */}
        <div className="glass-card rounded-xl p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={16} className="text-primary" />
            Betalingsmetode
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="text-sm font-medium">**** **** **** 4242</p>
                <p className="text-xs text-muted-foreground">Udl\u00f8ber 12/28</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">\u00c6ndre</button>
          </div>
        </div>
      </div>
    </FirmaLayout>
  );
}
