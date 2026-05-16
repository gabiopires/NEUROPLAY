import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function ApiProfile(req: NextApiRequest, res: NextApiResponse){
    const { action, idStudent, userStudent, passwordStudent, profileImage } = req.query;
    if(req.method === "GET"){
        if(action === "getDataStudent"){
            try{
                const connection = await pool.getConnection();
                const [data]:unknown[] = await connection.query(`
                    SELECT * FROM student WHERE stu_id = ?;
                `,[idStudent]
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
        }
    }else if (req.method === "POST"){
        if(action === "saveDataStudentPhoto"){
            try{
                const connection = await pool.getConnection();
                await connection.query(`
                    UPDATE student SET 
                    stu_user = ?,
                    stu_password = ?,
                    stu_profileImage = ?
                    WHERE stu_id = ?;
                `,[ userStudent, passwordStudent, profileImage, idStudent]
                );

                connection.release();
                return res.status(200).json("Ok");
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }else if(action === "saveDataStudent"){
            try{
                const connection = await pool.getConnection();
                await connection.query(`
                    UPDATE student SET 
                    stu_user = ?,
                    stu_password = ?
                    WHERE stu_id = ?;
                `,[ userStudent, passwordStudent, idStudent]
                );

                connection.release();
                return res.status(200).json("Ok");
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }
    }else if(req.method === "PATCH"){
        if(action === "deleteFaceId"){
            try{
                const connection = await pool.getConnection();
                await connection.query(`
                    UPDATE student SET 
                    stu_faceId = NULL
                    WHERE stu_id = ?;
                `,[idStudent]);

                connection.release();
                return res.status(200).json("Ok");
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }else if(action === "saveFaceId"){
            const { faceId } = req.body;
            try{
                const connection = await pool.getConnection();
                await connection.query(`
                    UPDATE student SET 
                    stu_faceId = ?
                    WHERE stu_id = ?;
                `,[JSON.stringify(faceId), idStudent]);

                connection.release();
                return res.status(200).json("Ok");
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }
    }else{
        return res.status(405).json({ message: "Method unauthorized" });
    }
}
