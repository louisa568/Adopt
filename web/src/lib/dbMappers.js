export function mapDbUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    phone: row.phone || "",
    nickname: row.nickname || "暖爪用户",
    city: row.city || "杭州市",
    bio: row.bio || "希望每只毛孩子都能被温柔对待。",
    avatar:
      row.avatar ||
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=300&q=80",
    isVerified: Boolean(row.is_verified),
    createdAt: row.created_at || null,
  };
}

export function mapDbPet(row) {
  return {
    id: row.id,
    publisherId: row.publisher_id,
    name: row.name,
    city: row.city || "杭州市",
    district: row.district || "",
    distanceKm: Number(row.distance_km || 0),
    publishedAt: row.published_at || new Date().toISOString(),
    urgent: Boolean(row.urgent),
    category: row.category || "其他",
    gender: row.gender || "公",
    ageGroup: row.age_group || "成年",
    sterilized: Boolean(row.sterilized),
    vaccinated: Boolean(row.vaccinated),
    dewormed: Boolean(row.dewormed),
    tags: Array.isArray(row.tags) ? row.tags : [],
    story: row.story || "",
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    antiFraudTip: row.anti_fraud_tip || "",
    contact: row.contact || "通过平台私信联系",
    images:
      Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : [
            "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1200&q=80",
          ],
  };
}

export function mapDbApplication(row) {
  return {
    id: row.id,
    petId: row.pet_id,
    applicantId: row.applicant_id,
    petName: row.pet_name || "",
    housing: row.housing || "",
    familyAgree: row.family_agree || "",
    experience: row.experience || "",
    budget: row.budget || "",
    note: row.note || "",
    acceptedVisit: Boolean(row.accepted_visit),
    acceptedNoAbandon: Boolean(row.accepted_no_abandon),
    createdAt: row.created_at,
  };
}

export function mapDbMessage(row) {
  return {
    id: row.id,
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    text: row.text || "",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapDbRevisitLog(row) {
  return {
    id: row.id,
    month: row.month,
    photo: row.photo_url,
    createdAt: row.created_at || null,
  };
}

export function toDbPetPayload(payload, publisherId) {
  return {
    publisher_id: publisherId,
    name: payload.name,
    city: payload.city || "杭州市",
    district: payload.district || "",
    distance_km:
      typeof payload.distanceKm === "number" ? payload.distanceKm : 0.6,
    published_at: payload.publishedAt || new Date().toISOString(),
    urgent: Boolean(payload.urgent),
    category: payload.category || "其他",
    gender: payload.gender || "公",
    age_group: payload.ageGroup || "成年",
    sterilized: Boolean(payload.sterilized),
    vaccinated: Boolean(payload.vaccinated),
    dewormed: Boolean(payload.dewormed),
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    story: payload.story || "",
    requirements: Array.isArray(payload.requirements) ? payload.requirements : [],
    anti_fraud_tip: payload.antiFraudTip || "",
    contact: payload.contact || "通过平台私信联系",
    images: Array.isArray(payload.images) ? payload.images : [],
  };
}
