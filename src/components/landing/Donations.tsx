"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  HandHeart,
  Shield,
  CheckCircle2,
  Sparkles,
  Gift,
  HeartHandshake,
  Sun,
  Scroll,
  BookOpen,
  Smartphone,
  CreditCard,
  QrCode,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  Container,
  SectionHeading,
  Button,
  ProgressBar,
  Modal,
  Input,
  Textarea,
  Badge,
} from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { DONATION_PRESETS } from "@/lib/constants";
import { recordDonation, fetchFoodRates, fetchSetting, FoodRate } from "@/lib/supabase/api";

const UPI_ID = "fcbizmdakhw@freecharge";
const UPI_PAYEE_NAME = "ICC";

const DONATION_CARDS = [
  {
    id: "celebration",
    title: "Celebration & Milestone Fund",
    subtitle: "Celebrate Memorable Occasions with Our Children",
    description:
      "Mark birthdays, anniversaries, graduations, or family milestones by sharing joy. Your contribution provides special meals, gifts, and celebration activities for ICC students and orphans.",
    icon: Gift,
    color: "from-amber-500 to-amber-600",
    badge: "Share Joy",
  },
  {
    id: "legacy",
    title: "Commemoration & Legacy Fund",
    subtitle: "Sadaqah Jariyah for Departed Beloved Ones",
    description:
      "Honor the blessed memory of parents, relatives, or loved ones who have passed away. Your contribution acts as an ongoing charity (Sadaqah Jariyah) benefiting their souls in the hereafter.",
    icon: HeartHandshake,
    color: "from-rose-500 to-rose-600",
    badge: "In Loving Memory",
  },
  {
    id: "intention",
    title: "Special Intention & Gratitude Fund",
    subtitle: "Spiritual Gratitude & Fulfilling Needs (Neercha / Niyyah)",
    description:
      "Fulfill a spiritual intention, express gratitude for a divine blessing, or seek ease and healing in a personal matter. Submit your specific dua request with your gift.",
    icon: Sun,
    color: "from-emerald-500 to-emerald-600",
    badge: "Niyyah & Gratitude",
  },
  {
    id: "general",
    title: "General Sadaqah & Student Support",
    subtitle: "Empower Future Scholars & Educational Excellence",
    description:
      "Support day-to-day educational operations, Quranic learning, student scholarships, and campus facilities across our center.",
    icon: HandHeart,
    color: "from-purple-500 to-purple-600",
    badge: "General Fund",
  },
];

const FEATURED_CAUSES = [
  {
    id: "masjid",
    title: "Masjid & Campus Renovation Fund",
    raised: 75000,
    goal: 100000,
    donors: 342,
    description: "Upgrading prayer halls, library facilities, and learning spaces for our students.",
  },
  {
    id: "orphan",
    title: "Orphan & Student Sponsorship Program",
    raised: 45000,
    goal: 60000,
    donors: 189,
    description: "Providing full tuition, meals, and books for deserving students.",
  },
  {
    id: "scholarship",
    title: "Student Academic Scholarship Fund",
    raised: 52000,
    goal: 75000,
    donors: 215,
    description: "Empowering young scholars with higher education & leadership training.",
  },
];

export default function Donations() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof DONATION_CARDS[0]>(DONATION_CARDS[0]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [duaNote, setDuaNote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorPhone, setDonorPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [paymentTab, setPaymentTab] = useState<"form" | "qr">("form");

  const [foodRates, setFoodRates] = useState<FoodRate[]>([]);
  const [studentCount, setStudentCount] = useState("150");

  useEffect(() => {
    async function loadData() {
      const rates = await fetchFoodRates();
      const count = await fetchSetting("student_count", "150");
      setFoodRates(rates);
      setStudentCount(count);
    }
    loadData();
  }, []);

  const activeAmount = selectedAmount || Number(customAmount) || 0;

  const handleOpenCardModal = (card: typeof DONATION_CARDS[0]) => {
    setSelectedCard(card);
    setShowModal(true);
    setStatus("idle");
  };

  const handleConfirmPayment = async () => {
    if (activeAmount <= 0) return;
    setStatus("submitting");

    await recordDonation({
      donor_name: donorName || "Supporter",
      donor_email: donorEmail || "donor@example.com",
      donor_phone: donorPhone || undefined,
      amount: activeAmount,
      category: selectedCard.id as any,
      message: duaNote ? `[Dua/Wasiyya]: ${duaNote}` : undefined,
      is_anonymous: isAnonymous,
      status: "pending",
    });

    setStatus("success");
  };

  return (
    <section id="donate" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-sand-950" />
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          badge="Ways to Give"
          title="Generosity That Touches Souls"
          subtitle="Whether celebrating a happy milestone, honoring a departed loved one, or seeking ease in a personal need, your gift creates lasting blessings."
          className="[&_h2]:text-white [&_p]:text-emerald-200/70 [&_span]:bg-gold-600/20 [&_span]:text-gold-300"
        />

        {/* Dedicated Donation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {DONATION_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => handleOpenCardModal(card)}
              className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-gold-400/60 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <card.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="gold" className="text-[10px] uppercase font-bold">
                    {card.badge}
                  </Badge>
                </div>

                <h3 className="font-extrabold text-white text-lg mb-1 group-hover:text-gold-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-300 mb-3">{card.subtitle}</p>
                <p className="text-xs text-sand-300 leading-relaxed line-clamp-3 mb-4">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-gold-400 group-hover:text-white">
                <span>View Details & Contribute</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Causes */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold text-white">Active Endowment Projects</h3>
            <p className="text-xs text-emerald-200/70 mt-1">Directly support ongoing center campaigns</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_CAUSES.map((cause) => (
              <div
                key={cause.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">{cause.title}</h4>
                  <p className="text-xs text-sand-300 mb-4">{cause.description}</p>

                  <ProgressBar
                    value={cause.raised}
                    max={cause.goal}
                    className="[&_span]:text-emerald-200/80 [&_.bg-sand-200]:bg-white/10 mb-3"
                  />

                  <div className="flex justify-between text-xs mb-4">
                    <span className="text-emerald-200/80">
                      Raised: <span className="font-bold text-gold-400">{formatCurrency(cause.raised)}</span>
                    </span>
                    <span className="text-emerald-200/60">Goal: {formatCurrency(cause.goal)}</span>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="sm"
                  className="w-full font-bold"
                  onClick={() =>
                    handleOpenCardModal({
                      id: cause.id,
                      title: cause.title,
                      subtitle: cause.description,
                      description: `Contribute towards our ${cause.title} campaign goal of ${formatCurrency(cause.goal)}.`,
                      icon: Sparkles,
                      color: "from-gold-500 to-gold-600",
                      badge: "Active Campaign",
                    })
                  }
                >
                  Contribute to This Cause
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-emerald-200/70 pt-4 border-t border-white/10">
          {[
            { icon: Shield, text: "100% Verified & Secure" },
            { icon: CheckCircle2, text: "Official Receipt Issued" },
            { icon: Scroll, text: "Special Dua & Wasiyya Included" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-gold-400" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </Container>

      {/* Full Details & Dua Request Donation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCard.title}
      >
        {status === "success" ? (
          <div className="p-6 text-center space-y-5">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-extrabold text-sand-900">JazakAllah Khair!</h4>
            <p className="text-sm text-sand-600">
              Your contribution of <strong>₹{activeAmount.toLocaleString()}</strong> to the <strong>{selectedCard.title}</strong> has been recorded.
            </p>
            {duaNote && (
              <div className="p-4 rounded-xl bg-gold-50 border border-gold-200 text-left">
                <p className="text-xs font-bold text-gold-800 uppercase tracking-wider mb-1">
                  📜 Special Dua / Intention Recorded:
                </p>
                <p className="text-xs text-sand-700 italic">&ldquo;{duaNote}&rdquo;</p>
              </div>
            )}
            <p className="text-xs text-sand-500 mt-4 bg-sand-50 p-4 rounded-xl border border-sand-200">
              We have received your payment details. Once verified by our team, your official digital receipt will be sent directly to your WhatsApp number.
            </p>

            <button
              onClick={() => { setShowModal(false); setStatus("idle"); setDonorPhone(""); setDonorName(""); setDuaNote(""); setSelectedAmount(100); setCustomAmount(""); }}
              className="text-xs text-sand-400 hover:text-sand-600 underline cursor-pointer mt-2"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Card Overview Banner */}
            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200">
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${selectedCard.color} flex items-center justify-center text-white shrink-0`}>
                  <selectedCard.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sand-900 text-sm">{selectedCard.title}</h4>
                  <p className="text-xs text-emerald-700 font-semibold">{selectedCard.subtitle}</p>
                </div>
              </div>
              <p className="text-xs text-sand-600 leading-relaxed">{selectedCard.description}</p>
            </div>

            {/* Food Gift Rate Card */}
            <div className="rounded-2xl border border-sand-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-4 py-3 flex items-center justify-between">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  🍽️ ഭക്ഷണ നിരക്ക് — Food Gift Rates
                </h4>
                <span className="text-[10px] text-emerald-200 font-medium">{studentCount} Students</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 z-10 shadow-sm">
                    <tr className="bg-sand-100 text-sand-600">
                      <th className="text-left px-4 py-2 font-bold">ഇനം (Item)</th>
                      <th className="text-right px-4 py-2 font-bold whitespace-nowrap">Per Child ₹</th>
                      <th className="text-right px-4 py-2 font-bold whitespace-nowrap">Total ₹</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodRates.map((row, i) => (
                      <tr
                        key={row.id}
                        onClick={() => { setSelectedAmount(row.total_cost); setCustomAmount(""); }}
                        className={`border-b border-sand-100 cursor-pointer transition-colors hover:bg-emerald-50 ${
                          selectedAmount === row.total_cost ? "bg-emerald-50 font-bold" : i % 2 === 0 ? "bg-white" : "bg-sand-50/50"
                        }`}
                      >
                        <td className="px-4 py-2.5 text-sand-800">{row.item_name}</td>
                        <td className="px-4 py-2.5 text-right text-sand-600 font-semibold">₹{row.per_child_cost}</td>
                        <td className="px-4 py-2.5 text-right text-emerald-700 font-bold">₹{row.total_cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-sand-50 px-4 py-2 text-[10px] text-sand-500 flex items-center justify-between border-t border-sand-200">
                <span>👆 Tap any row to set the amount</span>
                <span className="font-bold">Call: 9447 351 872, 8606 255 639</span>
              </div>
            </div>

            {/* GPay / UPI QR Code Payment */}
            <div className="space-y-4">
              <div className="text-center p-6 bg-white rounded-2xl border-2 border-dashed border-emerald-200">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full mb-4">
                  <QrCode className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">Scan to Pay via GPay / PhonePe / Paytm</span>
                </div>
                <div className="mx-auto w-56 h-56 bg-white rounded-2xl shadow-lg border border-sand-200 p-3 mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&cu=INR${activeAmount > 0 ? `&am=${activeAmount}` : ''}`
                    )}`}
                    alt="UPI Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm font-bold text-sand-900 mb-1">ICC</p>
                <p className="text-xs text-sand-500 font-mono bg-sand-50 inline-block px-3 py-1 rounded-lg">{UPI_ID}</p>
                {activeAmount > 0 && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-xs text-sand-600">Amount: </span>
                    <span className="text-lg font-extrabold text-emerald-800">₹{activeAmount}</span>
                  </div>
                )}
              </div>

              {/* Amount Quick Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-2">
                  Set Amount (Optional)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                      className={`py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        selectedAmount === amt
                          ? "bg-emerald-700 text-white shadow-md"
                          : "bg-sand-100 text-sand-700 hover:bg-sand-200"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Note / Dua Request */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1 flex items-center gap-1.5">
                  <Scroll className="h-4 w-4 text-gold-600" />
                  Special Note / Dua Request (Wasiyya & Intention)
                </label>
                <Textarea
                  placeholder="Write any special dua request, names of deceased loved ones to be remembered, or specific intentions for this gift..."
                  rows={3}
                  value={duaNote}
                  onChange={(e) => setDuaNote(e.target.value)}
                />
              </div>

              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-4 text-xs text-sand-400">
                  <span className="h-px flex-1 bg-sand-200" />
                  <span>or pay directly via app</span>
                  <span className="h-px flex-1 bg-sand-200" />
                </div>
                <a
                  href={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&cu=INR${activeAmount > 0 ? `&am=${activeAmount}` : ''}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
                >
                  <Smartphone className="h-5 w-5" />
                  Open UPI App
                </a>
              </div>

              {/* Donor Name + Confirm Payment */}
              <div className="pt-4 border-t border-sand-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Your Name"
                    placeholder="Full Name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                  <Input
                    label="WhatsApp Number"
                    placeholder="e.g. 919447351872"
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full font-bold py-3.5"
                  size="lg"
                  variant="gold"
                  disabled={activeAmount <= 0 || status === "submitting"}
                  onClick={handleConfirmPayment}
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  {status === "submitting" ? "Recording..." : `I've Paid ₹${activeAmount.toLocaleString()} — Submit`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
