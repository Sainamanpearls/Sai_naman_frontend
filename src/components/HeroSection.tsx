import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JewelryItem {
  id: number;
  thumbnail: string;
  background: string;
  title: string;
}

const jewelryItems: JewelryItem[] = [
  { id: 1, thumbnail: "/hero/h1.webp", background: "/hero/h1.webp", title: "Wedding Rings" },
  { id: 2, thumbnail: "/hero/h2.webp", background: "/hero/h2.webp", title: "Pendant Necklace" },
  { id: 3, thumbnail: "/hero/h3.webp", background: "/hero/h3.webp", title: "Gold Rings" },
  { id: 4, thumbnail: "/hero/h4.webp", background: "/hero/h4.webp", title: "Diamond Ring" },
  { id: 5, thumbnail: "/hero/h5.webp", background: "/hero/h5.webp", title: "Luxury Jewelry" },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const navigate = useNavigate();

  const handlePrevious = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? jewelryItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === jewelryItems.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Luxury Jewelry | Timeless Elegance</title>
        <meta
          name="description"
          content="Explore exquisite collections of rings, necklaces, and fine jewelry crafted with elegance and precision."
        />
        <meta name="keywords" content="jewelry, diamond rings, gold, necklace, wedding jewelry, luxury accessories" />

   
        <link rel="preload" as="image" href="/hero/h1.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/public/logo2.png" fetchPriority="high" />
      </Helmet>

      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {jewelryItems.map((item, index) => {
            const isCurrent = index === currentIndex;

         
            const noTransition = index === 0 ? "transition-none" : "";

            const translateX = isCurrent ? "0%" : direction === "right" ? "100%" : "-100%";

            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-all duration-[1200ms] ${noTransition}`}
                style={{
                  opacity: isCurrent ? 1 : 0,
                  transform: `translateX(${translateX}) scale(${isCurrent ? 1 : 1.05})`,
                  transitionTimingFunction: "cubic-bezier(0.42, 0, 0.58, 1)",
                  willChange: "opacity, transform",
                }}
              >
                <img
                  src={item.background}
                  alt={item.title}
                  className="w-full h-full object-cover absolute inset-0"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  width="1920"
                  height="1080"
                />

                <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)]" />
              </div>
            );
          })}
        </div>

        
        <div className="relative z-10 h-full flex items-center text-white container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center text-center lg:text-left w-full">
            <div className="space-y-4 lg:space-y-6">
              <img
                src="/public/logo2.png"
                alt="Brand Logo"
                className="w-32 sm:w-48 lg:w-60 mx-auto lg:mx-0"
                loading="eager"            
                fetchPriority="high"
                decoding="async"
                width="300"
                height="150"
              />

              <p className="text-2xl tracking-wide uppercase text-gray-300">
                Every pearl we select carries a quiet radiance of its own.
              </p>

              <p className="text-gray-300 max-w-md mx-auto lg:mx-0 text-base">
                Our designs blend classic sophistication with a touch of contemporary artistry.
                Discover pieces made to complement your unique elegance, every day.
              </p>

              <div className="flex justify-center lg:justify-start gap-4 pt-2">
                <button className="w-10 h-10 sm:w-12 sm:h-12 border border-white/30 rounded flex items-center justify-center hover:bg-white/10">
                  <ArrowDown className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-2 sm:px-8 sm:py-3 border border-white/30 rounded hover:bg-white hover:text-black text-sm tracking-wider"
                >
                  SHOP NOW
                </button>
              </div>
            </div>

            
            <div className="hidden md:flex flex-col items-end gap-2 mt-6">
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 justify-end">
                {jewelryItems.map((item, index) => (
                  <button
                    key={`thumb-${item.id}`}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-24 h-32 sm:w-28 sm:h-36 rounded-md overflow-hidden transition-transform duration-300 ${
                      currentIndex === index ? "scale-105" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.thumbnail}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      alt={item.title}
                      decoding="async"
                      width="300"
                      height="400"
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-6 mt-4">
                <button
                  onClick={handlePrevious}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10"
                >
                  <ChevronLeft />
                </button>

                <span className="text-2xl sm:text-4xl font-light">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>

                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
