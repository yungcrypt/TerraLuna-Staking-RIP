import React, { useCallback } from 'react';
import {
  useEarnEpochStatesQuery,
  useEarnWithdrawForm,
} from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { WithdrawDialog } from '../WithdrawDialog';
import { useEarnWithdrawTx } from '@anchor-protocol/app-provider/tx/earn/withdraw';
import { aUST, u, UST } from '@anchor-protocol/types';
import { Big, BigSource } from 'big.js';
import { DialogProps } from '@libs/use-dialog';
import {useWarningDialog} from '../useWithdrawDialog';
import { Modal } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
export function TerraWithdrawDialog2(props: DialogProps<{}, void>) {
  const { connected } = useAccount();


  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const state = useEarnWithdrawForm({coin: props.coin});
  const [withdraw, withdrawTxResult] = useEarnWithdrawTx();

  const { withdrawAmount, txFee, availablePost } = state;


  const proceed = useCallback(
    async (withdrawAmount: UST, txFee: u<UST<BigSource>> | undefined) => {
      if (!connected || !withdraw ) {
        return;
      }

      withdraw({
        withdrawAmount: Big(withdrawAmount).toString() as UST,
        withdrawDenom: props.coin,
        txFee: txFee!.toString() as u<UST>,
      });
    },
    [connected, withdraw],
  );

  return (
      <Modal open={open} onClose={handleClose} disableBackdropClick disableEnforceFocus>
        <Dialog className={"woo"} onClose={handleClose}>
        WARNING ARE YOU SURE?
      <ViewAddressWarning>
      </ViewAddressWarning>
      </Dialog>
      </Modal>
  );
}

export function TerraWithdrawDialog(props: DialogProps<{}, void>) {
  const { connected } = useAccount();

  const [continued, setContinued] = React.useState(false);
  const state = useEarnWithdrawForm({coin: props.coin});

  const [withdraw, withdrawTxResult] = useEarnWithdrawTx();

  const { withdrawAmount, txFee, availablePost } = state;


  const [openWithdrawDialog1, withdrawDialogElement] = useWarningDialog();

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog1();
  }, [openWithdrawDialog1]);
 


  const proceed = useCallback(
    async (withdrawAmount: UST, txFee: u<UST<BigSource>> | undefined) => {
      if (!connected || !withdraw ) {
        return;
      }

      withdraw({
        withdrawAmount: Big(withdrawAmount).toString() as UST,
        withdrawDenom: props.coin,
        txFee: txFee!.toString() as u<UST>,
      });
    },
    [connected, withdraw],
  );

  return (
    <WithdrawDialog {...props} {...state} txResult={withdrawTxResult}>
      <ViewAddressWarning>
        <ActionButton
          className="button"
          disabled={!availablePost || !connected || !withdraw || !availablePost}
          //onClick={() => proceed(withdrawAmount, txFee)}
          onClick={() => {
           if (continued) {
             proceed(withdrawAmount, txFee)
           }
           else {
           setContinued(true);

          openWithdraw()
           }
          }}
        >
          Proceed
        </ActionButton>
      </ViewAddressWarning>
      {withdrawDialogElement}
    </WithdrawDialog>
  );
}
