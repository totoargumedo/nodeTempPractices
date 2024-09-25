import express, { urlencoded } from "express";
import "dotenv/config";
import mongoose, { Schema, model } from "mongoose";

const app = express();
const PORT = process.env.PORT || 8080;

//DB
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("🟢 DB conectada correctamente");
  })
  .catch((error) => {
    console.log("🔴 Error en la DB: " + error);
  });
const taskSchema = new Schema({ name: String, done: Boolean });
const taskModel = model("tasks", taskSchema);
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use((req, res, next) => {});

app.get("/api/tasks", (req, res) => {
  taskModel
    .find({})
    .then((response) => {
      res.status(200).json({
        ok: true,
        message: "Tarea obtenidas con exito",
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        ok: false,
        message: "Error al obtener las tareas",
      });
    });
});

app.post("/api/tasks", (req, res) => {
  const data = req.body;
  taskModel
    .create({ name: data.text, done: false })
    .then((response) => {
      res
        .status(201)
        .json({ ok: true, message: "Tarea creada con exito", data: response });
    })
    .catch((error) => {
      res.status(400).json({ ok: false, message: "Error al crear la tarea" });
    });
});
app.put("/api/tasks/:id", (req, res) => {
  const data = req.body;
  const { id } = req.params;
  taskModel
    .findByIdAndUpdate(id, { name: data.text }, { new: true })
    .then((response) => {
      res.status(200).json({
        ok: true,
        message: "Tarea actualizada con exito",
        data: response,
      });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ ok: false, message: "Error al actualizar la tarea" });
    });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  taskModel
    .findByIdAndDelete(id)
    .then((response) => {
      res.status(200).json({
        ok: true,
        message: "Tarea eliminada con exito",
        data: response,
      });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ ok: false, message: "Error al eliminar la tarea" });
    });
});

app.listen(PORT, () => {
  console.log(`🟢 Server corriendo en puerto ${PORT}`);
});
