const prisma = require("../config/prisma");

//create ข้อมูล
exports.create = async (req, res) => {
  try {
    const { title, status } = req.body;
    const newTodo = await prisma.todo.create({
      data: {
        title: title,
        status: status,
      },
    });

    res.json({ newTodo });
  } catch (error) {
    //error
    console.log(error);
    res.json({ message: "Server Error" }).status(500);
  }
};
//Read ข้อมูล
exports.list = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();

    res.json({ todos });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server Error" }).status(500);
  }
};
// Update ข้อมูล
exports.update = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { title, status } = req.body;

    // แปลงค่าของ status จากตัวเลขเป็น boolean (1 = true, 0 = false)
    const statusBoolean = status ? true : false;

    const updated = await prisma.todo.update({
      where: {
        id: Number(todoId),
      },
      data: {
        title: title,
        status: statusBoolean, // ใช้ statusBoolean ที่แปลงแล้ว
      },
    });

    res.json({ updated });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server Error" }).status(500);
  }
};
//delete ข้อมูล
exports.remove = async (req, res) => {
  try {
    const { todoId } = req.params;
    const deleted = await prisma.todo.delete({
      where: {
        id: Number(todoId),
      },
    });
    res.json({ deleted });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server Error" }).status(500);
  }
};
