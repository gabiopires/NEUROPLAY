import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../../components/db";

// Função utilitária para o Face ID
function euclideanDistance(a: number[], b: number[]) {
    return Math.sqrt(
        a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
    );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === "GET") {
        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ message: "Usuário e senha são obrigatórios" });
        }

        try {
            const connection = await pool.getConnection();
            const [rows_user]: unknown[] = await connection.query(`
                SELECT prof_user AS username, prof_desc AS role, prof_id AS id 
                FROM professional 
                WHERE prof_user = ? AND prof_password = ?
                UNION
                SELECT stu_user AS username, 'Estudante' AS role, stu_id AS id 
                FROM student 
                WHERE stu_user = ? AND stu_password = ?
            `, [username, password, username, password]);
            
            connection.release();

            if (Array.isArray(rows_user) && rows_user.length > 0) {
                const user = rows_user[0];
                return res.status(200).json(user);
            } else {
                return res.status(401).json({ message: "Unauthorized" });
            }

        } catch (error) {
            console.error("Erro na API de login (Senha):", error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }else if (req.method === "POST") {
        const { face } = req.body;

        if (!face || !Array.isArray(face)) {
            return res.status(400).json({ message: "Dados faciais inválidos ou não fornecidos" });
        }

        try {
            const connection = await pool.getConnection();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [rows]: any[] = await connection.query(`
                SELECT prof_id as id, prof_faceId as face, prof_desc as role FROM professional
                WHERE prof_faceId IS NOT NULL
                UNION
                SELECT stu_id as id, stu_faceId as face, 'Estudante' as role FROM student
                WHERE stu_faceId IS NOT NULL
            `);

            connection.release();

            for (const user of rows) {
                let dbFace;
                try {
                    dbFace = typeof user.face === 'string' ? JSON.parse(user.face) : user.face;
                } catch (e) {
                    console.error(`Erro ao fazer parse da face do usuário ID ${user.id}`, e);
                    continue; 
                }

                if (!Array.isArray(dbFace)) continue;

                const distance = euclideanDistance(face, dbFace);

                if (distance < 0.5) { 
                    return res.status(200).json({
                        id: user.id,
                        role: user.role
                    });
                }
            }

            return res.status(401).json({ message: "Face não reconhecida" });

        } catch (error) {
            console.error("Erro na API de login (Face ID):", error);
            return res.status(500).json({ message: "Erro interno" });
        }
    } 
    
    else {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}