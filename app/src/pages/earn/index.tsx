import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { FlexTitleContainer, PageTitle } from 'components/primitives/PageTitle';
import { links, screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { BuyUstButton } from './components/BuyUstButton';
import { ExpectedInterestSection } from './components/ExpectedInterestSection';
import { InsuranceCoverageButton } from './components/InsuranceCoverageButton';
import { InterestSection } from './components/InterestSection';
import { TotalDepositSection, DepositButtons } from './components/TotalDepositSection';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { InterestSectionDash } from '../earn/components/InterestSection';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Circles } from 'components/primitives/Circles';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { AnimateNumber } from '@libs/ui';
export interface EarnProps {
  className?: string;
}

function Component({ className }: EarnProps) {
  return (
    <PaddedLayout className={className}>
      <FlexTitleContainer>
        <PageTitle title="EARN" docs={links.docs.earn} />
        <Buttons>
          <InsuranceCoverageButton />
          <BuyUstButton />
        </Buttons>
      </FlexTitleContainer>
      <section className="grid">
        <TotalDepositSection className="total-deposit" />
        <DepositUST />
        <ExpectedInterestSection className="expected-interest" />
      </section>
    </PaddedLayout>
  );
}

const DepositUST = () => {
  return (
    <>
      <Section className="deposit1">
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div
            style={{
              alignSelf: 'center',
              marginLeft: 0,
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
            }}
          >
            <div style={{ alignSelf: 'center' }}>
              <Circles backgroundColors={['#063970']}>
                <TokenIcon token="luna" />
              </Circles>
            </div>

            <Typography
              style={{
                alignSelf: 'center',
                marginRight: 0,
                marginTop: 20,
                fontWeight: 'bolder',
                fontSize:'30px',
              }}
            >
              LUNA
            </Typography>
            <div className="apy">
              <TooltipLabel
                className="name"
                title="Annual Percentage Rate"
                placement="top"
                style={{ border: 'none', margin: 15, paddingTop:'10px', paddingBottom:'10px', paddingLeft:'32px', paddingRight:'32px' }}
              >
                APR
              </TooltipLabel>
              <div className="value" style={{ margin: 15 }}>
                14.8%
              </div>
            </div>
            <Divider sx={{ borderBottomWidth: 5, width: '400' }} style={{height:"3px"}}/>
            <div style={{ alignSelf: 'center' }}>
            <DepositButtons/>
            </div>
          </div>
        </div>
      </Section>
      <Section className="deposit2">
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div
            style={{
              alignSelf: 'center',
              marginLeft: 0,
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
            }}
          >
            <div style={{ alignSelf: 'center' }}>
              <Circles backgroundColors={['#063970']}>
                <TokenIcon token="ust" />
              </Circles>
            </div>

            <Typography
              style={{
                alignSelf: 'center',
                marginRight: 0,
                marginTop: 20,
                fontWeight: 'bolder',
                fontSize:'30px',
              }}
            >
              UST
            </Typography>
            <br/>
            <div className="apy">
              <TooltipLabel
                className="name"
                title="Annual Percentage Rate"
                placement="top"
                style={{ border: 'none', margin: 15, paddingTop:'10px', paddingBottom:'10px', paddingLeft:'32px', paddingRight:'32px' }}
              >
                APR
              </TooltipLabel>
              <div className="value" style={{ margin: 15 }}>
                14.8%
              </div>
            </div>
            <Divider sx={{ borderBottomWidth: 5, width: '400' }} style={{height:"3px"}}/>
            <div style={{ alignSelf: 'center' }}>
            <DepositButtons/>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

const Buttons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 700px) {
    width: 100%;
    gap: 0;
    justify-content: stretch;
    flex-direction: column;
  }
`;

const StyledComponent = styled(Component)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  h2 {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.3px;
    color: ${({ theme }) => theme.textColor};
  }

  hr {
    margin: 30px 0;
  }
  Button {
    border:none;
  }
  ul li {
    div {
    border:none;
    }
  }
  .deposit1 {
    Button {
      height:50px;
      width:230px;
      margin:10px;
      border:none;
    }
  }
  .deposit2 {
    Button {
      height:50px;
      width:230px;
      margin:10px;
      border:none;
    }
  }

  .decimal-point {
    color: ${({ theme }) => theme.dimTextColor};
  }

  .deposit1{
   .NeuSection-content {
        display:flex
        flex-direction: column
        padding-top:60px;
        padding-bottom:60px;
        padding-left:20px;
        padding-right:20px;
  }
  }
  .deposit2{
   .NeuSection-content {
        display:flex
        flex-direction: column
        padding-top:60px;
        padding-bottom:60px;
        padding-left:20px;
        padding-right:20px;
  }
  }
  .apy{
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
  }
  .total-deposit {
    .amount {
      font-size: 32px;
      font-weight: 500;
      letter-spacing: -0.3px;
      color: ${({ theme }) => theme.textColor};

      .denom {
        font-size: 18px;
      }
    }

    .total-deposit-buttons {
      margin-top: 64px;
    }
  }

  .interest {
    .apy {
      text-align: center;
      

      .name {
        margin-bottom: 5px;
      }

      .value {
        font-size: 50px;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.primary};
        margin-bottom: 50px;
      }

      figure {
        width: 50%;
        height: 300px;
      }
    }
  }

  .expected-interest {
    .amount {
      font-size: 32px;
      font-weight: 500;
      letter-spacing: -0.3px;
      color: ${({ theme }) => theme.textColor};

      .denom {
        font-size: 18px;
      }
    }

    .tab {
      margin-top: 64px;
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .total-deposit {
    h2 {
      margin-bottom: 15px;
    }

    .total-deposit-buttons {
      display: grid;
      grid-template-columns: repeat(2, 142px);
      justify-content: end;
      grid-gap: 20px;
    }
  }

  .interest {
    h2 {
      margin-bottom: 10px;
    }
  }

  .expected-interest {
    h2 {
      margin-bottom: 15px;
    }
  }

  // pc
  @media (min-width: ${screen.monitor.min}px) {
    .grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-auto-rows: minmax(400px, auto);
      grid-template-areas:
        'hd hd hd hd   hd   hd   hd   hd'
        'sd sd sd sd  main  main main main'
        'ft ft ft ft ft ft ft ft';
      grid-gap: 60px;
      margin-bottom: 40px;
      .deposit1{
        grid-area:sd;
    
      }
      .deposit2{
        grid-area:main;
      }
      .NeuSection-root {
        margin: 0;
      }

      .total-deposit {
      grid-area:hd;
      }

      .interest {
        grid-column: 3;
        grid-row: 3/3;
      }

      .expected-interest {
        grid-area:ft;
      }
    }

    .interest {
      .NeuSection-content {
        padding: 60px 40px;
      }
    }
  }

  // under pc
  @media (max-width: ${screen.pc.max}px) {
    .interest {
      .apy {
        figure {
          height: 180px;
        }
      }
    }

    .expected-interest {
      height: unset;
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .decimal-point {
      display: none;
    }

    .total-deposit {
      h2 {
        margin-bottom: 10px;
      }

      .amount {
        font-size: 40px;
      }

      .total-deposit-buttons {
        margin-top: 30px;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 15px;
      }
    }

    .interest {
      .apy {
        figure {
          height: 150px;
        }
      }
    }

    .expected-interest {
      h2 {
        margin-bottom: 10px;
      }

      .amount {
        font-size: 40px;
      }

      .tab {
        margin-top: 30px;
      }
    }
  }
`;

export const Earn = fixHMR(StyledComponent);
