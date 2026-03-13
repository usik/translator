"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Upload,
  FileText,
  X,
  FileSpreadsheet,
  Loader2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Calculator,
  Layers,
  Sparkles,
  Lock,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Bot,
  FileDown,
  ArrowRight,
  ArrowUp,
  Zap,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useProcessInvoices } from "@/lib/api";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = ".pdf,.png,.jpg,.jpeg,.docx,.hwpx,.zip";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function InvoicePageClient() {
  const t = useTranslations("InvoicePage");
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState("xlsx");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const mutation = useProcessInvoices();

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const valid: File[] = [];
    for (const file of Array.from(newFiles)) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 20MB limit.`);
        continue;
      }
      valid.push(file);
    }
    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleProcess = () => {
    if (files.length === 0) return;
    mutation.mutate(
      { files, outputFormat },
      {
        onSuccess: (blob) => {
          const ext = outputFormat === "csv" ? "csv" : "xlsx";
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `expense_report.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          toast.success("Expense report downloaded!");
        },
      }
    );
  };

  return (
    <div className="flex flex-col" ref={topRef}>
      {/* ───── SECTION 1: Hero + Tool ───── */}
      <section className="mx-auto w-full max-w-4xl px-4 pt-10 pb-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex justify-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="size-3" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
            <span className="text-primary">{t("heroHighlight")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t("heroDescription")}
          </p>
        </motion.div>

        {/* Tool Card */}
        <motion.div
          className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              multiple
              onChange={(e) => {
                if (e.target.files?.length) {
                  addFiles(e.target.files);
                  e.target.value = "";
                }
              }}
              className="hidden"
            />
            <UploadCloud className="size-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">{t("dropZone")}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("dropZoneFormats")}
              </p>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <motion.div
                  key={`${file.name}-${i}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5"
                >
                  <FileText className="size-5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>
                    <X className="size-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-muted-foreground">{t("outputFormat")}</label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="size-3.5" /> Excel (.xlsx)
                    </span>
                  </SelectItem>
                  <SelectItem value="csv">
                    <span className="flex items-center gap-2">
                      <FileText className="size-3.5" /> CSV (.csv)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button size="lg" onClick={handleProcess} disabled={files.length === 0 || mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                <>
                  <Download className="mr-2 size-4" />
                  {t("generateReport")} ({files.length} {files.length === 1 ? t("file") : t("files")})
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Trust row */}
        <motion.div
          className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="flex items-center gap-1"><Zap className="size-3" /> {t("trustFree")}</span>
          <span className="flex items-center gap-1"><Lock className="size-3" /> {t("trustNoAccount")}</span>
          <span className="flex items-center gap-1"><Shield className="size-3" /> {t("trustNoStorage")}</span>
        </motion.div>
      </section>

      {/* ───── SECTION 2: Before / After ───── */}
      <section className="border-t border-border/40 bg-muted/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.p variants={fadeIn} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("exampleEyebrow")}
            </motion.p>
            <motion.h2 variants={fadeIn} className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("exampleTitle")}
            </motion.h2>
            <motion.p variants={fadeIn} className="mx-auto mt-2 max-w-lg text-muted-foreground">
              {t("exampleDescription")}
            </motion.p>
          </motion.div>

          {/* Before/After cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("exampleInput")}</p>
              <div className="space-y-2 rounded-lg bg-muted/50 p-4 font-mono text-xs leading-relaxed">
                <p className="font-bold">세금계산서</p>
                <p>공급자: 서울테크솔루션</p>
                <p>등록번호: 123-45-67890</p>
                <p>공급가액: 1,600,000</p>
                <p>세액: 160,000</p>
                <p className="font-bold">합계: 1,760,000 원</p>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium">PDF</span>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium">JPG</span>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium">HWPX</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="hidden sm:flex"
            >
              <ArrowRight className="size-8 text-primary" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("exampleOutput")}</p>
              <div className="space-y-1.5 rounded-lg bg-muted/50 p-4 font-mono text-xs leading-relaxed">
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Vendor</span>
                  <span>Seoul Tech Solutions</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>1,600,000 KRW</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>160,000 KRW</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>1,760,000 KRW</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="size-3.5 text-green-500" />
                <span className="font-medium text-green-600 dark:text-green-400">{t("exampleValidated")}</span>
              </div>
            </motion.div>
          </div>

          {/* Field tags */}
          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[t("fieldVendor"), t("fieldDate"), t("fieldTax"), t("fieldLineItems"), t("fieldFlags")].map((label) => (
              <motion.span
                key={label}
                variants={fadeIn}
                className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── SECTION 3: How It Works ───── */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.p variants={fadeIn} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("howItWorksEyebrow")}
            </motion.p>
            <motion.h2 variants={fadeIn} className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("howItWorksTitle")}
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-8 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { icon: UploadCloud, title: t("step1Title"), desc: t("step1Description"), step: "1" },
              { icon: Bot, title: t("step2Title"), desc: t("step2Description"), step: "2" },
              { icon: FileDown, title: t("step3Title"), desc: t("step3Description"), step: "3" },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeIn} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <item.icon className="size-7 text-primary" />
                </div>
                <div className="mt-2 flex items-center justify-center">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── SECTION 4: Capabilities Bento ───── */}
      <section className="border-t border-border/40 bg-muted/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.p variants={fadeIn} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("capabilitiesEyebrow")}
            </motion.p>
            <motion.h2 variants={fadeIn} className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("capabilitiesTitle")}
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {/* AI extraction — spans full width */}
            <motion.div variants={fadeIn} className="rounded-xl border border-border bg-card p-6 sm:col-span-2">
              <Sparkles className="size-6 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">{t("featureAiTitle")}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("featureAiDescription")}</p>
              {/* Visual: field mapping */}
              <div className="mt-4 grid gap-1.5 rounded-lg bg-muted/50 p-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">공급자</span>
                  <ArrowRight className="size-3 text-primary" />
                  <span>Seoul Tech Solutions Co.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">발행일</span>
                  <ArrowRight className="size-3 text-primary" />
                  <span>2024-03-15</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">合計</span>
                  <ArrowRight className="size-3 text-primary" />
                  <span>¥1,760,000</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="rounded-xl border border-border bg-card p-6">
              <Globe className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{t("featureCjkTitle")}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("featureCjkDescription")}</p>
            </motion.div>

            <motion.div variants={fadeIn} className="rounded-xl border border-border bg-card p-6">
              <Calculator className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{t("featureMathTitle")}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("featureMathDescription")}</p>
            </motion.div>

            <motion.div variants={fadeIn} className="rounded-xl border border-border bg-card p-6">
              <Layers className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{t("featureBatchTitle")}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("featureBatchDescription")}</p>
            </motion.div>

            <motion.div variants={fadeIn} className="rounded-xl border border-border bg-card p-6">
              <FileSpreadsheet className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{t("featureExcelTitle")}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("featureExcelDescription")}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───── SECTION 5: Supported Formats ───── */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.p variants={fadeIn} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("formatsEyebrow")}
            </motion.p>
            <motion.h2 variants={fadeIn} className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("formatsTitle")}
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-6 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {/* Invoice types */}
            <motion.div variants={fadeIn} className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Invoice Types</h3>
              <div className="space-y-3">
                {[
                  { flag: "🇰🇷", name: t("formatKr"), label: t("formatKrLabel") },
                  { flag: "🇯🇵", name: t("formatJp"), label: t("formatJpLabel") },
                  { flag: "🇨🇳", name: t("formatCn"), label: t("formatCnLabel") },
                  { flag: "🌐", name: "", label: t("formatGeneral") },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-lg">{item.flag}</span>
                    <div>
                      {item.name && <p className="text-sm font-medium">{item.name}</p>}
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* File formats */}
            <motion.div variants={fadeIn} className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">File Formats</h3>
              <div className="flex flex-wrap gap-2">
                {["PDF", "JPG", "PNG", "DOCX", "HWPX", "ZIP"].map((fmt) => (
                  <span
                    key={fmt}
                    className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm font-medium"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {t("formatFiles")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───── SECTION 6: Trust / Privacy ───── */}
      <section className="border-t border-border/40 bg-muted/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid gap-6 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { icon: Lock, title: t("privacyNoStorage"), desc: t("privacyNoStorageDesc") },
              { icon: ShieldCheck, title: t("privacyEncrypted"), desc: t("privacyEncryptedDesc") },
              { icon: Trash2, title: t("privacyAutoDelete"), desc: t("privacyAutoDeleteDesc") },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeIn} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="size-5 text-primary" />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── SECTION 7: Bottom CTA ───── */}
      <section className="py-16">
        <motion.div
          className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            {t("ctaDescription")}
          </p>
          <Button
            size="lg"
            className="mt-6"
            onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            <ArrowUp className="mr-2 size-4" />
            {t("ctaButton")}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/translate" className="text-primary hover:underline">
              {t("ctaCrossSell")}
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
