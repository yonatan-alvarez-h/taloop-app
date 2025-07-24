import { useState } from "react";

export type TabId = "information" | "quality" | "preview";

export interface Tab {
  id: TabId;
  label: string;
  icon?: string;
}

export const useTabs = (defaultTab: TabId = "information") => {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const tabs: Tab[] = [
    { id: "information", label: "Información" },
    { id: "quality", label: "Calidad de Datos" },
    { id: "preview", label: "Vista Previa" },
  ];

  const switchTab = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  const getActiveTab = () => {
    return tabs.find((tab) => tab.id === activeTab) || tabs[0];
  };

  return {
    activeTab,
    tabs,
    switchTab,
    getActiveTab,
  };
};
