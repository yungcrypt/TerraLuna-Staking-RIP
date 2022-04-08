import {
    useXyzDepositorQuery,
    useLunaExchange,
} from '@anchor-protocol/app-provider';
import {useAccount} from 'contexts/account';
import {useBalances} from 'contexts/balances';
import big from 'big.js';


export function useRewards() {
    const {terraWalletAddress} = useAccount();
    const data = useXyzDepositorQuery(terraWalletAddress);
    const lunaUustExchangeRate = useLunaExchange();
    let totalPayedInterest = big(0);
    let totalDaysStaked = 0;

    let xyzLuna = big(0);
    let xyzLunaAsUST = big(0);
    let xyzUST = big(0);

    if (data) {
        totalPayedInterest = data.reduce(
            (acc, {depositor}) => acc.plus(big(depositor.accrued_interest)), big(0));


        totalDaysStaked = Math.ceil(
            Math.abs(
                new Date().getTime()
                - new Date(
                    Math.min(...data.map(({depositor}) => depositor.initial_interaction)) * 1000
                ).getTime()
            ) / (1000 * 60 * 60 * 24)
        );

        for (const {depositor, denom} of data) {
            switch (denom) {
                case "uluna":
                    xyzLuna = big(depositor.last_balance).plus(big(depositor.accrued_interest));
                    if (lunaUustExchangeRate)
                        xyzLunaAsUST = lunaUustExchangeRate.mul(xyzLuna.div(big(1000000)).toNumber()).mul(1000000).toFixed();
                    break;
                case "uusd":
                    xyzUST = big(depositor.last_balance).plus(big(depositor.accrued_interest));
                    break;
            }
        }
    }

    return {
        totalPayedInterest,
        totalDaysStaked,
        xyzLuna,
        xyzLunaAsUST,
        xyzUST,
    };
}
