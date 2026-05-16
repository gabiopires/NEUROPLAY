export type TypeDataAlerts = {
    alertType: number,
    alertTitle?: string,
    alertText: string,
    alertButtons: string[],
    alertsCommans: (()=> void)[],
}

export type TypeDataLevel = {
    levelStudentId: string,
    levelId: number, 
    levelDescription: string,
    levelAnimalDesc: string,
    levelAnimalPhoto: string,
    levelStampPhoto: string,
    levelAudio: string,
    levelAudioDesc: string,
    levelRepeat: boolean,
    activityComand: (()=> (void))[],
}

export type TypeStudentsData = {
    stu_name: string,
    stu_age: number,
    stu_diagnostic: string,
    stu_user: string,
}

export type TypeStudentsProgressData = {
    stu_id: number,
    stu_name: string,
    prog_lev_id: number,
    prog_date: string
}