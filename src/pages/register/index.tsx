import Image from "next/image"
import MenuTop from "../../../components/Top/menuTop"
import { useState } from "react"
import { useRouter } from "next/router";

export default function Login(){

    const router = useRouter()

    const [boxselect, setboxselect] = useState("")
    const boxTextUser = ["Aluno", "Professor/Tutor", "Terapeuta"]
    const boxImg = ["images/alunos.svg", "images/professor.svg", "images/terapeuta.svg"]
    const boxTextWant = ["Quero aprender", "Quero ensinar", "Quero auxiliar"]
    const boxVisual = ["textStudent", "textTeacher", "textTherapist"]
    

    const handleSelect = (card: string)=>{
        setboxselect(card);
    }

  return (
    <div className="bodyCadastro">
        <MenuTop/>
        <h1 className="textWhoYou">Diga-me quem é você:</h1>
        <div className="boxOptionsRegister">
            {
                ["studentRegister", "teacherRegister", "therapistRegister"].map((o, i)=>
                    <div key={i} className={`${o} ${boxselect === o ? `${o}Select` : ""}`} onClick={()=> handleSelect(o)}>
                        <Image className="UsertImg" alt={boxTextUser[i]} src={boxImg[i]} width={100} height={100}/>
                        <h1 className={boxVisual[i]}>{boxTextUser[i]}</h1>
                        <h1 className="textWant">{boxTextWant[i]}</h1>
                    </div>
                )
            }
        </div>
        <button className="buttonRegisterSelect" onClick={()=> router.push(`/register/${boxselect}`)}>Selecionar</button>
    </div>
  )}