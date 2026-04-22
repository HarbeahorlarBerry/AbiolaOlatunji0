import axios from "axios";

export const classifyName = async (req, res) => {
  try {
    let { name } = req.query;

    // =========================
    // VALIDATION
    // =========================
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing name parameter"
      });
    }

    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "name must be a string"
      });
    }

    // Normalize input
    name = name.trim().toLowerCase();

    if (name.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Name cannot be empty"
      });
    }

    // =========================
    // CALL EXTERNAL API
    // =========================
    const response = await axios.get(
      `https://api.genderize.io/?name=${name}`,
      { timeout: 3000 } // performance safety
    );

    const data = response.data;

    // =========================
    // EDGE CASE (STRICT RULE)
    // =========================
    if (!data.gender || data.count === 0) {
      return res.status(422).json({
        status: "error",
        message: "No prediction available for the provided name"
      });
    }

    // =========================
    // PROCESS DATA
    // =========================
    const probability = Number(data.probability);
    const sample_size = Number(data.count);

    const is_confident =
      probability >= 0.7 && sample_size >= 100;

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      status: "success",
      data: {
        name: data.name,
        gender: data.gender,
        probability,
        sample_size,
        is_confident,
        processed_at: new Date().toISOString()
      }
    });

  } catch (err) {
    // =========================
    // ERROR HANDLING
    // =========================
    if (err.response) {
      return res.status(502).json({
        status: "error",
        message: "Upstream API error"
      });
    }

    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};