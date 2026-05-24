import { TypeStudentsProgressData } from "../type";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface studentsProps {
    studentsData: TypeStudentsProgressData;
}


export default function StudentsProgress(props: studentsProps){


    const downloadPDF = async () => {
        try {
            //Busca os dados na API
            const response = await fetch(`/api/apiLogAudio?idStudent=${props.studentsData.stu_id}`);
            if (!response.ok) {
                alert("Erro ao buscar os logs do aluno.");
                return;
            }
            const logs = await response.json();

            if (logs.length === 0) {
                alert("Este aluno ainda não possui atividades registradas.");
                return;
            }

            //Inicia o documento PDF
            const doc = new jsPDF();
            
            //Título do Documento
            doc.text(`Relatório de Atividades - ${props.studentsData.stu_name}`, 14, 15);

            //Monta as colunas e as linhas da tabela
            const tableColumn = ["Data e Hora", "N° Nível", "Tipo Nível", "Tipo de Ação", "Áudio / Resposta"];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tableRows: any[] = [];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            logs.forEach((log: any) => {
                const logData = [
                    new Date(log.log_timestamp).toLocaleString('pt-BR'), // Formata a data para o Brasil
                    log.log_lev_id,
                    log.lev_name || "N/A",
                    log.log_audio_type == "CORRECT_ANSWER" ? "Resposta Correta" : "Resposta Incorreta",
                    log.log_audio
                ];
                tableRows.push(logData);
            });

            //Gera a tabela no PDF
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20, // Espaço entre o título e a tabela
            });

            //Salva e faz o download do arquivo
            doc.save(`Relatorio_${props.studentsData.stu_name}.pdf`);

        } catch (error) {
            console.error("Erro detalhado ao gerar o PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF.");
        }
    };

    return (
        <div className="bodyStudentsProgress">
            <div className="studentsProgress_contentC1">
                <h1>{props.studentsData.stu_name}</h1>
            </div>
            <div className="studentsProgress_ContentC2">
                <h1>{props.studentsData.prog_lev_id}</h1>
            </div>
            <div className="studentsProgress_ContentC3">
                <h1>{props.studentsData.prog_date}</h1>
            </div>
            <div className="studentsInfo_ContentC5">
                <button onClick={downloadPDF} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                    <Image src="/images/download_icon.svg" alt="Baixar Relatório" width={25} height={25} />
                </button>
            </div>
        </div>
    );
}