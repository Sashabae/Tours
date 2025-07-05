const { sql } = require("../db");

exports.createDates = async (tourId, dates) => {
  const dateObjects = dates.map((date) => ({
    tour_id: tourId,
    tour_date: date,
  }));

  const insertedDates = await sql`
    INSERT INTO dates ${sql(dateObjects, "tour_id", "tour_date")}
    RETURNING *
  `;

  return insertedDates;
};

exports.getDatesByTourId = async (tourId) => {
  const dates = await sql`SELECT * FROM dates WHERE tour_id = ${tourId}`;
  return dates;
};

exports.deleteDate = async (id) => {
  const dates = await sql`DELETE FROM dates WHERE id = ${id} RETURNING *`;
  return dates[0];
};

exports.getDateById = async (id) => {
  const [date] = await sql`SELECT * FROM dates WHERE id = ${id}`;
  return date;
};
