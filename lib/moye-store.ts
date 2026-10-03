"use client";

import { useCallback, useSyncExternalStore } from "react";

export interface AttemptLog {
  id: string;
  questionId: string;
  skillId: string;
  isCorrect: boolean;
  misconceptionTag?: string;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: "learner" | "teacher" | "parent";
  curriculum: string;
  theme: string;
  honeyBalance: number;
  streakDays: number;
  email?: string;
}

export interface MoyeAppState {
  currentProfileId: string;
  activeProfileName: string;
  userRole: "learner" | "teacher" | "parent";
  userEmail: string;
  selectedCurriculum: string;
  selectedTheme: string;
  profiles: UserProfile[];
  honeyBalance: number;
  streakDays: number;
  unlockedLevels: string[];
  completedLevels: string[];
  currentLevelId: string;
  equippedHat: string | null;
  equippedGlasses: string | null;
  equippedScarf: string | null;
  equippedPet: string | null;
  equippedDecor: string | null;
  ownedCosmetics: string[];
  skillMastery: Record<string, { pKnown: number; tier: number }>;
  attemptLogs: AttemptLog[];
}

export const LEVEL_SEQUENCE = ["s1", "s2", "s3", "s4"];

const STORAGE_KEY = "moye_global_state_v2";

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: "profile-anjola",
    name: "Anjola",
    role: "learner",
    curriculum: "ng-ube",
    theme: "dinosaurs",
    honeyBalance: 15,
    streakDays: 4,
  },
  {
    id: "profile-ayodeji",
    name: "Ayodeji",
    role: "learner",
    curriculum: "ng-ube",
    theme: "football",
    honeyBalance: 24,
    streakDays: 6,
  },
];

const DEFAULT_STATE: MoyeAppState = {
  currentProfileId: "profile-anjola",
  activeProfileName: "Anjola",
  userRole: "learner",
  userEmail: "",
  selectedCurriculum: "ng-ube",
  selectedTheme: "dinosaurs",
  profiles: DEFAULT_PROFILES,
  honeyBalance: 15,
  streakDays: 4,
  unlockedLevels: ["s1"],
  completedLevels: [],
  currentLevelId: "s1",
  equippedHat: null,
  equippedGlasses: null,
  equippedScarf: null,
  equippedPet: null,
  equippedDecor: null,
  ownedCosmetics: [],
  skillMastery: {
    "addition-foundations": { pKnown: 0.5, tier: 2 },
  },
  attemptLogs: [],
};

let cachedRaw: string | null = null;
let cachedState: MoyeAppState = DEFAULT_STATE;

export function getMoyeState(): MoyeAppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem("moye_global_state_v1");
      if (legacyRaw) {
        raw = legacyRaw;
      }
    }
    if (!raw) return DEFAULT_STATE;
    if (raw === cachedRaw) return cachedState;

    const parsed = JSON.parse(raw);
    const updatedProfiles = (parsed.profiles || DEFAULT_PROFILES).map((p: UserProfile) => {
      if (p.name?.toLowerCase() === "ada") return { ...p, id: "profile-anjola", name: "Anjola" };
      if (p.name?.toLowerCase() === "chidi") return { ...p, id: "profile-ayodeji", name: "Ayodeji" };
      return p;
    });
    const activeProfileName =
      parsed.activeProfileName === "Ada"
        ? "Anjola"
        : parsed.activeProfileName === "Chidi"
        ? "Ayodeji"
        : parsed.activeProfileName || "Anjola";
    const currentProfileId =
      parsed.currentProfileId === "profile-ada"
        ? "profile-anjola"
        : parsed.currentProfileId === "profile-chidi"
        ? "profile-ayodeji"
        : parsed.currentProfileId || "profile-anjola";

    cachedRaw = raw;
    cachedState = {
      ...DEFAULT_STATE,
      ...parsed,
      profiles: updatedProfiles,
      activeProfileName,
      currentProfileId,
    };
    return cachedState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveMoyeState(state: Partial<MoyeAppState>): MoyeAppState {
  const current = getMoyeState();
  const updated: MoyeAppState = { ...current, ...state };
  if (typeof window !== "undefined") {
    try {
      const serialized = JSON.stringify(updated);
      localStorage.setItem(STORAGE_KEY, serialized);
      cachedRaw = serialized;
      cachedState = updated;
      window.dispatchEvent(new Event("moye_state_updated"));
    } catch {
      // Storage unavailable
    }
  }
  return updated;
}

function subscribeMoyeStore(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("moye_state_updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("moye_state_updated", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useMoyeStore() {
  const state = useSyncExternalStore(
    subscribeMoyeStore,
    getMoyeState,
    () => DEFAULT_STATE
  );
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const addHoney = useCallback((amount: number) => {
    const current = getMoyeState();
    saveMoyeState({ honeyBalance: current.honeyBalance + amount });
  }, []);

  const spendHoney = useCallback((amount: number): boolean => {
    const current = getMoyeState();
    if (current.honeyBalance < amount) return false;
    saveMoyeState({ honeyBalance: current.honeyBalance - amount });
    return true;
  }, []);

  const logAttempt = useCallback((attempt: Omit<AttemptLog, "id" | "timestamp">) => {
    const current = getMoyeState();
    const newLog: AttemptLog = {
      ...attempt,
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    };
    saveMoyeState({ attemptLogs: [...current.attemptLogs, newLog] });
  }, []);

  const updateSkillMastery = useCallback((skillId: string, pKnown: number, tier: number) => {
    const current = getMoyeState();
    saveMoyeState({
      skillMastery: {
        ...current.skillMastery,
        [skillId]: { pKnown, tier },
      },
    });
  }, []);

  const completeLevelAndUnlockNext = useCallback((levelId: string) => {
    const current = getMoyeState();
    const completedSet = new Set(current.completedLevels);
    completedSet.add(levelId);

    const unlockedSet = new Set(current.unlockedLevels);
    unlockedSet.add(levelId);

    const currentIndex = LEVEL_SEQUENCE.indexOf(levelId);
    let nextLevelId = levelId;
    if (currentIndex !== -1 && currentIndex + 1 < LEVEL_SEQUENCE.length) {
      nextLevelId = LEVEL_SEQUENCE[currentIndex + 1];
      unlockedSet.add(nextLevelId);
    }

    saveMoyeState({
      completedLevels: Array.from(completedSet),
      unlockedLevels: Array.from(unlockedSet),
      currentLevelId: nextLevelId,
    });
  }, []);

  const setCurrentLevel = useCallback((levelId: string) => {
    saveMoyeState({ currentLevelId: levelId });
  }, []);

  /** Raw patch write, for callers that need to set several fields at once. */
  const saveState = useCallback((patch: Partial<MoyeAppState>) => {
    saveMoyeState(patch);
  }, []);

  const buyAndEquipCosmetic = useCallback((id: string, cost: number, category: "hat" | "glasses" | "scarf" | "pet" | "decor") => {
    const current = getMoyeState();
    if (current.honeyBalance < cost && !current.ownedCosmetics.includes(id)) return false;

    const newBalance = current.ownedCosmetics.includes(id) ? current.honeyBalance : current.honeyBalance - cost;
    const newOwned = current.ownedCosmetics.includes(id) ? current.ownedCosmetics : [...current.ownedCosmetics, id];
    
    const patch: Partial<MoyeAppState> = {
      honeyBalance: newBalance,
      ownedCosmetics: newOwned,
    };
    if (category === "hat") patch.equippedHat = id;
    if (category === "glasses") patch.equippedGlasses = id;
    if (category === "scarf") patch.equippedScarf = id;
    if (category === "pet") patch.equippedPet = id;
    if (category === "decor") patch.equippedDecor = id;

    saveMoyeState(patch);
    return true;
  }, []);

  const toggleEquipCosmetic = useCallback((id: string, category: "hat" | "glasses" | "scarf" | "pet" | "decor") => {
    const current = getMoyeState();
    if (category === "hat") saveMoyeState({ equippedHat: current.equippedHat === id ? null : id });
    if (category === "glasses") saveMoyeState({ equippedGlasses: current.equippedGlasses === id ? null : id });
    if (category === "scarf") saveMoyeState({ equippedScarf: current.equippedScarf === id ? null : id });
    if (category === "pet") saveMoyeState({ equippedPet: current.equippedPet === id ? null : id });
    if (category === "decor") saveMoyeState({ equippedDecor: current.equippedDecor === id ? null : id });
  }, []);

  const signInProfile = useCallback((profileId: string) => {
    const current = getMoyeState();
    const found = current.profiles.find((p) => p.id === profileId);
    if (!found) return false;
    saveMoyeState({
      currentProfileId: found.id,
      activeProfileName: found.name,
      userRole: found.role,
      userEmail: found.email || "",
      selectedCurriculum: found.curriculum,
      selectedTheme: found.theme,
      honeyBalance: found.honeyBalance,
      streakDays: found.streakDays,
    });
    return true;
  }, []);

  const createProfile = useCallback((data: {
    name: string;
    role?: "learner" | "teacher" | "parent";
    curriculum?: string;
    theme?: string;
    email?: string;
  }) => {
    const current = getMoyeState();
    const cleanName = data.name.trim() || "Anjola";
    const newProfile: UserProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: cleanName,
      role: data.role || "learner",
      curriculum: data.curriculum || "ng-ube",
      theme: data.theme || "dinosaurs",
      honeyBalance: 15,
      streakDays: 4,
      email: data.email || "",
    };
    saveMoyeState({
      profiles: [...current.profiles, newProfile],
      currentProfileId: newProfile.id,
      activeProfileName: newProfile.name,
      userRole: newProfile.role,
      userEmail: newProfile.email || "",
      selectedCurriculum: newProfile.curriculum,
      selectedTheme: newProfile.theme,
      honeyBalance: newProfile.honeyBalance,
      streakDays: newProfile.streakDays,
    });
    return newProfile;
  }, []);

  const signInWithCredentials = useCallback((identifier: string, role: "learner" | "teacher" | "parent" = "learner") => {
    const current = getMoyeState();
    const cleanId = identifier.trim().toLowerCase();
    const found = current.profiles.find(
      (p) => p.name.toLowerCase() === cleanId || (p.email && p.email.toLowerCase() === cleanId)
    );
    if (found) {
      saveMoyeState({
        currentProfileId: found.id,
        activeProfileName: found.name,
        userRole: found.role,
        userEmail: found.email || "",
        selectedCurriculum: found.curriculum,
        selectedTheme: found.theme,
        honeyBalance: found.honeyBalance,
        streakDays: found.streakDays,
      });
      return found;
    }
    const newProfile: UserProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: identifier.trim() || "Anjola",
      role,
      curriculum: "ng-ube",
      theme: "dinosaurs",
      honeyBalance: 15,
      streakDays: 4,
      email: identifier.includes("@") ? identifier.trim() : "",
    };
    saveMoyeState({
      profiles: [...current.profiles, newProfile],
      currentProfileId: newProfile.id,
      activeProfileName: newProfile.name,
      userRole: newProfile.role,
      userEmail: newProfile.email || "",
      selectedCurriculum: newProfile.curriculum,
      selectedTheme: newProfile.theme,
      honeyBalance: newProfile.honeyBalance,
      streakDays: newProfile.streakDays,
    });
    return newProfile;
  }, []);

  return {
    state,
    mounted,
    addHoney,
    spendHoney,
    logAttempt,
    updateSkillMastery,
    completeLevelAndUnlockNext,
    setCurrentLevel,
    saveState,
    buyAndEquipCosmetic,
    toggleEquipCosmetic,
    signInProfile,
    createProfile,
    signInWithCredentials,
  };
}
