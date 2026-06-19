import request from "supertest";
import { createDataSandbox } from "../helpers/fs-sandbox";
import { readJSON } from "../../utils/file.util";
import { RECOMMENDATIONS_PATH, REVIEWS_PATH } from "../../constants/paths";

describe("New modules API", () => {
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

  it("locale detect/get/set works via session cookie", async () => {
    const agent = request.agent(app);

    const detect = await agent.get("/locale/detect");
    expect(detect.status).toBe(200);
    expect(["ru", "be"]).toContain(detect.body.locale);

    const set = await agent.post("/locale").send({ locale: "be" });
    expect(set.status).toBe(200);
    expect(set.body.locale).toBe("be");

    const get = await agent.get("/locale");
    expect(get.status).toBe(200);
    expect(get.body.locale).toBe("be");
  });

  it("recommendations like/feed works for authorized user", async () => {
    const agent = request.agent(app);
    const email = `rec-${Date.now()}@mail.test`;
    await agent.post("/auth/register").send({ email, password: "123456" });

    const like = await agent.post("/recommendations/like").send({ productId: 1 });
    expect(like.status).toBe(200);

    const feed = await agent.get("/recommendations");
    expect(feed.status).toBe(200);
    expect(Array.isArray(feed.body.recommended)).toBe(true);
    expect(Array.isArray(feed.body.feed)).toBe(true);

    const rawProfiles = readJSON(RECOMMENDATIONS_PATH);
    expect(Array.isArray(rawProfiles)).toBe(true);
    expect(rawProfiles.length).toBeGreaterThan(0);
  });

  it("reviews create/list and average rating work", async () => {
    const agent = request.agent(app);
    const email = `review-${Date.now()}@mail.test`;
    await agent.post("/auth/register").send({ email, password: "123456" });

    const create = await agent
      .post("/reviews")
      .send({ productId: 1, rating: 5, comment: "Отлично" });

    expect(create.status).toBe(201);

    const list = await agent.get("/reviews/1");
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.reviews)).toBe(true);
    expect(list.body.averageRating).toBeGreaterThanOrEqual(1);

    const rawReviews = readJSON(REVIEWS_PATH);
    expect(rawReviews.length).toBeGreaterThan(0);
  });

  it("admin product management requires role and allows owner", async () => {
    const owner = request.agent(app);

    const denied = await owner.get("/admin/products");
    expect(denied.status).toBe(401);

    const login = await owner
      .post("/admin/session-login")
      .send({ email: "owner@com", password: "owner@com" });
    expect(login.status).toBe(200);
    expect(login.body.role).toBe("owner");

    const list = await owner.get("/admin/products");
    expect(list.status).toBe(200);
    const initialLength = list.body.length;

    const created = await owner.post("/admin/products").send({
      name: "Admin test product",
      description: "Created from test",
      price: 123,
      category: "test",
      available: true,
      image: "/images/test.png",
      stock: 2,
      tags: ["test", "admin"],
    });
    expect(created.status).toBe(201);

    const update = await owner.patch(`/admin/products/${created.body.id}`).send({
      price: 150,
      stock: 5,
    });
    expect(update.status).toBe(200);
    expect(update.body.price).toBe(150);

    const after = await owner.get("/admin/products");
    expect(after.body.length).toBe(initialLength + 1);
  });
});
