import React from "react";

const PostForm = (props) => {
  const initialPost = {
    title: "",
    contents: "",
    created_at: "",
    updated_at: "",
  };

  const cancelNewPost = (e) => {
    e.preventDefault();
    props.setPost(initialPost);
    props.setEdit(false);
    props.setError("");
  };

  return (
    <div className="post-form">
      <div style={{ width: "100%" }}>
        <h2
          style={{
            background: "#afeeed",
            textAlign: "center",
          }}
        >
          {props.edit ? "Update Post" : "Add new Post"}
        </h2>
      </div>
      <form
        onSubmit={props.edit ? props.handleEditPost : props.handleAddNewPost}
      >
        <label htmlFor="title">
          Title
          <textarea
            rows="4"
            cols="50"
            id="title"
            type="text"
            name="title"
            onChange={
              // props.handleChange
              props.edit ? props.handleEditChange : props.handleAddChange
            }
            value={props.post.title}
          />
        </label>

        <label htmlFor="contents">
          Contents
          <textarea
            rows="4"
            cols="50"
            id="contents"
            type="text"
            name="contents"
            onChange={
              // props.handleChange
              props.edit ? props.handleEditChange : props.handleAddChange
            }
            value={props.post.contents}
          />
        </label>
        {props.error && <div className="error">{props.error}</div>}
        <div style={{ display: "flex" }}>
          <button type="submit">Submit</button>
          <button style={{ marginLeft: "1rem" }} onClick={cancelNewPost}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default PostForm;
