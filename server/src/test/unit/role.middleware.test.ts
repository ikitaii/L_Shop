import { Request, Response } from "express";
import { createDataSandbox } from "../helpers/fs-sandbox";
import { requireRole } from "../../middlewares/role.middleware";

type TestResponse = Response & {
  statusCode: number;
  jsonPayload: unknown;
};

const createResponse = () => {
  const res = {
    statusCode: 200,
    jsonPayload: null as unknown,
    status(this: TestResponse, code: number) {
      this.statusCode = code;
      return this;
    },
    json(this: TestResponse, payload: unknown) {
      this.jsonPayload = payload;
      return this;
    },
    cookie(this: TestResponse) {
      return this;
    },
  } as unknown as TestResponse;
  return res;
};

describe("role middleware", () => {
  let cleanup: () => void;

  beforeAll(() => {
    const sandbox = createDataSandbox();
    cleanup = sandbox.cleanup;
  });

  afterAll(() => {
    cleanup();
  });

  it("denies request without auth cookie", () => {
    const req = { cookies: {} } as Request;
    const res = createResponse();
    const next = jest.fn();

    requireRole(["owner"])(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });
});
