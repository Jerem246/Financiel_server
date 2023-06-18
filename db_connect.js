// Connexion

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '02Jeremy02',
//   database: 'FinancielImmo',
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the MySQL server:', err);
//     return;
//   }
//   console.log('Connected to the MySQL server.');
// });

// module.exports = connection;

// Create Database

// const dbName = 'FinancielImmo';

// connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err, result) => {
//   if (err) {
//     console.error('Error creating the database:', err);
//     return;
//   }
//   console.log(`Database "${dbName}" created successfully.`);
//   connection.end();
// });

// Create Table

// const createReviewsTable = () => {
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS admin (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         email VARCHAR(255) NOT NULL,
//         password TEXT NOT NULL,
//         Token
//       );
//     `;

//     connection.query(createTableQuery, (err, result) => {
//       if (err) {
//         console.error('Error creating the reviews table:', err);
//         return;
//       }
//       console.log('Reviews table created successfully.');
//     });
// };

// createReviewsTable();

// Insert content table

// const insertReviews = (reviews) => {
//   const query = 'INSERT INTO reviews (username, content, years, software) VALUES ?';
//   const values = reviews.map((review) => [review.username, review.content, review.years, review.software]);

//   connection.query(query, [values], (err, result) => {
//     if (err) {
//       console.error('Error inserting reviews:', err);
//       return;
//     }

//     console.log('Reviews inserted successfully:', result.affectedRows);
//   });
// };

