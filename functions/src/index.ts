import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import {firestore} from "firebase-admin/lib/firestore";
import FieldValue = firestore.FieldValue;

admin.initializeApp();

const db = admin.firestore();

export const createUserRecord = functions.auth
    .user()
    .onCreate((user, context) => {
      return admin.firestore().doc(`kills/${user.uid}`).set({kills: 0});
    });

export const addKillsById = async (req: any, res: any) => {
  try {
    const {uid} = req.user;
    const kills = Number(req.query.number);
    const userKillRef = await db.collection("kills").doc(uid);
    const counterKillRef = await db.collection("counters").doc("kills");
    const batch = db.batch();
    batch.set(
        userKillRef,
        {kills: FieldValue.increment(kills)},
        {merge: true}
    );
    batch.set(
        counterKillRef,
        {count: FieldValue.increment(kills)},
        {merge: true}
    );
    await batch.commit();
    return res.json({result: `Kills: ${kills} added.`});
  } catch (error) {
    {
      return res.status(500).json(error.message);
    }
  }
};

export const getKillsById = async (req: any, res: any) => {
  try {
    const {uid} = req.user;
    const doc = await db.doc(`kills/${uid}`).get();
    const data = doc.data();
    if (!data) {
      return false;
    }
    const kills: number = data.kills;
    return res.json({result: `Your kills: ${kills}`});
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getAllKills = async (req: any, res: any) => {
  try {
    const doc = await db.doc("counters/kills").get();
    const data = doc.data();
    if (!data) {
      return false;
    }
    const count: number = data.count;
    return res.json(count);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const api = express();

// Decodes the Firebase JSON Web Token
async function decodeIDToken(req: any, res: any, next: any) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedIdToken) => {
          req.user = decodedIdToken;
          return next();
        })
        .catch((error) => {
          console.error("Error while verifying Firebase ID token:", error);
          return res.status(403).send("Unauthorized");
        });
  }
}

api.get("/getMyKills", decodeIDToken, getKillsById);
api.get("/getAllKills", getAllKills);
api.post("/addKills", decodeIDToken, addKillsById);

exports.api = functions.https.onRequest(api);
