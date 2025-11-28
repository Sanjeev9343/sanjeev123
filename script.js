// Sample posts data
let posts = [
    {
        id: 1,
        username: 'photographer',
        avatar: 'fas fa-user',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        caption: 'Beautiful sunset at the beach 🌅 #sunset #beach',
        likes: 1245,
        comments: 89,
        time: '2 hours ago',
        liked: false,
        bookmarked: false
    },
    {
        id: 2,
        username: 'traveler',
        avatar: 'fas fa-user',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
        caption: 'Exploring new places ✈️ #travel #adventure',
        likes: 892,
        comments: 45,
        time: '5 hours ago',
        liked: false,
        bookmarked: false
    },
    {
        id: 3,
        username: 'foodie',
        avatar: 'fas fa-user',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
        caption: 'Delicious brunch! 🍳 #food #brunch',
        likes: 567,
        comments: 23,
        time: '1 day ago',
        liked: false,
        bookmarked: false
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderPosts();
    setupEventListeners();
});

// Render all posts
function renderPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Create a post element
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.dataset.postId = post.id;

    const likedClass = post.liked ? 'liked' : '';
    const bookmarkedClass = post.bookmarked ? 'bookmarked' : '';

    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">
                <i class="${post.avatar}"></i>
            </div>
            <span class="post-username">${post.username}</span>
        </div>
        <img src="${post.image}" alt="Post" class="post-image" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Not+Found'">
        <div class="post-actions">
            <i class="far fa-heart ${likedClass}" data-action="like" data-post-id="${post.id}"></i>
            <i class="far fa-comment" data-action="comment" data-post-id="${post.id}"></i>
            <i class="far fa-paper-plane" data-action="share" data-post-id="${post.id}"></i>
            <i class="far fa-bookmark ${bookmarkedClass}" data-action="bookmark" data-post-id="${post.id}" style="margin-left: auto;"></i>
        </div>
        <div class="post-likes">${formatNumber(post.likes)} likes</div>
        <div class="post-caption">
            <span class="username">${post.username}</span>
            ${post.caption}
        </div>
        <div class="post-comments">View all ${post.comments} comments</div>
        <div class="post-time">${post.time}</div>
    `;

    return postDiv;
}

// Format numbers (e.g., 1245 -> 1.2K)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Setup event listeners
function setupEventListeners() {
    // Create post modal
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const closeModal = document.getElementById('closeModal');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewArea = document.getElementById('previewArea');
    const previewImage = document.getElementById('previewImage');
    const submitPost = document.getElementById('submitPost');
    const captionInput = document.getElementById('captionInput');

    createPostBtn.addEventListener('click', () => {
        createPostModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        createPostModal.classList.remove('active');
        resetPostForm();
    });

    // Close modal when clicking outside
    createPostModal.addEventListener('click', (e) => {
        if (e.target === createPostModal) {
            createPostModal.classList.remove('active');
            resetPostForm();
        }
    });

    // Upload area click
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // Image input change
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImage.src = event.target.result;
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Submit post
    submitPost.addEventListener('click', () => {
        const imageSrc = previewImage.src;
        const caption = captionInput.value.trim();

        if (imageSrc && imageSrc !== '') {
            const newPost = {
                id: posts.length + 1,
                username: 'your_username',
                avatar: 'fas fa-user-circle',
                image: imageSrc,
                caption: caption || '',
                likes: 0,
                comments: 0,
                time: 'just now',
                liked: false,
                bookmarked: false
            };

            posts.unshift(newPost);
            renderPosts();
            createPostModal.classList.remove('active');
            resetPostForm();
        } else {
            alert('Please select an image first!');
        }
    });

    // Post actions (like, comment, bookmark)
    document.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const postId = parseInt(e.target.dataset.postId);

        if (action === 'like') {
            toggleLike(postId, e.target);
        } else if (action === 'bookmark') {
            toggleBookmark(postId, e.target);
        } else if (action === 'comment') {
            showCommentInput(postId);
        } else if (action === 'share') {
            sharePost(postId);
        }
    });
}

// Toggle like
function toggleLike(postId, iconElement) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        if (post.liked) {
            post.likes++;
            iconElement.classList.remove('far');
            iconElement.classList.add('fas', 'liked');
        } else {
            post.likes--;
            iconElement.classList.remove('fas', 'liked');
            iconElement.classList.add('far');
        }
        updatePostLikes(postId, post.likes);
    }
}

// Toggle bookmark
function toggleBookmark(postId, iconElement) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.bookmarked = !post.bookmarked;
        if (post.bookmarked) {
            iconElement.classList.remove('far');
            iconElement.classList.add('fas', 'bookmarked');
        } else {
            iconElement.classList.remove('fas', 'bookmarked');
            iconElement.classList.add('far');
        }
    }
}

// Update post likes count
function updatePostLikes(postId, likes) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
        const likesElement = postElement.querySelector('.post-likes');
        likesElement.textContent = `${formatNumber(likes)} likes`;
    }
}

// Show comment input
function showCommentInput(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        const comment = prompt('Add a comment:');
        if (comment && comment.trim()) {
            post.comments++;
            updatePostComments(postId, post.comments);
        }
    }
}

// Update post comments count
function updatePostComments(postId, comments) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
        const commentsElement = postElement.querySelector('.post-comments');
        commentsElement.textContent = `View all ${comments} comments`;
    }
}

// Share post
function sharePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        if (navigator.share) {
            navigator.share({
                title: `Post by ${post.username}`,
                text: post.caption,
                url: window.location.href
            }).catch(err => console.log('Error sharing', err));
        } else {
            // Fallback: copy to clipboard
            const text = `Check out this post by ${post.username}: ${post.caption}`;
            navigator.clipboard.writeText(text).then(() => {
                alert('Post link copied to clipboard!');
            });
        }
    }
}

// Reset post form
function resetPostForm() {
    document.getElementById('imageInput').value = '';
    document.getElementById('previewImage').src = '';
    document.getElementById('captionInput').value = '';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('previewArea').style.display = 'none';
}

// Follow button functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('follow-btn')) {
        if (e.target.textContent === 'Follow') {
            e.target.textContent = 'Following';
            e.target.style.color = '#262626';
        } else {
            e.target.textContent = 'Follow';
            e.target.style.color = '#0095f6';
        }
    }
});


