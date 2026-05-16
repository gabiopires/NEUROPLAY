import MenuTop from "../../../components/Top/menuTop"
import Image from "next/image"
import { useState, useEffect } from "react"
import { TypeDataAlerts } from "../../../components/type"
import Alerts from "../../../components/alerts/alerts"

let dataAlerts:TypeDataAlerts ={
  alertType: 0,
  alertText: "",
  alertButtons: [],
  alertsCommans: [],
}

interface dataStamp{
    progressId: number,
    studentId: number,
    stampId: number,
    aniName: string,
    stampPhoto: string,
    aniDesc: string,
    aniDescAudio: string
}

export default function Stamp(){

    const [seeAnimalStamp, setSeeAnimalStamp] = useState([true, false])
    const [showAlerts, setshowAlerts] = useState(false)
    const [nameAnimal, setNameAnimal] = useState<string[]>([])
    const [photoStamp, setPhotoStmp] = useState<string[]>([])
    const [descAnimal, setDescAnimal] = useState<string[]>([])
    const [audioAnimal, setAudioAnimal] = useState<string[]>([])
    const [stampQtd, setStampQtd] = useState(-1);
    const [numStamps, setNumStamps] = useState([0,0,0,0,0,0,0,0,0,0])

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            getProgressStamp(storedId);
        }
    }, [])

    const playAudioOptions = (animalAudio: string) => {
        const audio = new Audio(`/assets/${animalAudio}`);
        audio.play();
    };

    function seeTab(index: number){
        const tmp_seeAnimalStamp = [...seeAnimalStamp]
        for(let i = 0; i < tmp_seeAnimalStamp.length; i++){
            if (i == index){
                tmp_seeAnimalStamp[i] = true;
            }else {
                tmp_seeAnimalStamp[i] = false;
            }
        }
        setSeeAnimalStamp(tmp_seeAnimalStamp)
    }

    async function getProgressStamp(idUser: string){
        try{
            const endpoint = `/api/apiProgress?idStudent=${idUser}&action=getProgressStamp`; 
            const response = await fetch(endpoint, {method: "GET", cache: "reload"})
            const data = await response.json();
            if(response.status === 200){
                setStampQtd(data.length);
                const tmp_name:string[] = [""], tmp_photo:string[] = [""], tmp_desc:string[] = [""], tmp_audio:string[] = ['']
                const tmp_num = numStamps
                data.map((u:dataStamp, index:number)=>{
                    tmp_name[index] = u.aniName;
                    tmp_photo[index] = u.stampPhoto;
                    tmp_num[index] = u.progressId;
                    tmp_desc[index] = u.aniDesc;
                    tmp_audio[index] = u.aniDescAudio
                })
                setPhotoStmp(tmp_photo);
                setNameAnimal(tmp_name);
                setNumStamps(tmp_num);
                setDescAnimal(tmp_desc);
                setAudioAnimal(tmp_audio);
            }
            else if(response.status === 401){
                setStampQtd(0);
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 1,
                    alertText: "Você ainda não possui selos, comece completando o nível 1",
                    alertButtons: ["Ok"],
                    alertsCommans: [()=>{setshowAlerts(false)}]
                }
            }else{
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro ao carregar atividade, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [()=>{setshowAlerts(false)}]
                }
            }
        }catch(error){
            console.error("Error parsing response:", error);
        }
    }

    return(
        <div className="bodyStamp">
            {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
            <div>
                <MenuTop perfilProf={false} perfilStud={true}/>
            </div>
            <div className="medalStamps">
                <div className="circleMedal">
                    <div className="circleMedal1">
                        <Image alt="" className="stampImage" height={100} width={100} src={"/images/stamp.png"}/>
                    </div>
                </div>
                <div className="squareMedal">
                    {`${stampQtd}/10`}
                </div>
            </div>
            <div className="stamp">
                <div className="tabAnimalStamp">
                    <div className={`tabStamp ${seeAnimalStamp[0] ? "tabStampSelect":""}`} onClick={()=>seeTab(0)}>Selos</div>
                    <div className={`tabAnimal ${seeAnimalStamp[1] ? "tabAnimalSelect":""}`} onClick={()=>seeTab(1)}>Animais</div>
                </div>
                <div className="stampBox">
                    {seeAnimalStamp[0] ?
                        <div className="rowStamp">
                            {numStamps.map((i, index)=>(
                                <div className="stampContent" key={index}>
                                    <div className="stampItem">
                                        {i != 0 ?
                                            <Image alt="" className="stampImage" height={100} width={100} src={`/images/${photoStamp[index]}`}/>
                                            :"?"
                                        }
                                    </div>
                                    {i != 0 ?`${nameAnimal[index]}`:`Nível ${index+1}`}
                                </div>
                            ))
                            }
                        </div>
                    : seeAnimalStamp[1] ?
                        <div className="rowAnimal">
                            {numStamps.map((i, index)=>(
                                <div className="animalContent" key={index}>
                                    <div className="animalItem">
                                        {i != 0 ?
                                            <Image alt="" className="animalImage" height={100} width={100} src={`/images/${photoStamp[index]}`}/>
                                            :"?"
                                        }
                                    </div>
                                    <div className="animalDescription">
                                        {i != 0 ?
                                            <div className="nameAnimal">
                                                {`${nameAnimal[index]}:`}
                                            </div>
                                            :`Desbloqueie o nível ${index+1}`
                                        }
                                        <div>{descAnimal[index]}</div>
                                    </div>
                                    {i != 0 ?
                                        <Image className="introDescAudio" alt="Animal" height={100} width={100} onClick={()=>playAudioOptions(audioAnimal[index])} src="/images/volume_up.svg"/>
                                        :""
                                    }
                                </div>
                            ))
                            }
                        </div>
                    :""}
                </div>
            </div>
        </div>
    );
}
