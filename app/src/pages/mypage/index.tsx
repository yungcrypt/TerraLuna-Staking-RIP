import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { Borrow } from 'pages/mypage/components/Borrow';
import React, { useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { Earn } from './components/Earn';
import { Govern } from './components/Govern';
import { Rewards } from './components/Rewards';
import { TotalClaimableRewards } from './components/TotalClaimableRewards';
import { TotalValue } from './components/TotalValue';
import { TransactionHistory } from './components/TransactionHistory';

export interface MypageProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const TAB_ITEMS: Item[] = [
  { label: 'All', value: 'all' },
  { label: 'UST', value: 'UST' },
  { label: 'LUNA', value: 'LUNA' },
];

function MypageBase({ className }: MypageProps) {
  const isSmallLayout = useMediaQuery({ query: '(max-width: 1000px)' });

  const {
    target: { isNative },
  } = useDeploymentTarget();

  const tabItems = useMemo(() => {
    return TAB_ITEMS;
  }, []);

  const [tab, setTab] = useState<Item>(() => tabItems[0]);

  return (<div className="center">
    <div className={className}>
      <TitleContainer>
        <PageTitle title="MY PAGE" />
      </TitleContainer>
    <OverviewRow>
        <TotalValue className="box1"/>
      <TotalClaimableRewards className="box2"/>
    </OverviewRow>
      
      {!isSmallLayout && (
        <Tab
          className="tab box3"
          items={tabItems}
          selectedItem={tab ?? tabItems[0]}
          onChange={setTab}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}

        />
      )}

          <Earn className="box4" tab={tab.value}/>

      {(isSmallLayout || tab.value === 'all') && (
        <div className="box5">
          <h2>TRANSACTION HISTORY</h2>
          <TransactionHistory />
        </div>
      )}
    </div>
    </div> );

}
const OverviewRow = styled.div`
  @media (min-width: 1001px) {
      display:grid;
      grid-template-columns: repeat(8, 1fr);
      grid-auto-rows: minmax(400px, auto);
      grid-template-areas:
        'hd hd hd hd   hd hd1 hd1 hd1';
      grid-gap: 60px;
      .box1 { grid-area: hd; }
      .box2 { grid-area: hd1; }
      .box3 { grid-area: sd; }
      .box4 { grid-area: sf; }

  }
  @media (max-width: 1000px) {
    .box2 {
      margin-top:60px;
    }
  }
  `;

export const StyledMypage = styled(MypageBase)`
  @media (min-width: 1001px) {
    max-width:1322px;
    margin-top: 50px;
    width:90%;
    margin-left:  auto;
    margin-right:  auto;
    .box4 {
      section { .NeuSection-root {
        margin-top:30px;
      }
    }
  }
  }
  .NeuSection-root {
  }
  h2 {
    font-size: 18px;
    font-weight: 700;
    margin-top: 60px;
    margin-bottom: 20px;
  }

  .tab {
    margin-top: 60px;
    margin-bottom: 60px;
  }
  @media (max-width: 1000px) {
    width: 90%;
    margin-top: 50px;
    
    margin-left: auto;
    margin-right: auto;
  }
`;

export const Mypage =
  process.env.NODE_ENV === 'production'
    ? StyledMypage
    : (props: MypageProps) => <StyledMypage {...props} />;
