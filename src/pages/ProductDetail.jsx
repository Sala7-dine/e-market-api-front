import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../config/axios";
import Header from "../components/Header";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/products/${id}`);
                setProduct(response.data.data);
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl">Loading...</div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl">Product not found</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-6 py-20">
                <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
                    ← Back to Home
                </Link>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                            src={product.images?.[0] || "https://via.placeholder.com/500"} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                        
                        <div className="text-2xl font-bold text-blue-600">
                            ${product.prix}
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-600">Stock: {product.stock} available</p>
                            <p className="text-gray-600">Rating: {product.averageRating}/5</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Description</h3>
                            <p className="text-gray-700">{product.description}</p>
                        </div>

                        <div className="space-y-4">
                            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                Add to Cart
                            </button>
                            <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;