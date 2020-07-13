import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
const initialComment = {
  text: "",
  created_at: "",
  updated_at: "",
  post_id: "",
  post: "",
};

const Post = (props) => {
  const [commentToggle, setCommentToggle] = useState(false);
  const [comment, setComment] = useState(initialComment);
  const [comments, setComments] = useState([]);
  const [addComment, setAddComment] = useState(false);
  useEffect(() => {
    axios
      .get(`${props.appUrl}/${props.post.id}/comments`)
      .then((response) => {
        // console.log("get response.data", response.data);
        setComments(response.data);
        props.setError("");
      })
      .catch((err) => {
        props.setError(err.message);
        console.log("error: ", err);
      });
  }, [props.post.id]);

  const toggleTrue = () => {
    props.setEdit(true);
    props.setPost(props.post);
  };
  const handleDeletePost = (e) => {
    e.preventDefault();
    props.deletePost(props.post);
  };
  const toggleTrueComment = () => {
    setCommentToggle(true);
  };
  const toggleFalseComment = () => {
    setCommentToggle(false);
  };
  const toggleTrueAddComment = () => {
    setAddComment(true);
  };
  const toggleFalseAddComment = () => {
    setAddComment(false);
    props.setError("");
    setComment(initialComment);
  };
  //handle comments
  const addNewComment = () => {
    axios
      .post(`${props.appUrl}/:id/comments`, comment)
      .then((response) => {
        console.log("get response.data", response.data);
        setComments([...comments, response.data]);
        setComment(initialComment);
        props.setError("");
      })
      .catch((err) => {
        props.setError(err.message);
        console.log("post error: ", err.message);
      });
  };
  const handleAddCommentChange = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
      post_id: props.post.id,
      created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
    });
  };
  const handleAddNewComment = (e) => {
    e.preventDefault();
    addNewComment();
    props.setError("");
  };

  return (
    <div className="post-list ">
      <div>
        <h2>Title: {props.post.title}</h2>
        <p> {props.post.contents}</p>
        <p> Post id: {props.post.id}</p>
        <p>Created at: {props.post.created_at}</p>
        <p>Updated at: {props.post.updated_at}</p>
        <button onClick={toggleTrue} className="item-button">
          Update
        </button>

        <button onClick={handleDeletePost} className="item-button">
          Delete
        </button>
      </div>

      {!commentToggle && (
        <div
          onClick={toggleTrueComment}
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <h3 style={{ color: "grey" }}>Read Comments... </h3>
        </div>
      )}

      {commentToggle && (
        <div className="comments">
          {comments.map((c, index) => (
            <p key={index}>{c.text}</p>
          ))}
          {addComment && (
            <form onSubmit={handleAddNewComment}>
              <label htmlFor="text">
                Text
                <input
                  id="text"
                  type="text"
                  name="text"
                  onChange={handleAddCommentChange}
                  value={comment.text}
                />
              </label>
              <div style={{ display: "flex" }}>
                <button type="submit">Submit</button>
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={toggleFalseAddComment}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <button onClick={toggleTrueAddComment} className="item-button">
            Add Comment
          </button>

          <div
            onClick={toggleFalseComment}
            style={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <h3 style={{ color: "black" }}>Hide Comments... </h3>
          </div>
        </div>
      )}
    </div>
  );
};
export default Post;
