export const mockPublishers = [
  {
    id: "publisher-01",
    nickname: "林小雨",
    city: "杭州市",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    bio: "家里有一只原住民，做过3年救助志愿者。",
  },
  {
    id: "publisher-02",
    nickname: "陈阿北",
    city: "杭州市",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    bio: "希望每个毛孩子都能找到稳定家庭。",
  },
  {
    id: "publisher-03",
    nickname: "赵小莓",
    city: "杭州市",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    bio: "关注幼猫救助和回访，反对任何形式黑产。",
  },
];

export const mockPets = [
  {
    id: "pet-1001",
    publisherId: "publisher-01",
    name: "小橘",
    city: "杭州市",
    district: "西湖区",
    distanceKm: 1.2,
    publishedAt: "2026-06-14T08:20:00.000Z",
    urgent: true,
    category: "猫",
    gender: "母",
    ageGroup: "幼年",
    sterilized: false,
    vaccinated: true,
    dewormed: true,
    tags: ["亲人", "会用猫砂", "急寻领养"],
    story:
      "在雨夜被救助于停车场，恢复状态良好，特别粘人，喜欢安静陪伴。",
    requirements: ["必须封窗", "接受云回访", "限同城领养"],
    antiFraudTip:
      "任何形式的强制捆绑销售、诱导高额押金都属于违规行为，请第一时间举报。",
    contact: "微信: nuanzhua-cat-01",
    images: [
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "pet-1002",
    publisherId: "publisher-02",
    name: "阿福",
    city: "杭州市",
    district: "滨江区",
    distanceKm: 2.5,
    publishedAt: "2026-06-14T07:10:00.000Z",
    urgent: false,
    category: "狗",
    gender: "公",
    ageGroup: "成年",
    sterilized: true,
    vaccinated: true,
    dewormed: true,
    tags: ["温顺", "可牵引", "适合家庭"],
    story: "原主人因异地工作无法继续照料，性格稳定，外出不爆冲。",
    requirements: ["每天遛狗至少2次", "接受云回访", "限同城领养"],
    antiFraudTip:
      "若送养方提出异常费用或指定购买用品，请保留证据并点击举报。",
    contact: "微信: nuanzhua-dog-02",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "pet-1003",
    publisherId: "publisher-03",
    name: "奶糖",
    city: "杭州市",
    district: "拱墅区",
    distanceKm: 4.3,
    publishedAt: "2026-06-13T14:00:00.000Z",
    urgent: false,
    category: "猫",
    gender: "母",
    ageGroup: "幼年",
    sterilized: false,
    vaccinated: true,
    dewormed: false,
    tags: ["活泼", "适合新手"],
    story: "小区绿化带救助，现阶段身体情况稳定，食欲良好。",
    requirements: ["必须封窗", "按时免疫", "接受云回访"],
    antiFraudTip: "平台不会要求你私下转押金，遇到可疑情况请立即举报。",
    contact: "微信: nuanzhua-cat-03",
    images: [
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "pet-1004",
    publisherId: "publisher-02",
    name: "团子",
    city: "杭州市",
    district: "上城区",
    distanceKm: 0.8,
    publishedAt: "2026-06-14T06:50:00.000Z",
    urgent: true,
    category: "狗",
    gender: "母",
    ageGroup: "幼年",
    sterilized: false,
    vaccinated: false,
    dewormed: true,
    tags: ["急寻领养", "小体型", "粘人"],
    story: "临时安置点即将到期，急需稳定家庭接手照顾。",
    requirements: ["限同城领养", "有固定作息", "接受云回访"],
    antiFraudTip:
      "领养为公益行为，平台严禁以领养名义进行商业倒卖或附加销售。",
    contact: "微信: nuanzhua-dog-04",
    images: [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export const revisitTimeline = [
  { month: "2026-06", photo: "https://images.unsplash.com/photo-1601758174638-4fce1f1fdb4f?auto=format&fit=crop&w=600&q=80" },
  { month: "2026-05", photo: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=600&q=80" },
  { month: "2026-04", photo: "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=600&q=80" },
];

export const mockConversations = {
  "publisher-01": [
    {
      id: "msg-01",
      fromUserId: "publisher-01",
      toUserId: "visitor-0000",
      text: "你好，感谢关注小橘，建议先看看领养要求。",
      createdAt: "2026-06-14T06:10:00.000Z",
    },
  ],
  "publisher-02": [
    {
      id: "msg-02",
      fromUserId: "publisher-02",
      toUserId: "visitor-0000",
      text: "阿福性格很稳定，欢迎先发申请表再沟通。",
      createdAt: "2026-06-14T06:20:00.000Z",
    },
  ],
};
