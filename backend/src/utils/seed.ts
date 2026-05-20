import User from "../models/User";
import Lead from "../models/Lead";
import bcrypt from "bcryptjs";

export const seedDatabase = async () => {
  try {
    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding default accounts...");
      
      const adminPassword = await bcrypt.hash("admin123", 10);
      const salesPassword = await bcrypt.hash("sales123", 10);

      await User.create([
        {
          name: "System Admin",
          email: "admin@leads.com",
          password: adminPassword,
          role: "admin",
        },
        {
          name: "Sales Rep",
          email: "sales@leads.com",
          password: salesPassword,
          role: "sales",
        },
      ]);
      console.log("Seeding default accounts completed! (admin@leads.com / admin123, sales@leads.com / sales123)");
    } else {
      console.log("User accounts already present. Skipping User seed.");
    }

    // 2. Seed Leads
    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
      console.log("Seeding mock leads database...");

      const statuses: ("New" | "Contacted" | "Qualified" | "Lost")[] = ["New", "Contacted", "Qualified", "Lost"];
      const sources: ("Website" | "Instagram" | "Referral")[] = ["Website", "Instagram", "Referral"];
      
      const firstNames = [
        "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
        "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
        "Amit", "Priya", "Rahul", "Anjali", "Sanjay", "Deepa", "Vikram", "Neha", "Arjun", "Kiran"
      ];
      
      const lastNames = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Sharma", "Patel", "Verma", "Gupta", "Reddy", "Nair", "Rao", "Joshi", "Singh", "Das",
        "Taylor", "Thomas", "Anderson", "White", "Harris", "Martin", "Thompson", "Jackson", "Clark", "Lewis"
      ];

      const domains = ["techcorp.com", "innovate.io", "ventures.net", "solutions.org", "alpha.co", "global.in"];

      const mockLeads = [];

      for (let i = 0; i < 60; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i + 7) % lastNames.length];
        const name = `${firstName} ${lastName}`;
        const company = `${lastName} ${["Enterprises", "Labs", "Group", "Consulting", "Solutions"][i % 5]}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[i % domains.length]}`;
        const phone = `+1 (555) ${100 + i}-${2000 + i}`;
        
        // Distribute statuses and sources
        const status = statuses[i % statuses.length];
        const source = sources[(i + 2) % sources.length];

        mockLeads.push({
          name,
          email,
          phone,
          company,
          status,
          source,
        });
      }

      await Lead.create(mockLeads);
      console.log(`Seeding completed. Registered ${mockLeads.length} mock leads.`);
    } else {
      console.log("Leads data already present. Skipping Lead seed.");
    }
  } catch (error: any) {
    console.error("Error seeding database:", error.message);
  }
};
