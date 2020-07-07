import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import PostForm from "./components/PostForm";
import Post from "./components/Post";
import moment from "moment";
const initialPost = {
  title: "",
  contents: "",
  // created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
  created_at: "",
  updated_at: "",
};

function App() {
  const [posts, setPosts] = useState([]);

  const [post, setPost] = useState(initialPost);

  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/posts")
      .then((response) => {
        // console.log("get response.data", response.data);
        setPosts(response.data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        console.log("error: ", err);
      });
  }, []);

  const addNewPost = () => {
    axios
      .post("http://localhost:4000/api/posts", post)
      .then((response) => {
        console.log("get response.data", response.data);
        setPosts([...posts, response.data]);
        setPost(initialPost);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        console.log("post error: ", err.message);
      });
  };
  const editPost = () => {
    axios
      .put(`http://localhost:4000/api/posts/${post.id}`, post)
      .then((response) => {
        //console.log("resp data in put post", response);
        const newPosts = posts.map((u) => {
          if (u.id === post.id) {
            return response.data;
          } else {
            return u;
          }
        });
        setPosts(newPosts);
        setPost(initialPost);
        setEdit(false);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        console.log("err", err);
      });
  };

  const deletePost = (post) => {
    //console.log("user in deleteUser", user.id);
    axios
      .delete(`http://localhost:4000/api/posts/${post.id}`)
      .then((response) => {
        //console.log("resp del", response);
        const newPosts = posts.filter((u) => u.id !== response.data.id);

        setPosts(newPosts);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  const handleAddChange = (e) => {
    console.log("addchange", e.target.value);
    setPost({
      ...post,
      [e.target.name]: e.target.value,
      created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
    });
  };
  const handleEditChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
      updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
    });
  };
  const handleAddNewPost = (e) => {
    e.preventDefault();
    addNewPost();
    setError("");
  };
  const handleEditPost = (e) => {
    e.preventDefault();
    editPost();
    setError("");
  };

  return (
    <div className="App">
      <div className="post-home">
        <div className="post">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              deletePost={deletePost}
              editPost={editPost}
              handleChange={handleEditChange}
              edit={edit}
              setEdit={setEdit}
              setPost={setPost}
              error={error}
              setError={setError}
            />
          ))}
        </div>
        <PostForm
          handleAddNewPost={handleAddNewPost}
          post={post}
          setPost={setPost}
          handleAddChange={handleAddChange}
          handleEditChange={handleEditChange}
          handleEditPost={handleEditPost}
          edit={edit}
          setEdit={setEdit}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  );
}

export default App;
