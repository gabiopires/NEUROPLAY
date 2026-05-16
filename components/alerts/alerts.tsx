import { TypeDataAlerts } from "../type";
import Image from "next/image";

interface AlertsProps{
    dataAlert: TypeDataAlerts
}

export default function Alerts(props: AlertsProps){

    let imgIcon:string=""

    //1=alert, 2=info, 3=right answer, 4=wrong answer, 5=error
    if (props.dataAlert.alertType == 1){
        imgIcon="/images/alert.svg"
    }else if (props.dataAlert.alertType == 2){
        imgIcon="/images/alert.svg"
    }else if (props.dataAlert.alertType == 3){
        imgIcon="/images/rigth.svg"
    }else if (props.dataAlert.alertType == 4){
        imgIcon="/images/wrong.svg"
    }else if (props.dataAlert.alertType == 5){
        imgIcon="/images/warning.svg"
    }

    return(
        <div className="bodyAlert">
            <div className="boxAlert">
                <div>
                    <Image alt="" src={imgIcon} width={100} height={100}/>
                </div>
                {props.dataAlert.alertTitle != undefined ?
                    <div className="boxtextAlert">{props.dataAlert.alertTitle}</div>:""
                }
                <div className="boxtextAlert">
                    {props.dataAlert.alertText}
                </div>
                <div className="boxButtonAlerts">
                    {props.dataAlert.alertButtons.map((btn, index)=>(
                        <button key={index} className="buttonAlerts" onClick={()=>{props.dataAlert.alertsCommans[index]()}}>
                            {btn}
                        </button>   
                    ))}
                </div>
            </div>
        </div>
    )
}