"use client";

import React, { useRef, useState } from "react";
import { Download, MessageCircle, X, Loader2 } from "lucide-react";

export interface ReceiptData {
  donorName: string;
  donorPhone?: string;
  amount: number;
  fund: string;
  category: string;
  message?: string;
  date: string;
  receiptId: string;
}

interface DonationReceiptProps {
  data: ReceiptData;
  onClose: () => void;
}

export default function DonationReceipt({ data, onClose }: DonationReceiptProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<"pdf" | "share" | null>(null);

  const formattedAmount = `₹${data.amount.toLocaleString("en-IN")}`;
  const year = new Date().getFullYear();

  const generatePDF = async () => {
    if (!cardRef.current) return;
    setLoading("pdf");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ICC-Receipt-${data.receiptId}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setLoading(null);
    }
  };

  const shareImage = async () => {
    if (!cardRef.current) return;
    setLoading("share");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      canvas.toBlob(async (blob) => {
        if (!blob) { setLoading(null); return; }
        const file = new File([blob], `ICC-Receipt-${data.receiptId}.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "ICC Donation Receipt", text: `Donation Receipt - ${formattedAmount}` });
        } else {
          const text = `✅ *ICC Donation Receipt*\n\n📋 *Fund:* ${data.fund}\n💰 *Amount:* ${formattedAmount}\n📅 *Date:* ${data.date}\n👤 *Donor:* ${data.donorName}\n\n_JazakAllah Khair!_\n🌐 icc-zeta.vercel.app`;
          const phone = data.donorPhone?.replace(/[^0-9]/g, "");
          const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
          window.open(url, "_blank");
        }
        setLoading(null);
      }, "image/png");
    } catch (e) {
      console.error("Share failed:", e);
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md flex flex-col gap-4 my-4">
        <div className="flex items-center justify-between">
          <p className="text-white/80 text-sm font-medium">Donation Receipt Preview</p>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* THE RECEIPT CARD - this is what gets captured */}
        <div ref={cardRef} className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 text-center overflow-hidden" style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)" }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 border-[20px] border-white" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 border-[20px] border-white" />
            <p className="text-emerald-200 text-xs mb-2" style={{ direction: "rtl", fontFamily: "serif", letterSpacing: "0.05em" }}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 border border-white/30 mb-3">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h2 className="text-white text-xl font-extrabold tracking-tight">ICC Donation Receipt</h2>
            <p className="text-emerald-300 text-xs mt-1 font-medium">Islamic Cultural Centre</p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20">
              <p className="text-white/80 text-[10px] font-mono tracking-widest">#{data.receiptId}</p>
            </div>
          </div>

          {/* Gold divider */}
          <div className="flex items-center">
            <div className="flex-1 h-1" style={{ background: "linear-gradient(90deg, #d97706, #f59e0b)" }} />
            <div className="px-3 py-1 bg-amber-500 text-white text-xs font-bold">✦</div>
            <div className="flex-1 h-1" style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)" }} />
          </div>

          {/* Amount */}
          <div className="px-8 py-5 text-center bg-gradient-to-b from-amber-50 to-white">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">Amount Donated</p>
            <p className="font-extrabold" style={{ fontSize: "2.5rem", lineHeight: 1.1, background: "linear-gradient(135deg, #064e3b, #059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {formattedAmount}
            </p>
          </div>

          {/* Details */}
          <div className="px-8 pb-4 space-y-0">
            {[
              { label: "Donor Name", value: data.donorName, icon: "👤" },
              { label: "Fund", value: data.fund, icon: "🕌" },
              { label: "Date", value: data.date, icon: "📅" },
              ...(data.donorPhone ? [{ label: "Contact", value: data.donorPhone, icon: "📱" }] : []),
              ...(data.message ? [{ label: "Note", value: data.message.replace(/\[Fund:.*?\]\s*/, ""), icon: "📜" }] : []),
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-gray-400 text-xs font-medium">{item.label}</span>
                </div>
                <span className="text-gray-900 text-xs font-bold text-right max-w-[55%] truncate">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Dua */}
          <div className="mx-6 mb-5 p-4 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0" }}>
            <p className="text-emerald-800 text-[11px] font-bold mb-1">📿 Dua for the Donor</p>
            <p className="text-emerald-700 text-[10px] italic leading-relaxed">
              "JazakAllah Khair for your generous contribution.<br/>
              May Allah accept your charity, multiply your reward,<br/>
              and bless your wealth and family. Ameen."
            </p>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 text-center" style={{ background: "linear-gradient(135deg, #064e3b, #065f46)" }}>
            <p className="text-emerald-300 text-[10px] font-medium">🌐 icc-zeta.vercel.app &nbsp;•&nbsp; 📞 9447 351 872</p>
            <p className="text-white/40 text-[9px] mt-1">Official receipt issued by ICC © {year}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={generatePDF} disabled={loading !== null} className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-emerald-800 font-bold rounded-2xl shadow-lg hover:bg-emerald-50 transition-all disabled:opacity-60 text-sm">
            {loading === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download PDF
          </button>
          <button onClick={shareImage} disabled={loading !== null} className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-700 transition-all disabled:opacity-60 text-sm">
            {loading === "share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
            {data.donorPhone ? "Send to WhatsApp" : "Share Receipt"}
          </button>
        </div>
        <p className="text-white/40 text-center text-[10px]">Share via WhatsApp sends this card image directly to the donor</p>
      </div>
    </div>
  );
}
