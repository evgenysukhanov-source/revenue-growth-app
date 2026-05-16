import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  LayoutDashboard,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  WalletCards,
} from "lucide-react";

const STORAGE_KEY = "family-supermarket-metrics-app-v1";

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
  { channel: "Яндекс.Директ / поиск / геореклама", plan: 45_000_000, fact: 0, planRomi: 4.5, decision: "Удерживать" },
  { channel: "SEO и контент", plan: 18_000_000, fact: 0, planRomi: 5, decision: "Высокий приоритет" },
  { channel: "CRM, email, push, реактивация", plan: 30_600_000, fact: 0, planRomi: 2.5, decision: "Рост частоты" },
  { channel: "Приложение и возврат пользователей", plan: 18_000_000, fact: 0, planRomi: 2.5, decision: "Рост онлайн" },
  { channel: "VK / соцсети / таргет", plan: 18_000_000, fact: 0, planRomi: 2.2, decision: "Оптимизировать" },
  { channel: "Трейд маркетинг и POSM", plan: 21_600_000, fact: 0, planRomi: 2, decision: "Рост чека" },
  { channel: "Бонусный фонд и промо лояльности", plan: 18_000_000, fact: 0, planRomi: 2.5, decision: "Миссии и купоны" },
  { channel: "Печатные каталоги", plan: 7_200_000, fact: 0, planRomi: 0.6, decision: "Сократить" },
  { channel: "Аналитика, исследования, A/B тесты", plan: 3_600_000, fact: 0, planRomi: 1, decision: "Контроль" },
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

function lastFilledWeek(rows) {
  const filled = rows.filter((r) => r.revenue !== null && r.revenue !== undefined);
  return filled.length ? filled[filled.length - 1].week : 1;
}

function metricName(key) {
  return {
    revenue: "Выручка",
    avgCheck: "Средний чек",
    frequency: "Частота",
    onlineShare: "Онлайн доля",
    cardShare: "Карта",
    nsmRevenue: "NSM",
    nps: "NPS",
    pickupShare: "Самовывоз",
  }[key] || key;
}

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-3 text-xs shadow-xl backdrop-blur-xl">
      <div className="mb-1 font-semibold text-slate-900">Неделя {label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-slate-600">
          <span>{p.name}</span>
          <span className="font-medium text-slate-900">{typeof p.value === "number" && p.value > 10000 ? fmtMoney(p.value) : fmtNumber(p.value, 2)}</span>
        </div>
      ))}
    </div>
  );
}

function AppShell({ children, activeTab, setActiveTab }) {
  const tabs = [
    ["dashboard", "Дашборд", LayoutDashboard],
    ["calculator", "Калькулятор", Gauge],
    ["data", "Данные", Database],
    ["settings", "Интеграции", Settings2],
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eef7ff_0,#f7f8fb_35%,#ffffff_100%)] text-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-30 rounded-[2rem] border border-white/70 bg-white/72 px-4 py-3 shadow-[0_20px_70px_rgba(15,23,42,.08)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-300">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Семейный Супермаркет <span className="hidden sm:inline">• маркетинговая модель</span>
                </div>
                <h1 className="text-lg font-semibold tracking-tight sm:text-2xl">Калькулятор метрик и управленческий дашборд</h1>
              </div>
            </div>
            <nav className="hidden rounded-2xl bg-slate-100 p-1 md:flex">
              {tabs.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${activeTab === id ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </div>
      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[1.75rem] border border-white/70 bg-white/85 p-2 shadow-2xl backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`rounded-2xl px-2 py-2 text-xs ${activeTab === id ? "bg-slate-950 text-white" : "text-slate-500"}`}>
              <Icon className="mx-auto mb-1" size={18} />{label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-[0_18px_60px_rgba(15,23,42,.07)] backdrop-blur-xl ${className}`}>{children}</div>;
}

function SectionTitle({ eyebrow, title, right }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        {eyebrow && <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{eyebrow}</div>}
        <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function KpiCard({ title, value, plan, ratio, hint, icon: Icon }) {
  const status = statusByRatio(ratio);
  const good = status.tone === "good";
  const bad = status.tone === "bad";
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.7rem] border border-white bg-white/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700"><Icon size={19} /></div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${good ? "bg-emerald-50 text-emerald-700" : bad ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{status.label}</span>
      </div>
      <div className="mt-4 text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        {ratio >= 1 ? <ArrowUpRight size={15} className="text-emerald-600" /> : <ArrowDownRight size={15} className={bad ? "text-rose-600" : "text-amber-600"} />}
        План: {plan} • выполнение {fmtPercent(ratio, 1)}
      </div>
      {hint && <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">{hint}</div>}
    </motion.div>
  );
}

function ProgressBar({ value }) {
  const status = statusByRatio(value);
  const width = Math.max(0, Math.min(110, value * 100));
  const cls = status.tone === "good" ? "bg-emerald-500" : status.tone === "warn" ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${cls}`} style={{ width: `${width}%` }} />
    </div>
  );
}

function Dashboard({ model, weeks, budget, selectedWeek, setSelectedWeek }) {
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
  const remainingWeeks = Math.max(1, 52 - selectedWeek);
  const tempoRows = [
    { name: "Выручка", fact: revenueYtd, rest: targetRevenue - revenueYtd, perWeek: (targetRevenue - revenueYtd) / remainingWeeks },
    { name: "Онлайн", fact: onlineYtd, rest: targetRevenue * model.targetOnlineShare - onlineYtd, perWeek: (targetRevenue * model.targetOnlineShare - onlineYtd) / remainingWeeks },
    { name: "NSM", fact: nsmYtd, rest: targetNsm - nsmYtd, perWeek: (targetNsm - nsmYtd) / remainingWeeks },
    { name: "Бюджет", fact: spendYtd, rest: model.marketingBudget - spendYtd, perWeek: (model.marketingBudget - spendYtd) / remainingWeeks },
  ];
  const budgetData = budget.map((b) => ({ ...b, share: b.plan / budget.reduce((a, x) => a + x.plan, 0) }));

  return (
    <div className="grid gap-5 pb-24 md:pb-8">
      <section className="grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white"><Activity size={14} /> Неделя {selectedWeek} • {week.date}</div>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">Управление ростом до {fmtMoney(targetRevenue, 1)}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">North Star Metric: выручка от активных идентифицированных покупателей с 3+ покупками. Защитные метрики: маржа, ROMI, NPS, бюджет и самовывоз.</p>
            </div>
            <div className="min-w-56 rounded-[1.5rem] bg-slate-100 p-3">
              <label className="mb-2 block text-xs font-medium text-slate-500">Выберите неделю</label>
              <input type="range" min="1" max="52" value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))} className="w-full accent-slate-950" />
              <div className="mt-2 flex justify-between text-xs text-slate-400"><span>1</span><span>52</span></div>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartRows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#0f172a" stopOpacity={0.18}/><stop offset="95%" stopColor="#0f172a" stopOpacity={0.01}/></linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1_000_000)}м`} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip content={<TooltipBox />} />
                <Area type="monotone" dataKey="revenue" name="Факт недели" stroke="#0f172a" fill="url(#revFill)" strokeWidth={2.5} connectNulls />
                <Line type="monotone" dataKey="plan" name="План недели" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Bar dataKey="nsm" name="NSM" radius={[10, 10, 0, 0]} fill="#cbd5e1" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle eyebrow="Индекс выполнения" title={`${fmtPercent(kpiIndex, 1)}`} right={<Gauge className="text-slate-400" />} />
          <div className="space-y-4">
            {planRows.slice(0, 7).map((r) => {
              const ratio = r.plan ? r.fact / r.plan : 0;
              return <div key={r.metric}><div className="mb-1 flex justify-between text-sm"><span className="text-slate-600">{r.metric}</span><span className="font-medium">{fmtPercent(ratio, 0)}</span></div><ProgressBar value={ratio} /></div>;
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Выручка YTD" value={fmtMoney(revenueYtd)} plan={fmtMoney((targetRevenue / 52) * selectedWeek)} ratio={revenueYtd / ((targetRevenue / 52) * selectedWeek)} hint="Главный план-факт по году" icon={BarChart3} />
        <KpiCard title="NSM YTD" value={fmtMoney(nsmYtd)} plan={fmtMoney((targetNsm / 52) * selectedWeek)} ratio={nsmYtd / ((targetNsm / 52) * selectedWeek)} hint="Регулярная идентифицированная база" icon={Sparkles} />
        <KpiCard title="Онлайн выручка YTD" value={fmtMoney(onlineYtd)} plan={fmtMoney(targetRevenue * model.targetOnlineShare * selectedWeek / 52)} ratio={onlineYtd / (targetRevenue * model.targetOnlineShare * selectedWeek / 52)} hint="Доставка + самовывоз" icon={Activity} />
        <KpiCard title="ROMI накопительно" value={fmtNumber(romi, 2)} plan={fmtNumber(model.plannedRomi, 1)} ratio={romi / model.plannedRomi} hint="Инкр. прибыль / расходы" icon={WalletCards} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card>
          <SectionTitle eyebrow="План-факт" title="Отклонения и управленческие действия" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead><tr className="text-xs uppercase tracking-wide text-slate-400"><th className="py-3">Метрика</th><th>Факт</th><th>План</th><th>Выполнение</th><th>Статус</th><th>Что делать</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {planRows.map((r) => {
                  const ratio = r.plan ? r.fact / r.plan : null;
                  const st = statusByRatio(ratio);
                  const isPct = ["Онлайн доля", "Карта", "Маржинальность", "Повтор онлайн", "Самовывоз"].includes(r.metric);
                  const isMoney = ["Выручка YTD", "NSM YTD"].includes(r.metric);
                  return (
                    <tr key={r.metric} className="align-middle">
                      <td className="py-3 font-medium text-slate-900">{r.metric}</td>
                      <td>{isMoney ? fmtMoney(r.fact) : isPct ? fmtPercent(r.fact) : fmtNumber(r.fact, 2)}</td>
                      <td>{isMoney ? fmtMoney(r.plan) : isPct ? fmtPercent(r.plan) : fmtNumber(r.plan, 2)}</td>
                      <td><div className="w-28"><ProgressBar value={ratio || 0} /></div></td>
                      <td><span className={`rounded-full px-2.5 py-1 text-xs ${st.tone === "good" ? "bg-emerald-50 text-emerald-700" : st.tone === "warn" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{st.label}</span></td>
                      <td className="text-slate-500">{r.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="grid gap-5">
          <Card>
            <SectionTitle eyebrow="Темп" title="Сколько нужно в неделю" />
            <div className="space-y-3">
              {tempoRows.map((r) => <div key={r.name} className="rounded-2xl bg-slate-50 p-3"><div className="flex justify-between text-sm"><b>{r.name}</b><span>{fmtMoney(r.perWeek)}</span></div><div className="mt-1 text-xs text-slate-500">Осталось: {fmtMoney(r.rest)} • факт: {fmtMoney(r.fact)}</div></div>)}
            </div>
          </Card>
          <Card>
            <SectionTitle eyebrow="Бюджет" title="Распределение каналов" />
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={budgetData} dataKey="plan" nameKey="channel" innerRadius={58} outerRadius={88} paddingAngle={2}>{budgetData.map((_, i) => <Cell key={i} fill={["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#475569", "#1e293b", "#a8a29e"][i % 9]} />)}</Pie><Tooltip formatter={(v) => fmtMoney(v)} /></PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Calculator({ model, setModel }) {
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
        <SectionTitle eyebrow="Вводные" title="База и целевые ориентиры" right={<RefreshCcw className="cursor-pointer text-slate-400" onClick={() => setModel(baseModel)} />} />
        <div className="grid gap-3">
          {[...inputFields, ...targetFields].map(([key, label, unit, comment]) => (
            <label key={key} className="grid gap-2 rounded-2xl bg-slate-50 p-3 sm:grid-cols-[1.1fr_.8fr] sm:items-center">
              <div><div className="text-sm font-medium text-slate-800">{label}</div><div className="text-xs text-slate-400">{comment || unit}</div></div>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
                <input className="min-w-0 flex-1 bg-transparent text-right font-medium outline-none" value={model[key]} onChange={(e) => setModel({ ...model, [key]: sanitizeNumber(e.target.value) ?? 0 })} />
                <span className="text-xs text-slate-400">{unit}</span>
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
          <SectionTitle eyebrow="Связки" title="Логика расчета из Excel" />
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Текущие чеки в год", "Выручка / средний чек", fmtNumber(calc.annualChecks, 0)],
              ["Онлайн выручка сейчас", "Выручка × онлайн доля", fmtMoney(calc.currentOnline)],
              ["Целевая онлайн выручка", "Целевая выручка × целевая онлайн доля", fmtMoney(calc.targetOnline)],
              ["Дополнительные покупки", "Карты × рост частоты × 12", fmtNumber(calc.addPurchases, 0)],
              ["Инкр. валовая прибыль", "Прирост от частоты × маржа", fmtMoney(calc.incrGrossProfit)],
              ["Расходы лояльности", "Бонусы + CRM + тесты", fmtMoney(calc.totalCosts)],
            ].map(([name, logic, value]) => <div key={name} className="rounded-2xl bg-slate-50 p-4"><div className="text-sm font-semibold">{name}</div><div className="mt-1 text-xs text-slate-500">{logic}</div><div className="mt-3 text-xl font-semibold">{value}</div></div>)}
          </div>
        </Card>
      </div>
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
        <SectionTitle eyebrow="Ввод факта" title="Добавить или обновить неделю" right={<Plus className="text-slate-400" />} />
        <div className="grid gap-3">
          {weekInputFields.map(([key, label, type]) => (
            <label key={key} className="grid gap-1">
              <span className="text-xs font-medium text-slate-500">{label}</span>
              <input type={type} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition focus:bg-white focus:ring-4 focus:ring-slate-100" value={draft?.[key] ?? ""} onChange={(e) => setDraft({ ...draft, [key]: type === "date" ? e.target.value : sanitizeNumber(e.target.value) })} />
            </label>
          ))}
          <button onClick={saveWeek} className="mt-2 rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white shadow-lg shadow-slate-300">Сохранить неделю</button>
        </div>
      </Card>

      <div className="grid gap-5">
        <Card>
          <SectionTitle eyebrow="Интеграция" title="Импорт факта из CSV" right={<Upload className="text-slate-400" />} />
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
            <Upload className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-500">Загрузите CSV с колонками week, date, revenue, avgCheck, frequency, onlineShare, cardShare, activeCards, nsmRevenue, margin, incrProfit, marketingSpend, nps, repeatOnline30, pickupShare. Поддерживаются русские заголовки из Excel.</p>
            <input className="mt-4 block w-full rounded-2xl bg-white p-3 text-sm" type="file" accept=".csv,text/csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) f.text().then(parseCsv); }} />
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Таблица" title="Недельные данные" right={<div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2"><Search size={16} className="text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск" className="w-24 bg-transparent text-sm outline-none" /></div>} />
          <div className="max-h-[520px] overflow-auto rounded-2xl border border-slate-100">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="sticky top-0 bg-white text-xs uppercase tracking-wide text-slate-400"><tr><th className="p-3">Неделя</th><th>Дата</th><th>Выручка</th><th>Чек</th><th>Частота</th><th>Онлайн</th><th>Карта</th><th>NSM</th><th>Расход</th><th>NPS</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((w) => <tr key={w.week} onClick={() => setSelectedWeek(w.week)} className={`cursor-pointer hover:bg-slate-50 ${selectedWeek === w.week ? "bg-slate-50" : ""}`}><td className="p-3 font-medium">{w.week}</td><td>{w.date}</td><td>{fmtMoney(w.revenue)}</td><td>{fmtNumber(w.avgCheck, 0)}</td><td>{fmtNumber(w.frequency, 2)}</td><td>{fmtPercent(w.onlineShare)}</td><td>{fmtPercent(w.cardShare)}</td><td>{fmtMoney(w.nsmRevenue)}</td><td>{fmtMoney(w.marketingSpend)}</td><td>{fmtNumber(w.nps, 1)}</td></tr>)}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Бюджет" title="Факт расходов по каналам" />
          <div className="grid gap-2">
            {budget.map((b, idx) => <div key={b.channel} className="grid gap-2 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1.2fr_.5fr_.5fr_.8fr] md:items-center"><div><div className="text-sm font-medium">{b.channel}</div><div className="text-xs text-slate-400">План: {fmtMoney(b.plan)} • ROMI {fmtNumber(b.planRomi, 1)}</div></div><input className="rounded-xl bg-white px-3 py-2 text-right outline-none" value={b.fact} onChange={(e) => setBudget(budget.map((x, i) => i === idx ? { ...x, fact: sanitizeNumber(e.target.value) ?? 0 } : x))} /><div className="text-sm text-slate-500">{fmtMoney(b.fact - b.plan)}</div><div className="text-xs text-slate-500">{b.decision}</div></div>)}
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
        <SectionTitle eyebrow="Настройки данных" title="Интеграция с внешними системами" right={<Database className="text-slate-400" />} />
        <div className="space-y-3">
          {[
            ["POS / кассы", "Еженедельная выручка, средний чек, доля чеков по карте"],
            ["CRM / программа лояльности", "Активные карты, частота, NSM, повторные покупки"],
            ["E-commerce", "Онлайн доля, самовывоз, повтор онлайн заказа"],
            ["Маркетинг", "Расходы, инкрементальная прибыль, ROMI по каналам"],
          ].map(([name, text]) => <div key={name} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div><div className="font-medium">{name}</div><div className="text-sm text-slate-500">{text}</div></div><span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">готово</span></div>)}
        </div>
      </Card>
      <div className="grid gap-5">
        <Card>
          <SectionTitle eyebrow="Реальная загрузка" title="Импорт / экспорт состояния приложения" />
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={downloadJson} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white"><Download size={18} /> Скачать JSON</button>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 font-medium text-slate-700"><Upload size={18} /> Загрузить JSON<input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} /></label>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Все изменения сохраняются в браузере через localStorage. Можно добавить API‑слой: POST /weekly-facts, GET /dashboard, POST /budget-facts, POST /model-settings.</div>
        </Card>
        <Card>
          <SectionTitle eyebrow="API-схема" title="Контракт для разработчиков" />
          <pre className="max-h-[520px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{`POST /api/weekly-facts
{
  week, date, revenue, avgCheck, frequency,
  onlineShare, cardShare, activeCards, nsmRevenue,
  margin, incrProfit, marketingSpend, nps,
  repeatOnline30, pickupShare
}

POST /api/budget-facts
{ channel, fact, factRomi }

POST /api/model-settings
{ revenue, avgCheck, margin, activeCards, targets... }

GET /api/dashboard?week=12
→ возвращает карточки, план-факт, темп, индекс KPI`}</pre>
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

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ model, weeks, budget, selectedWeek })); }, [model, weeks, budget, selectedWeek]);

  const activeView = {
    dashboard: <Dashboard model={model} weeks={weeks} budget={budget} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />,
    calculator: <Calculator model={model} setModel={setModel} />,
    data: <DataHub weeks={weeks} setWeeks={setWeeks} budget={budget} setBudget={setBudget} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />,
    settings: <SettingsPage model={model} weeks={weeks} budget={budget} setWeeks={setWeeks} setBudget={setBudget} setModel={setModel} />,
  }[activeTab];

  return <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>{activeView}</AppShell>;
}
