import {
  AnchorTax,
  AnchorTokenBalances,
  DefaultAnchorTokenBalances,
} from '@anchor-protocol/app-fns';
import {
  ANC,
  AncUstLP,
  aUST,
  bLuna,
  bLunaLunaLP,
} from '@anchor-protocol/types';
import {
  useCW20Balance,
  useTerraNativeBalances,
  useUstTax,
} from '@libs/app-provider';
import { useMemo } from 'react';
import { useAnchorWebapp } from '../contexts/context';
import { MsgExecuteContract, WasmAPI, Coin, LCDClient, Fee } from '@terra-money/terra.js'
import { ConnectedWallet } from '@terra-money/wallet-provider'
import { toast } from 'react-toastify';
import axios from 'axios';
import { successOption, errorOption, POOL } from '../../../constants';
import {useAccount} from '../../../contexts/account'


export interface AnchorBank {
  tax: AnchorTax;
  tokenBalances: AnchorTokenBalances;
}

export function useAnchorBank(): AnchorBank {
  const wallet = useAccount()
  
async function fetchData() {
   const lcd = new LCDClient({ //
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'Bombay-12',
    gasPrices: { uusd: 0.45 },
  })

  const api = new WasmAPI(lcd.apiRequester);

  let amountHistory = undefined,
    aprUstHistory = undefined,
    aprLunaHistory = undefined,
    ustInfo = undefined,
    lunaInfo = undefined,
    userInfoUst = undefined,
    userInfoLuna = undefined,
    farmPrice = undefined,
    farmInfo = undefined,
    farmStartTime = undefined,
    ust_total_rewards = undefined,
    luna_total_rewards = undefined,
    status: any = undefined

  try {
    lunaInfo = await axios.get(
      `https://api.extraterrestrial.money/v1/api/prices?symbol=LUNA`
    );
  } catch (e) { }

  try {
    ustInfo = await axios.get(
      `https://api.extraterrestrial.money/v1/api/prices?symbol=UST`
    );
  } catch (e) { }


  try {
    status = await api.contractQuery(
      POOL,
      {
        get_status: { wallet: wallet?.nativeWalletAddress }
      });
  } catch (e) {
    console.log(e)
  }
  console.log(status)
    try {
      amountHistory = await api.contractQuery(
        POOL,
        {
          get_amount_history: {}
        });
    } catch (e) { }

    try {
      aprUstHistory = await api.contractQuery(
        POOL,
        {
          get_history_of_apr_ust: {}
        }
      )
    } catch (e) { }

    try {
      aprLunaHistory = await api.contractQuery(
        POOL,
        {
          get_history_of_apr_luna: {}
        }
      )
    } catch (e) { }

    try {
      userInfoUst = await api.contractQuery(
        POOL,
        {
          get_user_info_ust: {
            wallet: wallet?.nativeWalletAddress
          }
        }
      )
    } catch (e) { }

    try {
      userInfoLuna = await api.contractQuery(
        POOL,
        {
          get_user_info_luna: {
            wallet: wallet?.nativeWalletAddress
          }
        }
      )
    } catch (e) { }

    try {
      farmPrice = await api.contractQuery(
        POOL,
        {
          get_farm_price: {}
        }
      )
    } catch (e) { }

    try {
      farmInfo = await api.contractQuery(
        POOL,
        {
          get_farm_info: {
            wallet: wallet?.nativeWalletAddress
          }
        }
      )
    } catch (e) { }

    try {
      farmStartTime = await api.contractQuery(
        POOL,
        {
          get_farm_starttime: {}
        }
      )
    } catch (e) { }
  const result = {
    status,
    amountHistory,
    aprUstHistory,
    aprLunaHistory,
    ustInfo,
    lunaInfo,
    userInfoLuna,
    userInfoUst,
    farmPrice,
    farmInfo,
    farmStartTime,
    ust_total_rewards,
    luna_total_rewards


  }
  console.log(result)
  return result

}
  const newData = fetchData()
  

  const { contractAddress } = useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const { taxRate, maxTax } = useUstTax();

  const { uUST, uLuna } = useTerraNativeBalances(terraWalletAddress);

  const uANC = useCW20Balance<ANC>(
    contractAddress.cw20.ANC,
    terraWalletAddress,
  );

  const uAncUstLP = useCW20Balance<AncUstLP>(
    contractAddress.cw20.AncUstLP,
    terraWalletAddress,
  );

  const uaUST = useCW20Balance<aUST>(
    contractAddress.cw20.aUST,
    terraWalletAddress,
  );

  const ubLuna = useCW20Balance<bLuna>(
    contractAddress.cw20.bLuna,
    terraWalletAddress,
  );

  const ubLunaLunaLP = useCW20Balance<bLunaLunaLP>(
    contractAddress.cw20.bLunaLunaLP,
    terraWalletAddress,
  );

  return useMemo(() => {
    return {
      tax: {
        taxRate,
        maxTaxUUSD: maxTax,
      },
      tokenBalances: {
        ...DefaultAnchorTokenBalances,
        uUST,
        uANC,
        uAncUstLP,
        uaUST,
        ubLuna,
        ubLunaLunaLP,
        uLuna,
        newData,
      },
    };
  }, [
    maxTax,
    taxRate,
    uANC,
    uAncUstLP,
    uLuna,
    uUST,
    uaUST,
    ubLuna,
    ubLunaLunaLP,
    newData
  ]);
}
