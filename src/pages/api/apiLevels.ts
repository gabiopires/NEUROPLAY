import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function Login(req: NextApiRequest, res: NextApiResponse){
  const { idLevel, action, idStudent } = req.query;
  if(req.method === "GET"){
    if(action === "getDataLevel"){
      try{
        const connection = await pool.getConnection();
        const [rows_dataActivitys]:unknown[] = await connection.query(`
          SELECT 
            l.lev_name AS lType,
            l.lev_description AS lDescription,
            a.ani_name AS aName,
            a.ani_desc AS aDesc,
            a.ani_photo AS aPhoto,
            s.sta_photo AS sPhoto,
            act.act_ansAudio AS answerAudio,
            a.ani_descAudio AS levelAudioDesc
          FROM levels l
          JOIN animal a ON l.lev_ani_id = a.ani_id
          JOIN stamp s ON l.lev_sta_id = s.sta_id
          JOIN activity act ON l.lev_id = act.act_lev_id
          WHERE 
            l.lev_id = ?
          GROUP BY 
            answerAudio;
          `,[idLevel]
        );
        connection.release();
        if (Array.isArray(rows_dataActivitys) && rows_dataActivitys.length > 0) {
          const dataActivitys = rows_dataActivitys[0]
          const dataReturn = {
            lev_description: dataActivitys.lDescription,
            animal_description: dataActivitys.aDesc,
            animal_photo: dataActivitys.aPhoto,
            stamp_photo: dataActivitys.sPhoto,
            lev_audio: dataActivitys.answerAudio,
            aniDesc_audio: dataActivitys.levelAudioDesc
          }
          return res.status(200).json(dataReturn)
        }
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
    else if(action === "getDataActivity"){
      try{
        const connection = await pool.getConnection();
        const [rows_activitys]:unknown[] = await connection.query(`
         SELECT 
            act.act_question As question,
            act.act_optionA AS optionA,
            act.act_optionB AS optionB,
            act.act_optionC AS optionC,
            act.act_optionD AS optionD,
            act.act_answer AS answer,
            act.act_ansAudio AS answerAudio,
            act.act_anotherOptionAudio AS anotherOptionAudio
          FROM activity act 
          JOIN levels l ON act.act_lev_id = l.lev_id
          WHERE 
            l.lev_id = ?;
          `,[idLevel]
        );
        connection.release();
    
        if (Array.isArray(rows_activitys) && rows_activitys.length > 0) {
          const activity = rows_activitys
          return res.status(200).json(activity)
        }else{
          return res.status(401).json({message:"Unauthorized"})
        }
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
    else if(action === "getProgressLevel"){
      try{
        const connection = await pool.getConnection();
        const [progress]:unknown[] = await connection.query(`
          SELECT MAX(prog_lev_id) AS prog_id FROM progress WHERE prog_stu_id = ?;
        `,[idStudent]);
        connection.release();
        if (Array.isArray(progress) && progress.length > 0) {
          const level = progress[0]
          return res.status(200).json(level)
        }else{
          return res.status(401).json({message:"Unauthorized"})
        }
      }catch(error){
        console.error("Erro na API de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  }
  else{
    return res.status(405).json({ message: "Method unauthorized" });
  }
}
