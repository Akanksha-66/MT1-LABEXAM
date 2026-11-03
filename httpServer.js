
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 450
    },
    {
        id: 3,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 300
    }
];

const server = http.createServer((req, res) => {

    // GET /
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Library Book Management System</h1>");
    }

    // GET /books
    else if (req.method === "GET" && req.url === "/books") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(books));
    }

    // GET /about
    else if (req.method === "GET" && req.url === "/about") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>About</h1><p>This is a Library Book Management Application.</p>");
    }

    // GET /home - Read HTML file using FS module
    else if (req.method === "GET" && req.url === "/home") {
        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error reading HTML file");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    }

    // POST /add-book
    else if (req.method === "POST" && req.url === "/add-book") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const newBook = JSON.parse(body);

                if (
                    newBook.id === undefined ||
                    !newBook.title ||
                    !newBook.author ||
                    newBook.price === undefined
                ) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        message: "Please provide id, title, author and price"
                    }));
                    return;
                }

                books.push(newBook);

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Book added successfully",
                    book: newBook
                }));
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 - Route Not Found");
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
