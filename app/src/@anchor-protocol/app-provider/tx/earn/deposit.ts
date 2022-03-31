import { earnDepositTx } from '@anchor-protocol/app-fns';
import { u, UST } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface EarnDepositTxParams {
<<<<<<< HEAD
  // depositAmount can be one of <UST, Luna>
  depositAmount: UST;
  depositDenom: string;
=======
  depositAmount: UST;
>>>>>>> ba7f9891 (Initialize testing)
  txFee: u<UST>;
  onTxSucceed?: () => void;
}

export function useEarnDepositTx() {
  const connectedWallet = useConnectedWallet();

  const { constants, txErrorReporter, queryClient, contractAddress } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
<<<<<<< HEAD
    ({ depositAmount, depositDenom, txFee, onTxSucceed }: EarnDepositTxParams) => {
=======
    ({ depositAmount, txFee, onTxSucceed }: EarnDepositTxParams) => {
>>>>>>> ba7f9891 (Initialize testing)
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

<<<<<<< HEAD
      switch (depositDenom) {
          case "uluna":
              console.log("im luna");
              break;
          case "uusd":
              console.log("im u ust");
              break;
      }

=======
>>>>>>> ba7f9891 (Initialize testing)
      return earnDepositTx({
        // fabricateMarketDepositStableCoin
        walletAddr: connectedWallet.walletAddress,
        marketAddr: contractAddress.moneyMarket.market,
<<<<<<< HEAD
        // @ts-ignore
        depositAmount,
        coin: depositDenom,
=======
        depositAmount,
>>>>>>> ba7f9891 (Initialize testing)
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        txFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.moneyMarket.market,
      constants.gasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
