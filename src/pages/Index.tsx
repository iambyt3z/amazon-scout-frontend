import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Camera, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHealthCheck } from "@/hooks/use-health-check";

const searchSuggestions = [
  "Wireless Headphones",
  "Gaming Laptop",
  "Smart Watch",
  "Camera",
  "Office Chair"
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  
  // Perform health check on component mount to warm up backend
  const { isHealthy, isLoading, error, performHealthCheck } = useHealthCheck(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload logic here
      console.log("Image uploaded:", file.name);
      // You can add image processing, upload to server, or navigate to search with image
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  const handleSuggestionClick = (suggestion: string) => {
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large pulsing circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pulsing-glow" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pulsing-glow" 
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pulsing-glow" 
             style={{ animationDuration: '5s', animationDelay: '2s' }} />
        
        {/* Medium floating orbs */}
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-2xl floating-orb" 
             style={{ animationDuration: '8s', animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-400/30 to-pink-400/30 rounded-full blur-2xl floating-orb" 
             style={{ animationDuration: '7s', animationDelay: '3s' }} />
        
        {/* Small floating particles */}
        <div className="absolute top-1/6 right-1/6 w-24 h-24 bg-pink-400/40 rounded-full blur-xl floating-orb" 
             style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/6 left-1/6 w-32 h-32 bg-purple-400/40 rounded-full blur-xl floating-orb" 
             style={{ animationDuration: '4s', animationDelay: '2.5s' }} />
        <div className="absolute top-2/3 left-1/6 w-20 h-20 bg-blue-400/40 rounded-full blur-xl floating-orb" 
             style={{ animationDuration: '5s', animationDelay: '0.8s' }} />
        
        {/* Rotating gradient orbs */}
        <div className="absolute top-1/3 right-1/5 w-60 h-60 bg-gradient-to-r from-purple-400/25 via-blue-400/25 to-pink-400/25 rounded-full blur-2xl rotating-gradient" 
             style={{ animationDuration: '12s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/5 left-1/5 w-44 h-44 bg-gradient-to-r from-pink-400/25 via-purple-400/25 to-blue-400/25 rounded-full blur-2xl rotating-gradient" 
             style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>
      
      <div className="w-full max-w-2xl text-center relative z-10">
        {/* Search Title with Gradient Animation and Health Status */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 flex items-center justify-center gap-4">
            <span 
              className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift"
              style={{
                backgroundSize: "200% 200%",
                animation: "gradient-shift 3s ease-in-out infinite"
              }}
            >
              Search
            </span>
            {/* Backend Health Status Icon */}
            <div className="flex items-center">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              ) : isHealthy ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400" />
              )}
            </div>
          </h1>
        </div>

        <form onSubmit={handleSearch}>
          <div className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search for anything..."
              className={`w-full pl-12 pr-16 py-4 text-lg bg-gray-800/50 border-gray-700 rounded-xl text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-0 transition-all duration-300 ${
                isFocused 
                  ? "shadow-[0_0_30px_rgba(168,85,247,0.4)] border-purple-500/50 bg-gray-800/70" 
                  : "shadow-none"
              }`}
            />
            {/* Camera button */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </label>
            </div>
            {/* Glow effect overlay */}
            {isFocused && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-sm -z-10 animate-pulse" />
            )}
          </div>
        </form>

        {/* Search Suggestions */}
        <div className="mt-8">
          <p className="text-gray-400 text-sm mb-4">Popular searches:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {searchSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;