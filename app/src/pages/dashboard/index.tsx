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
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
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
import { ANCPriceChart } from './components/ANCPriceChart';
import { findPrevDay } from './components/internal/axisUtils';
import { StablecoinChart } from './components/StablecoinChart';
import { TotalValueLockedDoughnutChart } from './components/TotalValueLockedDoughnutChart';
import { ArrowDropUp } from '@material-ui/icons';
import { CollateralMarket } from './components/CollateralMarket';
import { Divider } from '@material-ui/core';
import { InterestSectionDash, InterestSectionSlider } from '../earn/components/InterestSection';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { TooltipLabel } from '@libs/neumorphism-ui/components/TooltipLabel';
import { Circles } from 'components/primitives/Circles';
import { Link } from 'react-router-dom';
import { Typography, Input, Slider, Theme }from '@material-ui/core';
import {withStyles, makeStyles, createStyles} from '@material-ui/core/styles'
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
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Age</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={age}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}



function ThumbComponent(props) {
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
    marginTop:40,
  },
  thumb: {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -12,
    marginLeft: -13,
    boxShadow: '#ebebeb 0 2px 2px',
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

  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  const { data: { borrowRate, epochState } = {} } = useMarketStableCoinQuery();

  const stableCoinLegacy = useMemo(() => {
    if (!borrowRate || !epochState) {
      return undefined;
    }

    const depositRate = big(epochState.deposit_rate).mul(
      blocksPerYear,
    ) as Rate<Big>;

    return {
      depositRate,
      borrowRate: big(borrowRate.rate).mul(blocksPerYear) as Rate<Big>,
    };
  }, [blocksPerYear, borrowRate, epochState]);

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();
  const { data: marketUST } = useMarketUstQuery();
  const { data: marketANC } = useMarketAncQuery();
  const { data: marketDepositAndBorrow } = useMarketDepositAndBorrowQuery();
  const { data: marketCollaterals } = useMarketCollateralsQuery();
  const { data: marketBuybackTotal } = useMarketBuybackQuery('total');
  const { data: marketBuyback72hrs } = useMarketBuybackQuery('72hrs');

  const totalValueLocked = useMemo(() => {
    if (!marketDepositAndBorrow?.now || !marketCollaterals?.now || !marketUST) {
      return undefined;
    }

    return {
      totalDeposit: marketDepositAndBorrow?.now.total_ust_deposits,
      totalCollaterals: marketCollaterals?.now.total_value,
      totalValueLocked: big(
        marketDepositAndBorrow?.now.total_ust_deposits,
      ).plus(marketCollaterals?.now.total_value) as u<UST<Big>>,
      yieldReserve: marketUST.overseer_ust_balance,
    };
  }, [marketCollaterals?.now, marketDepositAndBorrow?.now, marketUST]);

  const ancPrice = useMemo(() => {
    if (!marketANC || marketANC.history.length === 0) {
      return undefined;
    }

    const last = marketANC.now;
    const last1DayBefore =
      marketANC.history.find(findPrevDay(last.timestamp)) ??
      marketANC.history[marketANC.history.length - 2] ??
      marketANC.history[marketANC.history.length - 1];

    return {
      ancPriceDiff: big(
        big(last.anc_price).minus(last1DayBefore.anc_price),
      ).div(last1DayBefore.anc_price) as Rate<Big>,
      ancPrice: last.anc_price,
      circulatingSupply: last.anc_circulating_supply,
      ancMarketCap: big(last.anc_price).mul(last.anc_circulating_supply) as u<
        UST<Big>
      >,
    };
  }, [marketANC]);

  const stableCoin = useMemo(() => {
    if (
      !marketUST ||
      !marketDepositAndBorrow ||
      marketDepositAndBorrow.history.length === 0
    ) {
      return undefined;
    }

    const last = marketDepositAndBorrow.now;
    const last1DayBefore =
      marketDepositAndBorrow.history.find(findPrevDay(last.timestamp)) ??
      marketDepositAndBorrow.history[marketDepositAndBorrow.history.length - 2];

    return {
      totalDeposit: last.total_ust_deposits,
      totalBorrow: last.total_borrowed,
      totalDepositDiff: big(
        big(last.total_ust_deposits).minus(last1DayBefore.total_ust_deposits),
      ).div(last1DayBefore.total_ust_deposits) as Rate<Big>,
      totalBorrowDiff: big(
        big(last.total_borrowed).minus(last1DayBefore.total_borrowed),
      ).div(last1DayBefore.total_borrowed) as Rate<Big>,
      depositAPR: big(marketUST.deposit_rate).mul(blocksPerYear) as Rate<Big>,
      depositAPRDiff: 'TODO: API not ready...',
      borrowAPR: big(marketUST.borrow_rate).mul(blocksPerYear) as Rate<Big>,
      borrowAPRDiff: 'TODO: API not ready...',
    };
  }, [blocksPerYear, marketDepositAndBorrow, marketUST]);

  return (
    <div className={className}>
      <main>
        <div className="content-layout">
          <TitleContainerAndExchangeRate>
            <PageTitle title="DASHBOARD" />
          </TitleContainerAndExchangeRate>

          <div className="summary-section">
            <Section
              className="total-value-locked"
              style={{ gridArea: 'hd', display: 'flex', flexDirection: 'row' }}
            >
              <section className="donutChartSecion" style={{ width: '35%' }}>
                <div className="tvlTitle">
                  <h2 style={{fontSize:"25px",fontWeight:"bolder"}}>TOTAL VALUE LOCKED</h2>
                <div className="percents">
                  <p className="amount">
                    <AnimateNumber
                      format={formatUTokenIntegerWithoutPostfixUnits}
                    >
                      {totalValueLocked
                        ? totalValueLocked.totalValueLocked
                        : (0 as u<UST<number>>)}
                    </AnimateNumber>
                    <span>UST</span>
                  </p>
                  <ArrowDropUp style={{color:"green", fontSize:"35px"}}/><div style={{color:"green", fontSize:"20px"}}>2%</div>
                </div>
                </div>
                <figure
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <div className="chart">
                    <TotalValueLockedDoughnutChart
                      totalDeposit={
                        totalValueLocked?.totalDeposit ?? ('0' as u<UST>)
                      }
                      totalCollaterals={
                        totalValueLocked?.totalCollaterals ?? ('1' as u<UST>)
                      }
                      totalDepositColor={theme.colors.secondary}
                      totalCollateralsColor={theme.textColor}
                    />
                  </div>
                  <div>
                    <h3>
                      <i style={{ backgroundColor: theme.colors.secondary }} />{' '}
                      LUNA
                    </h3>
                    <p>
                      ${' '}
                      <AnimateNumber
                        format={formatUTokenIntegerWithoutPostfixUnits}
                      >
                        {totalValueLocked
                          ? totalValueLocked.totalDeposit
                          : (0 as u<UST<number>>)}
                      </AnimateNumber>
                    </p>
                    <h3>
                      <i style={{ backgroundColor: theme.textColor }} /> UST
                    </h3>
                    <p>
                      ${' '}
                      <AnimateNumber
                        format={formatUTokenIntegerWithoutPostfixUnits}
                      >
                        {totalValueLocked
                          ? totalValueLocked.totalCollaterals
                          : (0 as u<UST<number>>)}
                      </AnimateNumber>
                    </p>
                  </div>
                </figure>
              </section>
              <Divider
                orientation="vertical"
                flexItem
                style={{
                  width: '5px',
                  height: '380px',
                  marginRight: '40px',
                  marginLeft: '40px',
                }}
              />
              <section className="" style={{ width: '70%' }}>
                <ANCPriceChart
                  data={marketANC?.history ?? EMPTY_ARRAY}
                  theme={theme}
                  isMobile={isMobile}
                />
              </section>
            </Section>

            <Section className="staking1">
              <div
                style={{
                  alignSelf: 'left',
                  margin: '10px',
                  display: 'inline-flex',
                }}
              >
                <Circles backgroundColors={['#2C2C2C']}>
                  <TokenIcon token="luna" />
                </Circles>
                <div style={{ marginLeft: '15px' }}>
                  <Typography
                    style={{ fontSize: '30px', fontWeight: 'bolder' }}
                  >
                    <div style={{ width: '200px' }}>
                      LUNA
                      <br />
                    </div>
                  </Typography>
                  <Typography style={{ fontSize: '15px' }}>
                    <div style={{ width: '200px' }}>
                      interest
                      <br />
                    </div>
                  </Typography>
                </div>
              </div>
              <div className="staking-apy" style={{ alignSelf: 'left' }}>
                <InterestSectionDash className="interest" />
              </div>
              <div className="staking-buttons" style={{ margin: 'auto' }}>
                <StyledStakeNow component={Link} to={`/trade`}>
                  Stake Your Luna Now!
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
                  <TokenIcon token="ust" />
                </Circles>
                <h2 style={{ width: '200px' }}>UST</h2>
              </div>
              <div className="staking-apy" style={{ alignSelf: 'left' }}>
                <InterestSectionDash className="interest" />
              </div>
              <div className="staking-buttons" style={{ margin: 'auto' }}>
                <StyledStakeNow component={Link} to={`/trade`}>
                  Stake Your UST Now!
                </StyledStakeNow>
              </div>
            </Section>
            <Section className="stablecoin">
            <div className="fields-input">
                <ControlledOpenSelect/>
                <h2 style={{marginTop:"-30px",}}>labeling</h2>
                <CoolInput></CoolInput>
                <h2 style={{marginTop:"-30px",}}>labeling</h2>
                <CoolSlider
                ThumbComponent={ThumbComponent}
      size="small"
      defaultValue={70}
      aria-label="Small"
      valueLabelDisplay="auto"/>
                <h2 style={{marginTop:"-30px",}}>labeling</h2>
            </div>
                
              <Divider
                orientation="vertical"
                flexItem
                style={{
                  width: '5px',
                  height: '380px',
                  marginRight: '40px',
                  marginLeft: '40px',
                }}
              />
              <div className="bottom-wrap">
              <header style={{alignSelf:"center"}}>
                <div>
                  <h2>
                    <i style={{ backgroundColor: theme.colors.secondary }} />{' '}
                    TOTAL DEPOSIT
                    {stableCoin && (
                      <span
                        data-negative={big(stableCoin.totalDepositDiff).lt(0)}
                      >
                        {big(stableCoin.totalDepositDiff).gte(0) ? '+' : ''}
                        {formatRate(stableCoin.totalDepositDiff)}%
                      </span>
                    )}
                  </h2>
                  <p className="amount">
                    <AnimateNumber
                      format={formatUTokenIntegerWithoutPostfixUnits}
                    >
                      {stableCoin
                        ? stableCoin.totalDeposit
                        : (0 as u<UST<number>>)}
                    </AnimateNumber>
                    <span>UST</span>
                  </p>
                </div>
                <div />
              </header>
                <div style={{alignSelf:"self-end", width:"700px", height:"400px"}}>
                <ANCPriceChart
                  data={marketANC?.history ?? EMPTY_ARRAY}
                  theme={theme}
                  isMobile={isMobile}
                />

              </div>
              </div>
            </Section>
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
  margin-top: 40px;
  width: 400px;
  padding: 20px;
  background: #493B3B ;
`;
const CoolInput = styled(Input)`

`;
const StyledDashboard = styled(DashboardBase)`
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  h2 {
    font-size: 12px;
    font-weight: 500;

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
    font-size: 30px;
    font-weight: 700;
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
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width:30%;
}
  .bottom-wrap {
      width: inherit;
      display: flex;
}

  .amount {
    font-size: 40px;
    font-weight: 700;

    span:last-child {
      margin-left: 8px;
      font-size: 0.555555555555556em;
    }
  }
  .percents {
    display: inline-flex;
    align-items:center;
    
  }

  .total-value-locked {
    canvas {
      height: 400px;
    }
    Section {
    }
    figure {
      > .chart {
        width: 220px;
        height: 220px;

        margin-right: 44px;
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
          font-size: 18px;

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

    hr {
      ${vRuler};
    }

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
        display:inline-flex;
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
      max-width: 1500px;
      margin: 0 auto;
      padding: 0;
    }
  }

      .tvlTitle {
        align-self: baseline;
        margin-bottom: 50px;
      }
  // pc
  padding: 50px 100px 100px 100px;

  .NeuSection-root {
    margin-bottom: 40px;
  }

  // align section contents to origin
  @media (min-width: 1400px) {
    .summary-section {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-auto-rows: minmax(550px, auto);
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
        align-items: center;
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
        .NeuSection-content {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          padding-left: 60px;
          padding-right: 60px;
          padding-top: 25px;
          padding-bottom: 25px;
        }
        hr {
          ${hHeavyRuler};
          margin-top: 80px;
          margin-bottom: 40px;
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
  @media (min-width: 940px) and (max-width: 1399px) {
    .summary-section {
      .total-value-locked > .NeuSection-content {
        hr {
          ${vRuler};
          margin-left: 40px;
          margin-right: 40px;
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
  @media (max-width: 939px) {
    padding: 20px 30px 30px 30px;

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
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 30px;
        height: 60vw;
      }
    }

    .summary-section {
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

        hr {
          ${hRuler};
          margin: 15px 0;
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
    padding: 10px 20px 30px 20px;

    h1 {
      margin-bottom: 10px;
    }

    .NeuSection-root {
      margin-bottom: 40px;

      .NeuSection-content {
        padding: 20px;
      }
    }

    .summary-section {
      .total-value-locked {
        figure {
          > .chart {
            width: 120px;
            height: 120px;

            margin-right: 30px;
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
