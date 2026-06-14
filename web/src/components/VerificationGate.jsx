import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function VerificationGate({ title = "需要完成实名认证" }) {
  const { completeVerification } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      await completeVerification();
      setMessage("实名认证已完成，现在可以继续操作。");
    } catch (error) {
      setMessage(error.message || "实名认证失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-stone-800">{title}</h2>
      <p className="mt-2 text-sm text-stone-600">
        为保障宠物与资金安全，发起领养申请和发布送养信息前需要先完成实名认证。
      </p>
      <button
        type="button"
        onClick={handleVerify}
        disabled={isLoading}
        className="mt-4 w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 active:scale-[0.99]"
      >
        {isLoading ? "认证中..." : "提交实名认证（Mock）"}
      </button>
      {message ? (
        <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {message}
        </p>
      ) : null}
    </section>
  );
}
