const { sql } = require("../db");

exports.getAllTours = async ({ limit, offset, category, search, date }) => {
  let conditions = [];

  if (category) {
    conditions.push(sql`t.category = ${category}`);
  }

  if (search) {
    const likeTerm = `%${search}%`;
    conditions.push(
      sql`(t.name ILIKE ${likeTerm} OR t.description ILIKE ${likeTerm})`
    );
  }

  if (date) {
    // Filter tours that have at least one date on the given day
    conditions.push(sql`EXISTS (
      SELECT 1 FROM dates d 
      WHERE d.tour_id = t.id AND DATE(d.tour_date) = ${date}
    )`);
  }

  let whereClause = sql``;

  if (conditions.length === 1) {
    whereClause = sql`WHERE ${conditions[0]}`;
  } else if (conditions.length > 1) {
    whereClause = sql`WHERE ${conditions.reduce(
      (acc, curr) => sql`${acc} AND ${curr}`
    )}`;
  }

  const tours = await sql`
    SELECT t.*,
      COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating
    FROM tours t
    LEFT JOIN reviews r ON r.tour_id = t.id
    ${whereClause}
    GROUP BY t.id
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM tours t
    ${whereClause}
  `;

  return { tours, totalCount: count };
};

exports.getTourById = async (id) => {
  const [tour] = await sql`
    SELECT 
      t.*,
      COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating,
      (
        SELECT json_agg(d)
        FROM (
          SELECT id, tour_date
          FROM dates
          WHERE tour_id = t.id
          ORDER BY tour_date ASC
        ) d
      ) AS dates
    FROM tours t
    LEFT JOIN reviews r ON r.tour_id = t.id
    WHERE t.id = ${id}
    GROUP BY t.id
  `;
  return tour;
};

exports.createTour = async (newTour, dates) => {
  const [tour] = await sql`INSERT INTO tours ${sql(
    newTour,
    "name",
    "description",
    "price",
    "category",
    "image",
    "duration"
  )} RETURNING *`;

  // Insert all dates of this tour
  for (const date of dates) {
    await sql`
      INSERT INTO dates (tour_id, tour_date)
      VALUES (${tour.id}, ${date});
    `;
  }

  return tour;
};

exports.updateTour = async (id, updatedTour) => {
  const { dates, ...tourData } = updatedTour;

  const [tour] = await sql`
    UPDATE tours SET ${sql(tourData)} WHERE id = ${id} RETURNING *;
  `;

  if (dates && Array.isArray(dates)) {
    // Delete existing dates
    await sql`DELETE FROM dates WHERE tour_id = ${id}`;

    // Insert new dates
    for (const tour_date of dates) {
      await sql`
        INSERT INTO dates (tour_id, tour_date) VALUES (${id}, ${tour_date})
      `;
    }
  }

  // Fetch updated dates
  const updatedDates = await sql`
    SELECT * FROM dates WHERE tour_id = ${id} ORDER BY tour_date
  `;

  // Return tour with dates
  return { ...tour, dates: updatedDates };
};

exports.deleteTour = async (id) => {
  const tour = await sql`DELETE FROM tours WHERE id = ${id} RETURNING *`;
  return tour[0];
};
