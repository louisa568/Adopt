import { useState } from "react";

function InfoChip({ children }) {
  return (
    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
      {children}
    </span>
  );
}

export default function PetDetailPage({
  pet,
  isVerified,
  hasApplied,
  onBack,
  onVerify,
  onApply,
}) {
  const [showAuthBlock, setShowAuthBlock] = useState(false);

  const handleApplyClick = () => {
    if (!isVerified) {
      setShowAuthBlock(true);
      return;
    }

    onApply?.(pet.id);
  };

  return (
    <section className="space-y-4 px-4 py-4">
      <button
        type="button"
        onClick={onBack}
        className="rounded-full border border-amber-200 bg-white px-3 py-1 text-sm text-stone-600"
      >
        ← 返回首页
      </button>

      <article className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
        <img src={pet.image} alt={pet.name} className="h-56 w-full object-cover" />
        <div className="space-y-4 p-4">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-800">{pet.name}</h2>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
              {pet.city}
            </span>
          </header>

          <div className="flex flex-wrap gap-2">
            <InfoChip>{pet.category}</InfoChip>
            <InfoChip>{pet.gender}</InfoChip>
            <InfoChip>{pet.ageGroup}</InfoChip>
            <InfoChip>{pet.sterilized ? "已绝育" : "未绝育"}</InfoChip>
            <InfoChip>{pet.vaccinated ? "已疫苗" : "待疫苗"}</InfoChip>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-stone-700">健康状况</h3>
            <p className="text-sm text-stone-600">{pet.health}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-stone-700">送养故事</h3>
            <p className="text-sm text-stone-600">{pet.story}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-stone-700">领养硬性要求</h3>
            <p className="text-sm text-stone-600">{pet.requirements}</p>
          </div>
        </div>
      </article>

      <button
        type="button"
        onClick={handleApplyClick}
        className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-600"
      >
        {hasApplied ? "进入沟通页" : "申请领养"}
      </button>

      {showAuthBlock && !isVerified ? (
        <section className="space-y-3 rounded-2xl border border-amber-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-stone-700">实名认证拦截</h3>
          <p className="text-sm text-stone-600">
            申请领养前，需完成手机号 + 实名认证。认证通过后才可查看送养人联系方式。
          </p>
          <button
            type="button"
            onClick={onVerify}
            className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700"
          >
            去完成实名认证（占位）
          </button>
        </section>
      ) : null}

      {isVerified && hasApplied ? (
        <section className="space-y-1 rounded-2xl border border-amber-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-stone-700">送养人联系方式</h3>
          <p className="text-sm text-stone-600">{pet.contact}</p>
          <p className="text-xs text-stone-400">当前为 MVP 占位，后续可替换为应用内聊天。</p>
        </section>
      ) : null}
    </section>
  );
}
