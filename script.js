document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postTitleInput = document.getElementById('postTitle');
    const postContentInput = document.getElementById('postContent');
    const postsContainer = document.getElementById('postsContainer');

    // 从 localStorage 加载文章
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        postsContainer.innerHTML = ''; // 清空现有内容
        posts.forEach(post => addPostToDOM(post, false)); // 不保存，因为是从存储中加载
    }

    // 将文章添加到 DOM
    function addPostToDOM(post, save = true) {
        const postElement = document.createElement('div');
        postElement.classList.add('post-item');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>发布于: ${new Date(post.timestamp).toLocaleString()}</small>
        `;
        postsContainer.prepend(postElement); // 新文章显示在最上面

        if (save) {
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.push(post);
            localStorage.setItem('posts', JSON.stringify(posts));
        }
    }

    // 处理表单提交
    postForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为

        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();

        if (title && content) {
            const newPost = {
                title: title,
                content: content,
                timestamp: new Date().toISOString()
            };
            addPostToDOM(newPost); // 添加新文章并保存
            postTitleInput.value = ''; // 清空输入框
            postContentInput.value = '';
        } else {
            alert('标题和内容都不能为空！');
        }
    });

    // 页面加载时加载文章
    loadPosts();
});