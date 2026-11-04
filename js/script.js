// Protect pages from users who are not logged in
const currentPage = window.location.pathname;
const isLoggedIn = localStorage.getItem("loggedInUser");

if (
    (currentPage.endsWith("dashboard.html") ||
     currentPage.endsWith("create-blog.html")) &&
    !isLoggedIn
) {
    window.location.replace("login.html");
}
// BLOGSPACE REGISTRATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");

        if (password.length < 6) {
            message.textContent = "Password must contain at least 6 characters.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            message.style.color = "red";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            message.textContent = "Email already registered!";
            message.style.color = "red";
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        message.textContent = "Registration successful!";
        message.style.color = "green";

        registerForm.reset();

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1500);
    });
}

// BLOGSPACE LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(function(user) {
            return user.email === email && user.password === password;
        });

        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));

            message.textContent = "Login successful!";
            message.style.color = "green";

            setTimeout(function() {
                window.location.href = "dashboard.html";
            }, 1000);

        } else {
            message.textContent = "Invalid email or password!";
            message.style.color = "red";
        }
    });
}

// BLOGSPACE DASHBOARD

const dashboardName = document.getElementById("userName");

if (dashboardName) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        window.location.href = "login.html";
    } else {
        dashboardName.textContent = loggedInUser.name;
    }
}

// LOGOUT FUNCTION

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function(event) {
        event.preventDefault();

        localStorage.removeItem("loggedInUser");

        window.location.href = "login.html";
    });
}

// BLOGSPACE CREATE BLOG

const blogForm = document.getElementById("blogForm");

if (blogForm) {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!currentUser) {
        window.location.href = "login.html";
    }

    blogForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value.trim();
        const content = document.getElementById("blogContent").value.trim();

        const message = document.getElementById("blogMessage");

        if (!title || !category || !content) {
            message.textContent = "Please fill all fields.";
            message.style.color = "red";
            return;
        }

        let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

        const newBlog = {
            id: Date.now(),
            title: title,
            category: category,
            content: content,
            author: currentUser.name,
            email: currentUser.email,
            date: new Date().toLocaleDateString()
        };

        blogs.push(newBlog);

        localStorage.setItem("blogs", JSON.stringify(blogs));

        message.textContent = "Blog published successfully!";
        message.style.color = "green";

        blogForm.reset();

        setTimeout(function() {
            window.location.href = "dashboard.html";
        }, 1000);
    });
}

// DISPLAY BLOG POSTS ON DASHBOARD

const myBlogs = document.getElementById("myBlogs");

if (myBlogs) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        const allBlogs = JSON.parse(localStorage.getItem("blogs")) || [];

        const userBlogs = allBlogs.filter(function(blog) {
            return blog.email === loggedInUser.email;
        });

        myBlogs.innerHTML = "";

        if (userBlogs.length === 0) {
            myBlogs.textContent = "No blog posts yet. Create your first blog!";
        } else {
            userBlogs.forEach(function(blog) {

                const card = document.createElement("article");
                card.className = "blog-card";

                const content = document.createElement("div");
                content.className = "blog-content";

                const title = document.createElement("h3");
                title.textContent = blog.title;

                const category = document.createElement("p");
                category.textContent = "Category: " + blog.category;

                const description = document.createElement("p");
                description.textContent = blog.content;

                const author = document.createElement("span");
                author.textContent = "By " + blog.author;

                const date = document.createElement("p");
                date.textContent = "Published: " + blog.date;

                content.appendChild(title);
                content.appendChild(category);
                content.appendChild(description);
                content.appendChild(author);
               content.appendChild(date);

// EDIT BUTTON
const editBtn = document.createElement("button");
editBtn.textContent = "Edit";
editBtn.onclick = function() {
    const newTitle = prompt("Enter new blog title:", blog.title);
    if (newTitle === null) return;

    const newCategory = prompt("Enter new category:", blog.category);
    if (newCategory === null) return;

    const newContent = prompt("Enter new blog content:", blog.content);
    if (newContent === null) return;

    if (!newTitle.trim() || !newCategory.trim() || !newContent.trim()) {
        alert("All fields are required!");
        return;
    }

    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    const index = blogs.findIndex(function(item) {
        return item.id === blog.id &&
               item.email === loggedInUser.email;
    });

    if (index !== -1) {
        blogs[index].title = newTitle.trim();
        blogs[index].category = newCategory.trim();
        blogs[index].content = newContent.trim();

        localStorage.setItem("blogs", JSON.stringify(blogs));
        location.reload();
    }
};

// DELETE BUTTON
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
deleteBtn.onclick = function() {
    if (confirm("Are you sure you want to delete this blog?")) {
        const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

        const updatedBlogs = blogs.filter(function(item) {
            return !(item.id === blog.id &&
                     item.email === loggedInUser.email);
        });

        localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
        location.reload();
    }
};

content.appendChild(editBtn);
content.appendChild(deleteBtn);

card.appendChild(content);
myBlogs.appendChild(card);
            });
        }
    }
}

// DISPLAY BLOGS ON HOME PAGE

const homeBlogs = document.getElementById("homeBlogs");

if (homeBlogs) {

    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    homeBlogs.innerHTML = "";

    if (blogs.length === 0) {
        homeBlogs.textContent = "No blog posts available yet.";
    } else {

        blogs.slice().reverse().forEach(function(blog) {

            const card = document.createElement("article");
            card.className = "blog-card";

            const content = document.createElement("div");
            content.className = "blog-content";

            const title = document.createElement("h3");
            title.textContent = blog.title;

            const category = document.createElement("p");
            category.textContent = "Category: " + blog.category;

            const description = document.createElement("p");
            description.textContent = blog.content;

            const author = document.createElement("span");
            author.textContent = "By " + blog.author;

            const date = document.createElement("p");
            date.textContent = "Published: " + blog.date;

            content.appendChild(title);
            content.appendChild(category);
            content.appendChild(description);
            content.appendChild(author);
            content.appendChild(date);

            card.appendChild(content);
            homeBlogs.appendChild(card);
        });
    }
}
