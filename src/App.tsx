import React from 'react';
import TodoList from './pages/TodoList/TodoList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <div className="App">
            <TodoList />
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
}

export default App;
