import React from "react";

const Card = () => {
    // Product Data
    const products = [
        {
            name: "Eco Rainbow Shoes",
            price: 749,
            img: "/eco-rainbow-shoes.jpg",
        },
        {
            name: "Eco Bombastic Shoes",
            price: 899,
            img: "/eco-bombastic-shoes.jpg",
        },
        {
            name: "Eco Casual Shoes",
            price: 599,
            img: "/eco-casual-shoes.jpg",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                    <div
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                    >
                        <div className="p-6 h-[50%]">
                            <h3 className="text-xl font-bold text-green-700 mb-2">
                                E-waste Recycled
                            </h3>
                            <p className="text-gray-600 mb-4">Sustainable and stylish.</p>
                            <div
                                className="flex  justify-between  items-center"
                            >
                                <span className="text-green-600 text-3xl font-bold">
                                    1000KG
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                    >
                        <div className="p-6 h-[50%]">
                            <h3 className="text-xl font-bold text-green-700 mb-2">
                                E-waste Recycled
                            </h3>
                            <p className="text-gray-600 mb-4">Sustainable and stylish.</p>
                            <div
                                className="flex  justify-between  items-center"
                            >
                                <span className="text-green-600 text-3xl font-bold">
                                    1000KG
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                    >
                        <div className="p-6 h-[50%]">
                            <h3 className="text-xl font-bold text-green-700 mb-2">
                                E-waste Recycled
                            </h3>
                            <p className="text-gray-600 mb-4">Sustainable and stylish.</p>
                            <div
                                className="flex  justify-between  items-center"
                            >
                                <span className="text-green-600 text-3xl font-bold">
                                    1000KG
                                </span>
                            </div>
                        </div>
                    </div>
                
            </div>
        </div>
    );
};

export default Card;
