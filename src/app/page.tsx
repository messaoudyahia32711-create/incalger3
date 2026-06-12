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
  Facebook, Instagram, Youtube, Send, RefreshCw, MessageCircle,
  BookOpen, Info, ArrowLeft, PanelLeftClose, PanelLeftOpen,
  Clock, DollarSign, UsersRound, HandshakeIcon, Briefcase,
  CircleDot, CircleCheck, CircleAlert, CircleX, Circle
} from 'lucide-react';
import { useAppStore, type AppView, type Message, type BMCBlock, type EditableStats } from '@/lib/store';
import { t, type Locale, localeNames, localeDirection } from '@/lib/i18n';
import { MOCK_PROJECTS, MOCK_PARTNERS, MOCK_EVENTS, MOCK_MESSAGES, ADMIN_CREDENTIALS, STUDENT_CREDENTIALS, DEFAULT_BMC } from '@/lib/mockData';
import { toast } from 'sonner';

// ==================== HELPER COMPONENTS ====================

function StatusBadge({ status, locale }: { status: string; locale: Locale }) {
  const colors: Record<string, string> = {
    review: 'bg-amber-100 text-amber-800 border-amber-300', committee: 'bg-blue-100 text-blue-800 border-blue-300',
    accepted: 'bg-green-100 text-green-800 border-green-300', rejected: 'bg-red-100 text-red-800 border-red-300',
    revision: 'bg-orange-100 text-orange-800 border-orange-300', incubated: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{t(locale, `status.${status}`)}</span>;
}

function FieldBadge({ field, locale }: { field: string; locale: Locale }) {
  const icons: Record<string, string> = { ict: '💻', digital: '🌐', minerals: '⛏️', energy: '☀️', industry: '🏭', ecommerce: '🛒', other: '📦' };
  return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"><span>{icons[field] || '📦'}</span>{t(locale, `fields.${field}`)}</span>;
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const start = Date.now();
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  useEffect(() => {
    const timer = setTimeout(startAnimation, 800);
    return () => clearTimeout(timer);
  }, [startAnimation]);
  return <span>{count.toLocaleString()}</span>;
}

// ==================== MARQUEE BAR ====================

function MarqueeBar({ locale }: { locale: Locale }) {
  return (
    <div className="w-full overflow-hidden py-1.5" style={{ background: 'linear-gradient(90deg, #C8A951 0%, #E4C97A 50%, #C8A951 100%)' }}>
      <div className="flex whitespace-nowrap animate-marquee">
        {[1, 2, 3].map((i) => (<span key={i} className="mx-8 text-xs font-bold text-[#0D1B2A]" style={{ fontFamily: 'var(--font-amiri), Amiri, serif' }}>✦ {t(locale, 'hero.marquee')} ✦</span>))}
      </div>
    </div>
  );
}

// ==================== HEADER ====================

function Header({ locale, currentView, onNavigate, user, onLogout }: { locale: Locale; currentView: AppView; onNavigate: (v: AppView) => void; user: any; onLogout: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { setLocale, messages } = useAppStore();
  const dir = localeDirection[locale];
  const unreadCount = user ? messages.filter((m: Message) => m.to === user.id && !m.read).length : 0;

  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);

  const navLinks = [
    { key: 'landing', label: t(locale, 'nav.home'), icon: HomeIcon },
    { key: 'projects', label: t(locale, 'nav.projects'), icon: Eye },
    { key: 'submit-project', label: t(locale, 'nav.submit'), icon: Plus },
    { key: 'about', label: t(locale, 'nav.about'), icon: Building2 },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg bg-[#0D1B2A]/98' : 'bg-[#0D1B2A]'}`} style={{ direction: dir }}>
      <MarqueeBar locale={locale} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8A951] to-[#E4C97A] flex items-center justify-center shadow-lg"><Building2 className="w-4 h-4 text-[#0D1B2A]" /></div>
            <div><h1 className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'var(--font-cairo)' }}>INC ALG 3</h1><p className="text-[#E4C97A] text-[9px] leading-tight">{t(locale, 'brandSubtitle').substring(0, 28)}...</p></div>
          </div>
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (<button key={link.key} onClick={() => { onNavigate(link.key as AppView); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${currentView === link.key ? 'text-[#C8A951] bg-[#C8A951]/10' : 'text-white/80 hover:text-[#E4C97A]'}`}><link.icon className="w-3.5 h-3.5" />{link.label}</button>))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-white/80 hover:text-white text-xs border border-white/10"><Globe className="w-3.5 h-3.5" /><span className="hidden sm:inline">{localeNames[locale]}</span><ChevronDown className="w-3 h-3" /></button>
              {langOpen && (<div className="absolute top-full mt-1 end-0 bg-white rounded-xl shadow-xl border z-50 min-w-[130px]">{(Object.keys(localeNames) as Locale[]).map((loc) => (<button key={loc} onClick={() => { setLocale(loc); setLangOpen(false); }} className={`w-full px-3 py-2 text-sm text-start hover:bg-slate-50 ${locale === loc ? 'bg-[#1B3A6B]/5 text-[#1B3A6B] font-bold' : 'text-slate-700'}`}>{localeNames[loc]}</button>))}</div>)}
            </div>
            {user ? (
              <div className="flex items-center gap-1.5">
                <button onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#C8A951]/10 text-[#C8A951] text-xs border border-[#C8A951]/20 relative">
                  <LayoutDashboard className="w-3.5 h-3.5" /><span className="hidden sm:inline">{user.role === 'admin' ? t(locale, 'nav.admin') : t(locale, 'nav.dashboard')}</span>
                  {unreadCount > 0 && <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">{unreadCount}</span>}
                </button>
                <button onClick={onLogout} className="p-1.5 rounded-lg text-white/60 hover:text-red-400"><LogOut className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <button onClick={() => onNavigate('login')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8A951] text-[#0D1B2A] font-bold text-xs shadow-lg shadow-[#C8A951]/20"><LogIn className="w-3.5 h-3.5" /><span className="hidden sm:inline">{t(locale, 'nav.login')}</span></button>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1.5 rounded-lg text-white hover:bg-white/10">{mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</button>
          </div>
        </div>
      </div>
      <AnimatePresence>{mobileOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#0D1B2A] border-t border-white/10 overflow-hidden"><div className="px-4 py-3 space-y-1">{navLinks.map((link) => (<button key={link.key} onClick={() => { onNavigate(link.key as AppView); setMobileOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${currentView === link.key ? 'bg-[#C8A951]/10 text-[#C8A951]' : 'text-white/70'}`}><link.icon className="w-4 h-4" />{link.label}</button>))}</div></motion.div>)}</AnimatePresence>
    </header>
  );
}

// ==================== SIDEBAR ====================

function Sidebar({ items, activeTab, onTabChange, collapsed, onToggle, locale }: {
  items: { key: string; label: string; icon: any; badge?: number }[];
  activeTab: string; onTabChange: (key: string) => void;
  collapsed: boolean; onToggle: () => void; locale: Locale;
}) {
  const dir = localeDirection[locale];
  return (
    <aside className={`hidden md:flex flex-col bg-[#0D1B2A] text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'} shrink-0`} style={{ direction: dir }}>
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        {!collapsed && <span className="text-[#C8A951] text-xs font-bold" style={{ fontFamily: 'var(--font-cairo)' }}>INC ALG 3</span>}
        <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60">{collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}</button>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => (
          <button key={item.key} onClick={() => onTabChange(item.key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.key ? 'bg-[#C8A951]/15 text-[#C8A951]' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}>
            <item.icon className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
            {!collapsed && item.badge && item.badge > 0 && <span className="ms-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ==================== LANDING PAGE ====================

function LandingPage({ locale, onNavigate }: { locale: Locale; onNavigate: (v: AppView) => void }) {
  const { editableStats } = useAppStore();
  const dir = localeDirection[locale];
  return (
    <div style={{ direction: dir }}>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)' }}>
        <div className="absolute inset-0 opacity-10"><svg width="100%" height="100%"><defs><pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#C8A951"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg></div>
        <div className="absolute top-20 start-20 w-72 h-72 bg-[#C8A951]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 end-20 w-96 h-96 bg-[#2952A3]/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A951]/10 border border-[#C8A951]/20 text-[#E4C97A] text-sm mb-8"><Sparkles className="w-4 h-4" />{t(locale, 'brandFull')}</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>INC <span className="text-[#C8A951]">ALG 3</span></motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl sm:text-2xl text-[#E4C97A] font-bold mb-6" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'hero.subtitle')}</motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg text-white/70 max-w-2xl mx-auto mb-10">{t(locale, 'hero.description')}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => onNavigate('submit-project')} className="group px-8 py-4 rounded-2xl bg-[#C8A951] text-[#0D1B2A] font-bold text-lg hover:bg-[#E4C97A] transition-all shadow-xl shadow-[#C8A951]/25 flex items-center gap-3 animate-pulse-gold"><Rocket className="w-5 h-5" />{t(locale, 'hero.cta1')}<ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl-flip transition-transform" /></button>
              <button onClick={() => onNavigate('projects')} className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/5 hover:border-white/40 transition-all flex items-center gap-3"><Eye className="w-5 h-5" />{t(locale, 'hero.cta2')}</button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 w-full"><svg viewBox="0 0 1440 100" fill="none"><path d="M0,60 C360,100 720,20 1440,60 L1440,100 L0,100 Z" fill="#F5F7FA"/></svg></div>
      </section>

      {/* Stats - Uses editableStats from store */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: editableStats.totalSubmitted, label: t(locale, 'stats.projectsRegistered'), icon: FileText, color: '#1B3A6B' },
              { value: editableStats.accepted, label: t(locale, 'stats.accepted'), icon: Check, color: '#27AE60' },
              { value: editableStats.evaluating, label: t(locale, 'stats.evaluating'), icon: ClipboardCheck, color: '#F39C12' },
              { value: editableStats.startups, label: t(locale, 'stats.startups'), icon: Rocket, color: '#C8A951' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-100 text-center group">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}><stat.icon className="w-7 h-7" style={{ color: stat.color }} /></div>
                <div className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-cairo)', color: stat.color }}><AnimatedCounter target={stat.value} /></div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-[#1B3A6B] mb-3" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'howItWorks.title')}</h2>
            <p className="text-slate-600 text-lg">{t(locale, 'howItWorks.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {(['step1', 'step2', 'step3', 'step4', 'step5'] as const).map((step, i) => {
              const icons = [Lightbulb, ClipboardCheck, GraduationCap, Rocket, Banknote];
              const colors = ['#C8A951', '#1B3A6B', '#2E7D32', '#2952A3', '#E67E22'];
              return (
                <motion.div key={step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }} className="relative text-center group">
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${colors[i]}15, ${colors[i]}25)` }}>
                      {React.createElement(icons[i], { className: 'w-9 h-9', style: { color: colors[i] } })}
                      <span className="absolute -top-2 -end-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md" style={{ backgroundColor: colors[i] }}>{i + 1}</span>
                    </div>
                    <h3 className="font-bold text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, `howItWorks.${step}.title`)}</h3>
                    <p className="text-sm text-slate-500">{t(locale, `howItWorks.${step}.desc`)}</p>
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
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-black text-[#1B3A6B] mb-3" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'services.title')}</h2>
            <p className="text-slate-600 text-lg">{t(locale, 'services.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(['s1', 's2', 's3', 's4', 's5', 's6'] as const).map((s, i) => {
              const icons = [GraduationCap, Target, Zap, Award, Banknote, Shield];
              const colors = ['#1B3A6B', '#2E7D32', '#C8A951', '#2952A3', '#E67E22', '#C0392B'];
              return (
                <motion.div key={s} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-100 group hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${colors[i]}12` }}>{React.createElement(icons[i], { className: 'w-7 h-7', style: { color: colors[i] } })}</div>
                  <h3 className="text-lg font-bold text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, `services.${s}.title`)}</h3>
                  <p className="text-sm text-slate-500">{t(locale, `services.${s}.desc`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-black text-[#1B3A6B] mb-3" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'about.title')}</h2>
              <p className="text-[#C8A951] font-bold text-lg mb-6">{t(locale, 'about.subtitle')}</p>
              <div className="space-y-4 text-slate-600 leading-relaxed"><p>{t(locale, 'about.p1')}</p><p>{t(locale, 'about.p2')}</p><p>{t(locale, 'about.p3')}</p></div>
              <div className="mt-6 space-y-2">{[{ icon: Users, text: t(locale, 'about.director') }, { icon: Building2, text: t(locale, 'about.established') }, { icon: Award, text: t(locale, 'about.official') }].map((item, i) => (<div key={i} className="flex items-center gap-3 text-slate-700"><item.icon className="w-5 h-5 text-[#C8A951]" /><span className="font-medium">{item.text}</span></div>))}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-[#1B3A6B] to-[#0F2140] rounded-3xl p-8 text-white">
              <div className="text-center mb-6"><div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-[#C8A951]/20 flex items-center justify-center"><Building2 className="w-10 h-10 text-[#C8A951]" /></div><h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-cairo)' }}>INC ALG 3</h3></div>
              <div className="grid grid-cols-2 gap-4">{[{ value: '50,000+', label: locale === 'ar' ? 'طالب' : 'Students' }, { value: '4', label: locale === 'ar' ? 'كليات' : 'Faculties' }, { value: '11+', label: locale === 'ar' ? 'دفعات' : 'Batches' }, { value: '1,800+', label: locale === 'ar' ? 'مشروع' : 'Projects' }].map((item, i) => (<div key={i} className="bg-white/5 rounded-xl p-4 text-center"><div className="text-2xl font-black text-[#E4C97A]" style={{ fontFamily: 'var(--font-cairo)' }}>{item.value}</div><div className="text-sm text-white/70">{item.label}</div></div>))}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#1B3A6B] mb-3" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'partners.title')}</h2>
            <p className="text-slate-600 text-lg">{t(locale, 'partners.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{MOCK_PARTNERS.map((partner, i) => (<motion.div key={partner.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="bg-white rounded-2xl p-5 text-center hover:shadow-lg transition-all border border-slate-100 hover:-translate-y-1"><div className="text-3xl mb-2">{partner.logo}</div><p className="text-sm font-bold text-slate-700" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? partner.nameAr : locale === 'fr' ? partner.nameFr : partner.nameEn}</p></motion.div>))}</div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'cta.title')}</h2>
            <p className="text-lg text-white/70 mb-8">{t(locale, 'cta.subtitle')}</p>
            <button onClick={() => onNavigate('submit-project')} className="px-10 py-5 rounded-2xl bg-[#C8A951] text-[#0D1B2A] font-black text-xl hover:bg-[#E4C97A] transition-all shadow-2xl shadow-[#C8A951]/30 flex items-center gap-3 mx-auto"><Rocket className="w-6 h-6" />{t(locale, 'cta.button')}</button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#C8A951] flex items-center justify-center"><Building2 className="w-5 h-5 text-[#0D1B2A]" /></div><span className="text-xl font-black" style={{ fontFamily: 'var(--font-cairo)' }}>INC ALG 3</span></div><p className="text-white/60 text-sm">{t(locale, 'about.p2').substring(0, 120)}...</p></div>
            <div><h4 className="font-bold text-[#C8A951] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'footer.quickLinks')}</h4><div className="space-y-2">{[{ key: 'landing', label: t(locale, 'nav.home') }, { key: 'projects', label: t(locale, 'nav.projects') }, { key: 'submit-project', label: t(locale, 'nav.submit') }].map((link) => (<button key={link.key} onClick={() => { onNavigate(link.key as AppView); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block text-white/60 hover:text-[#E4C97A] transition-colors text-sm">{link.label}</button>))}</div></div>
            <div><h4 className="font-bold text-[#C8A951] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'footer.contactUs')}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/60 text-sm"><MapPin className="w-4 h-4 text-[#C8A951]" />{t(locale, 'footer.address')}</div>
                <div className="flex items-center gap-2 text-white/60 text-sm"><Mail className="w-4 h-4 text-[#C8A951]" />{t(locale, 'footer.email')}</div>
                <div className="flex items-center gap-2 text-white/60 text-sm"><Phone className="w-4 h-4 text-[#C8A951]" />{t(locale, 'footer.phone')}</div>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="https://www.facebook.com/p/%D8%AD%D8%A7%D8%B6%D9%86%D8%A9-%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84-%D9%84%D8%AC%D8%A7%D9%85%D8%B9%D8%A9-%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B13-100087801578310/?locale=ar_AR" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#C8A951]/20 flex items-center justify-center transition-colors"><Facebook className="w-5 h-5 text-white/60 hover:text-[#C8A951]" /></a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#C8A951]/20 flex items-center justify-center transition-colors"><Instagram className="w-5 h-5 text-white/60" /></a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#C8A951]/20 flex items-center justify-center transition-colors"><Youtube className="w-5 h-5 text-white/60" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-white/40 text-sm">{t(locale, 'footer.rights')}</div>
        </div>
      </footer>
    </div>
  );
}

// ==================== AUTH PAGE ====================

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
      if (isLogin && email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        onLogin({ id: 'admin-001', email, name: locale === 'ar' ? 'المدير العام' : 'Admin', role: 'admin' });
        toast.success(locale === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
        onNavigate('admin-dashboard');
      } else if (isLogin && email === STUDENT_CREDENTIALS.email && password === STUDENT_CREDENTIALS.password) {
        const matchingProject = MOCK_PROJECTS.find(p => p.ownerEmail === email);
        onLogin({ id: 'student-001', email, name: matchingProject?.ownerName || email.split('@')[0], role: 'student', faculty: matchingProject?.faculty, level: matchingProject?.level });
        toast.success(locale === 'ar' ? 'تم تسجيل الدخول كطالب بنجاح' : 'Student login successful');
        onNavigate('student-dashboard');
      } else if (isLogin && email && password) {
        const matchingProject = MOCK_PROJECTS.find(p => p.ownerEmail === email);
        onLogin({ id: 'student-001', email, name: matchingProject?.ownerName || email.split('@')[0], role: 'student', faculty: matchingProject?.faculty, level: matchingProject?.level });
        toast.success(locale === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
        onNavigate('student-dashboard');
      } else if (!isLogin) {
        onLogin({ id: 'student-new', email, name: name || email.split('@')[0], role: 'student', phone, faculty, level });
        toast.success(locale === 'ar' ? 'تم إنشاء الحساب' : 'Account created');
        onNavigate('student-dashboard');
      } else {
        toast.error(locale === 'ar' ? 'بيانات غير صحيحة' : 'Invalid credentials');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)', direction: dir }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-[#1B3A6B] to-[#0F2140] text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-[#C8A951] flex items-center justify-center"><Building2 className="w-8 h-8 text-[#0D1B2A]" /></div>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-cairo)' }}>{isLogin ? t(locale, 'auth.loginTitle') : t(locale, 'auth.registerTitle')}</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {!isLogin && <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.name')}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" /></div>}
            <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.email')}</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@univ-alger3.dz" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.password')}</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" /></div>
            {!isLogin && (<><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.phone')}</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XXXXXXXX" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.faculty')}</label><select value={faculty} onChange={(e) => setFaculty(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm bg-white"><option value="">{t(locale, 'auth.faculty')}</option>{(['eco', 'info', 'pol', 'sport'] as const).map((f) => (<option key={f} value={f}>{t(locale, `faculties.${f}`)}</option>))}</select></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.level')}</label><select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm bg-white"><option value="">{t(locale, 'auth.level')}</option>{(['l1', 'l2', 'l3', 'm1', 'm2', 'phd'] as const).map((l) => (<option key={l} value={l}>{t(locale, `levels.${l}`)}</option>))}</select></div></>)}
            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-[#1B3A6B] text-white font-bold text-lg hover:bg-[#2952A3] transition-all disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}{isLogin ? t(locale, 'auth.loginBtn') : t(locale, 'auth.registerBtn')}</button>
            {isLogin && (
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setEmail(ADMIN_CREDENTIALS.email); setPassword(ADMIN_CREDENTIALS.password); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B] text-xs font-bold border border-[#1B3A6B]/10 transition-all hover:border-[#1B3A6B]/30">
                  <Shield className="w-3.5 h-3.5" />{t(locale, 'auth.adminLogin')}
                </button>
                <button type="button" onClick={() => { setEmail(STUDENT_CREDENTIALS.email); setPassword(STUDENT_CREDENTIALS.password); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold border border-[#2E7D32]/10 transition-all hover:border-[#2E7D32]/30">
                  <GraduationCap className="w-3.5 h-3.5" />{t(locale, 'auth.studentLogin')}
                </button>
              </div>
            )}
            <div className="text-center pt-4 border-t border-slate-100"><button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[#1B3A6B] font-bold text-sm hover:underline">{isLogin ? t(locale, 'auth.noAccount') : t(locale, 'auth.hasAccount')}</button></div>
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
  const { setSelectedProjectId } = useAppStore();
  const dir = localeDirection[locale];
  const filtered = MOCK_PROJECTS.filter((p) => { if (filter !== 'all' && p.field !== filter) return false; if (search && !p.projectName.includes(search) && !p.ownerName.includes(search)) return false; return true; });

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8" style={{ direction: dir }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8"><h1 className="text-3xl font-black text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'projectsPage.title')}</h1><p className="text-slate-600">{t(locale, 'projectsPage.subtitle')}</p></motion.div>
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm"><Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(locale, 'projectsPage.search')} className="w-full ps-10 pe-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm bg-white" /></div>
          <div className="flex gap-2 flex-wrap">{[{ key: 'all', label: t(locale, 'projectsPage.all') }, ...(['ict', 'digital', 'energy', 'ecommerce', 'minerals', 'industry'] as const).map((f) => ({ key: f, label: t(locale, `fields.${f}`) }))].map((f) => (<button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.key ? 'bg-[#1B3A6B] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}>{f.label}</button>))}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-100 group hover:-translate-y-1 cursor-pointer" onClick={() => { setSelectedProjectId(project.id); onNavigate('project-detail'); }}>
              <div className="flex items-start justify-between mb-3"><FieldBadge field={project.field} locale={locale} /><StatusBadge status={project.status} locale={locale} /></div>
              <h3 className="text-lg font-bold text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? project.projectName : project.projectNameEn}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100"><span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.ownerName}</span><span className="font-mono">{project.refNumber}</span></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== PROJECT DETAIL ====================

function ProjectDetail({ locale, onNavigate }: { locale: Locale; onNavigate: (v: AppView) => void }) {
  const { selectedProjectId } = useAppStore();
  const project = MOCK_PROJECTS.find((p) => p.id === selectedProjectId);
  const dir = localeDirection[locale];
  if (!project) return <div className="min-h-screen flex items-center justify-center text-slate-400" style={{ direction: dir }}><FileText className="w-12 h-12 mr-3 opacity-50" />{t(locale, 'common.noData')}</div>;

  const statusStepMap: Record<string, number> = { review: 0, committee: 1, accepted: 2, revision: 1, incubated: 4, rejected: -1 };
  const currentStep = statusStepMap[project.status] ?? 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8" style={{ direction: dir }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button onClick={() => onNavigate('projects')} className="flex items-center gap-2 text-[#1B3A6B] font-bold mb-6 hover:underline"><ArrowRight className="w-4 h-4 rtl-flip" />{t(locale, 'admin.backToProjects')}</button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-8" style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B3A6B)' }}>
            <div className="flex flex-wrap items-center gap-3 mb-4"><FieldBadge field={project.field} locale={locale} /><StatusBadge status={project.status} locale={locale} /><span className="text-white/50 text-sm font-mono">{project.refNumber}</span></div>
            <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? project.projectName : project.projectNameEn}</h1>
            <p className="text-white/60">{project.ownerName} • {project.ownerEmail}</p>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'projectDetail.overview')}</h3>
            <p className="text-slate-600 leading-relaxed mb-6">{project.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h4 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'projectDetail.information')}</h4>
                {[
                  { label: t(locale, 'projectSubmit.problem'), value: project.problem },
                  { label: t(locale, 'projectSubmit.targetAudience'), value: project.targetAudience },
                  { label: t(locale, 'projectSubmit.addedValue'), value: project.addedValue },
                  { label: t(locale, 'projectSubmit.legalFramework'), value: project.legalFramework },
                  { label: t(locale, 'projectSubmit.tradeName'), value: project.tradeName },
                ].map((item, i) => (<div key={i}><span className="text-xs text-slate-400">{item.label}</span><p className="text-sm text-slate-700 font-medium">{item.value}</p></div>))}
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'projectDetail.financial')}</h4>
                <div className="bg-[#F5F7FA] rounded-xl p-4 space-y-3">
                  {[
                    { label: t(locale, 'projectSubmit.fundingRequired'), value: `${project.fundingRequired.toLocaleString()} د.ج` },
                    { label: t(locale, 'projectSubmit.stage'), value: t(locale, `stages.${project.stage}`) },
                    { label: t(locale, 'projectSubmit.hasPartner'), value: project.hasPartner ? '✓' : '✗' },
                    { label: t(locale, 'projectSubmit.teamSize'), value: String(project.teamSize) },
                    { label: t(locale, 'admin.score'), value: project.score ? String(project.score) + '/100' : t(locale, 'projectDetail.noScore') },
                  ].map((item, i) => (<div key={i} className="flex justify-between"><span className="text-sm text-slate-500">{item.label}</span><span className="text-sm font-bold text-[#1B3A6B]">{item.value}</span></div>))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            {project.timeline && (
              <div>
                <h4 className="font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'projectDetail.timeline')}</h4>
                <div className="space-y-3">
                  {project.timeline.map((event: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= currentStep ? 'bg-[#1B3A6B] text-white' : 'bg-slate-200 text-slate-400'}`}><Check className="w-4 h-4" /></div>{i < project.timeline.length - 1 && <div className="w-0.5 h-8 bg-slate-200" />}</div>
                      <div><p className="font-medium text-slate-700 text-sm">{locale === 'ar' ? event.event : event.eventEn}</p><p className="text-xs text-slate-400">{new Date(event.date).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-DZ' : 'en')}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.evaluationNotes && (<div className="mt-6 p-4 rounded-xl bg-[#C8A951]/5 border border-[#C8A951]/20"><p className="text-sm font-bold text-[#1B3A6B] mb-1">{t(locale, 'admin.notes')}</p><p className="text-sm text-slate-600">{project.evaluationNotes}</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PROJECT SUBMIT ====================

function ProjectSubmitPage({ locale, onNavigate, user }: { locale: Locale; onNavigate: (v: AppView) => void; user: any }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [form, setForm] = useState({ ownerName: '', email: user?.email || '', phone: '', projectName: '', field: 'ict', description: '', problem: '', targetAudience: '', addedValue: '', fundingRequired: 0, stage: 'idea', hasPartner: false, teamSize: 1, videoLink: '', legalFramework: 'مؤسسة ناشئة', tradeName: '', academicYear: '2024/2025', department: '' });
  const dir = localeDirection[locale];
  const updateForm = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const ref = `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
    setRefNumber(ref);
    setSubmitted(true);
    toast.success(t(locale, 'projectSubmit.success'));
  };

  if (submitted) {
    return (<div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A6B 50%, #0F2140 100%)', direction: dir }}><motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 rounded-full mx-auto mb-6 bg-green-100 flex items-center justify-center"><Check className="w-10 h-10 text-green-600" /></motion.div><h2 className="text-2xl font-black text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'projectSubmit.success')}</h2><div className="bg-[#1B3A6B] rounded-xl p-4 my-6"><p className="text-white/70 text-sm mb-1">{t(locale, 'projectSubmit.refNumber')}</p><p className="text-2xl font-black text-[#C8A951]" style={{ fontFamily: 'var(--font-cairo)' }}>{refNumber}</p></div><div className="flex gap-3"><button onClick={() => onNavigate('student-dashboard')} className="flex-1 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold">{t(locale, 'projectSubmit.trackProject')}</button><button onClick={() => { setSubmitted(false); setStep(1); }} className="flex-1 py-3 rounded-xl border-2 border-[#1B3A6B] text-[#1B3A6B] font-bold">{t(locale, 'projectSubmit.submitAnother')}</button></div></motion.div></div>);
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8" style={{ direction: dir }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8"><h1 className="text-3xl font-black text-[#1B3A6B] mb-2" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'projectSubmit.title')}</h1><p className="text-slate-600">{t(locale, 'projectSubmit.subtitle')}</p></motion.div>
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${s <= step ? 'bg-[#1B3A6B] text-white' : 'bg-slate-200 text-slate-400'}`}>{s}</div>
              {s < 4 && <div className={`flex-1 h-1 rounded ${s < step ? 'bg-[#1B3A6B]' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100">
          {step === 1 && (<div className="space-y-4">{[['ownerName', t(locale, 'projectSubmit.ownerName')], ['email', t(locale, 'projectSubmit.email')], ['phone', t(locale, 'projectSubmit.phone')], ['tradeName', t(locale, 'projectSubmit.tradeName')], ['academicYear', t(locale, 'projectSubmit.academicYear')], ['department', t(locale, 'projectSubmit.department')]].map(([key, label]) => (<div key={key}><label className="block text-sm font-bold text-slate-700 mb-1">{label} *</label><input type="text" value={(form as any)[key]} onChange={(e) => updateForm(key, e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div>))}</div>)}
          {step === 2 && (<div className="space-y-4"><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.projectName')} *</label><input type="text" value={form.projectName} onChange={(e) => updateForm('projectName', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.field')} *</label><div className="grid grid-cols-2 gap-2">{(['ict', 'digital', 'minerals', 'energy', 'industry', 'ecommerce', 'other'] as const).map((f) => (<button key={f} type="button" onClick={() => updateForm('field', f)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${form.field === f ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-slate-600 border-slate-200'}`}>{t(locale, `fields.${f}`)}</button>))}</div></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.description')} *</label><textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none resize-none" /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.problem')} *</label><textarea value={form.problem} onChange={(e) => updateForm('problem', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none resize-none" /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.targetAudience')} *</label><input type="text" value={form.targetAudience} onChange={(e) => updateForm('targetAudience', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.addedValue')} *</label><input type="text" value={form.addedValue} onChange={(e) => updateForm('addedValue', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div></div>)}
          {step === 3 && (<div className="space-y-4"><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.legalFramework')}</label><select value={form.legalFramework} onChange={(e) => updateForm('legalFramework', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none bg-white"><option value="مؤسسة ناشئة">{locale === 'ar' ? 'مؤسسة ناشئة' : 'Startup'}</option><option value="مؤسسة مصغرة">{locale === 'ar' ? 'مؤسسة مصغرة' : 'Micro-enterprise'}</option><option value="براءة اختراع">{locale === 'ar' ? 'براءة اختراع' : 'Patent'}</option></select></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.fundingRequired')} (DZD)</label><input type="number" value={form.fundingRequired} onChange={(e) => updateForm('fundingRequired', Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.stage')}</label><div className="flex gap-3">{(['idea', 'prototype', 'launched'] as const).map((s) => (<button key={s} type="button" onClick={() => updateForm('stage', s)} className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border-2 ${form.stage === s ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-slate-600 border-slate-200'}`}>{t(locale, `stages.${s}`)}</button>))}</div></div><div className="flex items-center gap-3"><label className="text-sm font-bold text-slate-700">{t(locale, 'projectSubmit.hasPartner')}</label><button type="button" onClick={() => updateForm('hasPartner', !form.hasPartner)} className={`w-12 h-7 rounded-full transition-colors ${form.hasPartner ? 'bg-[#1B3A6B]' : 'bg-slate-300'}`}><div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.hasPartner ? 'translate-x-5 rtl:-translate-x-5' : ''}`} /></button></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.teamSize')}</label><input type="number" min={1} max={10} value={form.teamSize} onChange={(e) => updateForm('teamSize', Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'projectSubmit.videoLink')}</label><input type="url" value={form.videoLink} onChange={(e) => updateForm('videoLink', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div></div>)}
          {step === 4 && (<div className="bg-[#F5F7FA] rounded-xl p-6"><h3 className="font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{form.projectName || '---'}</h3><div className="grid grid-cols-2 gap-3 text-sm">{[['ownerName', t(locale, 'projectSubmit.ownerName')], ['email', t(locale, 'projectSubmit.email')], ['field', t(locale, 'projectSubmit.field')], ['stage', t(locale, 'projectSubmit.stage')], ['legalFramework', t(locale, 'projectSubmit.legalFramework')], ['tradeName', t(locale, 'projectSubmit.tradeName')]].map(([key, label]) => (<div key={key}><span className="text-slate-400">{label}:</span><br/><span className="font-medium">{key === 'field' ? t(locale, `fields.${(form as any)[key]}`) : (form as any)[key]}</span></div>))}<div className="col-span-2"><span className="text-slate-400">{t(locale, 'projectSubmit.description')}:</span><br/><span className="font-medium">{form.description}</span></div></div></div>)}
          <div className="flex gap-3 mt-8">{step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold flex items-center gap-2"><ChevronRight className="w-4 h-4 rtl-flip" />{t(locale, 'projectSubmit.prev')}</button>}{step < 4 ? <button type="button" onClick={() => setStep(step + 1)} className="flex-1 px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold flex items-center justify-center gap-2">{t(locale, 'projectSubmit.next')}<ChevronLeft className="w-4 h-4 rtl-flip" /></button> : <button type="button" onClick={handleSubmit} className="flex-1 px-6 py-3 rounded-xl bg-[#C8A951] text-[#0D1B2A] font-bold flex items-center justify-center gap-2 shadow-lg"><Send className="w-5 h-5" />{t(locale, 'projectSubmit.submit')}</button>}</div>
        </motion.div>
      </div>
    </div>
  );
}

// ==================== BMC TOOL ====================

function BMCTool({ locale, projectId }: { locale: Locale; projectId?: string }) {
  const { bmcData, setBmcData } = useAppStore();
  const dir = localeDirection[locale];
  const existingData = projectId ? bmcData[projectId] : null;
  const [bmc, setBmc] = useState<BMCBlock>(existingData || DEFAULT_BMC);

  const updateBlock = (key: keyof BMCBlock, value: string) => {
    const updated = { ...bmc, [key]: value };
    setBmc(updated);
  };

  const handleSave = () => {
    if (projectId) setBmcData(projectId, bmc);
    toast.success(t(locale, 'bmc.saved'));
  };

  const blocks = [
    { key: 'keyPartners' as keyof BMCBlock, label: t(locale, 'bmc.keyPartners'), color: '#1B3A6B', icon: HandshakeIcon },
    { key: 'keyActivities' as keyof BMCBlock, label: t(locale, 'bmc.keyActivities'), color: '#2952A3', icon: Zap },
    { key: 'keyResources' as keyof BMCBlock, label: t(locale, 'bmc.keyResources'), color: '#2E7D32', icon: Briefcase },
    { key: 'valueProposition' as keyof BMCBlock, label: t(locale, 'bmc.valueProposition'), color: '#C8A951', icon: Star },
    { key: 'customerRelationships' as keyof BMCBlock, label: t(locale, 'bmc.customerRelationships'), color: '#E67E22', icon: Heart },
    { key: 'channels' as keyof BMCBlock, label: t(locale, 'bmc.channels'), color: '#F39C12', icon: ArrowRight },
    { key: 'customerSegments' as keyof BMCBlock, label: t(locale, 'bmc.customerSegments'), color: '#C0392B', icon: UsersRound },
    { key: 'costStructure' as keyof BMCBlock, label: t(locale, 'bmc.costStructure'), color: '#6B7280', icon: DollarSign },
    { key: 'revenueStreams' as keyof BMCBlock, label: t(locale, 'bmc.revenueStreams'), color: '#27AE60', icon: TrendingUp },
  ];

  return (
    <div style={{ direction: dir }}>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1B3A6B] mb-1" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'bmc.title')}</h2>
        <p className="text-slate-500 text-sm">{t(locale, 'bmc.subtitle')}</p>
      </div>

      {/* BMC Canvas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {/* Row 1: Key Partners (2 cols), Key Activities, Value Proposition (2 cols), Customer Relationships, Customer Segments (2 cols) */}
        <div className="md:col-span-2 md:row-span-2 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2"><HandshakeIcon className="w-4 h-4" style={{ color: '#1B3A6B' }} /><span className="font-bold text-xs text-[#1B3A6B]">{t(locale, 'bmc.keyPartners')}</span></div>
          <textarea value={bmc.keyPartners} onChange={(e) => updateBlock('keyPartners', e.target.value)} className="w-full h-24 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-[#2952A3]" /><span className="font-bold text-xs text-[#2952A3]">{t(locale, 'bmc.keyActivities')}</span></div>
          <textarea value={bmc.keyActivities} onChange={(e) => updateBlock('keyActivities', e.target.value)} className="w-full h-16 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
        <div className="md:row-span-2 bg-white rounded-xl p-4 shadow-sm border border-[#C8A951]/30">
          <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-[#C8A951]" /><span className="font-bold text-xs text-[#C8A951]">{t(locale, 'bmc.valueProposition')}</span></div>
          <textarea value={bmc.valueProposition} onChange={(e) => updateBlock('valueProposition', e.target.value)} className="w-full h-28 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2"><Heart className="w-4 h-4 text-[#E67E22]" /><span className="font-bold text-xs text-[#E67E22]">{t(locale, 'bmc.customerRelationships')}</span></div>
          <textarea value={bmc.customerRelationships} onChange={(e) => updateBlock('customerRelationships', e.target.value)} className="w-full h-16 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
        <div className="md:col-span-1 md:row-span-2 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2"><UsersRound className="w-4 h-4 text-[#C0392B]" /><span className="font-bold text-xs text-[#C0392B]">{t(locale, 'bmc.customerSegments')}</span></div>
          <textarea value={bmc.customerSegments} onChange={(e) => updateBlock('customerSegments', e.target.value)} className="w-full h-24 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
        {/* Row 2: Key Resources, Channels */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2"><Briefcase className="w-4 h-4 text-[#2E7D32]" /><span className="font-bold text-xs text-[#2E7D32]">{t(locale, 'bmc.keyResources')}</span></div>
          <textarea value={bmc.keyResources} onChange={(e) => updateBlock('keyResources', e.target.value)} className="w-full h-16 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2"><ArrowRight className="w-4 h-4 text-[#F39C12]" /><span className="font-bold text-xs text-[#F39C12]">{t(locale, 'bmc.channels')}</span></div>
          <textarea value={bmc.channels} onChange={(e) => updateBlock('channels', e.target.value)} className="w-full h-16 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
        {/* Row 3: Cost Structure, Revenue Streams */}
        <div className="md:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-[#6B7280]" /><span className="font-bold text-xs text-[#6B7280]">{t(locale, 'bmc.costStructure')}</span></div>
          <textarea value={bmc.costStructure} onChange={(e) => updateBlock('costStructure', e.target.value)} className="w-full h-20 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
        <div className="md:col-span-3 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-[#27AE60]" /><span className="font-bold text-xs text-[#27AE60]">{t(locale, 'bmc.revenueStreams')}</span></div>
          <textarea value={bmc.revenueStreams} onChange={(e) => updateBlock('revenueStreams', e.target.value)} className="w-full h-20 text-xs border-0 outline-none resize-none bg-transparent" placeholder={t(locale, 'bmc.placeholder')} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-[#1B3A6B] text-white font-bold text-sm flex items-center gap-2 hover:bg-[#2952A3]"><Check className="w-4 h-4" />{t(locale, 'bmc.save')}</button>
        <a href="https://bmc-1275.github.io/BMC-TOOL/" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-xl bg-[#C8A951] text-[#0D1B2A] font-bold text-sm flex items-center gap-2 hover:bg-[#E4C97A] shadow-md"><ExternalLink className="w-4 h-4" />{t(locale, 'bmc.toolLink')}</a>
      </div>
      <p className="text-xs text-slate-400 mt-3">{t(locale, 'bmc.toolDesc')}</p>
    </div>
  );
}

// ==================== MESSAGING PANEL ====================

function MessagingPanel({ locale, userId, userRole, otherPartyName }: { locale: Locale; userId: string; userRole: 'student' | 'admin'; otherPartyName: string }) {
  const { messages, addMessage, markMessagesRead } = useAppStore();
  const [newMsg, setNewMsg] = useState('');
  const dir = localeDirection[locale];
  const chatMessages = messages.filter((m: Message) => (m.from === userId || m.to === userId));
  const otherRole = userRole === 'student' ? 'admin' : 'student';

  useEffect(() => { markMessagesRead(userId, otherRole); }, [userId, otherRole, markMessagesRead]);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    addMessage({ id: `msg-${Date.now()}`, from: userId, fromName: userId === 'admin-001' ? 'المدير العام' : 'الطالب', fromRole: userRole, to: userRole === 'admin' ? 'student-001' : 'admin-001', text: newMsg, timestamp: new Date().toISOString(), read: false });
    setNewMsg('');
  };

  return (
    <div className="flex flex-col h-[500px]" style={{ direction: dir }}>
      <div className="p-3 border-b border-slate-200 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[#1B3A6B] flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div><span className="font-bold text-[#1B3A6B] text-sm">{otherPartyName}</span></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && <p className="text-center text-slate-400 text-sm py-8">{t(locale, 'common.noData')}</p>}
        {chatMessages.map((msg: Message) => (
          <div key={msg.id} className={`flex ${msg.from === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.from === userId ? 'bg-[#1B3A6B] text-white rounded-br-sm' : 'bg-slate-100 text-slate-700 rounded-bl-sm'}`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.from === userId ? 'text-white/50' : 'text-slate-400'}`}>{new Date(msg.timestamp).toLocaleTimeString(locale === 'ar' ? 'ar-DZ' : 'en', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-slate-200 flex gap-2">
        <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={t(locale, 'student.typeMessage')} className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" />
        <button onClick={handleSend} className="px-4 py-2.5 rounded-xl bg-[#1B3A6B] text-white hover:bg-[#2952A3]"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

// ==================== STUDENT DASHBOARD ====================

function StudentDashboard({ locale, user, onNavigate }: { locale: Locale; user: any; onNavigate: (v: AppView) => void }) {
  const { studentTab, setStudentTab, sidebarCollapsed, setSidebarCollapsed, editableStats, studentProfiles, setStudentProfile, setUser, messages } = useAppStore();
  const dir = localeDirection[locale];

  const myProject = MOCK_PROJECTS.find(p => p.ownerEmail === user?.email) || MOCK_PROJECTS[0];
  const statusStepMap: Record<string, number> = { review: 0, committee: 1, accepted: 2, revision: 1, incubated: 4, rejected: -1 };
  const currentStep = statusStepMap[myProject.status] ?? 0;

  const progressPercent = myProject.status === 'rejected' ? 0 : Math.round(((currentStep + 1) / 5) * 100);

  // Settings state
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState('');
  const [editFaculty, setEditFaculty] = useState(user?.faculty || '');
  const [editLevel, setEditLevel] = useState(user?.level || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load saved profile on mount
  useEffect(() => {
    const saved = studentProfiles[user?.id || ''];
    if (saved) {
      setEditName(saved.name);
      setEditEmail(saved.email);
      setEditPhone(saved.phone);
      setEditFaculty(saved.faculty);
      setEditLevel(saved.level);
    } else if (myProject) {
      setEditPhone(myProject.ownerPhone || '');
    }
  }, [user?.id, studentProfiles, myProject]);

  const handleSaveProfile = () => {
    const profile = { name: editName, email: editEmail, phone: editPhone, faculty: editFaculty, level: editLevel, password: studentProfiles[user?.id || '']?.password || '' };
    setStudentProfile(user?.id || '', profile);
    setUser({ ...user, name: editName, email: editEmail, faculty: editFaculty, level: editLevel, phone: editPhone });
    toast.success(t(locale, 'student.profileUpdated'));
  };

  const handleChangePassword = () => {
    const savedProfile = studentProfiles[user?.id || ''];
    const savedPassword = savedProfile?.password || (user?.id === 'student-001' ? 'student123' : '');
    if (currentPassword !== savedPassword) {
      toast.error(t(locale, 'student.incorrectPassword'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t(locale, 'student.passwordMismatch'));
      return;
    }
    if (newPassword.length < 4) {
      toast.error(locale === 'ar' ? 'كلمة المرور قصيرة جداً' : 'Password too short');
      return;
    }
    const profile = { name: editName, email: editEmail, phone: editPhone, faculty: editFaculty, level: editLevel, password: newPassword };
    setStudentProfile(user?.id || '', profile);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success(t(locale, 'student.passwordChanged'));
  };

  const unreadMsgs = messages.filter((m: Message) => m.to === user?.id && !m.read).length;

  const tabs = [
    { key: 'overview', label: t(locale, 'student.overview'), icon: HomeIcon },
    { key: 'my-project', label: t(locale, 'student.myProject'), icon: FileText },
    { key: 'bmc', label: t(locale, 'student.bmc'), icon: Target },
    { key: 'messages', label: t(locale, 'student.messages'), icon: MessageCircle, badge: unreadMsgs },
    { key: 'guide', label: t(locale, 'student.guide'), icon: BookOpen },
    { key: 'profile', label: t(locale, 'student.profile'), icon: Users },
    { key: 'settings', label: t(locale, 'student.settings'), icon: Settings },
  ];

  const stepIcons = [Lightbulb, ClipboardCheck, GraduationCap, Check, Rocket];
  const stepColors = ['#C8A951', '#1B3A6B', '#2E7D32', '#27AE60', '#C8A951'];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" style={{ direction: dir }}>
      <Sidebar items={tabs} activeTab={studentTab} onTabChange={setStudentTab} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} locale={locale} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B3A6B] to-[#2952A3] py-5 px-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C8A951] flex items-center justify-center text-[#0D1B2A] font-black text-lg" style={{ fontFamily: 'var(--font-cairo)' }}>{user?.name?.charAt(0) || 'S'}</div>
            <div className="flex-1"><h1 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'student.welcome')}، {user?.name}</h1><p className="text-[#E4C97A] text-xs">{user?.email}</p></div>
            {myProject && <StatusBadge status={myProject.status} locale={locale} />}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-1 p-2 overflow-x-auto bg-white border-b border-slate-200">
          {tabs.map((tab) => (<button key={tab.key} onClick={() => setStudentTab(tab.key)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${studentTab === tab.key ? 'bg-[#1B3A6B] text-white' : 'text-slate-500'}`}><tab.icon className="w-3.5 h-3.5" />{tab.label}</button>))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">

          {/* ========== OVERVIEW TAB ========== */}
          {studentTab === 'overview' && (
            <div className="space-y-6">
              {/* Project Header Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100">
                <div className="p-6" style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B3A6B)' }}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <FieldBadge field={myProject.field} locale={locale} />
                    <StatusBadge status={myProject.status} locale={locale} />
                    <span className="text-white/40 text-sm font-mono">{myProject.refNumber}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? myProject.projectName : myProject.projectNameEn}</h2>
                  <p className="text-white/50 text-sm">{myProject.tradeName} • {t(locale, `stages.${myProject.stage}`)}</p>
                </div>

                {/* Progress Bar */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#1B3A6B]">{t(locale, 'student.progressLabel')}</span>
                    <span className="text-sm font-black text-[#C8A951]">{progressPercent}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #1B3A6B, #C8A951)' }} />
                  </div>

                  {/* Step Progress Icons */}
                  <div className="flex items-center gap-2 mb-6">
                    {[0, 1, 2, 3, 4].map((step) => {
                      const Icon = stepIcons[step];
                      const isActive = step === currentStep;
                      const isDone = step < currentStep;
                      const isRejected = myProject.status === 'rejected';
                      return (
                        <div key={step} className="flex-1 flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${isDone ? 'bg-[#27AE60] text-white' : isActive && !isRejected ? 'bg-[#C8A951] text-[#0D1B2A] animate-pulse-gold' : 'bg-slate-200 text-slate-400'}`}>
                            {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <span className="text-[10px] text-center text-slate-500 font-medium">{t(locale, `student.stepGuide.step${step}.title`)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Current Step Guide */}
                  {currentStep >= 0 && (
                    <div className="p-4 rounded-xl" style={{ backgroundColor: `${stepColors[currentStep]}08`, border: `1px solid ${stepColors[currentStep]}20` }}>
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: stepColors[currentStep] }} />
                        <div>
                          <h4 className="font-bold text-sm mb-1" style={{ color: stepColors[currentStep] }}>{t(locale, `student.stepGuide.step${currentStep}.title`)}</h4>
                          <p className="text-sm text-slate-600">{t(locale, `student.stepGuide.step${currentStep}.desc`)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {myProject.status === 'rejected' && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-red-700 mb-1">{t(locale, 'status.rejected')}</h4>
                          <p className="text-sm text-red-600">{myProject.evaluationNotes || (locale === 'ar' ? 'يمكنك التواصل مع الإدارة لمزيد من المعلومات' : 'You can contact the admin for more information')}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info & Financial Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Information */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <h3 className="text-lg font-bold text-[#1B3A6B] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}><FileText className="w-5 h-5" />{t(locale, 'student.projectInfo')}</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 font-bold">{t(locale, 'projectDetail.overview')}</span>
                      <p className="text-sm text-slate-700 mt-1 leading-relaxed">{myProject.description}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: t(locale, 'projectSubmit.problem'), value: myProject.problem },
                        { label: t(locale, 'projectSubmit.targetAudience'), value: myProject.targetAudience },
                        { label: t(locale, 'projectSubmit.addedValue'), value: myProject.addedValue },
                      ].map((item, i) => (
                        <div key={i}>
                          <span className="text-xs text-slate-400">{item.label}</span>
                          <p className="text-sm text-slate-700 font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial + Evaluation */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <h3 className="text-lg font-bold text-[#1B3A6B] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}><Banknote className="w-5 h-5" />{t(locale, 'student.financialInfo')}</h3>
                    <div className="space-y-3">
                      {[
                        { label: t(locale, 'projectSubmit.fundingRequired'), value: `${myProject.fundingRequired.toLocaleString()} د.ج`, bold: true, color: '#1B3A6B' },
                        { label: t(locale, 'projectSubmit.stage'), value: t(locale, `stages.${myProject.stage}`) },
                        { label: t(locale, 'projectSubmit.hasPartner'), value: myProject.hasPartner ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No') },
                        { label: t(locale, 'projectSubmit.teamSize'), value: String(myProject.teamSize) },
                        { label: t(locale, 'projectSubmit.legalFramework'), value: myProject.legalFramework },
                        { label: t(locale, 'projectSubmit.tradeName'), value: myProject.tradeName },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                          <span className="text-sm text-slate-500">{item.label}</span>
                          <span className={`text-sm font-bold ${item.bold ? 'text-lg' : ''}`} style={{ color: item.color || '#1B3A6B' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                    <h3 className="text-lg font-bold text-[#1B3A6B] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}><Award className="w-5 h-5" />{t(locale, 'student.evaluationInfo')}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">{t(locale, 'student.scoreLabel')}</span>
                        <span className={`text-2xl font-black ${myProject.score ? (myProject.score >= 80 ? 'text-green-600' : myProject.score >= 60 ? 'text-amber-600' : 'text-red-600') : 'text-slate-400'}`} style={{ fontFamily: 'var(--font-cairo)' }}>
                          {myProject.score ? `${myProject.score}/100` : t(locale, 'projectDetail.noScore')}
                        </span>
                      </div>
                      {myProject.score && (
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${myProject.score}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: myProject.score >= 80 ? '#27AE60' : myProject.score >= 60 ? '#F39C12' : '#E74C3C' }} />
                        </div>
                      )}
                      {myProject.evaluationNotes && (
                        <div className="mt-3 p-3 rounded-xl bg-[#C8A951]/5 border border-[#C8A951]/20">
                          <p className="text-xs font-bold text-[#1B3A6B] mb-1">{t(locale, 'student.adminNotes')}</p>
                          <p className="text-sm text-slate-600">{myProject.evaluationNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {myProject.timeline && myProject.timeline.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <h3 className="text-lg font-bold text-[#1B3A6B] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}><Clock className="w-5 h-5" />{t(locale, 'student.timelineInfo')}</h3>
                  <div className="space-y-4">
                    {myProject.timeline.map((event: any, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${i === myProject.timeline.length - 1 ? 'bg-[#C8A951] text-[#0D1B2A]' : 'bg-[#27AE60] text-white'}`}>
                            {i === myProject.timeline.length - 1 ? <CircleDot className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </div>
                          {i < myProject.timeline.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-1" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1B3A6B]">{locale === 'ar' ? event.event : event.eventEn}</p>
                          <p className="text-xs text-slate-400">{new Date(event.date).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: t(locale, 'stats.accepted'), value: editableStats.accepted, icon: Check, color: '#27AE60' },
                  { label: t(locale, 'stats.evaluating'), value: editableStats.evaluating, icon: ClipboardCheck, color: '#F39C12' },
                  { label: t(locale, 'stats.startups'), value: editableStats.startups, icon: Rocket, color: '#C8A951' },
                  { label: t(locale, 'stats.batches'), value: editableStats.trainedBatches, icon: GraduationCap, color: '#1B3A6B' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                    <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                    <div className="text-xl font-black" style={{ fontFamily: 'var(--font-cairo)', color: stat.color }}>{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== MY PROJECT TAB ========== */}
          {studentTab === 'my-project' && (
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              <div className="p-6" style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B3A6B)' }}>
                <div className="flex items-center gap-2 mb-2"><FieldBadge field={myProject.field} locale={locale} /><StatusBadge status={myProject.status} locale={locale} /></div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? myProject.projectName : myProject.projectNameEn}</h2>
                <p className="text-white/60 text-sm">{myProject.refNumber} • {myProject.tradeName}</p>
              </div>
              <div className="p-6 space-y-6">
                <div><h4 className="font-bold text-[#1B3A6B] mb-2">{t(locale, 'projectDetail.overview')}</h4><p className="text-slate-600">{myProject.description}</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">{[['problem', t(locale, 'projectSubmit.problem')], ['targetAudience', t(locale, 'projectSubmit.targetAudience')], ['addedValue', t(locale, 'projectSubmit.addedValue')]].map(([key, label]) => (<div key={key}><span className="text-xs text-slate-400">{label}</span><p className="text-sm font-medium text-slate-700">{(myProject as any)[key]}</p></div>))}</div>
                  <div className="bg-[#F5F7FA] rounded-xl p-4 space-y-2">{[['fundingRequired', t(locale, 'projectSubmit.fundingRequired'), `${myProject.fundingRequired.toLocaleString()} د.ج`], ['stage', t(locale, 'projectSubmit.stage'), t(locale, `stages.${myProject.stage}`)], ['teamSize', t(locale, 'projectSubmit.teamSize'), String(myProject.teamSize)], ['score', t(locale, 'admin.score'), myProject.score ? `${myProject.score}/100` : t(locale, 'projectDetail.noScore')]].map(([key, label, value]) => (<div key={key as string} className="flex justify-between"><span className="text-xs text-slate-500">{label}</span><span className="text-xs font-bold text-[#1B3A6B]">{value}</span></div>))}</div>
                </div>
                {myProject.evaluationNotes && <div className="p-4 rounded-xl bg-[#C8A951]/5 border border-[#C8A951]/20"><p className="text-sm font-bold text-[#1B3A6B] mb-1">{t(locale, 'admin.notes')}</p><p className="text-sm text-slate-600">{myProject.evaluationNotes}</p></div>}
              </div>
            </div>
          )}

          {/* ========== BMC TAB — Full Tool Embed ========== */}
          {studentTab === 'bmc' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'bmc.title')}</h2>
                    <p className="text-slate-500 text-sm mt-1">{t(locale, 'student.bmcToolDesc')}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href="/bmc-tool/index.html" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl bg-[#C8A951] text-[#0D1B2A] font-bold text-sm flex items-center gap-2 hover:bg-[#E4C97A] shadow-md transition-all">
                      <ExternalLink className="w-4 h-4" />{t(locale, 'student.openBmcTool')}
                    </a>
                  </div>
                </div>
              </div>

              {/* BMC Canvas Quick Edit */}
              <BMCTool locale={locale} projectId={myProject.id} />

              {/* Full BMC Tool iframe */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1B3A6B] flex items-center justify-center"><Target className="w-4 h-4 text-[#C8A951]" /></div>
                  <div>
                    <h3 className="font-bold text-[#1B3A6B] text-sm" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? 'أداة الدراسة المالية الكاملة' : 'Full Financial Study Tool'}</h3>
                    <p className="text-xs text-slate-400">{locale === 'ar' ? 'وفقاً للقرار الوزاري 1275' : 'Per Ministerial Decision 1275'}</p>
                  </div>
                </div>
                <iframe
                  src="/bmc-tool/index.html"
                  className="w-full border-0"
                  style={{ height: '900px' }}
                  title="BMC Financial Tool"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </div>
          )}

          {/* ========== MESSAGES TAB ========== */}
          {studentTab === 'messages' && (
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-200"><h3 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'student.messages')}</h3></div>
              <MessagingPanel locale={locale} userId={user?.id || 'student-001'} userRole="student" otherPartyName={t(locale, 'student.adminTeam')} />
            </div>
          )}

          {/* ========== GUIDE TAB ========== */}
          {studentTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'student.guide')}</h3>
              {[0, 1, 2, 3, 4].map((step) => {
                const Icon = stepIcons[step];
                const isDone = step < currentStep;
                const isActive = step === currentStep;
                return (
                  <div key={step} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${isDone ? 'border-green-200 opacity-80' : isActive ? 'border-[#C8A951]/30 shadow-md' : 'border-slate-100'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDone ? 'bg-[#27AE60] text-white' : isActive ? 'bg-[#C8A951] text-[#0D1B2A]' : 'bg-slate-100 text-slate-400'}`}>
                        {isDone ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, `student.stepGuide.step${step}.title`)}</h4>
                          {isActive && <span className="px-2 py-0.5 rounded-full bg-[#C8A951]/10 text-[#C8A951] text-[10px] font-bold">{locale === 'ar' ? 'الخطوة الحالية' : 'Current'}</span>}
                          {isDone && <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold">✓</span>}
                        </div>
                        <p className="text-sm text-slate-600">{t(locale, `student.stepGuide.step${step}.desc`)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========== PROFILE TAB ========== */}
          {studentTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-[#1B3A6B] flex items-center justify-center text-[#C8A951] font-black text-2xl" style={{ fontFamily: 'var(--font-cairo)' }}>{editName?.charAt(0) || 'S'}</div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{editName}</h3>
                    <p className="text-sm text-slate-500">{editEmail}</p>
                    <StatusBadge status={myProject.status} locale={locale} />
                  </div>
                </div>

                <h4 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}><Users className="w-4 h-4" />{t(locale, 'student.ownerInfo')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.name')}</label>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'student.phoneLabel')}</label>
                    <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" placeholder="05XXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.faculty')}</label>
                    <select value={editFaculty} onChange={(e) => setEditFaculty(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm bg-white">
                      <option value="">{t(locale, 'auth.faculty')}</option>
                      {(['eco', 'info', 'pol', 'sport'] as const).map((f) => (<option key={f} value={f}>{t(locale, `faculties.${f}`)}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.level')}</label>
                    <select value={editLevel} onChange={(e) => setEditLevel(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm bg-white">
                      <option value="">{t(locale, 'auth.level')}</option>
                      {(['l1', 'l2', 'l3', 'm1', 'm2', 'phd'] as const).map((l) => (<option key={l} value={l}>{t(locale, `levels.${l}`)}</option>))}
                    </select>
                  </div>
                </div>
                <button onClick={handleSaveProfile} className="mt-6 px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] transition-all flex items-center gap-2"><Check className="w-4 h-4" />{t(locale, 'common.save')}</button>
              </div>
            </div>
          )}

          {/* ========== SETTINGS TAB ========== */}
          {studentTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {/* Email Change */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <h3 className="text-lg font-bold text-[#1B3A6B] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}><Mail className="w-5 h-5" />{t(locale, 'student.changeEmail')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.email')}</label>
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" />
                  </div>
                  <button onClick={handleSaveProfile} className="px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] transition-all flex items-center gap-2"><Check className="w-4 h-4" />{t(locale, 'common.save')}</button>
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <h3 className="text-lg font-bold text-[#1B3A6B] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}><Shield className="w-5 h-5" />{t(locale, 'student.changePassword')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'student.currentPassword')}</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'student.newPassword')}</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'student.confirmPassword')}</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" placeholder="••••••••" />
                  </div>
                  <button onClick={handleChangePassword} className="px-6 py-3 rounded-xl bg-[#2E7D32] text-white font-bold hover:bg-[#1B5E20] transition-all flex items-center gap-2"><Shield className="w-4 h-4" />{t(locale, 'student.changePassword')}</button>
                </div>
              </div>

              {/* Profile Info Edit */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <h3 className="text-lg font-bold text-[#1B3A6B] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-cairo)' }}><Users className="w-5 h-5" />{t(locale, 'student.profile')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.name')}</label>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'student.phoneLabel')}</label>
                    <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.faculty')}</label>
                    <select value={editFaculty} onChange={(e) => setEditFaculty(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm bg-white">
                      <option value="">{t(locale, 'auth.faculty')}</option>
                      {(['eco', 'info', 'pol', 'sport'] as const).map((f) => (<option key={f} value={f}>{t(locale, `faculties.${f}`)}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'auth.level')}</label>
                    <select value={editLevel} onChange={(e) => setEditLevel(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm bg-white">
                      <option value="">{t(locale, 'auth.level')}</option>
                      {(['l1', 'l2', 'l3', 'm1', 'm2', 'phd'] as const).map((l) => (<option key={l} value={l}>{t(locale, `levels.${l}`)}</option>))}
                    </select>
                  </div>
                </div>
                <button onClick={handleSaveProfile} className="mt-6 px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] transition-all flex items-center gap-2"><Check className="w-4 h-4" />{t(locale, 'common.save')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================

function AdminDashboard({ locale }: { locale: Locale }) {
  const { adminTab, setAdminTab, sidebarCollapsed, setSidebarCollapsed, editableStats, setEditableStats, messages, setSelectedProjectId } = useAppStore();
  const [evalModal, setEvalModal] = useState<string | null>(null);
  const [evalScore, setEvalScore] = useState('');
  const [evalNotes, setEvalNotes] = useState('');
  const dir = localeDirection[locale];

  const unreadAdmin = messages.filter((m: Message) => m.to === 'admin-001' && !m.read).length;

  const tabs = [
    { key: 'overview', label: t(locale, 'admin.overview'), icon: BarChart3 },
    { key: 'projects', label: t(locale, 'admin.projects'), icon: FileText },
    { key: 'users', label: t(locale, 'admin.users'), icon: Users },
    { key: 'landing', label: t(locale, 'admin.landing'), icon: ImageIcon },
    { key: 'messages', label: t(locale, 'admin.messages'), icon: MessageCircle, badge: unreadAdmin },
    { key: 'events', label: t(locale, 'admin.events'), icon: Activity },
    { key: 'stats', label: t(locale, 'admin.editStats'), icon: Settings },
  ];

  const handleProjectAction = (projectId: string, action: string) => {
    toast.success(`${action} — ${projectId}`);
    setEvalModal(null);
  };

  const statCards = [
    { label: t(locale, 'admin.totalUsers'), value: 847, icon: Users, color: '#1B3A6B', change: '+12%' },
    { label: t(locale, 'admin.totalProjects'), value: editableStats.totalSubmitted, icon: FileText, color: '#C8A951', change: '+23%' },
    { label: t(locale, 'admin.pendingReview'), value: editableStats.evaluating, icon: ClipboardCheck, color: '#F39C12', change: '+8%' },
    { label: t(locale, 'admin.acceptedProjects'), value: editableStats.accepted, icon: Check, color: '#27AE60', change: '+15%' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" style={{ direction: dir }}>
      <Sidebar items={tabs} activeTab={adminTab} onTabChange={setAdminTab} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} locale={locale} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1B3A6B] py-5 px-6">
          <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-[#C8A951] flex items-center justify-center"><Shield className="w-6 h-6 text-[#0D1B2A]" /></div><div><h1 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.title')}</h1><p className="text-[#E4C97A] text-xs">INC ALG 3</p></div></div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-1 p-2 overflow-x-auto bg-white border-b border-slate-200">{tabs.map((tab) => (<button key={tab.key} onClick={() => setAdminTab(tab.key)} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${adminTab === tab.key ? 'bg-[#0D1B2A] text-white' : 'text-slate-500'}`}><tab.icon className="w-3.5 h-3.5" />{tab.label}</button>))}</div>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Overview */}
          {adminTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (<motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                  <div className="flex items-center justify-between mb-3"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}12` }}><card.icon className="w-6 h-6" style={{ color: card.color }} /></div><span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">{card.change}</span></div>
                  <div className="text-2xl font-black" style={{ fontFamily: 'var(--font-cairo)', color: card.color }}>{card.value.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">{card.label}</div>
                </motion.div>))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <h3 className="font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? 'المشاريع حسب الحالة' : 'Projects by Status'}</h3>
                  <div className="space-y-3">{[
                    { label: t(locale, 'status.review'), value: editableStats.evaluating, total: editableStats.totalSubmitted, color: '#F39C12' },
                    { label: t(locale, 'status.accepted'), value: editableStats.accepted, total: editableStats.totalSubmitted, color: '#27AE60' },
                    { label: t(locale, 'status.incubated'), value: editableStats.startups, total: editableStats.totalSubmitted, color: '#2E7D32' },
                    { label: t(locale, 'status.rejected'), value: 89, total: editableStats.totalSubmitted, color: '#C0392B' },
                  ].map((item, i) => (<div key={i}><div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{item.label}</span><span className="font-bold" style={{ color: item.color }}>{item.value}</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / item.total) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: item.color }} /></div></div>))}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <h3 className="font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? 'المشاريع حسب المجال' : 'Projects by Field'}</h3>
                  <div className="grid grid-cols-2 gap-3">{[['ict', 420, '#1B3A6B'], ['digital', 380, '#2952A3'], ['energy', 290, '#F39C12'], ['ecommerce', 310, '#C8A951'], ['minerals', 180, '#2E7D32'], ['industry', 220, '#E67E22']].map(([field, count, color], i) => (<div key={i} className="bg-slate-50 rounded-xl p-3 text-center"><div className="text-xl font-black" style={{ fontFamily: 'var(--font-cairo)', color }}>{count}</div><div className="text-xs text-slate-500">{t(locale, `fields.${field}`)}</div></div>))}</div>
                </div>
              </div>
            </div>
          )}

          {/* Projects */}
          {adminTab === 'projects' && (
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5F7FA]"><tr><th className="px-4 py-3 text-start text-xs font-bold text-slate-500">#</th><th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'projectSubmit.projectName')}</th><th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'projectSubmit.ownerName')}</th><th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'projectSubmit.field')}</th><th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'common.status')}</th><th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'admin.score')}</th><th className="px-4 py-3 text-start text-xs font-bold text-slate-500">{t(locale, 'common.actions')}</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">{MOCK_PROJECTS.map((project) => (<tr key={project.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setSelectedProjectId(project.id); }}>
                    <td className="px-4 py-3 text-sm font-mono text-slate-400">{project.refNumber}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#1B3A6B]">{locale === 'ar' ? project.projectName : project.projectNameEn}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{project.ownerName}</td>
                    <td className="px-4 py-3"><FieldBadge field={project.field} locale={locale} /></td>
                    <td className="px-4 py-3"><StatusBadge status={project.status} locale={locale} /></td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: project.score ? (project.score >= 80 ? '#27AE60' : '#F39C12') : '#9CA3AF' }}>{project.score || '—'}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button onClick={() => setEvalModal(project.id)} className="p-1.5 rounded-lg bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B]" title={t(locale, 'admin.evaluate')}><Edit className="w-3.5 h-3.5" /></button>
                        {project.status === 'review' && (<><button onClick={() => handleProjectAction(project.id, 'accept')} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600"><Check className="w-3.5 h-3.5" /></button><button onClick={() => handleProjectAction(project.id, 'reject')} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"><X className="w-3.5 h-3.5" /></button></>)}
                        {project.status === 'accepted' && <button onClick={() => handleProjectAction(project.id, 'incubate')} className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600"><Rocket className="w-3.5 h-3.5" /></button>}
                      </div>
                    </td>
                  </tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users */}
          {adminTab === 'users' && (<div className="space-y-4"><h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.users')}</h3>{[{ name: 'أحمد بن علي', email: 'ahmed.benali@univ-alger3.dz', role: 'student', faculty: 'eco', projects: 2 }, { name: 'فاطمة الزهراء مراد', email: 'fatima.mourad@univ-alger3.dz', role: 'student', faculty: 'eco', projects: 1 }, { name: 'سارة حداد', email: 'sara.haddad@univ-alger3.dz', role: 'student', faculty: 'info', projects: 1 }, { name: 'د. علي بوعشة محمد', email: 'a.bouacha@univ-alger3.dz', role: 'admin', faculty: '', projects: 0 }].map((user, i) => (<div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex items-center gap-4"><div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white" style={{ backgroundColor: user.role === 'admin' ? '#C8A951' : '#1B3A6B', fontFamily: 'var(--font-cairo)' }}>{user.name.charAt(0)}</div><div className="flex-1"><h4 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{user.name}</h4><p className="text-sm text-slate-500">{user.email}</p></div><span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-[#C8A951]/10 text-[#C8A951]' : 'bg-[#1B3A6B]/10 text-[#1B3A6B]'}`}>{user.role === 'admin' ? t(locale, 'nav.admin') : t(locale, 'auth.registerBtn')}</span></div>))}</div>)}

          {/* Landing Page Management */}
          {adminTab === 'landing' && (<div className="space-y-6"><h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.landingPage')}</h3>{[{ section: locale === 'ar' ? 'القسم الرئيسي (Hero)' : 'Hero Section', icon: Sparkles }, { section: locale === 'ar' ? 'الإحصائيات' : 'Statistics', icon: BarChart3 }, { section: locale === 'ar' ? 'كيف تعمل الحاضنة' : 'How It Works', icon: Lightbulb }, { section: locale === 'ar' ? 'الخدمات' : 'Services', icon: Zap }, { section: locale === 'ar' ? 'عن الحاضنة' : 'About', icon: Building2 }, { section: locale === 'ar' ? 'الأحداث' : 'Events', icon: Activity }].map((item, i) => (<div key={i} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#1B3A6B]/5 flex items-center justify-center"><item.icon className="w-5 h-5 text-[#1B3A6B]" /></div><h4 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{item.section}</h4></div><div className="flex gap-2"><button className="p-2 rounded-lg bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B]"><Edit className="w-4 h-4" /></button><button className="p-2 rounded-lg bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B]"><ImageIcon className="w-4 h-4" /></button><button className="p-2 rounded-lg bg-[#1B3A6B]/5 hover:bg-[#1B3A6B]/10 text-[#1B3A6B]"><Video className="w-4 h-4" /></button></div></div><div className="space-y-3"><div><label className="block text-xs font-bold text-slate-500 mb-1">{t(locale, 'admin.sectionTitle')} (AR)</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" defaultValue={item.section} /></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-bold text-slate-500 mb-1">{t(locale, 'admin.sectionTitle')} (EN)</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" /></div><div><label className="block text-xs font-bold text-slate-500 mb-1">{t(locale, 'admin.sectionTitle')} (FR)</label><input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" /></div></div></div></div>))}<button className="px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] flex items-center gap-2"><Check className="w-4 h-4" />{t(locale, 'common.save')}</button></div>)}

          {/* Messages */}
          {adminTab === 'messages' && (<div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"><div className="p-4 border-b border-slate-200"><h3 className="font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.messages')}</h3></div><MessagingPanel locale={locale} userId="admin-001" userRole="admin" otherPartyName={locale === 'ar' ? 'أحمد بن علي (طالب)' : 'Ahmed Ben Ali (Student)'} /></div>)}

          {/* Events */}
          {adminTab === 'events' && (<div className="space-y-4"><div className="flex items-center justify-between"><h3 className="text-lg font-bold text-[#1B3A6B]" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.events')}</h3><button className="px-4 py-2 rounded-xl bg-[#1B3A6B] text-white text-sm font-bold flex items-center gap-2"><Plus className="w-4 h-4" />{locale === 'ar' ? 'إضافة حدث' : 'Add Event'}</button></div>{MOCK_EVENTS.map((event) => (<div key={event.id} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100"><div className="flex items-start justify-between"><div><h4 className="font-bold text-[#1B3A6B] mb-1" style={{ fontFamily: 'var(--font-cairo)' }}>{locale === 'ar' ? event.titleAr : event.titleEn}</h4><p className="text-sm text-slate-500">{event.location} • {new Date(event.date).toLocaleDateString()}</p></div><div className="flex gap-1"><button className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500"><Edit className="w-3.5 h-3.5" /></button><button className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div></div></div>))}</div>)}

          {/* Edit Stats */}
          {adminTab === 'stats' && (
            <div className="space-y-6">
              <div><h3 className="text-lg font-bold text-[#1B3A6B] mb-1" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.editStats')}</h3><p className="text-sm text-slate-500">{t(locale, 'admin.statsDesc')}</p></div>
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'totalSubmitted', label: t(locale, 'stats.projectsRegistered') },
                    { key: 'accepted', label: t(locale, 'stats.accepted') },
                    { key: 'evaluating', label: t(locale, 'stats.evaluating') },
                    { key: 'startups', label: t(locale, 'stats.startups') },
                    { key: 'trainedBatches', label: t(locale, 'stats.batches') },
                    { key: 'incubatedProjects', label: t(locale, 'stats.incubated') },
                    { key: 'successRate', label: t(locale, 'stats.successRate') },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{item.label}</label>
                      <input type="number" value={(editableStats as any)[item.key]} onChange={(e) => setEditableStats({ ...editableStats, [item.key]: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm" />
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.success(locale === 'ar' ? 'تم حفظ الإحصائيات' : 'Stats saved')} className="mt-6 px-6 py-3 rounded-xl bg-[#1B3A6B] text-white font-bold hover:bg-[#2952A3] flex items-center gap-2"><Check className="w-4 h-4" />{t(locale, 'common.save')}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evaluate Modal */}
      <AnimatePresence>
        {evalModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEvalModal(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-[#1B3A6B] mb-4" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'admin.evaluate')}</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'admin.score')} (0-100)</label><input type="number" min={0} max={100} value={evalScore} onChange={(e) => setEvalScore(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">{t(locale, 'admin.notes')}</label><textarea value={evalNotes} onChange={(e) => setEvalNotes(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#1B3A6B] outline-none resize-none" /></div>
                <div className="grid grid-cols-2 gap-3">
                  {[['accept', 'bg-green-600 hover:bg-green-700', Check], ['revision', 'bg-amber-600 hover:bg-amber-700', RefreshCw], ['incubate', 'bg-emerald-600 hover:bg-emerald-700', Rocket], ['reject', 'bg-red-600 hover:bg-red-700', X]].map(([action, color, Icon]) => (
                    <button key={action} onClick={() => handleProjectAction(evalModal!, action)} className={`px-4 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all ${color}`}>
                      {React.createElement(Icon as any, { className: 'w-4 h-4' })}{t(locale, `admin.${action}`)}
                    </button>
                  ))}
                </div>
                <button onClick={() => setEvalModal(null)} className="w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold mt-2">{t(locale, 'common.cancel')}</button>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12" style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B3A6B)' }}><div className="text-center"><div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-[#C8A951] flex items-center justify-center"><Building2 className="w-10 h-10 text-[#0D1B2A]" /></div><h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-cairo)' }}>{t(locale, 'about.title')}</h1><p className="text-[#E4C97A] text-lg">{t(locale, 'about.subtitle')}</p></div></div>
          <div className="p-8 sm:p-12 space-y-6"><p className="text-slate-600 leading-relaxed text-lg">{t(locale, 'about.p1')}</p><p className="text-slate-600 leading-relaxed text-lg">{t(locale, 'about.p2')}</p><p className="text-slate-600 leading-relaxed text-lg">{t(locale, 'about.p3')}</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">{[{ icon: Users, text: t(locale, 'about.director'), color: '#1B3A6B' }, { icon: Building2, text: t(locale, 'about.established'), color: '#C8A951' }, { icon: Award, text: t(locale, 'about.official'), color: '#2E7D32' }].map((item, i) => (<div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50"><div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}><item.icon className="w-5 h-5" style={{ color: item.color }} /></div><span className="font-medium text-slate-700 text-sm">{item.text}</span></div>))}</div></div>
        </motion.div>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function HomePage() {
  const { currentView, setCurrentView, user, setUser, locale } = useAppStore();
  const dir = localeDirection[locale];

  useEffect(() => { document.documentElement.dir = dir; document.documentElement.lang = locale; }, [locale, dir]);

  const handleLogout = () => { setUser(null); setCurrentView('landing'); toast.success(locale === 'ar' ? 'تم تسجيل الخروج' : 'Logged out'); };

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <LandingPage locale={locale} onNavigate={setCurrentView} />;
      case 'login': case 'register': return <AuthPage locale={locale} onNavigate={setCurrentView} onLogin={setUser} />;
      case 'projects': return <ProjectsPage locale={locale} onNavigate={setCurrentView} />;
      case 'submit-project': return user ? <ProjectSubmitPage locale={locale} onNavigate={setCurrentView} user={user} /> : <AuthPage locale={locale} onNavigate={setCurrentView} onLogin={setUser} />;
      case 'student-dashboard': return user ? <StudentDashboard locale={locale} user={user} onNavigate={setCurrentView} /> : <AuthPage locale={locale} onNavigate={setCurrentView} onLogin={setUser} />;
      case 'admin-dashboard': return user?.role === 'admin' ? <AdminDashboard locale={locale} /> : <AuthPage locale={locale} onNavigate={setCurrentView} onLogin={setUser} />;
      case 'project-detail': return <ProjectDetail locale={locale} onNavigate={setCurrentView} />;
      case 'about': return <AboutPage locale={locale} />;
      default: return <LandingPage locale={locale} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ direction: dir }}>
      <Header locale={locale} currentView={currentView} onNavigate={setCurrentView} user={user} onLogout={handleLogout} />
      <main className="flex-1">
        <AnimatePresence mode="wait"><motion.div key={currentView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{renderView()}</motion.div></AnimatePresence>
      </main>
    </div>
  );
}
