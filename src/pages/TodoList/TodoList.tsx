import React, { useState, FormEvent } from 'react';
import Input from '../../components/Input/Input';
import './TodoList.css';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

type Todo = {
    id: number;
    text: string;
};

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');
    const [loadingAction, setLoadingAction] = useState<{
        type: 'add' | 'update' | 'delete' | null;
        id?: number; // for delete/update targeting
    }>({ type: null });
    // Add new todo
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim().length < 3 || input.trim().length > 32) return;

        setLoadingAction({ type: 'add' });

        setTimeout(() => {
            const newTodo: Todo = { id: Date.now(), text: input };
            setTodos((prev) => [...prev, newTodo]);
            setInput('');
            setLoadingAction({ type: null });
            toast.success('✅ Task added!');
        }, 1000);
    };

    const saveEditing = () => {
        if (editingText.trim().length < 3 || editingText.trim().length > 32) return;

        setLoadingAction({ type: 'update', id: editingId! });

        setTimeout(() => {
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === editingId ? { ...todo, text: editingText } : todo
                )
            );
            setEditingId(null);
            setEditingText('');
            setLoadingAction({ type: null });
            toast.success('✏️ Task updated');
        }, 1000);
    };

    const handleDelete = (id: number) => {
        setLoadingAction({ type: 'delete', id });

        setTimeout(() => {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            // Cancel editing if deleting current editing
            if (editingId === id) {
                setEditingId(null);
                setEditingText('');
            }
            setLoadingAction({ type: null });
            toast.error('🗑️ Task deleted');
        }, 1000);
    };


    // Start editing todo inline
    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditingText(todo.text);
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingId(null);
        setEditingText('');
    };

    // Change editing input text
    const onEditingChange = (value: string) => {
        setEditingText(value);
    };

    // Save updated todo text

    return (
        <div className="todo-container">
            <h2>Todo List</h2>
            <form onSubmit={handleSubmit} className="todo-form">
                <Input
                    placeholder="Enter todo"
                    value={input}
                    onChange={setInput}
                    required
                    minLength={3}
                    maxLength={32}
                />
                <button
                    type="submit"
                    disabled={
                        input.trim().length < 3 ||
                        input.length > 32 ||
                        loadingAction.type === 'add'
                    }
                    className="add-btn"
                >
                    {loadingAction.type === 'add' ? <Spinner /> : 'Add'}
                </button>

            </form>

            <ul className="todo-list">
                {todos.map((todo, index) => (
                    <li key={todo.id} className="todo-item">
                        <span className="todo-index">{index + 1}.</span>
                        {editingId === todo.id ? (
                            <>

                                <Input
                                    value={editingText}
                                    onChange={onEditingChange}
                                    required
                                    minLength={3}
                                    maxLength={32}
                                />
                                <div>
                                    <button
                                        onClick={saveEditing}
                                        disabled={
                                            editingText.trim().length < 3 ||
                                            editingText.length > 32 ||
                                            loadingAction.type === 'update' && loadingAction.id === editingId
                                        }
                                        className="update-btn"
                                    >
                                        {loadingAction.type === 'update' && loadingAction.id === editingId ? (
                                            <Spinner />
                                        ) : (
                                            'Update'
                                        )}
                                    </button>
                                    <button onClick={cancelEditing} className="cancel-btn">
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span>{todo.text}</span>
                                <div>
                                    <button
                                        onClick={() => startEditing(todo)}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(todo.id)}
                                        disabled={
                                            loadingAction.type === 'delete' && loadingAction.id === todo.id
                                        }
                                    >
                                        {loadingAction.type === 'delete' && loadingAction.id === todo.id ? (
                                            <Spinner />
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
