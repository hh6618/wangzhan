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
            <div class="comments-section">
                <h4>评论</h4>
                <div class="comments-list"></div>
                <form class="comment-form">
                    <input type="text" class="comment-author" placeholder="您的名字" required>
                    <textarea class="comment-text" placeholder="您的评论" required></textarea>
                    <button type="submit">发表评论</button>
                </form>
            </div>
        `;
        postsContainer.prepend(postElement); // 新文章显示在最上面

        // 添加点击事件监听器
        const toggleButton = postElement.querySelector('.toggle-content');
        const postContentDiv = postElement.querySelector('.post-content');
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

        // 评论逻辑
        const commentsList = postElement.querySelector('.comments-list');
        const commentForm = postElement.querySelector('.comment-form');
        const commentAuthorInput = postElement.querySelector('.comment-author');
        const commentTextInput = postElement.querySelector('.comment-text');

        // 加载评论
        function loadComments(postId) {
            const allComments = JSON.parse(localStorage.getItem('comments')) || {};
            const postComments = allComments[postId] || [];
            commentsList.innerHTML = '';
            postComments.forEach(comment => addCommentToDOM(comment, commentsList, false));
        }

        // 添加评论到 DOM
        function addCommentToDOM(comment, container, save = true) {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment-item');
            commentElement.innerHTML = `
                <p><strong>${comment.author}</strong>: ${comment.text}</p>
                <small>${new Date(comment.timestamp).toLocaleString()}</small>
            `;
            container.appendChild(commentElement);

            if (save) {
                const allComments = JSON.parse(localStorage.getItem('comments')) || {};
                if (!allComments[post.timestamp]) { // 使用文章时间戳作为唯一ID
                    allComments[post.timestamp] = [];
                }
                allComments[post.timestamp].push(comment);
                localStorage.setItem('comments', JSON.stringify(allComments));
            }
        }

        // 处理评论提交
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const author = commentAuthorInput.value.trim();
            const text = commentTextInput.value.trim();

            if (author && text) {
                const newComment = {
                    author: author,
                    text: text,
                    timestamp: new Date().toISOString()
                };
                addCommentToDOM(newComment, commentsList);
                commentAuthorInput.value = '';
                commentTextInput.value = '';
            } else {
                alert('评论者姓名和评论内容都不能为空！');
            }
        });

        // 页面加载时加载评论
        loadComments(post.timestamp); // 使用文章时间戳作为唯一ID


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