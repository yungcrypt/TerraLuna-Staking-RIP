import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANC,
  formatANCInput,
  microfy,
} from '@anchor-protocol/notation';
import { ANC, HumanAddr, uANC } from '@anchor-protocol/types';
import { Spend } from '@anchor-protocol/types/contracts/anchorToken/community/spend';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import { useCommunityAncBalance } from './queries/communityAncBalance';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function PollCreateSpendCommunityPool() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const address = useContractAddress();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const {
    data: { communityAncBalance },
  } = useCommunityAncBalance();

  const invalidAmount = useMemo(() => {
    if (amount.length === 0 || !communityAncBalance) return undefined;

    const uanc = microfy(amount as ANC);

    return uanc.gt(communityAncBalance.balance)
      ? 'Exceed Spending Limit'
      : undefined;
  }, [amount, communityAncBalance]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (recipient: string, amount: string): ExecuteMsg[] => {
      const spend: Spend['spend'] = {
        recipient: recipient as HumanAddr,
        amount: amount as uANC,
      };

      const msgs: Omit<ExecuteMsg, 'order'>[] = [];

      if (Object.keys(spend).length > 0) {
        msgs.push({
          contract: address.anchorToken.community,
          msg: Buffer.from(
            JSON.stringify({
              spend,
            }),
          ).toString('base64'),
        });
      }

      return msgs.map((msg, i) => ({
        order: i + 1,
        ...msg,
      }));
    },
    [address.anchorToken.community],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Spend Community Pool"
      submitDisabled={
        recipient.length === 0 || amount.length === 0 || !!invalidAmount
      }
      onCreateMsgs={() => createMsgs(recipient, amount)}
    >
      <div className="description">
        <p>Recipient</p>
        <p />
      </div>

      <TextInput
        placeholder="Address"
        value={recipient}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setRecipient(target.value)
        }
      />

      <div className="description">
        <p>Amount</p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        value={amount}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setAmount(target.value)
        }
      />

      <div className="wallet" aria-invalid={!!invalidAmount}>
        <span>{invalidAmount}</span>
        <span>
          Safe Max:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              communityAncBalance &&
              setAmount(formatANCInput(demicrofy(communityAncBalance.balance)))
            }
          >
            {communityAncBalance
              ? formatANC(demicrofy(communityAncBalance.balance))
              : 0}{' '}
            ANC
          </span>
        </span>
      </div>
    </PollCreateBase>
  );
}
