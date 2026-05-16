import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../../components/db';

export default async function RegisterProfessional(req: NextApiRequest, res: NextApiResponse){
  const { nome, descricao, email, username, password} = req.query;
  try{
    const connection = await pool.getConnection();
    const [rowsUser]:unknown[] = await connection.query(`
      SELECT prof_user AS username FROM professional 
      WHERE prof_user = ?
      UNION
      SELECT stu_user AS username FROM student
      WHERE stu_user = ?;
      `,[username, username]
    );
    connection.release();
    if (Array.isArray(rowsUser) && rowsUser.length > 0) {
      res.status(400).json({message: "Bad Request"});
    }else{
      try{
        const connection = await pool.getConnection();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [result]:any[] = await connection.query("SELECT MAX(prof_id) AS lastId FROM professional");
        const lastId = (result)[0].lastId || 0;
        const newId = lastId + 1;  
        await connection.query(`
          INSERT INTO professional (prof_id, prof_desc, prof_name, prof_email, prof_user, prof_password) VALUES (?, ?, ?, ?, ?, ?);`,[newId, descricao, nome, email, username, password]
        );
        connection.release();
        res.status(200).json({'id': newId})
      }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"});
      }
    }
  }catch(error){
    console.error(error)
    res.status(500).json({message:"Internal Server Error"});
  }
}


