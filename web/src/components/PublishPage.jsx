import { useState } from "react";

const categoryOptions = ["猫", "狗", "其他"];
const genderOptions = ["公", "母"];
const ageOptions = ["幼年", "成年", "老年"];
const booleanOptions = [
  { label: "已完成", value: "yes" },
  { label: "未完成", value: "no" },
];

const initialForm = {
  name: "",
  category: "猫",
  gender: "公",
  ageGroup: "幼年",
  sterilized: "no",
  vaccinated: "no",
  city: "上海",
  health: "",
  story: "",
  requirements: "",
};

export default function PublishPage({ isVerified, city, onVerify, onPublish }) {
  const [form, setForm] = useState({ ...initialForm, city });
  const [photos, setPhotos] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [successText, setSuccessText] = useState("");

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 9) {
      setErrors((prev) => ({ ...prev, photos: "单次最多上传 9 张照片。" }));
      setPhotos([]);
      return;
    }

    setErrors((prev) => ({ ...prev, photos: "" }));
    setPhotos(files);
  };

  const validate = () => {
    const nextErrors = {};
    const requiredFields = ["name", "city", "health", "story", "requirements"];

    requiredFields.forEach((field) => {
      if (!form[field]?.trim()) {
        nextErrors[field] = "此项为必填";
      }
    });

    if (photos.length === 0) {
      nextErrors.photos = "请至少上传 1 张照片";
    }

    if (photos.length > 9) {
      nextErrors.photos = "单次最多上传 9 张照片";
    }

    if (!agreed) {
      nextErrors.agreement = "请先勾选防黑产承诺协议";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSuccessText("");
      return;
    }

    const coverImage = URL.createObjectURL(photos[0]);
    onPublish?.({
      id: `pet-${Date.now()}`,
      name: form.name.trim(),
      city: form.city.trim(),
      category: form.category,
      gender: form.gender,
      ageGroup: form.ageGroup,
      sterilized: form.sterilized === "yes",
      vaccinated: form.vaccinated === "yes",
      health: form.health.trim(),
      story: form.story.trim(),
      requirements: form.requirements.trim(),
      contact: "待审核通过后显示",
      image: coverImage,
      createdByMe: true,
    });

    setSuccessText("发布成功：已进入首页信息流（MVP 自动发布）。");
    setForm({ ...initialForm, city });
    setPhotos([]);
    setAgreed(false);
    setErrors({});
  };

  if (!isVerified) {
    return (
      <section className="space-y-3 px-4 py-4">
        <article className="rounded-2xl border border-amber-200 bg-white p-4">
          <h2 className="text-base font-semibold text-stone-700">发布前需要实名认证</h2>
          <p className="mt-2 text-sm text-stone-600">
            根据平台规则，必须完成手机号 + 实名认证，才能发布送养信息。
          </p>
          <button
            type="button"
            onClick={onVerify}
            className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white"
          >
            去实名认证（占位流程）
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="space-y-3 px-4 py-4">
      <h2 className="text-lg font-semibold text-stone-800">发布领养信息</h2>
      <p className="text-sm text-stone-600">照片必填，单次最多上传 9 张，标签字段使用结构化选项。</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block rounded-xl border border-amber-100 bg-white p-3">
          <span className="mb-1 block text-xs text-stone-500">上传照片（必填，最多 9 张）</span>
          <input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
          <p className="mt-1 text-xs text-stone-500">已选择 {photos.length} 张</p>
          {errors.photos ? <p className="mt-1 text-xs text-red-500">{errors.photos}</p> : null}
        </label>

        <div className="grid grid-cols-2 gap-2">
          <FormInput
            label="宠物名字（必填）"
            value={form.name}
            onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            error={errors.name}
          />
          <FormInput
            label="所在城市（必填）"
            value={form.city}
            onChange={(value) => setForm((prev) => ({ ...prev, city: value }))}
            error={errors.city}
          />
          <FormSelect
            label="宠物类别"
            value={form.category}
            options={categoryOptions}
            onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
          />
          <FormSelect
            label="性别"
            value={form.gender}
            options={genderOptions}
            onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
          />
          <FormSelect
            label="年龄段"
            value={form.ageGroup}
            options={ageOptions}
            onChange={(value) => setForm((prev) => ({ ...prev, ageGroup: value }))}
          />
          <FormSelect
            label="绝育状态"
            value={form.sterilized}
            options={booleanOptions.map((item) => item.value)}
            optionLabelMap={{ yes: "已绝育", no: "未绝育" }}
            onChange={(value) => setForm((prev) => ({ ...prev, sterilized: value }))}
          />
          <FormSelect
            label="疫苗状态"
            value={form.vaccinated}
            options={booleanOptions.map((item) => item.value)}
            optionLabelMap={{ yes: "已疫苗", no: "待疫苗" }}
            onChange={(value) => setForm((prev) => ({ ...prev, vaccinated: value }))}
          />
        </div>

        <FormTextarea
          label="健康状况（必填）"
          value={form.health}
          onChange={(value) => setForm((prev) => ({ ...prev, health: value }))}
          error={errors.health}
        />
        <FormTextarea
          label="送养故事（必填）"
          value={form.story}
          onChange={(value) => setForm((prev) => ({ ...prev, story: value }))}
          error={errors.story}
        />
        <FormTextarea
          label="领养要求（必填）"
          value={form.requirements}
          onChange={(value) => setForm((prev) => ({ ...prev, requirements: value }))}
          error={errors.requirements}
        />

        <label className="block rounded-xl border border-amber-100 bg-white p-3 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mr-2"
          />
          我承诺不强制捆绑销售宠物用品，不收取高额非监管押金。
          {errors.agreement ? <p className="mt-1 text-xs text-red-500">{errors.agreement}</p> : null}
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white"
        >
          提交发布
        </button>
      </form>

      {successText ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successText}
        </p>
      ) : null}
    </section>
  );
}

function FormInput({ label, value, onChange, error }) {
  return (
    <label className="block rounded-xl border border-amber-100 bg-white p-3">
      <span className="mb-1 block text-xs text-stone-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm text-stone-800 outline-none"
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </label>
  );
}

function FormSelect({ label, value, options, optionLabelMap = {}, onChange }) {
  return (
    <label className="block rounded-xl border border-amber-100 bg-white p-3">
      <span className="mb-1 block text-xs text-stone-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm text-stone-800 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabelMap[option] || option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormTextarea({ label, value, onChange, error }) {
  return (
    <label className="block rounded-xl border border-amber-100 bg-white p-3">
      <span className="mb-1 block text-xs text-stone-500">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="w-full resize-none bg-transparent text-sm text-stone-800 outline-none"
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </label>
  );
}
