import {
  formatUST,
  formatUTokenInteger,
  formatUTokenIntegerWithoutPostfixUnits,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Rate, u, UST } from '@anchor-protocol/types';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
  useMarketAncQuery,
  useMarketBuybackQuery,
  useMarketCollateralsQuery,
  useMarketDepositAndBorrowQuery,
  useMarketStableCoinQuery,
  useMarketUstQuery,
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
import { findPrevDay } from './components/internal/axisUtils';
import { TotalValueLockedDoughnutChart } from './components/TotalValueLockedDoughnutChart';
import { ArrowDropUp } from '@material-ui/icons';
import { Divider } from '@material-ui/core';
import {
  InterestSectionDash,
  InterestSectionSlider,
} from '../earn/components/InterestSection';
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
import Button from '@material-ui/core/Button';
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

export default function ControlledOpenSelect() {
  const classes = useStyles();
  const [age, setAge] = React.useState<string | number>('');
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as number);
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
        style={{ width: '100%', marginRight: 35 }}
      >
        <InputLabel>Luna</InputLabel>
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={age}
          onChange={handleChange}
        >
          <MenuItem value={10}>Luna</MenuItem>
          <MenuItem value={20}>UST</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

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
    color: '#3a8589',
    height: 3,
    padding: '0',
    marginLeft: 5,
    marginTop: '-30px',
    marginBottom: '20px',
  },
  thumb: {
    'height': 27,
    'width': 27,
    'backgroundColor': '#fff',
    'border': '1px solid currentColor',
    'marginTop': -12,
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
  },
  rail: {
    color: '#d8d8d8',
    opacity: 1,
    height: 3,
  },
})(Slider);
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
            <TokenIcon token="ust" style={{height:"75px",width:"75px"}}/>
          <div style={{ marginLeft: '15px' }}>
            <Typography style={{ fontSize: '30px', fontWeight: '760' }}>
              <div style={{ width: '200px' }}>
                UST
                <br />
              </div>
            </Typography>
            <div>
              <div style={{ width: '200px', display: 'inline-flex' }}>
                <h2 style={{ fontSize: '15px' }}>INTEREST</h2>
                <div
                  style={{
                    alignSelf: 'start',
                    marginTop: '-5px',
                    marginLeft: '5px',
                  }}
                >
                  <InfoTooltip
                    style={{ width: '13px', color: theme.dimTextColor }}
                  >
                    Total number of claimable ANC from UST Borrow and LP staking
                  </InfoTooltip>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <div className="staking-apy" style={{ alignSelf: 'left' }}>
          <InterestSectionDash className="interest"/>
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
            <Typography style={{ fontSize: '30px', fontWeight:'760' }}>
              <div style={{ width: '200px' }}>
                LUNA
                <br />
              </div>
            </Typography>
            <div>
              <div style={{ width: '200px', display: 'inline-flex' }}>
                <h2 style={{ fontSize: '15px' }}>INTEREST</h2>
                <div
                  style={{
                    alignSelf: 'start',
                    marginTop: '-5px',
                    marginLeft: '5px',
                  }}
                >
                  <InfoTooltip
                    style={{ width: '13px', color: theme.dimTextColor }}
                  >
                    Total number of claimable ANC from UST Borrow and LP staking
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

const EarningCalc = () => {
  const theme = useTheme();

  const [isMobile, setIsMobile] = useState<boolean>(false);
  return (
    <Section className="stablecoin">
      <Typography style={{ fontSize: '20px', fontFamily:"SF Pro Display", fontWeight:"740" }}>HOW MUCH CAN I EARN??</Typography>

      <div className="NeuSection-content2">
        <div className="fields-input">
          <ControlledOpenSelect />
          <h2 style={{ marginTop: '-40px' }}>Your Deposit</h2>
          <CoolInput></CoolInput>
          <h2 style={{ marginTop: '-40px' }}>Amount in UST</h2>
          <Typography style={{ fontWeight: 700, fontSize: 23, fontFamily: "SF Pro Display !important" }}>
            10 Years
          </Typography>
          <CoolSlider
            ThumbComponent={ThumbComponent}
            size="small"
            defaultValue={70}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
        </div>

        <Divider
          orientation="vertical"
          flexItem
          style={{
            width: '2px',
            height: '380px',
            marginRight: '40px',
            marginLeft: '40px',
          }}
        />
        <div className="bottom-wrap">
          <div className="bottom-total">
            <header style={{ alignSelf: 'start' }}>
              <p className="amount">
                456,367
                <span>UST</span>
              </p>
              <h2>
                Interest Earned
              </h2>
              <div />
            </header>
            <header style={{ alignSelf: 'start', fontWeight:"740" }}>
              <div>
                <p className="amount">
                  65,4654,654
                  <span>UST</span>
                </p>
                <h2>Total</h2>
              </div>
              <div />
            </header>
            <header>
              <h2>
                <i style={{ backgroundColor: theme.colors.secondary }} /> TT Market
              </h2>
              <h2>
                <i style={{ backgroundColor: "black" }} /> Traditional Market
              </h2>
            </header>
          </div>
          <div style={{ alignSelf: 'end', width: '100%', height: '400px' }}>
          <NewChart/>
          </div>
        </div>
      </div>
    </Section>
  );
};

const EMPTY_ARRAY: any[] = [];

function DashboardBase({ className }: DashboardProps) {
  const theme = useTheme();

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
    totalValueLocked: '129,098,787,123',
    totalCollaterals: '1237896',
    totalDeposit: 4235876345,
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
                      style={{ fontSize: '20px', fontWeight:'760', fontFamily:"SF Pro Display", fontStyle:"normal", lineHeight:"120%" }}
                    >
                      TOTAL VALUE LOCKED
                    </Typography>
                    <div className="percents" style={{marginTop:"-5px"}}>
                      <p className="amount">
                        {totalValueLocked
                          ? totalValueLocked.totalValueLocked
                          : (0 as u<UST<number>>)}
                        <span style={{fontWeight:"760"}}>UST</span>
                      </p>

                      <div style={{marginTop:"23px",marginLeft:"-5px", display:"inline-flex", alignItems:"center"}}>
                      <ArrowDropUp
                        style={{ color: '#00B929', fontSize: '40px' }}
                      />
                      <div style={{ color: '#00B929', fontSize: '14px', marginLeft:"-6px" }}>2%</div>
                    </div>
                    </div>
                  </div>
                  <figure
                  className="tvlBottom"
                  >
                    <div className="chart">
                      <TotalValueLockedDoughnutChart
                        totalDeposit={'0' as u<UST>}
                        totalCollaterals={'0' as u<UST>}
                        totalDepositColor={theme.colors.secondary}
                        totalCollateralsColor={theme.textColor}
                      />
                    </div>
                    <div>
                      <h3>
                        <i
                          style={{ backgroundColor: theme.colors.secondary }}
                        />{' '}
                        LUNA
                      </h3>
                      <div style={{display:"inline-flex"}}>
                      <p style={{marginRight:'4px'}}>
                        ${' '}
                      </p>
                      <p style={{fontStyle:"italic"}}>
                        {totalValueLocked
                          ? totalValueLocked.totalDeposit
                          : (0 as u<UST<number>>)}
                      </p>
                      </div>
                      <h3>
                        <i style={{ backgroundColor: "#000000" }} /> UST
                      </h3>
                      <div style={{display: "inline-flex"}}>
                      <p style={{marginRight:"4px"}}>
                        ${' '}
                      </p>
                      <p style={{fontStyle:"italic"}}>
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
                  height: '380px',
                  marginRight: '40px',
                  marginLeft: '40px',
                  borderLeft: 'none',
                  alignSelf: 'center',
                }}
                className="topDiv new-chart"
              />
              <NewChart />
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
  @media (min-width: 1400px) {
  }
  width: 400px;
  padding: 21px;
  border-radius:25px;
  background: #493b3b;
  font-weight: 720;
  letter-spacing: 0.03em;
  margin-top:27px;
`;
const CoolInput = styled(Input)``;
const StyledDashboard = styled(DashboardBase)`
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  line-height:1.2;
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
    .fields-input {
    width:450px;
    display: flex;
    flex-direction: column;
    justify-content:space-around;
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
        align-items: center;
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
            padding:50px;
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
        width:80%;
        margin-right:60px;
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
          font-size: 16px;

          &:nth-of-type(1) {
            margin-bottom: 27px;
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
  .NeuSection-content {
        display:block;
  }
  .NeuSection-content2 {
        display:inline-flex;
        width:100%;
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
      max-width: 1222px;
      margin: 0 auto;
      padding: 0;
    }
  }

    .tvlBottom {
        align-self:start;
        margin-left:-10px;
    }
      .tvlTitle {
        align-self: baseline;
        margin-bottom: 50px;
      }

  // pc
  padding: 50px 100px 100px 50px;

  .NeuSection-root {
  }
    .NeuSection-root { margin:20px;}

  // align section contents to origin
  @media (min-width: 1400px) {
    .summary-section {
      max-width: 1220px;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-auto-rows: minmax(400px, auto);
      grid-template-areas:
        'hd hd hd hd   hd   hd   hd   hd'
        'sd sd sd sd  main  main main main'
        'ft ft ft ft ft ft ft ft';
      grid-gap: 60px;
      margin-bottom: 40px;
      .donutChartSecion {

        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center !important;
      }
      .NeuSection-root {
        margin-bottom: 0;
        width: 100%;
      }
      .NeuSection-content {
        width: 100%;
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
  @media (min-width: 700px) and (max-width: 900px) {
    
    .NeuSection-root { margin:40px;}
      grid-gap: 60px;


        .new-chart {
            visibility: hidden;
            display:none;
        }
      .total-value-locked > .NeuSection-content {
        hr {
          ${vRuler};
          margin-left: 40px;
          margin-right: 40px;
          margin-top:30px;
          margin-bottom:30px;
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
    padding: 20px 30px 20px 30px;

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
        height: 600px;
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
    padding: 20px 20px 20px 20px;
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
            width:inherit;
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
