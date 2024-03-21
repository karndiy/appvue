const mysql = require('mysql2/promise');
class Database {
    constructor(config) {
        this.pool = mysql.createPool(config);
    }

    async execute(query, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [results] = await connection.query(query, params);
            return results;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async create_oop(variables, query) {
        return await this.execute(query, variables);
    }

    async get_oop(query, variables = []) {
        return await this.execute(query, variables);
    }

    async update_oop(variables, query) {
        return await this.execute(query, variables);
    }

    async delete_oop(query, variables = []) {
        return await this.execute(query, variables);
    }
}
module.exports = Database;