import { UserRoles } from "./User";

export interface TeamMembersAddPayload {
  members: {
    email?: string;
    role?: UserRoles;
  }[];
  emails?: string[]; // Add this if required by the type error
}

export interface TeamIdPayload {
    teamId: string;
}

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
    TeamMembersGetPayload?: never
}

export interface TeamMembersData {
    members?: TeamMember[];
    total?: number;

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