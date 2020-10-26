const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function verifyIsUuid(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "UUID is invalid" });
  }

  const repositoryIndex = repositories.findIndex(
    (repository) => repository && repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(404).json({ message: "Repository not found" });
  }

  req.body.$repositoryIndex = repositoryIndex;

  next();
}

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", verifyIsUuid);

const repositories = [
  {
    id: "8784b845-40c8-43f5-8827-d03553cd5bdc",
    title: "Repositorio legal",
    url: "https://github.com/grlgmrs/repositorio-legal",
    techs: ["react", "typescript"],
    likes: 0,
  },
  {
    id: "8ccf7457-7e14-475e-b3bc-2bddced23b0b",
    title: "GoStack Turma 14",
    url: "https://github.com/grlgmrs/gostack-turma-14",
    techs: ["javascript", "react", "typescript", "reactnative"],
    likes: 0,
  },
];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return res.status(201).json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { title, url, techs, $repositoryIndex: repositoryIndex } = req.body;

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return res.status(200).json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { $repositoryIndex: repositoryIndex } = req.body;

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { $repositoryIndex: repositoryIndex } = req.body;

  const likes = ++repositories[repositoryIndex].likes;

  return res.status(201).json({ likes });
});

module.exports = app;
