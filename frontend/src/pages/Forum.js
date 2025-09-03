import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Forum.css";

function Forum() {
  const [posts, setPosts] = useState([
    {
        id: 1,
        title: "📖 Monthly Book Club: Sci-Fi Edition!",
        content: "Join us as we read and discuss 'Dune' by Frank Herbert. Share your thoughts and favorite moments!",
        author: "Alice Johnson",
      },
      {
        id: 2,
        title: "🍳 Cooking Challenge: 5-Ingredient Meals",
        content: "Can you make a delicious meal with only 5 ingredients? Share your recipe and let's get cooking!",
        author: "Chef Alex",
      },
      {
        id: 3,
        title: "🌱 Gardening Tips for Beginners",
        content: "Starting your first garden? Here are some beginner-friendly plants and tips to get started.",
        author: "GreenThumb101",
      },
      {
        id: 4,
        title: "💪 Home Workout Challenge",
        content: "A 7-day fitness challenge! Post your progress and motivate each other to stay active.",
        author: "FitnessGuru",
      },
      {
        id: 5,
        title: "🎨 Creative Art Contest: Theme - Nature",
        content: "Show off your artistic skills! Submit your artwork inspired by nature and win exciting prizes!",
        author: "ArtLover",
      },
      {
        id: 6,
        title: "🚀 Tech Talk: AI in Everyday Life",
        content: "How is AI changing our daily routines? Share your thoughts on AI applications in daily life!",
        author: "TechieMike",
      },
      {
        id: 7,
        title: "🎵 Music Lovers: Favorite Songs This Month?",
        content: "What songs have been on repeat for you this month? Drop your playlist below!",
        author: "MelodyQueen",
      },
      {
        id: 8,
        title: "🎮 Game Night: Multiplayer Madness",
        content: "Looking for gaming buddies? Let's plan an online game night together!",
        author: "GamerX",
      },
  ]);

  const [newPost, setNewPost] = useState({ author: "", title: "", content: "" });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.author || !newPost.title || !newPost.content) {
      toast.error("All fields are required!");
      return;
    }
    setPosts([...posts, { ...newPost, id: posts.length + 1 }]);
    setNewPost({ author: "", title: "", content: "" });
    setShowForm(false);
    toast.success("Post added successfully!");
  };

  return (
    <>
      <Navbar />
      <div className="forum-container">
        <h1 className="forum-heading">Community Forum</h1>
        <p className="forum-subheading">Share stories, ask questions, and participate in group activities!</p>

        <button className="add-post-btn" onClick={() => setShowForm(true)}>➕ Add Post</button>

        <div className="posts-container">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="post-author">By {post.author}</p>
              <p className="post-content">{post.content}</p>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="form-overlay">
            <div className="post-form">
              <h2>Add New Post</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Post Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Post Content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                />
                <button type="submit" className="submit-btn">Post</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
}

export default Forum;
