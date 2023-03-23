import { Dayjs } from 'dayjs';

export interface IssuesDetails {
    jql: string;
    data: {
        values: number[];
        total: number;
    };
}

export interface Demands {
    created: IssuesDetails;
    resolved: IssuesDetails;
    pending: IssuesDetails;
    yearMonthRange: string[];
}

export interface APIGetCreatedVersusResolvedProps {
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
