import { Dayjs } from 'dayjs';
import { Project, User } from '@/@types/gojira';

export interface IssuesGeneral {
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

export interface DemandsProjects {
    names: string[];
    details: Project[];
    issuesByProject: IssuesByProject[];
}

export interface IssuesByDeveloper {
    total: number;
    totalByType: number[];
}

export interface DemandsDevelopers {
    names: string[];
    details: User[];
    issuesByDeveloper: IssuesByDeveloper[];
}

export interface Demands {
    periods: string[];
    issuesTypes: string[];
    analytics: DemandsAnalytics;
    created: IssuesGeneral;
    resolved: IssuesGeneral;
    pending: IssuesGeneral;
    projects: DemandsProjects;
    developers: DemandsDevelopers;
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
