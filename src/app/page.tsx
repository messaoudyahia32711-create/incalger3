'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, TrendingUp, Award, ChevronLeft, ChevronRight,
  Menu, X, Globe, LogIn, LogOut, Plus, Eye, Check, AlertCircle,
  Lightbulb, ClipboardCheck, GraduationCap, Rocket, Banknote,
  Shield, Mail, Phone, MapPin, ExternalLink, Star, ArrowRight,
  BarChart3, PieChart, Activity, FileText, Settings, ImageIcon,
  Video, Edit, Trash2, Search, Filter, HomeIcon, LayoutDashboard,
  UserPlus, ChevronDown, Sparkles, Target, Zap, Heart,
  Facebook, Instagram, Youtube, Send, RefreshCw
} from 'lucide-react';
import { useAppStore, type AppView } from '@/lib/store';
import { t, type Locale, localeNames, localeDirection } from '@/lib/i18n';
import { MOCK_PROJECTS, MOCK_STATS, MOCK_PARTNERS, MOCK_EVENTS, ADMIN_CREDENTIALS } from '@/lib/mockData';
import { toast } from 'sonner';

// ==================== HELPER COMPONENTS ====================

function StatusBadge({ status, locale }: { status: string; locale: Locale }) {
  const colors: Record<string, string> = {
    review: 'bg-amber-100 text-amber-800 border-amber-300',
    committee: 'bg-blue-100 text-blue-800 border-blue-300',
    accepted: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
    revision: 'bg-orange-100 text-orange-800 border-orange-300',
    incubated: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {t(locale, `status.${status}`)}
    </span>
  );
}

function FieldBadge({ field, locale }: { field: string; locale: Locale }) {
  const icons: Record<string, string> = {
    ict: '💻', digital: '🌐', minerals: '⛏️', energy: '☀️',
    industry: '🏭', ecommerce: '🛒', other: '📦',
  };
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <span>{icons[field] || '📦'}</span>
      {t(locale, `fields.${field}`)}
    </span>
  );
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  useEffect(() => {
    if (hasAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startAnimation();
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    // Fallback: start animation after 1.5s if not triggered by observer
    const timer = setTimeout(startAnimation, 1500);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// ==================== MARQUEE BAR ====================

function MarqueeBar({ locale }: { locale: Locale }) {
  const text = t(locale, 'hero.marquee');
  return (
    <div className="w-full overflow-hidden py-2" style={{ background: 'linear-gradient(90deg, #C8A951 0%, #E4C97A 50%, #C8A951 100%)' }}>
      <div className="flex whitespace-nowrap animate-marquee">
        {[1, 2, 3].map((i) => (
          <span key={i} className="mx-8 text-sm font-bold text-[#0D1B2A]" style={{ fontFamily: 'var(--font-amiri), Amiri, serif' }}>
            ✦ {text} ✦
          </span>
        ))}
      </div>
    </div>
  );
}

// ==================== HEADER ====================

function Header({ locale, currentView, onNavigate, user, onLogout }: {
  locale: Locale; currentView: AppView; onNavigate: (v: AppView) => void;
  user: any; onLogout: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { setLocale } = useAppStore();
  const dir = localeDirection[locale];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { key: 'landing', label: t(locale, 'nav.home'), icon: HomeIcon },
    { key: 'projects', label: t(locale, 'nav.projects'), icon: Eye },
    { key: 'submit', label: t(locale, 'nav.submit'), icon: Plus },
    { key: 'about', label: t(locale, 'nav.about'), icon: Building2 },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg bg-[#0D1B2A]/98' : 'bg-[#0D1B2A]'}`} style={{ direction: dir }}>
      <MarqueeBar locale={locale} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8A951] to-[#E4C97A] flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-[#0D1B2A]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>INC ALG 3</h1>
              <p className="text-[#E4C97A] text-[10px] leading-tight">{t(locale, 'brandSubtitle').substring(0, 30)}...</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.key as AppView)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentView === link.key
                    ? 'text-[#C8A951] bg-[#C8A951]/10'
                    : 'text-white/80 hover:text-[#E4C97A] hover:bg-white/5'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm border border-white/10"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{localeNames[locale]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 end-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 min-w-[150px]">
                  {(Object.keys(localeNames) as Locale[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => { setLocale(loc); setLangOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-start hover:bg-slate-50 transition-colors flex items-center gap-2 ${locale === loc ? 'bg-[#1B3A6B]/5 text-[#1B3A6B] font-bold' : 'text-slate-700'}`}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#C8A951]/10 text-[#C8A951] hover:bg-[#C8A951]/20 transition-all text-sm border border-[#C8A951]/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.role === 'admin' ? t(locale, 'nav.admin') : t(locale, 'nav.dashboard')}</span>
                </button>
                <button onClick={onLogout} className="p-2 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A951] text-[#0D1B2A] font-bold text-sm hover:bg-[#E4C97A] transition-all shadow-lg shadow-[#C8A951]/20"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">{t(locale, 'nav.login')}</span>
              </button>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-all">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0D1B2A] border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleNavClick(link.key as AppView)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    currentView === link.key ? 'bg-[#C8A951]/10 text-[#C8A951]' : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ==================== LANDING PAGE ====================

function LandingPage({ locale, onNavigate }: { locale: Locale; onNavigate: (v: AppView) => void }) {
  const dir = localeDirection[locale];
  return (
    <div style={{ direction: dir }}>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)' }}>
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%"><defs><pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C8A951"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg>
        </div>
        {/* Gradient orbs */}
        <div className="absolute top-20 start-20 w-72 h-72 bg-[#C8A951]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 end-20 w-96 h-96 bg-[#2952A3]/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A951]/10 border border-[#C8A951]/20 text-[#E4C97A] text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              {t(locale, 'brandFull')}
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
              INC <span className="text-[#C8A951]">ALG 3</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
              className="text-xl sm:text-2xl text-[#E4C97A] font-bold mb-6" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
              {t(locale, 'hero.subtitle')}
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t(locale, 'hero.description')}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
              className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate('submit-project')}
                className="group px-8 py-4 rounded-2xl bg-[#C8A951] text-[#0D1B2A] font-bold text-lg hover:bg-[#E4C97A] transition-all duration-300 shadow-xl shadow-[#C8A951]/25 flex items-center gap-3 animate-pulse-gold"
              >
                <Rocket className="w-5 h-5" />
                {t(locale, 'hero.cta1')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl-flip transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('projects')}
                className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 hover:border-white/40 transition-all duration-300 flex items-center gap-3"
              >
                <Eye className="w-5 h-5" />
                {t(locale, 'hero.cta2')}
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 100" fill="none"><path d="M0,60 C360,100 720,20 1440,60 L1440,100 L0,100 Z" fill="#F5F7FA"/></svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: MOCK_STATS.projectsRegistered, label: t(locale, 'stats.projectsRegistered'), icon: FileText, color: '#1B3A6B' },
              { value: MOCK_STATS.accepted, label: t(locale, 'stats.accepted'), icon: Check, color: '#27AE60' },
              { value: MOCK_STATS.underEvaluation, label: t(locale, 'stats.evaluating'), icon: ClipboardCheck, color: '#F39C12' },
              { value: MOCK_STATS.startupsCreated, label: t(locale, 'stats.startups'), icon: Rocket, color: '#C8A951' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 text-center group">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif', color: stat.color }}>
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-[#1B3A6B] mb-3" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'howItWorks.title')}</h2>
            <p className="text-slate-600 text-lg">{t(locale, 'howItWorks.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {(['step1', 'step2', 'step3', 'step4', 'step5'] as const).map((step, i) => {
              const icons = [Lightbulb, ClipboardCheck, GraduationCap, Rocket, Banknote];
              const colors = ['#C8A951', '#1B3A6B', '#2E7D32', '#2952A3', '#E67E22'];
              const Icon = icons[i];
              return (
                <motion.div key={step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}
                  className="relative text-center group">
                  {i < 4 && (
                    <div className="hidden md:block absolute top-10 start-[60%] w-[80%] h-0.5 bg-gradient-to-e from-slate-200 to-slate-100 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `linear-gradient(135deg, ${colors[i]}15, ${colors[i]}25)` }}>
                      <Icon className="w-9 h-9" style={{ color: colors[i] }} />
                      <span className="absolute -top-2 -end-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md"
                        style={{ backgroundColor: colors[i] }}>{i + 1}</span>
                    </div>
                    <h3 className="font-bold text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
                      {t(locale, `howItWorks.${step}.title`)}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{t(locale, `howItWorks.${step}.desc`)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-[#1B3A6B] mb-3" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'services.title')}</h2>
            <p className="text-slate-600 text-lg">{t(locale, 'services.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(['s1', 's2', 's3', 's4', 's5', 's6'] as const).map((s, i) => {
              const icons = [GraduationCap, Target, Zap, Award, Banknote, Shield];
              const colors = ['#1B3A6B', '#2E7D32', '#C8A951', '#2952A3', '#E67E22', '#C0392B'];
              const Icon = icons[i];
              return (
                <motion.div key={s} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${colors[i]}12` }}>
                    <Icon className="w-7 h-7" style={{ color: colors[i] }} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
                    {t(locale, `services.${s}.title`)}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{t(locale, `services.${s}.desc`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-black text-[#1B3A6B] mb-3" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'about.title')}</h2>
              <p className="text-[#C8A951] font-bold text-lg mb-6">{t(locale, 'about.subtitle')}</p>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>{t(locale, 'about.p1')}</p>
                <p>{t(locale, 'about.p2')}</p>
                <p>{t(locale, 'about.p3')}</p>
              </div>
              <div className="mt-6 space-y-2">
                {[
                  { icon: Users, text: t(locale, 'about.director') },
                  { icon: Building2, text: t(locale, 'about.established') },
                  { icon: Award, text: t(locale, 'about.official') },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700">
                    <item.icon className="w-5 h-5 text-[#C8A951]" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-[#1B3A6B] to-[#0F2140] rounded-3xl p-8 text-white">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-[#C8A951]/20 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-[#C8A951]" />
                </div>
                <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>INC ALG 3</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '50,000+', label: locale === 'ar' ? 'طالب' : locale === 'fr' ? 'Étudiants' : 'Students' },
                  { value: '4', label: locale === 'ar' ? 'كليات' : locale === 'fr' ? 'Facultés' : 'Faculties' },
                  { value: '11+', label: locale === 'ar' ? 'دفعات' : locale === 'fr' ? 'Promotions' : 'Batches' },
                  { value: '1,800+', label: locale === 'ar' ? 'مشروع' : locale === 'fr' ? 'Projets' : 'Projects' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-[#E4C97A]" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{item.value}</div>
                    <div className="text-sm text-white/70">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-4xl font-black text-[#1B3A6B] mb-8 text-center" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
            {locale === 'ar' ? 'أحداث وفعاليات' : locale === 'fr' ? 'Événements' : 'Events'}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_EVENTS.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#1B3A6B] text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-black" style={{ fontFamily: 'var(--font-cairo)' }}>
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-[10px]">
                      {new Date(event.date).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-DZ' : 'en', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1B3A6B] mb-1" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
                      {locale === 'ar' ? event.titleAr : locale === 'fr' ? event.titleFr : event.titleEn}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">{event.location}</p>
                    <p className="text-sm text-slate-600">{event.descAr}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#1B3A6B] mb-3" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'partners.title')}</h2>
            <p className="text-slate-600 text-lg">{t(locale, 'partners.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOCK_PARTNERS.map((partner, i) => (
              <motion.div key={partner.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                className="bg-[#F5F7FA] rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                <div className="text-3xl mb-2">{partner.logo}</div>
                <p className="text-sm font-bold text-slate-700" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
                  {locale === 'ar' ? partner.nameAr : locale === 'fr' ? partner.nameFr : partner.nameEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'cta.title')}</h2>
            <p className="text-lg text-white/70 mb-8">{t(locale, 'cta.subtitle')}</p>
            <button
              onClick={() => onNavigate('submit-project')}
              className="px-10 py-5 rounded-2xl bg-[#C8A951] text-[#0D1B2A] font-black text-xl hover:bg-[#E4C97A] transition-all duration-300 shadow-2xl shadow-[#C8A951]/30 flex items-center gap-3 mx-auto"
            >
              <Rocket className="w-6 h-6" />
              {t(locale, 'cta.button')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#C8A951] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#0D1B2A]" />
                </div>
                <span className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>INC ALG 3</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{t(locale, 'about.p2').substring(0, 120)}...</p>
            </div>
            <div>
              <h4 className="font-bold text-[#C8A951] mb-4" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'footer.quickLinks')}</h4>
              <div className="space-y-2">
                {[{ key: 'landing', label: t(locale, 'nav.home') }, { key: 'projects', label: t(locale, 'nav.projects') }, { key: 'submit-project', label: t(locale, 'nav.submit') }].map((link) => (
                  <button key={link.key} onClick={() => { onNavigate(link.key as AppView); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="block text-white/60 hover:text-[#E4C97A] transition-colors text-sm">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#C8A951] mb-4" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'footer.contactUs')}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 text-sm"><MapPin className="w-4 h-4 text-[#C8A951]" />{t(locale, 'footer.address')}</div>
                <div className="flex items-center gap-2 text-white/60 text-sm"><Mail className="w-4 h-4 text-[#C8A951]" />{t(locale, 'footer.email')}</div>
                <div className="flex items-center gap-2 text-white/60 text-sm"><Phone className="w-4 h-4 text-[#C8A951]" />{t(locale, 'footer.phone')}</div>
              </div>
              <div className="flex gap-3 mt-4">
                {[Facebook, Instagram, Youtube].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#C8A951]/20 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-white/60 hover:text-[#C8A951]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-white/40 text-sm">
            {t(locale, 'footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== LOGIN / REGISTER ====================

function AuthPage({ locale, onNavigate, onLogin }: { locale: Locale; onNavigate: (v: AppView) => void; onLogin: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [faculty, setFaculty] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const dir = localeDirection[locale];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Check admin credentials
      if (isLogin && email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        onLogin({ id: 'admin-001', email, name: locale === 'ar' ? 'المدير العام' : locale === 'fr' ? 'Administrateur' : 'Admin', role: 'admin' });
        toast.success(locale === 'ar' ? 'تم تسجيل الدخول بنجاح' : locale === 'fr' ? 'Connexion réussie' : 'Login successful');
        onNavigate('admin-dashboard');
      } else if (isLogin) {
        // Student login simulation
        if (email && password) {
          onLogin({ id: 'student-001', email, name: name || email.split('@')[0], role: 'student' });
          toast.success(locale === 'ar' ? 'تم تسجيل الدخول بنجاح' : locale === 'fr' ? 'Connexion réussie' : 'Login successful');
          onNavigate('student-dashboard');
        } else {
          toast.error(locale === 'ar' ? 'يرجى إدخال البريد وكلمة المرور' : 'Please enter email and password');
        }
      } else {
        // Register
        onLogin({ id: 'student-new', email, name: name || email.split('@')[0], role: 'student', phone, faculty, level });
        toast.success(locale === 'ar' ? 'تم إنشاء الحساب بنجاح' : locale === 'fr' ? 'Compte créé avec succès' : 'Account created successfully');
        onNavigate('student-dashboard');
      }
      setLoading(false);
    }, 800);
  };

  const facultyKeys = ['eco', 'info', 'pol', 'sport'] as const;
  const levelKeys = ['l1', 'l2', 'l3', 'm1', 'm2', 'phd'] as const;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)', direction: dir }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-[#1B3A6B] to-[#0F2140] text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-[#C8A951] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[#0D1B2A]" />
            </div>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
              {isLogin ? t(locale, 'auth.loginTitle') : t(locale, 'auth.registerTitle')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.name')}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors text-sm" />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.email')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@univ-alger3.dz"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.password')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors text-sm" />
            </div>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.phone')}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors text-sm" placeholder="05XXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.faculty')}</label>
                  <select value={faculty} onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors text-sm bg-white">
                    <option value="">{t(locale, 'auth.faculty')}</option>
                    {facultyKeys.map((f) => (
                      <option key={f} value={f}>{t(locale, `faculties.${f}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.level')}</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors text-sm bg-white">
                    <option value="">{t(locale, 'auth.level')}</option>
                    {levelKeys.map((l) => (
                      <option key={l} value={l}>{t(locale, `levels.${l}`)}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-[#1B3A6B] text-white font-bold text-lg hover:bg-[#2952A3] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {isLogin ? t(locale, 'auth.loginBtn') : t(locale, 'auth.registerBtn')}
            </button>

            {isLogin && (
              <div className="text-center pt-2">
                <button type="button" onClick={() => { setEmail('admin@univ-alger3.dz'); setPassword('admin123'); }}
                  className="text-xs text-slate-400 hover:text-[#1B3A6B] transition-colors underline decoration-dashed underline-offset-2">
                  {t(locale, 'auth.adminLogin')}
                </button>
              </div>
            )}

            <div className="text-center pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[#1B3A6B] font-bold text-sm hover:underline">
                {isLogin ? t(locale, 'auth.noAccount') : t(locale, 'auth.hasAccount')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ==================== PROJECTS PAGE ====================

function ProjectsPage({ locale, onNavigate }: { locale: Locale; onNavigate: (v: AppView) => void }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const dir = localeDirection[locale];
  const filtered = MOCK_PROJECTS.filter((p) => {
    if (filter !== 'all' && p.field !== filter) return false;
    if (search && !p.projectName.includes(search) && !p.ownerName.includes(search)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8" style={{ direction: dir }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'projectsPage.title')}</h1>
          <p className="text-slate-600">{t(locale, 'projectsPage.subtitle')}</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t(locale, 'projectsPage.search')}
              className="w-full ps-10 pe-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors text-sm bg-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ key: 'all', label: t(locale, 'projectsPage.all') },
              ...(['ict', 'digital', 'energy', 'ecommerce', 'minerals', 'industry'] as const).map((f) => ({ key: f, label: t(locale, `fields.${f}`) }))
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.key ? 'bg-[#1B3A6B] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1B3A6B]'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <button onClick={() => onNavigate('submit-project')}
            className="px-6 py-2.5 rounded-xl bg-[#C8A951] text-[#0D1B2A] font-bold text-sm hover:bg-[#E4C97A] transition-all flex items-center gap-2 shadow-md">
            <Plus className="w-4 h-4" />
            {t(locale, 'projectsPage.submitNew')}
          </button>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1">
              <div className="flex items-start justify-between mb-3">
                <FieldBadge field={project.field} locale={locale} />
                <StatusBadge status={project.status} locale={locale} />
              </div>
              <h3 className="text-lg font-bold text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
                {locale === 'ar' ? project.projectName : project.projectNameEn}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.ownerName}</span>
                <span className="font-mono">{project.refNumber}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t(locale, 'projectsPage.noProjects')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== PROJECT SUBMIT ====================

function ProjectSubmitPage({ locale, onNavigate, user }: { locale: Locale; onNavigate: (v: AppView) => void; user: any }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [form, setForm] = useState({
    ownerName: '', email: user?.email || '', phone: '', projectName: '', field: 'ict',
    description: '', problem: '', targetAudience: '', addedValue: '',
    fundingRequired: 0, stage: 'idea', hasPartner: false, teamSize: 1, videoLink: '',
  });
  const dir = localeDirection[locale];

  const updateForm = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const ref = `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
    setRefNumber(ref);
    setSubmitted(true);
    toast.success(t(locale, 'projectSubmit.success'));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)', direction: dir }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full mx-auto mb-6 bg-green-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>
            {t(locale, 'projectSubmit.success')}
          </h2>
          <div className="bg-[#1B3A6B] rounded-xl p-4 my-6">
            <p className="text-white/70 text-sm mb-1">{t(locale, 'projectSubmit.refNumber')}</p>
            <p className="text-2xl font-black text-[#C8A951]" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{refNumber}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => onNavigate('student-dashboard')}
              className="flex-1 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] transition-all">
              {t(locale, 'projectSubmit.trackProject')}
            </button>
            <button onClick={() => { setSubmitted(false); setStep(1); }}
              className="flex-1 py-3 rounded-xl border-2 border-[#1B3A6B] text-[#1B3A6B] font-bold hover:bg-[#1B3A6B]/5 transition-all">
              {t(locale, 'projectSubmit.submitAnother')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const fieldKeys = ['ict', 'digital', 'minerals', 'energy', 'industry', 'ecommerce', 'other'] as const;
  const stageKeys = ['idea', 'prototype', 'launched'] as const;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8" style={{ direction: dir }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'projectSubmit.title')}</h1>
          <p className="text-slate-600">{t(locale, 'projectSubmit.subtitle')}</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                s <= step ? 'bg-[#1B3A6B] text-white' : 'bg-slate-200 text-slate-400'
              }`}>{s}</div>
              {s < 4 && <div className={`flex-1 h-1 rounded ${s < step ? 'bg-[#1B3A6B]' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
          <span className="text-sm text-slate-500 ms-2">{t(locale, `projectSubmit.step${step}`)}</span>
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100">
          {step === 1 && (
            <div className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.ownerName')} *</label>
                <input type="text" value={form.ownerName} onChange={(e) => updateForm('ownerName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.email')} *</label>
                <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.phone')} *</label>
                <input type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="05XXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.projectName')} *</label>
                <input type="text" value={form.projectName} onChange={(e) => updateForm('projectName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.field')} *</label>
                <div className="grid grid-cols-2 gap-2">
                  {fieldKeys.map((f) => (
                    <button key={f} type="button" onClick={() => updateForm('field', f)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                        form.field === f ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1B3A6B]/50'
                      }`}>
                      {t(locale, `fields.${f}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.description')} *</label>
                <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors resize-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.problem')} *</label>
                <textarea value={form.problem} onChange={(e) => updateForm('problem', e.target.value)} rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors resize-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.targetAudience')} *</label>
                <input type="text" value={form.targetAudience} onChange={(e) => updateForm('targetAudience', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.addedValue')} *</label>
                <input type="text" value={form.addedValue} onChange={(e) => updateForm('addedValue', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.fundingRequired')} (DZD)</label>
                <input type="number" value={form.fundingRequired} onChange={(e) => updateForm('fundingRequired', Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.stage')}</label>
                <div className="flex gap-3">
                  {stageKeys.map((s) => (
                    <button key={s} type="button" onClick={() => updateForm('stage', s)}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                        form.stage === s ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1B3A6B]/50'
                      }`}>
                      {t(locale, `stages.${s}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-slate-700">{t(locale, 'projectSubmit.hasPartner')}</label>
                <button type="button" onClick={() => updateForm('hasPartner', !form.hasPartner)}
                  className={`w-12 h-7 rounded-full transition-colors ${form.hasPartner ? 'bg-[#1B3A6B]' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.hasPartner ? 'translate-x-5 rtl:-translate-x-5' : ''}`} />
                </button>
              </div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.teamSize')}</label>
                <input type="number" min={1} max={10} value={form.teamSize} onChange={(e) => updateForm('teamSize', Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.videoLink')}</label>
                <input type="url" value={form.videoLink} onChange={(e) => updateForm('videoLink', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none transition-colors" /></div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-[#F5F7FA] rounded-xl p-6">
                <h3 className="font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{form.projectName || '---'}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-400">{t(locale, 'projectSubmit.ownerName')}:</span><br/><span className="font-medium">{form.ownerName}</span></div>
                  <div><span className="text-slate-400">{t(locale, 'projectSubmit.email')}:</span><br/><span className="font-medium">{form.email}</span></div>
                  <div><span className="text-slate-400">{t(locale, 'projectSubmit.field')}:</span><br/><span className="font-medium">{t(locale, `fields.${form.field}`)}</span></div>
                  <div><span className="text-slate-400">{t(locale, 'projectSubmit.stage')}:</span><br/><span className="font-medium">{t(locale, `stages.${form.stage}`)}</span></div>
                  <div className="col-span-2"><span className="text-slate-400">{t(locale, 'projectSubmit.description')}:</span><br/><span className="font-medium">{form.description}</span></div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                <ChevronRight className="w-4 h-4 rtl-flip" />{t(locale, 'projectSubmit.prev')}
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)}
                className="flex-1 px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] transition-all flex items-center justify-center gap-2">
                {t(locale, 'projectSubmit.next')}<ChevronLeft className="w-4 h-4 rtl-flip" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit}
                className="flex-1 px-6 py-3 rounded-xl bg-[#C8A951] text-[#0D1B2A] font-bold hover:bg-[#E4C97A] transition-all flex items-center justify-center gap-2 shadow-lg">
                <Send className="w-5 h-5" />{t(locale, 'projectSubmit.submit')}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ==================== STUDENT DASHBOARD ====================

function StudentDashboard({ locale, user, onNavigate }: { locale: Locale; user: any; onNavigate: (v: AppView) => void }) {
  const { studentTab, setStudentTab } = useAppStore();
  const dir = localeDirection[locale];
  const tabs = [
    { key: 'my-projects', label: t(locale, 'dashboard.myProjects'), icon: FileText },
    { key: 'new-project', label: t(locale, 'dashboard.newProject'), icon: Plus },
    { key: 'profile', label: t(locale, 'dashboard.editProfile'), icon: Users },
  ];
  const myProjects = MOCK_PROJECTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F7FA]" style={{ direction: dir }}>
      <div className="bg-gradient-to-r from-[#1B3A6B] to-[#0F2140] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C8A951] flex items-center justify-center text-[#0D1B2A] font-black text-xl" style={{ fontFamily: 'var(--font-cairo)' }}>
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'dashboard.welcome')}، {user?.name}</h1>
              <p className="text-[#E4C97A] text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setStudentTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                studentTab === tab.key ? 'bg-[#1B3A6B] text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1B3A6B]/30'
              }`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {studentTab === 'my-projects' && (
          <div className="space-y-4">
            {myProjects.map((project) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FieldBadge field={project.field} locale={locale} />
                    <StatusBadge status={project.status} locale={locale} />
                  </div>
                  <h3 className="font-bold text-[#1B3A6B] text-lg" style={{ fontFamily: 'var(--font-cairo)' }}>
                    {locale === 'ar' ? project.projectName : project.projectNameEn}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{project.refNumber}</p>
                </div>
                {project.score && (
                  <div className="text-center">
                    <div className="text-3xl font-black" style={{ fontFamily: 'var(--font-cairo)', color: project.score >= 80 ? '#27AE60' : project.score >= 60 ? '#F39C12' : '#C0392B' }}>
                      {project.score}
                    </div>
                    <div className="text-xs text-slate-400">{t(locale, 'admin.score')}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {studentTab === 'new-project' && (
          <div className="text-center py-16">
            <Rocket className="w-16 h-16 mx-auto text-[#C8A951] mb-4" />
            <h3 className="text-xl font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'dashboard.newProject')}</h3>
            <button onClick={() => onNavigate('submit-project')}
              className="px-8 py-4 rounded-2xl bg-[#C8A951] text-[#0D1B2A] font-bold text-lg hover:bg-[#E4C97A] transition-all shadow-lg">
              {t(locale, 'hero.cta1')}
            </button>
          </div>
        )}

        {studentTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 max-w-lg">
            <h3 className="text-lg font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'dashboard.editProfile')}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.name')}</label>
                <input defaultValue={user?.name} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.email')}</label>
                <input defaultValue={user?.email} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div>
              <button className="px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] transition-all">{t(locale, 'common.save')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================

function AdminDashboard({ locale }: { locale: Locale }) {
  const { adminTab, setAdminTab } = useAppStore();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [evalScore, setEvalScore] = useState('');
  const [evalNotes, setEvalNotes] = useState('');
  const dir = localeDirection[locale];

  const tabs = [
    { key: 'statistics', label: t(locale, 'admin.statistics'), icon: BarChart3 },
    { key: 'projects', label: t(locale, 'admin.projects'), icon: FileText },
    { key: 'users', label: t(locale, 'admin.users'), icon: Users },
    { key: 'landing', label: t(locale, 'admin.landing'), icon: ImageIcon },
    { key: 'events', label: t(locale, 'admin.events'), icon: Activity },
  ];

  const handleProjectAction = (projectId: string, action: string) => {
    const actionLabels: Record<string, string> = {
      accept: t(locale, 'admin.accept'), reject: t(locale, 'admin.reject'),
      revision: t(locale, 'admin.revision'), incubate: t(locale, 'admin.incubate'),
    };
    toast.success(`${actionLabels[action] || action} - ${projectId}`);
    setSelectedProject(null);
  };

  // Stats cards data
  const statCards = [
    { label: t(locale, 'admin.totalUsers'), value: 847, icon: Users, color: '#1B3A6B', change: '+12%' },
    { label: t(locale, 'admin.totalProjects'), value: 1800, icon: FileText, color: '#C8A951', change: '+23%' },
    { label: t(locale, 'admin.pendingReview'), value: 380, icon: ClipboardCheck, color: '#F39C12', change: '+8%' },
    { label: t(locale, 'admin.acceptedProjects'), value: 245, icon: Check, color: '#27AE60', change: '+15%' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]" style={{ direction: dir }}>
      {/* Admin header */}
      <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1B3A6B] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C8A951] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#0D1B2A]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'admin.title')}</h1>
              <p className="text-[#E4C97A] text-sm">INC ALG 3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setAdminTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                adminTab === tab.key ? 'bg-[#0D1B2A] text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1B3A6B]/30'
              }`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Statistics Tab */}
        {adminTab === 'statistics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}12` }}>
                      <card.icon className="w-6 h-6" style={{ color: card.color }} />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">{card.change}</span>
                  </div>
                  <div className="text-2xl font-black" style={{ fontFamily: 'var(--font-cairo)', color: card.color }}>
                    <AnimatedCounter target={card.value} />
                  </div>
                  <div className="text-sm text-slate-500">{card.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <h3 className="font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>
                  {locale === 'ar' ? 'المشاريع حسب الحالة' : locale === 'fr' ? 'Projets par statut' : 'Projects by Status'}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: t(locale, 'status.review'), value: 380, total: 1800, color: '#F39C12' },
                    { label: t(locale, 'status.accepted'), value: 245, total: 1800, color: '#27AE60' },
                    { label: t(locale, 'status.incubated'), value: 130, total: 1800, color: '#2E7D32' },
                    { label: t(locale, 'status.rejected'), value: 89, total: 1800, color: '#C0392B' },
                    { label: t(locale, 'status.revision'), value: 156, total: 1800, color: '#E67E22' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / item.total) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                          className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <h3 className="font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>
                  {locale === 'ar' ? 'المشاريع حسب المجال' : locale === 'fr' ? 'Projets par domaine' : 'Projects by Field'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { field: 'ict', count: 420, color: '#1B3A6B' },
                    { field: 'digital', count: 380, color: '#2952A3' },
                    { field: 'energy', count: 290, color: '#F39C12' },
                    { field: 'ecommerce', count: 310, color: '#C8A951' },
                    { field: 'minerals', count: 180, color: '#2E7D32' },
                    { field: 'industry', count: 220, color: '#E67E22' },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="text-xl font-black" style={{ fontFamily: 'var(--font-cairo)', color: item.color }}>{item.count}</div>
                      <div className="text-xs text-slate-500">{t(locale, `fields.${item.field}`)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {adminTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.projects')}</h3>
              <span className="text-sm text-slate-400">{MOCK_PROJECTS.length} {locale === 'ar' ? 'مشروع' : 'projects'}</span>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5F7FA]">
                    <tr>
                      <th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'projectSubmit.refNumber')}</th>
                      <th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'projectSubmit.projectName')}</th>
                      <th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'projectSubmit.ownerName')}</th>
                      <th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'projectSubmit.field')}</th>
                      <th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'common.status')}</th>
                      <th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'admin.score')}</th>
                      <th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_PROJECTS.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-slate-600">{project.refNumber}</td>
                        <td className="px-4 py-3 text-sm font-bold text-[#1B3A6B]">{locale === 'ar' ? project.projectName : project.projectNameEn}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{project.ownerName}</td>
                        <td className="px-4 py-3"><FieldBadge field={project.field} locale={locale} /></td>
                        <td className="px-4 py-3"><StatusBadge status={project.status} locale={locale} /></td>
                        <td className="px-4 py-3 text-sm font-bold" style={{ color: project.score ? (project.score >= 80 ? '#27AE60' : '#F39C12') : '#9CA3AF' }}>
                          {project.score || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => setSelectedProject(project.id)}
                              className="p-1.5 rounded-lg bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B] transition-colors" title={t(locale, 'admin.evaluate')}>
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {project.status === 'review' && (
                              <>
                                <button onClick={() => handleProjectAction(project.id, 'accept')}
                                  className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors" title={t(locale, 'admin.accept')}>
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleProjectAction(project.id, 'reject')}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors" title={t(locale, 'admin.reject')}>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            {project.status === 'accepted' && (
                              <button onClick={() => handleProjectAction(project.id, 'incubate')}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors" title={t(locale, 'admin.incubate')}>
                                <Rocket className="w-3.5 h-3.5" />
                                </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {adminTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.users')}</h3>
              <button className="px-4 py-2 rounded-xl bg-[#1B3A6B] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#2952A3] transition-all">
                <UserPlus className="w-4 h-4" />{locale === 'ar' ? 'إضافة مستخدم' : 'Add User'}
              </button>
            </div>
            <div className="grid gap-4">
              {[
                { name: 'أحمد بن علي', email: 'ahmed.benali@univ-alger3.dz', role: 'student', faculty: 'eco', projects: 2 },
                { name: 'فاطمة الزهراء مراد', email: 'fatima.mourad@univ-alger3.dz', role: 'student', faculty: 'eco', projects: 1 },
                { name: 'سارة حداد', email: 'sara.haddad@univ-alger3.dz', role: 'student', faculty: 'info', projects: 1 },
                { name: 'د. علي بوعشة محمد', email: 'a.bouacha@univ-alger3.dz', role: 'admin', faculty: '', projects: 0 },
              ].map((user, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: user.role === 'admin' ? '#C8A951' : '#1B3A6B', fontFamily: 'var(--font-cairo)' }}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{user.name}</h4>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-[#C8A951]/10 text-[#C8A951]' : 'bg-[#1B3A6B]/10 text-[#1B3A6B]'}`}>
                    {user.role === 'admin' ? t(locale, 'nav.admin') : t(locale, 'auth.registerBtn')}
                  </span>
                  {user.projects > 0 && (
                    <span className="text-sm text-slate-400">{user.projects} {t(locale, 'dashboard.myProjects')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Landing Page Management */}
        {adminTab === 'landing' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.landingPage')}</h3>
            {[
              { section: locale === 'ar' ? 'القسم الرئيسي (Hero)' : 'Hero Section', icon: Sparkles },
              { section: locale === 'ar' ? 'الإحصائيات' : 'Statistics', icon: BarChart3 },
              { section: locale === 'ar' ? 'كيف تعمل الحاضنة' : 'How It Works', icon: Lightbulb },
              { section: locale === 'ar' ? 'الخدمات' : 'Services', icon: Zap },
              { section: locale === 'ar' ? 'عن الحاضنة' : 'About', icon: Building2 },
              { section: locale === 'ar' ? 'الشركاء' : 'Partners', icon: Users },
              { section: locale === 'ar' ? 'الأحداث' : 'Events', icon: Activity },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B3A6B]/5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#1B3A6B]" />
                    </div>
                    <h4 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{item.section}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B] transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B] transition-colors">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B] transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{t(locale, 'admin.sectionTitle')} (AR)</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" defaultValue={item.section} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{t(locale, 'admin.sectionTitle')} (EN)</label>
                      <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{t(locale, 'admin.sectionTitle')} (FR)</label>
                      <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] transition-all flex items-center gap-2">
              {t(locale, 'common.save')} <Check className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Events Tab */}
        {adminTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.events')}</h3>
              <button className="px-4 py-2 rounded-xl bg-[#1B3A6B] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#2952A3] transition-all">
                <Plus className="w-4 h-4" />{locale === 'ar' ? 'إضافة حدث' : 'Add Event'}
              </button>
            </div>
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-[#1B3A6B] mb-1" style={{ fontFamily: 'var(--font-cairo)' }}>
                      {locale === 'ar' ? event.titleAr : locale === 'fr' ? event.titleFr : event.titleEn}
                    </h4>
                    <p className="text-sm text-slate-500">{event.location} • {new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evaluate Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.evaluate')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'admin.score')} (0-100)</label>
                  <input type="number" min={0} max={100} value={evalScore} onChange={(e) => setEvalScore(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" placeholder="85" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'admin.notes')}</label>
                  <textarea value={evalNotes} onChange={(e) => setEvalNotes(e.target.value)} rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['accept', 'revision', 'incubate', 'reject'].map((action) => {
                    const colors: Record<string, string> = {
                      accept: 'bg-green-600 hover:bg-green-700', revision: 'bg-amber-600 hover:bg-amber-700',
                      incubate: 'bg-emerald-600 hover:bg-emerald-700', reject: 'bg-red-600 hover:bg-red-700',
                    };
                    const icons: Record<string, any> = { accept: Check, revision: RefreshCw, incubate: Rocket, reject: X };
                    const Icon = icons[action];
                    return (
                      <button key={action} onClick={() => handleProjectAction(selectedProject, action)}
                        className={`px-4 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all ${colors[action]}`}>
                        <Icon className="w-4 h-4" />{t(locale, `admin.${action}`)}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setSelectedProject(null)}
                  className="w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                  {t(locale, 'common.cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== ABOUT PAGE ====================

function AboutPage({ locale }: { locale: Locale }) {
  const dir = localeDirection[locale];
  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12" style={{ direction: dir }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)' }}>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-[#C8A951] flex items-center justify-center">
                <Building2 className="w-10 h-10 text-[#0D1B2A]" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-cairo), Cairo, sans-serif' }}>{t(locale, 'about.title')}</h1>
              <p className="text-[#E4C97A] text-lg">{t(locale, 'about.subtitle')}</p>
            </div>
          </div>
          <div className="p-8 sm:p-12 space-y-6">
            <p className="text-slate-600 leading-relaxed text-lg">{t(locale, 'about.p1')}</p>
            <p className="text-slate-600 leading-relaxed text-lg">{t(locale, 'about.p2')}</p>
            <p className="text-slate-600 leading-relaxed text-lg">{t(locale, 'about.p3')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              {[
                { icon: Users, text: t(locale, 'about.director'), color: '#1B3A6B' },
                { icon: Building2, text: t(locale, 'about.established'), color: '#C8A951' },
                { icon: Award, text: t(locale, 'about.official'), color: '#2E7D32' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <span className="font-medium text-slate-700 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function Home() {
  const { currentView, setCurrentView, user, setUser, locale } = useAppStore();
  const dir = localeDirection[locale];

  // Set HTML direction and lang
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    toast.success(locale === 'ar' ? 'تم تسجيل الخروج' : locale === 'fr' ? 'Déconnexion réussie' : 'Logged out successfully');
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage locale={locale} onNavigate={setCurrentView} />;
      case 'login':
      case 'register':
        return <AuthPage locale={locale} onNavigate={setCurrentView} onLogin={setUser} />;
      case 'projects':
        return <ProjectsPage locale={locale} onNavigate={setCurrentView} />;
      case 'submit-project':
        return user ? <ProjectSubmitPage locale={locale} onNavigate={setCurrentView} user={user} /> : <AuthPage locale={locale} onNavigate={setCurrentView} onLogin={setUser} />;
      case 'student-dashboard':
        return user ? <StudentDashboard locale={locale} user={user} onNavigate={setCurrentView} /> : <AuthPage locale={locale} onNavigate={setCurrentView} onLogin={setUser} />;
      case 'admin-dashboard':
        return user?.role === 'admin' ? <AdminDashboard locale={locale} /> : <AuthPage locale={locale} onNavigate={setCurrentView} onLogin={setUser} />;
      case 'about':
        return <AboutPage locale={locale} />;
      default:
        return <LandingPage locale={locale} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ direction: dir }}>
      <Header
        locale={locale}
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={currentView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
