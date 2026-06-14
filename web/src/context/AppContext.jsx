import { createContext, useContext, useMemo, useState } from "react";
import { mockPets, revisitTimeline } from "../data/mockData";

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
    isLoggedIn: false,
    isVerified: false,
    phone: "",
    nickname: "暖爪用户",
    bio: "希望每只毛孩子都能被温柔对待。",
    avatar:
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=300&q=80",
  });
  const [pets, setPets] = useState(sortFeedList(mockPets));
  const [applications, setApplications] = useState([]);
  const [hasPublishedPet, setHasPublishedPet] = useState(false);

  const login = ({ phone }) => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: true,
      phone,
      nickname: `用户${phone.slice(-4) || "0000"}`,
    }));
  };

  const logout = () => {
    setUser((prev) => ({
      ...prev,
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
    setHasPublishedPet(true);
  };

  const value = useMemo(
    () => ({
      user,
      pets,
      applications,
      hasPublishedPet,
      revisitTimeline,
      login,
      logout,
      completeVerification,
      submitApplication,
      publishPet,
    }),
    [applications, hasPublishedPet, pets, user]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
