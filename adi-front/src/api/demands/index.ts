import { AxiosResponse } from 'axios';
import { Demands, APIGetCreatedVersusResolvedProps } from '@/@types/demands';
import { backendApi } from '@/lib/axios';

export const getCreatedVersusResolved = async (parameters: APIGetCreatedVersusResolvedProps): Promise<Demands> => {
    // TODO: Corrigir para pegar UTC automaticamente

    const { data }: AxiosResponse<Demands> = await backendApi.get('/demands', {
        params: {
            ...parameters,
            from: parameters.period.range.from.subtract(3, 'hours').toISOString(),
            until: parameters.period.range.until.subtract(3, 'hours').toISOString(),
        },
    });

    return data;
};
