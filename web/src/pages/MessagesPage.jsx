import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import { useAppContext } from "../context/AppContext";

export default function MessagesPage() {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("user");
  const {
    user,
    publishers,
    conversationPeers,
    getUserById,
    getConversationWithUser,
    openConversationWithUser,
    sendMessageToUser,
  } = useAppContext();
  const [selectedUserId, setSelectedUserId] = useState(targetUserId || null);
  const [draft, setDraft] = useState("");

  const peerOptions = useMemo(() => {
    const base = new Set(conversationPeers);
    if (targetUserId) {
      base.add(targetUserId);
    }
    publishers.forEach((publisher) => base.add(publisher.id));
    return [...base].filter((peerId) => peerId !== user.userId);
  }, [conversationPeers, publishers, targetUserId, user.userId]);

  useEffect(() => {
    if (targetUserId) {
      setSelectedUserId(targetUserId);
      openConversationWithUser(targetUserId);
      return;
    }

    if (!selectedUserId && peerOptions.length > 0) {
      setSelectedUserId(peerOptions[0]);
    }
  }, [openConversationWithUser, peerOptions, selectedUserId, targetUserId]);

  const messages = selectedUserId
    ? getConversationWithUser(selectedUserId)
    : [];
  const selectedUser = selectedUserId ? getUserById(selectedUserId) : null;

  const send = () => {
    if (!selectedUserId) {
      return;
    }
    sendMessageToUser(selectedUserId, draft);
    setDraft("");
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#fff8f1] pb-28">
      <header className="border-b border-orange-100 bg-[#fff8f1] px-4 py-3">
        <h1 className="text-lg font-semibold text-stone-800">信息</h1>
        <p className="text-xs text-stone-500">与送养人沟通领养细节（Mock）</p>
      </header>

      <section className="grid grid-cols-[9rem_1fr] gap-2 px-2 py-3">
        <aside className="space-y-2 overflow-y-auto pr-1">
          {peerOptions.map((peerId) => {
            const peer = getUserById(peerId);
            const active = peerId === selectedUserId;
            return (
              <button
                key={peerId}
                type="button"
                onClick={() => {
                  setSelectedUserId(peerId);
                  openConversationWithUser(peerId);
                }}
                className={`w-full rounded-xl border px-2 py-2 text-left text-xs active:scale-[0.99] ${
                  active
                    ? "border-orange-300 bg-orange-50"
                    : "border-transparent bg-white shadow-sm"
                }`}
              >
                <p className="truncate font-medium text-stone-700">{peer?.nickname || "用户"}</p>
                <p className="truncate text-[11px] text-stone-500">{peer?.city || "同城"}</p>
              </button>
            );
          })}
        </aside>

        <article className="flex min-h-[70vh] flex-col rounded-2xl bg-white p-3 shadow-sm">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-2 border-b border-orange-100 pb-2">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.nickname}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    {selectedUser.nickname}
                  </p>
                  <p className="text-[11px] text-stone-500">{selectedUser.city}</p>
                </div>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto py-3">
                {messages.length === 0 ? (
                  <p className="rounded-xl bg-orange-50 px-3 py-2 text-xs text-stone-500">
                    还没有消息，先发一句问候吧。
                  </p>
                ) : (
                  messages.map((message) => {
                    const mine = message.fromUserId === user.userId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <p
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-5 ${
                            mine
                              ? "bg-orange-500 text-white"
                              : "bg-orange-50 text-stone-700"
                          }`}
                        >
                          {message.text}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-orange-100 pt-2">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="输入消息..."
                  className="flex-1 rounded-xl border border-orange-100 px-3 py-2 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={send}
                  className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white active:scale-[0.99]"
                >
                  发送
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-500">请选择一个联系人开始沟通。</p>
          )}
        </article>
      </section>

      <BottomTabBar currentTab="messages" />
    </main>
  );
}
