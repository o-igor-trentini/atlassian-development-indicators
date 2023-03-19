import { AxiosResponse } from 'axios/index';
import { Demands } from '@/@types/demands';
import { backApi } from '@/lib/axios';

export const getCreatedVersusResolved = async (): Promise<Demands> => {
    const { data }: AxiosResponse<Demands> = await backApi.get('/demands');

    return data;
};
