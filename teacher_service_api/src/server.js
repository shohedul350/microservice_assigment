import app from './app.js';
import connectDB from './db.js';

const PORT = 5003;

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server running  on port ${PORT}`);
  connectDB();
});
