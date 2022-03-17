import React, { useState } from 'react';
import { UIElementProps } from '@libs/ui';
import { ClickAwayListener } from '@material-ui/core';
import styled, { useTheme } from 'styled-components';
import { TransactionButton } from './TransactionButton';
import { DropdownBox, DropdownContainer } from '../desktop/DropdownContainer';
import { TransactionList } from './TransactionList';
import { Link } from 'react-router-dom';
import { Chain, useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useBackgroundTransactions } from 'tx/evm/storage/useBackgroundTransactions';
import { useTransactions } from 'tx/evm';

const TransactionWidgetBase = (props: UIElementProps & { color?: string }) => {
  const theme = useTheme();
  const { className, color = theme.header.textColor } = props;

  const [open, setOpen] = useState(false);
  const { backgroundTransactions } = useBackgroundTransactions();

  const {
    target: { chain },
  } = useDeploymentTarget();

  const { removeAll } = useTransactions();

  if (backgroundTransactions.length === 0 || chain === Chain.Terra) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={className}>
        <TransactionButton
          color={color}
          backgroundTransactions={backgroundTransactions}
          onClick={() => setOpen((v) => !v)}
          closeWidget={() => setOpen(false)}
        />
        {open && (
          <DropdownContainer>
            <DropdownBox>
              <TransactionList
                backgroundTransactions={backgroundTransactions}
                onClose={() => setOpen((v) => !v)}
                footer={
                  <div className="restore-tx">
                    <div className="restore-tx-inner">
                      <p>Having transaction issues?</p>
                      <Link
                        className="link"
                        to="/bridge/restore"
                        onClick={() => setOpen(false)}
                      >
                        Restore transaction
                      </Link>
                      <div className="clear-all" onClick={removeAll}>
                        Clear all
                      </div>
                    </div>
                  </div>
                }
              />
            </DropdownBox>
          </DropdownContainer>
        )}
      </div>
    </ClickAwayListener>
  );
};

export const TransactionWidget = styled(TransactionWidgetBase)`
  display: inline-block;
  position: relative;
  text-align: left;

  .restore-tx {
    margin-top: 1em;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};

    .restore-tx-inner {
      width: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .link {
      margin-top: 5px;
      cursor: pointer;
      color: ${({ theme }) => theme.colors.secondaryDark};
    }

    .clear-all {
      margin-left: auto;
      margin-right: auto;
      width: 60px;
      display: flex;
      font-size: 12px;
      font-weight: 500;
      justify-content: center;
      cursor: pointer;
      margin-top: 5px;
      color: ${({ theme }) => theme.colors.secondaryDark};
    }
  }
`;