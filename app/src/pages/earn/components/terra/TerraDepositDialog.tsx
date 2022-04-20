import { u, UST, Luna } from '@anchor-protocol/types';
import { useEarnDepositForm } from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { BigSource } from 'big.js';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import type { ReactNode } from 'react';
import React, { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useEarnDepositTx } from '@anchor-protocol/app-provider/tx/earn/deposit';
import { DepositDialog, DepositDialogUpdate } from '../DepositDialog';
import { DialogProps } from '@libs/use-dialog';
import { withStyles, createStyles, Theme, Switch } from '@material-ui/core';
import {useLunaExchange} from '@anchor-protocol/app-provider'
import big, {Big} from 'big.js'



export function TerraDepositDialog(props: DialogProps<{}, void>) {
  const account = useAccount();

  const [toggled, setToggled] = React.useState(false);
  const [coin, setCoin] = React.useState(props.coin);
  const [openConfirm, confirmElement] = useConfirm();

  const state = useEarnDepositForm({coin: coin});

  const [deposit, depositTxResult] = useEarnDepositTx();

  const { depositAmount, txFee, invalidNextTxFee, availablePost } = state;
  const lunaUustExchangeRate = useLunaExchange();
      console.log(txFee)

  const proceed = useCallback(
    async (
      depositAmount: UST,
      txFee: u<UST<BigSource>> | undefined,
      confirm: ReactNode,
    ) => {

  const getLunaFee = (txFee: any) => {
    return lunaUustExchangeRate.mul(big(txFee.toString()).div(Big(1000000000)).toNumber()).mul(1000000).toFixed();

  }

     const fee =  await getLunaFee(txFee!).toString()
     console.log(txFee);
      if (!account.connected || !deposit) {
        return;
      }

      if (confirm) {
        const userConfirm = await openConfirm({
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
        });

        if (!userConfirm) {
          return;
        }
      }
      if (coin === 'uluna') {
         if (fee !== undefined) {

      deposit({
        depositAmount,
        depositDenom: coin,
        txFee: fee as u<UST>,
      });
    }} else {
      deposit({
        depositAmount,
        depositDenom: coin,
        txFee: txFee!.toString() as u<UST>,
      });

    }
     
    },
    [account.connected, deposit, lunaUustExchangeRate, openConfirm, coin],
  );

  return (
    <DepositDialog {...props} {...state} setCoin={setCoin} coin={coin} setToggled={setToggled} txResult={depositTxResult}>
      <>
        <ViewAddressWarning>
        <div className={'button-wrap'}>
          <ActionButton
            className="button"
            style={
              invalidNextTxFee
                ? {
                    backgroundColor: '#c12535',
                  }
                : undefined
            }
            disabled={
              !account.connected ||
              !account.availablePost ||
              !deposit ||
              !availablePost
            }
            onClick={() => proceed(depositAmount, txFee, invalidNextTxFee)}
          >
            Proceed
          </ActionButton>
          </div>
        </ViewAddressWarning>
        {confirmElement}
      </>
    </DepositDialog>
  );
}
export function TerraDepositDialogUpdate(props: DialogProps<{}, void>) {
  const account = useAccount();

  const [toggled, setToggled] = React.useState(false);
  const [coin, setCoin] = React.useState(props.coin);
  const [openConfirm, confirmElement] = useConfirm();

  const state = useEarnDepositForm({coin: coin});

  const [deposit, depositTxResult] = useEarnDepositTx();

  const { depositAmount, txFee, invalidNextTxFee, availablePost, } = state;

  const proceed = useCallback(
    async (
      depositAmount: UST,
      txFee: u<UST<BigSource>> | undefined,
      confirm: ReactNode,
    ) => {
      if (!account.connected || !deposit) {
        return;
      }

      if (confirm) {
        const userConfirm = await openConfirm({
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
        });

        if (!userConfirm) {
          return;
        }
      }

      deposit({
        depositAmount: '0.00001',
        depositDenom: coin,
        txFee: ('150000'),
      });
    },
    [account.connected, deposit, openConfirm, coin],
  );

  return (
    <DepositDialogUpdate {...props} {...state} txResult={depositTxResult}>
      <>
        <ViewAddressWarning>
                        {coin}
          <ActionButton
            className="button"
            style={
              invalidNextTxFee
                ? {
                    backgroundColor: '#c12535',
                  }
                : undefined
            }
            onClick={() => {
                const deposits = '0' as UST;
                proceed(deposits, txFee, invalidNextTxFee)
            }}
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>
        {confirmElement}
      </>
    </DepositDialogUpdate>
  );
}
