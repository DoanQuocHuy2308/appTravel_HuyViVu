const db = require('../config/db');
const mahoa = require("../middleware/mahoaPass");
class Acc {
    static async login(email, password) {
        const [result] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        const user = result[0];
        if (!user) {
            return { success: false, message: "Tài khoản không tồn tại" };
        }
        const giaima = await mahoa.giaiMa(password, user.password);
        if (!giaima) {
            return { success: false, message: "Sai mật khẩu" };
        }
        return { success: true, user };
    }

    static async register(name, email, password, phone, address, image) {
        const hashedPassword = await mahoa.maHoa(password);
        const [result] = await db.execute("INSERT INTO users (name, email, password, phone, address,image) VALUES (?, ?, ?, ?, ?,?)", [name, email, hashedPassword, phone, address, image]);
        return result.insertId;
    }
    static async checkEmail(email) {
        const [result] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        return result;
    }
}
module.exports = Acc;