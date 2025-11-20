import { useState , useEffect } from "react";
import { Link }  from "react-router-dom";
import axios from "../config/axios.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import banner1 from '../assets/images/banner-1.png';
import banner2 from '../assets/images/banner-2.png';
import banner3 from '../assets/images/banner-3.png';
import { useDispatch } from "react-redux";
import {addToCart} from "../features/cartSlice.js";

const Home = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Configuration des bannières du slider
    const banners = [
        {
            id: 1,
            image: banner1,
            bgColor: 'from-red-500 via-red-600 to-red-700',
            title: '11.11 SALE',
            subtitle: 'Up to 90% off',
            description: 'Coming in 2 days',
            coupons: [
                { discount: '$25 OFF', code: 'US2511', minOrder: '$139+' },
                { discount: '$12 OFF', code: 'US1211', minOrder: '$69+' },
                { discount: '$5 OFF', code: 'US0511', minOrder: '$29+' }
            ],
            dealPrice: '$43.59',
            dealLabel: 'Top deals'
        },
        {
            id: 2,
            image: banner2,
            bgColor: 'from-gray-200 via-gray-300 to-gray-400',
            title: 'Death Star',
            subtitle: 'Iconic collector\'s set',
            buttonText: 'Shop now',
            productImages: true
        },
        {
            id: 3,
            image: banner3,
            bgColor: 'from-cyan-400 via-blue-400 to-blue-500',
            title: 'Welcome deal',
            subtitle: 'New shopper special',
            buttonText: 'Shop now',
            discount: '-89%',
            productPrice: '$0.99'
        }
    ];

    useEffect(() => {

        const fetchProducts = async () => {
            const response = await axios.get('/products');
            console.log("hello");
            console.log(response);
            if (response) return response;
        }

        fetchProducts().then((res) => {
            setProducts([...res.data.data]);
        }).catch((err) => {
            console.log(err);
        });
    } , []);


    useEffect(() => {

        const getUser = async () => {
            const response = await axios.get("/users/me");

            if (response) return response;
        }

        getUser().then((res) => {
            console.log("user : ", res.data);
        }).catch((err) => {
            console.log(err);
        });
    } , []);

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 4000); // Change every 2 seconds

        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const handleAddToCart = (product) => {
        console.log("clicked");
        console.log("produit", product);
        dispatch(addToCart({productId: product._id, quantity: 1}));
    };

    return (
        <>
            <Header/>
            {/* Hero Slider */}
            <div className="h-16 md:h-20 bg-white"></div>
            <section className="relative overflow-hidden">
                {/* Slider Container */}
                <div className="relative h-[400px] md:h-[500px] lg:h-[700px]">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                index === currentSlide
                                    ? 'opacity-100 translate-x-0'
                                    : index < currentSlide
                                        ? 'opacity-0 -translate-x-full'
                                        : 'opacity-0 translate-x-full'
                            }`}
                        >
                            {/* Banner Background */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor}`}></div>

                            {/* Banner Content */}
                            <div className="relative h-full">
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all z-10 group"
                    aria-label="Previous slide"
                >

                    <img src="   https://cdn-icons-png.flaticon.com/512/3661/3661484.png " width="50" height="50"
                         alt="" title="" className="img-small"/>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all z-10 group"
                    aria-label="Next slide"
                >
                    <img src="   https://cdn-icons-png.flaticon.com/512/3661/3661482.png " width="50" height="50"
                         alt="" title="" className="img-small"/>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? 'w-12 h-3 bg-white'
                                    : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

            </section>


            {/*  affiche les produits  */}

            <div className="bg-white py-20 p-4 mx-auto max-w-[1200px]">

                <div className="mb-6 sm:mb-8 flex flex-col gap-3">
                    <h2 className="text-xl sm:text-3xl font-bold text-slate-900 ">Premium Threads</h2>
                    <p className="text-sm font-meduim text-slate-700">Shop great deals on Home Decor, Crystals Candles and more.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

                    {
                        products.map((product, index) =>
                            <div key={product._id || index} className="group overflow-hidden relative">
                                <Link to={`/product/${product._id}`} className="block">
                                    <div className="aspect-[3/4] bg-slate-100 w-full overflow-hidden">
                                        <img
                                            src={product.images?.[0]?.startsWith('http') ? product.images[0] : `https://res.cloudinary.com/dbrrmsoit/image/upload/${product.images?.[0]}` || "https://readymadeui.com/images/fashion-img-1.webp"}
                                            alt={product.title}
                                            className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>
                                    </div>
                                </Link>
                                        <div className="p-4 relative">
                                            <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10
                                            transition-all duration-500
                                            left-0 right-0
                                            group-hover:bottom-26
                                            lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100
                                            max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">
                                                <button type="button" title="Add to wishlist"
                                                        className="bg-transparent outline-0 border-0 cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         className="fill-slate-800 w-5 h-5 inline-block"
                                                         viewBox="0 0 64 64">
                                                        <path
                                                            d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                                                            data-original="#000000"></path>
                                                    </svg>
                                                </button>
                                                <button onClick={()=> handleAddToCart(product) }
                                                type="button" title="Add to cart"
²                                                        className="bg-transparent outline-0 border-0 cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         className="fill-slate-800 w-5 h-5 inline-block"
                                                         viewBox="0 0 512 512">
                                                        <path
                                                            d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                                                            data-original="#000000"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="z-20 relative bg-white">
                                                <h6 className="text-[15px] font-semibold text-slate-900 truncate">{product.title}</h6>
                                                <div className="">
                                                    <div className="flex items-center space-x-0.5 text-yellow-400 mt-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                                            <path
                                                                d="M12 17.42L6.25 21.54c-.29.2-.66-.09-.56-.43l2.14-6.74L2.08 10.15c-.26-.2-.13-.6.2-.62l7.07-.05L11.62 2.66c.1-.32.56-.32.66 0l2.24 6.82 7.07.05c.33.01.46.42.2.62l-5.75 4.22 2.14 6.74c.1.34-.27.63-.56.43L12 17.42z"/>
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                                            <path
                                                                d="M12 17.42L6.25 21.54c-.29.2-.66-.09-.56-.43l2.14-6.74L2.08 10.15c-.26-.2-.13-.6.2-.62l7.07-.05L11.62 2.66c.1-.32.56-.32.66 0l2.24 6.82 7.07.05c.33.01.46.42.2.62l-5.75 4.22 2.14 6.74c.1.34-.27.63-.56.43L12 17.42z"/>
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                                            <path
                                                                d="M12 17.42L6.25 21.54c-.29.2-.66-.09-.56-.43l2.14-6.74L2.08 10.15c-.26-.2-.13-.6.2-.62l7.07-.05L11.62 2.66c.1-.32.56-.32.66 0l2.24 6.82 7.07.05c.33.01.46.42.2.62l-5.75 4.22 2.14 6.74c.1.34-.27.63-.56.43L12 17.42z"/>
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                                            <path
                                                                d="M12 17.42L6.25 21.54c-.29.2-.66-.09-.56-.43l2.14-6.74L2.08 10.15c-.26-.2-.13-.6.2-.62l7.07-.05L11.62 2.66c.1-.32.56-.32.66 0l2.24 6.82 7.07.05c.33.01.46.42.2.62l-5.75 4.22 2.14 6.74c.1.34-.27.63-.56.43L12 17.42z"/>
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                                            <path
                                                                d="M12 17.42L6.25 21.54c-.29.2-.66-.09-.56-.43l2.14-6.74L2.08 10.15c-.26-.2-.13-.6.2-.62l7.07-.05L11.62 2.66c.1-.32.56-.32.66 0l2.24 6.82 7.07.05c.33.01.46.42.2.62l-5.75 4.22 2.14 6.74c.1.34-.27.63-.56.43L12 17.42z"/>
                                                        </svg>
                                                        <p className="text-gray-500 text-sm">(5)</p>
                                                    </div>
                                                </div>

                                                <h6 className="text-sm text-slate-600 font-medium mt-2">${product.prix}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                    }
                                </div>
                            </div>

                        <Footer />
                        </>
                        )

                    }


                    export default Home;