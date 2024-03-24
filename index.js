const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

let users=[
    {
        username: 'user1',
        password: 'password1'
    },
    {
        username: 'user2',
        password: 'password2'
    },
    {
        username: 'user3',
        password: 'password3'
    },
    {
        username: 'user4',
        password: 'password4'
    },
    {
        username: 'Anil',
        password: '1234'
    }
];

const books = [
    {
        ISBN: '9780141439570',
        title: 'Pride and Prejudice',
        author: 'Jane Austen'
    },
    {
        ISBN: '9780061120084',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee'
    },
    {
        ISBN: '9780743273565',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald'
    },
    {
        ISBN: '9781400032716',
        title: '1984',
        author: 'George Orwell'
    },
  ];

const reviews = [
    {
        username: 'Anil',
        ISBN: '9780141439570',
        rating: 4,
        review: 'Good book'
    },
    {
        ISBN: '9780061120084',
        rating: 5,
        review: 'Excellent book'
    },
    {
        ISBN: '9780743273565',
        rating: 3,
        review: 'Average book'
    },
    {
        ISBN: '9781400032716',
        rating: 2,
        review: 'Not so good book'
    },
  ];


app.get('/', (req, res) => {
    res.json(books);
  });

app.get('/isbn/:isbn', (req, res) => { 
    const isbn = req.params.isbn;
    const book = books.find(book => book.ISBN === isbn);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });

app.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const authorBooks = books.filter(book => book.author === author);
    res.json(authorBooks);
  });

app.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const titleBooks = books.filter(book => book.title === title);
    res.json(titleBooks);
  });

app.get('/reviews/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const review = reviews.find(review => review.ISBN === isbn);
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  });

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/customer/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
     const user = users.find(user => user.username === username);

     if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ username }, 'your_secret_key_here');
    res.json({ token });
});


app.post('/books/:isbn/review', (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = "Anil"; 
    if (!review) {
        return res.status(400).json({ error: 'Review is required' });
    }

    const existingReviewIndex = reviews.findIndex(r => r.isbn === isbn && r.username === username);

    if (existingReviewIndex !== -1) {
        reviews[existingReviewIndex].review = review;
        res.json({ message: 'Review modified successfully' });
    } else {
        reviews.push({ isbn, username, review });
        res.status(201).json({ message: 'Review added successfully' });
    }
});


app.delete('/auth/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const username = "Anil";
    const reviewIndex = reviews.findIndex(review => review.ISBN === isbn && review.username === username);

    if (reviewIndex === -1) {
        return res.status(404).json({ error: 'Review not found' });
    }
    reviews.splice(reviewIndex, 1);
    res.json({ message: 'Review deleted successfully' });
});

const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
