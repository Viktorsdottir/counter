import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import {firestore} from "firebase-admin/lib/firestore";
import FieldValue = firestore.FieldValue;
import {NextFunction, Response} from "express";

admin.initializeApp();

const db = admin.firestore();

const addKillsById = async (req: any, res: any) => {
  try {
    const uid = "239810jdklk";
    const kills = Number(req.query.number);
    const userKillRef = await db.collection("kills").doc(uid);
    const counterKillRef = await db.collection("counters").doc("kills");
    const batch = db.batch();
    batch.set(userKillRef, {kills: FieldValue.increment(kills)},
        {merge: true});
    batch.set(counterKillRef, {count: FieldValue.increment(kills)},
        {merge: true});
    await batch.commit();
    return res.json({result: `Kills: ${kills} added.`});
  } catch (error) {
    {
      return res.status(500).json(error.message);
    }
  }
};

const getKillsById = async (req: any, res: any) => {
  try {
    const uid = "239810jdklk";
    const doc = await db.doc(`kills/${uid}`).get();
    const data = doc.data();
    if (!data) {
      console.error("document does not exist");
      return false;
    }
    const kills:number = data.kills;
    return res.json({result: `Your kills: ${kills}`});
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


const getAllKills = async (req: any, res: any) => {
  try {
    const doc = await db.doc("counters/kills").get();
    const data = doc.data();
    if (!data) {
      console.error("document does not exist");
      return false;
    }
    const count:number = data.count;
    return res.json(count);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


const api = express();

//Decodes the Firebase JSON Web Token
api.use(decodeIDToken);

async function decodeIDToken(req: any, res: Response, next: NextFunction) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];

        try {
            req.user = await admin.auth().verifyIdToken(idToken)
        } catch (err) {
            console.log(err);
        }
    }

    next();
}


api.get("/getMyKills", getKillsById);
api.get("/getAllKills", getAllKills);
api.post("/addKills", addKillsById);
exports.api = functions.https.onRequest(api);
