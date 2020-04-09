const TIME_START = 'April 4 2020 18:00:00 GMT +3';

const AUCTION = {
  ADDR_SMART_CONTRACT: '0xc13926630c1afa229a0c4df8df2acbff03c4681e',
  ADDR_VESTING: '0x7c2a661dac04aae4381b810c3228ccab1d11deec',
  TOKEN_NAME: 'GOL',
  TOPICS_SEND:
    '0x3b599f6217e39be59216b60e543ce0d4c7d534fe64dd9d962334924e7819894e',
  TOPICS_CLAIM:
    '0x51223fdc0a25891366fb358b4af9fe3c381b1566e287c61a29d01c8a173fe4f4',
  TOPICS_VESTING:
    '0x552f182d4b9ab267a8580e2aa80cf374b7aabc8f528b7e9eea58919eea48e87d',
  HTTP_PROVIDER_URL: 'https://rinkeby.infura.io/metamask',
  ROUND_DURATION: 1000 * 60 * 60 * 23 + 1,
};

const NETWORKSIDS = {
  main: 1,
  rinkeby: 4,
  kovan: 42,
  TestNet: 5777,
};

const TAKEOFF = {
  ATOMsALL: 600000,
  CYBWON_A: 0.000740464,
  CYBWON_B: -666.418,
  CYBWON_C: 2.3328 * 10 ** 8,
  CYBWON_D: 0.000343014,
  GETSHARES_A: -1.856 * 10 ** -3,
  GETSHARES_B: 2.355 * 10 ** -5,
  GETSHARES_C: 6.66 * 10 ** -11,
  GETSHARES_D: 7.332 * 10 ** -17,
  DISCOUNT_TG: -0.00005,
  DISCOUNT_TILT_ANGLE: 30,
};

const COSMOS = {
  ADDR_FUNDING: 'cosmos1809vlaew5u5p24tvmse9kvgytwwr3ej7vd7kgq',
  CHAIN_ID: 'cosmoshub-3',
  DEFAULT_GAS: 200000,
  DEFAULT_GAS_PRICE: 0.01,
  GAIA_NODE_URL_LSD: 'https://deimos.cybernode.ai/gaia_lcd',
  GAIA_WEBSOCKET_URL: 'wss://deimos.cybernode.ai/gaia_websocket',
  DENOM_COSMOS: 'uatom',
  DIVISOR_ATOM: 10 ** 6,
  BECH32_PREFIX_ACC_ADDR_COSMOS: 'cosmos',
};

const CYBER = {
  DIVISOR_CYBER_G: 10 ** 9,
  DENOM_CYBER: 'eul',
  DENOM_CYBER_G: `GEUL`,
  CYBER_WEBSOCKET_URL: 'wss://titan.cybernode.ai/websocket',
  CYBER_NODE_URL: 'https://titan.cybernode.ai',
  CYBER_NODE_URL_API: 'https://titan.cybernode.ai/api',
  CYBER_NODE_URL_LCD: 'https://titan.cybernode.ai/lcd',
  CYBER_INDEX_HTTPS: 'https://titan.cybernode.ai/graphql/v1/graphql',
  CYBER_INDEX_WEBSOCKET: 'wss://titan.cybernode.ai/graphql/v1/graphql',
  BECH32_PREFIX_ACC_ADDR_CYBER: 'cyber',
  BECH32_PREFIX_ACC_ADDR_CYBERVALOPER: 'cybervaloper',
};

const LEDGER = {
  STAGE_INIT: 0,
  STAGE_SELECTION: 1,
  STAGE_LEDGER_INIT: 2,
  STAGE_READY: 3,
  STAGE_WAIT: 4,
  STAGE_GENERATED: 5,
  STAGE_SUBMITTED: 6,
  STAGE_CONFIRMING: 7,
  STAGE_CONFIRMED: 8,
  STAGE_ERROR: 15,
  LEDGER_VERSION_REQ: [1, 1, 1],
  HDPATH: [44, 118, 0, 0, 0],
  LEDGER_OK: 36864,
  LEDGER_NOAPP: 28160,
  MEMO: 'cyber.page, using Ledger',
};

const GENESIS_SUPPLY = 1000000000000000;
const TOTAL_GOL_GENESIS_SUPPLY = 15000000000000;

const DISTRIBUTION = {
  takeoff: 60000000000000,
  relevance: 15000000000000,
  load: 6000000000000,
  delegation: 5000000000000,
  'full validator set': 5000000000000,
  'euler 4 rewards': 5000000000000,
  lifetime: 2000000000000,
  'community pool': 2000000000000,
};

const PATTERN = /^0x[a-fA-F0-9]{40}$|^cybervaloper[a-zA-Z0-9]{39}$|^cyber[a-zA-Z0-9]{39}$|^cosmos[a-zA-Z0-9]{39}$/g;
const PATTERN_CYBER = /^cyber[a-zA-Z0-9]{39}$/g;
const PATTERN_COSMOS = /^cosmos[a-zA-Z0-9]{39}$/g;
const PATTERN_ETH = /^0x[a-fA-F0-9]{40}$/g;
const PATTERN_CYBER_VALOPER = /^cybervaloper[a-zA-Z0-9]{39}$/g;
const PATTERN_TX = /[0-9a-fA-F]{64}$/g;
const PATTERN_IPFS_HASH = /^Qm[a-zA-Z0-9]{44}$/g;
const PATTERN_BLOCK = /^[0-9]+$/g;

export {
  TAKEOFF,
  COSMOS,
  CYBER,
  LEDGER,
  AUCTION,
  NETWORKSIDS,
  DISTRIBUTION,
  GENESIS_SUPPLY,
  TOTAL_GOL_GENESIS_SUPPLY,
  PATTERN,
  PATTERN_CYBER,
  PATTERN_CYBER_VALOPER,
  PATTERN_TX,
  PATTERN_IPFS_HASH,
  PATTERN_COSMOS,
  PATTERN_ETH,
  PATTERN_BLOCK,
  TIME_START,
};
