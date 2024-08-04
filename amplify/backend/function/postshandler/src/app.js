const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const ddbClient = new DynamoDBClient({ region: "eu-north-1" });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "posts-dev";
// if (process.env.ENV && process.env.ENV !== "NONE") {
//   tableName = `${tableName}-dev`;
// }
app.use(cors());
app.use(bodyParser.json());

// Create a new post
app.post("/posts", async (req, res) => {
  const { id, content } = req.body;
  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: tableName,
        Item: { id, content },
      })
    );
    res.status(201).json({ message: "Post created", id });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could not create post", details: err.message });
  }
});

// Get a single post by ID
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      })
    );
    res.status(200).json(result.Item);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could not retrieve post", details: err.message });
  }
});

// List all posts
app.get("/posts", async (req, res) => {
  try {
    const result = await ddbDocClient.send(
      new ScanCommand({ TableName: tableName })
    );
    res.status(200).json(result.Items);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could not retrieve posts", details: err.message });
  }
});

// Update a post by ID
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression: "set content = :content",
        ExpressionAttributeValues: {
          ":content": content,
        },
        ReturnValues: "ALL_NEW",
      })
    );
    res.status(200).json({ message: "Post updated", id });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could not update post", details: err.message });
  }
});

// Delete a post by ID
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id },
      })
    );
    res.status(200).json({ message: "Post deleted", id });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could not delete post", details: err.message });
  }
});

app.listen(3000, () => {
  console.log("App started");
});

module.exports = app;
