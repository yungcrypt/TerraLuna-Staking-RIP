import {
    useXyzTvlHistories,
} from '@anchor-protocol/app-provider';

export function useTvlHistory() {
    const data = useXyzTvlHistories();
    console.log(data)
    return data;
}
