import "jest";

import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import {createUserRecord, getAllKills } from "../src";

const testEnv = functions({
  databaseURL: "https://counting-1a02e.firebaseio.com",
  storageBucket: "counting-1a02e.appspot.com",
  projectId: "counting-1a02e",
}, "./service-account.json");

describe("createUserRecordTest", () => {
  let wrapped:any;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(createUserRecord);
  });

  afterAll( () => {
    admin.firestore().doc("kills/dummyUser").delete();
    testEnv.cleanup();
  });

  test("it creates a user record in Firestore", async () => {
    const user = testEnv.auth.makeUserRecord({uid: "dummyUser"});
    await wrapped(user);

    const doc = await admin.firestore().doc(`kills/${user.uid}`).get();

    expect(doc.data()?.kills).toBe(0);
  });
});


describe('makePayment', () => {

  test('it returns a successful response with a valid card', () => {
    const req = { query: { card: '4242424242424242' } };
    const res = {
      send: (payload) => {
        expect(payload).toBe('Payment processed!');
      },
    };
    makePayment(req as any, res as any);
  });

});

describe('getAllKIlls', () => {
  test('should fetch total number of kills', async () => {

