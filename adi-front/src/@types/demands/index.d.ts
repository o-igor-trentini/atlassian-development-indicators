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
