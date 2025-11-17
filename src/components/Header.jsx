import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "../config/axios";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Boutique", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`${
        isHomePage ? "absolute" : "sticky"
      } top-0 z-50 w-full transition-all duration-500 ${
        isScrolled && !isHomePage
          ? "bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-b shadow-lg"
          : ""
      }`}
    >
      <nav className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center space-x-3 group ${
              isHomePage ? "text-black" : ""
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-all ${
                isHomePage
                  ? "bg-white/10 group-hover:bg-white/20"
                  : "bg-primary/10 group-hover:bg-primary/20"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight">Zendora</span>
          </Link>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 ">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {isAuthenticated() ? (
            <div className="hidden md:flex text-black gap-2">
              <Link
                to="/profile"
                className="text-sm cursor-pointer relative px-6 py-2.5 text-black font-semibold border rounded-full overflow-hidden group"
              >
                <span className="absolute left-0 top-0 w-full h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Profile
                </span>
              </Link>
              <Link
                to="/"
                onClick={logout}
                className="text-sm cursor-pointer relative px-6 py-2.5 text-black font-semibold border rounded-full overflow-hidden group"
              >
                <span className="absolute left-0 top-0 w-full h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Deconnexion
                </span>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex text-black gap-2">
              <Link
                to="/login"
                className="text-sm cursor-pointer relative px-6 py-2.5 text-black font-semibold border rounded-full overflow-hidden group"
              >
                <span className="absolute left-0 top-0 w-full h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Sign in
                </span>
              </Link>

              {/*<Link*/}
              {/*    to="/login"*/}
              {/*    className={`relative px-5 py-2 text-md font-medium transition-all duration-300 rounded-lg text-black hover:text-white hover:bg-black`}>*/}
              {/*    Sign in*/}
              {/*</Link>*/}

              <Link
                to="/register"
                className="text-sm cursor-pointer relative px-6 py-2.5 text-black font-semibold border border-black rounded-full overflow-hidden group"
              >
                <span className="absolute left-0 top-0 w-full h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Sign up
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden py-6 border-t animate-fadeIn ${
              isHomePage ? "bg-white/5  backdrop-blur-lg" : "bg-muted/50"
            }`}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    location.pathname === link.path
                      ? isHomePage
                        ? "bg-white/10 text-white"
                        : "bg-primary/10 text-primary"
                      : isHomePage
                      ? "text-white/70 hover:bg-white/5 hover:text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
