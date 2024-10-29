import React from "react";
import Todo from "./components/Todo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Todo />
    </div>
  );
};

export default App;
