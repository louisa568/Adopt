import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function HealthItem({ label, done }) {
  return (
    <li className="flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2 text-sm">
      <span className="text-stone-700">{label}</span>
      <span className={done ? "text-emerald-700" : "text-amber-700"}>
        {done ? "已完成" : "待完成"}
      </span>
    </li>
  );
}

export default function PetDetailsPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { pets, user, completeVerification, getUserById, openConversationWithUser } =
    useAppContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reportMsg, setReportMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const pet = useMemo(() => pets.find((item) => item.id === petId), [petId, pets]);
  const publisher = pet ? getUserById(pet.publisherId) : null;

  if (!pet) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md bg-[#fff8f1] px-4 py-8">
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-3xl">🔎</p>
          <p className="mt-2 text-sm text-stone-600">未找到该宠物信息</p>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white active:scale-[0.99]"
          >
            返回首页
          </button>
        </div>
      </main>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % pet.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + pet.images.length) % pet.images.length
    );
  };

  const startVerify = async () => {
    setIsVerifying(true);
    await completeVerification();
    setIsVerifying(false);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#fff8f1] pb-24">
      <section className="relative">
        <img
          src={pet.images[currentImageIndex]}
          alt={pet.name}
          className="h-72 w-full object-cover"
        />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-sm text-white backdrop-blur active:scale-95"
        >
          ←
        </button>
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={prevImage}
            className="rounded-full bg-black/40 px-2 py-1 text-xs text-white active:scale-95"
          >
            上一张
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="rounded-full bg-black/40 px-2 py-1 text-xs text-white active:scale-95"
          >
            下一张
          </button>
        </div>
      </section>

      <section className="space-y-3 px-4 py-4">
        <article className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-stone-800">{pet.name}</h1>
            <span className="text-sm text-stone-500">距你 {pet.distanceKm.toFixed(1)}km</span>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            {pet.city} · {pet.district}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pet.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-orange-50 px-2 py-1 text-xs text-orange-700"
              >
                {tag}
              </span>
            ))}
          </div>
          {publisher ? (
            <button
              type="button"
              onClick={() => navigate(`/users/${publisher.id}`)}
              className="mt-3 flex w-full items-center gap-2 rounded-xl border border-orange-100 px-3 py-2 text-left active:scale-[0.99]"
            >
              <img
                src={publisher.avatar}
                alt={publisher.nickname}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-medium text-stone-700">
                  发布者：{publisher.nickname}
                </p>
                <p className="text-[11px] text-stone-500">点击查看 TA 的主页</p>
              </div>
            </button>
          ) : null}
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-800">健康档案</h2>
          <ul className="mt-3 space-y-2">
            <HealthItem label="疫苗接种" done={pet.vaccinated} />
            <HealthItem label="驱虫状态" done={pet.dewormed} />
            <HealthItem label="绝育状态" done={pet.sterilized} />
          </ul>
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-800">送养人要求</h2>
          <ul className="mt-2 space-y-1 text-sm text-stone-600">
            {pet.requirements.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-red-700">防骗防强买强卖提醒</h2>
          <p className="mt-1 text-sm text-red-600">{pet.antiFraudTip}</p>
          <button
            type="button"
            onClick={() => setReportMsg("已提交举报线索，平台将尽快审核处理。")}
            className="mt-3 rounded-xl border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 active:scale-[0.99]"
          >
            一键举报
          </button>
          {reportMsg ? <p className="mt-2 text-xs text-red-700">{reportMsg}</p> : null}
        </article>
      </section>

      <footer className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md border-t border-orange-100 bg-white px-4 py-3">
        {!user.isLoggedIn ? (
          <Link
            to="/login"
            state={{ redirectTo: `/pets/${pet.id}/apply` }}
            className="block rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm active:scale-[0.99]"
          >
            登录后填写领养申请
          </Link>
        ) : user.isVerified ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                if (publisher) {
                  openConversationWithUser(publisher.id);
                  navigate(`/messages?user=${publisher.id}`);
                }
              }}
              className="rounded-xl border border-orange-200 bg-white px-4 py-3 text-center text-sm font-semibold text-orange-700 shadow-sm active:scale-[0.99]"
            >
              先发消息
            </button>
            <Link
              to={`/pets/${pet.id}/apply`}
              className="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm active:scale-[0.99]"
            >
              填写领养申请
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={startVerify}
            disabled={isVerifying}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60 active:scale-[0.99]"
          >
            {isVerifying ? "实名认证中..." : "先完成实名认证"}
          </button>
        )}
      </footer>
    </main>
  );
}
