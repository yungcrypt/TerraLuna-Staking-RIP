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
import {useWarningDialog} from '../useWithdrawDialog';
import { Modal, Switch } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { withStyles, createStyles, Theme} from '@material-ui/core';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { FormControlLabel, Checkbox } from '@material-ui/core';

const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {
        
    },
    focusVisible: {},
  }),
)(({ classes, ...props }: any) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
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
                    setOpen(false)
                    };
  return (
      <Modal open={open} onClose={handleClose} disableBackdropClick disableEnforceFocus>
        <Dialog className={"woo"} onClose={handleClose}>
        <h1>WITHDRAW</h1>
        <Section>
        Are you really sure?
        </Section>
          <FormControlLabel control={
          <Checkbox name="checkedC" onChange={()=> {
          if (active) {
          setActive(false)
          }
          if (!active) {
          setActive(true)
          }
          
          }

          }/>} label="Uncontrolled" />
          <ActionButton
            
          disabled={active}
          //onClick={() => proceed(withdrawAmount, txFee)}
          onClick={() => {
                    props.proceed(props.withdrawAmount,props.txFee)
                    setOpen(false)

          }}
          >
            Yes I want to lose my Benefits!
          </ActionButton>
      <ViewAddressWarning>
      </ViewAddressWarning>
      </Dialog>
      </Modal>
  );
}

export function TerraWithdrawDialog(props: DialogProps<{}, void>) {
  const { connected } = useAccount();
  const [coin, setCoin] = useState(props.coin);
  const [continued, setContinued] = React.useState(false);
  const state = useEarnWithdrawForm({coin: coin});
  console.log(coin)

  const [withdraw, withdrawTxResult] = useEarnWithdrawTx();

  const { withdrawAmount, txFee, availablePost } = state;


  const [openWithdrawDialog1, withdrawDialogElement] = useWarningDialog();

  const [toggled, setToggled] = React.useState(false);
 


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

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog1();
  }, [openWithdrawDialog1]);

  return (<>
    <WithdrawDialog {...props} {...state} txResult={withdrawTxResult} coin={coin} setContinued={setContinued}>
      <ViewAddressWarning>
      <IOSSwitch checked={toggled} 
                 onChange={(e: any) => { 
                        if (e.target.checked === true) {
                            console.log(coin)
                            if (coin === "uusd") {
                                setCoin("uluna")
                                setToggled(e.target.checked)
                                return

                            }
                            else  {
                                setCoin("uusd")
                                setToggled(e.target.checked)
                                return

                            }
                        }
                        if (e.target.checked === false) {
                            if (coin === "uusd") {
                                setCoin("uluna")
                                setToggled(e.target.checked)
                                return

                            }
                            else {
                                setCoin("uusd")
                                setToggled(e.target.checked)
                                return

                            }
                            
                        }
                        console.log(e.target.checked)
                        }}
                 inputProps={{ 'aria-label': 'controlled' }}       
                        />
      </ViewAddressWarning>
      {withdrawDialogElement}
    </WithdrawDialog>
    {continued && <TerraWithdrawDialog2 proceed={proceed} withdrawAmount={withdrawAmount} txFee={txFee}/>}
    </>)

}
