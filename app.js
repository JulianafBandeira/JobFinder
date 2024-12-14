import express from "express";
import db from "./db/conection.js";
import bodyParser from "body-parser";
import jobsRouter from "./routes/jobs.js";
import { create } from "express-handlebars";
import { fileURLToPath } from "url";
import path from "path";
import Job from "./models/Job.js";
import { Op } from "sequelize"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Configurando middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configurando o diretório de views e o motor de template
app.set("views", path.join(__dirname, "views"));
const hbs = create({ defaultLayout: "main" });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Configurando o diretório para arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

db.authenticate()
  .then(() => {
    console.log("Conectou ao banco de dados!");
  })
  .catch((e) => {
    console.error("Falha na conexão com o banco de dados:", e);
  });

app.get("/", (req, res) => {
  const search = req.query.job;

  if (!search || search.trim() === "") {

    Job.findAll({ order: [["createdAt", "DESC"]] })
      .then((jobs) => {
        res.render("index", { jobs });
      })
      .catch((e) => console.log(e));
  } else {
    const query = `%${search}%`;
   
    Job.findAll({
      where: { title: { [Op.like]: query } },
      order: [["createdAt", "DESC"]],
    })
      .then((jobs) => {
        res.render("index", { jobs, search });
      })
      .catch((e) => console.log(e));
  }
});

// Rotas para jobs
app.use("/jobs", jobsRouter);
