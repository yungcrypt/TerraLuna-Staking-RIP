import {
  formatANCWithPostfixUnits,
  formatUST,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC, UST } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { AnimateNumber } from '@libs/ui';
import {Typography} from '@material-ui/core';
import { Sub } from 'components/Sub';
import { useAccount } from 'contexts/account';
import { fixHMR } from 'fix-hmr';
import { useRewards } from 'pages/mypage/logics/useRewards';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface TotalClaimableRewardsProps {
  className?: string;
}

function TotalClaimableRewardsBase({ className }: TotalClaimableRewardsProps) {
  const { connected } = useAccount();

  const { totalPayedInterest, totalDaysStaked } = useRewards();
  console.log(totalDaysStaked)

  return (
    <Section className={className}>
      <header>
        <h4 style={{width:"85%"}}>
          <Typography style={{fontWeight:"bold", fontSize:"20px", margin:0, padding:0}}>
            TOTAL PAYED INTEREST{' '}
          </Typography>
        </h4>

        <p>
        
        { //@ts-ignore
          <AnimateNumber format={formatANCWithPostfixUnits}>
            {//@ts-ignore
            totalPayedInterest ? demicrofy(totalPayedInterest) : (0 as ANC<number>)
            }
          </AnimateNumber>

        }
          <Sub> UST</Sub>
        </p>
        <p>
          <AnimateNumber format={formatUSTWithPostfixUnits}>
            {totalPayedInterest
            //@ts-ignore
              ? demicrofy(totalPayedInterest)
              : (0 as UST<number>)}
          </AnimateNumber>{' '}
          $USD
        </p>
      </header>

      <div className="anc-price">
        <div style={{display:"flex", alignItems:"center"}}>
        <h5>TOTAL DAYS STAKED</h5>
            <InfoTooltip style={{}}>
              Total number of claimable ANC from UST Borrow and LP staking
            </InfoTooltip>
        </div>
        <div style={{display:"flex", alignItems:"end"}}>
        <p style={{fontSize:"35px", marginRight:"5px"}}>
            {totalDaysStaked ? totalDaysStaked : 0}
        </p>
        <p style={{marginBottom: '3px', fontWeight:"bolder", fontSize:"10"}}>
        DAYS
        </p>

        </div>
      </div>

      <div className="spacer" />

      <ActionButton
        className="claim"
        component={Link}
        to={`/earn`}
        disabled={!connected}
      >
        Stake More
      </ActionButton>
    </Section>
  );
}

export const StyledTotalClaimableRewards = styled(TotalClaimableRewardsBase)`
  .NeuSection-content {
    display: flex;
    flex-direction: column;

    height: 100%;
  }

  header {
    h4 {
      font-size: 12px;
      font-weight: 760;
      margin-bottom: 10px;
    }

    p:nth-of-type(1) {
      font-size: clamp(20px, 8vw, 32px);
      font-weight: 760;

      sub {
        font-size: 20px;
      }
    }

    p:nth-of-type(2) {
      margin-top: 7px;

      font-size: 13px;
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .anc-price {
    margin-top: 40px;

    h5 {
      font-size: 20px;
      font-weight: 760;
    }

    p {
      margin-top: 6px;

      font-size: 20px;
      font-weight: 760;

      sub {
        font-size: 13px;
      }
    }
  }

  .spacer {
    flex: 1;
    min-height: 60px;
  }

  @media (max-width: 1200px) {
    .anc-price {
      margin-top: 30px;
    }

    .spacer {
      min-height: 30px;
    }
  }
`;

export const TotalClaimableRewards = fixHMR(StyledTotalClaimableRewards);
