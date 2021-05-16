/** User class for message.ly */
const db = require("../db");
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require("../config")
const jwt = require("jsonwebtoken");


/** User of the site. */

class User {


  static async register({username, password, first_name, last_name, phone}) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(`
      INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at) 
      VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp) 
      RETURNING username, password, first_name, last_name, phone`, 
      [username, hashedPassword, first_name, last_name, phone]);
    return result.rows[0];
  }

  static async authenticate(username, password) {
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }
    const results = await db.query(`
      SELECT username, password 
      FROM users WHERE username=$1`, 
      [username])
    const user = results.rows[0];
    return user && await bcrypt.compare(password, user.password);
  }


  static async updateLoginTimestamp(username) {
    const result = await db.query(`
      UPDATE users 
      SET last_login_at=current_timestamp 
      WHERE username=$1`, 
      [username]);
    return result.rows[0];
  }

  static async all() {
    const result = await db.query(`
      SELECT username, first_name, last_name, phone 
      FROM users`);
    return result.rows;
  }

  static async get(username) {
    const result = await db.query(`
      SELECT username, first_name, last_name, phone 
      FROM users 
      WHERE username=$1`, 
      [username])
    return result.rows[0];
  }

  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT m.id,
              m.from_username,
              u.first_name,
              u.last_name,
              u.phone,
              m.body,
              m.sent_at,
              m.read_at
        FROM messages AS m
         JOIN users AS u ON m.from_username = u.username
        WHERE to_username = $1`,
      [username]);

    return result.rows.map(m => ({
      id: m.id,
      to_user: {
        username: m.to_username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone
      },
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at
    }));
  }

  static async messagesTo(username) {
    const result = await db.query(
      `SELECT m.id,
              m.from_username,
              u.first_name,
              u.last_name,
              u.phone,
              m.body,
              m.sent_at,
              m.read_at
        FROM messages AS m
         JOIN users AS u ON m.from_username = u.username
        WHERE to_username = $1`,
      [username]);
      
    return result.rows.map(m => ({
      id: m.id,
      from_user: {
        username: m.from_username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone,
      },
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at
    }));
  }
}


module.exports = User;