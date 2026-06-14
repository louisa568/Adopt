/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  mapDbApplication,
  mapDbMessage,
  mapDbPet,
  mapDbRevisitLog,
  mapDbUser,
  toDbPetPayload,
} from "../lib/dbMappers";
import { getSupabaseClient } from "../lib/supabaseClient";

const AppContext = createContext(null);
const SESSION_KEY = "nuanzhua_user_id";
const GUEST_USER = {
  userId: "visitor-0000",
  isLoggedIn: false,
  isVerified: false,
  phone: "",
  nickname: "暖爪用户",
  bio: "希望每只毛孩子都能被温柔对待。",
  city: "杭州市",
  avatar:
    "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=300&q=80",
};

function sortFeedList(list) {
  return [...list].sort((a, b) => {
    if (a.urgent !== b.urgent) {
      return a.urgent ? -1 : 1;
    }

    if (a.distanceKm !== b.distanceKm) {
      return a.distanceKm - b.distanceKm;
    }

    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

function groupMessagesByPeer(messages, currentUserId) {
  return messages.reduce((acc, message) => {
    const peerUserId =
      message.fromUserId === currentUserId ? message.toUserId : message.fromUserId;

    if (!peerUserId) {
      return acc;
    }

    if (!acc[peerUserId]) {
      acc[peerUserId] = [];
    }
    acc[peerUserId].push(message);
    acc[peerUserId].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return acc;
  }, {});
}

async function fetchPublicData(client) {
  const [usersRes, petsRes] = await Promise.all([
    client.from("users").select("*"),
    client.from("pets").select("*"),
  ]);
  if (usersRes.error) {
    throw usersRes.error;
  }
  if (petsRes.error) {
    throw petsRes.error;
  }

  return {
    users: (usersRes.data || []).map(mapDbUser),
    pets: sortFeedList((petsRes.data || []).map(mapDbPet)),
  };
}

async function fetchUserScopedData(client, userId) {
  const [applicationsRes, messagesRes, revisitRes] = await Promise.all([
    client
      .from("applications")
      .select("*")
      .eq("applicant_id", userId)
      .order("created_at", { ascending: false }),
    client
      .from("messages")
      .select("*")
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order("created_at", { ascending: true }),
    client
      .from("revisit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("month", { ascending: false }),
  ]);
  if (applicationsRes.error) {
    throw applicationsRes.error;
  }
  if (messagesRes.error) {
    throw messagesRes.error;
  }
  if (revisitRes.error) {
    throw revisitRes.error;
  }

  const mappedApplications = (applicationsRes.data || []).map(mapDbApplication);
  const mappedMessages = (messagesRes.data || []).map(mapDbMessage);
  const mappedRevisitLogs = (revisitRes.data || []).map(mapDbRevisitLog);

  return {
    applications: mappedApplications,
    conversations: groupMessagesByPeer(mappedMessages, userId),
    revisitLogs: mappedRevisitLogs,
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(GUEST_USER);
  const [publishers, setPublishers] = useState([]);
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [conversations, setConversations] = useState({});
  const [revisitTimeline, setRevisitTimeline] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [appError, setAppError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsDataLoading(true);
      setAppError("");
      try {
        const client = getSupabaseClient();
        const publicData = await fetchPublicData(client);
        setPublishers(publicData.users);
        setPets(publicData.pets);

        const savedUserId = localStorage.getItem(SESSION_KEY);
        if (savedUserId) {
          const userRes = await client
            .from("users")
            .select("*")
            .eq("id", savedUserId)
            .maybeSingle();
          if (userRes.error) {
            throw userRes.error;
          }

          if (userRes.data) {
            const dbUser = mapDbUser(userRes.data);
            if (!cancelled) {
              setUser({
                userId: dbUser.id,
                isLoggedIn: true,
                isVerified: dbUser.isVerified,
                phone: dbUser.phone,
                nickname: dbUser.nickname,
                bio: dbUser.bio,
                city: dbUser.city,
                avatar: dbUser.avatar,
              });
              const scopedData = await fetchUserScopedData(client, dbUser.id);
              if (!cancelled) {
                setApplications(scopedData.applications);
                setConversations(scopedData.conversations);
                setRevisitTimeline(scopedData.revisitLogs);
              }
            }
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setAppError(error.message || "加载 Supabase 数据失败");
          setUser(GUEST_USER);
          setPublishers([]);
          setPets([]);
          setApplications([]);
          setConversations({});
          setRevisitTimeline([]);
        }
      } finally {
        if (!cancelled) {
          setIsDataLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ phone }) => {
    const client = getSupabaseClient();
    const cleanPhone = phone.trim();

    const existingUserRes = await client
      .from("users")
      .select("*")
      .eq("phone", cleanPhone)
      .maybeSingle();
    if (existingUserRes.error) {
      throw existingUserRes.error;
    }

    let dbUserRow = existingUserRes.data;
    if (!dbUserRow) {
      const insertedRes = await client
        .from("users")
        .insert({
          phone: cleanPhone,
          nickname: `用户${cleanPhone.slice(-4) || "0000"}`,
          city: "杭州市",
          bio: "希望每只毛孩子都能被温柔对待。",
          avatar:
            "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=300&q=80",
          is_verified: false,
        })
        .select("*")
        .single();
      if (insertedRes.error) {
        throw insertedRes.error;
      }
      dbUserRow = insertedRes.data;
    }

    const dbUser = mapDbUser(dbUserRow);
    localStorage.setItem(SESSION_KEY, dbUser.id);
    setUser({
      userId: dbUser.id,
      isLoggedIn: true,
      isVerified: dbUser.isVerified,
      phone: dbUser.phone,
      nickname: dbUser.nickname,
      bio: dbUser.bio,
      city: dbUser.city,
      avatar: dbUser.avatar,
    });
    const [publicData, scopedData] = await Promise.all([
      fetchPublicData(client),
      fetchUserScopedData(client, dbUser.id),
    ]);
    setPublishers(publicData.users);
    setPets(publicData.pets);
    setApplications(scopedData.applications);
    setConversations(scopedData.conversations);
    setRevisitTimeline(scopedData.revisitLogs);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(GUEST_USER);
    setApplications([]);
    setConversations({});
    setRevisitTimeline([]);
  };

  const completeVerification = async () => {
    if (!user.isLoggedIn) {
      throw new Error("请先登录");
    }
    const client = getSupabaseClient();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const updateRes = await client
      .from("users")
      .update({ is_verified: true })
      .eq("id", user.userId);
    if (updateRes.error) {
      throw updateRes.error;
    }

    setUser((prev) => ({ ...prev, isVerified: true }));
    const publicData = await fetchPublicData(client);
    setPublishers(publicData.users);
    setPets(publicData.pets);
  };

  const submitApplication = async (payload) => {
    if (!user.isLoggedIn) {
      throw new Error("请先登录");
    }
    const client = getSupabaseClient();
    const insertRes = await client
      .from("applications")
      .insert({
        applicant_id: user.userId,
        pet_id: payload.petId,
        pet_name: payload.petName,
        housing: payload.housing,
        family_agree: payload.familyAgree,
        experience: payload.experience,
        budget: payload.budget,
        note: payload.note || "",
        accepted_visit: true,
        accepted_no_abandon: true,
      })
      .select("*")
      .single();
    if (insertRes.error) {
      throw insertRes.error;
    }

    const mapped = mapDbApplication(insertRes.data);
    setApplications((prev) => [mapped, ...prev]);
  };

  const publishPet = async (payload) => {
    if (!user.isLoggedIn) {
      throw new Error("请先登录");
    }
    const client = getSupabaseClient();
    const insertRes = await client
      .from("pets")
      .insert(
        toDbPetPayload(
          {
            ...payload,
            city: payload.city || user.city || "杭州市",
            tags: payload.tags?.length ? payload.tags : ["新发布"],
            antiFraudTip:
              payload.antiFraudTip ||
              "领养流程请通过平台完成，谨防任何形式的线下高额押金或附加销售。",
            contact: payload.contact || "通过平台私信联系",
            images: payload.images?.length
              ? payload.images
              : [
                  "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1200&q=80",
                ],
          },
          user.userId
        )
      )
      .select("*")
      .single();
    if (insertRes.error) {
      throw insertRes.error;
    }

    const mappedPet = mapDbPet(insertRes.data);
    setPets((prev) => sortFeedList([mappedPet, ...prev]));
    const publicData = await fetchPublicData(client);
    setPublishers(publicData.users);
    setPets(publicData.pets);
  };

  const openConversationWithUser = (peerUserId) => {
    setConversations((prev) => {
      if (prev[peerUserId]) {
        return prev;
      }

      return {
        ...prev,
        [peerUserId]: [],
      };
    });
  };

  const sendMessageToUser = async (peerUserId, text) => {
    if (!user.isLoggedIn || !text.trim()) {
      return;
    }
    const client = getSupabaseClient();
    const insertRes = await client
      .from("messages")
      .insert({
        from_user_id: user.userId,
        to_user_id: peerUserId,
        text: text.trim(),
      })
      .select("*")
      .single();
    if (insertRes.error) {
      throw insertRes.error;
    }

    const mappedMessage = mapDbMessage(insertRes.data);
    setConversations((prev) => ({
      ...prev,
      [peerUserId]: [...(prev[peerUserId] || []), mappedMessage].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    }));
  };

  const currentUserProfile = useMemo(
    () => ({
      id: user.userId,
      nickname: user.nickname,
      city: user.city || "杭州市",
      avatar: user.avatar,
      bio: user.bio,
    }),
    [user.avatar, user.bio, user.city, user.nickname, user.userId]
  );

  const publisherDirectory = useMemo(() => {
    const map = Object.fromEntries(publishers.map((item) => [item.id, item]));
    map[currentUserProfile.id] = currentUserProfile;
    return map;
  }, [currentUserProfile, publishers]);

  const myPublishedPets = useMemo(
    () => pets.filter((pet) => pet.publisherId === user.userId),
    [pets, user.userId]
  );
  const hasPublishedPet = myPublishedPets.length > 0;

  const getUserById = (userId) => publisherDirectory[userId] || null;
  const getPetsByPublisher = (publisherId) =>
    pets.filter((pet) => pet.publisherId === publisherId);
  const getConversationWithUser = (peerUserId) =>
    (conversations[peerUserId] || []).slice().sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const conversationPeers = Object.keys(conversations).filter((peerUserId) => {
    return getConversationWithUser(peerUserId).length > 0;
  });

  const value = {
    user,
    publishers,
    pets,
    applications,
    conversations,
    hasPublishedPet,
    myPublishedPets,
    revisitTimeline,
    isDataLoading,
    appError,
    conversationPeers,
    login,
    logout,
    completeVerification,
    submitApplication,
    publishPet,
    getUserById,
    getPetsByPublisher,
    getConversationWithUser,
    openConversationWithUser,
    sendMessageToUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
