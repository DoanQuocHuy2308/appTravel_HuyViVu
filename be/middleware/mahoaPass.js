const bcrypt = require('bcrypt');
const saltRounds = 10;

const maHoa = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const giaiMa = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    maHoa,
    giaiMa
};
