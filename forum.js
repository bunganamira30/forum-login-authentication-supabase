// Initialize Supabase
const supabaseUrl = "https://vbjgibvqjaotgiwsobfx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiamdpYnZxamFvdGdpd3NvYmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjQ4MjcsImV4cCI6MjA3NjgwMDgyN30.1wrh1Mme4lKZFmJnTwIbVefxz1Hci5XUcKEoypx854s";

  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = null;
let currentFilter = "all";

// Check authentication
async function checkAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  currentUser = user;
  document.getElementById("userName").textContent =
    user.user_metadata.name || user.email;
  loadPosts();
}

// Logout
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// Create Post
async function createPost() {
  const content = document.getElementById("postContent").value.trim();

  if (!content) {
    alert("Silakan tulis sesuatu terlebih dahulu!");
    return;
  }

  try {
    const { data, error } = await supabase.from("posts").insert([
      {
        content: content,
        user_id: currentUser.id,
        user_name: currentUser.user_metadata.name || currentUser.email,
        user_email: currentUser.email,
      },
    ]);

    if (error) throw error;

    document.getElementById("postContent").value = "";
    loadPosts();
  } catch (error) {
    console.error("Error creating post:", error);
    alert(
      'Gagal membuat postingan. Pastikan tabel "posts" sudah dibuat di Supabase!'
    );
  }
}

// Load Posts
async function loadPosts() {
  try {
    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (currentFilter === "my") {
      query = query.eq("user_id", currentUser.id);
    }

    const { data, error } = await query;

    if (error) throw error;

    displayPosts(data);
  } catch (error) {
    console.error("Error loading posts:", error);
    document.getElementById("postsContainer").innerHTML =
      '<div class="empty-state">Error loading posts. Pastikan tabel "posts" sudah dibuat!</div>';
  }
}

// Display Posts
function displayPosts(posts) {
  const container = document.getElementById("postsContainer");

  if (posts.length === 0) {
    container.innerHTML = '<div class="empty-state">Belum ada postingan.</div>';
    return;
  }

  container.innerHTML = posts
    .map((post) => {
      const isMyPost = post.user_id === currentUser.id;
      const date = new Date(post.created_at).toLocaleString("id-ID");

      return `
                    <div class="post" data-id="${post.id}">
                        <div class="post-header">
                            <span class="post-author">${post.user_name}</span>
                            <span class="post-time">${date}</span>
                        </div>
                        <div class="post-content" id="content-${post.id}">${
        post.content
      }</div>
                        ${
                          isMyPost
                            ? `
                            <div class="post-actions">
                                <button class="edit-btn" onclick="editPost('${post.id}')">Edit</button>
                                <button class="delete-btn" onclick="deletePost('${post.id}')">Hapus</button>
                            </div>
                            <div class="edit-form" id="edit-${post.id}" style="display: none;">
                                <textarea class="edit-textarea" id="edit-content-${post.id}">${post.content}</textarea>
                                <button class="save-btn" onclick="saveEdit('${post.id}')">Simpan</button>
                                <button class="cancel-btn" onclick="cancelEdit('${post.id}')">Batal</button>
                            </div>
                        `
                            : ""
                        }
                    </div>
                `;
    })
    .join("");
}

// Edit Post
function editPost(postId) {
  document.getElementById(`content-${postId}`).style.display = "none";
  document.getElementById(`edit-${postId}`).style.display = "block";
}

function cancelEdit(postId) {
  document.getElementById(`content-${postId}`).style.display = "block";
  document.getElementById(`edit-${postId}`).style.display = "none";
}

async function saveEdit(postId) {
  const newContent = document
    .getElementById(`edit-content-${postId}`)
    .value.trim();

  if (!newContent) {
    alert("Konten tidak boleh kosong!");
    return;
  }

  try {
    const { error } = await supabase
      .from("posts")
      .update({ content: newContent })
      .eq("id", postId);

    if (error) throw error;

    loadPosts();
  } catch (error) {
    console.error("Error updating post:", error);
    alert("Gagal mengupdate postingan!");
  }
}

// Delete Post
async function deletePost(postId) {
  if (!confirm("Yakin ingin menghapus postingan ini?")) {
    return;
  }

  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) throw error;

    loadPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Gagal menghapus postingan!");
  }
}

// Filter Functions
function showAllPosts() {
  currentFilter = "all";
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
  loadPosts();
}

function showMyPosts() {
  currentFilter = "my";
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
  loadPosts();
}

// Initialize
checkAuth();

// Auto refresh every 10 seconds
setInterval(loadPosts, 10000);
