import { AxiosResponse } from 'axios';
import { Demands, APIGetCreatedVersusResolvedProps } from '@/@types/demands';
import { backApi } from '@/lib/axios';

export const getCreatedVersusResolved = async (parameters: APIGetCreatedVersusResolvedProps): Promise<Demands> => {
    const { data }: AxiosResponse<Demands> = await backApi.get('/demands', {
        params: {
            ...parameters,
            from: parameters.period.range.from.subtract(3, 'hours').toISOString(),
            until: parameters.period.range.until.subtract(3, 'hours').toISOString(),
        },
    });

    return data;
};
