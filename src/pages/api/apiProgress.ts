import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function Login(req: NextApiRequest, res: NextApiResponse){
    const { action, idStudent, idLevel, date, idProfessional } = req.query;
    if(req.method === "GET"){
        if(action === "getProgressStamp"){
            try{
                const connection = await pool.getConnection();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [result]:any[] = await connection.query(`SELECT MAX(prog_id) AS lastId FROM progress WHERE prog_stu_id = ?;`,[idStudent]);
                const lastId = (result)[0].lastId

                const [progress]:unknown[] = await connection.query(`
                    SELECT 
                        p.prog_id AS progressId,
                        prog_stu_id AS studentId,
                        ps.progSta_sta_id AS stampId,
                        sta.sta_photo AS stampPhoto,
                        ani.ani_name AS aniName,
                        ani_desc AS aniDesc,
                        ani.ani_descAudio AS aniDescAudio
                    FROM 
                        progress p
                    LEFT JOIN progress_stamp ps ON ps.progSta_prog_id = p.prog_id
                    LEFT JOIN stamp sta ON sta.sta_id = ps.progSta_sta_id
                    LEFT JOIN progress_animal progAni ON progAni.progAni_prog_id = p.prog_id
                    LEFT JOIN animal ani ON ani.ani_id = progAni.progAni_ani_id
                    WHERE prog_stu_id = ?
                    AND prog_id != ?;
                `,[idStudent, lastId]
                );
                connection.release();
                if (Array.isArray(progress) && progress.length > 0) {
                    const level = progress
                    return res.status(200).json(level)
                }else{
                    return res.status(401).json({message:"Unauthorized"})
                }
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }else if(action === "getProgressStudentsProf"){
            try{
                const connection = await pool.getConnection();
                const [progress]:unknown[] = await connection.query(`
                    WITH ultimos_progresso AS (
                    SELECT
                        pr.prog_stu_id,
                        pr.prog_lev_id,
                        pr.prog_date,
                        ROW_NUMBER() OVER (PARTITION BY pr.prog_stu_id ORDER BY pr.prog_date DESC, pr.prog_id DESC) AS rn
                    FROM progress pr
                    )
                    SELECT 
                    s.stu_id,
                    s.stu_name,
                    up.prog_lev_id,
                    DATE_FORMAT(up.prog_date, '%d/%m/%Y') AS prog_date
                    FROM ultimos_progresso up
                    JOIN student s ON up.prog_stu_id = s.stu_id
                    WHERE up.rn = 1 AND s.stu_prof_id = ?
                    ORDER BY s.stu_name;
                    `,[idProfessional]
                );
                connection.release();
                if (Array.isArray(progress) && progress.length > 0) {
                    const level = progress
                    return res.status(200).json(level)
                }else{
                    return res.status(401).json({message:"Unauthorized"})
                }
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }else if(action === "getDataReport"){
            try{
                const connection = await pool.getConnection();
                const [rows_qtdDiagnostic]:unknown[] = await connection.query(`
                    SELECT 
                        stu_diagnostic ,
                        COUNT(*) AS qtdDiagnostic
                    FROM 
                        student
                    WHERE stu_prof_id = ?
                    GROUP BY 
                        stu_diagnostic;
                    `,[idProfessional]
                );

                const [rows_qtdLevelDiagnostic]:unknown[] = await connection.query(`
                    SELECT 
                        stu.stu_diagnostic,
                        COUNT(DISTINCT CONCAT(p.prog_stu_id, '-', p.prog_lev_id)) AS qtdLevelDiagnostic
                    FROM 
                        progress p
                    JOIN 
                        student stu ON p.prog_stu_id = stu.stu_id
                    WHERE p.prog_lev_id != 1 AND stu_prof_id = ?
                    GROUP BY 
                        stu.stu_diagnostic;
                    `,[idProfessional]
                );

                const [rows_qtdLevelStudents]:unknown[] = await connection.query(`
                    SELECT 
                        s.stu_name,
                        COUNT(DISTINCT p.prog_lev_id) AS qtdLevelStudents
                    FROM 
                        progress p
                    JOIN 
                        student s ON p.prog_stu_id = s.stu_id
                    WHERE p.prog_lev_id != 1 AND s.stu_prof_id = ?
                    GROUP BY 
                        s.stu_name
                    ORDER BY 
                        qtdLevelStudents DESC;
                    `,[idProfessional]
                );
                connection.release();

                const dataReturn={
                    qtdDiagnostic: rows_qtdDiagnostic,
                    qtdLevelDiagnostic: rows_qtdLevelDiagnostic,
                    qtdLevelStudents: rows_qtdLevelStudents,
                };
                
                return res.status(200).json(dataReturn)
                
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }
    }else if(req.method === "POST"){
        if(action === "savePogressStudent"){
            try{
                
                const connection = await pool.getConnection();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [result]:any[] = await connection.query("SELECT MAX(prog_id) AS lastId FROM progress");
                const lastId = (result)[0].lastId || 0;
                const newId = lastId + 1; 
                await connection.query(`
                    INSERT INTO progress (prog_id, prog_stu_id, prog_lev_id, prog_date) VALUES (?, ?, ?, ?);
                `,[newId, idStudent, idLevel, date]
                );
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [resultAni]:any[] = await connection.query("SELECT MAX(progAni_id) AS lastId FROM progress_animal");
                const lastIdAni = (resultAni)[0].lastId || 0;
                const newIdAni = lastIdAni + 1; 
                await connection.query(`
                    INSERT INTO progress_animal (progAni_id, progAni_prog_id, progAni_ani_id, progAni_date) VALUES (?, ?, ?, ?);
                `,[ newIdAni, newId, idLevel, date]
                );
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [resultSta]:any[] = await connection.query("SELECT MAX(progSta_id) AS lastId FROM progress_stamp");
                const lastIdSta = (resultSta)[0].lastId || 0;
                const newIdSta = lastIdSta + 1; 
                await connection.query(`
                    INSERT INTO progress_stamp (progSta_id, progSta_prog_id, progSta_sta_id, progSta_date) VALUES (?, ?, ?, ?);
                `,[ newIdSta, newId, idLevel, date]
                );

                connection.release();
                res.status(200).json("Ok")
            }catch(error){
                console.error("Erro na API de login:", error);
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        }
    } else{
        return res.status(405).json({ message: "Method unauthorized" });
    }
}
