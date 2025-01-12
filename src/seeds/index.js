const mongoose = require("mongoose");
const seedMedicines = require("./medicine.seeder");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/medinfo";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");

    await seedMedicines();

    // await seedUsers();
    // await seedReviews();
    // await seedProducts();
    // await seedCategories();

    console.log("Database seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
