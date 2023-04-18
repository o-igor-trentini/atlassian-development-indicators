import { Dayjs } from 'dayjs';

export interface IssuesDetails {
    total: number;
    values: number[];
    jql?: string;
}

export interface DemandsAnalytics {
    overallProgress: number;
    progressPerPeriod: number[];
    createdTotal: number;
    resolvedTotal: number;
    pendingTotal: number;
}

export interface IssuesByProject {
    total: number;
    totalByType: number[];
    totalByPeriod: number[];
    totalByTypeAndPeriod: Record<string, number>[];
}

export interface Demands {
    periods: string[];
    issuesTypes: string[];
    analytics: DemandsAnalytics;
    created: IssuesDetails;
    resolved: IssuesDetails;
    pending: IssuesDetails;
    projects: {
        names: string[];
        avatars: string[];
        issuesByProject: IssuesByProject[];
    };
    developers: [];
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
