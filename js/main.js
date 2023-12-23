(() => {
    let books = [];

    // Event handler for adding a new book
    function addBook(event) {
        event.preventDefault();
        const titleInput = document.querySelector("#inputJudulBuku");
        const authorInput = document.querySelector("#inputPenulisBuku");
        const yearInput = Number(document.querySelector("#inputTahunBuku").value);
        const isCompleteCheckbox = document.querySelector("#inputSelesai");       
        
        const newBook = {
            id: +new Date(),
            title: titleInput.value,
            author: authorInput.value,
            year: isNaN(yearInput) ? null : yearInput, // handle cases where the conversion is not successful
            isComplete: isCompleteCheckbox.checked
        };
    
        console.log(newBook);
        books.push(newBook);
        document.dispatchEvent(new Event("bookChanged"));
        alert('Buku Sukses Ditambahkan!');
    }

    // Event handler for searching books
    function searchBooks(event) {
        event.preventDefault();
        const searchInput = document.querySelector("#cariJudulBuku");
        const query = searchInput.value;

        query ? displayBooks(books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()))) : displayBooks(books);
    }

    // Event handler for marking a book as complete
    function markAsComplete(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex] = {
                ...books[bookIndex],
                isComplete: true
            };
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    // Event handler for marking a book as incomplete
    function markAsIncomplete(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex] = {
                ...books[bookIndex],
                isComplete: false
            };
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    // Event handler for deleting a book
    function deleteBook(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex(book => book.id === bookId);
    
        if (bookIndex !== -1) {
            // Show confirmation dialog
            const isConfirmed = confirm('Yakin ingin menghapus Buku ini?');
    
            if (isConfirmed) {
                // If user clicks "OK" in the confirmation dialog
                books.splice(bookIndex, 1);
                document.dispatchEvent(new Event("bookChanged"));
            } 
        }
    }

    // Display books in the appropriate bookshelves
    function displayBooks(bookList) {
        const incompleteBookshelf = document.querySelector("#incompleteBookshelfList");
        const completeBookshelf = document.querySelector("#completeBookshelfList");

        incompleteBookshelf.innerHTML = "";
        completeBookshelf.innerHTML = "";

        for (const book of bookList) {
            const bookElement = document.createElement("article");
            bookElement.classList.add("book_item");

            const titleElement = document.createElement("h2");
            titleElement.innerText = book.title;

            const authorElement = document.createElement("p");
            authorElement.innerText = "Penulis: " + book.author;

            const yearElement = document.createElement("p");
            yearElement.innerText = "Tahun: " + book.year;

            bookElement.appendChild(titleElement);
            bookElement.appendChild(authorElement);
            bookElement.appendChild(yearElement);

            const actionContainer = document.createElement("div");
            actionContainer.classList.add("action");

            const actionButton = document.createElement("button");
            actionButton.id = book.id;
            actionButton.innerText = book.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca";
            actionButton.classList.add("green");
            actionButton.addEventListener("click", book.isComplete ? markAsIncomplete : markAsComplete);

            const deleteButton = document.createElement("button");
            deleteButton.id = book.id;
            deleteButton.innerText = "Hapus buku";
            deleteButton.classList.add("red");
            deleteButton.addEventListener("click", deleteBook);

            actionContainer.appendChild(actionButton);
            actionContainer.appendChild(deleteButton);
            bookElement.appendChild(actionContainer);

            if (book.isComplete) {
                completeBookshelf.appendChild(bookElement);
            } else {
                incompleteBookshelf.appendChild(bookElement);
            }
        }
    }

    // Save books to local storage and display them
    function saveAndDisplayBooks() {
        localStorage.setItem("books", JSON.stringify(books));
        displayBooks(books);
    }

    // Event listener for page load
    window.addEventListener("load", () => {
        books = JSON.parse(localStorage.getItem("books")) || [];
        displayBooks(books);

        const addBookForm = document.querySelector("#inputBook");
        const searchBookForm = document.querySelector("#searchBook");

        addBookForm.addEventListener("submit", addBook);
        searchBookForm.addEventListener("submit", searchBooks);
        document.addEventListener("bookChanged", saveAndDisplayBooks);
    });
})();
