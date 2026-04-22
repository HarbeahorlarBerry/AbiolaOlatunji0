import express from "express";
import cors from "cors";
import classifyRoutes from "./routes/classifyRoutes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API running"
  });
});

app.use("/api", classifyRoutes);

// ✅ ONLY run locally (not in Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;