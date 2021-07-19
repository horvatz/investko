const getAllCrypto = async () => {
  const res = await fetch("https://api.coincap.io/v2/assets?limit=10");
  const prices = await res.json();
  console.log(prices.data);
  return prices.data;
};

const getCryptoById = async (id) => {
  const res = await fetch(`https://api.coincap.io/v2/assets/${id}`);
  const cryptoInfo = await res.json();
  return cryptoInfo.data;
};

export { getAllCrypto, getCryptoById };
