import { useNavigate } from "react-router-dom";

const tabs = [
  { key: "home", label: "首页", icon: "🏠", path: "/home" },
  { key: "publish", label: "发布", icon: "➕", path: "/publish" },
  { key: "profile", label: "我的", icon: "👤", path: "/profile" },
];

export default function BottomTabBar({ currentTab }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md border-t border-orange-100 bg-white/95 px-3 pb-4 pt-2 backdrop-blur">
      <ul className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;

          return (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => navigate(tab.path)}
                className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-1 text-xs transition active:scale-95 ${
                  isActive ? "text-orange-600" : "text-stone-500"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive ? "bg-orange-100" : "bg-stone-100"
                  }`}
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
