import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    if (!loading && user) {
      if (userData?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/voter");
      }
    }
  }, [user, userData, loading, navigate]);

  const categories = [
    "Face of Trendy (M/F)", "Ladies Man", "Mr Fresher", "Take Home Mama", "Miss Fresher", "Best Hang Out Sport",
    "Hall of Fame", "Most Influential", "Most Attractive (M/F)", "Most Expensive (M/F)", "Most Sophisticated (M/F)",
    "Tightest Wardrobe (M/F)", "Most Endowed", "Couple of the Year", "Most Enterprising Student", "Money Bag",
    "Tightest Clique (M/F)", "Young Baller", "Big Bold and Beautiful", "Tightest Wheels", "MC of the Year",
    "DJ of the Year", "Best Dance Group", "Social Media Influencer", "Best Dancer", "Photographer of the Year",
    "Hypeman of the Year", "Event of the Year", "Comedian of the Year", "Media Brand of the Year", "Model of the Year",
    "Blogger of the Year", "Best Entertainment Group", "Online TV of the Year", "Socialite of the Year", "Mr Classy",
    "Hour Glass", "Sport Man of the Year", "Slay Queen", "Sport Woman of the Year", "Mr Ebony", "Brand of the Year",
    "Next Rated", "Artists of the Year", "Makeup Artist", "Best Rapper", "Best Kitchen", "Rookie of the Year"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/public/1000098173-removebg-preview.png" alt="Trendymates Award Logo" className="h-12 w-auto filter brightness-0 invert" />
            </div>
            <div className="hidden md:flex items-center space-x-4">
    <Link to="/login"       className=" block text-center py-2.5 px-4 border border-white/20 rounded-lg text-white backdrop-blur hover:bg-white/10 transition-all duration-300"
>
                Sign In
              </Link>
              <Link to="/signup" className=" block text-center py-2.5  px-5 rounded-lg font-semibold text-white bg-gradient-to-r from-red-700 via-amber-600 to-yellow-500 hover:from-red-800 hover:to-yellow-400 transition-all duration-300 shadow-md"
>

                Sign Up
              </Link>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-red-400 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
<div className="md:hidden bg-gradient-to-b from-black via-[#1a1a1a] to-black/90 backdrop-blur-md border-t border-white/10 shadow-inner">
  <div className="px-4 py-4 space-y-4">
    <Link
      to="/login"
      className="w-full block text-center py-2.5 px-4 border border-white/20 rounded-lg text-white backdrop-blur hover:bg-white/10 transition-all duration-300"
    >
      Sign In
    </Link>
    <Link
      to="/signup"
      className="w-full block text-center py-2.5 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-red-700 via-amber-600 to-yellow-500 hover:from-red-800 hover:to-yellow-400 transition-all duration-300 shadow-md"
    >
      Sign Up
    </Link>
  </div>
</div>

        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-20 relative">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-amber-500 to-red-600 bg-clip-text text-transparent animate-pulse">
              TRENDYMATES
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">AWARD 2025</h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
              The ultimate platform recognizing excellence, innovation, and achievements in our community
            </p>
            <Link to="/login" size="lg" className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-700 hover:via-red-600 hover:to-amber-600 text-white font-bold px-12 py-4 text-lg rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-110 animate-pulse">
              🗳️ VOTE NOW
            </Link>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <img src="/public/IMG-20250625-WA0060(1).jpg" alt="Trendymates Award 2025 Flyer" className="max-w-full h-auto rounded-2xl shadow-2xl shadow-red-500/30 border border-white/10 hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
       <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-amber-900/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <section className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                  About Us
                </h2>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>
                    <strong className="text-white">Trendymates Award</strong> is a platform for people that have done well enough to be recognized and appreciated, being awarded in order to encourage them to keep up with development of humanity and individual achievement respectively.
                  </p>
                  <p>
                    We present <strong className="text-red-400">Trendymates Award KWASU 2025</strong> to you, a unique platform that has been in existence since 2014 to recognize and acknowledge activities and efforts of students towards humanity, entrepreneurship and development.
                  </p>
                  <p>
                    Furthermore, we infuse thrilling fun-fair experience with award night atmosphere to entertain our awardees and audience.
                  </p>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-red-900/20 to-amber-900/20 rounded-xl border border-red-500/20">
                    <h3 className="text-xl font-semibold text-white mb-4">Key Features:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✨ Awards that cannot be bought by nominees</li>
                      <li>🗳️ Free voting - no payment required</li>
                      <li>📈 Raises profile and enhances reputation</li>
                      <li>🏆 Winner determined by highest votes</li>
                      <li>🎓 Designed for the General Student Body</li>
                      <li>🌟 Recognizes humanity and individual achievement</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <img src="/public/IMG-20250613-WA0071.jpg" alt="About Trendymates Award" className="max-w-full h-auto rounded-2xl shadow-2xl shadow-red-500/20 border border-white/10 hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nomination Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 via-amber-400 to-red-500 bg-clip-text text-transparent">
              Nomination Categories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover all the exciting categories where you can nominate and vote for your favorite personalities
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="flex justify-center">
              <img src="/public/IMG-20250613-WA0072.jpg" alt="Nomination Categories" className="max-w-full h-auto rounded-2xl shadow-2xl shadow-amber-500/20 border border-white/10 hover:scale-105 transition-transform duration-500" />
            </div>
            
            <section className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
              <h3 className="text-3xl font-bold mb-6 text-white">All Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                {categories.map((category, index) => <div key={index} className="bg-gradient-to-r from-red-900/20 to-amber-900/20 p-3 rounded-lg border border-red-500/20 hover:border-red-400/40 transition-all duration-300 hover:scale-105 cursor-pointer">
                    <p className="text-sm font-medium text-white">{category}</p>
                  </div>)}
              </div>
            </section>
          </div>

          <div className="text-center">
            <Link to="/login"button size="lg" className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-bold px-12 py-4 text-lg rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-110">🏆 Start Voting</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <section className="bg-black/60 backdrop-blur-md border border-white/10 p-12 rounded-2xl shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
              Get In Touch
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              For more information, inquiries, or support
            </p>
            <div className="space-y-4 text-lg">
              <p className="text-white font-semibold">
                📞 WhatsApp: <span className="text-red-400">+234 813 084 5336</span>
              </p>
              <p className="text-gray-300">
                📍 HayJay Sports Center, Behind Sydney Tarmac<br />
                Kwara State University Malete
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/public/1000098173-removebg-preview.png" alt="Trendymates Award Logo" className="h-8 w-auto filter brightness-0 invert mr-3" />
              <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                Trendymates Award 2025
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2025 Trendymates Award. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Recognizing Excellence • Celebrating Achievement • Building Community
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #dc2626, #d97706);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #b91c1c, #b45309);
        }
      `}</style>
    </div>
  );
};