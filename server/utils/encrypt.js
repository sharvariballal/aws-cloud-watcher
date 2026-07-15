/**
 * Encryption Utilities (encrypt.js)
 * ============================================================================
 * 
 * WHY THIS FILE EXISTS:
 * Security is paramount, especially when handling AWS configurations and user accounts.
 * This file serves as a dedicated utility module for encrypting data.
 * Instead of embedding password-hashing rules directly into controllers or models,
 * we keep them isolated in this utility file. This makes the encryption logic
 * standard across the whole backend and easy to modify if security standards change.
 * 
 * WHAT WE USE:
 * - bcryptjs: To securely hash and check user login passwords.
 *   Unlike symmetric encryption, hashing is a one-way function. We can never "decrypt"
 *   the password back to plain-text, which protects user data if the database is leaked.
 */

const bcrypt = require('bcryptjs');

/**
 * Generates a secure salt and hashes the plain-text password.
 * @param {string} plainPassword - The user's input password.
 * @returns {Promise<string>} The cryptographically secure hashed password.
 */
const hashPassword = async (plainPassword) => {
  // A "salt" is a random piece of data added to the password before hashing
  // to prevent rainbow-table cracking attacks. 10 rounds is a standard benchmark.
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

/**
 * Compares plain-text user input with the hashed password stored in MongoDB.
 * @param {string} inputPassword - The candidate password input by the user.
 * @param {string} hashedPassword - The existing hash from the database.
 * @returns {Promise<boolean>} True if they match, false otherwise.
 */
const comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
