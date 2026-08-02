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
    const text = `✅ *ICC Donation Receipt*\n\n🕌 *Organization:* ICC\n📋 *Fund:* ${data.fund}\n💰 *Amount:* ${formattedAmount}\n📅 *Date:* ${data.date}\n👤 *Donor:* ${data.donorName}\n\n_JazakAllah Khair!_\n🌐 icc-zeta.vercel.app`;
    const phone = data.donorPhone ? data.donorPhone.replace(/[^0-9]/g, "") : "";
    const waUrl = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    // Try native file share first if supported on mobile
    if (cardRef.current && navigator.canShare) {
      setLoading("share");
      try {
        const { default: html2canvas } = await import("html2canvas");
        const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        
        if (blob) {
          const file = new File([blob], `ICC-Receipt-${data.receiptId}.png`, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: "ICC Donation Receipt", text });
            setLoading(null);
            return;
          }
        }
      } catch (err) {
        console.warn("Native file share bypassed:", err);
      }
      setLoading(null);
    }

    // Direct fallback for web/desktop: open WhatsApp link directly
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setLoading("share");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `ICC-Receipt-${data.receiptId}.png`;
      link.click();
    } catch (e) {
      console.error("Image download failed:", e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md flex flex-col gap-4 my-4 cursor-default"
      >
        <div className="flex items-center justify-between">
          <p className="text-white/80 text-sm font-medium">Donation Receipt Preview</p>
          <button
            onClick={onClose}
            className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* THE RECEIPT CARD - this is what gets captured */}
        <div ref={cardRef} className="w-full rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: "#ffffff", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 text-center overflow-hidden" style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)" }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 border-[20px] border-white" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 border-[20px] border-white" />
            <p className="text-xs mb-2" style={{ color: "#a7f3d0", direction: "rtl", fontFamily: "serif", letterSpacing: "0.05em" }}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border mb-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", borderColor: "rgba(255, 255, 255, 0.3)" }}>
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#ffffff" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "#ffffff" }}>ICC Donation Receipt</h2>
            <p className="text-xs mt-1 font-medium" style={{ color: "#6ee7b7" }}>Islamic Cultural Centre</p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full border" style={{ backgroundColor: "rgba(255, 255, 255, 0.18)", borderColor: "rgba(255, 255, 255, 0.35)" }}>
              <p className="text-[10px] font-mono tracking-widest font-bold" style={{ color: "#ffffff" }}>#{data.receiptId}</p>
            </div>
          </div>

          {/* Gold divider */}
          <div className="flex items-center">
            <div className="flex-1 h-1" style={{ background: "linear-gradient(90deg, #d97706, #f59e0b)" }} />
            <div className="px-3 py-1 text-xs font-bold" style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}>✦</div>
            <div className="flex-1 h-1" style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)" }} />
          </div>

          {/* Amount */}
          <div className="px-8 py-5 text-center" style={{ background: "linear-gradient(to bottom, #fffbeb, #ffffff)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9ca3af" }}>Amount Donated</p>
            <p className="font-extrabold" style={{ fontSize: "2.5rem", lineHeight: 1.1, color: "#047857" }}>
              {formattedAmount}
            </p>
          </div>

          {/* Details */}
          <div className="px-8 pb-4">
            {[
              { label: "Donor Name", value: data.donorName, icon: "👤" },
              { label: "Fund", value: data.fund, icon: "🕌" },
              { label: "Date", value: data.date, icon: "📅" },
              ...(data.donorPhone ? [{ label: "Contact", value: data.donorPhone, icon: "📱" }] : []),
              ...(data.message ? [{ label: "Note", value: data.message.replace(/\[Fund:.*?\]\s*/, ""), icon: "📜" }] : []),
            ].map((item, i, arr) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px", lineHeight: "1.2" }}>{item.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", lineHeight: "1.4" }}>{item.label}</span>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#111827",
                    textAlign: "right",
                    maxWidth: "60%",
                    wordBreak: "break-word",
                    lineHeight: "1.4",
                    display: "block",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Dua */}
          <div className="mx-6 mb-5 p-4 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0" }}>
            <p className="text-[11px] font-bold mb-1" style={{ color: "#065f46" }}>📿 Dua for the Donor</p>
            <p className="text-[10px] italic leading-relaxed" style={{ color: "#047857" }}>
              "JazakAllah Khair for your generous contribution.<br/>
              May Allah accept your charity, multiply your reward,<br/>
              and bless your wealth and family. Ameen."
            </p>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 text-center" style={{ background: "linear-gradient(135deg, #064e3b, #065f46)" }}>
            <p className="text-[10px] font-medium" style={{ color: "#6ee7b7" }}>🌐 icc-zeta.vercel.app &nbsp;•&nbsp; 📞 9447 351 872</p>
            <p className="text-[9px] mt-1" style={{ color: "rgba(255, 255, 255, 0.4)" }}>Official receipt issued by ICC © {year}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={generatePDF}
            disabled={loading !== null}
            className="flex items-center justify-center gap-1.5 px-3 py-3 bg-white text-emerald-800 font-bold rounded-2xl shadow-lg hover:bg-emerald-50 transition-all disabled:opacity-60 text-xs cursor-pointer"
          >
            {loading === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            PDF Card
          </button>
          <button
            onClick={downloadImage}
            disabled={loading !== null}
            className="flex items-center justify-center gap-1.5 px-3 py-3 bg-emerald-100 text-emerald-900 font-bold rounded-2xl shadow-lg hover:bg-emerald-200 transition-all disabled:opacity-60 text-xs cursor-pointer"
          >
            {loading === "share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Image Card
          </button>
          <button
            onClick={shareImage}
            className="flex items-center justify-center gap-1.5 px-3 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-700 transition-all text-xs cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <p className="text-white/50 text-[10px]">
            Click outside to close
          </p>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white underline text-xs font-medium cursor-pointer"
          >
            Close Window ✖
          </button>
        </div>
      </div>
    </div>
  );
}
