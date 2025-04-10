"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1744213632129 = void 0;
class CreateUserTable1744213632129 {
    constructor() {
        this.name = 'CreateUserTable1744213632129';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }
}
exports.CreateUserTable1744213632129 = CreateUserTable1744213632129;
