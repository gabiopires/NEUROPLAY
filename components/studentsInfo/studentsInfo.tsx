import { TypeStudentsData } from "../type";
interface studentsProps {
    studentsData: TypeStudentsData;
}

export default function StudentsInfo(props: studentsProps) {

    return (
        <div className="bodyStudentsInfo">
            <div className="studentsInfo_contentC1">
                <h1>{props.studentsData.stu_name}</h1>
            </div>
            <div className="studentsInfo_ContentC2">
                <h1>{props.studentsData.stu_age}</h1>
            </div>
            <div className="studentsInfo_ContentC3">
                <h1>{props.studentsData.stu_diagnostic}</h1>
            </div>
            <div className="studentsInfo_ContentC4">
                <h1>{props.studentsData.stu_user}</h1>
            </div>
        </div>
    );
}