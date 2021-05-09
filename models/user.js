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
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({username}, SECRET_KEY);
        return results.json({message:`Logged in!`, token})
      }
    }
    throw new ExpressError("Invalid username/password", 400);
  } catch(e) {
    return next(e);
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

  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;