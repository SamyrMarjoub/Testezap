import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authController";
import getDataRoutes from './routes/getDataController'
import uploadProfile from './routes/uploadRoutes'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use('/api', getDataRoutes)
app.use('/api', uploadProfile)

app.get("/", (req, res) => {
  res.send("Backend está rodando! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
