export interface Avatars {
    '48x48': string;
    '32x32': string;
    '24x24': string;
    '16x16': string;
}

export interface Project {
    expand: string;
    id: string;
    key: string;
    self: string;
    name: string;
    project_type_key: string;
    simplified: boolean;
    avatarUrls: Avatars;
}

export interface User {
    accountId: string;
    self: string;
    emailAddress: string;
    avatarUrls: Avatars;
    displayName: string;
    active: boolean;
    timeZone: string;
    accountType: string;
}
