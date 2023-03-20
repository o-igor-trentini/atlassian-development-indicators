import { AxiosResponse } from 'axios';
import { Demands } from '@/@types/demands';
import { backApi } from '@/lib/axios';
import { getCreatedVersusResolvedProps } from '@/pages/api/types';

export const getCreatedVersusResolved = async (parameters: getCreatedVersusResolvedProps): Promise<Demands> => {
    const { data }: AxiosResponse<Demands> = await backApi.get('/demands', {
        params: {
            ...parameters,
            from: parameters.period.range.from.subtract(3, 'hours').toISOString(),
            until: parameters.period.range.until.subtract(3, 'hours').toISOString(),
        },
    });

    return data;
};
