import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Series from "../models/Series.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalMovies, totalSeries] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Series.countDocuments(),
    ]);

    res.status(200).json({
      totalUsers,
      totalMovies,
      totalSeries,
    });
  } catch (error) {
    next(error);
  }
};
