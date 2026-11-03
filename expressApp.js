
import express from "express";

const app = express();
const PORT = 4000;

// Middleware to read JSON data
app.use(express.json());

// Array containing sample books
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350,
        category: "Fiction"
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 450,
        category: "Self Help"
    },
    {
        id: 3,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 300,
        category: "Finance"
    }
];

// 1. GET - Fetch all books
app.get("/books", (req, res) => {
    res.status(200).json(books);
});

// 2. GET - Fetch a book by ID
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
});

// 3. POST - Add a new book
app.post("/books", (req, res) => {
    const { id, title, author, price, category } = req.body;

    if (id === undefined || !title || !author || price === undefined) {
        return res.status(400).json({
            message: "Please provide id, title, author and price"
        });
    }

    const existingBook = books.find((b) => b.id === Number(id));

    if (existingBook) {
        return res.status(409).json({ message: "Book ID already exists" });
    }

    const newBook = {
        id: Number(id),
        title,
        author,
        price: Number(price),
        category: category || "General"
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// 4. PUT - Update a book by ID
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, price, category } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (price !== undefined) book.price = Number(price);
    if (category !== undefined) book.category = category;

    res.status(200).json({
        message: "Book updated successfully",
        book
    });
});

// 5. DELETE - Delete a book by ID
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});

