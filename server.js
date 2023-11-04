const mongoose = require('mongoose');

const dotenv = require('dotenv');
// * dotenv module configuration file path
dotenv.config({ path: './config.env' });

// ! As we are using env variables we need to initialize them before requiring app
const app = require('./index');

// * Database connection function
const mongooseConnect = async () => {
  await mongoose.connect(
    process.env.MONGOOSE_CONNECTION_STRING.replace(
      '<PASS>',
      process.env.DB_PASSWORD,
    ),
  );
  console.log('Database connected successfully....');
};

// * Application start on local server
app.listen(process.env.LOCAL_PORT, () => {
  console.log(`App is running on port ${process.env.LOCAL_PORT}...`);
});

// * Database connection
mongooseConnect();
