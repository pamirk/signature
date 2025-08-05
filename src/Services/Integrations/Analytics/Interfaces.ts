import {PlanChangePayload} from "../../../Interfaces/Billing";

export interface AnalyticsData {
    event: string;

    [key: string]: any; // Allows additional properties with any key-value pairs
}

export interface EcommerceItem {
    id?: string;
    name?: string;
    category?: string;
    price?: string;
    quantity?: number;

    [key: string]: any; // Allows additional properties with any key-value pairs
}

export interface BingTrackerType {
    fireRegistrationEvent: () => void;
    firePageChangeEvent: (path: string) => void;
}

export interface AnalyticsEventsProvider {
    fireRegistrationEvent: () => void;
    firePlanChangeEvent: (plan: PlanChangePayload) => void;
}