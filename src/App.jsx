import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Database,
  Download,
  Gauge,
  HelpCircle,
  Info,
  LayoutDashboard,
  LineChart,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  WalletCards,
  X,
} from "lucide-react";

const STORAGE_KEY = "family-supermarket-dark-metrics-app-v2";

const baseModel = {
  revenue: 25_000_000_000,
  avgCheck: 850,
  margin: 0.18,
  activeCards: 420_000,
  frequency: 2.1,
  onlineShare: 0.08,
  cardTxnShare: 0.38,
  nps: 44,
  marketingBudget: 180_000_000,
  revenueGrowthTarget: 0.15,
  plannedRomi: 2.5,
  targetAvgCheck: 920,
  targetFrequency: 2.5,
  targetOnlineShare: 0.12,
  targetCardTxnShare: 0.55,
  targetActiveCards: 500_000,
  targetMargin: 0.18,
  targetNps: 50,
  targetPickupShare: 0.45,
  currentNsmRevenue: 4_900_000_000,
  targetNsmGrowth: 0.3,
};

const initialBudget = [
  {
    channel: "Яндекс.Директ / поиск / геореклама",
    plan: 45_000_000,
    fact: 38_400_000,
    planRomi: 4.5,
    factRomi: 4.2,
    assistedRevenue: 184_000_000,
    incrProfit: 72_000_000,
    targetMetric: "Новые чеки",
    metricFact: 92,
    metricPlan: 100,
    decision: "Удерживать",
  },
  {
    channel: "SEO и контент",
    plan: 18_000_000,
    fact: 11_700_000,
    planRomi: 5,
    factRomi: 5.4,
    assistedRevenue: 82_000_000,
    incrProfit: 37_000_000,
    targetMetric: "Органический спрос",
    metricFact: 108,
    metricPlan: 100,
    decision: "Высокий приоритет",
  },
  {
    channel: "CRM, email, push, реактивация",
    plan: 30_600_000,
    fact: 26_900_000,
    planRomi: 2.5,
    factRomi: 3.1,
    assistedRevenue: 136_000_000,
    incrProfit: 61_000_000,
    targetMetric: "Частота покупок",
    metricFact: 96,
    metricPlan: 100,
    decision: "Ускорить",
  },
  {
    channel: "Приложение и возврат пользователей",
    plan: 18_000_000,
    fact: 14_600_000,
    planRomi: 2.5,
    factRomi: 2.8,
    assistedRevenue: 73_000_000,
    incrProfit: 32_000_000,
    targetMetric: "Онлайн повтор",
    metricFact: 88,
    metricPlan: 100,
    decision: "Рост онлайн",
  },
  {
    channel: "VK / соцсети / таргет",
    plan: 18_000_000,
    fact: 17_200_000,
    planRomi: 2.2,
    factRomi: 1.7,
    assistedRevenue: 51_000_000,
    incrProfit: 20_000_000,
    targetMetric: "Охват и трафик",
    metricFact: 84,
    metricPlan: 100,
    decision: "Оптимизировать",
  },
  {
    channel: "Трейд маркетинг и POSM",
    plan: 21_600_000,
    fact: 22_800_000,
    planRomi: 2,
    factRomi: 1.9,
    assistedRevenue: 63_000_000,
    incrProfit: 25_000_000,
    targetMetric: "Средний чек",
    metricFact: 94,
    metricPlan: 100,
    decision: "Контроль маржи",
  },
  {
    channel: "Бонусный фонд и промо лояльности",
    plan: 18_000_000,
    fact: 15_500_000,
    planRomi: 2.5,
    factRomi: 2.6,
    assistedRevenue: 77_000_000,
    incrProfit: 31_000_000,
    targetMetric: "Активные карты",
    metricFact: 98,
    metricPlan: 100,
    decision: "Миссии и купоны",
  },
  {
    channel: "Печатные каталоги",
    plan: 7_200_000,
    fact: 6_800_000,
    planRomi: 0.6,
    factRomi: 0.5,
    assistedRevenue: 11_000_000,
    incrProfit: 3_600_000,
    targetMetric: "Локальный трафик",
    metricFact: 61,
    metricPlan: 100,
    decision: "Сократить",
  },
  {
    channel: "Аналитика, исследования, A/B тесты",
    plan: 3_600_000,
    fact: 2_900_000,
    planRomi: 1,
    factRomi: 1.4,
    assistedRevenue: 9_000_000,
    incrProfit: 4_100_000,
    targetMetric: "Качество решений",
    metricFact: 103,
    metricPlan: 100,
    decision: "Продолжать",
  },
];

function makeInitialWeeks() {
  const rows = [];
  const start = new Date("2026-01-05T00:00:00");
  for (let i = 1; i <= 52; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + (i - 1) * 7);
    const active = i <= 12;
    rows.push({
      week: i,
      date: date.toISOString().slice(0, 10),
      revenue: active ? 480_000_000 + i * 5_000_000 : null,
      avgCheck: active ? 847 + i * 3 : null,
      frequency: active ? +(2.08 + i * 0.02).toFixed(2) : null,
      onlineShare: active ? +(0.0786 + i * 0.0014).toFixed(4) : null,
      cardShare: active ? +(0.374 + i * 0.006).toFixed(3) : null,
      activeCards: active ? 417_000 + i * 3_000 : null,
      nsmRevenue: active ? 92_000_000 + i * 3_000_000 : null,
      margin: active ? 0.18 : null,
      incrProfit: active ? 4_600_000 + i * 400_000 : null,
      marketingSpend: active ? 3_460_000 : null,
      nps: active ? +(43.7 + i * 0.3).toFixed(1) : null,
      repeatOnline30: active ? +(0.295 + i * 0.005).toFixed(3) : null,
      pickupShare: active ? +(0.316 + i * 0.004).toFixed(3) : null,
    });
  }
  return rows;
}

const inputFields = [
  ["revenue", "Текущая годовая выручка", "₽", "База прошлого года"],
  ["avgCheck", "Средний чек сейчас", "₽", "Средний чек по сети"],
  ["margin", "Средняя маржинальность", "%", "Валовая маржа"],
  ["activeCards", "Активные карты", "клиенты", "Активные участники программы"],
  ["frequency", "Частота сейчас", "покупок / мес.", "Активный клиент"],
  ["onlineShare", "Доля онлайн продаж", "%", "Доставка + самовывоз"],
  ["cardTxnShare", "Доля транзакций по карте", "%", "Идентифицированные чеки"],
  ["nps", "NPS", "баллы", "Текущий уровень"],
  ["marketingBudget", "Маркетинговый бюджет", "₽", "Годовой бюджет"],
  ["revenueGrowthTarget", "Целевой рост выручки", "%", "Задача на следующий год"],
  ["plannedRomi", "Плановый ROMI", "коэф.", "Ориентир 250%"],
];

const targetFields = [
  ["targetAvgCheck", "Целевой средний чек", "₽"],
  ["targetFrequency", "Целевая частота", "покупок / мес."],
  ["targetOnlineShare", "Целевая доля онлайн", "%"],
  ["targetCardTxnShare", "Целевая доля чеков по карте", "%"],
  ["targetActiveCards", "Целевые активные карты", "клиенты"],
  ["targetMargin", "Целевая маржинальность", "%"],
  ["targetNps", "Целевой NPS", "баллы"],
  ["targetPickupShare", "Целевая доля самовывоза", "%"],
  ["targetNsmGrowth", "Целевой рост NSM", "%"],
];

const weekInputFields = [
  ["week", "Неделя", "number"],
  ["date", "Дата начала", "date"],
  ["revenue", "Выручка факт", "number"],
  ["avgCheck", "Средний чек", "number"],
  ["frequency", "Частота 30 дней", "number"],
  ["onlineShare", "Онлайн доля", "number"],
  ["cardShare", "Доля чеков по карте", "number"],
  ["activeCards", "Активные карты", "number"],
  ["nsmRevenue", "NSM выручка факт", "number"],
  ["margin", "Маржинальность", "number"],
  ["incrProfit", "Инкр. валовая прибыль кампаний", "number"],
  ["marketingSpend", "Расход маркетинга", "number"],
  ["nps", "NPS", "number"],
  ["repeatOnline30", "Повтор онлайн заказа 30 дней", "number"],
  ["pickupShare", "Доля самовывоза", "number"],
];

const palette = ["#8b5cf6", "#22d3ee", "#34d399", "#f59e0b", "#fb7185", "#60a5fa", "#a3e635", "#f472b6", "#c084fc"];

function fmtMoney(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString("ru-RU", { maximumFractionDigits: digits })} млрд ₽`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: digits })} млн ₽`;
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function fmtNumber(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number(value).toLocaleString("ru-RU", { maximumFractionDigits: digits });
}

function fmtPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${(value * 100).toLocaleString("ru-RU", { maximumFractionDigits: digits })}%`;
}

function sanitizeNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function statusByRatio(ratio) {
  if (ratio === null || ratio === undefined || Number.isNaN(ratio)) return { label: "нет данных", tone: "neutral" };
  if (ratio >= 1) return { label: "норма", tone: "good" };
  if (ratio >= 0.9) return { label: "риск", tone: "warn" };
  return { label: "отставание", tone: "bad" };
}

function sum(rows, key, untilWeek) {
  return rows
    .filter((r) => r.week <= untilWeek && r[key] !== null && r[key] !== undefined)
    .reduce((acc, r) => acc + Number(r[key] || 0), 0);
}

function glassTone(tone) {
  if (tone === "good") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (tone === "warn") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  if (tone === "bad") return "border-rose-400/30 bg-rose-400/10 text-rose-200";
  return "border-white/10 bg-white/5 text-white/60";
}

function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} className="max-h-[86vh] w-full max-w-2xl overflow-auto rounded-[2rem] border border-white/15 bg-slate-950/90 p-6 text-white shadow-[0_40px_120px_rgba(0,0,0,.55)] backdrop-blur-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20"><X size={18} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/15 bg-slate-950/90 p-3 text-xs text-white shadow-2xl backdrop-blur-xl">
      {label !== undefined && <div className="mb-2 font-semibold text-white/90">{label}</div>}
      <div className="space-y-1">
        {payload.map((p, idx) => (
          <div key={`${p.dataKey}-${idx}`} className="flex items-center justify-between gap-5 text-white/70">
            <span>{p.name || p.dataKey}</span>
            <span className="font-medium text-white">{formatter ? formatter(p.value, p.name, p) : typeof p.value === "number" && Math.abs(p.value) > 10000 ? fmtMoney(p.value) : fmtNumber(p.value, 2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppShell({ children, activeTab, setActiveTab }) {
  const tabs = [
    ["dashboard", "Дашборд", LayoutDashboard],
    ["budget", "Бюджет", WalletCards],
    ["calculator", "Калькулятор", Gauge],
    ["data", "Данные", Database],
    ["settings", "Интеграции", Settings2],
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#030711] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute right-[-10rem] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute bottom-[-16rem] left-[25%] h-[38rem] w-[38rem] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-30 rounded-[2rem] border border-white/15 bg-white/[0.07] px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,.3)] backdrop-blur-2xl">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg shadow-violet-950/40 backdrop-blur-xl">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                  Семейный Супермаркет <span className="hidden sm:inline">• growth control room</span>
                </div>
                <h1 className="text-lg font-semibold tracking-tight sm:text-2xl">Калькулятор метрик и управленческий дашборд</h1>
              </div>
            </div>
            <nav className="hidden rounded-2xl border border-white/10 bg-black/20 p-1 md:flex">
              {tabs.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${activeTab === id ? "bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,.12)]" : "text-white/55 hover:bg-white/10 hover:text-white"}`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[1.75rem] border border-white/15 bg-slate-950/75 p-2 shadow-2xl backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`rounded-2xl px-2 py-2 text-[11px] ${activeTab === id ? "bg-white text-slate-950" : "text-white/50"}`}>
              <Icon className="mx-auto mb-1" size={18} />{label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.065] p-5 shadow-[0_24px_80px_rgba(0,0,0,.26)] backdrop-blur-2xl ${className}`}>
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle, right }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        {eyebrow && <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">{eyebrow}</div>}
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function KpiCard({ title, value, plan, ratio, hint, icon: Icon }) {
  const status = statusByRatio(ratio);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[1.7rem] border border-white/12 bg-white/[0.075] p-4 shadow-sm backdrop-blur-xl">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-white/10 text-white/80"><Icon size={19} /></div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${glassTone(status.tone)}`}>{status.label}</span>
      </div>
      <div className="mt-4 text-sm text-white/45">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs text-white/45">
        {ratio >= 1 ? <ArrowUpRight size={15} className="text-emerald-300" /> : <ArrowDownRight size={15} className={status.tone === "bad" ? "text-rose-300" : "text-amber-300"} />}
        План: {plan} • выполнение {fmtPercent(ratio, 1)}
      </div>
      {hint && <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/45">{hint}</div>}
    </motion.div>
  );
}

function ProgressBar({ value }) {
  const status = statusByRatio(value);
  const width = Math.max(0, Math.min(110, value * 100));
  const cls = status.tone === "good" ? "bg-emerald-300" : status.tone === "warn" ? "bg-amber-300" : "bg-rose-300";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full ${cls}`} style={{ width: `${width}%` }} />
    </div>
  );
}

function AnnualTargetCard({ title, target, fact, expected, type = "money", hint }) {
  const completion = target ? fact / target : 0;
  const tempoDelta = expected ? fact / expected - 1 : 0;
  const isAhead = tempoDelta >= 0;
  const status = isAhead ? "good" : Math.abs(tempoDelta) <= 0.05 ? "warn" : "bad";
  const format = type === "percent" ? fmtPercent : type === "number" ? fmtNumber : fmtMoney;

  return (
    <div className="relative overflow-hidden rounded-[1.7rem] border border-white/12 bg-white/[0.065] p-4 backdrop-blur-xl">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-white/45">{title}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-white">{format(target)}</div>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${glassTone(status)}`}>
          {isAhead ? "+" : ""}{fmtPercent(tempoDelta, 1)}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-white/45">
          <span>Факт YTD</span>
          <span className="font-medium text-white/75">{format(fact)}</span>
        </div>
        <div className="flex justify-between text-xs text-white/45">
          <span>Темп к неделе</span>
          <span className="font-medium text-white/75">{format(expected)}</span>
        </div>
        <ProgressBar value={completion} />
        <div className="flex justify-between text-xs text-white/40">
          <span>Выполнение годовой цели</span>
          <span>{fmtPercent(completion, 1)}</span>
        </div>
      </div>
      {hint && <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/45">{hint}</div>}
    </div>
  );
}

function Dashboard({ model, weeks, budget, selectedWeek, setSelectedWeek, openBudget }) {
  const targetRevenue = model.revenue * (1 + model.revenueGrowthTarget);
  const targetNsm = model.currentNsmRevenue * (1 + model.targetNsmGrowth);
  const week = weeks.find((r) => r.week === selectedWeek) || weeks[0];
  const revenueYtd = sum(weeks, "revenue", selectedWeek);
  const onlineYtd = weeks.filter((r) => r.week <= selectedWeek).reduce((a, r) => a + (r.revenue || 0) * (r.onlineShare || 0), 0);
  const nsmYtd = sum(weeks, "nsmRevenue", selectedWeek);
  const spendYtd = sum(weeks, "marketingSpend", selectedWeek);
  const profitYtd = sum(weeks, "incrProfit", selectedWeek);
  const romi = spendYtd ? profitYtd / spendYtd : null;
  const chartRows = weeks.map((r) => ({
    week: r.week,
    revenue: r.revenue,
    plan: targetRevenue / 52,
    revenueYtd: sum(weeks, "revenue", r.week),
    planYtd: (targetRevenue / 52) * r.week,
    online: r.revenue && r.onlineShare ? r.revenue * r.onlineShare : null,
    nsm: r.nsmRevenue,
  }));
  const totalBudgetFact = budget.reduce((a, b) => a + (b.fact || 0), 0);
  const totalBudgetPlan = budget.reduce((a, b) => a + (b.plan || 0), 0);
  const totalAssistedRevenue = budget.reduce((a, b) => a + (b.assistedRevenue || 0), 0);
  const totalBudgetProfit = budget.reduce((a, b) => a + (b.incrProfit || 0), 0);
  const budgetRomi = totalBudgetFact ? totalBudgetProfit / totalBudgetFact : 0;
  const topChannels = [...budget].sort((a, b) => (b.incrProfit || 0) - (a.incrProfit || 0)).slice(0, 5);

  const planRows = [
    { metric: "Выручка YTD", fact: revenueYtd, plan: (targetRevenue / 52) * selectedWeek, action: "Проверить чек, частоту и онлайн" },
    { metric: "Средний чек", fact: week.avgCheck, plan: model.targetAvgCheck, action: "Пороговые наборы и бонусы" },
    { metric: "Частота", fact: week.frequency, plan: model.targetFrequency, action: "CRM-миссии и реактивация" },
    { metric: "Онлайн доля", fact: week.onlineShare, plan: model.targetOnlineShare, action: "Приложение, самовывоз, повтор" },
    { metric: "Карта", fact: week.cardShare, plan: model.targetCardTxnShare, action: "Карта в приложении и на кассе" },
    { metric: "NSM YTD", fact: nsmYtd, plan: (targetNsm / 52) * selectedWeek, action: "Регулярные покупатели 3+" },
    { metric: "ROMI", fact: romi, plan: model.plannedRomi, action: "Перераспределить бюджет" },
    { metric: "NPS", fact: week.nps, plan: model.targetNps, action: "Разбор причин негатива" },
    { metric: "Маржинальность", fact: week.margin, plan: model.targetMargin, action: "Защитить валовую маржу" },
    { metric: "Повтор онлайн", fact: week.repeatOnline30, plan: 0.4, action: "Воронка 2 и 3 заказа" },
    { metric: "Самовывоз", fact: week.pickupShare, plan: model.targetPickupShare, action: "Развивать самовывоз" },
  ];
  const kpiIndex = planRows.filter((r) => r.fact !== null && r.fact !== undefined).reduce((a, r) => a + Math.min((r.fact || 0) / (r.plan || 1), 1.15), 0) / planRows.filter((r) => r.fact !== null && r.fact !== undefined).length;

  return (
    <div className="grid gap-5 pb-24 md:pb-8">
      <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <Card className="min-h-[500px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80"><Activity size={14} /> Неделя {selectedWeek} • {week.date}</div>
              <h2 className="max-w-2xl bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl">Growth Control Room</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">Управление ростом до {fmtMoney(targetRevenue, 1)}. Модель связывает выручку, NSM, маркетинговый бюджет, ROMI, активные карты, частоту, онлайн и защитные показатели.</p>
            </div>
            <div className="min-w-56 rounded-[1.5rem] border border-white/10 bg-black/20 p-3">
              <label className="mb-2 block text-xs font-medium text-white/50">Выберите неделю</label>
              <input type="range" min="1" max="52" value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))} className="w-full accent-white" />
              <div className="mt-2 flex justify-between text-xs text-white/35"><span>1</span><span>52</span></div>
            </div>
          </div>
          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartRows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFillDark" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02}/></linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "rgba(255,255,255,.45)" }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1_000_000)}м`} tick={{ fontSize: 12, fill: "rgba(255,255,255,.45)" }} />
                <Tooltip content={<CustomTooltip formatter={(v) => typeof v === "number" && Math.abs(v) > 10000 ? fmtMoney(v) : fmtNumber(v, 2)} />} />
                <Area type="monotone" dataKey="revenue" name="Факт недели" stroke="#a78bfa" fill="url(#revFillDark)" strokeWidth={3} connectNulls />
                <Line type="monotone" dataKey="plan" name="План недели" stroke="#22d3ee" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Bar dataKey="nsm" name="NSM" radius={[10, 10, 0, 0]} fill="#34d399" opacity={0.45} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Индекс выполнения" title={`${fmtPercent(kpiIndex, 1)}`} subtitle="Средневзвешенное выполнение ключевых метрик на выбранную неделю." />
          <div className="space-y-4">
            {planRows.slice(0, 7).map((r) => {
              const ratio = r.plan ? r.fact / r.plan : 0;
              return <div key={r.metric}><div className="mb-1 flex justify-between text-sm"><span className="text-white/60">{r.metric}</span><span className="font-medium text-white">{fmtPercent(ratio, 0)}</span></div><ProgressBar value={ratio} /></div>;
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnnualTargetCard title="Цель выручки на год" target={targetRevenue} fact={revenueYtd} expected={(targetRevenue / 52) * selectedWeek} hint="Показывает отставание или перевыполнение относительно планового темпа года." />
        <AnnualTargetCard title="Цель NSM на год" target={targetNsm} fact={nsmYtd} expected={(targetNsm / 52) * selectedWeek} hint="North Star Metric: регулярная идентифицированная база." />
        <AnnualTargetCard title="Цель онлайн-выручки" target={targetRevenue * model.targetOnlineShare} fact={onlineYtd} expected={(targetRevenue * model.targetOnlineShare / 52) * selectedWeek} hint="Доставка и самовывоз в годовой цели." />
        <AnnualTargetCard title="Годовой бюджет" target={model.marketingBudget} fact={totalBudgetFact} expected={(model.marketingBudget / 52) * selectedWeek} hint="Контроль темпа освоения маркетингового бюджета." />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Выручка YTD" value={fmtMoney(revenueYtd)} plan={fmtMoney((targetRevenue / 52) * selectedWeek)} ratio={revenueYtd / ((targetRevenue / 52) * selectedWeek)} hint="Главный план-факт по году" icon={BarChart3} />
        <KpiCard title="NSM YTD" value={fmtMoney(nsmYtd)} plan={fmtMoney((targetNsm / 52) * selectedWeek)} ratio={nsmYtd / ((targetNsm / 52) * selectedWeek)} hint="Регулярная идентифицированная база" icon={Sparkles} />
        <KpiCard title="Онлайн выручка YTD" value={fmtMoney(onlineYtd)} plan={fmtMoney(targetRevenue * model.targetOnlineShare * selectedWeek / 52)} ratio={onlineYtd / (targetRevenue * model.targetOnlineShare * selectedWeek / 52)} hint="Доставка + самовывоз" icon={Activity} />
        <KpiCard title="ROMI бюджета" value={fmtNumber(budgetRomi, 2)} plan={fmtNumber(model.plannedRomi, 1)} ratio={budgetRomi / model.plannedRomi} hint="Инкр. прибыль / факт расходов" icon={WalletCards} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <SectionTitle
            eyebrow="Бюджет × показатели"
            title="Связка расходов с результатом"
            subtitle="Показывает, какие каналы съедают бюджет, дают выручку, прибыль и выполнение целевой метрики."
            right={<button onClick={openBudget} className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/20">Подробнее</button>}
          />
          <div className="grid gap-4 lg:grid-cols-[.95fr_1.05fr]">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budget} dataKey="fact" nameKey="channel" innerRadius={62} outerRadius={100} paddingAngle={2}>
                    {budget.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip formatter={(v) => fmtMoney(v)} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><div className="text-xs text-white/40">Расход факт</div><div className="mt-1 text-xl font-semibold">{fmtMoney(totalBudgetFact)}</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><div className="text-xs text-white/40">План бюджета</div><div className="mt-1 text-xl font-semibold">{fmtMoney(totalBudgetPlan)}</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><div className="text-xs text-white/40">Связанная выручка</div><div className="mt-1 text-xl font-semibold">{fmtMoney(totalAssistedRevenue)}</div></div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><div className="text-xs text-white/40">Инкр. прибыль</div><div className="mt-1 text-xl font-semibold">{fmtMoney(totalBudgetProfit)}</div></div>
              </div>
              <div className="space-y-2">
                {topChannels.map((b, i) => <div key={b.channel} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"><span className="h-3 w-3 rounded-full" style={{ background: palette[i] }} /><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{b.channel}</div><div className="text-xs text-white/40">ROMI {fmtNumber(b.factRomi, 1)} • {b.targetMetric}: {b.metricFact}%</div></div><div className="text-right text-sm font-semibold">{fmtMoney(b.incrProfit)}</div></div>)}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Эффективность каналов" title="ROMI, расход и вклад в прибыль" subtitle="Размер точки — связанная выручка. Правая верхняя зона — лучшие каналы." />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 18, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis type="number" dataKey="fact" name="Расход" tickFormatter={(v) => `${Math.round(v / 1_000_000)}м`} tick={{ fill: "rgba(255,255,255,.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="factRomi" name="ROMI" tick={{ fill: "rgba(255,255,255,.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="assistedRevenue" range={[90, 900]} name="Выручка" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip formatter={(v, name) => name === "Расход" || name === "Выручка" ? fmtMoney(v) : fmtNumber(v, 2)} />} />
                <Scatter name="Каналы" data={budget} fill="#8b5cf6">
                  {budget.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <Card>
          <SectionTitle eyebrow="План-факт" title="Отклонения и управленческие действия" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead><tr className="text-xs uppercase tracking-wide text-white/35"><th className="py-3">Метрика</th><th>Факт</th><th>План</th><th>Выполнение</th><th>Статус</th><th>Что делать</th></tr></thead>
              <tbody className="divide-y divide-white/10">
                {planRows.map((r) => {
                  const ratio = r.plan ? r.fact / r.plan : null;
                  const st = statusByRatio(ratio);
                  const isPct = ["Онлайн доля", "Карта", "Маржинальность", "Повтор онлайн", "Самовывоз"].includes(r.metric);
                  const isMoney = ["Выручка YTD", "NSM YTD"].includes(r.metric);
                  return (
                    <tr key={r.metric} className="align-middle text-white/65">
                      <td className="py-3 font-medium text-white">{r.metric}</td>
                      <td>{isMoney ? fmtMoney(r.fact) : isPct ? fmtPercent(r.fact) : fmtNumber(r.fact, 2)}</td>
                      <td>{isMoney ? fmtMoney(r.plan) : isPct ? fmtPercent(r.plan) : fmtNumber(r.plan, 2)}</td>
                      <td><div className="w-28"><ProgressBar value={ratio || 0} /></div></td>
                      <td><span className={`rounded-full border px-2.5 py-1 text-xs ${glassTone(st.tone)}`}>{st.label}</span></td>
                      <td className="text-white/45">{r.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Контроль бюджета" title="Темп расходования" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="26%" outerRadius="95%" data={budget.slice(0, 6).map((b) => ({ ...b, value: Math.min((b.fact / b.plan) * 100, 130) }))} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "rgba(255,255,255,.08)" }}>
                  {budget.slice(0, 6).map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                </RadialBar>
                <Tooltip content={<CustomTooltip formatter={(v) => `${fmtNumber(v, 1)}%`} />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {budget.slice(0, 4).map((b, i) => <div key={b.channel} className="flex items-center justify-between gap-3 text-sm"><div className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: palette[i] }} /><span className="truncate text-white/60">{b.channel}</span></div><span className="font-medium">{fmtPercent(b.fact / b.plan, 0)}</span></div>)}
          </div>
        </Card>
      </section>
    </div>
  );
}

function BudgetAnalytics({ budget, setBudget, model }) {
  const [selected, setSelected] = useState(null);
  const totalPlan = budget.reduce((a, b) => a + b.plan, 0);
  const totalFact = budget.reduce((a, b) => a + b.fact, 0);
  const totalRevenue = budget.reduce((a, b) => a + b.assistedRevenue, 0);
  const totalProfit = budget.reduce((a, b) => a + b.incrProfit, 0);
  const budgetRows = budget.map((b) => ({
    ...b,
    spendRatio: b.plan ? b.fact / b.plan : 0,
    romiRatio: b.planRomi ? b.factRomi / b.planRomi : 0,
    metricRatio: b.metricPlan ? b.metricFact / b.metricPlan : 0,
    profitShare: totalProfit ? b.incrProfit / totalProfit : 0,
    spendShare: totalFact ? b.fact / totalFact : 0,
    efficiency: b.fact ? b.incrProfit / b.fact : 0,
  }));
  const sorted = [...budgetRows].sort((a, b) => b.efficiency - a.efficiency);
  const riskRows = budgetRows.filter((b) => b.spendRatio > 0.95 && b.romiRatio < 1).sort((a, b) => b.fact - a.fact);

  function updateChannel(idx, key, value) {
    setBudget(budget.map((b, i) => i === idx ? { ...b, [key]: value } : b));
  }

  return (
    <div className="grid gap-5 pb-24 md:pb-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Бюджет факт" value={fmtMoney(totalFact)} plan={fmtMoney(totalPlan)} ratio={totalFact / totalPlan} hint="Сколько уже израсходовано" icon={WalletCards} />
        <KpiCard title="Инкр. прибыль" value={fmtMoney(totalProfit)} plan={fmtMoney(totalFact * model.plannedRomi)} ratio={totalProfit / (totalFact * model.plannedRomi)} hint="Прибыль от кампаний" icon={ArrowUpRight} />
        <KpiCard title="Связанная выручка" value={fmtMoney(totalRevenue)} plan={fmtMoney(model.revenue * model.revenueGrowthTarget)} ratio={totalRevenue / (model.revenue * model.revenueGrowthTarget)} hint="Ассоциированный вклад каналов" icon={LineChart} />
        <KpiCard title="Средний ROMI" value={fmtNumber(totalProfit / totalFact, 2)} plan={fmtNumber(model.plannedRomi, 1)} ratio={(totalProfit / totalFact) / model.plannedRomi} hint="Инкр. прибыль / расход" icon={Gauge} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <SectionTitle eyebrow="Каналы" title="Расходы, ROMI и выполнение целевых показателей" subtitle="Можно редактировать факт бюджета и ROMI — графики пересчитаются сразу." />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead><tr className="text-xs uppercase tracking-wide text-white/35"><th className="py-3">Канал</th><th>План</th><th>Факт</th><th>Расход</th><th>ROMI</th><th>Метрика</th><th>Прибыль</th><th>Решение</th></tr></thead>
              <tbody className="divide-y divide-white/10">
                {budgetRows.map((b, idx) => {
                  const tone = b.romiRatio >= 1 && b.metricRatio >= .95 ? "good" : b.romiRatio >= .85 ? "warn" : "bad";
                  return (
                    <tr key={b.channel} className="align-middle text-white/60">
                      <td className="max-w-[270px] py-3"><button onClick={() => setSelected(b)} className="text-left font-medium text-white hover:text-cyan-200">{b.channel}</button></td>
                      <td>{fmtMoney(b.plan)}</td>
                      <td><input className="w-28 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-right text-white outline-none focus:border-cyan-300/50" value={b.fact} onChange={(e) => updateChannel(idx, "fact", sanitizeNumber(e.target.value) ?? 0)} /></td>
                      <td><div className="w-28"><ProgressBar value={b.spendRatio} /></div><div className="mt-1 text-xs text-white/35">{fmtPercent(b.spendRatio, 0)}</div></td>
                      <td><input className="w-20 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-right text-white outline-none focus:border-cyan-300/50" value={b.factRomi} onChange={(e) => updateChannel(idx, "factRomi", sanitizeNumber(e.target.value) ?? 0)} /></td>
                      <td><div className="font-medium text-white/80">{b.targetMetric}</div><div className="text-xs text-white/35">{b.metricFact}% / {b.metricPlan}%</div></td>
                      <td>{fmtMoney(b.incrProfit)}</td>
                      <td><span className={`rounded-full border px-2.5 py-1 text-xs ${glassTone(tone)}`}>{b.decision}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <SectionTitle eyebrow="Портфель" title="Доля бюджета против доли прибыли" subtitle="Идеально, когда доля прибыли выше доли расходов." />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetRows} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(255,255,255,.08)" />
                  <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fill: "rgba(255,255,255,.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="channel" width={120} tick={{ fill: "rgba(255,255,255,.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip formatter={(v) => fmtPercent(v, 1)} />} />
                  <Bar dataKey="spendShare" name="Доля расхода" fill="#475569" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="profitShare" name="Доля прибыли" fill="#22d3ee" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <SectionTitle eyebrow="Риски" title="Каналы для пересмотра" subtitle="Высокий расход при ROMI ниже плана." />
            <div className="space-y-3">
              {(riskRows.length ? riskRows : budgetRows.slice().sort((a, b) => a.romiRatio - b.romiRatio).slice(0, 3)).map((b) => <button key={b.channel} onClick={() => setSelected(b)} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:bg-white/[0.08]"><div className="min-w-0"><div className="truncate font-medium text-white">{b.channel}</div><div className="text-xs text-white/40">ROMI {fmtNumber(b.factRomi, 1)} из {fmtNumber(b.planRomi, 1)} • расход {fmtPercent(b.spendRatio, 0)}</div></div><ChevronRight className="text-white/35" size={18} /></button>)}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Card>
          <SectionTitle eyebrow="Рейтинг" title="Лучшие каналы по прибыли на ₽ расхода" />
          <div className="space-y-3">
            {sorted.map((b, i) => <div key={b.channel} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><div className="mb-2 flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-xl bg-white/10 text-xs">{i + 1}</span><div className="truncate font-medium">{b.channel}</div></div><span className="font-semibold text-cyan-200">×{fmtNumber(b.efficiency, 2)}</span></div><ProgressBar value={Math.min(b.efficiency / model.plannedRomi, 1.2)} /></div>)}
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Матрица" title="Расход × ROMI × выполнение метрики" subtitle="Ось X — расход, Y — ROMI, размер точки — связанная выручка." />
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 18, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
                <XAxis type="number" dataKey="fact" name="Расход" tickFormatter={(v) => `${Math.round(v / 1_000_000)}м`} tick={{ fill: "rgba(255,255,255,.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="factRomi" name="ROMI" tick={{ fill: "rgba(255,255,255,.45)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="assistedRevenue" range={[100, 1000]} name="Выручка" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip formatter={(v, name) => name === "Расход" || name === "Выручка" ? fmtMoney(v) : fmtNumber(v, 2)} />} />
                <Scatter name="Каналы" data={budgetRows} fill="#8b5cf6">
                  {budgetRows.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.channel || "Канал"}>
        {selected && (
          <div className="space-y-4 text-white/65">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><div className="text-xs text-white/35">План / факт расхода</div><div className="mt-1 text-2xl font-semibold text-white">{fmtMoney(selected.fact)} / {fmtMoney(selected.plan)}</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><div className="text-xs text-white/35">ROMI факт / план</div><div className="mt-1 text-2xl font-semibold text-white">{fmtNumber(selected.factRomi, 1)} / {fmtNumber(selected.planRomi, 1)}</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><div className="text-xs text-white/35">Связанная выручка</div><div className="mt-1 text-2xl font-semibold text-white">{fmtMoney(selected.assistedRevenue)}</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><div className="text-xs text-white/35">Инкр. прибыль</div><div className="mt-1 text-2xl font-semibold text-white">{fmtMoney(selected.incrProfit)}</div></div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium text-white"><Info size={17} /> Пояснение</div>
              <p className="leading-6">Канал связан с показателем «{selected.targetMetric}». Если расход близок к плану, а ROMI или показатель ниже цели, канал попадает в зону управленческого пересмотра: нужно менять креатив, аудиторию, механику оффера или перераспределять бюджет.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Calculator({ model, setModel }) {
  const [help, setHelp] = useState(false);
  const calc = useMemo(() => {
    const targetRevenue = model.revenue * (1 + model.revenueGrowthTarget);
    const requiredGrowth = targetRevenue - model.revenue;
    const annualChecks = model.revenue / model.avgCheck;
    const currentOnline = model.revenue * model.onlineShare;
    const targetOnline = targetRevenue * model.targetOnlineShare;
    const addOnline = targetOnline - currentOnline;
    const avgCheckGrowth = annualChecks * (model.targetAvgCheck - model.avgCheck);
    const addPurchases = model.activeCards * (model.targetFrequency - model.frequency) * 12;
    const frequencyGrowth = addPurchases * model.targetAvgCheck;
    const incrGrossProfit = frequencyGrowth * model.margin;
    const loyaltyCosts = { bonus3: 45_000_000, personalCycles: 32_000_000, crmTests: 9_000_000 };
    const totalCosts = Object.values(loyaltyCosts).reduce((a, b) => a + b, 0);
    const incrementalRomi = (incrGrossProfit - totalCosts) / totalCosts;
    return { targetRevenue, requiredGrowth, annualChecks, currentOnline, targetOnline, addOnline, avgCheckGrowth, addPurchases, frequencyGrowth, incrGrossProfit, loyaltyCosts, totalCosts, incrementalRomi };
  }, [model]);

  return (
    <div className="grid gap-5 pb-24 md:pb-8 xl:grid-cols-[.9fr_1.1fr]">
      <Card>
        <SectionTitle eyebrow="Вводные" title="База и целевые ориентиры" right={<div className="flex gap-2"><button onClick={() => setHelp(true)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 text-white/60"><HelpCircle size={18} /></button><button onClick={() => setModel(baseModel)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 text-white/60"><RefreshCcw size={18} /></button></div>} />
        <div className="grid gap-3">
          {[...inputFields, ...targetFields].map(([key, label, unit, comment]) => (
            <label key={key} className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-[1.1fr_.8fr] sm:items-center">
              <div><div className="text-sm font-medium text-white/85">{label}</div><div className="text-xs text-white/35">{comment || unit}</div></div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                <input className="min-w-0 flex-1 bg-transparent text-right font-medium text-white outline-none" value={model[key]} onChange={(e) => setModel({ ...model, [key]: sanitizeNumber(e.target.value) ?? 0 })} />
                <span className="text-xs text-white/35">{unit}</span>
              </div>
            </label>
          ))}
        </div>
      </Card>

      <div className="grid gap-5">
        <Card>
          <SectionTitle eyebrow="Модель роста" title="Чем собирается +15% к выручке" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <KpiCard title="Целевая выручка" value={fmtMoney(calc.targetRevenue)} plan={fmtMoney(model.revenue)} ratio={calc.targetRevenue / model.revenue} icon={BarChart3} />
            <KpiCard title="Необходимый прирост" value={fmtMoney(calc.requiredGrowth)} plan="к цели" ratio={calc.requiredGrowth / (model.revenue * model.revenueGrowthTarget)} icon={ArrowUpRight} />
            <KpiCard title="Прирост от чека" value={fmtMoney(calc.avgCheckGrowth)} plan={fmtMoney(calc.requiredGrowth)} ratio={calc.avgCheckGrowth / calc.requiredGrowth} icon={Gauge} />
            <KpiCard title="Прирост от частоты" value={fmtMoney(calc.frequencyGrowth)} plan={fmtMoney(calc.requiredGrowth)} ratio={calc.frequencyGrowth / calc.requiredGrowth} icon={Activity} />
            <KpiCard title="Доп. онлайн выручка" value={fmtMoney(calc.addOnline)} plan={fmtMoney(calc.requiredGrowth)} ratio={calc.addOnline / calc.requiredGrowth} icon={Sparkles} />
            <KpiCard title="Инкр. ROMI лояльности" value={fmtNumber(calc.incrementalRomi, 2)} plan={fmtNumber(model.plannedRomi, 1)} ratio={calc.incrementalRomi / model.plannedRomi} icon={WalletCards} />
          </div>
        </Card>
        <Card>
          <SectionTitle eyebrow="Связки" title="Логика расчета" />
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Текущие чеки в год", "Выручка / средний чек", fmtNumber(calc.annualChecks, 0)],
              ["Онлайн выручка сейчас", "Выручка × онлайн доля", fmtMoney(calc.currentOnline)],
              ["Целевая онлайн выручка", "Целевая выручка × целевая онлайн доля", fmtMoney(calc.targetOnline)],
              ["Дополнительные покупки", "Карты × рост частоты × 12", fmtNumber(calc.addPurchases, 0)],
              ["Инкр. валовая прибыль", "Прирост от частоты × маржа", fmtMoney(calc.incrGrossProfit)],
              ["Расходы лояльности", "Бонусы + CRM + тесты", fmtMoney(calc.totalCosts)],
            ].map(([name, logic, value]) => <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="text-sm font-semibold text-white">{name}</div><div className="mt-1 text-xs text-white/40">{logic}</div><div className="mt-3 text-xl font-semibold text-white">{value}</div></div>)}
          </div>
        </Card>
      </div>

      <Modal open={help} onClose={() => setHelp(false)} title="Как работает калькулятор">
        <div className="space-y-4 text-sm leading-6 text-white/65">
          <p>Модель считает целевую выручку, недостающий прирост и раскладывает его на драйверы: средний чек, частоту покупок, онлайн-продажи и программу лояльности.</p>
          <p>ROMI считается как отношение инкрементальной валовой прибыли к расходам. Если ROMI ниже плана, управленческое действие — менять механику кампании или перераспределять бюджет.</p>
        </div>
      </Modal>
    </div>
  );
}

function DataHub({ weeks, setWeeks, budget, setBudget, selectedWeek, setSelectedWeek }) {
  const [draft, setDraft] = useState(() => weeks.find((w) => w.week === selectedWeek) || weeks[0]);
  const [query, setQuery] = useState("");

  useEffect(() => { setDraft(weeks.find((w) => w.week === selectedWeek) || weeks[0]); }, [selectedWeek, weeks]);

  function saveWeek() {
    const updated = weeks.map((w) => w.week === Number(draft.week) ? { ...w, ...draft, week: Number(draft.week) } : w);
    if (!updated.find((w) => w.week === Number(draft.week))) updated.push({ ...draft, week: Number(draft.week) });
    setWeeks(updated.sort((a, b) => a.week - b.week));
    setSelectedWeek(Number(draft.week));
  }

  function parseCsv(text) {
   const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return;
    const headers = lines[0].split(/[;,]/).map((h) => h.trim());
    const mapped = lines.slice(1).map((line) => {
      const cells = line.split(/[;,]/).map((c) => c.trim());
      const row = {};
      headers.forEach((h, i) => { row[h] = cells[i]; });
      return {
        week: Number(row.week || row["Неделя"]),
        date: row.date || row["Дата начала"],
        revenue: sanitizeNumber(row.revenue || row["Выручка факт"]),
        avgCheck: sanitizeNumber(row.avgCheck || row["Средний чек"]),
        frequency: sanitizeNumber(row.frequency || row["Частота 30 дней"]),
        onlineShare: sanitizeNumber(row.onlineShare || row["Онлайн доля"]),
        cardShare: sanitizeNumber(row.cardShare || row["Доля чеков по карте"]),
        activeCards: sanitizeNumber(row.activeCards || row["Активные карты"]),
        nsmRevenue: sanitizeNumber(row.nsmRevenue || row["NSM выручка факт"]),
        margin: sanitizeNumber(row.margin || row["Маржинальность"]),
        incrProfit: sanitizeNumber(row.incrProfit || row["Инкр. валовая прибыль кампаний"]),
        marketingSpend: sanitizeNumber(row.marketingSpend || row["Расход маркетинга"]),
        nps: sanitizeNumber(row.nps || row["NPS"]),
        repeatOnline30: sanitizeNumber(row.repeatOnline30 || row["Повтор онлайн заказа 30 дней"]),
        pickupShare: sanitizeNumber(row.pickupShare || row["Доля самовывоза"]),
      };
    }).filter((r) => r.week);
    const merged = [...weeks];
    mapped.forEach((r) => {
      const idx = merged.findIndex((x) => x.week === r.week);
      if (idx >= 0) merged[idx] = { ...merged[idx], ...r };
      else merged.push(r);
    });
    setWeeks(merged.sort((a, b) => a.week - b.week));
  }

  const visible = weeks.filter((w) => String(w.week).includes(query) || w.date.includes(query));

  return (
    <div className="grid gap-5 pb-24 md:pb-8 xl:grid-cols-[.8fr_1.2fr]">
      <Card>
        <SectionTitle eyebrow="Ввод факта" title="Добавить или обновить неделю" right={<Plus className="text-white/45" />} />
        <div className="grid gap-3">
          {weekInputFields.map(([key, label, type]) => (
            <label key={key} className="grid gap-1">
              <span className="text-xs font-medium text-white/45">{label}</span>
              <input type={type} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.08]" value={draft?.[key] ?? ""} onChange={(e) => setDraft({ ...draft, [key]: type === "date" ? e.target.value : sanitizeNumber(e.target.value) })} />
            </label>
          ))}
          <button onClick={saveWeek} className="mt-2 rounded-2xl bg-white px-4 py-3 font-medium text-slate-950 shadow-lg shadow-white/10">Сохранить неделю</button>
        </div>
      </Card>

      <div className="grid gap-5">
        <Card>
          <SectionTitle eyebrow="Интеграция" title="Импорт факта из CSV" right={<Upload className="text-white/45" />} />
          <div className="rounded-[1.5rem] border border-dashed border-white/20 bg-white/[0.04] p-5 text-center">
            <Upload className="mx-auto mb-2 text-white/40" />
            <p className="text-sm text-white/50">Загрузите CSV с колонками week, date, revenue, avgCheck, frequency, onlineShare, cardShare, activeCards, nsmRevenue, margin, incrProfit, marketingSpend, nps, repeatOnline30, pickupShare. Поддерживаются русские заголовки.</p>
            <input className="mt-4 block w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white" type="file" accept=".csv,text/csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) f.text().then(parseCsv); }} />
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Таблица" title="Недельные данные" right={<div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2"><Search size={16} className="text-white/40" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск" className="w-24 bg-transparent text-sm text-white outline-none placeholder:text-white/30" /></div>} />
          <div className="max-h-[520px] overflow-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-wide text-white/35"><tr><th className="p-3">Неделя</th><th>Дата</th><th>Выручка</th><th>Чек</th><th>Частота</th><th>Онлайн</th><th>Карта</th><th>NSM</th><th>Расход</th><th>NPS</th></tr></thead>
              <tbody className="divide-y divide-white/10">
                {visible.map((w) => <tr key={w.week} onClick={() => setSelectedWeek(w.week)} className={`cursor-pointer text-white/60 hover:bg-white/[0.05] ${selectedWeek === w.week ? "bg-white/[0.06]" : ""}`}><td className="p-3 font-medium text-white">{w.week}</td><td>{w.date}</td><td>{fmtMoney(w.revenue)}</td><td>{fmtNumber(w.avgCheck, 0)}</td><td>{fmtNumber(w.frequency, 2)}</td><td>{fmtPercent(w.onlineShare)}</td><td>{fmtPercent(w.cardShare)}</td><td>{fmtMoney(w.nsmRevenue)}</td><td>{fmtMoney(w.marketingSpend)}</td><td>{fmtNumber(w.nps, 1)}</td></tr>)}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingsPage({ model, weeks, budget, setWeeks, setBudget, setModel }) {
  const payload = useMemo(() => JSON.stringify({ model, weeks, budget }, null, 2), [model, weeks, budget]);
  function downloadJson() {
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "family-supermarket-metrics.json"; a.click(); URL.revokeObjectURL(url);
  }
  function importJson(file) {
    file.text().then((txt) => {
      const data = JSON.parse(txt);
      if (data.model) setModel(data.model);
      if (data.weeks) setWeeks(data.weeks);
      if (data.budget) setBudget(data.budget);
    });
  }
  return (
    <div className="grid gap-5 pb-24 md:pb-8 lg:grid-cols-[.9fr_1.1fr]">
      <Card>
        <SectionTitle eyebrow="Настройки данных" title="Интеграция с внешними системами" right={<Database className="text-white/45" />} />
        <div className="space-y-3">
          {[
            ["POS / кассы", "Еженедельная выручка, средний чек, доля чеков по карте"],
            ["CRM / программа лояльности", "Активные карты, частота, NSM, повторные покупки"],
            ["E-commerce", "Онлайн доля, самовывоз, повтор онлайн заказа"],
            ["Маркетинг", "Расходы, инкрементальная прибыль, ROMI по каналам"],
          ].map(([name, text]) => <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div><div className="font-medium text-white">{name}</div><div className="text-sm text-white/45">{text}</div></div><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">готово</span></div>)}
        </div>
      </Card>
      <div className="grid gap-5">
        <Card>
          <SectionTitle eyebrow="Реальная загрузка" title="Импорт / экспорт состояния приложения" />
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={downloadJson} className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-medium text-slate-950"><Download size={18} /> Скачать JSON</button>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 font-medium text-white"><Upload size={18} /> Загрузить JSON<input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} /></label>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/50">Все изменения сохраняются в браузере через localStorage. Для командной версии можно добавить API‑слой: POST /weekly-facts, GET /dashboard, POST /budget-facts, POST /model-settings.</div>
        </Card>
        <Card>
          <SectionTitle eyebrow="API-схема" title="Контракт для разработчиков" />
          <pre className="max-h-[520px] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-5 text-white/75">{`POST /api/weekly-facts
{
  week, date, revenue, avgCheck, frequency,
  onlineShare, cardShare, activeCards, nsmRevenue,
  margin, incrProfit, marketingSpend, nps,
  repeatOnline30, pickupShare
}

POST /api/budget-facts
{
  channel, plan, fact, planRomi, factRomi,
  assistedRevenue, incrProfit,
  targetMetric, metricFact, metricPlan
}

POST /api/model-settings
{ revenue, avgCheck, margin, activeCards, targets... }

GET /api/dashboard?week=12
→ карточки, план-факт, бюджет, ROMI, темп, индекс KPI`}</pre>
        </Card>
      </div>
    </div>
  );
}

export default function FamilySupermarketMetricsApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [model, setModel] = useState(baseModel);
  const [weeks, setWeeks] = useState(makeInitialWeeks);
  const [budget, setBudget] = useState(initialBudget);
  const [selectedWeek, setSelectedWeek] = useState(12);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.model) setModel(data.model);
      if (data.weeks) setWeeks(data.weeks);
      if (data.budget) setBudget(data.budget);
      if (data.selectedWeek) setSelectedWeek(data.selectedWeek);
    } catch (_) {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ model, weeks, budget, selectedWeek }));
  }, [model, weeks, budget, selectedWeek]);

  const activeView = {
    dashboard: <Dashboard model={model} weeks={weeks} budget={budget} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} openBudget={() => setActiveTab("budget")} />,
    budget: <BudgetAnalytics budget={budget} setBudget={setBudget} model={model} />,
    calculator: <Calculator model={model} setModel={setModel} />,
    data: <DataHub weeks={weeks} setWeeks={setWeeks} budget={budget} setBudget={setBudget} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />,
    settings: <SettingsPage model={model} weeks={weeks} budget={budget} setWeeks={setWeeks} setBudget={setBudget} setModel={setModel} />,
  }[activeTab];

  return <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>{activeView}</AppShell>;
}
