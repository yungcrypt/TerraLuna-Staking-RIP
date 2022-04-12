import React, { useCallback, useState } from 'react';
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
import { useWarningDialog } from '../useWithdrawDialog';
import { Modal, Switch } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { withStyles, createStyles, Theme } from '@material-ui/core';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { DepositButtons } from '../TotalDepositSection';
const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '200px',
      height: '47px',
      padding: '0px',
    },
    switchBase: {
      'color': '#818181',
      'padding': '1px',
      '&$checked': {
        '& + $track': {
          backgroundColor: '#493C3C',
        },
      },
    },
    thumb: {
      color: 'black',
      backgroundColor:'white',
      width: '100px',
      height: '44px',
      borderRadius:'10px',
      margin: '1px',
      '&:after, &:before': {
        color: 'black',
        fontSize: '35px',
        position: 'absolute',
        top: '6px',
      },
      '&:after': {
        content: props => props.coin,
      },
      '&:before': {
        content: props => props.coin,
      },
    },
    track: {
      'borderRadius': '12px',
      'backgroundColor': '#493C3C',
      'opacity': '1 !important',
      '&:after, &:before': {
        color: 'white',
        fontSize: '11px',
        position: 'absolute',
        top: '6px',
      },
      '&:after': {
        content: props => props.coin,
        left: '8px',
      },
      '&:before': {
        content: "'Off'",
        right: '7px',
      },
    },
    checked: {
      color: '#23bf58 !important',
      transform: 'translateX(100px) !important',
    },
  }),
)(({ classes, ...props }: any) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      coin={props.coin}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

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
  const state = useEarnWithdrawForm({ coin: coin });

  const [withdraw, withdrawTxResult] = useEarnWithdrawTx();

  const { withdrawAmount, txFee, availablePost } = state;

  const [openWithdrawDialog1, withdrawDialogElement] = useWarningDialog();

  const [toggled, setToggled] = React.useState(false);

  const proceed = useCallback(
    async (withdrawAmount: UST, txFee: u<UST<BigSource>> | undefined) => {
      if (!connected || !withdraw) {
        return;
      }

      withdraw({
        withdrawAmount: Big(withdrawAmount).toString() as UST,
        withdrawDenom: coin,
        txFee: txFee!.toString() as u<UST>,
      });
    },
    [connected, withdraw, coin],
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
        <IOSSwitch
          checked={toggled}
          onChange={(e: any) => {
            if (e.target.checked === true) {
              console.log(coin);
              if (coin === 'uusd') {
                setCoin('uluna');
                setToggled(e.target.checked);
                return;
              } else {
                setCoin('uusd');
                setToggled(e.target.checked);
                return;
              }
            }
            if (e.target.checked === false) {
              if (coin === 'uusd') {
                setCoin('uluna');
                setToggled(e.target.checked);
                return;
              } else {
                setCoin('uusd');
                setToggled(e.target.checked);
                return;
              }
            }
            console.log(e.target.checked);
          }}
          inputProps={{ 'aria-label': 'controlled' }}
          coin={coin}
        />
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
