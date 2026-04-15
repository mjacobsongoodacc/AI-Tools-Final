import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircledIcon,
  MagnifyingGlassIcon,
  StackIcon,
  FileTextIcon,
  ArrowUpIcon,
  ExclamationTriangleIcon,
  ReaderIcon,
  ArrowRightIcon,
  LightningBoltIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';
import LissajousWeb from '../components/landing/LissajousWeb';
import HeroTerminalDashboard from '../components/landing/HeroTerminalDashboard';
import AnimatedStat from '../components/landing/AnimatedStat';
import TiltCard from '../components/landing/TiltCard';

const features = [
  {
    icon: StackIcon,
    title: 'Document Ingestion',
    description: 'Upload PDF, DOCX, and XLSX files. We parse, chunk, and index the content automatically.',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'RAG Retrieval',
    description: 'Retrieval-augmented generation surfaces relevant passages to support each output.',
  },
  {
    icon: FileTextIcon,
    title: 'Executive Summaries',
    description: 'Get a structured draft summary of key findings — a starting point for your own review.',
  },
  {
    icon: ArrowUpIcon,
    title: 'KPI Extraction',
    description: 'Pull key metrics like revenue, burn, and margins from uploaded documents, with source references.',
  },
  {
    icon: ExclamationTriangleIcon,
    title: 'Red Flag Detection',
    description: 'Highlight potential gaps, contradictions, and risk signals across uploaded documents.',
  },
  {
    icon: ReaderIcon,
    title: 'Citation Tracking',
    description: 'Outputs reference the source documents they are drawn from, so you can verify findings yourself.',
  },
];

const problems = [
  'Manually combing through large data rooms',
  'Inconsistent analysis across deal teams',
  'Hard to trace where AI-assisted conclusions came from',
  'Significant time investment before a first draft memo',
];

const solutions = [
  'Structured output generated quickly from your documents',
  'Consistent framework applied across every upload',
  'Outputs reference the source documents they came from',
  'A first draft to react to, not start from scratch',
];

const problemGridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const problemCardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const featureGridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function Landing() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans">
      {/* Nav */}
      <nav className="border-b border-slate-700/50 px-6 py-4 sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckCircledIcon width={16} height={16} className="text-white" />
            </div>
            <span className="text-white font-semibold text-base">DiligenceAI</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <LissajousWeb />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:items-center text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
                <LightningBoltIcon width={13} height={13} className="text-blue-400" />
                <span className="text-blue-400 text-xs font-medium">AI-Powered · Citation-Backed · Auditable</span>
              </div>

              <h1 className="text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] font-black text-white leading-[1.1] tracking-tight mb-6">
                AI-Powered Due Diligence.{' '}
                <span className="animate-shimmer">Fast, Structured,</span> Verifiable.
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Upload your data room. Get a structured first-pass summary with cited KPIs, flagged risks, and source references — without starting from a blank page.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-blue-500/25"
                >
                  Get Started Free
                  <ArrowRightIcon width={17} height={17} />
                </Link>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-6 py-3.5 rounded-xl transition-colors text-base"
                >
                  Request Demo
                </Link>
              </div>

              <p className="text-slate-600 text-xs mt-4">Early access · Built with security in mind</p>
            </div>

            <div className="mt-12 lg:mt-0 w-full flex justify-center lg:justify-end">
              <HeroTerminalDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-700/50 bg-[#1E293B]/50 px-6 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedStat value="PDF" label="DOCX & XLSX supported" />
          <AnimatedStat value="RAG" label="Retrieval-backed outputs" />
          <AnimatedStat value="Cited" label="Source-referenced findings" />
          <AnimatedStat value="Draft" label="Starting point, not final word" />
        </div>
      </section>

      {/* Problem / Solution */}
      {reduce ? (
        <section className="px-6 py-20 sm:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                From messy data rooms to clear outputs
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                Traditional due diligence is slow, inconsistent, and hard to trace. DiligenceAI is built to help with that.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-7">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 bg-red-500/15 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 text-xs font-bold">!</span>
                  </div>
                  <h3 className="text-slate-200 font-semibold">The Old Way</h3>
                </div>
                <ul className="space-y-3.5">
                  {problems.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-xs font-bold">✕</span>
                      </div>
                      <span className="text-slate-400 text-sm leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl" />
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <LightningBoltIcon width={13} height={13} className="text-blue-400" />
                  </div>
                  <h3 className="text-slate-200 font-semibold">With DiligenceAI</h3>
                </div>
                <ul className="space-y-3.5">
                  {solutions.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <CheckCircledIcon width={17} height={17} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-200 text-sm leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <motion.section
          className="px-6 py-20 sm:py-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                From messy data rooms to clear outputs
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                Traditional due diligence is slow, inconsistent, and hard to trace. DiligenceAI is built to help with that.
              </p>
            </div>

            <motion.div
              className="grid md:grid-cols-2 gap-4"
              variants={problemGridVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.div variants={problemCardVariants} className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-7">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 bg-red-500/15 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 text-xs font-bold">!</span>
                  </div>
                  <h3 className="text-slate-200 font-semibold">The Old Way</h3>
                </div>
                <ul className="space-y-3.5">
                  {problems.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-xs font-bold">✕</span>
                      </div>
                      <span className="text-slate-400 text-sm leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={problemCardVariants}
                className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-7 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl" />
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <LightningBoltIcon width={13} height={13} className="text-blue-400" />
                  </div>
                  <h3 className="text-slate-200 font-semibold">With DiligenceAI</h3>
                </div>
                <ul className="space-y-3.5">
                  {solutions.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <CheckCircledIcon width={17} height={17} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-200 text-sm leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Features */}
      {reduce ? (
        <section className="px-6 py-20 sm:py-24 bg-[#1E293B]/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Every layer of analysis, covered
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                Six modules work together to structure what's in your documents.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, description }) => (
                <TiltCard key={title}>
                  <div className="bg-[#0F172A] border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group h-full">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/15 transition-colors">
                      <Icon width={19} height={19} className="text-blue-400" />
                    </div>
                    <h3 className="text-slate-100 font-semibold text-base mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <motion.section
          className="px-6 py-20 sm:py-24 bg-[#1E293B]/30"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Every layer of analysis, covered
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                Six modules work together to structure what's in your documents.
              </p>
            </div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={featureGridVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              {features.map(({ icon: Icon, title, description }) => (
                <motion.div key={title} variants={featureCardVariants}>
                  <TiltCard>
                    <div className="bg-[#0F172A] border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group h-full">
                      <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/15 transition-colors">
                        <Icon width={19} height={19} className="text-blue-400" />
                      </div>
                      <h3 className="text-slate-100 font-semibold text-base mb-2">{title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Trust section */}
      {reduce ? (
        <section className="px-6 py-20 sm:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-8 sm:p-12 text-center">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <LockClosedIcon width={22} height={22} className="text-blue-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                Built for institutional trust
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Your documents are not used to train any models. Built with venture, PE, and corporate development workflows in mind.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
                {['No model training on your data', 'Document isolation per account', 'Built for sensitive deal data'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircledIcon width={14} height={14} className="text-green-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <motion.section
          className="px-6 py-20 sm:py-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-8 sm:p-12 text-center"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <LockClosedIcon width={22} height={22} className="text-blue-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                Built for institutional trust
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Your documents are not used to train any models. Built with venture, PE, and corporate development workflows in mind.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
                {['No model training on your data', 'Document isolation per account', 'Built for sensitive deal data'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircledIcon width={14} height={14} className="text-green-400" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* CTA */}
      {reduce ? (
        <section className="relative overflow-hidden px-6 py-20 sm:py-24 border-t border-slate-700/50">
          <LissajousWeb />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent z-[1]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to accelerate your diligence?
            </h2>
            <p className="text-slate-400 text-base mb-8">
              Built for investment teams who want a faster, more consistent first pass on every deal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-blue-500/25"
              >
                Get Started Free
                <ArrowRightIcon width={17} height={17} />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto text-slate-400 hover:text-slate-200 font-medium px-4 py-3.5 text-base transition-colors"
              >
                Already have an account? Sign in →
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <motion.section
          className="relative overflow-hidden px-6 py-20 sm:py-24 border-t border-slate-700/50"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <LissajousWeb />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent z-[1]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to accelerate your diligence?
            </h2>
            <p className="text-slate-400 text-base mb-8">
              Built for investment teams who want a faster, more consistent first pass on every deal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-blue-500/25"
              >
                Get Started Free
                <ArrowRightIcon width={17} height={17} />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto text-slate-400 hover:text-slate-200 font-medium px-4 py-3.5 text-base transition-colors"
              >
                Already have an account? Sign in →
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700/50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <CheckCircledIcon width={12} height={12} className="text-white" />
            </div>
            <span className="text-slate-400 text-sm">DiligenceAI</span>
          </div>
          <p className="text-slate-600 text-xs">
            © 2026 DiligenceAI. All rights reserved. For authorized use only.
          </p>
        </div>
      </footer>
    </div>
  );
}
