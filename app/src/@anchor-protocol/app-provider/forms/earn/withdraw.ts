import {
  earnWithdrawForm,
  EarnWithdrawFormStates,
} from '@anchor-protocol/app-fns';
import { UST, u } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useCallback, useMemo } from 'react';
import big, { Big } from 'big.js';

export interface EarnWithdrawFormReturn extends EarnWithdrawFormStates {
  updateWithdrawAmount: (withdrawAmount: UST) => void;
}

export function useEarnWithdrawForm(): EarnWithdrawFormReturn {
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const { uUST, uaUST } = useBalances();

  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: big(uaUST).mul('1')
      ,
    };
  }, [uaUST]);

  const [input, states] = useForm(
    earnWithdrawForm,
    {
      isConnected: connected,
      fixedGas: fixedFee,
      userUUSTBalance: uUST,
      totalDeposit: totalDeposit as u<UST<Big>>,
    },
    () => ({ withdrawAmount: '' as UST }),
  );

  const updateWithdrawAmount = useCallback(
    (withdrawAmount: UST) => {
      input({
        withdrawAmount,
      });
    },
    [input],
  );

  return {
    ...states,
    updateWithdrawAmount,
  };
}
