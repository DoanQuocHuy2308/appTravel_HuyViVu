const db = require('../config/db');
const mahoa = require("../middleware/mahoaPass");
class Acc {
    static async login(email, password) {
        const [result] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        const user = result[0];
        const giaima = await mahoa.giaiMa(password, user.password);
        return giaima ? user : null;
    }
    static async regrister(name, email, password, phone, address) {
        const hashedPassword = await mahoa.maHoa(password);
        const [result] = await db.execute("INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)", [name, email, hashedPassword, phone, address]);
        return result.insertId;
    }
}
module.exports = Acc;