/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import {
  mockConversations,
  mockPets,
  mockPublishers,
  revisitTimeline,
} from "../data/mockData";

const AppContext = createContext(null);

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

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    userId: "visitor-0000",
    isLoggedIn: false,
    isVerified: false,
    phone: "",
    nickname: "暖爪用户",
    bio: "希望每只毛孩子都能被温柔对待。",
    avatar:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=300&q=80",
  });
  const [publishers] = useState(mockPublishers);
  const [pets, setPets] = useState(sortFeedList(mockPets));
  const [applications, setApplications] = useState([]);
  const [conversations, setConversations] = useState(mockConversations);

  const login = ({ phone }) => {
    const nextUserId = `user-${phone.slice(-4) || "0000"}`;
    setUser((prev) => ({
      ...prev,
      userId: nextUserId,
      isLoggedIn: true,
      isVerified: false,
      phone,
      nickname: `用户${phone.slice(-4) || "0000"}`,
    }));
  };

  const logout = () => {
    setUser((prev) => ({
      ...prev,
      userId: "visitor-0000",
      isLoggedIn: false,
      isVerified: false,
      phone: "",
    }));
  };

  const completeVerification = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setUser((prev) => ({ ...prev, isVerified: true }));
  };

  const submitApplication = (payload) => {
    setApplications((prev) => [
      {
        id: `apply-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...payload,
      },
      ...prev,
    ]);
  };

  const publishPet = (payload) => {
    const newPet = {
      id: `pet-${Date.now()}`,
      publisherId: user.userId,
      city: "杭州市",
      distanceKm: 0.6,
      publishedAt: new Date().toISOString(),
      urgent: false,
      tags: ["新发布"],
      antiFraudTip:
        "领养流程请通过平台完成，谨防任何形式的线下高额押金或附加销售。",
      contact: "通过平台私信联系",
      images: payload.images?.length
        ? payload.images
        : [
            "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1200&q=80",
          ],
      ...payload,
    };

    setPets((prev) => sortFeedList([newPet, ...prev]));
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

  const sendMessageToUser = (peerUserId, text) => {
    if (!text.trim()) {
      return;
    }

    const now = new Date().toISOString();
    const userMsg = {
      id: `msg-${Date.now()}`,
      fromUserId: user.userId,
      toUserId: peerUserId,
      text: text.trim(),
      createdAt: now,
    };
    const autoReply = {
      id: `msg-${Date.now()}-reply`,
      fromUserId: peerUserId,
      toUserId: user.userId,
      text: "收到啦，我会尽快回复你，感谢你认真沟通领养细节。",
      createdAt: new Date(Date.now() + 1000).toISOString(),
    };

    setConversations((prev) => ({
      ...prev,
      [peerUserId]: [...(prev[peerUserId] || []), userMsg, autoReply],
    }));
  };

  const currentUserProfile = useMemo(
    () => ({
      id: user.userId,
      nickname: user.nickname,
      city: "杭州市",
      avatar: user.avatar,
      bio: user.bio,
    }),
    [user.avatar, user.bio, user.nickname, user.userId]
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
    return getConversationWithUser(peerUserId).length > 0 || user.isLoggedIn;
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
