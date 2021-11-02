const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoItemsList = document.querySelector('.todo-items');
const embed_video = document.getElementById('embed_video');
let todos = [];

// If there is no video
embed_video.innerHTML = `
    <br><p>No video to display<p>
`;

todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addTodo(todoInput.value);
});

function addTodo(item) {
    if ( item.trim() !== '' ) {
        if ( todoInput.value[0] === "/") {
            item = item.slice(1);
        } else if (!(todoInput.value.includes("http"))) {
            item = item.replace(/^\w/, (c) => c.toUpperCase());
        }
        const todo = {
            id: Date.now(),
            name: item,
            completed: false
        };
        todos.push(todo);
        addToLocalStorage(todos);
        todoInput.value = '';
    } else {
        todoInput.value = '';
        todoInput.focus()
    }
}

function renderTodos(todos) {
    todoItemsList.innerHTML = '';
    todos.forEach(function(item) {
        const checked = item.completed ? 'checked' : null;
        const li = document.createElement('li');

        li.setAttribute('class', 'item');
        li.setAttribute('data-key', item.id);

        if (item.completed === true) {
            li.classList.add('checked');
        }

        if (item.name.includes("http")) {
            if (item.name.includes("youtube.com/watch")) {
                var item_to_add = '<a href="' + item.name.trim() + '">' + item.name + '</a>' + ' <a class="embed-button" onclick="showEmbed()">(embed)</a>'
                var embed_video_id = item.name.split("?v=")[1].slice(0,11);
                console.log(embed_video_id)
                embed_video.innerHTML = `
                <iframe width="560" height="315"
                    src="https://www.youtube.com/embed/${embed_video_id}"
                    title="Embed"
                    frameborder="0"
                    allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
                `;
            } else if (item.name.length > 66) {
                var item_to_add = '<a href="' + item.name.trim() + '">' + item.name.slice(0,40) + "..." + item.name.slice(-23) + '</a>'
            } else {
                var item_to_add = '<a href="' + item.name.trim() + '">' + item.name + '</a>'
            }
        } else {
            var item_to_add = item.name
        }

        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${checked}>
            ${item_to_add}
            <button class="delete-button"></button>
        `;
        todoItemsList.append(li);
    });
}

function addToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos(todos);
    todoInput.focus()
}

function getFromLocalStorage() {
    const reference = localStorage.getItem('todos');
    if (reference) {
        todos = JSON.parse(reference);
        renderTodos(todos);
    }
}

getFromLocalStorage();

todoItemsList.addEventListener('click', function(event) {
    if (event.target.type === 'checkbox') {
        toggle(event.target.parentElement.getAttribute('data-key'));
    }
    if (event.target.classList.contains('delete-button')) {
        deleteTodo(event.target.parentElement.getAttribute('data-key'));
    }
});

function toggle(id) {
    todos.forEach(function(item) {
        if (item.id == id) {
            item.completed = !item.completed;
        }
    });
    addToLocalStorage(todos);
}

function deleteTodo(id) {
    todos = todos.filter(function(item) {
        return item.id != id;
    });
    addToLocalStorage(todos);
}
