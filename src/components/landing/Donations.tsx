"use client";

import React, { useState } from "react";
import {
  Heart,
  Scale,
  Moon,
  HandHeart,
  Shield,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  Container,
  SectionHeading,
  Button,
  ProgressBar,
  Modal,
  Input,
} from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { DONATION_PRESETS } from "@/lib/constants";
import { recordDonation } from "@/lib/supabase/api";

const CATEGORIES = [
  {
    id: "zakat",
    label: "Zakat",
    description: "Obligatory annual charity – purify your wealth",
    icon: Scale,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "sadaqah",
    label: "Sadaqah",
    description: "Voluntary giving – earn endless rewards",
    icon: Heart,
    color: "from-rose-500 to-rose-600",
  },
  {
    id: "fitrah",
    label: "Zakat al-Fitr",
    description: "End of Ramadan charity for all family members",
    icon: Moon,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "general",
    label: "General Fund",
    description: "Support all our programs and operations",
    icon: HandHeart,
    color: "from-gold-500 to-gold-600",
  },
];

const FEATURED_CAUSES = [
  {
    title: "Masjid Renovation Fund",
    raised: 75000,
    goal: 100000,
    donors: 342,
  },
  {
    title: "Orphan Sponsorship Program",
    raised: 45000,
    goal: 60000,
    donors: 189,
  },
  {
    title: "Emergency Relief – Gaza",
    raised: 120000,
    goal: 150000,
    donors: 567,
  },
];

export default function Donations() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>("general");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const activeAmount = selectedAmount || Number(customAmount) || 0;

  const handleDonationSubmit = async () => {
    if (activeAmount <= 0) return;
    setStatus("submitting");

    await recordDonation({
      donor_name: isAnonymous ? "Anonymous" : donorName || "Supporter",
      donor_email: donorEmail || "donor@example.com",
      amount: activeAmount,
      category: selectedCategory,
      is_anonymous: isAnonymous,
    });

    setStatus("success");
    setTimeout(() => {
      setShowModal(false);
      setStatus("idle");
      setCustomAmount("");
      setSelectedAmount(100);
      setDonorName("");
      setDonorEmail("");
    }, 2000);
  };

  return (
    <section id="donate" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800" />
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          badge="Donate"
          title="Your Generosity Changes Lives"
          subtitle="Every contribution, big or small, creates ripples of positive change in our community and beyond."
          className="[&_h2]:text-white [&_p]:text-emerald-200/70 [&_span]:bg-gold-600/20 [&_span]:text-gold-300"
        />

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setShowModal(true);
              }}
              className={`relative group p-6 rounded-2xl text-left transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-white/15 border-2 border-gold-400/50"
                  : "bg-white/5 border-2 border-white/10 hover:bg-white/10"
              }`}
            >
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-bold text-white mb-1">{cat.label}</h4>
              <p className="text-xs text-emerald-200/60">{cat.description}</p>
            </button>
          ))}
        </div>

        {/* Featured Causes */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {FEATURED_CAUSES.map((cause) => (
            <div
              key={cause.title}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h4 className="font-bold text-white mb-1">{cause.title}</h4>
              <p className="text-sm text-emerald-200/60 mb-4">
                {cause.donors} donors have contributed
              </p>

              <ProgressBar
                value={cause.raised}
                max={cause.goal}
                className="[&_span]:text-emerald-200/80 [&_.bg-sand-200]:bg-white/10 mb-3"
              />

              <div className="flex justify-between text-sm">
                <span className="text-emerald-200/80">
                  Raised: <span className="font-bold text-gold-400">{formatCurrency(cause.raised)}</span>
                </span>
                <span className="text-emerald-200/60">
                  Goal: {formatCurrency(cause.goal)}
                </span>
              </div>

              <Button
                variant="gold"
                size="sm"
                className="w-full mt-4"
                onClick={() => setShowModal(true)}
              >
                Donate to This Cause
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-emerald-200/60">
          {[
            { icon: Shield, text: "100% Secure" },
            { icon: CheckCircle2, text: "Tax Deductible" },
            { icon: Sparkles, text: "Transparent Reporting" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-gold-400" />
              {item.text}
            </div>
          ))}
        </div>
      </Container>

      {/* Donation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Make a Donation"
      >
        {status === "success" ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-bold text-sand-900">JazakAllah Khair!</h4>
            <p className="text-sm text-sand-500">
              Your donation of {formatCurrency(activeAmount)} has been received. Tax receipt sent to {donorEmail || "your email"}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-2">
                Donation Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-xs cursor-pointer font-medium ${
                      selectedCategory === cat.id
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-sand-200 text-sand-600 hover:border-sand-300"
                    }`}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-2">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {DONATION_PRESETS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                      selectedAmount === amount
                        ? "btn-gradient text-white"
                        : "bg-sand-100 text-sand-700 hover:bg-sand-200"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Custom amount"
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
              />
            </div>

            {/* Donor Info */}
            <div className="space-y-2">
              <Input
                label="Your Name"
                placeholder="Full Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                disabled={isAnonymous}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                required
              />
              <label className="flex items-center gap-2 text-xs text-sand-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-sand-300 text-emerald-600 focus:ring-emerald-500"
                />
                Make this donation anonymous
              </label>
            </div>

            {/* Summary */}
            {activeAmount > 0 && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex justify-between items-center">
                <div>
                  <span className="text-sand-600 text-xs">Total Contribution</span>
                  <p className="text-xs text-sand-400 capitalize">{selectedCategory} Fund</p>
                </div>
                <span className="text-xl font-bold text-emerald-700">
                  {formatCurrency(activeAmount)}
                </span>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              variant="gold"
              disabled={activeAmount <= 0 || status === "submitting"}
              onClick={handleDonationSubmit}
            >
              <Heart className="h-5 w-5" />
              {status === "submitting" ? "Processing..." : `Complete Donation — ${formatCurrency(activeAmount)}`}
            </Button>
          </div>
        )}
      </Modal>
    </section>
  );
}
