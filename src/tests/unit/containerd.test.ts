import { Server } from "http";
import request from "supertest";
import WorkerProcess from "../../app";

describe("POST /api/v1/execute", () => {
  let server: Server;

  beforeAll(() => {
    server = WorkerProcess.start();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("executes code and returns the result", async () => {
    const payload = {
      language: "python",
      code: "print([x for x in range(10)])",
    };

    const response = await request(server)
      .post("/api/v1/execute")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.payload).toHaveProperty("stdout");
    expect(response.body.payload.stdout).toContain(
      "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]"
    );
    expect(response.body.error).toBeNull();
  });

  it("returns an error for unsupported languages", async () => {
    const payload = {
      language: "unknownLang",
      code: "print('Hello, World!')",
    };

    const response = await request(server)
      .post("/api/v1/execute")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.payload).toBeNull();
    expect(response.body.error).not.toBeNull();
  });

  it("returns an error for invalid code", async () => {
    const payload = {
      language: "python",
      code: "print('Hello, World!",
    };

    const response = await request(server)
      .post("/api/v1/execute")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.payload).toBeNull();
    expect(response.body.error).not.toBeNull();
  });

  it("returns an error for empty payload", async () => {
    const response = await request(server)
      .post("/api/v1/execute")
      .send({})
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.payload).toBeNull();
    expect(response.body.error).not.toBeNull();
  });

  it("returns an error for missing fields in payload", async () => {
    const payload = { language: "python" };

    const response = await request(server)
      .post("/api/v1/execute")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.payload).toBeNull();
    expect(response.body.error).not.toBeNull();
  });

  it("executes code and returns the result for JavaScript", async () => {
    const payload = {
      language: "javascript",
      code: "console.log('Hello, World!');",
    };

    const response = await request(server)
      .post("/api/v1/execute")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.payload).toHaveProperty("stdout");
    expect(response.body.payload.stdout).toContain("Hello, World!");
    expect(response.body.error).toBeNull();
  });

  it("returns an error for missing language field in payload", async () => {
    const payload = { code: "console.log('Hello, World!');" };

    const response = await request(server)
      .post("/api/v1/execute")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.payload).toBeNull();
    expect(response.body.error).not.toBeNull();
  });

  it("returns an error for unsupported languages", async () => {
    const payload = {
      language: "java",
      code: "System.out.println('Hello, World!');",
    };

    const response = await request(server)
      .post("/api/v1/execute")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.payload).toBeNull();
    expect(response.body.error).not.toBeNull();
  });
});
