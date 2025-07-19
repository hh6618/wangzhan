const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let posts = [];
let comments = {}; // { postId: [{ author, text, timestamp }] }

// 获取所有文章
app.get('/posts', (req, res) => {
    res.json(posts);
});

// 发布新文章
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }
    const newPost = {
        id: Date.now().toString(), // 简单的唯一ID
        title,
        content,
        timestamp: new Date().toISOString()
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// 获取某篇文章的评论
app.get('/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    res.json(comments[postId] || []);
});

// 发布评论
app.post('/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    const { author, text } = req.body;
    if (!author || !text) {
        return res.status(400).json({ message: 'Author and text are required.' });
    }
    const newComment = {
        author,
        text,
        timestamp: new Date().toISOString()
    };
    if (!comments[postId]) {
        comments[postId] = [];
    }
    comments[postId].push(newComment);
    res.status(201).json(newComment);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});