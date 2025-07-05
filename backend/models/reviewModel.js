const { sql } = require("../db");

exports.createReview = async (newReview) => {
  const [review] = await sql`INSERT INTO reviews ${sql(
    newReview,
    "user_id",
    "tour_id",
    "rating",
    "comment"
  )} RETURNING *`;
  return review;
};

exports.getReviewsByTourId = async (tourId, { limit, offset }) => {
  const reviews = await sql`SELECT 
    r.*,
    u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.tour_id = ${tourId}
    ORDER BY r.created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}`;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int as count FROM reviews WHERE tour_id = ${tourId}
  `;

  return { reviews, totalCount: count };
};

exports.getReviewsByUserId = async (userId, { limit, offset }) => {
  const reviews = await sql`
    SELECT r.*, t.name
    FROM reviews r
    JOIN tours t ON r.tour_id = t.id
    WHERE r.user_id = ${userId}
    ORDER BY r.created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}`;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int as count FROM reviews WHERE user_id = ${userId}
  `;

  return { reviews, totalCount: count };
};

exports.deleteReview = async (id) => {
  const review = await sql`DELETE FROM reviews WHERE id = ${id} RETURNING *`;
  return review[0];
};

exports.getReviewById = async (id) => {
  const [review] = await sql`SELECT * FROM reviews WHERE id = ${id}`;
  return review;
};
