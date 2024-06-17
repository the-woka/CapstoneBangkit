const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const haversine = require("../utils/haversine");

// Load locations data from CSV file
let locations = [];

fs.createReadStream(path.join(__dirname, "../data/locations.csv"))
  .pipe(csv())
  .on("data", (row) => {
    locations.push({
      name: row.Name,
      latitude: parseFloat(row.Latitude),
      longitude: parseFloat(row.Longitude),
    });
  })
  .on("end", () => {
    console.log("Data lokasi berhasil dibaca.");
  });

// Get recommendations based on user input and calculated distance
exports.getRecommendations = async (request, h) => {
  try {
    const { latitude, longitude } = request.query;

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // Calculate distances from user location to each location in the dataset
    const distances = locations.map((location) => {
      const distance = haversine(
        userLat,
        userLon,
        location.latitude,
        location.longitude
      );
      return {
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        distance: distance,
      };
    });

    // Filter locations within 50 km
    const filteredLocations = distances.filter(
      (location) => location.distance >= 45 && location.distance <= 50
    );

    return h.response(filteredLocations);
  } catch (error) {
    console.error(error);
    return h.response({ error: "Gagal mengambil rekomendasi" }).code(500);
  }
};
