document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postTitleInput = document.getElementById('postTitle');
    const postContentInput = document.getElementById('postContent');
    const postsContainer = document.getElementById('postsContainer');

    // 从 localStorage 加载文章
    const API_BASE_URL = 'http://localhost:3000';

    async function loadPosts() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`);
            const posts = await response.json();
            postsContainer.innerHTML = ''; // 清空现有内容
            posts.forEach(post => addPostToDOM(post));
        } catch (error) {
            console.error('Error loading posts:', error);
            alert('加载文章失败，请检查服务器是否运行。');
        }
    }

    // 将文章添加到 DOM
    async function addPostToDOM(post) {
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
        async function loadComments(postId) {
            try {
                const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
                const comments = await response.json();
                commentsList.innerHTML = '';
                comments.forEach(comment => addCommentToDOM(comment, commentsList));
            } catch (error) {
                console.error(`Error loading comments for post ${postId}:`, error);
            }
        }

        // 添加评论到 DOM
        function addCommentToDOM(comment, container) {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment-item');
            commentElement.innerHTML = `
                <p><strong>${comment.author}</strong>: ${comment.text}</p>
                <small>${new Date(comment.timestamp).toLocaleString()}</small>
            `;
            container.appendChild(commentElement);
        }

        // 处理评论提交
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const author = commentAuthorInput.value.trim();
            const text = commentTextInput.value.trim();

            if (author && text) {
                try {
                    const response = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ author, text })
                    });
                    const newComment = await response.json();
                    if (response.ok) {
                        addCommentToDOM(newComment, commentsList);
                        commentAuthorInput.value = '';
                        commentTextInput.value = '';
                    } else {
                        alert(`发表评论失败: ${newComment.message || response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error posting comment:', error);
                    alert('发表评论失败，请检查服务器是否运行。');
                }
            } else {
                alert('评论者姓名和评论内容都不能为空！');
            }
        });

        // 页面加载时加载评论
        loadComments(post.id);
    }

    // 处理表单提交
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // 阻止表单默认提交行为

        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();

        if (title && content) {
            try {
                const response = await fetch(`${API_BASE_URL}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content })
                });
                const newPost = await response.json();
                if (response.ok) {
                    addPostToDOM(newPost); // 添加新文章并保存
                    postTitleInput.value = ''; // 清空输入框
                    postContentInput.value = '';
                } else {
                    alert(`发布文章失败: ${newPost.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Error posting article:', error);
                alert('发布文章失败，请检查服务器是否运行。');
            }
        } else {
            alert('标题和内容都不能为空！');
        }
    });

    // 页面加载时加载文章
    loadPosts();
});