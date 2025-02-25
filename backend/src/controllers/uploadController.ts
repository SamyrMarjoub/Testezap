import { Request, Response } from 'express';
import { bucket, db } from '../config/firebase';

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const uid = req.body.uid;

    if (!file || !uid) {
      return res.status(400).json({ message: 'Arquivo ou UID ausente' });
    }

    const filePath = `profile_pictures/${uid}.jpg`;
    const fileUpload = bucket.file(filePath);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const downloadURL = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    });

    await db.collection('users').doc(uid).update({
      profilePicture: downloadURL[0],
    });

    res.json({ message: 'Imagem enviada com sucesso', url: downloadURL[0] });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload' });
  }
};
