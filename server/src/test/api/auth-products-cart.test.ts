import request from "supertest";
import { createDataSandbox } from "../helpers/fs-sandbox";

describe("Auth/Products/Cart smoke", () => {
  let app: typeof import("../../app").default;
  let cleanup: () => void;

  beforeAll(async () => {
    const sandbox = createDataSandbox();
    cleanup = sandbox.cleanup;
    app = (await import("../../app")).default;
  });

  afterAll(() => {
    cleanup();
  });

  it("register/login/me/logout flow works", async () => {
    const agent = request.agent(app);
    const email = `user-${Date.now()}@mail.test`;

    const register = await agent.post("/auth/register").send({ email, password: "123456" });
    expect(register.status).toBe(201);

    const meAfterRegister = await agent.get("/auth/me");
    expect(meAfterRegister.status).toBe(200);
    expect(meAfterRegister.body.email).toBe(email);

    const logout = await agent.post("/auth/logout");
    expect(logout.status).toBe(200);

    const meAfterLogout = await agent.get("/auth/me");
    expect(meAfterLogout.status).toBe(401);

    const login = await agent.post("/auth/login").send({ email, password: "123456" });
    expect(login.status).toBe(200);
  });

  it("products endpoint works and guest cart is empty", async () => {
    const agent = request.agent(app);
    const productsRes = await agent.get("/products");
    expect(productsRes.status).toBe(200);
    expect(Array.isArray(productsRes.body)).toBe(true);

    const guestCart = await agent.get("/cart");
    expect(guestCart.status).toBe(200);
    expect(Array.isArray(guestCart.body)).toBe(true);
    expect(guestCart.body.length).toBe(0);
  });

  it("authorized user can add and read cart", async () => {
    const agent = request.agent(app);
    const email = `cart-${Date.now()}@mail.test`;
    await agent.post("/auth/register").send({ email, password: "123456" });

    const productsRes = await agent.get("/products");
    const firstProductId = productsRes.body[0]?.id;

    const add = await agent.post("/cart").send({ productId: firstProductId, quantity: 1 });
    expect(add.status).toBe(200);

    const cart = await agent.get("/cart");
    expect(cart.status).toBe(200);
    expect(Array.isArray(cart.body)).toBe(true);
    expect(cart.body.length).toBeGreaterThan(0);
  });
});
