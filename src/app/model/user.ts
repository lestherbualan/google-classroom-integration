export interface User{
    displayName: string;
    photoUrl: string;
    email: string;
    authToken: string;
    apiKey: string;
}

export interface Assignment{
    id: number;
    name: string;
    date: string;
    grade: number;
}

export interface Table{
    name: string;
    overAllGrade: number;
    assignments: Assignment[];
}