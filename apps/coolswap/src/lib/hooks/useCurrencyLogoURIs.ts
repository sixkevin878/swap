import { Currency, Token } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import useHttpLocations from 'hooks/useHttpLocations'
import { useEffect, useMemo } from 'react'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import KccLogo from '../../assets/images/kcc-token-logo.png'
import HecoLogo from '../../assets/images/huobi-token-logo.png'
import BscLogo from '../../assets/images/bsc-token-logo.png'
import MaticLogo from '../../assets/svg/matic-token-icon.svg'

type Network = 'ethereum' | 'arbitrum' | 'optimism'

function chainIdToNetworkName(networkId: SupportedChainId): Network {
  switch (networkId) {
    case SupportedChainId.MAINNET:
      return 'ethereum'
    case SupportedChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case SupportedChainId.OPTIMISM:
      return 'optimism'
    default:
      return 'ethereum'
  }
}

function getNativeLogoURI(chainId: SupportedChainId = SupportedChainId.MAINNET): string {
  switch (chainId) {
    case SupportedChainId.POLYGON_MUMBAI:
    case SupportedChainId.POLYGON:
      return MaticLogo
    case SupportedChainId.KCC_TEST:
      return KccLogo
    case SupportedChainId.HUOBI_TEST:
      return HecoLogo
    case SupportedChainId.BSC_TEST:
      return BscLogo
    default:
      return EthereumLogo
  }
}

function getTokenLogoURI(currency: Token, chainId: SupportedChainId = SupportedChainId.MAINNET): string | void {
  const { address, symbol } = currency
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [SupportedChainId.ARBITRUM_ONE, SupportedChainId.MAINNET, SupportedChainId.OPTIMISM]
  const networksWithUrlsBySymbol = [SupportedChainId.KCC_TEST, SupportedChainId.BSC_TEST, SupportedChainId.HUOBI_TEST]
  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  } else if (networksWithUrlsBySymbol.includes(chainId)) {
    return symbol ? `https://cdn.jsdelivr.net/gh/ginlink/swap-icons@0.1.0/token/${symbol.toLowerCase()}.png` : ''
  }
}

export default function useCurrencyLogoURIs(currency?: Currency | null): string[] {
  const locations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  useEffect(() => {
    console.log('[currency]:', currency instanceof WrappedTokenInfo, currency)
  }, [currency])

  return useMemo(() => {
    const logoURIs = [...locations]
    if (currency) {
      if (currency.isNative) {
        logoURIs.push(getNativeLogoURI(currency.chainId))
      } else if (currency.isToken) {
        const logoURI = getTokenLogoURI(currency, currency.chainId)
        if (logoURI) {
          logoURIs.push(logoURI)
        }
      }
    }
    return logoURIs
  }, [currency, locations])
}
