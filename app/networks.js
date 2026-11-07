/* Extra EVM networks, read-only: native balance, nonce and optional Blockscout discovery.
   The same Ethereum address (same seed, same path) exists on every network listed here.
   Transactions stay Ethereum mainnet only. */
(function (root) {
  const freeze = (n) => Object.freeze(n);
  const MAINNET = freeze({ id: 'ethereum', name: 'Ethereum', chainId: 1, symbol: 'ETH', rpc: 'https://ethereum-rpc.publicnode.com', blockscout: 'https://eth.blockscout.com', price: 'coingecko:ethereum' });
  const NETWORKS = Object.freeze([
    freeze({ id: 'arbitrum', name: 'Arbitrum One', chainId: 42161, symbol: 'ETH', rpc: 'https://arb1.arbitrum.io/rpc', blockscout: 'https://arbitrum.blockscout.com', price: 'coingecko:ethereum' }),
    freeze({ id: 'base', name: 'Base', chainId: 8453, symbol: 'ETH', rpc: 'https://mainnet.base.org', blockscout: 'https://base.blockscout.com', price: 'coingecko:ethereum' }),
    freeze({ id: 'optimism', name: 'OP Mainnet', chainId: 10, symbol: 'ETH', rpc: 'https://mainnet.optimism.io', blockscout: 'https://optimism.blockscout.com', price: 'coingecko:ethereum' }),
    freeze({ id: 'polygon', name: 'Polygon PoS', chainId: 137, symbol: 'POL', rpc: 'https://polygon.publicnode.com', blockscout: 'https://polygon.blockscout.com', price: 'coingecko:polygon-ecosystem-token' }),
    freeze({ id: 'bnb', name: 'BNB Smart Chain', chainId: 56, symbol: 'BNB', rpc: 'https://bsc.publicnode.com', blockscout: null, price: 'coingecko:binancecoin' }),
    freeze({ id: 'gnosis', name: 'Gnosis', chainId: 100, symbol: 'xDAI', rpc: 'https://rpc.gnosischain.com', blockscout: 'https://gnosis.blockscout.com', price: 'coingecko:xdai' }),
  ]);
  const byId = (id) => NETWORKS.find((n) => n.id === id);
  const api = { MAINNET, NETWORKS, byId };
  if (typeof module !== 'undefined') module.exports = api;
  else root.EvmNetworks = api;
})(globalThis);
