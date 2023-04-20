export interface Assignment{
    id: number;
    name: string;
    date: string;
    grade: number;
}

export interface Grade{
    id: number,
    name: string;
    surName: string;
    firstName: string;
    overAllGrade: number;
    assignments: {
        [key: string]: Assignment;
    };
}