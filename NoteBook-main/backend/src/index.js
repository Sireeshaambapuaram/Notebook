import connectDB from "./db/db.js";
import app from "./app.js";

// env is loaded in db.js (before any process.env reads there)
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API is running");
});

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(
        `Server is running at port ${PORT}...\nhttp://localhost:${PORT}`
      );
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `[Server] Port ${PORT} is already in use. Stop the other Node process (Task Manager → end "node") or set a different PORT in backend/.env (e.g. PORT=5001) and match VITE_APP_API_KEY in frontend/.env.`
        );
        process.exit(1);
      }
      throw err;
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed !!!", err);
  });
