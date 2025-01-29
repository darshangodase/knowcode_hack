import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { toast } from 'react-toastify';

const containerVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const Store = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [ethereumPrice, setEthereumPrice] = useState(null);
  const [userCoins, setUserCoins] = useState(0); // Default to 0, will be updated from localStorage
  const [exchangeAmount, setExchangeAmount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  const COIN_TO_BTC_RATE = 0.0000001; // Coin to BTC conversion rate
  const COIN_TO_ETH_RATE = 0.0001; // Coin to ETH conversion rate

  // Load user coins from local storage on initial mount
  useEffect(() => {
    const savedCoins = localStorage.getItem('userCoins');
    if (savedCoins) {
      setUserCoins(parseInt(savedCoins));
    }
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [btcResponse, ethResponse] = await Promise.all([
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        ]);

        const btcData = await btcResponse.json();
        const ethData = await ethResponse.json();

        setBitcoinPrice(btcData.bitcoin.usd);
        setEthereumPrice(ethData.ethereum.usd);
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const calculateCrypto = (coins) => {
    if (!coins) return { btc: 0, eth: 0, btcValue: 0, ethValue: 0 };

    const btc = coins * COIN_TO_BTC_RATE;
    const eth = coins * COIN_TO_ETH_RATE;
    const btcValue = bitcoinPrice ? btc * bitcoinPrice : 0;
    const ethValue = ethereumPrice ? eth * ethereumPrice : 0;

    return { btc, eth, btcValue, ethValue };
  };

  const handleExchange = () => {
    if (!exchangeAmount || exchangeAmount <= 0 || exchangeAmount > userCoins) {
      toast.error('Invalid exchange amount');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmExchange = () => {
    const updatedCoins = userCoins - Number(exchangeAmount);
    setUserCoins(updatedCoins);
    localStorage.setItem('userCoins', updatedCoins.toString());

    const { btc, eth } = calculateCrypto(exchangeAmount);
    toast.success(`Successfully exchanged ${exchangeAmount} coins for ${selectedCrypto === 'BTC' ? btc.toFixed(8) + ' BTC' : eth.toFixed(8) + ' ETH'}`);

    setExchangeAmount(0);
    setShowConfirmation(false);
  };

  const cryptoRates = calculateCrypto(exchangeAmount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-24 px-4 sm:px-6 lg:px-8 font-rubik">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coin <span className="text-green-600">Exchange</span>
          </h1>
          <p className="text-lg text-gray-600">Convert your earned coins to Bitcoin or Ethereum</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Exchange Rate Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Rates</h2>
            {bitcoinPrice === null || ethereumPrice === null ? (
              <div className="flex justify-center items-center">
                <div className="loader">Loading...</div> {/* You can replace this with a spinner or skeleton loader */}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaBitcoin className="text-orange-500 text-2xl" />
                    <span className="text-gray-600">Bitcoin (BTC)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${bitcoinPrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{COIN_TO_BTC_RATE} BTC per coin</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaEthereum className="text-blue-500 text-2xl" />
                    <span className="text-gray-600">Ethereum (ETH)</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${ethereumPrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{COIN_TO_ETH_RATE} ETH per coin</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <span className="text-gray-600">Your Coins</span>
                  <span className="font-bold text-green-600">{userCoins.toLocaleString()}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Exchange Form */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchange Coins</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Cryptocurrency
                </label>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setSelectedCrypto('BTC')}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 
                      ${selectedCrypto === 'BTC' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <FaBitcoin /> Bitcoin
                  </button>
                  <button
                    onClick={() => setSelectedCrypto('ETH')}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                      ${selectedCrypto === 'ETH' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <FaEthereum /> Ethereum
                  </button>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount of Coins to Exchange
                </label>
                <input
                  type="number"
                  value={exchangeAmount}
                  onChange={(e) => setExchangeAmount(e.target.value ? parseInt(e.target.value) : 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount of coins"
                  min="1"
                  max={userCoins}
                />
              </div>

              {exchangeAmount > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">You'll Receive</span>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {selectedCrypto === 'BTC' ? (
                          <span className="flex items-center gap-2">
                            <FaBitcoin className="text-orange-500" />
                            {cryptoRates.btc.toFixed(8)} BTC
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <FaEthereum className="text-blue-500" />
                            {cryptoRates.eth.toFixed(8)} ETH
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ≈ ${selectedCrypto === 'BTC' ?
                          cryptoRates.btcValue.toFixed(2) :
                          cryptoRates.ethValue.toFixed(2)
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleExchange}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-green-700"
              >
                Exchange
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-900">Confirm Exchange</h3>
            <div className="my-4">
              <p>You are about to exchange {exchangeAmount} coins for {selectedCrypto === 'BTC' ? cryptoRates.btc.toFixed(8) + ' BTC' : cryptoRates.eth.toFixed(8) + ' ETH'}</p>
              <div className="mt-4">
                <button onClick={confirmExchange} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 mr-4">
                  Confirm
                </button>
                <button onClick={() => setShowConfirmation(false)} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
