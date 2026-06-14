import { useNavigate } from "react-router-dom";

const trustItems = [
  {
    title: "100%实名认证",
    description: "发布与申请关键行为均需实名，降低欺诈和隐私风险。",
    icon: "✅",
  },
  {
    title: "标准化电子协议",
    description: "领养责任线上留痕，减少口头约定争议，保障双方权益。",
    icon: "📄",
  },
  {
    title: "同城优先零距离",
    description: "LBS 智能推荐，优先同城交接，避免跨城活体运输风险。",
    icon: "📍",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#f5f6fb] px-4 pb-6 pt-4">
      <section className="relative isolate flex min-h-[72vh] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f4f2ff] via-[#ede9fe] to-[#ffffff] px-5 py-8 shadow-md transition-all duration-300">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-violet-200/55 blur-3xl" />

        <header className="relative space-y-4 text-center">
          <p className="mx-auto inline-flex rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm">
            NuanZhua Adoption
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-stone-800">
            暖爪——同城真实的
            <br />
            流浪动物领养网络
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-6 text-stone-700">
            让每一次领养都可追溯、可回访、可被信任。
          </p>
        </header>

        <div className="relative space-y-3">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-violet-600 active:scale-[0.99]"
          >
            登录 / 注册
          </button>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full rounded-2xl border border-violet-200 bg-white/90 px-4 py-3 text-base font-medium text-violet-700 shadow-sm transition active:scale-[0.99]"
          >
            先逛逛
          </button>
        </div>
      </section>

      <section className="mt-5">
        <div className="grid grid-cols-3 gap-2">
          {trustItems.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-white p-3 shadow-sm transition-all duration-300"
            >
              <p className="text-lg" aria-hidden="true">
                {item.icon}
              </p>
              <h2 className="mt-1 text-xs font-semibold leading-5 text-stone-800">
                {item.title}
              </h2>
              <p className="mt-1 text-[11px] leading-4 text-stone-500">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
