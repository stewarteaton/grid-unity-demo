import { TabType } from "../hooks/useLogic";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => onTabChange("upload")}
        className={`px-4 py-2 font-medium ${
          activeTab === "upload"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        File Upload
      </button>
      <button
        onClick={() => onTabChange("paste")}
        className={`px-4 py-2 font-medium ${
          activeTab === "paste"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Paste Data
      </button>
    </div>
  );
};
