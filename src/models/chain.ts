

export const enum Chain  {
  Ethereum="Ethereum",
  Polygon="Polygon",
  Arbitrum="Arbitrum",
  // Avalance="Avalance"
}

export const enum Network  {
  EthereumMainnet="Ethereum Mainnet",
  EthereumGoerli="Ethereum Goerli",

  PolygonMainnet="Polygon Mainnet",
  PolygonMumbai="Polygon Mumbai",

  ArbitrumMainnet="Arbitrum Mainnet",
  ArbitrumGoerli="Arbitrum Goerli",
  // Avalance="Avalance"
}


export const chainTypes = [
  {
    id: 1,
    name: Chain.Ethereum,
    value: Chain.Ethereum,
  },
  {
    id: 2,
    name: Chain.Polygon,
    value: Chain.Polygon,
  },
  {
    id: 3,
    name: Chain.Arbitrum,
    value: Chain.Arbitrum,
  },
]