interface ChainType {
  name: string;
  chain: string;
  icon: string;
  chainId: string;
}

type ChainsResult = ChainType[]

type GeneralObject = {
  [key: string]: string;
}