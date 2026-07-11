
const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

const properties = [
  {
    societyName: "OXIRICH STUDIO",
    propertyType: "Flat",
    configuration: "1 BHK",
    area: 512,
    price: 6000000,
    floorNumber: 11,
    ownerType: "Owner",
    ownerName: "MOHIT",
    ownerPhone: "9717186009",
    description: "DEMAND 6000000 NEGO 55, REMARK BY SONU, ALL TIME VISIT",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "ADITYA MEGA CITY",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1285,
    price: 12500000,
    floorNumber: 8,
    ownerType: "Owner",
    ownerName: "PRADEEP GUPTA",
    ownerPhone: "8811014054",
    description: "GC-810, ROAD FACING, WEEEKEND VISIT",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "ANGEL JUPITER",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1150,
    price: 9200000,
    floorNumber: 13,
    ownerType: "Owner",
    ownerName: "Akanksha srivastava",
    ownerPhone: "9410744410",
    description: "D 1305, OWNER, BY PIYUSH [LE OUT KE LIYE DURSA DIKHNA HOGA, she live in delhi, flat is closed, NO VISIT",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "AMARPALI ROYAL",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1475,
    price: 13000000,
    floorNumber: 13,
    ownerType: "Owner",
    ownerName: "PAVAN CHAUDHARY",
    ownerPhone: "9871344022",
    description: "D 1306, TENENT, WEEKENDS VISIT",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "ANGEL MERCURY",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1195,
    price: 9500000,
    floorNumber: 18,
    ownerType: "Owner",
    ownerPhone: "8826296666",
    description: "D 1307, OWNER, KEY 9911989831, visit available, video hai",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "CLOUD 9",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 887,
    price: 9000000,
    floorNumber: 23,
    ownerType: "Owner",
    ownerName: "Amit Verma and",
    ownerPhone: "9999047713",
    description: "E-2304, 5 BJE K BAD VISIT ANY TIME",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "AMRAPALI GREEN",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1350,
    price: 11000000,
    floorNumber: 13,
    ownerType: "Owner",
    ownerName: "S K DAS",
    ownerPhone: "8527558619",
    description: "B-1304, OWNER",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "CLOUD 9",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1080,
    price: 9500000,
    floorNumber: 7,
    ownerType: "Owner",
    ownerName: "ankita singh",
    ownerPhone: "9999193133",
    description: "E-703, VIDEO BHI HAI, video h, GROUP P VIDEO H",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "AMRAPALI VILLAGE",
    propertyType: "Flat",
    configuration: "2 BHK+duplx",
    area: 1350,
    price: 12500000,
    floorNumber: 0,
    ownerPhone: "98185025122",
    description: "AM-10, TENET no, 9810370804",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "AMRAPALI VILLAGE",
    propertyType: "Flat",
    configuration: "2 BHK+duplx",
    area: 1350,
    price: 17500000,
    floorNumber: 13,
    ownerType: "Owner",
    ownerName: "SANJIV/anshul",
    ownerPhone: "9958741119",
    description: "AM-P-8, SELL AVILABEL HAI D-1.40CR, WHATS AAP",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "AMRAPALI VILLAGE",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1350,
    price: 10600000,
    floorNumber: 10,
    ownerType: "Owner",
    ownerName: "SHIVAM GOEL",
    ownerPhone: "9530670362",
    description: "FM-1004, VACATE mohit",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "AMRAPALI VILLAGE",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1425,
    price: 17500000,
    floorNumber: 13,
    ownerType: "Owner",
    ownerName: "Sonu Malhotra",
    ownerPhone: "8700621984",
    description: "AM-P-8, sunny gnm",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "AMRAPALI VILLAGE",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1425,
    price: 10600000,
    floorNumber: 10,
    ownerType: "Owner",
    ownerName: "Munish Kr Nagpal",
    ownerPhone: "7838000600",
    description: "FM-1004, sunny gnm",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "DIVYANSH PARTHAM",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1250,
    price: 13000000,
    floorNumber: 8,
    ownerType: "Owner",
    ownerName: "Yogesh mohta and pooja mohta",
    ownerPhone: "9917211100",
    description: "1807, NEGO 1.25",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "GAUR GREEN VISTA",
    propertyType: "Flat",
    configuration: "2+STUDY",
    area: 1231,
    price: 11000000,
    floorNumber: 12,
    ownerType: "Owner",
    ownerName: "Vijay kumar",
    ownerPhone: "9914002670",
    description: "A-1218A, all time visi Call 2 hour before visit, na",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "ANGEL JUPITER",
    propertyType: "Flat",
    configuration: "2+STUDY",
    area: 1285,
    price: 12500000,
    floorNumber: 18,
    ownerType: "Owner",
    ownerName: "Sanjeev aggarwal",
    ownerPhone: "9999009518",
    description: "D-1804, TENENT covered paking, WEEKEND FOR VIDEO 6 JUNE",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "ANGEL JUPITER",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1150,
    price: 10000000,
    floorNumber: 2,
    ownerType: "Owner",
    ownerName: "mohit sharma",
    ownerPhone: "9810716904",
    description: "B 205, OWNER, CLIENT BUDGET 1CR HO TABHI LANA CB, vc m, KL HO JAYEGA",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "ANGEL JUPITER",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1150,
    price: 11000000,
    floorNumber: 10,
    furnishingStatus: "Fully Furnished",
    ownerPhone: "7720072701",
    description: "C-1002, fully fur, any time visit",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "ANGEL JUPITER",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1150,
    price: 10500000,
    floorNumber: 15,
    ownerType: "Owner",
    ownerName: "prerna anaand",
    ownerPhone: "9891376041",
    description: "D-1506, whats app msg",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "ANGEL MERCURY",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1190,
    price: 10500000,
    floorNumber: 15,
    ownerType: "Owner",
    ownerName: "SHUBH JAIN",
    ownerPhone: "9356055157",
    description: "B- 1505, VACANT - CALL BEFORE GOING KEY IN A-2002 (8130309444) - CNF FOR 26/09/2025, WHATS AAP, weekend visit DEALER",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "CLOUD 9",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1080,
    price: 10500000,
    floorNumber: 13,
    ownerType: "Owner",
    ownerName: "Mohit",
    ownerPhone: "9958117027",
    description: "G-1304, TENENT, WHATS AAP",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "CLOUD 9",
    propertyType: "Flat",
    configuration: "2 BHK",
    area: 1080,
    price: 11000000,
    floorNumber: 24,
    ownerType: "Owner",
    ownerName: "TARUN DOGRA",
    ownerPhone: "9899351705",
    description: "G 24, want in trian",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "CLOUD 9",
    propertyType: "Flat",
    configuration: "2+STUDY",
    area: 1200,
    price: 11000000,
    floorNumber: 23,
    ownerType: "Owner",
    ownerName: "RAJENDER CHAWLA",
    ownerPhone: "9810167652",
    description: "E-2302, OWNER, call back",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "SVP GULMOHAR",
    propertyType: "Flat",
    configuration: "2+STUDY",
    area: 1255,
    price: 12000000,
    floorNumber: 4,
    ownerType: "Owner",
    ownerName: "Ankit Goel",
    ownerPhone: "9643222749",
    description: "403 okra, By Piyush VISIT ANY TIME",
    availabilityStatus: "Available",
    purpose: "Sale"
  },
  {
    societyName: "SVP GULMOHAR OKRA",
    propertyType: "Flat",
    configuration: "2+STUDY",
    area: 1255,
    price: 11000000,
    floorNumber: 8,
    ownerType: "Owner",
    ownerName: "TAMAL GHHOSH",
    ownerPhone: "9818080264",
    description: "801 okra, JHARKHAMD, 3 facing main road, ring",
    availabilityStatus: "Available",
    purpose: "Sale"
  }
];

async function importProperties() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    console.log(`\nImporting ${properties.length} properties...`);
    
    // Add default approval status and added by info
    const propertiesToInsert = properties.map(prop => ({
      ...prop,
      approvalStatus: "Approved",
      addedBy: {
        employeeId: new mongoose.Types.ObjectId(),
        employeeName: "Admin"
      },
      addedByModel: "Admin",
      addedDate: new Date()
    }));

    const result = await Property.insertMany(propertiesToInsert);
    console.log(`\nSuccessfully imported ${result.length} properties!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error importing properties:', error);
    process.exit(1);
  }
}

importProperties();
