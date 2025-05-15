export type CurrencyCode =
  "1INCH" |
  "AAVE" |
  "ADA" |
  "AKT" |
  "ALGO" |
  "AMP" |
  "ANKR" |
  "AOA" |
  "APE" |
  "APT" |
  "AR" |
  "ARB" |
  "ARK" |
  "ARS" |
  "ASTR" |
  "ATOM" |
  "AUD" |
  "AUDIO" |
  "AVAX" |
  "AXL" |
  "AXS" |
  "BABYDOGE" |
  "BAL" |
  "BAND" |
  "BAT" |
  "BCH" |
  "BDX" |
  "BEAM" |
  "BGB" |
  "BICO" |
  "BLUR" |
  "BNB" |
  "BND" |
  "BONE" |
  "BONK" |
  "BORA" |
  "BORG" |
  "BRL" |
  "BSV" |
  "BTC" |
  "BTT" |
  "BZD" |
  "CAD" |
  "CAKE" |
  "CELO" |
  "CFG" |
  "CFX" |
  "CHEEL" |
  "CHF" |
  "CHZ" |
  "CLP" |
  "COMP" |
  "COP" |
  "CRC" |
  "CRO" |
  "CRV" |
  "CSPR" |
  "CVX" |
  "CZK" |
  "DAI" |
  "DASH" |
  "DCR" |
  "DEXE" |
  "DJF" |
  "DKK" |
  "DOGE" |
  "DOP" |
  "DOT" |
  "EGLD" |
  "ELF" |
  "ENJ" |
  "ENS" |
  "EOS" |
  "ETC" |
  "ETH" |
  "ETHW" |
  "EUR" |
  "EURS" |
  "FDUSD" |
  "FET" |
  "FIL" |
  "FJD" |
  "FKP" |
  "FLOKI" |
  "FLOW" |
  "FLR" |
  "FLUX" |
  "FNSA" |
  "FRAX" |
  "FRXETH" |
  "FTM" |
  "FTN" |
  "FXS" |
  "GALA" |
  "GAS" |
  "GAT" |
  "GBP" |
  "GEL" |
  "GLM" |
  "GLMR" |
  "GMT" |
  "GMX" |
  "GNO" |
  "GRT" |
  "GT" |
  "GTQ" |
  "HBAR" |
  "HKD" |
  "HNL" |
  "HNT" |
  "HOT" |
  "HUF" |
  "ICP" |
  "ICX" |
  "IDR" |
  "ILS" |
  "ILV" |
  "IMX" |
  "INJ" |
  "INR" |
  "IOST" |
  "IOTA" |
  "IOTX" |
  "ISK" |
  "JASMY" |
  "JPY" |
  "JST" |
  "KAS" |
  "KAVA" |
  "KCS" |
  "KDA" |
  "KES" |
  "KGS" |
  "KMF" |
  "KRW" |
  "KSM" |
  "KZT" |
  "LDO" |
  "LEO" |
  "LINK" |
  "LPT" |
  "LRC" |
  "LSK" |
  "LTC" |
  "LUNA" |
  "LUNC" |
  "MANA" |
  "MASK" |
  "MDL" |
  "MEME" |
  "MGA" |
  "MKR" |
  "MNT" |
  "MRU" |
  "MWK" |
  "MX" |
  "MXN" |
  "MYR" |
  "NEAR" |
  "NEO" |
  "NEXO" |
  "NFT" |
  "NOK" |
  "NZD" |
  "OHM" |
  "OKB" |
  "OMR" |
  "ONE" |
  "ONT" |
  "OP" |
  "ORBS" |
  "ORDI" |
  "OSMO" |
  "PAXG" |
  "PEN" |
  "PEPE" |
  "PGK" |
  "PHP" |
  "PLN" |
  "POLYX" |
  "PRIME" |
  "PYR" |
  "PYTH" |
  "PYUSD" |
  "QNT" |
  "QTUM" |
  "RBN" |
  "RETH" |
  "RLB" |
  "RNDR" |
  "RON" |
  "RONIN" |
  "ROSE" |
  "RPL" |
  "RUNE" |
  "RVN" |
  "RWF" |
  "SAND" |
  "SAVAX" |
  "SBD" |
  "SC" |
  "SCR" |
  "SEI" |
  "SEK" |
  "SFP" |
  "SGD" |
  "SHIB" |
  "SKL" |
  "SNT" |
  "SNX" |
  "SOL" |
  "SRD" |
  "STRAX" |
  "STX" |
  "SUI" |
  "SUSHI" |
  "SXP" |
  "SZL" |
  "TAO" |
  "TEL" |
  "TFUEL" |
  "THETA" |
  "TIA" |
  "TJS" |
  "TMT" |
  "TON" |
  "TOP" |
  "TRAC" |
  "TRB" |
  "TRX" |
  "TRY" |
  "TUSD" |
  "TWT" |
  "ULTIMA" |
  "UNI" |
  "USD" |
  "USDC" |
  "USDD" |
  "USDP" |
  "USDT" |
  "UYU" |
  "VET" |
  "VND" |
  "VVS" |
  "WAVES" |
  "WAXP" |
  "WEMIX" |
  "WLD" |
  "WOO" |
  "XAUT" |
  "XCD" |
  "XCH" |
  "XDC" |
  "XEC" |
  "XEM" |
  "XLM" |
  "XMR" |
  "XNO" |
  "XRD" |
  "XRP" |
  "XTZ" |
  "YFI" |
  "ZAR" |
  "ZEC" |
  "ZEN" |
  "ZIL";


export const currencies: {
  [currencyCode: string]: {
    code: CurrencyCode;
    name: string;
    type: "crypto" | "fiat";
    symbol: string;
    region: string;
  };
} = {
  "KRW": {
    code: "KRW",
    name: "South Korean Won",
    type: "fiat",
    symbol: "₩",
    region: "South Korea",
  },
  "DOP": {
    code: "DOP",
    name: "Dominican Peso",
    type: "fiat",
    symbol: "RD$",
    region: "Dominican Republic",
  },
  "GBP": {
    code: "GBP",
    name: "British pound",
    type: "fiat",
    symbol: "£",
    region: "United Kingdom",
  },
  "IDR": {
    code: "IDR",
    name: "Indonesian Rupiah",
    type: "fiat",
    symbol: "Rp",
    region: "Indonesia",
  },
  "UYU": {
    code: "UYU",
    name: "Peso Uruguayo",
    type: "fiat",
    symbol: "$U",
    region: "Uruguay",
  },
  "VND": {
    code: "VND",
    name: "Dong",
    type: "fiat",
    symbol: "₫",
    region: "Vietnam",
  },
  "TMT": {
    code: "TMT",
    name: "Turkmenistan New Manat",
    type: "fiat",
    symbol: "T",
    region: "Turkmenistan",
  },
  "GTQ": {
    code: "GTQ",
    name: "Quetzal",
    type: "fiat",
    symbol: "Q",
    region: "Guatemala",
  },
  "OMR": {
    code: "OMR",
    name: "Rial Omani",
    type: "fiat",
    symbol: "ر.ع.",
    region: "Oman",
  },
  "KZT": {
    code: "KZT",
    name: "Tenge",
    type: "fiat",
    symbol: "₸",
    region: "Kazakhstan",
  },
  "JPY": {
    code: "JPY",
    name: "Japanese Yen",
    type: "fiat",
    symbol: "¥",
    region: "Japan",
  },
  "SCR": {
    code: "SCR",
    name: "Seychelles Rupee",
    type: "fiat",
    symbol: "SR",
    region: "Seychelles",
  },
  "USD": {
    code: "USD",
    name: "US Dollar",
    type: "fiat",
    symbol: "$",
    region: "United States of America",
  },
  "FKP": {
    code: "FKP",
    name: "Falkland Islands Pound",
    type: "fiat",
    symbol: "£",
    region: "Falkland Islands (the) [Malvinas]",
  },
  "SEK": {
    code: "SEK",
    name: "Swedish krona",
    type: "fiat",
    symbol: "kr",
    region: "Sweden",
  },
  "SBD": {
    code: "SBD",
    name: "Solomon Islands Dollar",
    type: "fiat",
    symbol: "SI$",
    region: "Solomon Islands",
  },
  "HUF": {
    code: "HUF",
    name: "Forint",
    type: "fiat",
    symbol: "Ft",
    region: "Hungary",
  },
  "NOK": {
    code: "NOK",
    name: "Norwegian Krone",
    type: "fiat",
    symbol: "kr",
    region: "Norway, Svalbard And Jan Mayen",
  },
  "MXN": {
    code: "MXN",
    name: "Mexican peso",
    type: "fiat",
    symbol: "$",
    region: "Mexico",
  },
  "TRY": {
    code: "TRY",
    name: "Turkish Lira",
    type: "fiat",
    symbol: "₺",
    region: "Turkey",
  },
  "INR": {
    code: "INR",
    name: "Indian rupee",
    type: "fiat",
    symbol: "₹",
    region: "Bhutan, India",
  },
  "RON": {
    code: "RON",
    name: "Romanian Leu",
    type: "fiat",
    symbol: "lei",
    region: "Romania",
  },
  "BZD": {
    code: "BZD",
    name: "Belize Dollar",
    type: "fiat",
    symbol: "BZ$",
    region: "Belize",
  },
  "EUR": {
    code: "EUR",
    name: "Euro",
    type: "fiat",
    symbol: "€",
    region: "Andorra, Austria, Belgium, Cyprus, Denmark, Estonia, Finland, France, French Guiana, Germany, Greece, Guadeloupe, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Martinique, Mayotte, Montenegro, Netherlands, Norway, Poland, Portugal, Réunion, Saint Barthélemy, Saint Martin, Saint Pierre And Miquelon, Slovakia, Slovenia, Spain, Sweden, Switzerland, Vatican City State (Holy See), Åland Islands",
  },
  "MRU": {
    code: "MRU",
    name: "Ouguiya",
    type: "fiat",
    symbol: "UM",
    region: "Mauritania",
  },
  "SHIB": {
    code: "SHIB",
    name: "Shiba Inu",
    type: "crypto",
    symbol: "SHIB",
    region: "web3",
  },
  "KES": {
    code: "KES",
    name: "Kenyan Shilling",
    type: "fiat",
    symbol: "KSh",
    region: "Kenya",
  },
  "CZK": {
    code: "CZK",
    name: "Czech Koruna",
    type: "fiat",
    symbol: "Kč",
    region: "Czech Republic",
  },
  "INJ": {
    code: "INJ",
    name: "Injective",
    type: "crypto",
    symbol: "INJ",
    region: "web3",
  },
  "AOA": {
    code: "AOA",
    name: "Kwanza",
    type: "fiat",
    symbol: "Kz",
    region: "Angola",
  },
  "CHF": {
    code: "CHF",
    name: "Swiss franc",
    type: "fiat",
    symbol: "CHF",
    region: "Switzerland",
  },
  "LDO": {
    code: "LDO",
    name: "Lido DAO",
    type: "crypto",
    symbol: "LDO",
    region: "web3",
  },
  "DAI": {
    code: "DAI",
    name: "Dai",
    type: "crypto",
    symbol: "DAI",
    region: "web3",
  },
  "NZD": {
    code: "NZD",
    name: "New Zealand dollar",
    type: "fiat",
    symbol: "NZ$",
    region: "Cook Islands, New Zealand, Niue, Pitcairn, Tokelau",
  },
  "OKB": {
    code: "OKB",
    name: "OKB",
    type: "crypto",
    symbol: "OKB",
    region: "web3",
  },
  "NEAR": {
    code: "NEAR",
    name: "NEAR Protocol",
    type: "crypto",
    symbol: "NEAR",
    region: "web3",
  },
  "TRX": {
    code: "TRX",
    name: "TRON",
    type: "crypto",
    symbol: "TRX",
    region: "web3",
  },
  "BNB": {
    code: "BNB",
    name: "BNB",
    type: "crypto",
    symbol: "BNB",
    region: "web3",
  },
  "HBAR": {
    code: "HBAR",
    name: "Hedera",
    type: "crypto",
    symbol: "HBAR",
    region: "web3",
  },
  "DOGE": {
    code: "DOGE",
    name: "Dogecoin",
    type: "crypto",
    symbol: "DOGE",
    region: "web3",
  },
  "QNT": {
    code: "QNT",
    name: "Quant",
    type: "crypto",
    symbol: "QNT",
    region: "web3",
  },
  "LEO": {
    code: "LEO",
    name: "LEO Token",
    type: "crypto",
    symbol: "LEO",
    region: "web3",
  },
  "UNI": {
    code: "UNI",
    name: "Uniswap",
    type: "crypto",
    symbol: "UNI",
    region: "web3",
  },
  "XMR": {
    code: "XMR",
    name: "Monero",
    type: "crypto",
    symbol: "XMR",
    region: "web3",
  },
  "AVAX": {
    code: "AVAX",
    name: "Avalanche",
    type: "crypto",
    symbol: "AVAX",
    region: "web3",
  },
  "IMX": {
    code: "IMX",
    name: "Immutable",
    type: "crypto",
    symbol: "IMX",
    region: "web3",
  },
  "USDC": {
    code: "USDC",
    name: "USDC",
    type: "crypto",
    symbol: "USDC",
    region: "web3",
  },
  "XLM": {
    code: "XLM",
    name: "Stellar",
    type: "crypto",
    symbol: "XLM",
    region: "web3",
  },
  "SOL": {
    code: "SOL",
    name: "Solana",
    type: "crypto",
    symbol: "SOL",
    region: "web3",
  },
  "LINK": {
    code: "LINK",
    name: "Chainlink",
    type: "crypto",
    symbol: "LINK",
    region: "web3",
  },
  "ICP": {
    code: "ICP",
    name: "Internet Computer",
    type: "crypto",
    symbol: "ICP",
    region: "web3",
  },
  "GRT": {
    code: "GRT",
    name: "The Graph",
    type: "crypto",
    symbol: "GRT",
    region: "web3",
  },
  "MKR": {
    code: "MKR",
    name: "Maker",
    type: "crypto",
    symbol: "MKR",
    region: "web3",
  },
  "XNO": {
    code: "XNO",
    name: "Nano",
    type: "crypto",
    symbol: "Ӿ",
    region: "web3",
  },
  "ATOM": {
    code: "ATOM",
    name: "Cosmos Hub",
    type: "crypto",
    symbol: "ATOM",
    region: "web3",
  },
  "CRO": {
    code: "CRO",
    name: "Cronos",
    type: "crypto",
    symbol: "CRO",
    region: "web3",
  },
  "TUSD": {
    code: "TUSD",
    name: "TrueUSD",
    type: "crypto",
    symbol: "TUSD",
    region: "web3",
  },
  "VET": {
    code: "VET",
    name: "VeChain",
    type: "crypto",
    symbol: "VET",
    region: "web3",
  },
  "LTC": {
    code: "LTC",
    name: "Litecoin",
    type: "crypto",
    symbol: "LTC",
    region: "web3",
  },
  "ADA": {
    code: "ADA",
    name: "Cardano",
    type: "crypto",
    symbol: "ADA",
    region: "web3",
  },
  "BCH": {
    code: "BCH",
    name: "Bitcoin Cash",
    type: "crypto",
    symbol: "BCH",
    region: "web3",
  },
  "TON": {
    code: "TON",
    name: "Toncoin",
    type: "crypto",
    symbol: "TON",
    region: "web3",
  },
  "BTC": {
    code: "BTC",
    name: "Bitcoin",
    type: "crypto",
    symbol: "BTC",
    region: "web3",
  },
  "USDT": {
    code: "USDT",
    name: "Tether",
    type: "crypto",
    symbol: "USDT",
    region: "web3",
  },
  "MNT": {
    code: "MNT",
    name: "Mantle",
    type: "crypto",
    symbol: "MNT",
    region: "web3",
  },
  "ETH": {
    code: "ETH",
    name: "Ethereum",
    type: "crypto",
    symbol: "ETH",
    region: "web3",
  },
  "ETC": {
    code: "ETC",
    name: "Ethereum Classic",
    type: "crypto",
    symbol: "ETC",
    region: "web3",
  },
  "RUNE": {
    code: "RUNE",
    name: "THORChain",
    type: "crypto",
    symbol: "RUNE",
    region: "web3",
  },
  "FIL": {
    code: "FIL",
    name: "Filecoin",
    type: "crypto",
    symbol: "FIL",
    region: "web3",
  },
  "DOT": {
    code: "DOT",
    name: "Polkadot",
    type: "crypto",
    symbol: "DOT",
    region: "web3",
  },
  "MYR": {
    code: "MYR",
    name: "Malaysian Ringgit",
    type: "fiat",
    symbol: "RM",
    region: "Malaysia",
  },
  "APT": {
    code: "APT",
    name: "Aptos",
    type: "crypto",
    symbol: "APT",
    region: "web3",
  },
  "PGK": {
    code: "PGK",
    name: "Kina",
    type: "fiat",
    symbol: "K",
    region: "Papua New Guinea",
  },
  "XRP": {
    code: "XRP",
    name: "XRP",
    type: "crypto",
    symbol: "XRP",
    region: "web3",
  },
  "OP": {
    code: "OP",
    name: "Optimism",
    type: "crypto",
    symbol: "OP",
    region: "web3",
  },
  "HNL": {
    code: "HNL",
    name: "Lempira",
    type: "fiat",
    symbol: "L",
    region: "Honduras",
  },
  "CRC": {
    code: "CRC",
    name: "Costa Rican Colon",
    type: "fiat",
    symbol: "₡",
    region: "Costa Rica",
  },
  "TOP": {
    code: "TOP",
    name: "Pa’anga",
    type: "fiat",
    symbol: "T$",
    region: "Tonga",
  },
  "DKK": {
    code: "DKK",
    name: "Danish Krone",
    type: "fiat",
    symbol: "kr",
    region: "Denmark, Faroe Islands, Greenland",
  },
  "PHP": {
    code: "PHP",
    name: "Philippine Peso",
    type: "fiat",
    symbol: "₱",
    region: "Philippines",
  },
  "MDL": {
    code: "MDL",
    name: "Moldovan Leu",
    type: "fiat",
    symbol: "L",
    region: "Moldova, Republic of",
  },
  "MGA": {
    code: "MGA",
    name: "Malagasy Ariary",
    type: "fiat",
    symbol: "Ar",
    region: "Madagascar",
  },
  "KMF": {
    code: "KMF",
    name: "Comoro Franc",
    type: "fiat",
    symbol: "CF",
    region: "Comoros (the)",
  },
  "KAS": {
    code: "KAS",
    name: "Kaspa",
    type: "crypto",
    symbol: "KAS",
    region: "web3",
  },
  "TAO": {
    code: "TAO",
    name: "Bittensor",
    type: "crypto",
    symbol: "TAO",
    region: "web3",
  },
  "RNDR": {
    code: "RNDR",
    name: "Render",
    type: "crypto",
    symbol: "RNDR",
    region: "web3",
  },
  "RETH": {
    code: "RETH",
    name: "Rocket Pool ETH",
    type: "crypto",
    symbol: "RETH",
    region: "web3",
  },
  "RLB": {
    code: "RLB",
    name: "Rollbit Coin",
    type: "crypto",
    symbol: "RLB",
    region: "web3",
  },
  "ANKR": {
    code: "ANKR",
    name: "Ankr Network",
    type: "crypto",
    symbol: "ANKR",
    region: "web3",
  },
  "SUI": {
    code: "SUI",
    name: "Sui",
    type: "crypto",
    symbol: "SUI",
    region: "web3",
  },
  "FTM": {
    code: "FTM",
    name: "Fantom",
    type: "crypto",
    symbol: "FTM",
    region: "web3",
  },
  "XAUT": {
    code: "XAUT",
    name: "Tether Gold",
    type: "crypto",
    symbol: "XAUT",
    region: "web3",
  },
  "IOTA": {
    code: "IOTA",
    name: "IOTA",
    type: "crypto",
    symbol: "IOTA",
    region: "web3",
  },
  "PYTH": {
    code: "PYTH",
    name: "Pyth Network",
    type: "crypto",
    symbol: "PYTH",
    region: "web3",
  },
  "WOO": {
    code: "WOO",
    name: "WOO Network",
    type: "crypto",
    symbol: "WOO",
    region: "web3",
  },
  "MX": {
    code: "MX",
    name: "MX",
    type: "crypto",
    symbol: "MX",
    region: "web3",
  },
  "XEC": {
    code: "XEC",
    name: "eCash",
    type: "crypto",
    symbol: "XEC",
    region: "web3",
  },
  "CRV": {
    code: "CRV",
    name: "Curve DAO",
    type: "crypto",
    symbol: "CRV",
    region: "web3",
  },
  "FDUSD": {
    code: "FDUSD",
    name: "First Digital USD",
    type: "crypto",
    symbol: "FDUSD",
    region: "web3",
  },
  "CELO": {
    code: "CELO",
    name: "Celo",
    type: "crypto",
    symbol: "CELO",
    region: "web3",
  },
  "AR": {
    code: "AR",
    name: "Arweave",
    type: "crypto",
    symbol: "AR",
    region: "web3",
  },
  "GLM": {
    code: "GLM",
    name: "Golem",
    type: "crypto",
    symbol: "GLM",
    region: "web3",
  },
  "FRXETH": {
    code: "FRXETH",
    name: "Frax Ether",
    type: "crypto",
    symbol: "FRXETH",
    region: "web3",
  },
  "IOTX": {
    code: "IOTX",
    name: "IoTeX",
    type: "crypto",
    symbol: "IOTX",
    region: "web3",
  },
  "FXS": {
    code: "FXS",
    name: "Frax Share",
    type: "crypto",
    symbol: "FXS",
    region: "web3",
  },
  "MASK": {
    code: "MASK",
    name: "Mask Network",
    type: "crypto",
    symbol: "MASK",
    region: "web3",
  },
  "ORDI": {
    code: "ORDI",
    name: "ORDI",
    type: "crypto",
    symbol: "ORDI",
    region: "web3",
  },
  "GALA": {
    code: "GALA",
    name: "GALA",
    type: "crypto",
    symbol: "GALA",
    region: "web3",
  },
  "CHEEL": {
    code: "CHEEL",
    name: "Cheelee",
    type: "crypto",
    symbol: "CHEEL",
    region: "web3",
  },
  "BEAM": {
    code: "BEAM",
    name: "Beam",
    type: "crypto",
    symbol: "BEAM",
    region: "web3",
  },
  "EGLD": {
    code: "EGLD",
    name: "MultiversX",
    type: "crypto",
    symbol: "EGLD",
    region: "web3",
  },
  "FET": {
    code: "FET",
    name: "Fetch.ai",
    type: "crypto",
    symbol: "FET",
    region: "web3",
  },
  "XRD": {
    code: "XRD",
    name: "Radix",
    type: "crypto",
    symbol: "XRD",
    region: "web3",
  },
  "GMX": {
    code: "GMX",
    name: "GMX",
    type: "crypto",
    symbol: "GMX",
    region: "web3",
  },
  "GNO": {
    code: "GNO",
    name: "Gnosis",
    type: "crypto",
    symbol: "GNO",
    region: "web3",
  },
  "FLOW": {
    code: "FLOW",
    name: "Flow",
    type: "crypto",
    symbol: "FLOW",
    region: "web3",
  },
  "BDX": {
    code: "BDX",
    name: "Beldex",
    type: "crypto",
    symbol: "BDX",
    region: "web3",
  },
  "XDC": {
    code: "XDC",
    name: "XDC Network",
    type: "crypto",
    symbol: "XDC",
    region: "web3",
  },
  "FRAX": {
    code: "FRAX",
    name: "Frax",
    type: "crypto",
    symbol: "FRAX",
    region: "web3",
  },
  "ARK": {
    code: "ARK",
    name: "ARK",
    type: "crypto",
    symbol: "ARK",
    region: "web3",
  },
  "XCH": {
    code: "XCH",
    name: "Chia",
    type: "crypto",
    symbol: "XCH",
    region: "web3",
  },
  "THETA": {
    code: "THETA",
    name: "Theta Network",
    type: "crypto",
    symbol: "THETA",
    region: "web3",
  },
  "PEPE": {
    code: "PEPE",
    name: "Pepe",
    type: "crypto",
    symbol: "PEPE",
    region: "web3",
  },
  "GAS": {
    code: "GAS",
    name: "Gas",
    type: "crypto",
    symbol: "GAS",
    region: "web3",
  },
  "COMP": {
    code: "COMP",
    name: "Compound",
    type: "crypto",
    symbol: "COMP",
    region: "web3",
  },
  "ZIL": {
    code: "ZIL",
    name: "Zilliqa",
    type: "crypto",
    symbol: "ZIL",
    region: "web3",
  },
  "ENS": {
    code: "ENS",
    name: "Ethereum Name Service",
    type: "crypto",
    symbol: "ENS",
    region: "web3",
  },
  "NFT": {
    code: "NFT",
    name: "APENFT",
    type: "crypto",
    symbol: "NFT",
    region: "web3",
  },
  "STX": {
    code: "STX",
    name: "Stacks",
    type: "crypto",
    symbol: "STX",
    region: "web3",
  },
  "LUNC": {
    code: "LUNC",
    name: "Terra Luna Classic",
    type: "crypto",
    symbol: "LUNC",
    region: "web3",
  },
  "BTT": {
    code: "BTT",
    name: "BitTorrent",
    type: "crypto",
    symbol: "BTT",
    region: "web3",
  },
  "YFI": {
    code: "YFI",
    name: "yearn.finance",
    type: "crypto",
    symbol: "YFI",
    region: "web3",
  },
  "GMT": {
    code: "GMT",
    name: "STEPN",
    type: "crypto",
    symbol: "GMT",
    region: "web3",
  },
  "NEXO": {
    code: "NEXO",
    name: "NEXO",
    type: "crypto",
    symbol: "NEXO",
    region: "web3",
  },
  "SC": {
    code: "SC",
    name: "Siacoin",
    type: "crypto",
    symbol: "SC",
    region: "web3",
  },
  "CHZ": {
    code: "CHZ",
    name: "Chiliz",
    type: "crypto",
    symbol: "CHZ",
    region: "web3",
  },
  "APE": {
    code: "APE",
    name: "ApeCoin",
    type: "crypto",
    symbol: "APE",
    region: "web3",
  },
  "CAKE": {
    code: "CAKE",
    name: "PancakeSwap",
    type: "crypto",
    symbol: "CAKE",
    region: "web3",
  },
  "NEO": {
    code: "NEO",
    name: "NEO",
    type: "crypto",
    symbol: "NEO",
    region: "web3",
  },
  "RONIN": {
    code: "RONIN",
    name: "Ronin",
    type: "crypto",
    symbol: "RON",
    region: "web3",
  },
  "XEM": {
    code: "XEM",
    name: "NEM",
    type: "crypto",
    symbol: "XEM",
    region: "web3",
  },
  "USDP": {
    code: "USDP",
    name: "Pax Dollar",
    type: "crypto",
    symbol: "USDP",
    region: "web3",
  },
  "JASMY": {
    code: "JASMY",
    name: "JasmyCoin",
    type: "crypto",
    symbol: "JASMY",
    region: "web3",
  },
  "AKT": {
    code: "AKT",
    name: "Akash Network",
    type: "crypto",
    symbol: "AKT",
    region: "web3",
  },
  "FTN": {
    code: "FTN",
    name: "Fasttoken",
    type: "crypto",
    symbol: "FTN",
    region: "web3",
  },
  "ELF": {
    code: "ELF",
    name: "aelf",
    type: "crypto",
    symbol: "ELF",
    region: "web3",
  },
  "CFX": {
    code: "CFX",
    name: "Conflux",
    type: "crypto",
    symbol: "CFX",
    region: "web3",
  },
  "BAT": {
    code: "BAT",
    name: "Basic Attention",
    type: "crypto",
    symbol: "BAT",
    region: "web3",
  },
  "AXL": {
    code: "AXL",
    name: "Axelar",
    type: "crypto",
    symbol: "AXL",
    region: "web3",
  },
  "FLR": {
    code: "FLR",
    name: "Flare",
    type: "crypto",
    symbol: "FLR",
    region: "web3",
  },
  "TWT": {
    code: "TWT",
    name: "Trust Wallet",
    type: "crypto",
    symbol: "TWT",
    region: "web3",
  },
  "JST": {
    code: "JST",
    name: "JUST",
    type: "crypto",
    symbol: "JST",
    region: "web3",
  },
  "OSMO": {
    code: "OSMO",
    name: "Osmosis",
    type: "crypto",
    symbol: "OSMO",
    region: "web3",
  },
  "ARB": {
    code: "ARB",
    name: "Arbitrum",
    type: "crypto",
    symbol: "ARB",
    region: "web3",
  },
  "RPL": {
    code: "RPL",
    name: "Rocket Pool",
    type: "crypto",
    symbol: "RPL",
    region: "web3",
  },
  "PRIME": {
    code: "PRIME",
    name: "Echelon Prime",
    type: "crypto",
    symbol: "PRIME",
    region: "web3",
  },
  "AXS": {
    code: "AXS",
    name: "Axie Infinity",
    type: "crypto",
    symbol: "AXS",
    region: "web3",
  },
  "KAVA": {
    code: "KAVA",
    name: "Kava",
    type: "crypto",
    symbol: "KAVA",
    region: "web3",
  },
  "DCR": {
    code: "DCR",
    name: "Decred",
    type: "crypto",
    symbol: "DCR",
    region: "web3",
  },
  "CVX": {
    code: "CVX",
    name: "Convex Finance",
    type: "crypto",
    symbol: "CVX",
    region: "web3",
  },
  "BLUR": {
    code: "BLUR",
    name: "Blur",
    type: "crypto",
    symbol: "BLUR",
    region: "web3",
  },
  "WEMIX": {
    code: "WEMIX",
    name: "WEMIX",
    type: "crypto",
    symbol: "WEMIX",
    region: "web3",
  },
  "USDD": {
    code: "USDD",
    name: "USDD",
    type: "crypto",
    symbol: "USDD",
    region: "web3",
  },
  "TRB": {
    code: "TRB",
    name: "Tellor Tributes",
    type: "crypto",
    symbol: "TRB",
    region: "web3",
  },
  "ICX": {
    code: "ICX",
    name: "ICON",
    type: "crypto",
    symbol: "ICX",
    region: "web3",
  },
  "GT": {
    code: "GT",
    name: "Gate",
    type: "crypto",
    symbol: "GT",
    region: "web3",
  },
  "TFUEL": {
    code: "TFUEL",
    name: "Theta Fuel",
    type: "crypto",
    symbol: "TFUEL",
    region: "web3",
  },
  "AUDIO": {
    code: "AUDIO",
    name: "Audius",
    type: "crypto",
    symbol: "AUDIO",
    region: "web3",
  },
  "WLD": {
    code: "WLD",
    name: "Worldcoin",
    type: "crypto",
    symbol: "WLD",
    region: "web3",
  },
  "SRD": {
    code: "SRD",
    name: "Surinam Dollar",
    type: "fiat",
    symbol: "SRD",
    region: "Suriname",
  },
  "FNSA": {
    code: "FNSA",
    name: "FINSCHIA",
    type: "crypto",
    symbol: "FNSA",
    region: "web3",
  },
  "ONT": {
    code: "ONT",
    name: "Ontology",
    type: "crypto",
    symbol: "ONT",
    region: "web3",
  },
  "XCD": {
    code: "XCD",
    name: "East Caribbean Dollar",
    type: "fiat",
    symbol: "EC$",
    region: "Dominica, Grenada, Saint Kitts and Nevis, Saint Lucia, Saint Vincent And The Grenadines",
  },
  "HKD": {
    code: "HKD",
    name: "Hong Kong Dollar",
    type: "fiat",
    symbol: "HK$",
    region: "Hong Kong",
  },
  "GEL": {
    code: "GEL",
    name: "Lari",
    type: "fiat",
    symbol: "₾",
    region: "Georgia",
  },
  "ZAR": {
    code: "ZAR",
    name: "South African Rand",
    type: "fiat",
    symbol: "R",
    region: "South Africa",
  },
  "BRL": {
    code: "BRL",
    name: "Brazilian Real",
    type: "fiat",
    symbol: "R$",
    region: "Brazil",
  },
  "SNT": {
    code: "SNT",
    name: "Status",
    type: "crypto",
    symbol: "SNT",
    region: "web3",
  },
  "GAT": {
    code: "GAT",
    name: "GameAI",
    type: "crypto",
    symbol: "GAT",
    region: "web3",
  },
  "TIA": {
    code: "TIA",
    name: "Celestia",
    type: "crypto",
    symbol: "TIA",
    region: "web3",
  },
  "AUD": {
    code: "AUD",
    name: "Australian dollar",
    type: "fiat",
    symbol: "A$",
    region: "Australia, Christmas Island, Cocos (Keeling) Islands, Heard Island And Mcdonald Islands, Kiribati, Nauru, Norfolk Island, Tuvalu",
  },
  "KSM": {
    code: "KSM",
    name: "Kusama",
    type: "crypto",
    symbol: "KSM",
    region: "web3",
  },
  "BONE": {
    code: "BONE",
    name: "Bone ShibaSwap",
    type: "crypto",
    symbol: "BONE",
    region: "web3",
  },
  "CAD": {
    code: "CAD",
    name: "Canadian dollar",
    type: "fiat",
    symbol: "C$",
    region: "Canada",
  },
  "ILS": {
    code: "ILS",
    name: "Israeli Shekel",
    type: "fiat",
    symbol: "₪",
    region: "Israel",
  },
  "XTZ": {
    code: "XTZ",
    name: "Tezos",
    type: "crypto",
    symbol: "XTZ",
    region: "web3",
  },
  "RBN": {
    code: "RBN",
    name: "Ribbon Finance",
    type: "crypto",
    symbol: "RBN",
    region: "web3",
  },
  "STRAX": {
    code: "STRAX",
    name: "Stratis",
    type: "crypto",
    symbol: "STRAX",
    region: "web3",
  },
  "SAND": {
    code: "SAND",
    name: "The Sandbox",
    type: "crypto",
    symbol: "SAND",
    region: "web3",
  },
  "WAXP": {
    code: "WAXP",
    name: "WAX",
    type: "crypto",
    symbol: "WAXP",
    region: "web3",
  },
  "TEL": {
    code: "TEL",
    name: "Telcoin",
    type: "crypto",
    symbol: "TEL",
    region: "web3",
  },
  "LSK": {
    code: "LSK",
    name: "Lisk",
    type: "crypto",
    symbol: "LSK",
    region: "web3",
  },
  "SAVAX": {
    code: "SAVAX",
    name: "BENQI Liquid Staked AVAX",
    type: "crypto",
    symbol: "SAVAX",
    region: "web3",
  },
  "PYR": {
    code: "PYR",
    name: "Vulcan Forged",
    type: "crypto",
    symbol: "PYR",
    region: "web3",
  },
  "BONK": {
    code: "BONK",
    name: "Bonk",
    type: "crypto",
    symbol: "BONK",
    region: "web3",
  },
  "MANA": {
    code: "MANA",
    name: "Decentraland",
    type: "crypto",
    symbol: "MANA",
    region: "web3",
  },
  "LUNA": {
    code: "LUNA",
    name: "Terra",
    type: "crypto",
    symbol: "LUNA",
    region: "web3",
  },
  "SUSHI": {
    code: "SUSHI",
    name: "Sushi",
    type: "crypto",
    symbol: "SUSHI",
    region: "web3",
  },
  "AMP": {
    code: "AMP",
    name: "Amp",
    type: "crypto",
    symbol: "AMP",
    region: "web3",
  },
  "TRAC": {
    code: "TRAC",
    name: "OriginTrail",
    type: "crypto",
    symbol: "TRAC",
    region: "web3",
  },
  "ENJ": {
    code: "ENJ",
    name: "Enjin Coin",
    type: "crypto",
    symbol: "ENJ",
    region: "web3",
  },
  "EURS": {
    code: "EURS",
    name: "STASIS EURO",
    type: "crypto",
    symbol: "EURS",
    region: "web3",
  },
  "DEXE": {
    code: "DEXE",
    name: "DeXe",
    type: "crypto",
    symbol: "DEXE",
    region: "web3",
  },
  "MEME": {
    code: "MEME",
    name: "Memecoin",
    type: "crypto",
    symbol: "MEME",
    region: "web3",
  },
  "KDA": {
    code: "KDA",
    name: "Kadena",
    type: "crypto",
    symbol: "KDA",
    region: "web3",
  },
  "KCS": {
    code: "KCS",
    name: "KuCoin",
    type: "crypto",
    symbol: "KCS",
    region: "web3",
  },
  "GLMR": {
    code: "GLMR",
    name: "Moonbeam",
    type: "crypto",
    symbol: "GLMR",
    region: "web3",
  },
  "ONE": {
    code: "ONE",
    name: "Harmony",
    type: "crypto",
    symbol: "ONE",
    region: "web3",
  },
  "BGB": {
    code: "BGB",
    name: "Bitget Token",
    type: "crypto",
    symbol: "BGB",
    region: "web3",
  },
  "ULTIMA": {
    code: "ULTIMA",
    name: "Ultima",
    type: "crypto",
    symbol: "ULTIMA",
    region: "web3",
  },
  "PYUSD": {
    code: "PYUSD",
    name: "PayPal USD",
    type: "crypto",
    symbol: "PYUSD",
    region: "web3",
  },
  "ETHW": {
    code: "ETHW",
    name: "EthereumPoW",
    type: "crypto",
    symbol: "ETHW",
    region: "web3",
  },
  "BSV": {
    code: "BSV",
    name: "Bitcoin SV",
    type: "crypto",
    symbol: "BSV",
    region: "web3",
  },
  "FLUX": {
    code: "FLUX",
    name: "Flux",
    type: "crypto",
    symbol: "FLUX",
    region: "web3",
  },
  "ZEN": {
    code: "ZEN",
    name: "Horizen",
    type: "crypto",
    symbol: "ZEN",
    region: "web3",
  },
  "ROSE": {
    code: "ROSE",
    name: "Oasis Network",
    type: "crypto",
    symbol: "ROSE",
    region: "web3",
  },
  "ORBS": {
    code: "ORBS",
    name: "Orbs",
    type: "crypto",
    symbol: "ORBS",
    region: "web3",
  },
  "BORA": {
    code: "BORA",
    name: "BORA",
    type: "crypto",
    symbol: "BORA",
    region: "web3",
  },
  "SNX": {
    code: "SNX",
    name: "Synthetix Network",
    type: "crypto",
    symbol: "SNX",
    region: "web3",
  },
  "IOST": {
    code: "IOST",
    name: "IOST",
    type: "crypto",
    symbol: "IOST",
    region: "web3",
  },
  "ISK": {
    code: "ISK",
    name: "Iceland Krona",
    type: "fiat",
    symbol: "kr",
    region: "Iceland",
  },
  "RVN": {
    code: "RVN",
    name: "Ravencoin",
    type: "crypto",
    symbol: "RVN",
    region: "web3",
  },
  "BABYDOGE": {
    code: "BABYDOGE",
    name: "Baby Doge Coin",
    type: "crypto",
    symbol: "BABYDOGE",
    region: "web3",
  },
  "SGD": {
    code: "SGD",
    name: "Singapore Dollar",
    type: "fiat",
    symbol: "S$",
    region: "Singapore",
  },
  "BND": {
    code: "BND",
    name: "Brunei Dollar",
    type: "fiat",
    symbol: "B$",
    region: "Brunei Darussalam",
  },
  "WAVES": {
    code: "WAVES",
    name: "Waves",
    type: "crypto",
    symbol: "WAVES",
    region: "web3",
  },
  "ARS": {
    code: "ARS",
    name: "Argentine Peso",
    type: "fiat",
    symbol: "$",
    region: "Argentina",
  },
  "PEN": {
    code: "PEN",
    name: "Peruvian Sol",
    type: "fiat",
    symbol: "S/",
    region: "Peru",
  },
  "PLN": {
    code: "PLN",
    name: "Polish Zloty",
    type: "fiat",
    symbol: "zł",
    region: "Poland",
  },
  "KGS": {
    code: "KGS",
    name: "Som",
    type: "fiat",
    symbol: "лв",
    region: "Kyrgyzstan",
  },
  "TJS": {
    code: "TJS",
    name: "Somoni",
    type: "fiat",
    symbol: "ЅМ",
    region: "Tajikistan",
  },
  "MWK": {
    code: "MWK",
    name: "Kwacha",
    type: "fiat",
    symbol: "MK",
    region: "Malawi",
  },
  "COP": {
    code: "COP",
    name: "Colombian peso",
    type: "fiat",
    symbol: "$",
    region: "Colombia",
  },
  "DJF": {
    code: "DJF",
    name: "Djibouti Franc",
    type: "fiat",
    symbol: "Fdj",
    region: "Djibouti",
  },
  "FJD": {
    code: "FJD",
    name: "Fiji Dollar",
    type: "fiat",
    symbol: "FJ$",
    region: "Fiji",
  },
  "SZL": {
    code: "SZL",
    name: "Lilangeni",
    type: "fiat",
    symbol: "E",
    region: "Eswatini",
  },
  "BICO": {
    code: "BICO",
    name: "Biconomy",
    type: "crypto",
    symbol: "BICO",
    region: "web3",
  },
  "ALGO": {
    code: "ALGO",
    name: "Algorand",
    type: "crypto",
    symbol: "ALGO",
    region: "web3",
  },
  "VVS": {
    code: "VVS",
    name: "VVS Finance",
    type: "crypto",
    symbol: "VVS",
    region: "web3",
  },
  "SXP": {
    code: "SXP",
    name: "SXP",
    type: "crypto",
    symbol: "SXP",
    region: "web3",
  },
  "1INCH": {
    code: "1INCH",
    name: "1inch",
    type: "crypto",
    symbol: "1INCH",
    region: "web3",
  },
  "SFP": {
    code: "SFP",
    name: "SafePal",
    type: "crypto",
    symbol: "SFP",
    region: "web3",
  },
  "SKL": {
    code: "SKL",
    name: "SKALE",
    type: "crypto",
    symbol: "SKL",
    region: "web3",
  },
  "CSPR": {
    code: "CSPR",
    name: "Casper Network",
    type: "crypto",
    symbol: "CSPR",
    region: "web3",
  },
  "ZEC": {
    code: "ZEC",
    name: "Zcash",
    type: "crypto",
    symbol: "ZEC",
    region: "web3",
  },
  "LPT": {
    code: "LPT",
    name: "Livepeer",
    type: "crypto",
    symbol: "LPT",
    region: "web3",
  },
  "PAXG": {
    code: "PAXG",
    name: "PAX Gold",
    type: "crypto",
    symbol: "PAXG",
    region: "web3",
  },
  "HNT": {
    code: "HNT",
    name: "Helium",
    type: "crypto",
    symbol: "HNT",
    region: "web3",
  },
  "DASH": {
    code: "DASH",
    name: "Dash",
    type: "crypto",
    symbol: "DASH",
    region: "web3",
  },
  "CFG": {
    code: "CFG",
    name: "Centrifuge",
    type: "crypto",
    symbol: "CFG",
    region: "web3",
  },
  "POLYX": {
    code: "POLYX",
    name: "Polymesh",
    type: "crypto",
    symbol: "POLYX",
    region: "web3",
  },
  "EOS": {
    code: "EOS",
    name: "EOS",
    type: "crypto",
    symbol: "EOS",
    region: "web3",
  },
  "FLOKI": {
    code: "FLOKI",
    name: "FLOKI",
    type: "crypto",
    symbol: "FLOKI",
    region: "web3",
  },
  "ASTR": {
    code: "ASTR",
    name: "Astar",
    type: "crypto",
    symbol: "ASTR",
    region: "web3",
  },
  "AAVE": {
    code: "AAVE",
    name: "Aave",
    type: "crypto",
    symbol: "AAVE",
    region: "web3",
  },
  "HOT": {
    code: "HOT",
    name: "Holo",
    type: "crypto",
    symbol: "HOT",
    region: "web3",
  },
  "BAND": {
    code: "BAND",
    name: "Band Protocol",
    type: "crypto",
    symbol: "BAND",
    region: "web3",
  },
  "QTUM": {
    code: "QTUM",
    name: "Qtum",
    type: "crypto",
    symbol: "QTUM",
    region: "web3",
  },
  "OHM": {
    code: "OHM",
    name: "Olympus",
    type: "crypto",
    symbol: "OHM",
    region: "web3",
  },
  "ILV": {
    code: "ILV",
    name: "Illuvium",
    type: "crypto",
    symbol: "ILV",
    region: "web3",
  },
  "RWF": {
    code: "RWF",
    name: "Rwanda Franc",
    type: "fiat",
    symbol: "FRw",
    region: "Rwanda",
  },
  "SEI": {
    code: "SEI",
    name: "Sei",
    type: "crypto",
    symbol: "SEI",
    region: "web3",
  },
  "BORG": {
    code: "BORG",
    name: "SwissBorg",
    type: "crypto",
    symbol: "BORG",
    region: "web3",
  },
  "CLP": {
    code: "CLP",
    name: "Chilean Peso",
    type: "fiat",
    symbol: "$",
    region: "Chile",
  },
  "LRC": {
    code: "LRC",
    name: "Loopring",
    type: "crypto",
    symbol: "LRC",
    region: "web3",
  },
  "BAL": {
    code: "BAL",
    name: "Balancer",
    type: "crypto",
    symbol: "BAL",
    region: "web3",
  },
};
