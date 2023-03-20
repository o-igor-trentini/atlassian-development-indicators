import { Dayjs } from 'dayjs';

export interface getCreatedVersusResolvedProps {
    projects: string[];
    period: {
        range: {
            from: Dayjs;
            until: Dayjs;
        };
    };
    orderBy?: {
        field: string;
        direction: 'ASC' | 'DESC';
    }[];
}
