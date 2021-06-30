const User = require("./models/userModel");

const seedDB = async () => {
  /* Populating the database with A default Admin information */
  try {
    //Check if there is already an admin
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      const newAdmin = await User.create({
        name: `Test Admin`,
        email: "testadmin@yahoo.com",
        password: "1234567",
        passwordConfirm: "1234567",
        role: "admin",
      });

      console.log("Admin created successfully.");
    } else {
      console.log("Admin already created.");
    }
  } catch (err) {
    console.log("Admin creation failed.");
  }
};

module.exports = seedDB;
