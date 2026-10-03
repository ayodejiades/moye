"use client";

import { ComfortButton } from "@/components/comfort-button";

import { useState } from "react";
import Link from "next/link";
import { useMoyeStore } from "@/lib/moye-store";
import { MoyinMascot } from "@/components/moyin-mascot";
import { HIVE_COSMETICS, type HiveCosmetic } from "@/lib/honey";
import {
  HoneyDropIcon,
  AcornHatIcon,
  HoneyCrownIcon,
  ExplorerHatIcon,
  FlowerCrownIcon,
  BeanieIcon,
  WizardHatIcon,
  ReadingGlassesIcon,
  StarGlassesIcon,
  SunglassesIcon,
  AviatorGlassesIcon,
  ScarfIcon,
  GoldenScarfIcon,
  StarCapeIcon,
  LeafCowlIcon,
  BeeIcon,
  LadybugIcon,
  FireflyIcon,
  SnailIcon,
  HoneycombLampIcon,
  HologramGlobeIcon,
  CushionNookIcon,
  BookshelfIcon,
  CheckIcon,
} from "@/components/ui/svg-icons";

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "hat", label: "Hats" },
  { id: "glasses", label: "Glasses" },
  { id: "scarf", label: "Scarves" },
  { id: "pet", label: "Companions" },
  { id: "decor", label: "Hive Decor" },
] as const;

export default function HiveCosmeticsPage() {
  const { state, buyAndEquipCosmetic, toggleEquipCosmetic } = useMoyeStore();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleBuy = (item: HiveCosmetic) => {
    buyAndEquipCosmetic(item.id, item.cost, item.category);
  };

  const handleToggleEquip = (item: HiveCosmetic) => {
    toggleEquipCosmetic(item.id, item.category);
  };

  const isEquipped = (item: HiveCosmetic) => {
    if (item.category === "hat") return state.equippedHat === item.id;
    if (item.category === "glasses") return state.equippedGlasses === item.id;
    if (item.category === "scarf") return state.equippedScarf === item.id;
    if (item.category === "pet") return state.equippedPet === item.id;
    if (item.category === "decor") return state.equippedDecor === item.id;
    return false;
  };

  const renderCosmeticIcon = (item: HiveCosmetic) => {
    switch (item.id) {
      case "hat-acorn":
        return <AcornHatIcon size={30} />;
      case "hat-honey-crown":
        return <HoneyCrownIcon size={30} />;
      case "hat-safari":
        return <ExplorerHatIcon size={30} />;
      case "hat-flower-wreath":
        return <FlowerCrownIcon size={30} />;
      case "hat-cozy-beanie":
        return <BeanieIcon size={30} />;
      case "hat-star-wizard":
        return <WizardHatIcon size={30} />;
      case "glasses-reading":
        return <ReadingGlassesIcon size={30} />;
      case "glasses-star":
        return <StarGlassesIcon size={30} />;
      case "glasses-sunglasses":
        return <SunglassesIcon size={30} />;
      case "glasses-aviator":
        return <AviatorGlassesIcon size={30} />;
      case "scarf-teal":
        return <ScarfIcon size={30} />;
      case "scarf-honey-stripe":
        return <GoldenScarfIcon size={30} />;
      case "scarf-star-cape":
        return <StarCapeIcon size={30} />;
      case "scarf-leaf-cowl":
        return <LeafCowlIcon size={30} />;
      case "pet-bee":
        return <BeeIcon size={30} />;
      case "pet-ladybug":
        return <LadybugIcon size={30} />;
      case "pet-firefly":
        return <FireflyIcon size={30} />;
      case "pet-snail":
        return <SnailIcon size={30} />;
      case "decor-honeycomb-lamp":
        return <HoneycombLampIcon size={30} />;
      case "decor-hologram-globe":
        return <HologramGlobeIcon size={30} />;
      case "decor-cushion-pile":
        return <CushionNookIcon size={30} />;
      case "decor-bookshelf":
        return <BookshelfIcon size={30} />;
      default:
        return <HoneyDropIcon size={30} />;
    }
  };

  const visibleCosmetics =
    activeCategory === "all"
      ? HIVE_COSMETICS
      : HIVE_COSMETICS.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--plum-900)]">
      {/* Header */}
      <header className="w-full max-w-4xl mx-auto px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <Link
            href="/learn"
            className="font-semibold text-xs sm:text-sm text-[var(--plum-700)] hover:text-[var(--plum-900)] px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white shadow-2xs hover:border-[var(--plum-400)] active:translate-y-0.5 transition-all"
          >
            Learning Path
          </Link>
          <span className="text-[var(--fg-muted)] opacity-40">/</span>
          <span className="text-base sm:text-lg font-bold text-[var(--plum-900)]">
            Moyin&apos;s Hive
          </span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-[var(--honey-500)] text-[var(--honey-700)] px-4 py-1.5 rounded-lg font-bold text-base">
          <HoneyDropIcon size={20} />
          <span>{state.honeyBalance} Honey</span>
        </div>
        <ComfortButton />
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-8 flex flex-col items-center w-full space-y-8">
        {/* Moyin in Hive Showcase */}
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-[var(--border)] shadow-sm text-center flex flex-col items-center">
          <div className="relative flex items-center justify-center min-h-[170px] w-full">
            {/* Room Decor placed beside Moyin */}
            {state.equippedDecor === "decor-honeycomb-lamp" && (
              <div className="absolute bottom-2 left-4 flex flex-col items-center z-10" title="Honeycomb Nightlight">
                <HoneycombLampIcon size={44} />
              </div>
            )}
            {state.equippedDecor === "decor-hologram-globe" && (
              <div className="absolute top-2 right-4 flex flex-col items-center z-10" title="Starlight Hologram Globe">
                <HologramGlobeIcon size={52} />
              </div>
            )}
            {state.equippedDecor === "decor-cushion-pile" && (
              <div className="absolute bottom-2 left-4 flex flex-col items-center z-10" title="Plump Lavender Beanbag">
                <CushionNookIcon size={44} />
              </div>
            )}
            {state.equippedDecor === "decor-bookshelf" && (
              <div className="absolute bottom-2 right-4 flex flex-col items-center z-10" title="Little Forest Bookshelf">
                <BookshelfIcon size={44} />
              </div>
            )}

            <MoyinMascot
              pose="cheer"
              size={170}
              hat={state.equippedHat}
              glasses={state.equippedGlasses}
              scarf={state.equippedScarf}
              pet={state.equippedPet}
            />
          </div>
          <h2 className="text-xl font-bold mt-2 [text-wrap:balance]">Moyin&apos;s Cozy Corner</h2>
          <p className="text-xs text-[var(--fg-muted)] [text-wrap:pretty]">
            {state.equippedHat || state.equippedGlasses || state.equippedScarf || state.equippedPet || state.equippedDecor
              ? "Looking sharp with the new gear!"
              : "Earn honey in lessons to unlock hats, glasses, scarves, companions, and hive decor."}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Hive Shop</h3>
            <span className="text-xs font-semibold text-[var(--fg-muted)]">
              {visibleCosmetics.length} {visibleCosmetics.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={isActive ? { color: "#FFFFFF" } : undefined}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--plum-900)] !text-white text-white shadow-xs"
                      : "bg-white border border-[var(--border)] text-[var(--plum-900)] hover:bg-[var(--plum-100)]"
                  }`}
                >
                  <span
                    style={isActive ? { color: "#FFFFFF" } : undefined}
                    className={isActive ? "!text-white text-white" : ""}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cosmetics Shop Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleCosmetics.map((item) => {
              const isOwned = state.ownedCosmetics.includes(item.id);
              const canAfford = state.honeyBalance >= item.cost;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border-2 border-[var(--border)] shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[var(--plum-100)] flex items-center justify-center shrink-0">
                      {renderCosmeticIcon(item)}
                    </div>
                    <div>
                      <div className="font-bold text-base">{item.name}</div>
                      <div className="text-xs text-[var(--fg-muted)] [text-wrap:pretty]">{item.description}</div>
                      <div className="text-xs font-bold text-[var(--honey-700)] mt-0.5">
                        {item.cost} honey
                      </div>
                    </div>
                  </div>

                  {isOwned ? (
                    <button
                      type="button"
                      data-demo="owned"
                      onClick={() => handleToggleEquip(item)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 inline-flex items-center gap-1 cursor-pointer transition-colors ${
                        isEquipped(item)
                          ? "bg-teal-50 border-[var(--teal-500)] text-[var(--teal-700)] hover:bg-teal-100"
                          : "bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      <CheckIcon size={14} />
                      <span>{isEquipped(item) ? "Wearing" : "Equip"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      data-demo={item.id === "hat-acorn" ? "buy-hat" : undefined}
                      disabled={!canAfford}
                      onClick={() => handleBuy(item)}
                      className={`btn-3d text-xs py-2 px-3 shrink-0 ${
                        canAfford ? "btn-3d-honey" : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                      Unlock
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
