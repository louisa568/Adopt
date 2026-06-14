-- 暖爪领养 Supabase 初始化脚本
-- 在 Supabase SQL Editor 中执行本文件

create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key default gen_random_uuid()::text,
  phone text unique,
  nickname text not null default '暖爪用户',
  city text not null default '杭州市',
  bio text not null default '希望每只毛孩子都能被温柔对待。',
  avatar text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.pets (
  id text primary key default gen_random_uuid()::text,
  publisher_id text not null references public.users(id) on delete cascade,
  name text not null,
  city text not null default '杭州市',
  district text not null default '',
  distance_km numeric(6,2) not null default 0,
  published_at timestamptz not null default now(),
  urgent boolean not null default false,
  category text not null default '其他',
  gender text not null default '公',
  age_group text not null default '成年',
  sterilized boolean not null default false,
  vaccinated boolean not null default false,
  dewormed boolean not null default false,
  tags text[] not null default '{}',
  story text not null default '',
  requirements text[] not null default '{}',
  anti_fraud_tip text not null default '',
  contact text not null default '通过平台私信联系',
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id text primary key default gen_random_uuid()::text,
  applicant_id text not null references public.users(id) on delete cascade,
  pet_id text not null references public.pets(id) on delete cascade,
  pet_name text not null default '',
  housing text not null default '',
  family_agree text not null default '',
  experience text not null default '',
  budget text not null default '',
  note text not null default '',
  accepted_visit boolean not null default false,
  accepted_no_abandon boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id text primary key default gen_random_uuid()::text,
  from_user_id text not null references public.users(id) on delete cascade,
  to_user_id text not null references public.users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.revisit_logs (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.users(id) on delete cascade,
  month text not null,
  photo_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_pets_publisher_id on public.pets(publisher_id);
create index if not exists idx_pets_published_at on public.pets(published_at desc);
create index if not exists idx_messages_pair on public.messages(from_user_id, to_user_id);
create index if not exists idx_applications_applicant_id on public.applications(applicant_id);

-- 开发阶段默认开放（生产建议开启 RLS 并配置精细策略）
alter table public.users disable row level security;
alter table public.pets disable row level security;
alter table public.applications disable row level security;
alter table public.messages disable row level security;
alter table public.revisit_logs disable row level security;

insert into public.users (id, phone, nickname, city, bio, avatar, is_verified)
values
  ('visitor-0000', null, '游客', '杭州市', '欢迎来到暖爪领养', 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=300&q=80', false),
  ('publisher-01', null, '林小雨', '杭州市', '家里有一只原住民，做过3年救助志愿者。', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', true),
  ('publisher-02', null, '陈阿北', '杭州市', '希望每个毛孩子都能找到稳定家庭。', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', true),
  ('publisher-03', null, '赵小莓', '杭州市', '关注幼猫救助和回访，反对任何形式黑产。', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', true)
on conflict (id) do update
set
  nickname = excluded.nickname,
  city = excluded.city,
  bio = excluded.bio,
  avatar = excluded.avatar,
  is_verified = excluded.is_verified;

insert into public.pets (
  id, publisher_id, name, city, district, distance_km, published_at, urgent,
  category, gender, age_group, sterilized, vaccinated, dewormed,
  tags, story, requirements, anti_fraud_tip, contact, images
)
values
  (
    'pet-1001', 'publisher-01', '小橘', '杭州市', '西湖区', 1.2, '2026-06-14T08:20:00.000Z', true,
    '猫', '母', '幼年', false, true, true,
    array['亲人','会用猫砂','急寻领养'],
    '在雨夜被救助于停车场，恢复状态良好，特别粘人，喜欢安静陪伴。',
    array['必须封窗','接受云回访','限同城领养'],
    '任何形式的强制捆绑销售、诱导高额押金都属于违规行为，请第一时间举报。',
    '微信: nuanzhua-cat-01',
    array[
      'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=1200&q=80'
    ]
  ),
  (
    'pet-1002', 'publisher-02', '阿福', '杭州市', '滨江区', 2.5, '2026-06-14T07:10:00.000Z', false,
    '狗', '公', '成年', true, true, true,
    array['温顺','可牵引','适合家庭'],
    '原主人因异地工作无法继续照料，性格稳定，外出不爆冲。',
    array['每天遛狗至少2次','接受云回访','限同城领养'],
    '若送养方提出异常费用或指定购买用品，请保留证据并点击举报。',
    '微信: nuanzhua-dog-02',
    array[
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80'
    ]
  ),
  (
    'pet-1003', 'publisher-03', '奶糖', '杭州市', '拱墅区', 4.3, '2026-06-13T14:00:00.000Z', false,
    '猫', '母', '幼年', false, true, false,
    array['活泼','适合新手'],
    '小区绿化带救助，现阶段身体情况稳定，食欲良好。',
    array['必须封窗','按时免疫','接受云回访'],
    '平台不会要求你私下转押金，遇到可疑情况请立即举报。',
    '微信: nuanzhua-cat-03',
    array[
      'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=1200&q=80'
    ]
  ),
  (
    'pet-1004', 'publisher-02', '团子', '杭州市', '上城区', 0.8, '2026-06-14T06:50:00.000Z', true,
    '狗', '母', '幼年', false, false, true,
    array['急寻领养','小体型','粘人'],
    '临时安置点即将到期，急需稳定家庭接手照顾。',
    array['限同城领养','有固定作息','接受云回访'],
    '领养为公益行为，平台严禁以领养名义进行商业倒卖或附加销售。',
    '微信: nuanzhua-dog-04',
    array[
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80'
    ]
  )
on conflict (id) do update
set
  publisher_id = excluded.publisher_id,
  name = excluded.name,
  city = excluded.city,
  district = excluded.district,
  distance_km = excluded.distance_km,
  published_at = excluded.published_at,
  urgent = excluded.urgent,
  category = excluded.category,
  gender = excluded.gender,
  age_group = excluded.age_group,
  sterilized = excluded.sterilized,
  vaccinated = excluded.vaccinated,
  dewormed = excluded.dewormed,
  tags = excluded.tags,
  story = excluded.story,
  requirements = excluded.requirements,
  anti_fraud_tip = excluded.anti_fraud_tip,
  contact = excluded.contact,
  images = excluded.images;

insert into public.messages (id, from_user_id, to_user_id, text, created_at)
values
  ('msg-01', 'publisher-01', 'visitor-0000', '你好，感谢关注小橘，建议先看看领养要求。', '2026-06-14T06:10:00.000Z'),
  ('msg-02', 'publisher-02', 'visitor-0000', '阿福性格很稳定，欢迎先发申请表再沟通。', '2026-06-14T06:20:00.000Z')
on conflict (id) do update
set
  from_user_id = excluded.from_user_id,
  to_user_id = excluded.to_user_id,
  text = excluded.text,
  created_at = excluded.created_at;

insert into public.revisit_logs (id, user_id, month, photo_url, created_at)
values
  ('revisit-01', 'visitor-0000', '2026-06', 'https://images.unsplash.com/photo-1601758174638-4fce1f1fdb4f?auto=format&fit=crop&w=600&q=80', '2026-06-01T08:00:00.000Z'),
  ('revisit-02', 'visitor-0000', '2026-05', 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=600&q=80', '2026-05-01T08:00:00.000Z'),
  ('revisit-03', 'visitor-0000', '2026-04', 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=600&q=80', '2026-04-01T08:00:00.000Z')
on conflict (id) do update
set
  user_id = excluded.user_id,
  month = excluded.month,
  photo_url = excluded.photo_url,
  created_at = excluded.created_at;
