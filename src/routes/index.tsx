import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Brain,
  Clock,
  HeartPulse,
  Zap,
  Target,
  Activity,
  Sparkles,
  Download,
  FlaskConical,
  Atom,
  Syringe,
  Wind,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import hero from "@/assets/1 (5).png";
import delivery from "@/assets/1 (4).png";
import injection from "@/assets/1 (3).png";
import inhalation from "@/assets/1 (2).png";
import transdermal from "@/assets/1 (1).png";
import { AccessForm } from "@/components/AccessForm";
import { PageVisitTracker } from "@/components/PageVisitTracker";
import { TrackedDownloadButton, TrackedDownloadLink } from "@/components/TrackedDownloadLink";
import { Toaster } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXODYN™ — Balanced Opioid Analgesic | Next-Generation Pain Relief" },
      {
        name: "description",
        content:
          "NEXODYN™ is a proprietary non-toxic opioid therapeutic delivering potent analgesia and mood modulation without respiratory depression or addictive liability.",
      },
      { property: "og:title", content: "NEXODYN™ — A New Standard in Pain Management" },
      {
        property: "og:description",
        content:
          "Breakthrough non-addictive opioid analgesic with neuroprotective, long-duration action. Available as injection, inhalation and transdermal.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: hero },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: hero },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-navy-deep/70 backdrop-blur-xl supports-[backdrop-filter]:bg-navy-deep/55">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src="/favicon.ico"
            alt="NEXODYN"
            className="h-19 w-19 rounded-lg object-contain"
          />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            NEXODYN<sup className="text-xs text-gold">™</sup>
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {[
            ["Profile", "#profile"],
            ["Mechanism", "#mechanism"],
            ["Effects", "#effects"],
            ["Delivery", "#delivery"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative text-sm font-medium text-sky/80 transition-colors hover:text-white"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#request-access"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy-deep shadow-elegant transition hover:bg-gold hover:text-navy-deep"
        >
          Order Now <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}

function MolecularBackdrop() {
  // Deterministic pseudo-3D molecular lattice
  const nodes = [
    { x: 12, y: 22, r: 2.2, d: 0 },
    { x: 26, y: 68, r: 1.6, d: 0.4 },
    { x: 40, y: 30, r: 2.8, d: 0.8 },
    { x: 55, y: 75, r: 1.8, d: 1.2 },
    { x: 68, y: 20, r: 2.4, d: 0.6 },
    { x: 82, y: 60, r: 2.0, d: 1.4 },
    { x: 92, y: 34, r: 1.6, d: 0.2 },
    { x: 18, y: 88, r: 1.4, d: 1.0 },
    { x: 48, y: 12, r: 1.8, d: 1.6 },
    { x: 72, y: 88, r: 2.2, d: 0.9 },
  ];
  const edges: Array<[number, number]> = [
    [0, 2], [2, 4], [4, 6], [1, 2], [2, 3], [3, 5], [5, 6],
    [1, 3], [4, 8], [7, 1], [5, 9], [3, 9], [0, 8],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Slow parallax rotation to fake 3D depth */}
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <defs>
          <linearGradient id="bondGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(120,180,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,200,90,0.35)" />
          </linearGradient>
          <radialGradient id="atomGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="55%" stopColor="rgba(120,180,255,0.7)" />
            <stop offset="100%" stopColor="rgba(30,60,140,0)" />
          </radialGradient>
          <radialGradient id="atomGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,235,180,1)" />
            <stop offset="55%" stopColor="rgba(255,200,90,0.7)" />
            <stop offset="100%" stopColor="rgba(140,90,20,0)" />
          </radialGradient>
        </defs>
        {edges.map(([a, b], i) => (
          <motion.line
            key={`e-${i}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="url(#bondGrad)"
            strokeWidth="0.18"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0.15, 0.55, 0.15] }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.1 },
              opacity: { duration: 6, repeat: Infinity, delay: i * 0.2 },
            }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={i % 3 === 0 ? "url(#atomGold)" : "url(#atomGrad)"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.35, 0.9, 0.35],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              delay: n.d,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: `${n.x}% ${n.y}%` }}
          />
        ))}
      </motion.svg>

      {/* Floating 3D-tilted molecular cluster */}
      <motion.div
        animate={{ rotateX: [8, -6, 8], rotateY: [-10, 12, -10] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        className="absolute right-[6%] top-[8%] hidden h-64 w-64 lg:block"
      >
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-gold/20" />
        <div className="absolute inset-12 rounded-full border border-medical-blue/25" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <div
            key={a}
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white to-medical-blue shadow-[0_0_16px_rgba(140,180,255,0.9)]"
            style={{ transform: `rotate(${a}deg) translateY(-96px)` }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} id="top" className="relative overflow-hidden bg-gradient-hero pt-24 pb-32">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <MolecularBackdrop />
      <motion.div
        style={{ y, opacity }}
        aria-hidden
        className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-medical-blue/30 blur-3xl"
      />
      <motion.div
        style={{ y, opacity }}
        aria-hidden
        className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pt-16 lg:grid-cols-2 lg:items-center">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-sky backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            A NEW STANDARD IN PAIN MANAGEMENT
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            NEXODYN<sup className="text-2xl text-gold">™</sup>
            <span className="mt-2 block text-2xl font-medium text-sky/90 sm:text-3xl">
              Balanced Opioid Analgesic
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-sky/80">
            A proprietary next-generation therapeutic engineered to deliver{" "}
            <span className="font-semibold text-white">potent, long-acting analgesia</span> and
            controlled affective modulation — without respiratory depression, addictive liability,
            or systemic toxicity.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <TrackedDownloadButton
              href="https://sendgb.com/S2J1ubGghv5"
              downloadType="all"
              source="hero"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-navy-deep shadow-elegant transition hover:bg-sky"
              label="REVIEW ALL IFU's"
            />
            <a
              href="#mechanism"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Explore Mechanism <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4"
          >
            {[
              ["24h", "Duration"],
              ["0%", "Respiratory Risk"],
              ["μ", "Selective Agonism"],
              ["3", "Delivery Forms"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-bold text-gold">{v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-sky/70">{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-blue blur-3xl opacity-50" />
          <motion.img
            src={hero}
            alt="NEXODYN pharmaceutical product packaging and vial"
            className="w-full rounded-3xl border border-white/10 shadow-elegant"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

const pillars = [
  { icon: Shield, title: "Non-Addictive", desc: "Low abuse potential across preclinical models." },
  { icon: Brain, title: "Neuroprotective", desc: "Supports long-term brain and cognitive health." },
  { icon: Clock, title: "Long Duration", desc: "Up to 24 hours of sustained analgesic relief." },
  { icon: HeartPulse, title: "Enhanced Well-Being", desc: "Improves mood, empathy and social connection." },
];

function Pillars() {
  return (
    <Section className="mx-auto max-w-7xl px-6 py-24" id="profile">
      <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-medical-blue">
          Pharmacological Profile
        </p>
        <h2 className="mt-4 text-4xl font-bold text-navy-deep sm:text-5xl">
          Engineered for efficacy.
          <br />
          <span className="text-gradient-blue">Designed for safety.</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          NEXODYN™ delivers the analgesic strength of traditional opioids while eliminating the
          risks that have defined first-generation agents.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-card transition"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-blue opacity-0 transition group-hover:opacity-100" />
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-blue text-primary-foreground shadow-glow">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-navy-deep">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Mechanism() {
  return (
    <Section id="mechanism" className="relative overflow-hidden bg-navy-deep py-28 text-white">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-medical-blue/20 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Mechanism of Action
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            A multi-target approach to selective receptor engagement.
          </h2>
          <p className="mt-6 text-lg text-sky/80">
            Unlike morphine, heroin, or psychostimulants, NEXODYN™ selectively engages opioid
            receptors while preserving the integrity of ancillary neural pathways — powered by
            naturally derived adjuncts that modulate distinct neurotransmitter systems.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Selective μ-opioid receptor agonism",
              "Modulation across ancillary receptor classes",
              "Preservation of autonomic and thermoregulatory function",
              "Naturally derived neuroprotective adjuncts",
            ].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-sky/90">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur">
            {/* Ambient glow */}
            <motion.div
              animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.05, 0.9] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-10 rounded-full bg-medical-blue/25 blur-3xl"
            />
            <motion.div
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="pointer-events-none absolute inset-24 rounded-full bg-gold/20 blur-2xl"
            />

            {/* Radar sweep */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-8 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--medical-blue) 45%, transparent) 40deg, transparent 90deg)",
                maskImage: "radial-gradient(circle, transparent 40%, black 41%, black 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 40%, black 41%, black 100%)",
              }}
            />

            {/* Expanding pulse rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`pulse-${i}`}
                initial={{ scale: 0.4, opacity: 0.7 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40"
              />
            ))}

            {/* Rotating dashed orbits with traveling nodes */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-dashed border-white/25"
            >
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(255,200,80,0.9)]" />
              <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-medical-blue shadow-[0_0_10px_rgba(80,150,255,0.9)]" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-16 rounded-full border border-dashed border-gold/40"
            >
              <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(255,200,80,0.9)]" />
              <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="absolute inset-24 rounded-full border border-white/10"
            />

            {/* SVG connectors from icons to core */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,200,80,0)" />
                  <stop offset="50%" stopColor="rgba(255,200,80,0.7)" />
                  <stop offset="100%" stopColor="rgba(80,150,255,0.9)" />
                </linearGradient>
              </defs>
              {[0, 90, 180, 270].map((angle, i) => (
                <motion.line
                  key={angle}
                  x1="50"
                  y1="50"
                  x2={50 + 42 * Math.cos(((angle - 90) * Math.PI) / 180)}
                  y2={50 + 42 * Math.sin(((angle - 90) * Math.PI) / 180)}
                  stroke="url(#beam)"
                  strokeWidth="0.4"
                  strokeDasharray="1.5 1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.9, 0.2] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>

            {/* Core molecule */}
            <div className="absolute inset-0 grid place-items-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative grid h-40 w-40 place-items-center rounded-full bg-gradient-blue shadow-glow"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-white/20"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.35) 85%, transparent 100%)",
                  }}
                />
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-white/40"
                />
                <Atom className="relative h-16 w-16 text-white" strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Orbiting receptor icons */}
            {[
              { icon: Brain, angle: 0, delay: 0 },
              { icon: HeartPulse, angle: 90, delay: 0.4 },
              { icon: Shield, angle: 180, delay: 0.8 },
              { icon: Activity, angle: 270, delay: 1.2 },
            ].map(({ icon: Icon, angle, delay }, i) => (
              <div
                key={i}
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-190px) rotate(-${angle}deg)`,
                }}
                className="absolute animate-fade-in"
              >
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                    boxShadow: [
                      "0 0 0px rgba(255,200,80,0)",
                      "0 0 28px rgba(255,200,80,0.65)",
                      "0 0 0px rgba(255,200,80,0)",
                    ],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut",
                  }}
                  className="relative grid h-14 w-14 place-items-center rounded-2xl border border-gold/40 bg-navy-deep/90 backdrop-blur"
                >
                  <Icon className="h-6 w-6 text-gold" />
                  <motion.span
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay }}
                    className="absolute inset-0 rounded-2xl border border-gold/60"
                  />
                </motion.div>
              </div>
            ))}

            {/* Floating particles */}
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              const r = 30 + (i % 3) * 6;
              const x = 50 + r * Math.cos(a);
              const y = 50 + r * Math.sin(a);
              return (
                <motion.span
                  key={`p-${i}`}
                  className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/80"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
                  transition={{
                    duration: 3 + (i % 4),
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

const effects = [
  {
    icon: Zap,
    title: "Analgesia",
    desc: "Potent pain relief through selective μ-opioid receptor agonism.",
  },
  {
    icon: Activity,
    title: "Psychostimulation",
    desc: "Enhanced energy and alertness without sympathomimetic toxicity.",
  },
  {
    icon: HeartPulse,
    title: "Affective Modulation",
    desc: "Euphorigenic, prosocial and empathogenic properties at controlled levels.",
  },
  {
    icon: Shield,
    title: "Safety Profile",
    desc: "Absence of respiratory depression — the primary cause of opioid mortality.",
  },
];

function Effects() {
  return (
    <Section id="effects" className="mx-auto max-w-7xl px-6 py-28">
      <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-medical-blue">
          Therapeutic Effects
        </p>
        <h2 className="mt-4 text-4xl font-bold text-navy-deep sm:text-5xl">
          Four dimensions of clinical benefit.
        </h2>
      </motion.div>

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        {effects.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            className="group relative flex gap-6 overflow-hidden rounded-2xl border border-border bg-gradient-surface p-8 shadow-card"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-medical-blue/5 transition group-hover:bg-medical-blue/10" />
            <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-blue text-white shadow-glow">
              <Icon className="h-7 w-7" />
            </div>
            <div className="relative min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-medical-blue">
                0{i + 1}
              </div>
              <h3 className="mt-1 text-2xl font-bold text-navy-deep">{title}</h3>
              <p className="mt-2 text-muted-foreground">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Pharmacokinetics() {
  const items = [
    {
      icon: Clock,
      title: "Extended Half-Life",
      desc: "Reduced dosing frequency for improved patient adherence.",
    },
    {
      icon: Target,
      title: "Selective Targeting",
      desc: "Minimized off-target effects and adverse events.",
    },
    {
      icon: Activity,
      title: "Autonomic Stability",
      desc: "Minimal impact on thermoregulation and cardiovascular tone.",
    },
  ];
  return (
    <Section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-gradient-surface" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-medical-blue">
            Pharmacokinetic Advantages
          </p>
          <h2 className="mt-4 text-4xl font-bold text-navy-deep sm:text-5xl">
            Optimized for adherence, precision and predictability.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="relative rounded-3xl border border-border bg-card p-8 shadow-card"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-deep text-gold">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-navy-deep">{title}</h3>
              <p className="mt-3 text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

const deliveryOptions = [
  {
    key: "injection",
    icon: Syringe,
    title: "INJECTION",
    tagline: "Fast-Acting · Precise · Reliable",
    image: injection,
    ifuUrl: "https://sendgb.com/r0wUfG1NoCk",
    features: [
      "Rapid onset within minutes",
      "Ideal for severe acute pain",
      "Long duration up to 24 hours",
    ],
    forms: ["Single-Dose Vial", "Pre-Filled Syringe", "Auto-Injector"],
    accent: "from-navy-deep to-medical-blue",
  },
  {
    key: "inhalation",
    icon: Wind,
    title: "INHALATION",
    tagline: "Fast Relief · Convenient · Controlled",
    image: inhalation,
    ifuUrl: "https://sendgb.com/2UpMvyFrX9z",
    features: ["Rapid absorption through lungs", "Discreet and portable", "Long-lasting relief"],
    forms: ["Inhaler Device", "Pre-Filled Cartridges", "Multi-Dose Pack"],
    accent: "from-medical-blue to-navy",
  },
  {
    key: "transdermal",
    icon: Shield,
    title: "TRANSDERMAL",
    tagline: "Steady Relief · Non-Invasive · Continuous",
    image: transdermal,
    ifuUrl: "https://sendgb.com/AfDTgjLo4YB",
    features: [
      "Steady drug release through the skin",
      "Up to 24-hour continuous relief",
      "Non-invasive and easy to use",
    ],
    forms: ["Transdermal Patches", "Multiple Strengths", "Extended Release"],
    accent: "from-navy to-navy-deep",
  },
];

function Delivery() {
  return (
    <Section
      id="delivery"
      className="relative overflow-hidden bg-navy-deep py-28 text-white"
    >
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Delivery Options
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            One advanced medicine.
            <br />
            <span className="text-gradient-gold">Three delivery formats.</span>
          </h2>
          <p className="mt-6 text-lg text-sky/80">
            Tailored to patient needs — download the detailed Instructions for Use (IFU) for each
            administration method below.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {deliveryOptions.map(({ key, icon: Icon, title, tagline, image, ifuUrl, features, forms, accent }) => (
            <motion.article
              key={key}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition"
            >
              <div className={`bg-gradient-to-br ${accent} p-6`}>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold tracking-wide text-white">
                      {title}
                    </div>
                    <div className="text-xs text-white/80">{tagline}</div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                <motion.img
                  src={image}
                  alt={`NEXODYN ${title.toLowerCase()}`}
                  className="h-full w-full "
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="flex flex-1 flex-col gap-6 p-6">
                <ul className="space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-sky/90">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-sky/60">
                    Available as
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {forms.map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-sky/90"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <TrackedDownloadLink
                  href={ifuUrl}
                  downloadType={key as "injection" | "inhalation" | "transdermal"}
                  source="delivery"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy-deep transition hover:bg-gold"
                >
                  <Download className="h-4 w-4" /> Download IFU
                </TrackedDownloadLink>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.img
          variants={fadeUp}
          src={delivery}
          alt="NEXODYN delivery formats overview"
          className="mt-16 w-full rounded-3xl border border-white/10 shadow-elegant"
        />
      </div>
    </Section>
  );
}

function CTA() {
  return (
    <Section className="mx-auto max-w-7xl px-6 py-28">
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl bg-gradient-blue p-12 text-center shadow-elegant sm:p-20"
      >
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <Sparkles className="mx-auto h-8 w-8 text-gold" />
          <h2 className="mt-6 font-display text-4xl font-bold text-white sm:text-5xl">
            NEXODYN™ — Advanced Relief.
            <br />
            Enhanced Life.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-sky/90">
            Access the complete pharmacology dossier and Instructions for Use for each NEXODYN™
            administration route.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <TrackedDownloadButton
              href="https://sendgb.com/S2J1ubGghv5"
              downloadType="all"
              source="cta"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-navy-deep shadow-elegant transition hover:bg-sky"
              label="Download All IFUs"
            />
            <a
              href="#mechanism"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Clinical Documentation <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-navy-deep py-12 text-sky/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img
              src="/favicon.ico"
              alt="NEXODYN"
              className="h-12 w-12 rounded-lg object-contain"
            />
            <span className="font-display text-lg font-bold text-white">
              NEXODYN<sup className="text-xs">™</sup>
            </span>
          </div>
          <p className="max-w-xs text-sm">
            Balanced Opioid Analgesic. A next-generation therapeutic for pain and affective
            modulation.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-white">Research Use Only</div>
          <p className="mt-2">
            Not for human use outside authorized clinical investigations. All materials are
            intended for licensed healthcare and research professionals.
          </p>
        </div>
        <div className="text-sm md:text-right">
          <div className="font-semibold text-white">Contact</div>
          <p className="mt-2">medical.nexodyn5@caramail.com</p>
          <p className="mt-2">Telegram: @nexodyn5</p>
          <p className="mt-6 text-xs text-sky/50">© 2026 NEXODYN Therapeutics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <PageVisitTracker />
      <Nav />
      <main>
        <Hero />
        <Pillars />
        <Mechanism />
        <Effects />
        <Pharmacokinetics />
        <Delivery />
        <AccessForm />
        <CTA />
      </main>
      <Footer />
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}
