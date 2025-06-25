
import Game from "@/components/Game";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-2">2048</h1>
          <p className="text-gray-600">Join the tiles, get to 2048!</p>
        </div>
        <Game />
      </div>
    </div>
  );
};

export default Index;
