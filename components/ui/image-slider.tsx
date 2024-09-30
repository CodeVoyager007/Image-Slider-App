"use client"; // Enables client-side rendering for this component

import React, { useState, useEffect, useCallback } from "react"; // Import React hooks
import Image from "next/image"; // Import Next.js Image component
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; // Import custom Carousel components
import { Button } from "@/components/ui/button"; // Import custom Button component
import { PlayIcon, PauseIcon } from "lucide-react"; // Import icons from lucide-react

// Define the ImageData interface
interface ImageData {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
  };
}

export default function ImageSlider() {
  // State to manage the images fetched from the API
  const [images, setImages] = useState<ImageData[]>([]);
  // State to manage the current image index in the carousel
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // State to manage the play/pause status of the carousel
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const interval = 3000; // Interval for the carousel autoplay

  // Function to fetch images from Unsplash API
  const fetchImages = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&per_page=10`
      );
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // useEffect to fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Function to go to the next image
  const nextImage = useCallback((): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // useEffect to handle the autoplay functionality
  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(nextImage, interval);
      return () => clearInterval(id);
    }
  }, [isPlaying, nextImage]);

  // Function to toggle play/pause status
  const togglePlayPause = (): void => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  // JSX return statement rendering the Image Slider UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-black"> {/* Added bg-black */}
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl Times-New-Roman text-center mb-4 text-white">Image Slider</h1> {/* Changed text color to white */}
        <p className="text-center text-gray-400 mb-8"> {/* Changed text color to a lighter gray */}
          A simple dynamic image slider/carousel with Unsplash.
        </p>
        <Carousel className="rounded-lg overflow-hidden relative">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={image.id}
                className={index === currentIndex ? "block" : "hidden"}
              >
                <div className="border border-white"> {/* Added border */}
                  <Image
                    src={image.urls.regular}
                    alt={image.alt_description}
                    width={800}
                    height={400}
                    className="w-full max-h-[400px] object-cover" // Limit height and ensure the image fits properly
                  />
                </div>
                <div className="p-2 bg-white/75 text-center">
                  <h2 className="text-lg font-bold text-white">{image.user.name}</h2> {/* Changed text color to white */}
                  <p className="text-sm text-white"> {/* Changed text color to white */}
                    {image.description || image.alt_description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="bg-white/50 hover:bg-white/75 p-2 rounded-full shadow-md transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6 text-gray-800" />
              ) : (
                <PlayIcon className="w-6 h-6 text-gray-800" />
              )}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
          </div>
        </Carousel>
        <p
          className="absolute bottom-4 right-4"
          style={{
            fontFamily: "Times-New-Roman",
            color: "#900020",
          }}
        >
          Made with ♥ by Ayesha Mughal
        </p>
      </div>
    </div>
  );
}
