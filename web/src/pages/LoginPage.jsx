import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function LoginPage() {
  const { user, login } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(
    () => location.state?.redirectTo || "/home",
    [location.state]
  );

  if (user.isLoggedIn) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md bg-[#f5f6fb] px-4 py-8">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-lg font-semibold text-stone-800">你已经登录</h1>
          <p className="mt-2 text-sm text-stone-600">当前账号：{user.phone}</p>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="mt-4 w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white active:scale-[0.99]"
          >
            返回首页
          </button>
        </section>
      </main>
    );
  }

  const handleSendCode = () => {
    if (!phone.trim()) {
      setMessage("请先输入手机号。");
      return;
    }

    setMessage("验证码已发送（开发阶段占位）。请输入你收到的验证码后继续。");
  };

  const handleLogin = async () => {
    if (!phone.trim()) {
      setMessage("请输入手机号。");
      return;
    }

    if (!code.trim()) {
      setMessage("请输入验证码。");
      return;
    }

    if (!privacyAgreed) {
      setMessage("请先勾选用户隐私协议。");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      await login({ phone: phone.trim() });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(error.message || "登录失败，请检查 Supabase 配置");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#f5f6fb] px-4 py-6">
      <section className="rounded-2xl bg-white p-5 shadow-sm transition-all duration-300">
        <h1 className="text-xl font-semibold text-stone-800">登录 / 注册</h1>
        <p className="mt-1 text-sm text-stone-500">手机号 + 验证码登录（Mock）</p>

        <div className="mt-4 space-y-3">
          <label className="block rounded-xl border border-violet-100 bg-violet-50/60 px-3 py-2">
            <span className="text-xs text-stone-500">手机号</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="请输入手机号"
              className="mt-1 w-full bg-transparent text-sm text-stone-800 outline-none"
            />
          </label>

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <label className="rounded-xl border border-violet-100 bg-violet-50/60 px-3 py-2">
              <span className="text-xs text-stone-500">验证码</span>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="请输入验证码"
                className="mt-1 w-full bg-transparent text-sm text-stone-800 outline-none"
              />
            </label>
            <button
              type="button"
              onClick={handleSendCode}
              className="rounded-xl border border-violet-200 bg-white px-3 text-sm font-medium text-violet-700 active:scale-[0.99]"
            >
              获取验证码
            </button>
          </div>

          <label className="flex items-start gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={privacyAgreed}
              onChange={(event) => setPrivacyAgreed(event.target.checked)}
              className="mt-0.5"
            />
            我已阅读并同意《用户服务协议》和《隐私协议》
          </label>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting ? "登录中..." : "立即登录"}
          </button>
        </div>

        {message ? (
          <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-700">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
