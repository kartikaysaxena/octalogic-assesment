import { db } from "./index";
import { vehicleTypes, vehicles } from "./schema";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Clear existing data
    await db.delete(vehicles);
    await db.delete(vehicleTypes);

    // Seed vehicle types
    const carTypes = await db.insert(vehicleTypes).values([
      { name: "Hatchback", wheels: 4 },
      { name: "SUV", wheels: 4 },
      { name: "Sedan", wheels: 4 },
    ]).returning();

    const bikeTypes = await db.insert(vehicleTypes).values([
      { name: "Cruiser", wheels: 2 },
    ]).returning();

    console.log("Vehicle types seeded:", [...carTypes, ...bikeTypes]);

    // Seed vehicles
    const vehicleData = [
      // Hatchback vehicles
      {
        name: "Honda Jazz",
        typeId: carTypes[0].id, // Hatchback
        model: "VX CVT",
        year: 2023,
        pricePerDay: 2500,
      },
      {
        name: "Maruti Swift",
        typeId: carTypes[0].id, // Hatchback
        model: "ZXI+",
        year: 2022,
        pricePerDay: 2200,
      },
      {
        name: "Hyundai i20",
        typeId: carTypes[0].id, // Hatchback
        model: "Asta",
        year: 2023,
        pricePerDay: 2800,
      },

      // SUV vehicles
      {
        name: "Hyundai Creta",
        typeId: carTypes[1].id, // SUV
        model: "SX Executive",
        year: 2023,
        pricePerDay: 4500,
      },
      {
        name: "Tata Harrier",
        typeId: carTypes[1].id, // SUV
        model: "XZ+ Dark",
        year: 2022,
        pricePerDay: 5000,
      },
      {
        name: "Mahindra XUV700",
        typeId: carTypes[1].id, // SUV
        model: "AX7",
        year: 2023,
        pricePerDay: 5500,
      },

      // Sedan vehicles
      {
        name: "Honda City",
        typeId: carTypes[2].id, // Sedan
        model: "ZX CVT",
        year: 2023,
        pricePerDay: 3200,
      },
      {
        name: "Maruti Ciaz",
        typeId: carTypes[2].id, // Sedan
        model: "Alpha",
        year: 2022,
        pricePerDay: 2800,
      },
      {
        name: "Hyundai Verna",
        typeId: carTypes[2].id, // Sedan
        model: "SX Turbo",
        year: 2023,
        pricePerDay: 3500,
      },

      // Cruiser bikes
      {
        name: "Royal Enfield Classic 350",
        typeId: bikeTypes[0].id, // Cruiser
        model: "Redditch Edition",
        year: 2023,
        pricePerDay: 1200,
      },
      {
        name: "Harley Davidson Street 750",
        typeId: bikeTypes[0].id, // Cruiser
        model: "Standard",
        year: 2022,
        pricePerDay: 3000,
      },
      {
        name: "Indian Scout Bobber",
        typeId: bikeTypes[0].id, // Cruiser
        model: "Sixty",
        year: 2023,
        pricePerDay: 3500,
      },
    ];

    const seededVehicles = await db.insert(vehicles).values(vehicleData).returning();
    
    console.log(`Successfully seeded ${seededVehicles.length} vehicles`);
    console.log("Database seeding completed!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();