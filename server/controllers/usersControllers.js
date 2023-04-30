const { Users } = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = process.env.CLIENT_ID;
const JWTSECRET = process.env.JWTSECRET;

////
async function webLogin(req, res) {
  const { id_token } = req.body;
  try {
    //verify Google ID token
    const { name, email, picture } = await verifyWeb(id_token);
    console.log("verifyDone");
    //cheking user in database
    const ddbUser = await Users.find.byEmail(email);
    const dbUser = ddbUser.rows[0];
    if (dbUser) {
      const { user, token } = logUserin(dbUser);
      user.picture = picture;
      res.status(200).json({ token, user });
    } else {
      const { user, token } = await signUserup(name, email);
      res.status(200).json({ token, user });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

//creat token
const createToken = (user_id) => {
  return jwt.sign({ user_id }, JWTSECRET);
};

async function verifyWeb(id_token) {
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return payload;
}

const logUserin = (dbUser) => {
  const token = createToken(dbUser.user_id);
  const { user_password, ...other } = dbUser;
  const user = other;
  return { token, user };
};

const signUserup = async (name, email) => {
  const ccreatedUser = await Users.create({ name, email, role: 1 });
  const createdUser = ccreatedUser.rows[0];
  const token = createToken(createdUser.user_id);
  const { user_password, ...other } = createdUser;
  const user = other;
  return { token, user };
};

const editUser = async (req, res) => {
  const { user_id } = req.params;
  const { user_name, user_year, user_faculty_id } = req.body;
  try {
    await Users.update({ user_name, user_year, user_faculty_id, user_id });
    res.status(200).json({ message: "تم تعديل المستخدم بنجاح" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = { webLogin, editUser };
