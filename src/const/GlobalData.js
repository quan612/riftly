export const ETH_NETWORKS = [
  {
    id: 1,
    name: 'Ethereum Mainnet',
    network: "mainnet",
    explorer: 'https://etherscan.io',
    // rpcProvider: 'https://eth-mainnet.alchemyapi.io/v2/-XTnV8lVkZQkba_NR6pFIgSeaGI4ccmb',
    CONTRACT_ADDRESSES: {
      REDEEM: '0xa5B83b3d3Bc15cac84cb48d6953DCcA83cCBB912',
    },
  },
  {
    id: 5,
    name: 'Ethereum Goerli',
    network: "goerli",
    explorer: 'https://goerli.etherscan.io',
    CONTRACT_ADDRESSES: {
      REDEEM: '0xa5B83b3d3Bc15cac84cb48d6953DCcA83cCBB912',
    },
  },
]

export const CURRENT_NETWORK = ETH_NETWORKS[process.env.NEXT_PUBLIC_TESTNET_MODE === "false" ? 0 : 1] // true = [0], false [1]
