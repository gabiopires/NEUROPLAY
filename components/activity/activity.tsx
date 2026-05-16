import Image from "next/image"
import { useState, useEffect, useRef } from "react";
import { TypeDataLevel, TypeDataAlerts } from "../type";
import Alerts from "../alerts/alerts";
import MenuTop from "../Top/menuTop";
import { useRouter } from "next/router";

export interface dataActivity {
    dataLevel: TypeDataLevel,
    comandNextLevel: (indexLevel: number)=>void
}

interface ActivityItem {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    answer: string;
    anotherOptionAudio: string
}

let dataAlerts:TypeDataAlerts ={
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

export default function Activy(props: dataActivity) {    
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [seeIntro, setSeeIntro] = useState("boxIntro");
    const [seeActivity, setSeeActivity] = useState("boxActivityDontShow");
    const [seeLevelStamp, setLevelStamp] = useState("boxLevelStampDontShow");
    const [seeAnimalDescription, setAnimalDescription] = useState("boxAnimalDescriptionDontShow");
    const [seeLevelConclusion, setSeeLevelConclusion] = useState("boxLevelConclusionDontShow");
    const [seeCloseActivity, setSeeCloseActivity] = useState("closeActivity");
    const [wrongActivitys, setWrongActivityes] = useState(0);
    const [rigthAnswer, setRigthAnswer] = useState("");
    const [answerAudio, setAnswerAudio] = useState("");
    const [anotherOptionAudio, setAnotherOptionAudio] = useState([""]);
    const currentActivity = activities[currentIndex];
    const [showAlerts, setshowAlerts] = useState(false);
    const [isListening, setIsListening] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const now =  Date.now()
    const router = useRouter();

    useEffect(() => {
        if (props.dataLevel) {
            setActivities([]);
            setCurrentIndex(0);
        }
    }, [props.dataLevel]);

    const playAudioLevel = () => {
        const audio = new Audio(`/assets/${props.dataLevel.levelAudio}`);
        audio.play();
    };

    const playAudioOptions = (option: string, index: number) => {
        if (option === currentActivity.answer){
            const audio = new Audio(`/assets/${answerAudio}`);
            audio.play();
        }else{
            const tmp_audio = anotherOptionAudio[index]
            const audio = new Audio(`/assets/${tmp_audio}`);
            audio.play();
        }
    };

    const playAudioAnimalDescription = () => {
        const audio = new Audio(`/assets/${props.dataLevel.levelAudioDesc}`);
        audio.play();
    };

    function checkAnswer(option: string) {

        if (option.toLowerCase() === currentActivity.answer.toLowerCase()) {
            setshowAlerts(true)
            dataAlerts = {
                alertType: 3,
                alertText: "Muito bem, a esposta está correta!",
                alertButtons: ["Proxima pergunta"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
            nextActivity()
        }
        else{
            let tmp_wrongActivitys = wrongActivitys
            tmp_wrongActivitys = tmp_wrongActivitys+1
            setWrongActivityes(tmp_wrongActivitys)
            setshowAlerts(true)
            dataAlerts = {
                alertType: 4,
                alertText: option === "ERRO_VOZ" ? 
                    `Não consegui entender. A letra era: ${currentActivity.answer}` : 
                    `Resposta incorreta, a resposta correta é: ${currentActivity.answer}`,
                alertButtons: ["Proxima pergunta"],
                alertsCommans: [()=>{setshowAlerts(false)}]
            }
            nextActivity()
        }
    }

    async function getActivity() {
        try {
            const indexLevel = props.dataLevel.levelId;
            const endpoint = `/api/apiLevels?idLevel=${indexLevel}&action=getDataActivity`; 
            const response = await fetch(endpoint, { method: "GET", cache: "reload" });
            const data = await response.json();
            if (response.status === 200) {
                const dataAnswer = data[0]
                const tmp_answer = dataAnswer.answer
                setRigthAnswer(tmp_answer)
                setActivities(data);  
                setSeeIntro("boxIntroDontShow");
                setSeeActivity("boxActivity");
                setAnswerAudio(dataAnswer.answerAudio);
                const tmp_anotherAudio: string[] = [''];
                data.map((data: ActivityItem, index: number)=>{
                    tmp_anotherAudio[index] = data.anotherOptionAudio
                })
                setAnotherOptionAudio(tmp_anotherAudio);
            }
        } catch (error) {
            console.error("Error parsing response:", error);
        }
    }

    function nextActivity() {
        if (currentIndex + 1 < activities.length) {
            setCurrentIndex(currentIndex + 1);
        }
        else{
            confirmPerformance()
        }   
    }

    function confirmPerformance(){
        if (wrongActivitys >= 2){
            setshowAlerts(true)
            dataAlerts = {
                alertType: 1,
                alertText: `Infelizmente você errou algumas questões, mas não fique triste podemos começar de novo!`,
                alertButtons: [`recomeçar nível ${props.dataLevel.levelId}`, "ir para o caminho de níveis"],
                // Correção Linhas 150 e 151: Ajustado uso de chaves para múltiplos comandos
                alertsCommans: [
                    ()=>{
                        setshowAlerts(false); 
                        props.dataLevel.activityComand[0](); 
                        props.comandNextLevel(props.dataLevel.levelId); 
                        setSeeLevelConclusion("boxLevelConclusionDontShow");
                    }, 
                    ()=>{
                        setshowAlerts(false); 
                        props.dataLevel.activityComand[0]();
                    }
                ]
            }
        }else{
            if(props.dataLevel.levelRepeat === false){
                setLevelStamp("boxLevelStamp")
                setSeeActivity("boxActivityDontShow")
                setSeeCloseActivity("closeActivityDontShow")
            }
            else{
                setSeeLevelConclusion("boxLevelConclusion")
                setSeeActivity("boxActivityDontShow")
            }
        }
    }

    const editDate=()=>{
        const date = new Date(now);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function saveProgress(){
        const date = editDate();
        const idLevel = props.dataLevel.levelId + 1;
        try {
            const endpoint = `/api/apiProgress?idStudent=${props.dataLevel.levelStudentId}&idLevel=${idLevel}&date=${date}&action=savePogressStudent`; 
            const response = await fetch(endpoint, { method: "POST", cache: "reload" });
            // Correção Linha 181: Comentado 'data' para não disparar o 'no-unused-vars'
            // const data = await response.json();
            await response.json();
        } catch (error) {
            console.error("Error parsing response:", error);
        }
    }

    function seeDescription(){
        setLevelStamp("boxLevelStampDontShow")
        setAnimalDescription("boxAnimalDescription")
    }

    async function saveVoiceLog(audioType: string, transcribedText: string) {
        try {
            const bodyData = {
                idStudent: props.dataLevel.levelStudentId,
                idLevel: props.dataLevel.levelId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                idActivity: currentActivity ? (currentActivity as any).act_id : null, 
                audioType: audioType,
                audio: transcribedText 
            };

            fetch('/api/apiLogAudio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            }).catch(err => console.error("Erro ao registrar log de voz:", err));

        } catch (error) {
            console.error("Erro ao preparar log de voz:", error);
        }
    }

    const toggleListening = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Seu navegador não suporta reconhecimento de voz.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = "pt-BR";
        recognition.continuous = false; 
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        let hasProcessed = false; 

        recognition.onstart = () => setIsListening(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            if (hasProcessed) return;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                const textoTranscrito = result[0].transcript.toLowerCase().replace(/\./g, '').trim();
                const respostaCorreta = currentActivity.answer.toLowerCase();
                
                const variacoes: { [key: string]: string[] } = {
                    "a": ["a", "á", "ah", "há", "hã", "áhh"],
                    "e": ["e", "é", "eh", "ê"],
                    "i": ["i", "í", "ih"],
                    "o": ["o", "ó", "ô", "oh", "ou"],
                    "u": ["u", "ú", "uh"]
                };

                const listaAceitos = variacoes[respostaCorreta] || [respostaCorreta];
                
                const acertou = listaAceitos.some(v => 
                    textoTranscrito === v || 
                    textoTranscrito.split(' ').includes(v)
                );

                if (acertou) {
                    hasProcessed = true;
                    saveVoiceLog("CORRECT_ANSWER", textoTranscrito);
                    stopRecognition();
                    checkAnswer(currentActivity.answer);
                    break;
                }

                if (result.isFinal && textoTranscrito !== "") {
                    hasProcessed = true;
                    saveVoiceLog("WRONG_OPTION", textoTranscrito);
                    stopRecognition();
                    checkAnswer("ERRO_VOZ"); 
                    break;
                }
            }
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.start();
    };

    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    };

    return (
        <div className='activity'>
            {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
                <MenuTop/>
            <div className="boxActivityContent">
                {/* Correção de chaves adicionada no botão de fechar para seguir padrão limpo */}
                <button className={seeCloseActivity} onClick={()=>{props.dataLevel.activityComand[0]()}}>Fechar atividade</button>
                <div className={seeIntro}>
                    <div className="IntroDesc">
                        <h1 className="introDescText">{props.dataLevel.levelDescription}</h1>
                    </div>
                    <div className="IntroDesc">
                        <h1 className="introDescText">Escute o seu som:</h1>
                        <Image className="introDescAudio" alt="Animal" height={100} width={100} onClick={playAudioLevel} src="/images/volume_up.svg"/>
                    </div>
                    <button className="buttonIntro" onClick={getActivity}>Começar</button>
                </div>
                <div className={seeActivity}>
                    {currentActivity && 
                        (
                            <>
                                <div className="activityQuestion"><h1 className="activityQuestionText">{currentActivity.question}</h1></div>
                                <div className="questionsOptions">
                                    {currentActivity.optionA && currentActivity.optionA.trim() !== '' ? (
                                    <>
                                        <div className="OptionBox">
                                            <div className="option" onClick={() => checkAnswer(currentActivity.optionA)}>{currentActivity.optionA}</div>
                                            <Image className="introDescAudio" alt="Som" height={100} width={100} onClick={() => playAudioOptions(currentActivity.optionA, currentIndex)} src="/images/volume_up.svg" />
                                        </div>
                                        {currentActivity.optionB && currentActivity.optionB.trim() !== ''?
                                            <div className="OptionBox">
                                                <div className="option" onClick={()=> {checkAnswer(currentActivity.optionB)}}>
                                                    {currentActivity.optionB}
                                                </div>
                                                <Image className="introDescAudio" alt="Animal" height={100} width={100} onClick={()=>playAudioOptions(currentActivity.optionB, currentIndex)} src="/images/volume_up.svg"/>
                                            </div>:''
                                        }
                                        {currentActivity.optionC && currentActivity.optionC.trim() !== ''?
                                            <div className="OptionBox">
                                                <div className="option" onClick={()=> {checkAnswer(currentActivity.optionC)}}>
                                                    {currentActivity.optionC}
                                                </div>
                                                <Image className="introDescAudio" alt="Animal" height={100} width={100} onClick={()=>playAudioOptions(currentActivity.optionC, currentIndex)} src="/images/volume_up.svg"/>
                                            </div>:''
                                        }
                                        {currentActivity.optionD && currentActivity.optionD.trim() !== ''?
                                            <div className="OptionBox">
                                                <div className="option" onClick={()=> {checkAnswer(currentActivity.optionD)}}>
                                                    {currentActivity.optionD}
                                                </div>
                                                <Image className="introDescAudio" alt="Animal" height={100} width={100} onClick={()=>playAudioOptions(currentActivity.optionD, currentIndex)} src="/images/volume_up.svg"/>
                                            </div>:''
                                        }
                                    </>
                                    ) : (
                                        <>
                                            <div className="OptionBox" style={{justifyContent:'space-between'}}>
                                                <div className="OptionBox" onClick={()=>playAudioOptions(currentActivity.answer, currentIndex)}>
                                                    <div className="option">
                                                        {currentActivity.answer}
                                                    </div>
                                                    <Image className="introDescAudio" alt="Animal" height={100} width={100} src="/images/volume_up.svg"/>
                                                </div>
                                            </div>
                                            <div className="OptionBox" onClick={toggleListening} style={{fontSize: "25px", fontWeight: "bold", flexDirection: "column", gap: "10px",backgroundColor: isListening ? '#7CC55C' : '#FFF', transition: 'all 0.3s ease'}}>
                                                <Image className="introDescMicrofone" alt="Animal" height={200} width={200} src="/images/microfone.svg"/>
                                                {isListening ? "Estou te ouvindo" : "Toque para falar"}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )
                    }
                </div>
                {props.dataLevel.levelRepeat == false ?
                    <>
                        <div className={seeLevelStamp}>
                            <div className="SeeStamp">
                                <h1 className="introDescText">Parabéns! Você foi muito bem</h1>
                            </div>
                            <div className="seeStampImgBox">
                                <Image className="seeStampImg" alt="Animal" height={100} width={100} src={`/images/${props.dataLevel.levelStampPhoto}`} />
                                <div className="seeStampAnswer">{rigthAnswer}</div>
                            </div>
                            <div className="SeeStamp">
                                <h1 className="introDescText">Você conquistou um selo!</h1>
                            </div>
                            <button className="buttonSeeStamp" onClick={seeDescription}>Saiba mais sobre o selo</button>
                        </div>
                        <div className={seeAnimalDescription}>
                            <div className="animalDescriptionText">
                                {props.dataLevel.levelAnimalDesc}
                                <Image className="introDescAudio" alt="Animal" height={100} width={100} onClick={playAudioAnimalDescription} src="/images/volume_up.svg"/>
                            </div>
                            <Image className="IntroAnimalPhoto" alt="Animal" height={100} width={100} src={`/images/${props.dataLevel.levelStampPhoto}`} />
                            <button className="buttonAnimalDescription" onClick={()=>{saveProgress(); setAnimalDescription("boxAnimalDescriptionDontShow"); setSeeLevelConclusion("boxLevelConclusion")}}>concluir nivel</button>
                        </div>
                        <div className={seeLevelConclusion}>
                            <div>
                                <Image className="levelConclusionStampImg" alt="Selos" height={100} width={100} src="/images/seeStamp.png" onClick={()=>router.push("/stamp")}/>
                            </div>
                            <div className="levelConclusionProgress">
                                <h1 className="levelConclusionProgressText1">Você completou:</h1>
                                <h1 className="levelConclusionProgressText2">{`${props.dataLevel.levelId} / 10`}</h1>
                            </div>
                            <div className="levelConclusionButtons">
                                {/* Correção Linha 390: Separado múltiplos comandos com ponto e vírgula dentro de bloco de chaves */}
                                <button className="buttonConclusionButton1" onClick={()=>{props.dataLevel.activityComand[0](); props.comandNextLevel(props.dataLevel.levelId+1); setSeeLevelConclusion("boxLevelConclusionDontShow");}}>Próxima ativiade</button>
                                <button className="buttonConclusionButton2" onClick={()=>{props.dataLevel.activityComand[0](); setSeeLevelConclusion("boxLevelConclusionDontShow");}}>Ir para o caminho de níveis</button>
                            </div>
                        </div>
                    </>:
                    <>
                        <div className={seeLevelConclusion}>
                            <div className="boxLevelConclusionRepeat">
                                <Image className="levelConclusionStampRepeat" alt="Selos" height={100} width={100} src="/images/seeStamp.png" onClick={()=>router.push("/stamp")}/>
                                {/* Correção Linhas 401 e 402: Separado múltiplos comandos com chaves e ponto e vírgula */}
                                <button className="buttonConclusionButton2" onClick={()=>{props.dataLevel.activityComand[0](); setSeeLevelConclusion("boxLevelConclusionDontShow");}}>Ir para o caminho de níveis</button>
                            </div>
                        </div>
                    </>
                }
            </div> 
        </div>
    )
}