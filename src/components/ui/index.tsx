"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ===== Button ===== */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary: "btn-gradient text-white focus:ring-emerald-500",
    secondary:
      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-300",
    outline:
      "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-300",
    ghost: "text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-300",
    gold: "btn-gold text-white focus:ring-gold-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ===== Card ===== */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  id?: string;
}

export function Card({
  children,
  className,
  hover = false,
  glass = false,
  id,
}: CardProps) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl border border-sand-200 bg-white p-6 shadow-sm",
        hover && "card-hover",
        glass && "glass",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ===== Badge ===== */
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info" | "gold";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-sand-100 text-sand-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
    gold: "bg-gold-100 text-gold-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ===== Input ===== */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-sand-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sand-900 placeholder:text-sand-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/* ===== Textarea ===== */
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-sand-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sand-900 placeholder:text-sand-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/* ===== Select ===== */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-sand-700"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sand-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ===== Modal ===== */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-sand-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-sand-400 hover:bg-sand-100 hover:text-sand-600 transition-colors cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ===== Container ===== */
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

/* ===== Section Heading ===== */
interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", "mb-12 md:mb-16", className)}>
      {badge && (
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide uppercase">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-sand-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-sand-500 max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-6 flex justify-center gap-1">
        <span className="h-1 w-8 rounded-full bg-emerald-600" />
        <span className="h-1 w-3 rounded-full bg-gold-500" />
        <span className="h-1 w-3 rounded-full bg-emerald-400" />
      </div>
    </div>
  );
}

/* ===== Progress Bar ===== */
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-sand-600">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-emerald-700">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="h-2.5 rounded-full bg-sand-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* ===== Avatar ===== */
interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
