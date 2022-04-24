import {
    useXyzDepositorQuery,
    useLunaExchange,
} from '@anchor-protocol/app-provider';
import {useAccount} from 'contexts/account';
import big from 'big.js';


export function useRewards() {
    const {terraWalletAddress} = useAccount();
    const data = useXyzDepositorQuery(terraWalletAddress);
    let totalPayedInterest = big(0);
    let totalDaysStaked = 0;
        let lunaUustExchangeRate = big(0);
    lunaUustExchangeRate = useLunaExchange();

    let xyzLuna = big(0);
    let xyzLunaAsUST = big(0);
    let xyzLunaAsUSTDeposit = big(0);
    let sumXyzLuna = big(0);

    let xyzUST = big(0);
    let sumXyzUST = big(0);
    let answer2 = 0;

    let deposit_times = []
    if (data) {
        data.map(
            ( {depositor, denom, i}) => {
                deposit_times.push(depositor.initial_interaction)
            if (denom === 'uluna') {
                answer2 += big(depositor.accrued_interest).mul(lunaUustExchangeRate.div(10)).toNumber()
            }
                answer2 += big(depositor.accrued_interest).div(10).toNumber()
            
            })
        const timeD = Math.min(...deposit_times)
        console.log(timeD)
        console.log(deposit_times)

        //totalPayedInterest = totalPayedInterestbegin.mul(100)
        totalPayedInterest = big(answer2).mul(10)
        console.log(data.map(({depositor}) => depositor.accrued_interest))
        console.log(answer2)
        totalDaysStaked = Math.floor(
            Math.abs(
                new Date().getTime()
                - new Date(
                    timeD * 1000
                ).getTime()
            ) / (1000 * 60 * 10)
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
