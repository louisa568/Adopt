export default function ProfilePage({
  isVerified,
  onVerify,
  myPublishedPets,
  adoptedPets,
}) {
  return (
    <section className="space-y-4 px-4 py-4">
      <article className="rounded-2xl border border-amber-100 bg-white p-4">
        <p className="text-xs text-stone-500">个人中心</p>
        <h2 className="text-lg font-semibold text-stone-800">我的主页</h2>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2">
          <span className="text-sm text-stone-700">
            实名认证状态：{isVerified ? "已完成" : "未完成"}
          </span>
          {!isVerified ? (
            <button
              type="button"
              onClick={onVerify}
              className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-medium text-white"
            >
              去认证
            </button>
          ) : null}
        </div>
      </article>

      <article className="rounded-2xl border border-amber-100 bg-white p-4">
        <h3 className="text-sm font-semibold text-stone-700">我发布的</h3>
        <p className="mt-1 text-xs text-stone-500">共 {myPublishedPets.length} 条</p>
        <div className="mt-3 space-y-2">
          {myPublishedPets.length > 0 ? (
            myPublishedPets.slice(0, 3).map((pet) => (
              <p key={pet.id} className="text-sm text-stone-600">
                • {pet.name}（{pet.city} / {pet.category}）
              </p>
            ))
          ) : (
            <p className="text-sm text-stone-500">还没有发布记录，点击底部 + 开始发布。</p>
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-amber-100 bg-white p-4">
        <h3 className="text-sm font-semibold text-stone-700">我领养的</h3>
        <p className="mt-1 text-xs text-stone-500">共 {adoptedPets.length} 条</p>
        <div className="mt-3 space-y-2">
          {adoptedPets.length > 0 ? (
            adoptedPets.map((pet) => (
              <p key={pet.id} className="text-sm text-stone-600">
                • {pet.name}（{pet.ageGroup} / {pet.category}）
              </p>
            ))
          ) : (
            <p className="text-sm text-stone-500">暂无领养记录。</p>
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-amber-100 bg-white p-4">
        <h3 className="text-sm font-semibold text-stone-700">云回访打卡本</h3>
        <p className="mt-1 text-xs text-stone-500">MVP 占位：每月提醒领养人上传近照，仅送养人可见。</p>
        <div className="mt-3 space-y-2 text-sm text-stone-600">
          <p>2026-06：待上传本月近照</p>
          <p>2026-05：已上传（示例）</p>
        </div>
      </article>
    </section>
  );
}
