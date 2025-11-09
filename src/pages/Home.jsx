import { useState , useEffect } from "react";
import { Link }  from "react-router-dom";
import axios from "../config/axios.js";
import Header from "../components/Header.jsx";

const Home = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        const fetchProducts = async () => {
            const response = await axios.get('/products');
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


    return (
        <>
            <Header/>
            {/* hero section */}
            <section className="relative bg-gradient-to-r from-[#4FC3F7] via-[#29B6F6] to-[#0277BD] overflow-hidden">

                <div className="container mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-28">
                    <div className="grid lg:grid-cols-3 gap-8 items-center">
                        {/* Left Product Card */}
                        <div
                            className="relative bg-white rounded-lg shadow-xl p-4 transform hover:scale-105 transition-all duration-300 rotate-[-2deg]">
                            <div
                                className="absolute -top-3 -left-3 bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm shadow-lg">
                                $0.99
                            </div>
                            <div
                                className="absolute -top-3 -right-3 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg z-10">
                                -90%
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
                                alt="Product Deal"
                                className="w-full h-48 object-cover rounded-md mb-2"
                            />
                            <div className="bg-red-600 text-white text-center py-1 rounded text-xs font-bold">
                                50/100PCS
                            </div>
                        </div>

                        {/* Center Content */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                Welcome deal
                            </h1>
                            <p className="text-xl text-white/90">New shopper special</p>
                            <Link to="/shop">
                                <button
                                    className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-lg font-bold rounded-md shadow-xl">
                                    Shop now
                                </button>
                            </Link>

                            {/* Progress Dots */}
                            <div className="flex justify-center gap-2 pt-4">
                                <div key="dot-1" className="w-12 h-1 bg-white rounded-full"></div>
                                <div key="dot-2" className="w-12 h-1 bg-white/40 rounded-full"></div>
                                <div key="dot-3" className="w-12 h-1 bg-white/40 rounded-full"></div>
                            </div>
                        </div>

                        {/* Right Product Cards */}
                        <div className="flex gap-4 justify-center items-center">
                            <div
                                key="hero-card-1"
                                className="relative bg-white rounded-lg shadow-xl p-4 transform hover:scale-105 transition-all duration-300 rotate-[2deg]">
                                <div
                                    className="absolute -top-3 -left-3 bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm shadow-lg">
                                    $0.99
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"
                                    alt="Product"
                                    className="w-32 h-32 object-cover rounded-md mb-2"
                                />
                            </div>
                            <div
                                key="hero-card-2"
                                className="relative bg-white rounded-lg shadow-xl p-4 transform hover:scale-105 transition-all duration-300">
                                <div
                                    className="absolute -top-3 -left-3 bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm shadow-lg">
                                    $0.99
                                </div>
                                <div
                                    className="absolute -top-3 -right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
                                    DEALS
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300"
                                    alt="Product"
                                    className="w-32 h-32 object-cover rounded-md mb-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-8 right-8 w-20 h-20 opacity-20">
                    <span className="text-6xl">🍊</span>
                </div>
                <div className="absolute top-1/2 right-12 text-red-600 text-4xl opacity-30">🎁</div>
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
                                        <img src={product.images?.[0] || "https://readymadeui.com/images/fashion-img-1.webp"} alt={product.title}
                                             className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>
                                    </div>
                                </Link>
                                <div className="p-4 relative">
                                    <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10
                                            transition-all duration-500
                                            left-0 right-0
                                            group-hover:bottom-20
                                            lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100
                                            max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">
                                        <button type="button" title="Add to wishlist"
                                                className="bg-transparent outline-0 border-0 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 64 64">
                                                <path
                                                    d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                                                    data-original="#000000"></path>
                                            </svg>
                                        </button>
                                        <button type="button" title="Add to cart"
                                                className="bg-transparent outline-0 border-0 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 512 512">
                                                <path
                                                    d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                                                    data-original="#000000"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="z-20 relative bg-white">
                                        <h6 className="text-[15px] font-semibold text-slate-900 truncate">{product.title}</h6>
                                        <h6 className="text-sm text-slate-600 font-medium mt-2">${product.prix}</h6>
                                    </div>
                                </div>
                            </div>
                        )
                    }


            {/*        <div className="group overflow-hidden relative">*/}
            {/*            <a href="javascript:void(0)" className="block">*/}
            {/*                <div className="aspect-[3/4] bg-slate-100 w-full overflow-hidden">*/}
            {/*                    <img src="https://readymadeui.com/images/fashion-img-2.webp" alt="Product-2"*/}
            {/*                         className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>*/}
            {/*                </div>*/}
            {/*            </a>*/}
            {/*            <div className="p-4 relative">*/}
            {/*                <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10*/}
            {/*                                transition-all duration-500*/}
            {/*                                left-0 right-0*/}
            {/*                                group-hover:bottom-20*/}
            {/*                                lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100*/}
            {/*                                max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">*/}
            {/*                    <button type="button" title="Add to wishlist"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 64 64">*/}
            {/*                            <path*/}
            {/*                                d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" title="Add to cart"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 512 512">*/}
            {/*                            <path*/}
            {/*                                d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*                <div className="z-20 relative bg-white">*/}
            {/*                    <h6 className="text-[15px] font-semibold text-slate-900 truncate">Emerald Draped Dress –*/}
            {/*                        Flowing cape-style gown</h6>*/}
            {/*                    <h6 className="text-sm text-slate-600 font-medium mt-2">$120.00</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="group overflow-hidden relative">*/}
            {/*            <a href="javascript:void(0)" className="block">*/}
            {/*                <div className="aspect-[3/4] bg-slate-100 w-full overflow-hidden">*/}
            {/*                    <img src="https://readymadeui.com/images/fashion-img-3.webp" alt="Product-3"*/}
            {/*                         className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>*/}
            {/*                </div>*/}
            {/*            </a>*/}
            {/*            <div className="p-4 relative">*/}
            {/*                <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10*/}
            {/*                                transition-all duration-500*/}
            {/*                                left-0 right-0*/}
            {/*                                group-hover:bottom-20*/}
            {/*                                lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100*/}
            {/*                                max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">*/}
            {/*                    <button type="button" title="Add to wishlist"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 64 64">*/}
            {/*                            <path*/}
            {/*                                d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" title="Add to cart"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 512 512">*/}
            {/*                            <path*/}
            {/*                                d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*                <div className="z-20 relative bg-white">*/}
            {/*                    <h6 className="text-[15px] font-semibold text-slate-900 truncate">Minimalist Leather Tee*/}
            {/*                        Look – Modern streetwear</h6>*/}
            {/*                    <h6 className="text-sm text-slate-600 font-medium mt-2">$140.00</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="group overflow-hidden relative">*/}
            {/*            <a href="javascript:void(0)" className="block">*/}
            {/*                <div className="aspect-[3/4] bg-slate-100 w-full overflow-hidden">*/}
            {/*                    <img src="https://readymadeui.com/images/fashion-img-4.webp" alt="Product-4"*/}
            {/*                         className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>*/}
            {/*                </div>*/}
            {/*            </a>*/}
            {/*            <div className="p-4 relative">*/}
            {/*                <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10*/}
            {/*                                transition-all duration-500*/}
            {/*                                left-0 right-0*/}
            {/*                                group-hover:bottom-20*/}
            {/*                                lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100*/}
            {/*                                max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">*/}
            {/*                    <button type="button" title="Add to wishlist"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 64 64">*/}
            {/*                            <path*/}
            {/*                                d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" title="Add to cart"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 512 512">*/}
            {/*                            <path*/}
            {/*                                d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*                <div className="z-20 relative bg-white">*/}
            {/*                    <h6 className="text-[15px] font-semibold text-slate-900 truncate">Urban Knit Style –*/}
            {/*                        Casual street look with hoodie</h6>*/}
            {/*                    <h6 className="text-sm text-slate-600 font-medium mt-2">$120.00</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="group overflow-hidden relative">*/}
            {/*            <a href="javascript:void(0)" className="block">*/}
            {/*                <div className="aspect-[3/4] bg-slate-100 w-full overflow-hidden">*/}
            {/*                    <img src="https://readymadeui.com/images/fashion-img-5.webp" alt="Product-5"*/}
            {/*                         className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>*/}
            {/*                </div>*/}
            {/*            </a>*/}
            {/*            <div className="p-4 relative">*/}
            {/*                <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10*/}
            {/*                                transition-all duration-500*/}
            {/*                                left-0 right-0*/}
            {/*                                group-hover:bottom-20*/}
            {/*                                lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100*/}
            {/*                                max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">*/}
            {/*                    <button type="button" title="Add to wishlist"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 64 64">*/}
            {/*                            <path*/}
            {/*                                d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" title="Add to cart"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 512 512">*/}
            {/*                            <path*/}
            {/*                                d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*                <div className="z-20 relative bg-white">*/}
            {/*                    <h6 className="text-[15px] font-semibold text-slate-900 truncate">Bold Print Winter Set*/}
            {/*                        – Statement coat outfit</h6>*/}
            {/*                    <h6 className="text-sm text-slate-600 font-medium mt-2">$150.00</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="group overflow-hidden relative">*/}
            {/*            <a href="javascript:void(0)" className="block">*/}
            {/*                <div className="aspect-[3/4] bg-slate-100 w-full overflow-hidden">*/}
            {/*                    <img src="https://readymadeui.com/images/fashion-img-6.webp" alt="Product-6"*/}
            {/*                         className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>*/}
            {/*                </div>*/}
            {/*            </a>*/}
            {/*            <div className="p-4 relative">*/}
            {/*                <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10*/}
            {/*                                transition-all duration-500*/}
            {/*                                left-0 right-0*/}
            {/*                                group-hover:bottom-20*/}
            {/*                                lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100*/}
            {/*                                max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">*/}
            {/*                    <button type="button" title="Add to wishlist"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 64 64">*/}
            {/*                            <path*/}
            {/*                                d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" title="Add to cart"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 512 512">*/}
            {/*                            <path*/}
            {/*                                d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*                <div className="z-20 relative bg-white">*/}
            {/*                    <h6 className="text-[15px] font-semibold text-slate-900 truncate">Floral Puff Sleeve*/}
            {/*                        Dress – Feminine and casual</h6>*/}
            {/*                    <h6 className="text-sm text-slate-600 font-medium mt-2">$140.00</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="group overflow-hidden relative">*/}
            {/*            <a href="javascript:void(0)" className="block">*/}
            {/*                <div className="aspect-[3/4] bg-slate-100 w-full overflow-hidden">*/}
            {/*                    <img src="https://readymadeui.com/images/fashion-img-7.webp" alt="Product-7"*/}
            {/*                         className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>*/}
            {/*                </div>*/}
            {/*            </a>*/}
            {/*            <div className="p-4 relative">*/}
            {/*                <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10*/}
            {/*transition-all duration-500*/}
            {/*left-0 right-0*/}
            {/*group-hover:bottom-20*/}
            {/*lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100*/}
            {/*max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">*/}
            {/*                    <button type="button" title="Add to wishlist"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 64 64">*/}
            {/*                            <path*/}
            {/*                                d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" title="Add to cart"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 512 512">*/}
            {/*                            <path*/}
            {/*                                d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*                <div className="z-20 relative bg-white">*/}
            {/*                    <h6 className="text-[15px] font-semibold text-slate-900 truncate">Striped Tee & Blazer –*/}
            {/*                        Smart-casual streetwear</h6>*/}
            {/*                    <h6 className="text-sm text-slate-600 font-medium mt-2">$140.00</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="group overflow-hidden relative">*/}
            {/*            <a href="javascript:void(0)" className="block">*/}
            {/*                <div className="aspect-[3/4] bg-slate-100 w-full overflow-hidden">*/}
            {/*                    <img src="https://readymadeui.com/images/fashion-img-9.webp" alt="Product-8"*/}
            {/*                         className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"/>*/}
            {/*                </div>*/}
            {/*            </a>*/}
            {/*            <div className="p-4 relative">*/}
            {/*                <div className="flex flex-wrap justify-between gap-2 w-full absolute px-4 pt-3 z-10*/}
            {/*transition-all duration-500*/}
            {/*left-0 right-0*/}
            {/*group-hover:bottom-20*/}
            {/*lg:bottom-5 lg:opacity-0 lg:bg-white lg:group-hover:opacity-100*/}
            {/*max-lg:bottom-20 max-lg:py-3 max-lg:bg-white/60">*/}
            {/*                    <button type="button" title="Add to wishlist"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 64 64">*/}
            {/*                            <path*/}
            {/*                                d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" title="Add to cart"*/}
            {/*                            className="bg-transparent outline-0 border-0 cursor-pointer">*/}
            {/*                        <svg xmlns="http://www.w3.org/2000/svg"*/}
            {/*                             className="fill-slate-800 w-5 h-5 inline-block" viewBox="0 0 512 512">*/}
            {/*                            <path*/}
            {/*                                d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"*/}
            {/*                                data-original="#000000"></path>*/}
            {/*                        </svg>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*                <div className="z-20 relative bg-white">*/}
            {/*                    <h6 className="text-[15px] font-semibold text-slate-900 truncate">Tank Top & Denim –*/}
            {/*                        Everyday stylish look</h6>*/}
            {/*                    <h6 className="text-sm text-slate-600 font-medium mt-2">$140.00</h6>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        */}
                </div>
            </div>
        </>
    )

}


export default Home;