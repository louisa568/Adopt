const featureCards = [
  {
    title: "100% 实名认证",
    description: "送养人与领养人都需通过手机号 + 实名认证，降低交易和沟通风险。",
    icon: "🛡️",
  },
  {
    title: "标准化电子协议",
    description: "领养规则与回访义务标准化留存，减少口头约定带来的争议。",
    icon: "📄",
  },
  {
    title: "同城优先匹配",
    description: "基于地理位置优先推荐同城宠物，提升线下交接与回访效率。",
    icon: "📍",
  },
];

export default function LandingPage({ onLoginRegister, onBrowse }) {
  return (
    <section className="px-4 pb-8 pt-4">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-b from-orange-300 via-amber-200 to-[#fff2df] px-5 pb-8 pt-10 shadow-[0_24px_60px_rgba(251,146,60,0.22)]">
        <div className="absolute -top-8 -right-6 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-orange-100/70 blur-2xl" />

        <div className="relative flex min-h-[60vh] flex-col justify-between">
          <header className="space-y-4 pt-2 text-center">
            <p className="inline-flex rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs font-medium tracking-wide text-orange-700">
              Welcome
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight text-stone-800">
                暖爪领养
              </h1>
              <p className="mx-auto max-w-xs text-sm leading-6 text-stone-700">
                建立真实的宠物领养信任网络
              </p>
            </div>
          </header>

          <div className="space-y-3 pb-2">
            <button
              type="button"
              onClick={onLoginRegister}
              className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              登录 / 注册
            </button>
            <button
              type="button"
              onClick={onBrowse}
              className="w-full rounded-2xl border border-orange-200 bg-white/80 px-4 py-3 text-base font-medium text-orange-700 backdrop-blur transition hover:bg-white"
            >
              先逛逛（进入领养信息流）
            </button>
          </div>
        </div>
      </div>

      <section className="mt-5 space-y-3">
        <h2 className="px-1 text-sm font-medium text-stone-600">为什么选择暖爪领养</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {featureCards.map((item) => (
            <article
              key={item.title}
              className="min-h-36 min-w-[11rem] flex-1 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_12px_24px_rgba(148,123,87,0.12)]"
            >
              <p className="text-xl" aria-hidden="true">
                {item.icon}
              </p>
              <h3 className="mt-2 text-sm font-semibold text-stone-800">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-stone-500">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
