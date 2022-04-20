import React, {useCallback, useMemo} from 'react';
import {computeTotalDeposit} from '@anchor-protocol/app-fns';
import {useEarnEpochStatesQuery} from '@anchor-protocol/app-provider';
import {
    formatUST,
    formatUSTWithPostfixUnits,
    MILLION,
} from '@anchor-protocol/notation';
import {demicrofy, MICRO} from '@libs/formatter';
import {ActionButton} from '@libs/neumorphism-ui/components/ActionButton';
import {BorderButton} from '@libs/neumorphism-ui/components/BorderButton';
import {IconSpan} from '@libs/neumorphism-ui/components/IconSpan';
import {InfoTooltip} from '@libs/neumorphism-ui/components/InfoTooltip';
import {Typography} from '@material-ui/core'
import {Section} from '@libs/neumorphism-ui/components/Section';
import {AnimateNumber} from '@libs/ui';
import {SubAmount} from 'components/primitives/SubAmount';
import {useAccount} from 'contexts/account';
import {useBalances} from 'contexts/balances';
import {useDepositDialog, useDepositDialogUpdate} from './useDepositDialog';
import {useWithdrawDialog} from './useWithdrawDialog';
import {useRewards} from '../../mypage/logics/useRewards';
import {sum} from '@libs/big-math';
import {u, UST} from '@anchor-protocol/types';
import big from 'big.js';
import Big from 'big.js';
import { useTvl } from '@anchor-protocol/app-provider';
import { MyTool } from '@libs/neumorphism-ui/components/InfoTooltip';
export interface TotalDepositSectionProps {
    className?: string;
    coin?: string,
    coinName?: string;
}


export function TotalDepositSection({className}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // queries
    // ---------------------------------------------
  const {xyzLunaAsUST, xyzUST} = useRewards();
    // ---------------------------------------------
    // computes
    // ---------------------------------------------
  const {totalDeposit} = useMemo(() => {
        const totalValue = sum(
            big(0).plus(xyzLunaAsUST).plus(xyzUST),
        ) as u<UST<Big>>;
        return {
            // @ts-ignore
            totalDeposit: totalValue,
        };
    }, [xyzLunaAsUST, xyzUST]);
 
    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (
        <Section className={className}>
        <div>
            <Typography style={{fontSize: "20px", fontWeight:860}}>
                TOTAL BALANCE{' '}
                <InfoTooltip className={'info'} style={{verticalAlign: '-webkit-baseline-middle', fontSize:'18px', marginLeft:'3px'}}>
                Total value of your UST/Luna deposits including earnings calculated in UST
                </InfoTooltip>
            </Typography>

            <div className="amount" style={{fontWeight:860, fontSize:'35px'}}>
                <AnimateNumber format={formatUST}>
                    {totalDeposit.div(10000000).toFixed(2).toString()}
                </AnimateNumber>{' '}
                <span style={{fontSize:'20px'}}>UST</span>
        </div>
            </div>
                <DepositButtonsTD coin={'uluna'} style={{width:"425px"}}/>

        </Section>
    );
}

export function DepositButtonsTD({className, coin}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // dependencies
    // ---------------------------------------------
    const {connected} = useAccount();

    // ---------------------------------------------
    // queries
    // ---------------------------------------------
    let nativeBalance;
    let stakedBalance;
    switch (coin) {
        case "uluna":
            const {uNative, uxyzLuna} = useBalances();
            nativeBalance = uNative;
            stakedBalance = uxyzLuna;
            break;
        case "uusd":
            const {uUST, uxyzUST} = useBalances();
            nativeBalance = uUST;
            stakedBalance = uxyzUST;
            break;
    }

    // ---------------------------------------------
    // dialogs
    // ---------------------------------------------
    const [openDepositDialog, depositDialogElement] = useDepositDialog(coin);

    const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog(coin);

    const openDeposit = useCallback(async () => {
        await openDepositDialog();
    }, [openDepositDialog]);

    const openWithdraw = useCallback(async () => {
        await openWithdrawDialog();
    }, [openWithdrawDialog]);


    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (<div style={{display: "flex", justifyContent: "end", marginBottom:"5px" }}>   
        <div>
        <ActionButton
            className="sizeButton"
            disabled={!connected }
            onClick={openDeposit}
            style={{width:'200px', height: '45px', marginRight:'12px'}}
        >
            Deposit
        </ActionButton>
        <BorderButton
            className="sizeButton border"
            disabled={!connected }
            onClick={openWithdraw}
            style={{width:'200px', height: '45px', marginLeft:'12px'}}
        >
            Withdraw
        </BorderButton>
        </div>

        {depositDialogElement}
        {withdrawDialogElement}
    </div>);
} 


export function DepositButtons({className, coin}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // dependencies
    // ---------------------------------------------
    const {connected} = useAccount();

    // ---------------------------------------------
    // queries
    // ---------------------------------------------
    let nativeBalance;
    let stakedBalance;
    switch (coin) {
        case "uluna":
            const {uNative, uxyzLuna} = useBalances();
            nativeBalance = uNative;
            stakedBalance = uxyzLuna;
            break;
        case "uusd":
            const {uUST, uxyzUST} = useBalances();
            nativeBalance = uUST;
            stakedBalance = uxyzUST;
            break;
    }

    // ---------------------------------------------
    // dialogs
    // ---------------------------------------------
    const [openDepositDialog, depositDialogElement] = useDepositDialog(coin);

    const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog(coin);

    const openDeposit = useCallback(async () => {
        await openDepositDialog();
    }, [openDepositDialog]);

    const openWithdraw = useCallback(async () => {
        await openWithdrawDialog();
    }, [openWithdrawDialog]);


    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (<div style={{display: "flex", justifyContent: "center"}}>
        <ActionButton
            className="sizeButton"
            disabled={!connected || Big(nativeBalance).lte(0)}
            onClick={openDeposit}
        >
            Deposit
        </ActionButton>
        <BorderButton
            className="sizeButton border"
            disabled={!connected || Big(stakedBalance).lte(0)}
            onClick={openWithdraw}
        >
            Withdraw
        </BorderButton>

        {depositDialogElement}
        {withdrawDialogElement}
    </div>);
} 



export function UpdateBalanceButton({className, coin}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // dependencies
    // ---------------------------------------------
    const {connected} = useAccount();
    const updateStyles = {
      maxWidth:"140px",
      fontSize:'13px',
      height:'20px',
      width: '150px',
      padding:'2px',
      fontWeight:500,
    }

    // ---------------------------------------------
    // queries
    // ---------------------------------------------
    let nativeBalance;
    let stakedBalance;
    switch (coin) {
        case "uluna":
            const {uNative, uxyzLuna} = useBalances();
            nativeBalance = uNative;
            stakedBalance = uxyzLuna;
            break;
        case "uusd":
            const {uUST, uxyzUST} = useBalances();
            nativeBalance = uUST;
            stakedBalance = uxyzUST;
            break;
    }

    // ---------------------------------------------
    // dialogs
    // ---------------------------------------------
    const [openDepositDialogUpdate, depositDialogElement] = useDepositDialogUpdate(coin);


    const openDeposit = useCallback(async () => {
        await openDepositDialogUpdate();
    }, [openDepositDialogUpdate]);


    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (<div style={{display: "flex", justifyContent: "center"}}>
        <BorderButton
            className="sizeButton"
            disabled={!connected || Big(nativeBalance).lte(0)}
            onClick={openDeposit}
            style={updateStyles}
        >
            Update Balance
            
        </BorderButton>

        {depositDialogElement}
    </div>);
} 

export function StakeButton({className, coin, coinName}: TotalDepositSectionProps) {
    // ---------------------------------------------
    // dependencies
    // ---------------------------------------------
    const stakeStyles = {
      maxWidth:"357px",
      width: '90%',
      padding:'21px',
      fontWeight:720,
    }
    const {connected} = useAccount();

    // ---------------------------------------------
    // queries
    // ---------------------------------------------
    let nativeBalance;
    let stakedBalance;
    switch (coin) {
        case "uluna":
            const {uNative, uxyzLuna} = useBalances();
            nativeBalance = uNative;
            stakedBalance = uxyzLuna;
            break;
        case "uusd":
            const {uUST, uxyzUST} = useBalances();
            nativeBalance = uUST;
            stakedBalance = uxyzUST;
            break;
    }

    // ---------------------------------------------
    // dialogs
    // ---------------------------------------------
    const [openDepositDialog, depositDialogElement] = useDepositDialog(coin);


    const openDeposit = useCallback(async () => {
        await openDepositDialog();
    }, [openDepositDialog]);


    // ---------------------------------------------
    // presentation
    // ---------------------------------------------
    return (<div style={{display: "flex", justifyContent: "center"}}>
        <ActionButton
            className="sizeButton"
            disabled={!connected || Big(nativeBalance).lte(0)}
            onClick={openDeposit}
            style={stakeStyles}
        >
            Deposit {coinName}
        </ActionButton>

        {depositDialogElement}
    </div>);
} 
