import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import type { Review } from "../types/Review";
import { useI18n } from "../i18n/I18nProvider";
import "../styles/reviews.css";

type Props = {
  productId: number;
  canReview: boolean;
};

export const ReviewsBlock = ({ productId, canReview }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [openReviews, setOpenReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const { t } = useI18n();

  const load = useCallback(async () => {
    const data = await api.getProductReviews(productId);
    setReviews(data.reviews || []);
    setAverageRating(data.averageRating || 0);
  }, [productId]);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const submit = async () => {
    try {
      setError("");
      await api.createReview({ productId, rating, comment });
      setComment("");
      setRating(5);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review error");
    }
  };

  return (
    <div className="reviews-block">
      <h4>{t("reviews")}</h4>
      <div>
        {t("averageRating")}: {averageRating}
      </div>

      {canReview ? (
        <div className="review-form">
          <label>
            {t("ratingLabel")}:
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </label>
          <textarea
            value={comment}
            placeholder={t("reviewPlaceholder")}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={submit}>{t("send")}</button>
          {error ? <div className="review-error">{error}</div> : null}
        </div>
      ) : null}

      <button
        className="reviews-toggle"
        onClick={() => setOpenReviews((prev) => !prev)}
        type="button"
      >
        {openReviews ? t("hideReviews") : `${t("showReviews")} (${reviews.length})`}
      </button>

      {openReviews ? (
        <div className="reviews-list">
          {reviews.map((item) => (
            <div key={item.id} className="review-item">
              <div>⭐ {item.rating}</div>
              <div>{item.comment}</div>
              <div>{new Date(item.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
