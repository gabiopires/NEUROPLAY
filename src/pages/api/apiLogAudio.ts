import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function AudioLogHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { idStudent, idLevel, idActivity, audioType, audio } = req.body;

            if (!idStudent || !idLevel || !audioType || audio === undefined) {
                return res.status(400).json({ message: "Dados obrigatórios faltando." });
            }

            const connection = await pool.getConnection();
            
            await connection.query(`
                INSERT INTO audio_log (log_stu_id, log_lev_id, log_act_id, log_audio_type, log_audio)
                VALUES (?, ?, ?, ?, ?)
            `, [idStudent, idLevel, idActivity || null, audioType, audio]);
            
            connection.release();
            
            return res.status(200).json({ message: "Log de voz salvo com sucesso!" });
        } catch (error) {
            console.error("Erro ao salvar log de voz:", error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }else if (req.method === "GET") {
        const { idStudent } = req.query;
        try {
            const connection = await pool.getConnection();
            
            // Busca os logs do aluno cruzando com o nome do nível
            const [rows]: unknown[] = await connection.query(`
                SELECT 
                al.log_timestamp, 
                al.log_lev_id,
                l.lev_name, 
                al.log_audio_type, 
                al.log_audio
                FROM audio_log al
                LEFT JOIN levels l ON al.log_lev_id = l.lev_id
                WHERE al.log_stu_id = ?
                ORDER BY al.log_timestamp DESC
            `, [idStudent]);
            
            connection.release();

            return res.status(200).json(rows);
        } catch (error) {
            console.error("Erro ao buscar logs:", error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    } else {
        return res.status(405).json({ message: "Método não permitido" });
    }
}