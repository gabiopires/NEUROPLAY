import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function Login(req: NextApiRequest, res: NextApiResponse){
    const { action, idProfessional } = req.query;
    if(req.method === "GET"){
        if(action === "getDataProfessional"){
            try{
                const connection = await pool.getConnection();
                const [data]:unknown[] = await connection.query(`
                    SELECT 
                        prof_name,
                        prof_profileImage
                    FROM
                        professional
                    WHERE 
                        prof_id = ?;
                `,[idProfessional]
                );

                connection.release();
                if (Array.isArray(data) && data.length > 0) {
                    const response = data[0]
                    return res.status(200).json(response);
                }else{
                    return res.status(401).json({message:"Unauthorized"})
                }
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }else{
            if(action === "getDataStudents"){
            try{
                const connection = await pool.getConnection();

                const [data]:unknown[] = await connection.query(`
                    SELECT 
                        stu_id,
                        stu_name,
                        stu_age,
                        stu_diagnostic,
                        stu_user
                    FROM student WHERE stu_prof_id = ?;
                `,[idProfessional]
                );

                connection.release();
                if (Array.isArray(data) && data.length > 0) {
                    return res.status(200).json(data)
                }else{
                    return res.status(401).json({message:"Unauthorized"})
                }
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }
        }
    }else{
        return res.status(405).json({ message: "Method unauthorized" });
    }
}
