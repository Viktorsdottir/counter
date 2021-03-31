import "jest";
import supertest from "supertest";
import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import {api, createUserRecord} from "../src";

const testEnv = functions(
    {
      databaseURL: "https://counting-1a02e.firebaseio.com",
      storageBucket: "counting-1a02e.appspot.com",
      projectId: "counting-1a02e",
    },
    "./service-account.json"
);

describe("createUserRecordTest", () => {
  let wrapped: any;
  // Applies only to tests in this describe block
  beforeAll(() => {
    wrapped = testEnv.wrap(createUserRecord);
  });

  afterAll(() => {
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

describe("GET /getAllKills", function() {
  it("respond with json containing all kills", function(done) {
    supertest(api)
        .get("/getAllKills")
        .set("qAccept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, done);
  });
});

describe("POST /addKills", function() {
  it("respond with json containing kills for a specific user", function(done) {
    supertest(api)
        .post("/addKills")
        .set("qAccept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, done);
  });
});

describe("GET /getMyKills", function() {
  it("respond with json containing kills for a specific user", function(done) {
    supertest(api)
        .get("/getMyKills")
        .set("qAccept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, done);
  });
});
