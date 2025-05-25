
export interface HealthRecord {
    id: number;
    title: string;
    date: string;
    doctor?: string;
    lab?: string;
    type: string;
    location: string;
    status: "Shared" | "Pending Verification" | string;
}

export type FilterOption = "all" | string;
export type SortOption = "date-newest" | "date-oldest";