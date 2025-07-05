const { sql } = require("../db");

exports.getAllTours = async ({ limit, offset, category }) => {
  let tours;
  let totalCount;

  if (category) {
    tours = await sql`
      SELECT t.*, 
      COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating
      FROM tours t
      LEFT JOIN reviews r ON r.tour_id = t.id
      WHERE t.category = ${category}
      GROUP BY t.id
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const [{ count }] = await sql`
      SELECT COUNT(*)::int as count
      FROM tours
      WHERE category = ${category}
    `;

    totalCount = count;
  } else {
    tours = await sql`
      SELECT t.*, 
      COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating
      FROM tours t
      LEFT JOIN reviews r ON r.tour_id = t.id
      GROUP BY t.id
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const [{ count }] = await sql`
      SELECT COUNT(*)::int as count
      FROM tours
    `;

    totalCount = count;
  }

  return { tours, totalCount };
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
