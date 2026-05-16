import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import formidable from "formidable";

// Desativa o body-parser padrão do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }else{
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
    });

    // Envolvendo o parse em uma Promise
    const parseForm = (): Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }> => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });
    };

    try {
      const { fields, files } = await parseForm();

      const name_file = fields.name_file?.toString() || "file";
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      // Verifica se o arquivo realmente foi enviado
      if (!file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      const newFileName = `${name_file}`;
      const newFilePath = path.join(uploadDir, newFileName);

      await fs.promises.rename(file.filepath, newFilePath);

      return res.status(200).json({ success: true, filePath: `public/uploads/${newFileName}`});

    }catch (err) {
      console.error("Erro no upload:", err);
      return res.status(500).json({ error: "Erro no upload do arquivo" });
    }
  }
}
