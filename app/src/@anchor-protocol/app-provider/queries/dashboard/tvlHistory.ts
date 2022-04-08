import {useAnchorWebapp} from '../../contexts/context';
import {createQueryFn} from '@libs/react-query-utils';
import {useQuery} from 'react-query';
import {ANCHOR_QUERY_KEY} from '../../env';
import {UST, xyz, HumanAddr} from '@anchor-protocol/types';
import {
    QueryClient,
    wasmFetch,
    WasmQuery,
    WasmQueryData,
} from '@libs/query-client';
import {
    useLunaExchange,
} from '@anchor-protocol/app-provider';
import big from 'big.js';

interface TvlHistoryWasmQuery {
    history: WasmQuery<xyz.TvlHistory, xyz.TvlHistoryResponse<UST>[]>;
}

export type xyzTvlHistory = WasmQueryData<TvlHistoryWasmQuery>;

export async function xyzTvlHistoryQuery(
    xyzAddr: HumanAddr,
    queryClient: QueryClient,
): Promise<xyzTvlHistory | undefined> {
    return wasmFetch<TvlHistoryWasmQuery>({
        ...queryClient,
        id: `history`,
        wasmQuery: {
            history: {
                contractAddress: xyzAddr,
                query: {
                    tvl: {
                        indice: -1,
                    },
                },
            },
        },
    });
}

export function useXyzTvlHistoryQuery(): any[] | undefined {
    let histories = [];
    const queryFn = createQueryFn(xyzTvlHistoryQuery);
    const {queryClient, contractAddress, queryErrorReporter} =
        useAnchorWebapp();

    const xyzs = [
        {
            contract: contractAddress.moneyMarket.market,
            denom: "uusd"
        },
        {
            contract: contractAddress.moneyMarket.marketLuna,
            denom: "uluna"
        },
    ]
    for (const {contract, denom} of xyzs) {
        const result = useQuery(
            [
                ANCHOR_QUERY_KEY.ANC_BALANCE,
                contract,
                queryClient,
            ],
            queryFn,
            {
                refetchInterval: 1000 * 60 * 2,
                enabled: true,
                keepPreviousData: true,
                onError: queryErrorReporter,
            },
        );
        if (result.data) histories.push({
            denom,
            state: result.data.history,
        });
    }

    return histories.length ? histories : undefined;
}

export function useXyzTvlHistories() {
    const xyzTvlHistorys = useXyzTvlHistoryQuery();
    return xyzTvlHistorys;
}
