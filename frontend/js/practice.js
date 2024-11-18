// Valid that only coaches & admin can report score

function authorizeRole(roles) {
  return function (req, res, next) {
    if (roles.indexOf(req.user.role) > -1) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
}

router.post(
  "/report",
  authenticateToken,
  authorizeRole(["coach", "admin"]),
  gameController.reportScore
);

// FOR PUBLIC VIEW OF SCHEDULE //
exports.getPublicSchedule = async (req, res) => {
  try {
    // Query the database for the schedule without needing user-specific data
    const schedule =
      await Game.find(/* Your query here to fetch public schedule */).lean();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
