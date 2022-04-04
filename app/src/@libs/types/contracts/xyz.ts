import {HumanAddr, Token, u} from '@libs/types';

export namespace xyz {
    export interface State {
        state: {};
    }

    export interface StateResponse<T extends Token> {
        tvl: u<T>;
        tvl_indices: number;
        accrued_interest_payments: u<T>;
    }

    export interface Depositor {
        ident: {
            address: HumanAddr;
            epoch: number;
        };
    }
    export interface DepositorResponse<T extends Token> {
        accrued_interest: u<T>;
        last_balance: u<T>;
        last_interaction: number;
        initial_interaction: number;
    }

}
