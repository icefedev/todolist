const express = require("express");
const router = express.Router();

const { create, list,update ,remove } = require("../controllers/todo");

// @ENDPOINT http://localhost:5000/api/todo
router.get("/todo", list);
router.post("/todo", create);
router.put("/todo/:todoId", update);
router.delete("/todo/:todoId", remove);

module.exports = router;
