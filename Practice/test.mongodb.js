// 1. Switch database
use("practiceDB");

// 2. Collection create karein
db.createCollection("students");

// 3. insertOne
db.students.insertOne({ rollNo: 101, name: "Rahul", marks: 85, stream: "CS" });

// 4. insertMany
db.students.insertMany([
  { rollNo: 102, name: "Sneha", marks: 92, stream: "AI" },
  { rollNo: 103, name: "Arjun", marks: 74, stream: "CS" },
  { rollNo: 104, name: "Rohit", marks: 85, stream: "IT" },
]);

// 5. updateOne
db.students.updateOne({ rollNo: 101 }, { $set: { marks: 95 } });

// 6. updateMany
db.students.updateMany({ stream: "CS" }, { $set: { verified: true } });

// 7. deleteOne
db.students.deleteOne({ rollNo: 103 });

// 8. deleteMany
// db.students.deleteMany({ stream: 'IT' });

// 9. find() aur findOne() test karein (Last query ka result right panel me display hota hai)
db.students.find({});
