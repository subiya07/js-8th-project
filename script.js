// Wait until the entire page is fully loaded
window.addEventListener('load', () => {
    console.log("Page loaded!");

    // Retrieve the todos array from localStorage or initialize it as an empty array if nothing is stored
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    console.log("Loaded todos from localStorage:", todos);

    // Get references to the input field and form
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    // Get stored username from localStorage or set it to an empty string
    const username = localStorage.getItem('username') || '';
    console.log("Username from localStorage:", username);

    // Pre-fill the name input field with the stored username
    nameInput.value = username;

    // When the name is changed, update it in localStorage
    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
        console.log("Username updated in localStorage:", e.target.value);
    });

    // Handle new todo form submission
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault(); // Prevent default form submission
        console.log("Form submitted!");

        // Create a new todo object
        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        };
        console.log("New todo created:", todo);

        // Add it to the todos array and store it
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        console.log("Todos saved to localStorage:", todos);

        // Reset form input
        e.target.reset();

        // Display the updated todo list
        DisplayTodos();
    });

    // Display existing todos on page load
    DisplayTodos();
});

// Function to display all todos
function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = ""; // Clear the current list
    console.log("Rendering todos...");

    todos.forEach(todo => {
        // Create todo item UI
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.done;

        span.classList.add('bubble');
        span.classList.add(todo.category == 'personal' ? 'personal' : 'business');

        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        if (todo.done) {
            todoItem.classList.add('done');
        }

        todoList.appendChild(todoItem);

        // Handle marking todo as done
        input.addEventListener('change', (e) => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));
            console.log(`Todo marked as ${todo.done ? 'done' : 'not done'}`, todo);

            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos(); // Re-render
        });

        // Handle editing a todo
        edit.addEventListener('click', (e) => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            console.log("Editing todo:", todo);

            input.addEventListener('blur', (e) => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                console.log("Todo updated:", todo);
                DisplayTodos();
            });
        });

        // Handle deleting a todo
        deleteButton.addEventListener('click', (e) => {
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            console.log("Todo deleted:", todo);
            DisplayTodos();
        });
    });
}
