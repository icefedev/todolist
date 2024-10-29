import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { getData, createData, removeData, updateData } from "../api/todo";

const Todo = () => {
  const [data, setData] = useState([]); // ตารางแรกที่สามารถแก้ไขได้
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    try {
      const res = await getData();
      const todosWithStatus = res.data.todos.map((task) => ({
        ...task,
        status: task.status ? "complete" : "wait", // 1 = complete, 0 = wait
      }));
      setData(todosWithStatus);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAddData = async () => {
    try {
      const res = await createData({ title });
      toast.success(`Added ${res.data.newTodo.title} successfully!`);
      setTitle("");
      handleGetData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await removeData(id);
      toast.error(`Deleted ${res.data.deleted.title} successfully!`);
      handleGetData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id, currentTitle) => {
    setEditId(id);
    setEditTitle(currentTitle);
  };

  const handleConfirmEdit = async () => {
    try {
      await updateData(editId, { title: editTitle });
      toast.success(`Updated successfully!`);
      setEditId(null);
      setEditTitle("");
      handleGetData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteToggle = async (id) => {
    const taskToUpdate = data.find((task) => task.id === id);
    if (!taskToUpdate) return; // ถ้าไม่พบ task

    // กำหนดค่าบูลีนใหม่
    const updatedStatus = taskToUpdate.status === "wait" ? 1 : 0; // 1 = complete, 0 = wait

    // อัปเดตข้อมูลในฐานข้อมูล
    try {
      console.log("Updating task with ID:", id, "to status:", updatedStatus);
      await updateData(id, {
        title: taskToUpdate.title,
        status: updatedStatus,
      }); // ส่งค่าตัวเลขไปยัง API

      // อัปเดตข้อมูลใน UI
      const updatedData = data.map((task) =>
        task.id === id
          ? { ...task, status: updatedStatus ? "complete" : "wait" }
          : task
      );
      setData(updatedData); // อัปเดต UI
      toast.success(
        `Updated status to ${updatedStatus ? "complete" : "wait"}!`
      );
    } catch (error) {
      console.log("Error updating data:", error);
    }
  };

  const columns = [
    {
      name: "To Do List",
      cell: (row) =>
        editId === row.id ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        ) : (
          row.title
        ),
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) =>
        editId === row.id ? (
          <>
            <button onClick={handleConfirmEdit} style={{ marginRight: "8px" }}>
              Save
            </button>
            <button
              onClick={() => setEditId(null)}
              style={{ marginRight: "8px" }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleDelete(row.id)}
              style={{ marginRight: "8px" }}
            >
              Delete
            </button>
            <button
              onClick={() => handleEdit(row.id, row.title)}
              style={{ marginRight: "8px" }}
            >
              Edit
            </button>
            <button onClick={() => handleCompleteToggle(row.id)}>
              {row.status === "complete" ? "Mark as Wait" : "Mark as Complete"}
            </button>
          </>
        ),
    },
  ];

  const statusColumns = [
    {
      name: "To Do List",
      selector: (row) => row.title,
      sortable: false,
    },
    {
      name: "Status",
      cell: (row) => (
        <span style={{ color: row.status === "complete" ? "green" : "orange" }}>
          {row.status === "complete" ? "complete" : "wait"}
        </span>
      ),
      sortable: false,
    },
  ];

  return (
    <>
      <div>
        <input
          type="text"
          name="title"
          placeholder="What is the task today?"
          value={title}
          onChange={handleOnChange}
        />
        <button onClick={handleAddData}>Add Task</button>
      </div>

      <div>
        <h3>To Do List</h3>
        <DataTable columns={columns} data={data} responsive />
      </div>

      <div>
        <h3>Status</h3>
        <DataTable columns={statusColumns} data={data} responsive />
      </div>
    </>
  );
};

export default Todo;
