import { useMemo, useState } from "react";
import BottomTabBar from "../components/BottomTabBar";
import { useAppContext } from "../context/AppContext";

export default function ProfilePage() {
  const { user, pets, applications, revisitTimeline, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState("my-pets");

  const myPets = useMemo(
    () =>
      pets.filter(
        (pet) => pet.contact === "通过平台私信联系" || pet.tags.includes("新发布")
      ),
    [pets]
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#fff8f1] pb-28">
      <section className="space-y-3 px-4 py-4">
        <article className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.nickname}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-lg font-semibold text-stone-800">{user.nickname}</h1>
                {user.isVerified ? <span className="text-amber-500">🟡V</span> : null}
              </div>
              <p className="text-sm text-stone-500">{user.bio}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2 text-sm">
            <span className="text-stone-700">
              认证状态：{user.isVerified ? "已实名" : "未实名"}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-orange-200 bg-white px-2 py-1 text-xs text-orange-700 active:scale-95"
            >
              退出登录
            </button>
          </div>
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("my-pets")}
              className={`rounded-full px-3 py-1 text-xs transition active:scale-95 ${
                activeTab === "my-pets"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-50 text-stone-600"
              }`}
            >
              我的发布
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("my-applications")}
              className={`rounded-full px-3 py-1 text-xs transition active:scale-95 ${
                activeTab === "my-applications"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-50 text-stone-600"
              }`}
            >
              我的申请
            </button>
          </div>

          {activeTab === "my-pets" ? (
            <div className="space-y-2">
              {myPets.length === 0 ? (
                <EmptyHint text="你还没有发布记录，去发布页试试吧。" />
              ) : (
                myPets.map((pet) => (
                  <p key={pet.id} className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-stone-700">
                    {pet.name} · {pet.district} · {pet.category}
                  </p>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {applications.length === 0 ? (
                <EmptyHint text="还没有提交领养申请，去首页看看可爱毛孩子。" />
              ) : (
                applications.map((application) => (
                  <p
                    key={application.id}
                    className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-stone-700"
                  >
                    已申请 {application.petName} · {application.housing} · {application.budget}
                  </p>
                ))
              )}
            </div>
          )}
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-800">云回访相册</h2>
          <p className="mt-1 text-xs text-stone-500">领养后每月上传近照（Mock 时间轴）</p>
          <div className="mt-3 space-y-3">
            {revisitTimeline.map((item) => (
              <div key={item.month} className="rounded-xl bg-orange-50 p-2">
                <p className="mb-2 text-xs font-medium text-orange-700">{item.month}</p>
                <img
                  src={item.photo}
                  alt={item.month}
                  className="h-28 w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </article>
      </section>

      <BottomTabBar currentTab="profile" />
    </main>
  );
}

function EmptyHint({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50 px-3 py-4 text-center">
      <p className="text-2xl">🌟</p>
      <p className="mt-1 text-xs text-stone-500">{text}</p>
    </div>
  );
}
