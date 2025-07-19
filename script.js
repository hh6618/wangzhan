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
            <div class="post-content">${post.content}</div>
            <small>发布于: ${new Date(post.timestamp).toLocaleString()}</small>
            <button class="toggle-content">展开/收起</button>
        `;
        postsContainer.prepend(postElement); // 新文章显示在最上面

        // 添加点击事件监听器
        const toggleButton = postElement.querySelector('.toggle-content');
        const postContentDiv = postElement.querySelector('.post-content'); // 假设内容在一个 div 中
        if (postContentDiv) {
            postContentDiv.style.display = 'none'; // 默认隐藏
            toggleButton.textContent = '展开';
            toggleButton.addEventListener('click', () => {
                if (postContentDiv.style.display === 'none') {
                    postContentDiv.style.display = 'block';
                    toggleButton.textContent = '收起';
                } else {
                    postContentDiv.style.display = 'none';
                    toggleButton.textContent = '展开';
                }
            });
        }


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