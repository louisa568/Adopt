const navItems = [
  { key: "home", label: "首页", icon: "🏠" },
  { key: "message", label: "沟通", icon: "💬" },
  { key: "profile", label: "我的", icon: "👤" },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md border-t border-amber-100 bg-white/95 px-4 pb-4 pt-2 backdrop-blur">
      <div className="relative flex items-end justify-between">
        <div className="flex w-2/5 justify-around">
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.key}
              type="button"
              className={`flex flex-col items-center gap-1 text-xs ${
                item.key === "home" ? "text-orange-600" : "text-stone-500"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="absolute left-1/2 top-[-26px] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-orange-500 text-3xl text-white shadow-lg transition hover:bg-orange-600"
          aria-label="发布领养"
        >
          +
        </button>

        <div className="flex w-2/5 justify-around">
          {navItems.slice(2).map((item) => (
            <button key={item.key} type="button" className="flex flex-col items-center gap-1 text-xs text-stone-500">
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
