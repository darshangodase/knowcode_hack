async function getEthereumMarketValue() {
    const apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch Ethereum market value");
      }
  
      const data = await response.json();
      const ethPrice = data.ethereum.usd;
  
      return ethPrice; // Returns the price of Ethereum in USD
    } catch (error) {
      console.error("Error fetching Ethereum market value:", error);
      return null; // Returns null in case of an error
    }
  }