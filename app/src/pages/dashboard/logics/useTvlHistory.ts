import {
    useXyzTvlHistories,
} from '@anchor-protocol/app-provider';

export function useTvlHistory() {
    const data = useXyzTvlHistories();
    return {};
}
