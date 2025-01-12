const faker = require("faker");
const Medicine = require("../models/medicine.model");

const seedMedicines = async (count = 20) => {
  try {
    const medicines = Array.from({ length: count }).map(() => ({
      slug: faker.lorem.slug(),
      name: faker.commerce.productName(),
      strength: `${faker.datatype.number({ min: 100, max: 1000 })} mg`,
      generic: faker.lorem.word(),
      dosageForm: faker.random.arrayElement(["Tablet", "Capsule", "Syrup"]),
      company: faker.lorem.word(4),
      price: parseFloat(faker.commerce.price()),
      discountPercentage: faker.datatype.number({ min: 0, max: 50 }),
      unit: faker.random.arrayElement(["box", "bottle", "strip"]),
      image: faker.image.imageUrl(),
      description: faker.lorem.sentences(2),
      indication: faker.lorem.sentence(),
      sideEffects: faker.lorem.sentences(2),
      precautions: faker.lorem.sentence(),
      contraindications: faker.lorem.sentence(),
      pharmachology: faker.lorem.sentence(),
      storage: faker.lorem.sentence(),
      dosage: faker.lorem.sentence(),
      pregnancy: faker.lorem.sentence(),
      disclaimer: faker.lorem.sentence(),
    }));

    await Medicine.insertMany(medicines);
    console.log(`${count} medicines seeded successfully.`);
  } catch (error) {
    console.error("Error seeding medicines:", error);
  }
};

module.exports = seedMedicines;
