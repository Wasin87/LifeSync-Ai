import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import apiApp from "./api/index";

dotenv.config();

const app = express();
const PORT = 3000;

// Mount the API routes
app.use(apiApp);

// ----------------- VITE ENDPOINT WRAPPERS -----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LifeSync OS Core] Running securely on port ${PORT}`);
  });
}

startServer();
