const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const haversine = require("../utils/haversine");

let locations = [];

// csv parser untuk membaca file csv
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

exports.getRecommendations = async (request, h) => {
  try {
    const { latitude, longitude } = request.query;

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const distances = locations.map((location) => ({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      distance: haversine(
        userLat,
        userLon,
        location.latitude,
        location.longitude
      ),
    }));

    // Pemodelan (untuk sekarang ditampilkan jarak terdekat dengan 10 tempat)
    distances.sort((a, b) => a.distance - b.distance);

    const recommendations = distances.slice(0, 10);

    return h.response(recommendations);
  } catch (error) {
    console.error(error);
    return h
      .response({ error: "Gagal mengambil rekomendasi lokasi" })
      .code(500);
  }
};
