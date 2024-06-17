const locationController = require("../controllers/locationController");

module.exports = [
  {
    method: "GET",
    path: "/api/recommendations",
    handler: locationController.getRecommendations,
  },
];
