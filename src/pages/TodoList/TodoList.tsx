import React, { useState, FormEvent, useRef, useEffect } from 'react';
import Input from '../../components/Input/Input';
import './TodoList.css';
import { toast } from 'react-toastify';
import Button from '../../components/Button/Button';

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

    const editInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    useEffect(() => {
        if (editingId !== null && editInputRefs.current[editingId]) {
            editInputRefs.current[editingId]?.focus();
        }
    }, [editingId]);

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
                    placeholder="Enter todo *"
                    value={input}
                    onChange={setInput}
                    required
                    minLength={3}
                    maxLength={32}
                />
                <Button
                    type="submit"
                    disabled={
                        input.trim().length < 3 ||
                        input.length > 32 ||
                        loadingAction.type === 'add'
                    }
                    loading={loadingAction.type === 'add'}
                    className="add-btn"
                >
                    Add
                </Button>
            </form>

            <ul className="todo-list">
                {todos.map((todo, index) => (
                    <li key={todo.id} className="todo-item">
                        <span className="todo-index">{index + 1}.</span>
                        {editingId === todo.id ? (
                            <>
                                <Input
                                    id={`edit-task-${todo.id}`}
                                    value={editingText}
                                    onChange={onEditingChange}
                                    required
                                    minLength={3}
                                    maxLength={32}
                                    ref={(el) => {
                                        editInputRefs.current[todo.id] = el;
                                    }}
                                />
                                <div>
                                    <Button
                                        onClick={saveEditing}
                                        disabled={
                                            editingText.trim().length < 3 ||
                                            editingText.length > 32 ||
                                            (loadingAction.type === 'update' && loadingAction.id === editingId)
                                        }
                                        loading={loadingAction.type === 'update' && loadingAction.id === editingId}
                                        className="update-btn"
                                    >
                                        Update
                                    </Button>

                                    <Button onClick={cancelEditing} className="cancel-btn">
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span>{todo.text}</span>
                                <div>
                                    <Button onClick={() => startEditing(todo)} className="edit-btn">
                                        Edit
                                    </Button>

                                    <Button
                                        onClick={() => handleDelete(todo.id)}
                                        disabled={loadingAction.type === 'delete' && loadingAction.id === todo.id}
                                        loading={loadingAction.type === 'delete' && loadingAction.id === todo.id}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </Button>
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
