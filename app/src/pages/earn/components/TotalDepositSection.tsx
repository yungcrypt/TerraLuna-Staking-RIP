import React, { useCallback, useMemo } from 'react';
import { computeTotalDeposit } from '@anchor-protocol/app-fns';
import { useEarnEpochStatesQuery } from '@anchor-protocol/app-provider';
import {
  formatUST,
  formatUSTWithPostfixUnits,
  MILLION,
} from '@anchor-protocol/notation';
import { demicrofy, MICRO } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import {Typography} from '@material-ui/core'
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import { SubAmount } from 'components/primitives/SubAmount';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useDepositDialog } from './useDepositDialog';
import { useWithdrawDialog } from './useWithdrawDialog';
import Big from 'big.js';

export interface TotalDepositSectionProps {
  className?: string;
  coin?: string,
}

export function TotalDepositSection({ className }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { uUST, uaUST } = useBalances();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { totalDeposit } = useMemo(() => {
    return {
        // @ts-ignore
      totalDeposit: computeTotalDeposit(uaUST, {}),
    };
  }, [uaUST]);
  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
       <Typography style={{fontSize:"25px", fontWeight:"bolder"}}> 
          TOTAL DEPOSIT{' '}
          <InfoTooltip style={{}}>
            Total amount of UST deposited and interest earned by the user
          </InfoTooltip>
       </Typography> 

      <div className="amount">
        <AnimateNumber format={formatUSTWithPostfixUnits}>
          {demicrofy(totalDeposit)}
        </AnimateNumber>{' '}
        <span className="denom">UST</span>
        {totalDeposit.gt(MILLION * MICRO) && (
          <SubAmount style={{ fontSize: '16px' }}>
            <AnimateNumber format={formatUST}>
              {demicrofy(totalDeposit)}
            </AnimateNumber>{' '}
            UST
          </SubAmount>
        )}
      </div>

    </Section>
  );
}


export function DepositButtons({ className, coin }: TotalDepositSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { uUST, uaUST } = useBalances();

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog(coin);

  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog();

  const openDeposit = useCallback(async () => {
    await openDepositDialog();
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog();
  }, [openWithdrawDialog]);
 

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (<>
        <ActionButton
          className="sizeButton"
          disabled={!connected || Big(uUST).lte(0)}
          onClick={openDeposit}
        >
          Deposit
        </ActionButton>
        <BorderButton
          className="sizeButton"
          disabled={!connected || Big(uaUST).lte(0)}
          onClick={openWithdraw}
        >
          Withdraw
        </BorderButton>

      {depositDialogElement}
      {withdrawDialogElement}
</>  );
}

