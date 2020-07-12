require("dotenv").config();
const express = require("express");

const postsRouter = require("./posts/posts-router");
const cors = require("cors");
const port = process.env.PORT || 5000;
//const PORT = 4000;
const server = express();

server.use(express.json());
server.use(cors());
server.use("/api/posts", postsRouter);
//API test
server.get("/", (req, res) => {
  const motd = process.env.MOTD || "hello world!";
  res.send({
    motd: motd,
    mess: `
            <h2>Lambda Posts API</h>
            <p>Welcome to the Lambda Posts API</p>
          `,
  });
  //   res.send(`
  //         <h2>Lambda Posts API</h>
  //         <p>Welcome to the Lambda Posts API</p>
  //       `);
});

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
