import supertest from "supertest";
import app from "../app";
import dbInit from "../database/init";
import postgressConnection from "../database/connection";
import { QueryTypes } from "sequelize";
import session from "supertest-session";

describe("test authentication controller", function () {
  beforeAll(async function () {
    await dbInit();
  });

  afterAll(async function () {
    postgressConnection.query("DELETE FROM users WHERE user_name='adnan' ", {
      type: QueryTypes.DELETE,
    });
  });
  test("Login with the correct identifier and password", async function () {
    const result = await supertest(app)
      .post("/users/login")
      .send({ identifier: "irsyadun", password: "irsyadun1234" });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("Login successful");
  });

  test("Login with Empty identifier and password", async function () {
    const result = await supertest(app)
      .post("/users/login")
      .send({ identifier: "", password: "" });
    expect(result.statusCode).toEqual(403);
    expect(result.body.err.errors[0].msg).toBe("User Does Not Exist");
  });

  test("Register User with incorrect username that has number", async function () {
    const result = await supertest(app).post("/users").send({
      username: "adnan1243",
      password: "adnan1234",
      email: "adnan@gmail.com",
    });
    expect(result.statusCode).toEqual(403);
    expect(result.body.err.errors[0].msg).toBe("Must Be Alphabet Only");
  });

  test("Register User with incorrect email", async function () {
    const result = await supertest(app).post("/users").send({
      username: "adnan",
      password: "adnan1234",
      email: "adnan@gmail",
    });
    expect(result.statusCode).toEqual(403);
    expect(result.body.err.errors[0].msg).toBe("Must be email");
  });

  test("Register User with correct parameter", async function () {
    const result = await supertest(app).post("/users").send({
      username: "adnan",
      password: "adnan1234",
      email: "adnan@gmail.com",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("Account Created");
  });
});

describe("test protected route", function () {
  const identifier = "irsyadun";
  const password = "irsyadun1234";
  let authSession;

  beforeEach(async () => {
    authSession = session(app); // Use request.agent to maintain cookies
    await authSession.post("/users/login").send({ identifier, password });
  });

  test("Check Logout", async () => {
    const logoutResponse = await authSession.post("/users/logout");
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe("Successfully logout");
  });
});
