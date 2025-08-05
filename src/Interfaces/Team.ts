import { UserRoles } from "./User";

export type TeamMembersAddPayload = any
export type TeamIdPayload = any

export type TeamMember = {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
    avatarUrl?: string;
}

export interface TeamMembersGetPayload {
    teamId?: string;
    page?: number;
    limit?: number;
    TeamMembersGetPayload?: never;
    orderingDirection?: string;
    orderingKey?: string;
}

export interface TeamMembersData {
    members?: TeamMember[];
    total?: number;
    teamMembers?: Record<string, TeamMember>;
}

export interface DeleteTeamMembersPayload {
    teamId?: string;
    members?: string[];
}

//TeamOwner

export interface TeamOwner {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    companyLogoKey?: string;
}