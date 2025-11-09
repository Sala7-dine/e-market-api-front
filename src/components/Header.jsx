import { useState, useEffect } from 'react';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import Cookie from "js-cookie";
import {jwtDecode} from "jwt-decode";
import axios from "../config/axios";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Accueil', path: '/' },
        { name: 'Boutique', path: '/shop' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    const isHomePage = location.pathname === '/';

    const isAuthenticated = () => {
        const token = Cookie.get('accessToken');
        if (!token) return false;

        try {
            const decodded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            return decodded.exp >= currentTime;

        } catch (err) {
            console.log(err.message);
            Cookie.remove('accessToken');
            return false;
        }
    }

    const handleLogout = async () => {
        try {
            await axios.post("auth/logout");
            Cookie.remove('accessToken');
            navigate('/login');
        } catch (err) {
            console.error("Erreur logout :", err.response?.data);
        }
    }


    return (
        <header
            className={`${isHomePage ? 'absolute' : 'sticky'} top-0 z-50 w-full transition-all duration-500 ${
                isScrolled && !isHomePage
                    ? 'bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-b shadow-lg'
                    : ''
            }`}
        >
            <nav className="container mx-auto px-6 md:px-8 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className={`flex items-center space-x-3 group ${isHomePage ? 'text-white' : ''}`}
                    >
                        <div className={`p-2 rounded-xl transition-all ${
                            isHomePage
                                ? 'bg-white/10 group-hover:bg-white/20'
                                : 'bg-primary/10 group-hover:bg-primary/20'
                        }`}>
                            <ShoppingBag className="h-4 w-4" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Zendora</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-5 py-2.5 text-md font-medium transition-all duration-300 rounded-lg ${
                                    location.pathname === link.path
                                        ? isHomePage
                                            ? 'text-white bg-white/10'
                                            : 'text-primary bg-primary/10'
                                        : isHomePage
                                            ? 'text-white/70 hover:text-white hover:bg-white/5'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    { isAuthenticated() ?
                        <Link
                            to="/login"
                            onClick={handleLogout}
                            className={`relative px-5 py-2 text-md font-medium transition-all duration-300 rounded-lg text-white/70 hover:text-white hover:bg-white/5`}>
                            Deconnexion
                        </Link> :
                        <div className="hidden md:flex text-white">

                            <Link
                                to="/login"
                                className={`relative px-5 py-2 text-md font-medium transition-all duration-300 rounded-lg text-white/70 hover:text-white hover:bg-white/5`}>
                                Sign in
                            </Link>

                            <Link
                                to="/register"
                                className={`relative px-5 py-2 text-md font-medium transition-all duration-300 rounded-lg text-white/70 hover:text-white hover:bg-white/5`}>
                                Sign Up
                            </Link>

                        </div>

                    }



                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden py-6 border-t animate-fadeIn ${isHomePage ? 'bg-white/5 backdrop-blur-lg' : 'bg-muted/50'}`}>
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                                        location.pathname === link.path
                                            ? isHomePage
                                                ? 'bg-white/10 text-white'
                                                : 'bg-primary/10 text-primary'
                                            : isHomePage
                                                ? 'text-white/70 hover:bg-white/5 hover:text-white'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
