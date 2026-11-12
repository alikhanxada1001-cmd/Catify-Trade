import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTrade } from '../context/TradeContext';
import {
  Code2,
  Phone,
  Mail,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Globe,
  Layers,
  ShieldCheck,
  Zap,
  Smartphone,
  Layout,
  MessageCircle,
  Send,
} from 'lucide-react';

const WHATSAPP_LOCAL = '03261604808';
const WHATSAPP_INTL = '923261604808';
const STUDIO_EMAIL = 'akdevstudiosolutions@gmail.com';
const FACEBOOK_URL = 'https://www.facebook.com/share/p/19mp5NR2tZ/';
const STUDIO_LOGO = '/assets/aistudio/AK_Dev_Studio__Build__Design__Deploy_3191f75b.png';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  icon: React.FC<{ className?: string }>;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    subtitle: 'B2B · B2C · Multi-Currency',
    description:
      'High-conversion online stores, wholesale portals, multi-currency checkout systems, and complete admin dashboards engineered for scale.',
    deliverables: ['Custom Cart & Checkout', 'Admin CRUD Dashboard', 'Invoice & Order Tracking'],
    icon: Globe,
  },
  {
    id: 'business',
    title: 'Web Development (React / Next.js)',
    subtitle: 'Build · Design · Deploy',
    description:
      'Distinctive, ultra-fast company websites and modern frontends built with React, Next.js, and TypeScript to turn your ideas into reality.',
    deliverables: ['Responsive Mobile Layout', 'Technical On-Page SEO', 'Smooth Motion UI'],
    icon: Layout,
  },
  {
    id: 'webapp',
    title: 'PHP, MySQL & Custom Web Apps',
    subtitle: 'Full-Stack · Databases · Portals',
    description:
      'Tailored business workflows, customer portals, inventory trackers, and reliable PHP & MySQL or Node.js platforms built cleanly.',
    deliverables: ['Role-Based Access', 'Database & Backend APIs', 'Real-Time Analytics'],
    icon: Layers,
  },
  {
    id: 'ai',
    title: 'AI Chatbots & API Integrations',
    subtitle: 'Automation · Smart APIs · Speed',
    description:
      'Custom AI chatbots, automated WhatsApp & CRM integrations, payment gateways, and modern API workflows tailored to your business.',
    deliverables: ['AI Support Chatbots', 'Payment & API Sync', 'Performance & Security'],
    icon: Zap,
  },
];

const PROJECT_TYPES = [
  'E-Commerce Store / Marketplace',
  'Import & Export Trade Portal',
  'Business / Company Website',
  'Custom Web App / Dashboard',
];

const TIMELINES = ['Express (1-2 Weeks)', 'Standard (3-4 Weeks)', 'Flexible / Enterprise'];

export const AkDevStudioPage: React.FC = () => {
  const { navigateTo } = useTrade();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('ecommerce');
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0]);
  const [timeline, setTimeline] = useState<string>(TIMELINES[1]);
  const [clientName, setClientName] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');
  const [copiedField, setCopiedField] = useState<'phone' | 'email' | null>(null);

  const handleCopy = (value: string, field: 'phone' | 'email') => {
    try {
      navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2200);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  const composedMessage = `Assalam-o-Alaikum AK Dev Studio, I want to get a website developed.${
    clientName.trim() ? ` Name: ${clientName.trim()}.` : ''
  } Project Type: ${projectType}. Timeline: ${timeline}.${
    projectNotes.trim() ? ` Details: ${projectNotes.trim()}` : ''
  }`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(composedMessage)}`;
  const mailtoUrl = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
    `Website Project Inquiry - ${projectType}`
  )}&body=${encodeURIComponent(composedMessage)}`;

  const activeService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 overflow-hidden">
      {/* Top Return Navigation Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catify Trade Storefront</span>
          </button>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-slate-300 font-semibold">
              <img
                src={STUDIO_LOGO}
                alt="AK Dev Studio"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-400/60"
              />
              <span>AK Dev Studio</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {WHATSAPP_LOCAL}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Animated Hero Banner */}
      <section className="relative border-b border-slate-800/80">
        {/* Subtle Architectural Radial Backdrop matched to AK Dev Studio cyan-blue emblem */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.22),transparent_60%)]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex items-center gap-3">
                <img
                  src={STUDIO_LOGO}
                  alt="AK Dev Studio Emblem"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-400/70 shadow-lg shadow-sky-500/20"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-widest">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>AK Dev Studio</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                    Build · Design · Deploy — Your Ideas Into Reality
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]">
                Let&apos;s Build Something Great Together with{' '}
                <span className="bg-gradient-to-r from-white via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  AK Dev Studio
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                From international e-commerce marketplaces like Catify Trade to React / Next.js platforms, PHP &amp; MySQL systems, and AI Chatbots &amp; APIs — we turn your ideas into fast, production-ready websites.
              </p>

              {/* Direct Primary Contact Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/15 transition-colors inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact on WhatsApp ({WHATSAPP_LOCAL})</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Facebook Page</span>
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={mailtoUrl}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>Email Studio</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Right Interactive Contact Card with Official Studio Logo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-sky-500/25 shadow-2xl space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="shrink-0"
                  >
                    <img
                      src={STUDIO_LOGO}
                      alt="AK Dev Studio Official Logo"
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-sky-400 shadow-lg shadow-sky-500/25"
                    />
                  </motion.div>
                  <div>
                    <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                      Official Contact Card
                    </div>
                    <h2 className="text-xl font-extrabold text-white mt-0.5">AK Dev Studio</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Build · Design · Deploy</p>
                  </div>
                </div>

                {/* Clickable WhatsApp Number Row */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-colors space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct (Click number to chat)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(WHATSAPP_LOCAL, 'phone')}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedField === 'phone' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group"
                  >
                    <span className="text-lg sm:text-xl font-mono font-extrabold text-white group-hover:text-emerald-400 transition-colors tabular-nums">
                      {WHATSAPP_LOCAL}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <span>Open WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </a>
                </div>

                {/* Clickable Email Row */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/50 transition-colors space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-amber-400">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Official Studio Email</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(STUDIO_EMAIL, 'email')}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedField === 'email' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href={mailtoUrl}
                    className="flex items-center justify-between group gap-2"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                      {STUDIO_EMAIL}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                {/* Clickable Facebook Page Row */}
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/60 transition-colors group"
                >
                  <div className="flex items-center justify-between text-[11px] text-blue-400 font-medium mb-1">
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Official Facebook Page</span>
                    </span>
                    <span className="text-slate-400 group-hover:text-blue-400 transition-colors">
                      Follow &amp; Message
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 group-hover:text-white truncate font-mono">
                    {FACEBOOK_URL}
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Services Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Development Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Websites &amp; Platforms We Build
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Select a capability below to inspect deliverables or customize your project inquiry directly for WhatsApp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            const isSelected = selectedServiceId === service.id;
            return (
              <motion.button
                type="button"
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                whileHover={{ y: -3 }}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  if (service.id === 'ecommerce') setProjectType('E-Commerce Store / Marketplace');
                  if (service.id === 'business') setProjectType('Business / Company Website');
                  if (service.id === 'webapp' || service.id === 'ai') setProjectType('Custom Web App / Dashboard');
                }}
                className={`text-left p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400/70 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-400">{service.subtitle}</div>
                    <h3 className="text-sm font-bold text-white mt-0.5">{service.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{service.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] font-semibold text-amber-400 flex items-center justify-between">
                  <span>{isSelected ? 'Selected Focus' : 'View Deliverables'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Animated Service Detail Strip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="text-xs font-semibold text-amber-400">Included in {activeService.title}</div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
                {activeService.deliverables.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Discuss This Package</span>
            </a>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Dynamic Project Inquiry & Instant WhatsApp Builder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 p-6 sm:p-10 space-y-8"
        >
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Instant Project Consultation
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Start Your Website Project via WhatsApp or Email
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Configure your website requirements below and send a structured brief directly to AK Dev Studio on WhatsApp (
              <a
                href={`https://wa.me/${WHATSAPP_INTL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-mono font-bold underline hover:text-emerald-300"
              >
                {WHATSAPP_LOCAL}
              </a>
              ).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Controls */}
            <div className="lg:col-span-7 space-y-5 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-2">1. Website Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setProjectType(type)}
                      className={`px-3.5 py-2.5 rounded-xl border text-left font-medium transition-all ${
                        projectType === type
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-2">2. Target Delivery Timeline</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TIMELINES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTimeline(t)}
                      className={`px-3 py-2 rounded-xl border text-center font-medium transition-all ${
                        timeline === t
                          ? 'bg-blue-600 text-white border-blue-500 font-bold'
                          : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1.5">Your Name / Brand</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Ali Khan / Global Imports"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1.5">Brief Requirements (Optional)</label>
                  <input
                    type="text"
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="e.g. Multi-currency store with admin panel"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Live Dynamic Message Preview & Send Actions */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Live Message Preview</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">{WHATSAPP_LOCAL}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed min-h-24">
                {composedMessage}
              </div>

              <div className="space-y-2.5 pt-1">
                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send on WhatsApp ({WHATSAPP_LOCAL})</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={mailtoUrl}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Email</span>
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-blue-900/60 hover:bg-blue-800 text-blue-100 border border-blue-700/50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Facebook Page</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
