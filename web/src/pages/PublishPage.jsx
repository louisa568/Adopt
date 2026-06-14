import { useState } from "react";
import BottomTabBar from "../components/BottomTabBar";
import VerificationGate from "../components/VerificationGate";
import { useAppContext } from "../context/AppContext";

export default function PublishPage() {
  const { user, publishPet } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    category: "猫",
    gender: "公",
    ageGroup: "幼年",
    sterilized: "未绝育",
    vaccinated: "待接种",
    dewormed: "已驱虫",
    reason: "",
    weakness: "",
    district: "",
    imageUrl: "",
    urgent: false,
  });
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.reason || !form.weakness || !form.district) {
      setMessage("请先填写所有核心字段。");
      return;
    }

    if (!agreed) {
      setMessage("请先勾选平台反黑产/反虐待承诺书。");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      await publishPet({
        name: form.name,
        district: form.district,
        category: form.category,
        gender: form.gender,
        ageGroup: form.ageGroup,
        sterilized: form.sterilized === "已绝育",
        vaccinated: form.vaccinated === "已接种",
        dewormed: form.dewormed === "已驱虫",
        urgent: form.urgent,
        tags: [form.category, form.ageGroup, form.urgent ? "急寻领养" : "送养中"],
        story: form.reason,
        requirements: ["限同城领养", "接受云回访", "线上签署电子协议"],
        images: form.imageUrl ? [form.imageUrl] : undefined,
      });

      setMessage("发布成功，已进入首页信息流。");
      setForm({
        name: "",
        category: "猫",
        gender: "公",
        ageGroup: "幼年",
        sterilized: "未绝育",
        vaccinated: "待接种",
        dewormed: "已驱虫",
        reason: "",
        weakness: "",
        district: "",
        imageUrl: "",
        urgent: false,
      });
      setAgreed(false);
    } catch (error) {
      setMessage(error.message || "发布失败，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#f5f6fb] pb-28">
      <section className="px-4 py-4">
        <header className="mb-3">
          <h1 className="text-lg font-semibold text-stone-800">发布送养</h1>
          <p className="text-sm text-stone-500">完整填写信息可显著提升匹配效率</p>
        </header>

        {!user.isVerified ? <VerificationGate /> : null}

        {user.isVerified ? (
          <form onSubmit={handleSubmit} className="space-y-3 transition-all duration-300">
            <Field label="宠物照片（URL 占位）">
              <input
                value={form.imageUrl}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                }
                placeholder="粘贴图片链接（可选）"
                className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none"
              />
            </Field>

            <Field label="宠物名字 *">
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none"
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <SelectField
                label="类别"
                value={form.category}
                options={["猫", "狗", "其他"]}
                onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              />
              <SelectField
                label="性别"
                value={form.gender}
                options={["公", "母"]}
                onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
              />
              <SelectField
                label="年龄"
                value={form.ageGroup}
                options={["幼年", "成年", "老年"]}
                onChange={(value) => setForm((prev) => ({ ...prev, ageGroup: value }))}
              />
              <SelectField
                label="绝育状态"
                value={form.sterilized}
                options={["已绝育", "未绝育"]}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, sterilized: value }))
                }
              />
              <SelectField
                label="疫苗状态"
                value={form.vaccinated}
                options={["已接种", "待接种"]}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, vaccinated: value }))
                }
              />
              <SelectField
                label="驱虫状态"
                value={form.dewormed}
                options={["已驱虫", "待驱虫"]}
                onChange={(value) => setForm((prev) => ({ ...prev, dewormed: value }))}
              />
            </div>

            <Field label="真实送养原因 *">
              <textarea
                rows={3}
                value={form.reason}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, reason: event.target.value }))
                }
                className="mt-1 w-full resize-none rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none"
              />
            </Field>

            <Field label="宠物性格缺点（防退回）*">
              <textarea
                rows={3}
                value={form.weakness}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, weakness: event.target.value }))
                }
                className="mt-1 w-full resize-none rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none"
              />
            </Field>

            <Field label="所在区域（精确到街道）*">
              <input
                value={form.district}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, district: event.target.value }))
                }
                placeholder="例如：西湖区转塘街道"
                className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none"
              />
            </Field>

            <label className="flex items-start gap-2 rounded-2xl bg-white p-4 text-sm text-stone-700 shadow-sm">
              <input
                type="checkbox"
                checked={form.urgent}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, urgent: event.target.checked }))
                }
                className="mt-0.5"
              />
              标记为“急寻领养”（将高亮置顶展示）
            </label>

            <label className="flex items-start gap-2 rounded-2xl bg-white p-4 text-sm text-stone-700 shadow-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-0.5"
              />
              我已阅读并同意平台反黑产/反虐待承诺书：不收取非监管押金，不捆绑销售用品。
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.99] disabled:opacity-60"
            >
              {isSubmitting ? "提交中..." : "提交发布"}
            </button>

            {message ? (
              <p className="rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-700">
                {message}
              </p>
            ) : null}
          </form>
        ) : null}
      </section>
      <BottomTabBar currentTab="publish" />
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block rounded-2xl bg-white p-4 shadow-sm">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block rounded-2xl bg-white p-4 shadow-sm">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none"
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
