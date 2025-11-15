import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // 🧠 add this

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function CategorySection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 7;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      setCategories(data);
      console.log(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handlePrev = () => setStartIndex(Math.max(0, startIndex - 1));
  const handleNext = () =>
    setStartIndex(Math.min(categories.length - visibleCount, startIndex + 1));

  const handleCategoryClick = (slug: string) => {
    navigate(`/products?category=${slug}`);
  };

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <>
      {/* 🧠 SEO META TAGS */}
      <Helmet>
        <title>
          Explore Pearl Jewelry Categories | Sai Naman Pearls - Free Delivery
        </title>
        <meta
          name="description"
          content="Browse through a variety of handcrafted pearl jewelry categories including necklaces, earrings, bangles, and more. Discover the perfect design for every occasion at Sai Naman Pearls."
        />
        <meta
          name="keywords"
          content="pearl jewelry, necklace, earrings, bangles, jewelry categories, Sai Naman Pearls, handcrafted pearls"
        />
        <meta name="author" content="Sai Naman Pearls" />

        {/* ✅ Open Graph / Facebook */}
        <meta property="og:title" content="Explore Pearl Jewelry Categories" />
        <meta
          property="og:description"
          content="Discover beautifully handcrafted pearl jewelry in various categories at Sai Naman Pearls — Free Delivery All Over India."
        />
        <meta
          property="og:image"
          content="https://sainamanpearls.com/categories.jpg"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Explore Pearl Jewelry Categories | Sai Naman Pearls"
        />
        <meta
          name="twitter:description"
          content="Shop handcrafted pearl jewelry by category — necklaces, bangles, earrings and more."
        />
        <meta
          name="twitter:image"
          content="https://sainamanpearls.com/categories.jpg"
        />

        {/* ✅ Canonical URL */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Original Section */}
      <section className="relative bg-gradient-to-b from-black via-slate-900 to-black py-20 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-14 tracking-wide">
            EXPLORE BY CATEGORY
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center">
            {visibleCategories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-300"
              >
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg group-hover:border-yellow-500 transition-colors">
                  <img
                    src={category.image_url || "/placeholder.jpg"}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-base md:text-lg font-light tracking-wide group-hover:text-yellow-500 transition-colors">
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="border border-gray-500 p-3 rounded-full hover:bg-white hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={startIndex >= categories.length - visibleCount}
              className="border border-gray-500 p-3 rounded-full hover:bg-white hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
