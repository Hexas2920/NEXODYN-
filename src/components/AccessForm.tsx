import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { trackingApi } from "@/lib/api-client";

type DeliveryInterest = "injection" | "inhalation" | "transdermal" | "all";

const options: { value: DeliveryInterest; label: string }[] = [
  { value: "all", label: "All Delivery Formats" },
  { value: "injection", label: "Injection" },
  { value: "inhalation", label: "Inhalation" },
  { value: "transdermal", label: "Transdermal" },
];

export function AccessForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    organization: "",
    role: "",
    delivery_interest: "all" as DeliveryInterest,
    message: "",
    consent: false,
  });

  const update =
    <K extends keyof typeof form>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const v =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value;
      setForm((f) => ({ ...f, [k]: v as never }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      toast.error("Please confirm you are a licensed professional to continue.");
      return;
    }
    setStatus("loading");
    try {
      await trackingApi.submitAccessRequest({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim() || null,
        role: form.role.trim() || null,
        delivery_interest: form.delivery_interest,
        message: form.message.trim() || null,
      });
      setStatus("success");
      toast.success("Request received. Our medical affairs team will be in touch shortly.");
    } catch (error) {
      console.error(error);
      toast.error("Submission failed. Please check your details and try again.");
      setStatus("idle");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-sky/50 outline-none transition focus:border-gold/60 focus:bg-white/10";

  return (
    <section id="request-access" className="relative overflow-hidden bg-navy-deep py-28 text-white">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-medical-blue/30 blur-3xl" />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Request Access
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Get the full Instruction Manual package.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-sky/80">
            Licensed healthcare and research professionals can request the complete NEXODYN™ IFU
            dossier — including clinical monographs, dosing guides, and follow-up materials as
            they become available.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              "Complete IFU package for all three delivery formats",
              "Clinical monograph and pharmacology brief",
              "Ongoing safety updates and new-format announcements",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sky/90">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-sky/80 backdrop-blur">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
            Your information is handled confidentially and used only for medical affairs
            follow-up.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-elegant backdrop-blur-xl sm:p-10"
        >
          {status === "success" ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-blue shadow-glow">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-white">
                Request received
              </h3>
              <p className="mt-3 max-w-sm text-sky/80">
                Thank you, {form.full_name.split(" ")[0] || "colleague"}. Our medical affairs
                team will contact you at{" "}
                <span className="font-semibold text-white">{form.email}</span> with the full
                Instruction Manual package and follow-up materials.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setForm({
                    full_name: "",
                    email: "",
                    organization: "",
                    role: "",
                    delivery_interest: "all",
                    message: "",
                    consent: false,
                  });
                }}
                className="mt-8 text-sm font-medium text-gold hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sky/70">
                    Full Name *
                  </span>
                  <input
                    required
                    maxLength={200}
                    className={inputCls}
                    value={form.full_name}
                    onChange={update("full_name")}
                    placeholder="Dr. Jane Doe"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sky/70">
                    Work Email *
                  </span>
                  <input
                    required
                    type="email"
                    maxLength={320}
                    className={inputCls}
                    value={form.email}
                    onChange={update("email")}
                    placeholder="jane.doe@institution.org"
                  />
                </label>
                {/* <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sky/70">
                    Organization
                  </span>
                  <input
                    maxLength={200}
                    className={inputCls}
                    value={form.organization}
                    onChange={update("organization")}
                    placeholder="Institution or company"
                  />
                </label> */}
                {/* <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sky/70">
                    Professional Role
                  </span>
                  <input
                    maxLength={120}
                    className={inputCls}
                    value={form.role}
                    onChange={update("role")}
                    placeholder="Physician, researcher, pharmacist…"
                  />
                </label> */}
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sky/70">
                  Delivery Format of Interest
                </span>
                <select
                  className={inputCls + " appearance-none pr-10"}
                  value={form.delivery_interest}
                  onChange={update("delivery_interest")}
                >
                  {options.map((o) => (
                    <option key={o.value} value={o.value} className="bg-navy-deep">
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-sky/70">
                  Additional Notes
                </span>
                <textarea
                  rows={4}
                  maxLength={2000}
                  className={inputCls + " resize-none"}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell us about your clinical or research context (optional)."
                />
              </label>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-sky/80">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={update("consent")}
                  className="mt-1 h-4 w-4 shrink-0 accent-gold"
                />
                <span>
                  I confirm I am a licensed healthcare or research professional and consent to
                  receive follow-up materials about NEXODYN™.
                </span>
              </label>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-navy-deep shadow-elegant transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> ContactOrder Now
                  </>
                )}
              </button>

              <p className="text-center text-xs text-sky/50">
                Research Use Only. Not intended for patient distribution.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
