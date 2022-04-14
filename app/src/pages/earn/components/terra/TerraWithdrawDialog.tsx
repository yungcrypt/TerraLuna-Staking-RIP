import React, { useCallback, useState } from 'react';
import {
  useEarnEpochStatesQuery,
  useEarnWithdrawForm,
} from '@anchor-protocol/app-provider';
import { ActionButton} from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton} from '@libs/neumorphism-ui/components/BorderButton';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { WithdrawDialog } from '../WithdrawDialog';
import { useEarnWithdrawTx } from '@anchor-protocol/app-provider/tx/earn/withdraw';
import { aUST, u, UST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { DialogProps } from '@libs/use-dialog';
import { useWarningDialog } from '../useWithdrawDialog';
import { Modal, Switch } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { withStyles, createStyles, Theme } from '@material-ui/core';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { DepositButtons } from '../TotalDepositSection';
import {useLunaExchange} from '@anchor-protocol/app-provider'
import styled from 'styled-components';

export function TerraWithdrawDialog2(props: any) {
  const { connected } = useAccount();

  const [open, setOpen] = React.useState(true);
  const [active, setActive] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEnforceFocus
    >
      <Dialog className={'woo'} onClose={handleClose}>
        <h1>WITHDRAW</h1>
        <Section>Are you really sure?</Section>
        <FormControlLabel
          control={
            <Checkbox
              name="checkedC"
              onChange={() => {
                if (active) {
                  setActive(false);
                }
                if (!active) {
                  setActive(true);
                }
              }}
            />
          }
          label="Uncontrolled"
        />
        <ActionButton
          disabled={active}
          //onClick={() => proceed(withdrawAmount, txFee)}
          onClick={() => {
            props.proceed(props.withdrawAmount, props.txFee);
            setOpen(false);
          }}
        >
          Yes I want to lose my Benefits!
        </ActionButton>
        <ViewAddressWarning></ViewAddressWarning>
      </Dialog>
    </Modal>
  );
}

export function TerraWithdrawDialog(props: DialogProps<{}, void>) {
  const { connected } = useAccount();
  const [coin, setCoin] = useState(props.coin);
  const [continued, setContinued] = React.useState(false);
  const [switchStateUST, setSwitchStateUST] = React.useState(false);
  const [switchStateLUNA, setSwitchStateLUNA] = React.useState(false);
  const state = useEarnWithdrawForm({ coin: coin });
  const [withdraw, withdrawTxResult] = useEarnWithdrawTx(coin);

  const { withdrawAmount, txFee, availablePost } = state;

  const [openWithdrawDialog1, withdrawDialogElement] = useWarningDialog();

  const [toggled, setToggled] = React.useState(false);
   const [alignment, setAlignment] = React.useState('left');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const lunaUustExchangeRate = useLunaExchange();
      console.log(txFee)
  const getLunaFee = (txFee: any) => {
      return lunaUustExchangeRate.mul(big(txFee.toString()).div(Big(1000000000)).toNumber()).mul(1000000).toFixed();

  }


  const proceed = useCallback(
    async (withdrawAmount: UST, txFee: u<UST<BigSource>> | undefined) => {
         const fee =  await getLunaFee(txFee!).toString()
      if (!connected || !withdraw) {
        return;
      }
      if (coin === 'uluna') {
         if (fee !== undefined) {
          withdraw({
            withdrawAmount: Big(withdrawAmount).toString() as UST,
            withdrawDenom: coin,
            txFee: fee as u<UST>,
          });
          }

      } 

      if (coin === 'uusd') {
      withdraw({
        withdrawAmount: Big(withdrawAmount).toString() as UST,
        withdrawDenom: coin,
        txFee: txFee!.toString() as u<UST>,
      });
      }
    },
    [connected, withdraw, coin, getLunaFee],
  );

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog1();
  }, [openWithdrawDialog1]);

  return (
    <>
      <WithdrawDialog
        {...props}
        {...state}
        setCoin={setCoin}
        txResult={withdrawTxResult}
        coin={coin}
        setContinued={setContinued}
      >
        <div style={{display: "inline-flex", alignItems:"center", justifyContent:'center', margin: '0 auto', width:'100%', marginBottom:"15px"}}>
        <h1 style={{fontWeight:800, marginBottom:'0px', marginRight:"20px"}}>Withdraw </h1>
        <div style={{display:"inline-flex"}}>
        <SwitchButton onClick={(e: any)=>{
              if (coin === 'uusd') {
                setCoin('uluna');
                setSwitchStateUST(false)
                setSwitchStateLUNA(true)
                return;
              } else {
                setCoin('uusd');
                setSwitchStateUST(true)
                setSwitchStateLUNA(false)
                return;
              }

        }}
        disabled={switchStateUST}
        >
        UST
        </SwitchButton>
        <SwitchButton onClick={(e: any)=>{
              console.log(coin);
              if (coin === 'uusd') {
                setCoin('uluna');
                setSwitchStateUST(false)
                setSwitchStateLUNA(true)
                return;
              } else {
                setCoin('uusd');
                setSwitchStateUST(true)
                setSwitchStateLUNA(false)
                return;
              }

        }}
        disabled={switchStateLUNA}>
        Luna
        </SwitchButton>
        </div>
    </div>
      </WithdrawDialog>
      {continued && (
        <TerraWithdrawDialog2
          proceed={proceed}
          withdrawAmount={withdrawAmount}
          txFee={txFee}
        />
      )}
    </>
  );
}

const SwitchButton = styled(BorderButton)`
    border-radius:3px;
    width: 60px;
`;
