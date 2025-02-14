import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Scan = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUsingCamera, setIsUsingCamera] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [productDetails, setProductDetails] = useState({
        itemName: '',
        category: '',
        condition: '',
        weight: 0,
        quantity: 1,
        location: '',
        donationOrSale: 'donate',
        price: 0,
        biddingEnabled: false,
        biddingEndTime: "2025-02-25T23:59:59",
        status: 'pending',
        biddingStatus: 'active'
    });
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const isLoggedIn = JSON.parse(localStorage.getItem('userInfo')); // Get user data from localStorage
    const walletAddress = isLoggedIn ? isLoggedIn.walletAddress : '';
    const userId = isLoggedIn ? isLoggedIn._id : '';

    // Add a state to track if camera is ready
    const [isCameraReady, setIsCameraReady] = useState(false);

    // Modified useEffect to handle camera initialization
    useEffect(() => {
        let mounted = true;

        const initCamera = async () => {
            if (isUsingCamera && !isCameraReady) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: 'environment',
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        },
                        audio: false
                    });

                    if (mounted && videoRef.current) {
                        videoRef.current.srcObject = stream;
                        streamRef.current = stream;
                        videoRef.current.onloadedmetadata = () => {
                            if (mounted) {
                                videoRef.current.play();
                                setIsCameraReady(true);
                            }
                        };
                    }
                } catch (err) {
                    console.error('Error accessing camera:', err);
                    if (mounted) {
                        setCameraError('Unable to access camera. Please make sure you have granted camera permissions.');
                        setIsUsingCamera(false);
                        toast.error('Camera access denied. Please check your permissions.');
                    }
                }
            }
        };

        initCamera();

        return () => {
            mounted = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isUsingCamera]);

    // Modified startCamera function
    const startCamera = () => {
        setIsUsingCamera(true);
        setCameraError(null);
    };

    // Modified stopCamera function
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsUsingCamera(false);
        setIsCameraReady(false);
        videoRef.current = null;
    };

    // Modified capturePhoto function
    const capturePhoto = () => {
        if (videoRef.current && isCameraReady) {
            const canvas = document.createElement('canvas');
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            // Draw the video frame to the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                setSelectedFile(blob);
                setPreview(canvas.toDataURL('image/jpeg'));
                toast.success('Photo captured successfully!');
                stopCamera();
            }, 'image/jpeg', 0.8);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size should be less than 5MB');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                toast.success('File selected successfully!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductDetails(prev => {
            const newState = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // If changing donationOrSale, update price accordingly
            if (name === 'donationOrSale') {
                newState.price = value === 'donate' ? '0' : newState.price;
            }

            return newState;
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select an image or take a photo');
            return;
        }

        // Validate required fields
        const requiredFields = ['itemName', 'category', 'condition', 'weight', 'quantity', 'location'];
        const missingFields = requiredFields.filter(field => !productDetails[field]);
        if (missingFields.length > 0) {
            toast.error(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        // Validate numeric fields
        if (isNaN(productDetails.weight) || productDetails.weight <= 0) {
            toast.error('Weight must be a positive number');
            return;
        }

        if (isNaN(productDetails.quantity) || productDetails.quantity <= 0) {
            toast.error('Quantity must be a positive number');
            return;
        }

        const loadingToast = toast.loading('Uploading product...');

        try {
            const formData = new FormData();

            // Append the file with correct field name
            formData.append('file', selectedFile, 'product-image.jpg');

            // Get user's wallet address
            const userInfo = localStorage.getItem('userInfo');
            const walletAddress = userInfo ? JSON.parse(userInfo).walletAddress : null;

            if (!walletAddress) {
                toast.error('Please connect your wallet first');
                return;
            }

            // Format the data
            const formattedDetails = {
                user: walletAddress,
                itemName: productDetails.itemName,
                category: productDetails.category,
                condition: productDetails.condition,
                weight: Number(productDetails.weight),
                quantity: Number(productDetails.quantity),
                location: productDetails.location,
                donationOrSale: productDetails.donationOrSale === 'sell' ? 'sell' : 'donate', // Fix enum value
                price: productDetails.donationOrSale === 'donate' ? 0 : Number(productDetails.price || 0),
                biddingEnabled: productDetails.biddingEnabled ? 'true' : 'false', // Convert to string
                biddingEndTime: productDetails.biddingEnabled ? productDetails.biddingEndTime : undefined,
                status: 'pending',
                biddingStatus: 'active'
            };

            // Append all fields as text
            Object.entries(formattedDetails).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // Convert all values to strings
                    formData.append(key, String(value));
                }
            });

            // Log the actual data being sent
         

            const response = await fetch('http://localhost:3000/api/ewaste/create', {
                method: 'POST',
                headers: {
                    'Authorization': walletAddress,
                },
                body: formData
            });

            const responseText = await response.text();
          

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response:', e);
                throw new Error(responseText || 'Invalid server response');
            }

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Upload failed');
            }

          
            toast.success('Product uploaded successfully!');

            // Reset form with correct enum value
            setSelectedFile(null);
            setPreview(null);
            setProductDetails({
                itemName: '',
                category: '',
                condition: '',
                weight: 0,
                quantity: 1,
                location: '',
                donationOrSale: 'donate',
                price: 0,
                biddingEnabled: false,
                biddingEndTime: "2025-02-25T23:59:59",
                status: 'pending',
                biddingStatus: 'active'
            });

        } catch (error) {
            console.error('Upload failed:', error);
            toast.error(error.message || 'Failed to upload product. Please try again.');
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8 font-rubik">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
            >
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Add E-Waste Product</h2>

                    <div className="space-y-6">
                        {/* Image Upload/Camera Section */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {isUsingCamera ? (
                                <div className="space-y-4">
                                    {cameraError ? (
                                        <div className="text-red-500 p-4">{cameraError}</div>
                                    ) : (
                                        <div className="relative">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-64 object-cover rounded-lg bg-black"
                                            />
                                            {isCameraReady && (
                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                                                    <button
                                                        onClick={capturePhoto}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                    >
                                                        Capture Photo
                                                    </button>
                                                    <button
                                                        onClick={stopCamera}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {preview ? (
                                        <div className="space-y-4">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="max-w-full h-64 object-contain mx-auto"
                                            />
                                            <button
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreview(null);
                                                }}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <div className="flex justify-center space-x-4">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                >
                                                    Choose File
                                                </label>
                                                <button
                                                    onClick={startCamera}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                >
                                                    Use Camera
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Product Details Form */}
                        <div className="space-y-6">
                            {/* Item Name */}
                            <div className="space-y-2">
                                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                                    Item Name *
                                </label>
                                <input
                                    id="itemName"
                                    type="text"
                                    name="itemName"
                                    value={productDetails.itemName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Old Laptop, Used Mobile Phone"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={productDetails.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Computers">Computers</option>
                                    <option value="Mobile Devices">Mobile Devices</option>
                                    <option value="Appliances">Appliances</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Condition */}
                            <div className="space-y-2">
                                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                                    Item Condition *
                                </label>
                                <select
                                    id="condition"
                                    name="condition"
                                    value={productDetails.condition}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Select condition</option>
                                    <option value="New">New</option>
                                    <option value="Like New">Like New</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>

                            {/* Weight and Quantity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                        Weight (kg) *
                                    </label>
                                    <input
                                        id="weight"
                                        type="number"
                                        name="weight"
                                        value={productDetails.weight}
                                        onChange={handleInputChange}
                                        placeholder="0.0"
                                        min="0"
                                        step="0.1"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                        Quantity *
                                    </label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        name="quantity"
                                        value={productDetails.quantity}
                                        onChange={handleInputChange}
                                        placeholder="1"
                                        min="1"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Location *
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={productDetails.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Mumbai, Maharashtra"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Donation or Sale */}
                            <div className="space-y-2">
                                <label htmlFor="donationOrSale" className="block text-sm font-medium text-gray-700">
                                    Listing Type *
                                </label>
                                <select
                                    id="donationOrSale"
                                    name="donationOrSale"
                                    value={productDetails.donationOrSale}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="donate">Donate</option>
                                    <option value="sell">Sell</option>
                                </select>
                            </div>

                            {/* Price (only shown if selling) */}
                            {productDetails.donationOrSale === 'sell' && (
                                <div className="space-y-2">
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                        Price (₹) *
                                    </label>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={productDetails.price}
                                        onChange={handleInputChange}
                                        placeholder="Enter price in INR"
                                        min="0"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required={productDetails.donationOrSale === 'sell'}
                                    />
                                </div>
                            )}

                            {/* Bidding Option */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="biddingEnabled"
                                        type="checkbox"
                                        name="biddingEnabled"
                                        checked={productDetails.biddingEnabled}
                                        onChange={handleInputChange}
                                        className="rounded text-green-500 focus:ring-green-500"
                                    />
                                    <label htmlFor="biddingEnabled" className="text-sm text-gray-700">
                                        Enable Bidding
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || !productDetails.itemName}
                            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Upload Product
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Scan;
