const express = require("express");
const path = require("path");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// API routes
router.use("/api/user", userRoutes);
router.use("/api/auth", authRoutes);

// Static public files
router.use(express.static(path.join(__dirname, "..", "public")));

// Root
router.get("/", (req, res) => {
  res.redirect("/login.html");
});

// Admin (protected)
router.get(
  "/admin",
  protect,
  restrictTo("admin"),
  (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "private", "admin.html")
    );
  }
);

// 404
router.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      status: "error",
      message: "API endpoint not found"
    });
  }

  res.status(404).send("Page not found");
});

module.exports = router;
