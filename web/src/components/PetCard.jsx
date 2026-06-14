function Tag({ children, highlighted = false }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${
        highlighted ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"
      }`}
    >
      {children}
    </span>
  );
}

export default function PetCard({ pet }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
      <img src={pet.image} alt={pet.name} className="h-44 w-full object-cover" />
      <div className="space-y-3 p-4">
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-800">{pet.name}</h3>
          <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600">
            {pet.city}
          </span>
        </header>

        <div className="flex flex-wrap gap-2">
          <Tag highlighted>{pet.category}</Tag>
          <Tag>{pet.gender}</Tag>
          <Tag>{pet.ageGroup}</Tag>
          <Tag>{pet.sterilized ? "已绝育" : "未绝育"}</Tag>
          <Tag>{pet.vaccinated ? "已疫苗" : "待疫苗"}</Tag>
        </div>

        <p className="text-sm text-stone-600">{pet.health}</p>
        <p className="text-sm text-stone-500">{pet.story}</p>

        <button
          type="button"
          className="w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          查看详情
        </button>
      </div>
    </article>
  );
}
