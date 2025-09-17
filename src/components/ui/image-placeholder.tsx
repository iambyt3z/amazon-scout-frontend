import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ImagePlaceholder({ className, size = "md" }: ImagePlaceholderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  return (
    <div className={cn(
      "flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded-lg",
      sizeClasses[size],
      className
    )}>
      <ImageIcon className={cn(
        "text-gray-500",
        size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"
      )} />
    </div>
  );
}
