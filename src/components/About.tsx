import {
  Play, Pause, RotateCcw, RotateCw, Maximize, Share2,
  Sparkles, Award, Package, ArrowRight
} from "lucide-react";
import { useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface AboutProps {
  onReviewsClick?: () => void;
}

export default function About({ onReviewsClick }: AboutProps) {
  const features = [
    { icon: Sparkles, title: "31 Years of Legacy", description: "Establishing a legacy of excellence since 1994." },
    { icon: Package, title: "Free Delivery All Over India", description: "Experience the joy of free shipping across India on all orders." },
    { icon: Award, title: "Guarantee Certificate", description: "Every creation is backed by our commitment to excellence." },
  ];


  const title = "About Sai Naman Pearls | 31 Years of Legacy in Pearl Jewellery";
  const description =
    "Sai Naman Pearls is a renowned brand in India, crafting timeless pearl jewellery for over 31 years. Registered with KVIC & MSME, we blend heritage with innovation.";
  const canonical = "https://sainamanpearls.com/about";
  const image = "https://sainamanpearls.com/assets/og-about.webp";
  const keywords = "Sai Naman Pearls, Pearl Jewellery, Hyderabad Pearls, Free Shipping, Legacy Jewellery Brand";

  
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://sainamanpearls.com/#organization",
        "name": "Sai Naman Pearls",
        "url": "https://sainamanpearls.com",
        "logo": "https://sainamanpearls.com/logo.png",
        "sameAs": [
          "https://www.facebook.com/sainamanpearls",
          "https://www.instagram.com/sainamanpearls"
        ]
      },
      {
        "@type": "WebPage",
        "@id": canonical,
        "url": canonical,
        "name": title,
        "description": description,
        "isPartOf": { "@id": "https://sainamanpearls.com/#website" },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sainamanpearls.com/" },
            { "@type": "ListItem", "position": 2, "name": "About", "item": canonical }
          ]
        }
      },
      {
        "@type": "VideoObject",
        "name": "Sai Naman Pearls — Brand Story",
        "description": "Sai Naman Pearls has been featured in renowned media outlets, celebrating 31 years of excellence.",
        "thumbnailUrl": ["https://sainamanpearls.com/assets/og-about.webp"],
        "uploadDate": "2024-11-10",
        "contentUrl": "https://sainamanpearls.com/review/about.mp4",
        "embedUrl": "https://sainamanpearls.com/review/about.mp4",
        "publisher": {
          "@type": "Organization",
          "name": "Sai Naman Pearls",
          "logo": {
            "@type": "ImageObject",
            "url": "https://sainamanpearls.com/logo.png"
          }
        }
      }
    ]
  };

  return (
    <HelmetProvider>
      <>
        {/* ✅ SEO Helmet Tags */}
        <Helmet>
          <html lang="en-IN" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <link rel="canonical" href={canonical} />
          <meta name="robots" content="index, follow" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image} />
          <meta property="og:url" content={canonical} />
          <meta property="og:site_name" content="Sai Naman Pearls" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={image} />

          {/* JSON-LD */}
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        {/* 💎 About Section */}
        <section
          id="about"
          className="relative bg-gradient-to-b from-black via-slate-900 to-black py-20 text-white overflow-hidden px-4 pt-32"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <h1 className="text-3xl font-light tracking-widest text-white mb-6">
                  OUR BRAND STORY
                </h1>

                <p className="text-zinc-400 text-lg leading-relaxed">
                  Discover the timeless elegance of Sai Naman Pearls, a revered name in the world of pearl jewelry for over 31 years...
                </p>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  From classic strands to contemporary designs, Sai Naman Pearls celebrates the essence of femininity...
                </p>

                {/* FEATURES */}
                <div className="flex flex-col sm:flex-row gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex-1 group bg-zinc-950 border border-zinc-800 p-6 transition-all duration-500 hover:border-zinc-600"
                      >
                        <Icon className="w-10 h-10 text-zinc-600 mb-4 group-hover:text-white transition-colors duration-500" />
                        <h3 className="text-lg font-light tracking-wide text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-zinc-500 text-sm">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>

                {onReviewsClick && (
                  <div className="pt-4">
                    <button
                      onClick={onReviewsClick}
                      className="group flex items-center gap-3 px-8 py-4 bg-zinc-950 border border-zinc-800 hover:border-white transition-all duration-300 hover:bg-zinc-900"
                    >
                      <div className="flex-1 text-left">
                        <p className="text-white text-lg font-light tracking-wider">
                          REVIEWS & TESTIMONIALS
                        </p>
                        <p className="text-zinc-500 text-sm mt-1">
                          See what our customers are saying
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT IMAGE */}
              <div className="space-y-10 flex justify-center">
                <img
                  src="/certificate.png"
                  alt="Sai Naman Pearls certification and quality guarantee"
                  loading="lazy"
                  width={500}
                  height={400}
                  className="w-full max-w-md rounded-xl shadow-xl object-cover border border-zinc-700 transition-transform duration-700"
                />
              </div>
            </div>

            <hr className="my-16 border-zinc-500" />
            <AboutVideo />
          </div>
        </section>
      </>
    </HelmetProvider>
  );
}

function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setIsPlaying(true); }
    else { video.pause(); setIsPlaying(false); }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (video) video.currentTime += seconds;
  };

  const fullscreen = () => {
    const video = videoRef.current;
    if (video?.requestFullscreen) video.requestFullscreen();
  };

  const shareVideo = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Sai Naman Pearls — Brand Story",
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported on your device.");
    }
  };

  return (
    <div className="relative flex flex-col items-center mt-10">
      <h2 className="text-lg sm:text-2xl md:text-3xl font-light tracking-widest text-white mb-6 text-center">
        OUR PRESENCE IN MEDIA — FEATURED IN LEADING NEWS OUTLETS
      </h2>

      <video
        ref={videoRef}
        src="/review/about.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="rounded-xl border border-zinc-700 shadow-lg w-full max-w-3xl"
      />

      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-xl mt-4 bg-zinc-900/80 backdrop-blur-sm p-3 rounded-xl border border-zinc-700 text-white">
        <button onClick={() => skip(-10)} className="hover:text-zinc-300"><RotateCcw size={22} /></button>
        <button onClick={togglePlay} className="hover:text-zinc-300">
          {isPlaying ? <Pause size={26} /> : <Play size={26} />}
        </button>
        <button onClick={() => skip(10)} className="hover:text-zinc-300"><RotateCw size={22} /></button>
        <button onClick={fullscreen} className="hover:text-zinc-300"><Maximize size={22} /></button>
        <button onClick={shareVideo} className="hover:text-zinc-300"><Share2 size={22} /></button>
      </div>
    </div>
  );
}
