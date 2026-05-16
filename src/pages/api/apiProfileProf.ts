import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function ApiProfile(req: NextApiRequest, res: NextApiResponse){
    const { action, idProfessional, userProfissional, emailProfissional, passwordProfessional, profileImage } = req.query;
    if(req.method === "GET"){
        if(action === "getDataProfessional"){
            try{
                const connection = await pool.getConnection();
                const [data]:unknown[] = await connection.query(`
                    SELECT * FROM professional WHERE prof_id = ?;
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
        }
    }else if (req.method === "POST"){
        if(action === "saveDataProfessionalPhoto"){
            try{
                const connection = await pool.getConnection();
                await connection.query(`
                    UPDATE professional SET 
                    prof_email = ?,
                    prof_user = ?,
                    prof_password = ?,
                    prof_profileImage = ?
                    WHERE prof_id = ?;
                `,[emailProfissional, userProfissional, passwordProfessional, profileImage, idProfessional]
                );

                connection.release();
                return res.status(200).json("Ok");
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }else if(action === "saveDataProfessional"){
            try{
                const connection = await pool.getConnection();
                await connection.query(`
                    UPDATE professional SET 
                    prof_email = ?,
                    prof_user = ?,
                    prof_password = ?
                    WHERE prof_id = ?;
                `,[emailProfissional, userProfissional, passwordProfessional, idProfessional]
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
                    UPDATE professional SET 
                    prof_faceId = NULL
                    WHERE prof_id = ?;
                `,[idProfessional]);

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
                    UPDATE professional SET 
                    prof_faceId = ?
                    WHERE prof_id = ?;
                `,[JSON.stringify(faceId), idProfessional]);

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
