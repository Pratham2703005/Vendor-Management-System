export interface Submission {
    id: number;
    title: string;
    content: string;
    image_ref?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export interface User {
    id: number;
    username: string;
    role: 'writer' | 'manager';
}
