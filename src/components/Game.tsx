
import { useState, useEffect, useCallback } from "react";
import GameBoard from "./GameBoard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  initializeBoard, 
  addRandomTile, 
  moveLeft, 
  moveRight, 
  moveUp, 
  moveDown,
  isGameOver,
  hasWon,
  canMove
} from "@/utils/gameLogic";

export type Tile = {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

const Game = () => {
  const [board, setBoard] = useState<(Tile | null)[][]>(() => {
    const initialBoard = initializeBoard();
    addRandomTile(initialBoard);
    addRandomTile(initialBoard);
    return initialBoard;
  });
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved) : 0;
  });

  const newGame = useCallback(() => {
    const newBoard = initializeBoard();
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameWon(false);
    setGameOver(false);
  }, []);

  const makeMove = useCallback((direction: Direction) => {
    if (gameOver) return;

    let newBoard: (Tile | null)[][];
    let moveScore = 0;
    let moved = false;

    switch (direction) {
      case 'left':
        [newBoard, moveScore, moved] = moveLeft(board);
        break;
      case 'right':
        [newBoard, moveScore, moved] = moveRight(board);
        break;
      case 'up':
        [newBoard, moveScore, moved] = moveUp(board);
        break;
      case 'down':
        [newBoard, moveScore, moved] = moveDown(board);
        break;
      default:
        return;
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      const newScore = score + moveScore;
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048-best-score', newScore.toString());
      }

      // Check win condition
      if (!gameWon && hasWon(newBoard)) {
        setGameWon(true);
        toast.success("Congratulations! You reached 2048!", {
          description: "You can continue playing to reach higher scores."
        });
      }

      // Check game over condition
      if (isGameOver(newBoard)) {
        setGameOver(true);
        toast.error("Game Over!", {
          description: "No more moves available. Try again!"
        });
      }
    }
  }, [board, score, gameWon, gameOver, bestScore]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameOver) return;

    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        makeMove('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        makeMove('right');
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        makeMove('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        makeMove('down');
        break;
    }
  }, [makeMove, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Score Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-center">
            <div className="text-sm text-gray-600 font-medium">SCORE</div>
            <div className="text-xl font-bold text-gray-800">{score.toLocaleString()}</div>
          </div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-center">
            <div className="text-sm text-gray-600 font-medium">BEST</div>
            <div className="text-xl font-bold text-gray-800">{bestScore.toLocaleString()}</div>
          </div>
        </div>
        <Button onClick={newGame} className="bg-orange-500 hover:bg-orange-600">
          New Game
        </Button>
      </div>

      {/* Game Board */}
      <GameBoard board={board} onMove={makeMove} />

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p className="mb-2">
          <strong>HOW TO PLAY:</strong> Use your arrow keys to move the tiles.
        </p>
        <p>When two tiles with the same number touch, they merge into one!</p>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-2xl max-w-sm mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
            <p className="text-gray-600 mb-6">
              Final Score: <span className="font-bold">{score.toLocaleString()}</span>
            </p>
            <Button onClick={newGame} className="w-full bg-orange-500 hover:bg-orange-600">
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
