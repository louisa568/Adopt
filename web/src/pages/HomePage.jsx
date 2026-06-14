import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import { useAppContext } from "../context/AppContext";

const feedTabs = ["全部", "猫", "狗", "幼年", "绝育", "急寻领养"];
const initialFilters = {
  category: "全部",
  ageGroup: "全部",
  gender: "全部",
  sterilized: "全部",
  vaccinated: "全部",
};

export default function HomePage() {
  const navigate = useNavigate();
  const { pets, getUserById, isDataLoading, appError } = useAppContext();
  const [activeTab, setActiveTab] = useState("全部");
  const [filters, setFilters] = useState(initialFilters);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const baseTabPass = (() => {
        if (activeTab === "全部") {
          return true;
        }
        if (activeTab === "猫" || activeTab === "狗") {
          return pet.category === activeTab;
        }
        if (activeTab === "幼年") {
          return pet.ageGroup === "幼年";
        }
        if (activeTab === "绝育") {
          return pet.sterilized;
        }
        if (activeTab === "急寻领养") {
          return pet.urgent;
        }
        return true;
      })();

      if (!baseTabPass) {
        return false;
      }

      const categoryPass =
        filters.category === "全部" || pet.category === filters.category;
      const agePass =
        filters.ageGroup === "全部" || pet.ageGroup === filters.ageGroup;
      const genderPass =
        filters.gender === "全部" || pet.gender === filters.gender;
      const sterilizedPass =
        filters.sterilized === "全部" ||
        (filters.sterilized === "已绝育" ? pet.sterilized : !pet.sterilized);
      const vaccinatedPass =
        filters.vaccinated === "全部" ||
        (filters.vaccinated === "已疫苗" ? pet.vaccinated : !pet.vaccinated);

      return (
        categoryPass &&
        agePass &&
        genderPass &&
        sterilizedPass &&
        vaccinatedPass
      );
    });
  }, [activeTab, filters, pets]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#f5f6fb] pb-28">
      <header className="sticky top-0 z-10 border-b border-violet-100 bg-[#f5f6fb]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">当前城市</p>
            <h1 className="text-lg font-semibold text-stone-800">杭州市</h1>
          </div>
          <button
            type="button"
            className="rounded-full bg-white p-2 text-lg shadow-sm transition active:scale-95"
            aria-label="搜索"
          >
            🔍
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {feedTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition active:scale-95 ${
                activeTab === tab
                  ? "bg-violet-500 text-white"
                  : "bg-white text-stone-600 shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-stone-600">高级筛选</p>
            <button
              type="button"
              onClick={() => setFilters(initialFilters)}
              className="rounded-lg bg-violet-50 px-2 py-1 text-[11px] text-violet-700 active:scale-95"
            >
              重置
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FilterSelect
              label="种类"
              value={filters.category}
              options={["全部", "猫", "狗", "其他"]}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, category: value }))
              }
            />
            <FilterSelect
              label="年龄"
              value={filters.ageGroup}
              options={["全部", "幼年", "成年", "老年"]}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, ageGroup: value }))
              }
            />
            <FilterSelect
              label="公母"
              value={filters.gender}
              options={["全部", "公", "母"]}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, gender: value }))
              }
            />
            <FilterSelect
              label="绝育"
              value={filters.sterilized}
              options={["全部", "已绝育", "未绝育"]}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, sterilized: value }))
              }
            />
            <FilterSelect
              label="疫苗"
              value={filters.vaccinated}
              options={["全部", "已疫苗", "待疫苗"]}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, vaccinated: value }))
              }
            />
          </div>
        </section>
      </header>

      {appError ? (
        <section className="px-3 pt-3">
          <div className="rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs text-violet-700">
            {appError}
          </div>
        </section>
      ) : null}

      {isDataLoading ? (
        <section className="px-3 py-3">
          <div className="rounded-2xl bg-white p-5 text-center text-sm text-stone-500 shadow-sm">
            正在加载宠物信息...
          </div>
        </section>
      ) : null}

      {!isDataLoading ? (
      <section className="columns-2 gap-3 px-3 py-3">
        {filteredPets.map((pet) => (
          <article key={pet.id} className="mb-3 break-inside-avoid rounded-2xl bg-white shadow-sm">
            <button
              type="button"
              onClick={() => navigate(`/pets/${pet.id}`)}
              className="w-full overflow-hidden text-left active:scale-[0.995]"
            >
              <div className="relative">
                <img
                  src={pet.images[0]}
                  alt={pet.name}
                  className="h-40 w-full object-cover"
                />
                {pet.urgent ? (
                  <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-semibold text-white">
                    紧急救助
                  </span>
                ) : null}
              </div>
              <div className="space-y-1 p-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-stone-800">{pet.name}</h2>
                  <span className="text-xs text-stone-500">
                    {pet.gender === "公" ? "♂" : "♀"}
                  </span>
                </div>
                <p className="text-xs text-stone-500">距你 {pet.distanceKm.toFixed(1)} km</p>
                <div className="flex flex-wrap gap-1">
                  {pet.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>

            <div className="px-3 pb-3">
              <button
                type="button"
                onClick={() => navigate(`/users/${pet.publisherId}`)}
                className="flex w-full items-center gap-2 rounded-xl border border-violet-100 px-2 py-2 text-left active:scale-[0.99]"
              >
                <img
                  src={getUserById(pet.publisherId)?.avatar}
                  alt={getUserById(pet.publisherId)?.nickname || "发布者"}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-stone-700">
                    {getUserById(pet.publisherId)?.nickname || "发布者"}
                  </p>
                  <p className="truncate text-[11px] text-stone-500">点击查看发布者主页</p>
                </div>
              </button>
            </div>
          </article>
        ))}
      </section>
      ) : null}

      {!isDataLoading && filteredPets.length === 0 ? (
        <section className="px-4 pb-24">
          <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl">🐾</p>
            <p className="mt-2 text-sm text-stone-600">暂时没有符合条件的宠物，试试切换筛选标签。</p>
          </div>
        </section>
      ) : null}

      <BottomTabBar currentTab="home" />
    </main>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-stone-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-violet-100 bg-violet-50/60 px-2 py-1.5 text-xs text-stone-700 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
