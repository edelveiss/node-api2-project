const express = require("express");
const Posts = require("../data/db.js");
//creates a new standalone express router
const router = express.Router();

//Returns an array of all the post objects contained in the database.
router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});
//Returns the post object with the specified id.
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post[0]);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The post information could not be retrieved.",
      });
    });
});
//Returns an array of all the comment objects associated with the post with the specified id.
router.get("/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        return Posts.findPostComments(req.params.id);
      }
    })
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The comments information could not be retrieved.",
      });
    });
});
//Creates a post using the information sent inside the `request body`.
router.post("/", (req, res) => {
  const newPost = {
    title: req.body.title,
    contents: req.body.contents,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
  };
  Posts.insert(newPost)
    .then((post) => {
      if (newPost.title && newPost.contents) {
        res.status(201).json({ ...newPost, id: post.id });
      } else {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});
//Creates a comment for the post with the specified id using information sent inside of the `request body`.
router.post("/:id/comments", (req, res) => {
  const comment = {
    text: req.body.text,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
    post_id: req.body.post_id,
  };
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        if (!req.body.text) {
          res
            .status(404)
            .json({ errorMessage: "Please provide text for the comment." });
        } else {
          Posts.insertComment(comment)
            .then((commID) => {
              res.status(201).json({ ...comment, id: commID.id });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database",
              });
            });
        }
      }
    })

    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});
//Removes the post with the specified id and returns the deleted post object
router.delete("/:id", (req, res) => {
  let delPost = {};
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        delPost = {
          id: post[0].id,
          title: post[0].title,
          contents: post[0].contents,
          created_at: post[0].created_at,
          updated_at: post[0].updated_at,
        };

        Posts.remove(req.params.id).then((postId) => {
          res.status(200).json(delPost);
        });
      }
    })

    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
});

//Updates the post with the specified `id` using data from the `request body`. Returns the modified document
router.put("/:id", (req, res) => {
  const changes = req.body;
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      } else {
        Posts.update(req.params.id, changes).then((count) => {
          if (count) {
            Posts.findById(req.params.id)
              .then((p) => {
                res.status(200).json(p[0]);
              })
              .catch((err) =>
                res
                  .status(500)
                  .json({
                    error: "The post information could not be modified.",
                  })
              );
          } else {
            res.status(400).json({
              errorMessage: "The post with the specified ID does not exist.",
            });
          }
        });
      }
    })

    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be modified.",
      });
    });
});

module.exports = router;
