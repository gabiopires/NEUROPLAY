import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function Login(req: NextApiRequest, res: NextApiResponse){
    const { username, password, userId, action} = req.query;
    if(req.method === "GET"){
        try{
            const connection = await pool.getConnection();
            const [rows_user]:unknown[] = await connection.query(`
                SELECT prof_user AS username, 'Profissional' AS role, prof_id AS id 
                FROM professional 
                WHERE prof_user = ?
                UNION
                SELECT stu_user AS username, 'Estudante' AS role, stu_id AS id 
                FROM student 
                WHERE stu_user = ?;
                `,[username, username]
            );
            connection.release();

            if (Array.isArray(rows_user) && rows_user.length > 0) {
                const user = rows_user[0];
                res.status(200).json(user)
            }else{
                res.status(401).json({message:"Unauthorized"})
            }
        }catch(error){
            console.error("Erro na API de login:", error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }else if(req.method === "POST"){
        if (action == "redefinePassProfessional"){
            try{
            const connection = await pool.getConnection();
            await connection.query(`
                UPDATE professional SET prof_password = ? WHERE prof_id = ?;
                `,[ password, userId]
            );
            connection.release();
            res.status(200).json("Ok")
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }else if (action == "redefinePassStudent"){
            try{
            const connection = await pool.getConnection();
            await connection.query(`
                UPDATE student SET stu_password = ? WHERE stu_id = ?;
                `,[ password, userId]
            );
            connection.release();

            res.status(200).json("Ok")
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }
    }
}


