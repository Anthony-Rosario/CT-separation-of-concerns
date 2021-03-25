const pool = require('../utils/pool');

module.exports = class Order {
  id;
  quantity;

  constructor(row) {
    this.id = row.id;
    this.quantity = row.quantity;
  }

  static async insert(order) {
    const { rows } = await pool.query(
      'INSERT INTO orders (quantity) VALUES ($1) RETURNING *',
      [order.quantity]
    );

    return new Order(rows[0]);
  }

  static async selectAll() {
    const { rows } = await pool.query(
      'SELECT * FROM orders');
      return rows;
  }

  static async selectById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE id=$1',
      [id]);
    return new Order(rows[0]);
  }

  static async updateById(order) {
    const { rows } = await pool.query(
      `UPDATE orders
      SET quantity = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        order.quantity,
        order.id
      ]);
    
      return new Order(rows[0]);
  }

  static async deleteById(id) {
    console.log('YOOOOOO', id)
    const { rows } = await pool.query(
      'DELETE FROM orders WHERE id=$1 RETURNING *',
      [id]);
    
    return new Order(rows[0]);
  }
};
