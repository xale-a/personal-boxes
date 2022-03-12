import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../utils/firebase-admin';

const sendData = async (res: NextApiResponse, boxid: string) => {
  const contentSnap = await db.doc(`boxes/${boxid}/private/content`).get();

  res.status(200).json(contentSnap.data());
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { boxid, key, uid } = req.query;

    // Get box
    const boxSnap = await db.doc('boxes/' + boxid).get();

    if (!boxSnap.exists) {
      // Box not found error
      return res.status(404).json({ error: { code: 404, message: 'Box not found.' } });
    }

    // Bypass if box is unlocked
    if (boxSnap.data()?.unlocked) {
      //! Send content
      return await sendData(res, '' + boxid);
    }

    // Get box key
    const boxKeySnap = await db.doc(`boxes/${boxid}/private/key`).get();

    if (!boxKeySnap.exists) {
      // Box key doesn't exist - throw server error
      throw Error('Box key doesn\'t exist');
    }

    // Box unlock
    if (boxKeySnap.data()?.value === key) {
      // Setup fast access if logged in
      if (uid) {
        await db.doc(`users/${uid}/keys/${boxid}`).set({ value: key });
      }

      //! Send content
      return await sendData(res, '' + boxid);
    }

    // Wrong key error
    return res.status(403).json({ error: { code: 403, message: 'Access denied.' } });
  } catch (error) {
    // Server error
    console.log(error);
    return res.status(500).json({ error: { code: 500, message: 'Server error.' } });
  }
}
