
import { cn } from "@/lib/utils";

interface TileProps {
  value: number;
  isNew?: boolean;
  isMerged?: boolean;
}

const getTileStyles = (value: number) => {
  const styles: Record<number, string> = {
    2: "bg-gray-100 text-gray-800",
    4: "bg-gray-200 text-gray-800",
    8: "bg-orange-200 text-white",
    16: "bg-orange-300 text-white",
    32: "bg-orange-400 text-white",
    64: "bg-orange-500 text-white",
    128: "bg-yellow-400 text-white text-xs",
    256: "bg-yellow-500 text-white text-xs",
    512: "bg-yellow-600 text-white text-xs",
    1024: "bg-red-400 text-white text-xs",
    2048: "bg-red-500 text-white text-xs",
    4096: "bg-red-600 text-white text-xs",
    8192: "bg-purple-500 text-white text-xs",
  };

  return styles[value] || "bg-purple-600 text-white text-xs";
};

const getFontSize = (value: number) => {
  if (value < 100) return "text-2xl";
  if (value < 1000) return "text-xl";
  if (value < 10000) return "text-lg";
  return "text-sm";
};

const Tile = ({ value, isNew, isMerged }: TileProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 rounded-md flex items-center justify-center font-bold transition-all duration-300",
        getTileStyles(value),
        getFontSize(value),
        isNew && "animate-tile-appear",
        isMerged && "animate-tile-merge"
      )}
      style={{
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {value}
    </div>
  );
};

export default Tile;
