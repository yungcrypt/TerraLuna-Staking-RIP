import { u, UST } from '@anchor-protocol/types';
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



export const IOSSwitch = withStyles((theme: Theme) =>
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





export function TerraDepositDialog(props: DialogProps<{}, void>) {
  const account = useAccount();

  const [toggled, setToggled] = React.useState(false);
  const [coin, setCoin] = React.useState(props.coin);
  const [openConfirm, confirmElement] = useConfirm();

  const state = useEarnDepositForm({coin: coin});

  const [deposit, depositTxResult] = useEarnDepositTx();

  const { depositAmount, txFee, invalidNextTxFee, availablePost } = state;

  const proceed = useCallback(
    async (
      depositAmount: UST,
      txFee: u<UST<BigSource>> | undefined,
      confirm: ReactNode,
    ) => {
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

      deposit({
        depositAmount,
        depositDenom: props.coin,
        txFee: txFee!.toString() as u<UST>,
      });
    },
    [account.connected, deposit, openConfirm],
  );

  return (
    <DepositDialog {...props} {...state} setCoin={setCoin} coin={coin} setToggled={setToggled} txResult={depositTxResult}>
      <>
        <ViewAddressWarning>
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
