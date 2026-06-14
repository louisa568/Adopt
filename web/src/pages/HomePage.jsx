import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import { useAppContext } from "../context/AppContext";

const feedTabs = ["全部", "猫", "狗", "幼年", "绝育", "急寻领养"];

export default function HomePage() {
  const navigate = useNavigate();
  const { pets } = useAppContext();
  const [activeTab, setActiveTab] = useState("全部");

  const filteredPets = useMemo(() => {
    if (activeTab === "全部") {
      return pets;
    }

    return pets.filter((pet) => {
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
    });
  }, [activeTab, pets]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#fff8f1] pb-28">
      <header className="sticky top-0 z-10 border-b border-orange-100 bg-[#fff8f1]/95 px-4 py-3 backdrop-blur">
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
                  ? "bg-orange-500 text-white"
                  : "bg-white text-stone-600 shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <section className="columns-2 gap-3 px-3 py-3">
        {filteredPets.map((pet) => (
          <article
            key={pet.id}
            className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => navigate(`/pets/${pet.id}`)}
              className="w-full text-left active:scale-[0.995]"
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
                      className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] text-orange-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          </article>
        ))}
      </section>

      {filteredPets.length === 0 ? (
        <section className="px-4 pb-24">
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl">🐾</p>
            <p className="mt-2 text-sm text-stone-600">暂时没有符合条件的宠物，试试切换筛选标签。</p>
          </div>
        </section>
      ) : null}

      <BottomTabBar currentTab="home" />
    </main>
  );
}
