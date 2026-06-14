import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VerificationGate from "../components/VerificationGate";
import { useAppContext } from "../context/AppContext";

const housingOptions = ["自有住房", "整租", "合租"];
const expOptions = ["无经验", "有猫狗经验", "有救助经验"];
const budgetOptions = ["300-500/月", "500-800/月", "800+/月"];

export default function ApplicationFormPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { pets, user, submitApplication } = useAppContext();
  const [form, setForm] = useState({
    housing: "自有住房",
    familyAgree: "同意",
    experience: "无经验",
    budget: "300-500/月",
    note: "",
  });
  const [acceptedVisit, setAcceptedVisit] = useState(false);
  const [acceptedNoAbandon, setAcceptedNoAbandon] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pet = useMemo(() => pets.find((item) => item.id === petId), [petId, pets]);

  if (!pet) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md bg-[#f5f6fb] px-4 py-6">
        <div className="rounded-2xl bg-white p-5 text-sm text-stone-600 shadow-sm">
          该宠物不存在或已下架。
        </div>
      </main>
    );
  }

  if (!user.isVerified) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md bg-[#f5f6fb] px-4 py-6">
        <VerificationGate title="填写领养申请前，请先完成实名认证" />
      </main>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!acceptedVisit || !acceptedNoAbandon) {
      setSubmitMsg("请先勾选两项承诺后再提交。");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMsg("");
      await submitApplication({
        petId: pet.id,
        petName: pet.name,
        ...form,
      });
      setSubmitMsg("申请已发送给送养人，请留意后续沟通通知。");
    } catch (error) {
      setSubmitMsg(error.message || "提交失败，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#f5f6fb] px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg bg-white px-3 py-1 text-sm text-stone-600 shadow-sm active:scale-95"
        >
          ← 返回
        </button>
        <h1 className="text-base font-semibold text-stone-800">领养申请表</h1>
        <span className="w-12" />
      </header>

      <form onSubmit={handleSubmit} className="space-y-3">
        <article className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-xs leading-5 text-violet-700 shadow-sm">
          流程说明：提交结构化申请表 → 送养人审核 → 线上签订标准化电子协议 →
          同城线下交接。
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-stone-600">
            申请对象：<span className="font-semibold text-stone-800">{pet.name}</span>
          </p>
        </article>

        <FormSelect
          label="居住环境"
          value={form.housing}
          options={housingOptions}
          onChange={(value) => setForm((prev) => ({ ...prev, housing: value }))}
        />
        <FormSelect
          label="同住人是否同意"
          value={form.familyAgree}
          options={["同意", "暂未完全同意"]}
          onChange={(value) => setForm((prev) => ({ ...prev, familyAgree: value }))}
        />
        <FormSelect
          label="养宠经验"
          value={form.experience}
          options={expOptions}
          onChange={(value) => setForm((prev) => ({ ...prev, experience: value }))}
        />
        <FormSelect
          label="预算区间"
          value={form.budget}
          options={budgetOptions}
          onChange={(value) => setForm((prev) => ({ ...prev, budget: value }))}
        />

        <label className="block rounded-2xl bg-white p-4 shadow-sm">
          <span className="text-sm font-medium text-stone-700">补充说明（可选）</span>
          <textarea
            rows={3}
            value={form.note}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, note: event.target.value }))
            }
            placeholder="可填写作息、过往养宠经历等"
            className="mt-2 w-full resize-none rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none"
          />
        </label>

        <article className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
          <label className="flex items-start gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={acceptedVisit}
              onChange={(event) => setAcceptedVisit(event.target.checked)}
              className="mt-0.5"
            />
            接受平台云回访（每月近照打卡）
          </label>
          <label className="flex items-start gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={acceptedNoAbandon}
              onChange={(event) => setAcceptedNoAbandon(event.target.checked)}
              className="mt-0.5"
            />
            承诺绝不弃养，若无法继续饲养将优先联系送养方
          </label>
        </article>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? "提交中..." : "提交申请"}
        </button>

        {submitMsg ? (
          <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-700">
            {submitMsg}
          </p>
        ) : null}
      </form>
    </main>
  );
}

function FormSelect({ label, value, options, onChange }) {
  return (
    <label className="block rounded-2xl bg-white p-4 shadow-sm">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
