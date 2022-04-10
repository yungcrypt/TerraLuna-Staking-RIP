import {
  formatUST,
  formatUTokenInteger,
  formatUTokenIntegerWithoutPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Rate, u, UST } from '@anchor-protocol/types';
import {
  useTvl,
} from '@anchor-protocol/app-provider';
import { formatRate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Section } from '@libs/neumorphism-ui/components/Section';
import {
  horizontalRuler,
  pressed,
  verticalRuler,
} from '@libs/styled-neumorphism';
import { AnimateNumber } from '@libs/ui';
import big, { Big } from 'big.js';
import { Footer } from 'components/Footer';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React, { useEffect, useMemo, useState } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { ANCPriceChart, NewChart } from './components/ANCPriceChart';
import { TotalValueLockedDoughnutChart } from './components/TotalValueLockedDoughnutChart';
import { ArrowDropUp } from '@material-ui/icons';
import { Divider } from '@material-ui/core';
import { InterestSectionDash } from '../earn/components/InterestSection';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { Circles } from 'components/primitives/Circles';
import { Link } from 'react-router-dom';
import { Typography, Input, Slider, Theme } from '@material-ui/core';
import { withStyles, makeStyles, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useAccount } from 'contexts/account';
import { useTvlHistory } from './logics/useTvlHistory';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);


function ThumbComponent(props: any) {
  return (
    <span {...props}>
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </span>
  );
}

const CoolSlider = withStyles({
  root: {
    color: '#F9D85E',
    height: 3,
    padding: '0',
    marginLeft: 5,
    marginTop: '-30px',
    marginBottom: '20px',
  },
  thumb: {
    'height': 20,
    'width': 20,
    'backgroundColor': '#fff',
    'border': '1px solid currentColor',
    'marginTop': -10,
    'marginLeft': -13,
    'boxShadow': '#ebebeb 0 2px 2px',
    '&:focus, &:hover, &$active': {
      boxShadow: '#ccc 0 2px 3px 1px',
    },
    '& .bar': {
      // display: inline-block !important;
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  active: {},
  track: {
    height: 3,
    marginLeft:'-5px',
  },
  rail: {
    color: '#d8d8d8',
    opacity: 1,
    height: 3,
    marginLeft:'-5px',
  },
})(Slider);

const CoolInput = styled(Input)`
    width: 254px;
`;

const EarningCalc = () => {

    const ControlledOpenSelect = () => {
      const classes = useStyles();
      const [age, setAge] = React.useState<string | number>('');
      const [open, setOpen] = React.useState(false);

      const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setChoice(event.target.value);
        
        console.log(choice)
      };

      const handleClose = () => {
        setOpen(false);
      };

      const handleOpen = () => {
        setOpen(true);
      };

      return (
        <div>
          <FormControl
            className={classes.formControl}
            style={{ width: '100%', marginRight: 35, marginLeft:0 }} >
            <Select
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={choice}
              onChange={handleChange}
              defaultValue={0.000509863}
            >
              <MenuItem value={0.000509863}>Luna</MenuItem>
              <MenuItem value={0.000955342}>UST</MenuItem>
            </Select>
          </FormControl>
        </div>
      );
    }

  const theme = useTheme();

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [amount, setAmount] = useState<any>(1000);
  const [rate, setRate] = useState<any>();
  const [years, setYears] = useState<number>(1);
  const [choice, setChoice] = useState<any>();
  const [interestEarnedResult, setInterestEarnedResult] = useState<any>();
  const [amountEarnedResult, setAmountEarnedResult] = useState<any>();



  const onChangeSlider =  (e: any) => {
        const days = Number(e.target.ariaValueNow)
        const start = amount;
        var runningTotal = amount; 
        var i = 0;
        while (i <= days) {
            runningTotal += ( runningTotal * Number(choice))
            i++
        }
            
        setAmountEarnedResult(runningTotal.toFixed(2))
        setInterestEarnedResult((runningTotal - start).toFixed(2))
        setYears((days / 365))
            
        }




  const onChangeInput = (e: any) => {
       console.log(e.target.value)
       setAmount(Number(e.target.value)) 
  }
  return (
    <Section className="stablecoin">
      <Typography
        style={{
          fontSize: '20px',
          fontFamily: 'SF Pro Display',
          letterSpacing: '1.1px',
          fontWeight: '740',
        }}
      >
        HOW MUCH CAN I EARN??
      </Typography>

      <div className="NeuSection-content2">
        <div className="input-formatter">
          <div className="fields-input">
            <div className="fields-deposit">
              <ControlledOpenSelect />
              <h2 className="deposit-text">Your Deposit</h2>
            </div>
            <div className="fields-amount">
              <CoolInput onChange={onChangeInput}></CoolInput>
              <h2 className="amount-text">Amount in {choice}</h2>
            </div>
            <div className="fields-slider">
              <Typography
                style={{
                  fontWeight: 700,
                  fontSize: 23,
                  fontFamily: 'SF Pro Display !important',
                }}
                className="earn-years"
              >
                {years} Years
              </Typography>
              <CoolSlider
                ThumbComponent={ThumbComponent}
                size="small"
                aria-label="Small"
                valueLabelDisplay="auto"
                step={365}
                marks
                min={365}
                max={3650}
                
                onChange={onChangeSlider}
                className="earn-slider"
              />
            </div>
          </div>
        </div>

        <Divider
          orientation="vertical"
          flexItem
          style={{
            width: '2px',
            height: '344px',
            marginRight: '40px',
            marginLeft: '40px',
          }}
          className="earn-divider"
        />
        <div className="bottom-wrap">
          <div className="bottom-total">
            <header style={{ alignSelf: 'start' }}>
              <p className="amount">
                  {interestEarnedResult}
                <span>UST</span>
              </p>
              <h2>Interest Earned</h2>
              <div />
            </header>
            <header style={{ alignSelf: 'start', fontWeight: '740' }}>
              <div>
                <p className="amount">
                  {amountEarnedResult}
                  <span>UST</span>
                </p>
                <h2>Total</h2>
              </div>
              <div />
            </header>
            <header>
              <h2>
                <i style={{ backgroundColor: theme.colors.secondary }} /> TT
                Market
              </h2>
              <h2>
                <i style={{ backgroundColor: 'black' }} /> Traditional Market
              </h2>
            </header>
          </div>
          <div style={{ alignSelf: 'end', width: '100%', height: '400px' }}>
          </div>
        </div>
      </div>
    </Section>
  );
};
export interface DashboardProps {
  className?: string;
}

const StakeYours = () => {
  const theme = useTheme();
  return (
    <>
      <Section className="staking1">
        <div
          style={{
            alignSelf: 'left',
            margin: '10px',
            display: 'inline-flex',
          }}
        >
          <TokenIcon token="ust" style={{ height: '75px', width: '75px' }} />
          <div style={{ marginLeft: '15px' }}>
            <Typography style={{ fontSize: '30px', fontWeight: '760' }}>
              <div style={{ width: '200px', marginBottom: '-8px' }}>UST</div>
            </Typography>
            <div>
              <div style={{ width: '200px', display: 'inline-flex' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '800' }}>
                  INTEREST
                </h2>
                <div
                  style={{
                    alignSelf: 'start',
                    marginTop: '-2px',
                    marginLeft: '5px',
                  }}
                >
                  <InfoTooltip
                    style={{ width: '12px', color: theme.dimTextColor,  fontWeight: 700, fontFamily: 'SF Pro Display' }}
                  >
                  <Typography 
                    style={{color: theme.dimTextColor,  fontWeight: 800, fontFamily: 'SF Pro Display' }}
                  >
                    Current annualized deposit rate
                  </Typography>
                  </InfoTooltip>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <div className="staking-apy" style={{ alignSelf: 'left' }}>
          <InterestSectionDash className="interest" />
        </div>
        <div className="staking-buttons" style={{ margin: 'auto' }}>
          <StyledStakeNow component={Link} to={`/earn`}>
            STAKE YOUR UST NOW!
          </StyledStakeNow>
        </div>
      </Section>

      <Section className="staking2">
        <div
          style={{
            alignSelf: 'left',
            margin: '10px',
            display: 'inline-flex',
          }}
        >
          <Circles backgroundColors={['#2C2C2C']}>
            <TokenIcon token="luna" style={{ height: '1.1em', width: '' }} />
          </Circles>
          <div style={{ marginLeft: '15px' }}>
            <Typography style={{ fontSize: '30px', fontWeight: '760' }}>
              <div style={{ width: '200px', marginBottom: '-8px' }}>LUNA</div>
            </Typography>
            <div>
              <div style={{ width: '200px', display: 'inline-flex' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '800' }}>
                  INTEREST
                </h2>
                <div
                  style={{
                    alignSelf: 'start',
                    marginTop: '-2px',
                    marginLeft: '5px',
                  }}
                >
                  <InfoTooltip style={{width:'12px'}}>
                  <Typography 
                    style={{color: theme.dimTextColor,  fontWeight: 800, fontFamily: 'SF Pro Display' }}
                  >
                    Current annualized deposit rate
                  </Typography>
                  </InfoTooltip>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <div className="staking-apy" style={{ alignSelf: 'left' }}>
          <InterestSectionDash className="interest" />
        </div>
        <div className="staking-buttons" style={{ margin: 'auto' }}>
          <StyledStakeNow component={Link} to={`/earn`}>
            STAKE YOUR LUNA NOW!
          </StyledStakeNow>
        </div>
      </Section>
    </>
  );
};

const EMPTY_ARRAY: any[] = [];

function DashboardBase({ className }: DashboardProps) {
  const theme = useTheme();
  const { lunaTvlAsUST, ustTvl, totalTvlAsUST } = useTvl();
  console.log('asdfasdfasdf', totalTvlAsUST);
  const {connected} = useAccount();
//  const tvlHistory = useTvlHistory();

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    function handler() {
      setIsMobile(window.innerWidth < 500);
    }

    window.addEventListener('resize', handler);
    handler();

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  const totalValueLocked = {
    totalValueLocked: Number(totalTvlAsUST).toFixed(2),
    totalCollaterals: Number(ustTvl).toFixed(2),
    totalDeposit: Number(totalTvlAsUST).toFixed(2),
  };
  return (
    <div className={className}>
      <main>
        <div className="content-layout">
          <TitleContainerAndExchangeRate>
            <PageTitle title="DASHBOARD" />
          </TitleContainerAndExchangeRate>

          <div className="summary-section">
            <Section className="total-value-locked" style={{ gridArea: 'hd' }}>
              <div
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <section className="donutChartSecion">
                  <div className="tvlTitle">
                    <Typography
                      style={{
                        fontSize: '20px',
                        fontWeight: '740',
                        fontFamily: 'SF Pro Display',
                        fontStyle: 'normal',
                      }}
                    >
                      TOTAL VALUE LOCKED
                    </Typography>
                    <div className="percents" style={{ marginTop: '-5px' }}>
                      <p className="amount">
                        {totalValueLocked
                          ? totalValueLocked.totalValueLocked
                          : (0 as u<UST<number>>)}
                        <span style={{ fontWeight: '760' }}>UST</span>
                      </p>

                      <div
                        style={{
                          marginTop: '23px',
                          marginLeft: '-5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <ArrowDropUp
                          style={{ color: '#00B929', fontSize: '40px' }}
                        />
                        <div
                          style={{
                            color: '#00B929',
                            fontSize: '14px',
                            marginLeft: '-6px',
                          }}
                        >
                          2%
                        </div>
                      </div>
                    </div>
                  </div>
                  <figure className="tvlBottom">
                    <div className="chart">
                      <TotalValueLockedDoughnutChart
                        totalDeposit={'0' as u<UST>}
                        totalCollaterals={'0' as u<UST>}
                        totalDepositColor={theme.colors.secondary}
                        totalCollateralsColor={theme.textColor}
                      />
                    </div>
                    <div className="tvl-balances">
                      <h3>
                        <i
                          style={{ backgroundColor: theme.colors.secondary }}
                        />{' '}
                        LUNA
                      </h3>
                      <div
                        className="tvl-money"
                        style={{ display: 'inline-flex' }}
                      >
                        <p style={{ marginRight: '4px' }}>$ </p>
                        <p style={{ fontStyle: 'italic' }}>
                          {totalValueLocked
                            ? totalValueLocked.totalDeposit
                            : (0 as u<UST<number>>)}
                        </p>
                      </div>
                      <h3>
                        <i style={{ backgroundColor: '#000000' }} /> UST
                      </h3>
                      <div
                        className="tvl-money"
                        style={{ display: 'inline-flex' }}
                      >
                        <p style={{ marginRight: '4px' }}>$ </p>
                        <p style={{ fontStyle: 'italic' }}>
                          {totalValueLocked
                            ? totalValueLocked.totalCollaterals
                            : (0 as u<UST<number>>)}
                        </p>
                      </div>
                    </div>
                  </figure>
                </section>
              </div>
              <Divider
                orientation="vertical"
                flexItem
                style={{
                  width: '2px',
                  height: '300px',
                  marginRight: '50px',
                  marginLeft: '50px',
                  marginTop: '25px',
                  marginBottom: '25px',
                  borderLeft: 'none',
                  alignSelf: 'center',
                }}
                className="topDiv new-chart"
              />
            { 
              //  <NewChart tvlHistory={tvlHistory}/>
           }
            </Section>
            <StakeYours />
            <EarningCalc />
          </div>
        </div>

        <Footer style={{ margin: '60px 0' }} />
      </main>
    </div>
  );
}

const TitleContainerAndExchangeRate = styled(TitleContainer)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  > :nth-child(2) {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.03em;

    small {
      font-size: 0.8em;
    }

    img {
      transform: scale(1.2) translateY(0.1em);
    }
  }

  @media (max-width: 700px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    > :nth-child(2) {
      font-size: 18px;
    }
  }
`;

const hHeavyRuler = css`
  padding: 0;
  margin: 0;

  border: 0;

  height: 5px;
  border-radius: 3px;

  ${({ theme }) =>
    pressed({
      color: theme.sectionBackgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};
`;

const hRuler = css`
  ${({ theme }) =>
    horizontalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const vRuler = css`
  ${({ theme }) =>
    verticalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const StyledStakeNow = styled(BorderButton)`
  @media (max-width: 1200px) {
    width: 90%;
  }
  width: 400px;
  padding: 21px;
  border-radius: 25px;
  background: #493b3b;
  font-weight: 720;
  letter-spacing: 0.03em;
  margin-top: 27px;
`;
const StyledDashboard = styled(DashboardBase)`
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
      div.tvl-balances {
        align-self: center;
      }
  .tvl-money {
    p {
        color: #ffffff;
        margin-bottom:0px;
    }
  }
  h2 {
    font-size: 13px;
    font-weight: 500;
    color:${({ theme }) => theme.dimTextColor};
    margin-bottom: 8px;
    span {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 22px;
      margin-left: 10px;
      background-color: ${({ theme }) => theme.colors.positive};
      color: ${({ theme }) => theme.highlightBackgroundColor};

      &[data-negative='true'] {
        background-color: ${({ theme }) => theme.colors.negative};
      }
    }
  }
    .apy {
      figure {
        width:90%;
      }
    }  
    h3 {
      font-size: 20px;
      font-weight: 760;
      color: ${({ theme }) => theme.textColor};
    }
    .airbnb-bar: {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    }
    .input-formatter {
        margin: auto;
    }
    .fields-input {
    
      .fields-deposit {
        margin-top: 10px;
        margin-bottom: 10px;
        .deposit-text {
            font-weight: 700;
            font-size: 9px;
            
        }
      }
      .fields-amount {
        margin-top: 10px;
        margin-bottom: 10px;
        .amount-text {
            margin-top: 5px;
            font-weight: 700;
            font-size: 9px;
        }
      }
      .fields-slider {
        .earn-years {
          margin-bottom:12px;
        }
        margin-top: 10px;
        margin-bottom: 10px;

      }
      width: 254px;
      display: flex;
      flex-direction:column;
    }
  .NeuSection-content {
        padding: 50px;
      }
  .bottom-wrap {
      width: 100%;
      display: flex;
      margin:0;
      width: -webkit-fill-available;
    }
  .bottom-total {
      display: flex;
      flex-direction: column;
      justify-content:center;
      align-items:space-around;
    }
  .amount {
      font-size: 35px;
      font-weight: 740;

      span:last-child {
      margin-left: 8px;
      font-size: 0.555555555555556em;
      } 
  }
  .percents {
    display: inline-flex;
    align-items:center;
    
  }
  .tvlBottom {
        display: flex;
        align-items: start;
  }

  .staking1 {
        height:623px;
    .NeuSection-content {
      height:"100%";
      display: flex !important;
      flex-direction: column;
      justify-content: center !important;
      align-items: left;
      padding:40px;
    }
    }
  .staking2 {
        height:623px;
    .NeuSection-content {
      height:"100%";
      display: flex !important;
      flex-direction: column;
      justify-content: center !important;
      align-items: left;
      padding:40px;
    }
  }
  .total-value-locked {

    .NeuSection-content {
      height:434px;
        .topDiv {
            box-shadow:none;
        }
          width:100%;
          display: flex !important;
          align-items: center;
          justify-content: space-between;
        }
    Section {
    }
    figure {
      > .chart {
        width:100%;
        margin-right:35px;
        margin-left:15px;
      }

      > div {
        h3 {
          display: flex;
          align-items: center;

          i {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 3px;
            margin-right: 3px;
          }

          margin-bottom: 8px;
        }

        p {
          font-size: 14px;

          &:nth-of-type(1) {
            margin-bottom: 10px;
          }
        }
      }
    }
  }

  .anc-price {
    header {
      display: flex;
      align-items: center;

      > div:first-child {
        flex: 1;
      }

      > div:not(:first-child) {
        h3 {
          margin-bottom: 10px;
        }

        p {
          font-size: 18px;

          span:last-child {
            margin-left: 5px;
            font-size: 12px;
          }
        }

        &:last-child {
          margin-left: 30px;
        }
      }

      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .anc-buyback > .NeuSection-content {
    display: flex;
    justify-content: space-between;

    max-width: 1000px;

    padding: 40px 60px;


    section {
      div {
        display: flex;

        p {
          display: inline-block;

          font-size: 27px;
          font-weight: 500;

          word-break: keep-all;
          white-space: nowrap;

          span {
            font-size: 0.666666666666667em;
            margin-left: 5px;
            color: ${({ theme }) => theme.dimTextColor};
          }

          &:first-child {
            margin-right: 20px;
          }
        }
      }
    }
  }
  .stablecoin {
  .NeuSection-root {
    height:454px;
  }
  .NeuSection-content2 {
        display:inline-flex;
        width:100%;
        height:100%;
  }
    header {
      h2 {
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 3px;
          margin-right: 3px;
          transform: translateY(1px);
        }
      }

      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .collaterals {
    header {
      margin-bottom: 15px;
    }

    figure {
      > div {
        width: 100%;
        height: 220px;
      }
    }
  }

  .stablecoin-market,
  .basset-market {
    margin-top: 40px;

    table {
      thead {
        th {
          text-align: right;

          &:first-child {
            font-weight: bold;
            color: ${({ theme }) => theme.textColor};
            text-align: left;
          }
        }
      }

      tbody {
        td {
          text-align: right;

          .value,
          .coin {
            font-size: 16px;
          }

          .volatility,
          .name {
            font-size: 13px;
            color: ${({ theme }) => theme.dimTextColor};
          }

          &:first-child > div {
            text-decoration: none;
            color: currentColor;

            text-align: left;

            display: flex;

            align-items: center;

            i {
              width: 60px;
              height: 60px;

              margin-right: 15px;

              svg,
              img {
                display: block;
                width: 60px;
                height: 60px;
              }
            }

            .coin {
              font-weight: bold;

              grid-column: 2;
              grid-row: 1/2;
            }

            .name {
              grid-column: 2;
              grid-row: 2;
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  main {
    .content-layout {
      max-width: 1322px;
      width: fit-content;
      margin: auto;
      padding: 10px 30px 30px 30px;
    }
  }

    .tvlBottom {
        align-self:start;
        margin-left:-10px;
    }
      .tvlTitle {
        align-self: baseline;
        margin-bottom: 30px;
      }

  // pc
      padding: 50px 20px 20px 20px;

    .NeuSection-root { margin:20px;}

  // align section contents to origin
  @media (min-width: 1001px) {
    .summary-section {
      padding:20px 20px 20px 20px;
      max-width: 1220px;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-auto-rows: minmax(434px, auto);
      grid-template-areas:
        'hd hd hd hd   hd   hd   hd   hd'
        'sd sd sd sd  main  main main main'
        'ft ft ft ft ft ft ft ft';
      grid-gap: 60px;
      margin-bottom: 40px;
      width: fit-content;
      margin: 0;
      .donutChartSecion {

        display: flex;
        flex-direction: column;
        margin-bottom:35px;
      }
      .NeuSection-root {
        margin-bottom: 0;
        width: 100%;
      }
      .NeuSection-content {
        width: 100%;
      }
    .fields-input {
      h2 {
        margin-top: 0px;
      }
    }

      .stablecoin {
        grid-area: ft;
        header {
          h2 {
            i {
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 3px;
              margin-right: 3px;
              transform: translateY(1px);
            }
          }

          margin-bottom: 15px;
        }

        figure {
          > div {
            width: 100%;
            height: 220px;
          }
        }
      }

      .collaterals {
        header {
          margin-bottom: 15px;
        }

        figure {
          > div {
            width: 100%;
            height: 220px;
          }
        }
      }

      .stablecoin-market,
      .basset-market {
        margin-top: 40px;

        table {
          thead {
            th {
              text-align: right;

              &:first-child {
                font-weight: bold;
                color: ${({ theme }) => theme.textColor};
                text-align: left;
              }
            }
          }

          tbody {
            td {
              text-align: right;

              .value,
              .coin {
                font-size: 16px;
              }

              .volatility,
              .name {
                font-size: 13px;
                color: ${({ theme }) => theme.dimTextColor};
              }

              &:first-child > div {
                text-decoration: none;
                color: currentColor;

                text-align: left;

                display: flex;

                align-items: center;

                i {
                  width: 60px;
                  height: 60px;

                  margin-right: 15px;

                  svg,
                  img {
                    display: block;
                    width: 60px;
                    height: 60px;
                  }
                }

                .coin {
                  font-weight: bold;

                  grid-column: 2;
                  grid-row: 1/2;
                }

                .name {
                  grid-column: 2;
                  grid-row: 2;
                }
              }
            }
          }
        }
      }
      .staking1 {
        grid-area: sd;
        .NeuSection-content {
          display: flex !important;
          flex-direction: column;
          justify-content: center !important;
          align-items: left;
        }
      }
      .staking2 {
        grid-area: main;
        .NeuSection-content {
          display: flex !important;
          flex-direction: column;
          justify-content: center !important;
          align-items: left;
        }
      }

      .total-value-locked {
        NeuSection-root {
            display:inline-block;
        .NeuSection-content {
            certical-align:middle;
            margin: 0 auto;
          display: flex !important;
          align-items: center;
          justify-content: center;
          padding-left: 50px;
          padding-right: 50px;
          padding-top: 25px;
          padding-bottom: 25px;
        }
      }
      }
      .anc-price {
        grid-column: 2/4;
        grid-row: 1/5;
      }

      .anc-buyback {
        grid-column: 2/4;
        grid-row: 5/6;
      }
    }
  }

  // align section contents to horizontal
  @media (min-width: 700px) and (max-width: 1000px) {
    .NeuSection-root { 
        max-width:600px;
        }
    
    .fields-input {
      h2 {
      }
    }


        .new-chart {
            visibility: hidden;
            display:none;
        }
      .total-value-locked > .NeuSection-content {
        hr {
          ${vRuler};
          margin-left: 60px;
          margin-right: 60px;
          margin-top:40px;
          margin-bottom:40px;
          box-shadow: none;
          
        }
      }
    }

    .stablecoin {
      grid-area: ft;
      header {
        grid-template-columns: repeat(2, 1fr);

        > div:empty {
          display: none;
        }
      }
    }
  }

  // under tablet
  // align section contents to horizontal
  @media (max-width: 699px) {
    .summary-section {
    
      margin:1%;
    }
     Section {
       max-width:500px;}
    .NeuSection-root { 
        max-width:600px;
        }

        .new-chart {
            visibility: hidden;
            display:none;
        }
    h1 {
      margin-bottom: 20px;
    }

    h2 {
      span {
        padding: 3px 7px;
      }
    }

    .amount {
      font-size: 28px;
    }

    .NeuSection-root {
        margin-right:0;
      .NeuSection-content {
        padding: 30px;
        width:auto;
        margin: 0;
      }
    }

    .summary-section {
    .chart-div {
        visibility: hidden;
        display:none;
        
    }
      .total-value-locked {
        display: block;

        hr {
          ${hHeavyRuler};
          margin-top: 30px;
          margin-bottom: 30px;
        }

        figure {
          > div {
            p {
              font-size: 16px;
            }
          }
        }
      }

      .anc-price {
        header {
          display: block;

          > div:first-child {
            margin-bottom: 10px;
          }

          > div:not(:first-child) {
            display: grid;
            grid-template-columns: 160px 1fr;
            grid-template-rows: 28px;
            align-items: center;

            h3 {
              margin: 0;
            }

            p {
              font-size: 16px;

              span:last-child {
                margin-left: 5px;
                font-size: 12px;
              }
            }

            &:first-child {
              flex: 1;

              p {
                font-size: 36px;
                font-weight: 700;

                span {
                  font-size: 20px;
                }
              }
            }

            &:last-child {
              margin-left: 0;
            }
          }

          margin-bottom: 15px;
        }
      }

      .anc-buyback > .NeuSection-content {
        display: block;

        section {
          div {
            display: block;

            p {
              display: block;

              font-size: 20px;

              margin-top: 0.5em;
            }
          }
        }
      }
    }

    .stablecoin {
      header {
        display: block;

        > div:first-child {
          margin-bottom: 15px;
        }

        > div:empty {
          display: none;
        }
      }
    }

    .stablecoin-market,
    .basset-market {
      table {
        tbody {
          td {
            .value,
            .coin {
              font-size: 15px;
            }

            .volatility,
            .name {
              font-size: 12px;
            }

            &:first-child > div {
              i {
                width: 50px;
                height: 50px;

                margin-right: 10px;

                svg,
                img {
                  display: block;
                  width: 50px;
                  height: 50px;
                }
              }
            }
          }
        }
      }
    }
  }

  // under mobile
  // align section contents to vertical
  @media (max-width: ${screen.mobile.max}px) {

  main {
    .content-layout {
      margin: 1%;
    }
  }
    .summary-section {
    }
    .fields-input {
      .bottom-total {
        margin:0;
      }
      .earn-years {
        margin-top:20px;
      }
      .earn-slider {
        margin-top:30px;
      }
      h2 {
        margin:10px;
      }
    }


    .fields-input {
      width: 100% ;
    }
    
    .NeuSection-root {
      .NeuSection-content {
        height:100%;
      }
    }
    .NeuSection-content2 {
      .earn-divider {
          display:none;
          visibility:hidden;
      }
      flex-direction:column;
    }
    .apy {
      figure {
        width:90%;
        .date-tag {
          transform: translateX(-16px);
        }
      }
    }
  .tvl-balances {
    align-self: end;
  }
  .tvlBottom {
        display: flex;
        align-items: center;
        flex-direction:column;
  }
      .staking1 {
        .NeuSection-content {
          display: flex !important;
          flex-direction: column;
          justify-content: center !important;
          align-items: left;
        }
      }
      .staking2 {
        .NeuSection-content {
          display: flex !important;
          flex-direction: column;
          justify-content: center !important;
          align-items: left;

          figure {
          
          }
        }
      }
        .new-chart {
            visibility: hidden;
            display:none;
        }
    h1 {
      margin-bottom: 10px;
    }

    figure {
      > .chart {

        margin-right: 44px;
      }
    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }

    .summary-section {
      .total-value-locked {
    .chart-div {
        visibility: hidden;
        display:none;
        
    }

          > div {
            p:nth-of-type(1) {
              margin-bottom: 12px;
            }
          }
        }
      }
    }
  }

  @media (min-width: 1400px) and (max-width: 1500px) {
    .anc-buyback > .NeuSection-content {
      section {
        div {
          p {
            font-size: 20px;
          }
        }
      }
    }
  }
`;

export const Dashboard = fixHMR(StyledDashboard);
