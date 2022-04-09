import {
    useXyzDepositorQuery,
    useLunaExchange,
} from '@anchor-protocol/app-provider';
import {useAccount} from 'contexts/account';
import big from 'big.js';


export function useRewards() {
    const {terraWalletAddress} = useAccount();
    const data = useXyzDepositorQuery(terraWalletAddress);
    const lunaUustExchangeRate = useLunaExchange();
    let totalPayedInterest = big(0);
    let totalDaysStaked = 0;

    let xyzLuna = big(0);
    let xyzLunaAsUST = big(0);
    let xyzLunaAsUSTDeposit = big(0);
    let sumXyzLuna = big(0);

    let xyzUST = big(0);
    let sumXyzUST = big(0);

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
                    sumXyzLuna = big(depositor.sum_deposits);
                    if (lunaUustExchangeRate)
                        xyzLunaAsUST = lunaUustExchangeRate.mul(xyzLuna.div(big(1000000)).toNumber()).mul(1000000).toFixed();
                        xyzLunaAsUSTDeposit = lunaUustExchangeRate.mul(sumXyzLuna.div(big(1000000)).toNumber()).mul(1000000).toFixed();
                    break;
                case "uusd":
                    xyzUST = big(depositor.last_balance).plus(big(depositor.accrued_interest));
                    sumXyzUST = big(depositor.sum_deposits);
                    break;
            }
        }
    }

    return {
        totalPayedInterest,
        totalDaysStaked,
        xyzLuna,
        xyzLunaAsUST,
        xyzLunaAsUSTDeposit,
        xyzUST,
        sumXyzLuna,
        sumXyzUST,
    };
}
