
import { useState, useRef } from "react";
import Tile from "./Tile";
import type { Tile as TileType, Direction } from "./Game";

interface GameBoardProps {
  board: (TileType | null)[][];
  onMove: (direction: Direction) => void;
}

const GameBoard = ({ board, onMove }: GameBoardProps) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 50;

    // Determine if the swipe is horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        onMove(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        onMove(deltaY > 0 ? 'down' : 'up');
      }
    }

    setTouchStart(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={boardRef}
      className="relative bg-gray-300 rounded-lg p-2 touch-none select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      style={{ aspectRatio: '1' }}
    >
      {/* Grid Background */}
      <div className="grid grid-cols-4 gap-2 h-full">
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-md"
          />
        ))}
      </div>

      {/* Tiles */}
      <div className="absolute inset-2 grid grid-cols-4 gap-2">
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="relative">
              {tile && (
                <Tile
                  key={tile.id}
                  value={tile.value}
                  isNew={tile.isNew}
                  isMerged={tile.isMerged}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
