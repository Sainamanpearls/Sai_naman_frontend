import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface FooterProps {
  onContactClick: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
  return (
    <>
     
      <Helmet>
        <title>Sai Naman Pearls | Timeless Elegance in Every Pearl</title>
        <meta
          name="description"
          content="Sai Naman Pearls – discover handcrafted pearl jewelry in Hyderabad. Visit our stores in Gachibowli & Ameerpet or shop elegant collections online."
        />
        <meta
          name="keywords"
          content="Pearls, Hyderabad Pearls, Sai Naman Pearls, Pearl Jewellery, Pearl Necklaces, Ameerpet Pearls, Gachibowli Pearls"
        />
        <meta name="author" content="Sai Naman Pearls" />
        <meta property="og:title" content="Sai Naman Pearls | Handcrafted Pearl Jewellery" />
        <meta
          property="og:description"
          content="Elegant handcrafted pearls from Hyderabad. Visit Sai Naman Pearls at Gachibowli or Ameerpet."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sainamanpearls.com/" />
        <meta property="og:image" content="https://sainamanpearls.com/og-image.jpg" />
        <link rel="canonical" href="https://sainamanpearls.com/" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JewelryStore",
            name: "Sai Naman Pearls",
            description:
              "Sai Naman Pearls offers handcrafted pearl jewelry in Hyderabad, blending tradition with elegance.",
            url: "https://sainamanpearls.com",
            logo: "https://sainamanpearls.com/logo.png",
            telephone: "+91 98494-72755",
            email: "sainamanpearls1@gmail.com",
            sameAs: [
              "https://www.instagram.com/sainamanpearls_",
              "https://www.facebook.com/share/1KhQaRBrLg/"
            ],
            address: [
              {
                "@type": "PostalAddress",
                streetAddress: "ESCI Campus Gachibowli",
                addressLocality: "Hyderabad",
                addressRegion: "Telangana",
                postalCode: "500032",
                addressCountry: "IN"
              },
              {
                "@type": "PostalAddress",
                streetAddress: "3rd Floor, Aditya Park Hotel Lobby, Ameerpet",
                addressLocality: "Hyderabad",
                addressRegion: "Telangana",
                postalCode: "500038",
                addressCountry: "IN"
              }
            ],
            openingHours: "Mo-Su 10:00-21:00"
          })}
        </script>
      </Helmet>

    
      <footer className="relative bg-gradient-to-b from-black via-slate-900 to-black py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none z-10" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <h1 className="text-6xl sm:text-7xl lg:text-5xl font-dark tracking-widest text-white/[0.07] select-none whitespace-nowrap">
            <b><i>SAI NAMAN PEARLS</i></b>
          </h1>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-20 grid sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
         
            <section aria-labelledby="footer-brand">
              <h2 id="footer-brand" className="text-2xl font-light tracking-widest mb-6">
                Sai Naman Pearls
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Discover the elegance of handcrafted pearls with Sai Naman Pearls.
                Each piece tells a story of timeless beauty and exquisite craftsmanship.
              </p>
              <nav aria-label="Social media" className="flex space-x-4">
                <a
                  href="https://www.instagram.com/sainamanpearls_?igsh=MTN3MnQ2bHhhNTkyYw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/share/1KhQaRBrLg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </nav>
            </section>

         
            <nav aria-label="Shop">
              <h3 className="text-white tracking-wider font-light mb-6">SHOP</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Collections</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Reviews</a></li>
              </ul>
            </nav>

       
            <nav aria-label="Support">
              <h3 className="text-white tracking-wider font-light mb-6">SUPPORT</h3>
              <ul className="space-y-3">
                <li><button onClick={onContactClick} className="text-zinc-400 hover:text-white transition-colors text-sm">Contact Us</button></li>
                <li><button onClick={onContactClick} className="text-zinc-400 hover:text-white transition-colors text-sm">Shipping & Returns</button></li>
                <li><button onClick={onContactClick} className="text-zinc-400 hover:text-white transition-colors text-sm">FAQ</button></li>
              </ul>
            </nav>

          
            <address className="not-italic">
              <h3 className="text-white tracking-wider font-light mb-6">GET IN TOUCH</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-zinc-600 mt-1 flex-shrink-0" />
                  <a href="tel:+919849472755" className="text-zinc-400 hover:text-white transition-colors text-sm">
                    +91 98494-72755
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-zinc-600 mt-1 flex-shrink-0" />
                  <a href="mailto:sainamanpearls1@gmail.com" className="text-zinc-400 hover:text-white transition-colors text-sm">
                    sainamanpearls1@gmail.com
                  </a>
                </li>
              </ul>
            </address>

         
            <section aria-labelledby="footer-location">
              <h3 id="footer-location" className="text-white tracking-wider font-light mb-6">VISIT US</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-zinc-600 mt-1 flex-shrink-0" />
                  <address className="not-italic text-sm text-zinc-400">
                    Sai Naman Pearls<br />
                    ESCI campus Gachibowli,<br />
                    Hyderabad, Telangana 500032.
                  </address>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-zinc-600 mt-1 flex-shrink-0" />
                  <address className="not-italic text-sm text-zinc-400">
                    Sai Naman Pearls<br />
                    3rd Floor, Aditya Park Hotel Lobby,<br />
                    Ameerpet Hyderabad, Telangana 500038.
                  </address>
                </li>
              </ul>
            </section>
          </section>

        
          <section className="border-t border-zinc-900 py-8">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <p className="text-zinc-600 text-xs tracking-wider">
                © 2025 Sai Naman Pearls. ALL RIGHTS RESERVED.
              </p>
              <nav className="flex flex-wrap gap-4 sm:justify-end text-xs tracking-wide">
                <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">Terms & Conditions</a>
                <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">Cookie Settings</a>
              </nav>
            </div>

   
            <div className="text-center">
              <p className="text-zinc-400 text-xs tracking-wider mb-2">
                Fast and secure checkouts.
              </p>
            </div>

            <div className="text-center pt-6 border-t border-zinc-900/50">
              <p className="text-zinc-700 text-xs tracking-wider">
                Crafted with precision. Worn with pride.
              </p>
            </div>
          </section>
        </div>
      </footer>
    </>
  );
}
