import express from 'express';
const app = express();
app.use(express.json());

const identifyHandler = require('./identify').default;

app.post('/identify', identifyHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});