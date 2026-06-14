import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function PublisherProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, getUserById, getPetsByPublisher, openConversationWithUser } =
    useAppContext();

  const publisher = getUserById(userId);
  const pets = useMemo(() => getPetsByPublisher(userId), [getPetsByPublisher, userId]);
  const reasons = [...new Set(pets.map((pet) => pet.story).filter(Boolean))];

  if (!publisher) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md bg-[#fff8f1] px-4 py-6">
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-3xl">👤</p>
          <p className="mt-2 text-sm text-stone-600">未找到该发布者主页</p>
        </div>
      </main>
    );
  }

  const startChat = () => {
    openConversationWithUser(publisher.id);
    if (!user.isLoggedIn) {
      navigate("/login", { state: { redirectTo: `/messages?user=${publisher.id}` } });
      return;
    }
    navigate(`/messages?user=${publisher.id}`);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#fff8f1] px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 rounded-xl bg-white px-3 py-2 text-xs text-stone-600 shadow-sm active:scale-95"
      >
        ← 返回
      </button>

      <article className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={publisher.avatar}
            alt={publisher.nickname}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-lg font-semibold text-stone-800">{publisher.nickname}</h1>
            <p className="text-sm text-stone-500">{publisher.bio}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <InfoCard label="所在城市" value={publisher.city} />
          <InfoCard label="发布宠物数" value={`${pets.length} 只`} />
        </div>
      </article>

      <article className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-800">送养原因</h2>
        <div className="mt-2 space-y-2">
          {reasons.length > 0 ? (
            reasons.map((reason) => (
              <p key={reason} className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-stone-600">
                {reason}
              </p>
            ))
          ) : (
            <p className="text-sm text-stone-500">暂无公开送养原因。</p>
          )}
        </div>
      </article>

      <article className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-800">发布中的宠物</h2>
        <div className="mt-2 space-y-2">
          {pets.map((pet) => (
            <button
              key={pet.id}
              type="button"
              onClick={() => navigate(`/pets/${pet.id}`)}
              className="flex w-full items-center justify-between rounded-xl bg-orange-50 px-3 py-2 text-left active:scale-[0.99]"
            >
              <span className="text-sm text-stone-700">{pet.name}</span>
              <span className="text-xs text-stone-500">查看详情</span>
            </button>
          ))}
        </div>
      </article>

      <button
        type="button"
        onClick={startChat}
        className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.99]"
      >
        发消息交流
      </button>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-orange-50 px-3 py-2">
      <p className="text-[11px] text-stone-500">{label}</p>
      <p className="text-sm font-semibold text-stone-700">{value}</p>
    </div>
  );
}
