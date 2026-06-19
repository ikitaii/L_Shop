import { Review } from "../../types/review";

const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) {
    return 0;
  }
  const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
  return Number((sum / reviews.length).toFixed(2));
};

describe("reviews average helper", () => {
  it("returns 0 for empty list", () => {
    expect(calculateAverageRating([])).toBe(0);
  });

  it("returns rounded average", () => {
    const reviews: Review[] = [
      {
        id: 1,
        productId: 1,
        userId: 1,
        rating: 5,
        comment: "ok",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        productId: 1,
        userId: 2,
        rating: 4,
        comment: "good",
        createdAt: new Date().toISOString(),
      },
    ];
    expect(calculateAverageRating(reviews)).toBe(4.5);
  });
});
