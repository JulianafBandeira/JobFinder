import express from "express";
const router = express.Router();
import Job from "../models/Job.js";

router.get("/test", (req, res) => {
  res.send("Está funcionando");
});

router.get('/view/:id', (req, res) => Job.findOne({
  where: {id: req.params.id}
}).then(job => {

  res.render('view', {
    job
  });

}).catch(err => console.log(err)));

router.get("/add", (req, res) => {
  res.render("add");
});

router.post("/add", (req, res) => {
  let { title, description, salary, company, email, new_job } = req.body;

  if (
    !title ||
    !description ||
    !salary ||
    !company ||
    !email ||
    new_job === undefined ||
    new_job === null
  ) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  Job.create({
    title,
    description,
    salary,
    company,
    email,
    new_job,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => {
      console.log(e); 
      res
        .status(500)
        .send("Erro ao criar o job. Verifique os logs do servidor.");
    });
});

export default router;
