// Wait until the entire page is loaded
window.addEventListener('load', () => {
    // Retrieve the todos array from localStorage or initialize it as an empty array
    todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Get references to the name input field and the new todo form
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    // Retrieve the username from localStorage or set it to an empty string if not found
    const username = localStorage.getItem('username') || '';

    // Pre-fill the name input field with the username from localStorage
    nameInput.value = username;

    // Update the username in localStorage whenever the name input field changes
    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    });

    // Add an event listener to handle the submission of the new todo form
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Create a new todo object with the input values and a timestamp
        const todo = {
            content: e.target.elements.content.value, // The content of the todo
            category: e.target.elements.category.value, // The category (e.g., personal, business)
            done: false, // Default state of the todo is "not done"
            createdAt: new Date().getTime() // Timestamp for when the todo was created
        };

        // Add the new todo to the todos array
        todos.push(todo);

        // Save the updated todos array to localStorage
        localStorage.setItem('todos', JSON.stringify(todos));

        // Reset the form fields
        e.target.reset();

        // Re-render the list of todos
        DisplayTodos();
    });

    // Display the list of todos when the page loads
    DisplayTodos();
});

// Function to display the todos on the page
function DisplayTodos() {
    const todoList = document.querySelector('#todo-list'); // Reference to the todo list container
    todoList.innerHTML = ""; // Clear the existing list

    // Loop through each todo in the todos array
    todos.forEach(todo => {
        // Create the elements for each todo item
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input'); // Checkbox for marking the todo as done
        const span = document.createElement('span'); // Bubble to indicate the category
        const content = document.createElement('div'); // Container for the todo content
        const actions = document.createElement('div'); // Container for the action buttons
        const edit = document.createElement('button'); // Edit button
        const deleteButton = document.createElement('button'); // Delete button

        input.type = 'checkbox';
        input.checked = todo.done; // Set the checkbox state based on the todo's "done" property
        span.classList.add('bubble');
        if (todo.category == 'personal') {
            span.classList.add('personal'); // Add a class for personal todos
        } else {
            span.classList.add('business'); // Add a class for business todos
        }
        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        // Set the content and labels
        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        // Append the elements to their respective parents
        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        // Append the todo item to the todo list
        todoList.appendChild(todoItem);

        // Add a class if the todo is marked as done
        if (todo.done) {
            todoItem.classList.add('done');
        }

        // Event listener for marking a todo as done/undone
        input.addEventListener('change', (e) => {
            todo.done = e.target.checked; // Update the "done" property
            localStorage.setItem('todos', JSON.stringify(todos)); // Save changes to localStorage

            // Add or remove the "done" class based on the checkbox state
            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos(); // Re-render the todos
        });

        // Event listener for editing a todo
        edit.addEventListener('click', (e) => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly'); // Allow editing
            input.focus(); // Focus on the input field
            input.addEventListener('blur', (e) => {
                input.setAttribute('readonly', true); // Make the input readonly again
                todo.content = e.target.value; // Update the todo content
                localStorage.setItem('todos', JSON.stringify(todos)); // Save changes to localStorage
                DisplayTodos(); // Re-render the todos
            });
        });

        // Event listener for deleting a todo
        deleteButton.addEventListener('click', (e) => {
            todos = todos.filter(t => t != todo); // Remove the selected todo from the array
            localStorage.setItem('todos', JSON.stringify(todos)); // Save changes to localStorage
            DisplayTodos(); // Re-render the todos
        });
    });
}
