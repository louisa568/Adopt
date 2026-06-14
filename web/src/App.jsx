import { useEffect, useMemo, useState } from "react";
import BottomNav from "./components/BottomNav";
import PetCard from "./components/PetCard";
import { petList } from "./data/pets";

const filterGroups = [
  { key: "category", label: "类别", options: ["全部", "猫", "狗", "其他"] },
  { key: "gender", label: "性别", options: ["全部", "公", "母"] },
  { key: "ageGroup", label: "年龄", options: ["全部", "幼年", "成年", "老年"] },
  { key: "sterilized", label: "绝育", options: ["全部", "已绝育", "未绝育"] },
  { key: "vaccinated", label: "疫苗", options: ["全部", "已疫苗", "待疫苗"] },
];

function App() {
  const [city] = useState("上海");
  const [sameCityOnly, setSameCityOnly] = useState(false);
  const [locationTip, setLocationTip] = useState("正在获取位置授权...");
  const [filters, setFilters] = useState({
    category: "全部",
    gender: "全部",
    ageGroup: "全部",
    sterilized: "全部",
    vaccinated: "全部",
  });

  const filteredPets = useMemo(() => {
    const list = petList.filter((pet) => {
      const categoryMatch =
        filters.category === "全部" || pet.category === filters.category;
      const genderMatch = filters.gender === "全部" || pet.gender === filters.gender;
      const ageMatch =
        filters.ageGroup === "全部" || pet.ageGroup === filters.ageGroup;
      const sterilizedMatch =
        filters.sterilized === "全部" ||
        (filters.sterilized === "已绝育" ? pet.sterilized : !pet.sterilized);
      const vaccinatedMatch =
        filters.vaccinated === "全部" ||
        (filters.vaccinated === "已疫苗" ? pet.vaccinated : !pet.vaccinated);
      const cityMatch = !sameCityOnly || pet.city === city;

      return (
        categoryMatch &&
        genderMatch &&
        ageMatch &&
        sterilizedMatch &&
        vaccinatedMatch &&
        cityMatch
      );
    });

    return list.sort((a, b) => {
      const aScore = a.city === city ? 1 : 0;
      const bScore = b.city === city ? 1 : 0;
      return bScore - aScore;
    });
  }, [city, filters, sameCityOnly]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationTip("设备不支持定位，已按默认城市推荐");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => setLocationTip("定位成功，信息流已按同城优先排序"),
      () => setLocationTip("定位失败，当前展示默认城市推荐"),
      { timeout: 6000 }
    );
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#FFF9F1] pb-28">
      <header className="sticky top-0 z-10 space-y-3 border-b border-amber-100 bg-[#FFF9F1]/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-600">暖爪领养</p>
            <h1 className="text-xl font-semibold text-stone-800">同城领养信息流</h1>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
            📍 当前城市：{city}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2 text-sm">
          <p className="text-stone-700">{locationTip}</p>
          <button
            type="button"
            onClick={() => setSameCityOnly((value) => !value)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              sameCityOnly
                ? "bg-orange-500 text-white"
                : "bg-white text-stone-600 border border-amber-200"
            }`}
          >
            {sameCityOnly ? "仅看同城" : "查看全部"}
          </button>
        </div>
      </header>

      <section className="space-y-3 px-4 py-4">
        <h2 className="text-base font-medium text-stone-700">快捷筛选</h2>
        <div className="grid grid-cols-2 gap-2">
          {filterGroups.map((group) => (
            <label
              key={group.key}
              className="flex flex-col rounded-xl border border-amber-100 bg-white px-3 py-2"
            >
              <span className="mb-1 text-xs text-stone-500">{group.label}</span>
              <select
                value={filters[group.key]}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, [group.key]: event.target.value }))
                }
                className="bg-transparent text-sm text-stone-800 focus:outline-none"
              >
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-stone-700">待领养宠物</h2>
          <span className="text-xs text-stone-500">共 {filteredPets.length} 条</span>
        </div>

        {filteredPets.length > 0 ? (
          <div className="space-y-3">
            {filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-amber-200 bg-white p-6 text-center text-sm text-stone-500">
            当前筛选条件下暂无宠物，建议放宽条件后再试。
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

export default App;
