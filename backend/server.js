import express from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE_NAME = process.env.TASKS_TABLE || 'Tasks';

// If running against local DynamoDB (docker-compose: port 8000), set endpoint through env var
const ddbClientOptions = {};
if (process.env.DYNAMODB_ENDPOINT) {
  ddbClientOptions.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const client = new DynamoDBClient({ region: REGION, ...ddbClientOptions });
const ddb = DynamoDBDocumentClient.from(client);

// GET /tasks
app.get('/tasks', async (req, res) => {
  try {
    const data = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(data.Items || []);
  } catch (err) {
    console.error('Scan error', err);
    res.status(500).json({ error: 'Could not scan table' });
  }
});

// POST /tasks
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });

  const item = { id: uuidv4(), title, description: description || '' };
  try {
    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    res.status(201).json(item);
  } catch (err) {
    console.error('Put error', err);
    res.status(500).json({ error: 'Could not put item' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
    res.json({ deleted: id });
  } catch (err) {
    console.error('Delete error', err);
    res.status(500).json({ error: 'Could not delete item' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend running on port ${port}`));

