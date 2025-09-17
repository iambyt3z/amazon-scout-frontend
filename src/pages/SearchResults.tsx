import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List, Home, RefreshCw, Star, ExternalLink, CheckCircle, XCircle, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useHealthCheck } from "@/hooks/use-health-check";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { searchProductsWithResponse } from "@/lib/api";
import { transformProducts, type Product } from "@/lib/transformers";
import { Badge } from "@/components/ui/badge";

// CollapsibleResponseMessage component
const CollapsibleResponseMessage = ({ message }: { message: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-2">
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-800/50 transition-colors"
        >
          <span className="text-sm text-gray-300">AI Response</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-3 pb-3">
            <p className="text-sm text-gray-300 leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ProductImage component with sleek fallback
const ProductImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset states when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [src]);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  if (imageError || !src || src === '/placeholder.svg') {
    return (
      <div className={`flex items-center justify-center bg-gray-800/50 border border-gray-700 ${className}`}>
        <ImagePlaceholder size="lg" />
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-800/50 border border-gray-700 ${className}`}>
          <ImagePlaceholder size="lg" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`object-cover ${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showGlow, setShowGlow] = useState(false);
  
  // Perform health check on component mount to warm up backend (only once)
  const { isHealthy, isLoading: healthLoading } = useHealthCheck(true);
  
  // Get the search query from URL parameters
  const query = searchParams.get("q") || "";
  
  // Use React Query to fetch products from the API
  const { 
    data: searchData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['searchProducts', query],
    queryFn: () => {
      console.log('React Query triggered with query:', query);
      return searchProductsWithResponse(query);
    },
    enabled: !!query, // Only run query when there's a search term
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Transform the API data to UI Product format
  const products: Product[] = searchData ? transformProducts(searchData.products || []) : [];
  const infoMessage = (searchData?.response || '').trim();

  useEffect(() => {
    console.log('Query parameter changed to:', query);
    setSearchQuery(query);
  }, [query]);

  // Effect to show glow when loading completes successfully
  useEffect(() => {
    if (!isLoading && !isError && products.length > 0) {
      setShowGlow(true);
      // Remove glow after animation completes
      const timer = setTimeout(() => setShowGlow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isError, products.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search button clicked, query:', searchQuery);
    setSearchParams({ q: searchQuery });
  };


  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
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
      {/* Search Header */}
      <div className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-20 relative">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex gap-4 items-center">
            <Link to="/">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white p-2"
              >
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <form onSubmit={handleSearch} className="flex gap-4 items-center flex-1">
              <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-0"
              />
            </div>
              <Button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">
                Search
              </Button>
            </form>
            {/* Backend Health Status Icon */}
            <div className="flex items-center ml-2">
              {healthLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : isHealthy ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-800 relative z-10">
        <div className="flex items-center gap-4">
          <p className={`text-gray-300 transition-all duration-1000 ${
            showGlow ? 'text-white font-medium drop-shadow-lg' : ''
          }`}>
            {isLoading ? "Searching..." : `${products.length} results`} {query && `for "${query}"`}
          </p>
          <Button variant="outline" size="sm" className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-gray-700 text-white" : "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-gray-700 text-white" : "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Backend Info Message */}
      {!!infoMessage && <div className="relative z-10"><CollapsibleResponseMessage message={infoMessage} /></div>}


      {/* Results Grid */}
      <div className="max-w-4xl mx-auto px-6 py-6 relative z-10">
        {/* Multicolored Glow Effect */}
        {showGlow && (
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-emerald-500/15 to-yellow-500/15 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-rose-500/10 via-indigo-500/10 to-teal-500/10 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        )}
        {/* Loading State */}
        {isLoading && (
          <div className={`${viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 overflow-hidden">
                <div className={viewMode === "grid" ? "aspect-square" : "flex gap-4"}>
                  <div className={`flex items-center justify-center bg-gray-800/50 border border-gray-700 ${
                    viewMode === "grid" ? "w-full h-48" : "w-32 h-32 rounded-lg"
                  }`}>
                    <ImagePlaceholder size="lg" />
                  </div>
                  <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <Skeleton className="h-4 w-3/4 mb-2 bg-gray-800" />
                    <Skeleton className="h-3 w-1/2 mb-3 bg-gray-800" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20 bg-gray-800" />
                      <Skeleton className="h-8 w-24 bg-gray-800" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2 text-white">Error loading products</h3>
              <p className="text-gray-400 mb-4">
                {error instanceof Error ? error.message : 'Something went wrong while searching for products.'}
              </p>
              <Button 
                onClick={() => refetch()}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !isError && products.length > 0 && (
          <div className={`${viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }`}>
            {products.map((product) => {
              const href = product.specifications?.sourceUrl;
              const priceDisplay = (product.price && product.price.trim().length > 0) ? product.price : '—';

              return (
                <Card key={product.id} className={`bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-1000 overflow-hidden ${
                  showGlow ? 'shadow-2xl shadow-purple-500/40 ring-2 ring-purple-400/60' : ''
                }`}>
                  <div className={viewMode === "grid" ? "aspect-square" : "flex gap-4"}>
                    <ProductImage 
                      src={product.image}
                      alt={product.name}
                      className={viewMode === "grid" ? "w-full h-48" : "w-32 h-32 rounded-lg"}
                    />
                    <div className={viewMode === "grid" ? "" : "flex-1"}>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base text-white line-clamp-2 leading-snug">
                          {product.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3" /> {product.rating}</span>
                            <span>{product.reviews} reviews</span>
                          </div>
                          <Badge variant="outline" className={product.inStock ? "text-green-400 border-green-600" : "text-red-400 border-red-600"}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-white">{priceDisplay}</span>
                          {href ? (
                            <Button 
                              size="sm" 
                              className="bg-gray-700 hover:bg-gray-600 text-white"
                              onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View on Amazon
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="bg-gray-700 hover:bg-gray-600 text-white"
                              disabled
                            >
                              No Link Available
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && products.length === 0 && query && (
          <div className="text-center py-20">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2 text-white">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or browse our categories
              </p>
            </div>
          </div>
        )}

        {/* No Search Query State */}
        {!isLoading && !isError && !query && (
          <div className="text-center py-20">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2 text-white">Search for products</h3>
              <p className="text-gray-400">
                Enter a search term above to find products
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;