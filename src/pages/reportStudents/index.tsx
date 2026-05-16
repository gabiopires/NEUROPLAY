import Image from "next/image"
import MenuTop from "../../../components/Top/menuTop"
import { useState, useEffect } from "react"
import { TypeDataAlerts } from "../../../components/type"
import Alerts from "../../../components/alerts/alerts";
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, Title, Legend, LinearScale, PointElement, Tooltip, ArcElement, Filler } from "chart.js";
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend, Filler);

let dataAlerts:TypeDataAlerts ={
    alertType: 0,
    alertText: "",
    alertButtons: [],
    alertsCommans: [],
}

interface QtdDiagnostic {
    stu_diagnostic: string, 
    qtdDiagnostic: number,
}

interface LevelStudents {
    stu_name: string,
    qtdLevelStudents: number
}

interface LevelDiagnostic {
    stu_diagnostic: string,
    qtdLevelDiagnostic: number
}

export default function HomeProfessional(){

    const [showAlerts, setshowAlerts] = useState(false);
    const [dataQtdDiagnostic, setDataQtdDiagnostic] = useState<QtdDiagnostic[]>([])
    const [dataQtdLevelStudents, setDataQtdLevelStudents] = useState<LevelStudents[]>([])
    const [dataQtdLevelDiagnostic, setDataQtdLevelDiagnostic] = useState<LevelDiagnostic[]>([])

    function colorByIndex(index: number, total: number = 10, opacity: number = 1): string {
        const hue = (index * 360 / total) % 360;
        return `hsla(${hue}, 70%, 50%, ${opacity})`;
    }

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            getDataReport(storedId)
        }
    }, [])

    async function getDataReport(idProf: string){
        try{
            const endpoint = `/api/apiProgress?idProfessional=${idProf}&action=getDataReport`; 
            const response = await fetch(endpoint, {method: "GET", cache: "reload"})
            const data = await response.json();
            if(response.status === 200){
                setDataQtdDiagnostic(data.qtdDiagnostic)
                setDataQtdLevelStudents(data.qtdLevelStudents)
                setDataQtdLevelDiagnostic(data.qtdLevelDiagnostic)
            }
            else{
                setshowAlerts(true)
                dataAlerts = {
                    alertType: 5,
                    alertText: "Erro ao carregar dados, tente novamente mais tarde",
                    alertButtons: ["Ok"],
                    alertsCommans: [()=>{setshowAlerts(false)}]
                }
            }
        }catch(error){
        console.error("Error parsing response:", error);
        }
    }



    const labelDiagnostic = [...new Set(dataQtdDiagnostic.map((d) => d.stu_diagnostic))];
    const datasetDiagnostic = {
        label: "Diagnosticos",
        data: labelDiagnostic.map(label => {
            const item = dataQtdDiagnostic.find(d => d.stu_diagnostic === label);
            return item ? item.qtdDiagnostic : 0;
        }),
        backgroundColor: labelDiagnostic.map((label, index)=> {return colorByIndex(index, labelDiagnostic.length, 0.7)}),
        borderColor: labelDiagnostic.map((label, index)=> {return colorByIndex(index, labelDiagnostic.length, 1)}),
    };
    const dataDiagnostic = {
        labels: labelDiagnostic,
        datasets: [datasetDiagnostic],
    }; 

    const labelQtdLevelStudents = [...new Set(dataQtdLevelStudents.map((d) => d.stu_name))];
    const datasetQtdLevelStudents = {
        label: "Estudantes",
        data: labelQtdLevelStudents.map(label => {
            const item = dataQtdLevelStudents.find(d => d.stu_name === label);
            return item ? item.qtdLevelStudents : 0;
        }),
        backgroundColor: labelQtdLevelStudents.map((label, index)=> {return colorByIndex(index, labelQtdLevelStudents.length, 0.7)}),
        borderColor: labelQtdLevelStudents.map((label, index)=> {return colorByIndex(index, labelQtdLevelStudents.length, 1)}),
    };
    const dataLevelStudents = {
        labels: labelQtdLevelStudents,
        datasets: [datasetQtdLevelStudents],
    }; 

    const labelQtdLevelDiagnostic = [...new Set(dataQtdLevelDiagnostic.map((d) => d.stu_diagnostic))];
    const datasetQtdLevelDiagnostic = {
        label: "Diagnostico",
        data: labelQtdLevelDiagnostic.map(label => {
            const item = dataQtdLevelDiagnostic.find(d => d.stu_diagnostic === label);
            return item ? item.qtdLevelDiagnostic : 0;
        }),
        backgroundColor: labelQtdLevelDiagnostic.map((label, index)=> {return colorByIndex(index, labelQtdLevelDiagnostic.length, 0.7)}),
        borderColor: labelQtdLevelDiagnostic.map((label, index)=> {return colorByIndex(index, labelQtdLevelDiagnostic.length, 1)}),
    };
    const dataLevelDiagnostic = {
        labels: labelQtdLevelDiagnostic,
        datasets: [datasetQtdLevelDiagnostic],
    };

    const optionsDiagnostic = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Distribuição de diagnósticos dos alunos',
                color: 'rgba(0, 0, 0)',
            },
        },
    };

    const optionsLevelStudents = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Quantidade de níveis concluidos por estudante',
                color: 'rgba(0, 0, 0)',
            },
        },
    };

    const optionsLevelDiagnostic = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Quantidade de níveis concluidos por diagnostico',
                color: 'rgba(0, 0, 0)',
            },
        },
    };


    return (
        <div className="bodyReport">
            <MenuTop perfilProf={true} perfilStud={false}/>
            {showAlerts&& <Alerts dataAlert={dataAlerts}/>}
            <div className="reportStudentsInfo">
                <Image className="reportStudentsInfoImg" alt="" height={100} width={100} src={'/images/reportProf.png'}/>
                <h1>Relatórios</h1>
            </div>
            <div className="statisticsChartsContent">
                <div className="statisticsCharts">
                    <Bar options={optionsLevelStudents} data={dataLevelStudents} />
                </div>
                <div className="statisticsCharts">
                    <Bar options={optionsDiagnostic} data={dataDiagnostic} />
                </div>
                <div className="statisticsCharts">
                    <Bar options={optionsLevelDiagnostic} data={dataLevelDiagnostic}/>
                </div>
            </div>
        </div>
    )
}