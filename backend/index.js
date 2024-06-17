const Hapi = require("@hapi/hapi");
const locationRoutes = require("./routes/locationRoutes");

const PORT = process.env.PORT || 3000;
const server = Hapi.server({
  port: PORT,
  host: "localhost",
});

server.route(locationRoutes);

const init = async () => {
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
