import app from './app.js';
import connectDB from './db.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server running  on port ${PORT}`);
  connectDB();
});
