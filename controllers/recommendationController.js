
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getRecommendations = (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../data/recommendations.csv"
    );

    const csvData = fs.readFileSync(filePath, "utf8");
    const rows = csvData.trim().split(/\r?\n/);

    const recommendations = rows.slice(1).map((row, index) => {
      const [user_id, product_id, category, score] =
        row.split(";").map(value =>
          value.replace(/"/g, "").trim()
        );

      return {
        rank: index + 1,
        user_id,
        product_id,
        category,
        recommendation_score: Number(score),
      };
    });

    const userRecommendations = recommendations
      .filter(item =>
  item.user_id.trim().toUpperCase() ===
  String(req.params.userId).trim().toUpperCase()
)
      .sort((a, b) =>
        b.recommendation_score - a.recommendation_score
      );

    res.status(200).json({
      success: true,
      userId: req.params.userId,
      count: userRecommendations.length,
      recommendations: userRecommendations,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to load recommendations",
      error: error.message,
    });
  }
};

export { getRecommendations };
