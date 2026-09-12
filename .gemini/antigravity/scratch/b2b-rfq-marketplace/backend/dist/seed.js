"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding with Indian B2B company names & users...');
    // Clean existing data
    await prisma.quotation.deleteMany();
    await prisma.rFQ.deleteMany();
    await prisma.user.deleteMany();
    const defaultPassword = await bcryptjs_1.default.hash('password123', 10);
    // Create Users with authentic Indian Names & Companies
    const buyer1 = await prisma.user.create({
        data: {
            email: 'rajesh@sharma-enterprises.in',
            password: defaultPassword,
            name: 'Rajesh Sharma',
            companyName: 'Sharma Enterprise Solutions Pvt Ltd',
            role: 'BUYER',
        },
    });
    const buyer2 = await prisma.user.create({
        data: {
            email: 'ananya@patel-industrial.in',
            password: defaultPassword,
            name: 'Ananya Patel',
            companyName: 'Patel Industrial Energy Solutions',
            role: 'BUYER',
        },
    });
    const supplier1 = await prisma.user.create({
        data: {
            email: 'vikram@malhotra-electronics.in',
            password: defaultPassword,
            name: 'Vikram Malhotra',
            companyName: 'Malhotra Electronics & Manufacturing',
            role: 'SUPPLIER',
        },
    });
    const supplier2 = await prisma.user.create({
        data: {
            email: 'priya@sundaram-components.in',
            password: defaultPassword,
            name: 'Priya Sundaram',
            companyName: 'Sundaram Precision Components Pvt Ltd',
            role: 'SUPPLIER',
        },
    });
    console.log(`✅ Created Indian B2B users:
  - Buyer 1: rajesh@sharma-enterprises.in / password123
  - Buyer 2: ananya@patel-industrial.in / password123
  - Supplier 1: vikram@malhotra-electronics.in / password123
  - Supplier 2: priya@sundaram-components.in / password123`);
    // Create RFQs with Indian Cities
    const rfq1 = await prisma.rFQ.create({
        data: {
            title: 'Industrial Microcontrollers (STM32F4 series)',
            description: 'Looking for 5,000 units of STM32F407VGT6 ARM Cortex-M4 microcontrollers. Must include manufacturer certificate of compliance, reel packaging, and anti-static ESD shield bag.',
            quantity: 5000,
            unit: 'units',
            deliveryLocation: 'Bengaluru, Karnataka',
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 days
            status: 'OPEN',
            buyerId: buyer1.id,
        },
    });
    const rfq2 = await prisma.rFQ.create({
        data: {
            title: 'Custom Aluminum CNC Anodized Enclosures',
            description: 'Require precision CNC machined aluminum 6061 enclosures, black anodized finish, IP67 sealed rating for outdoor IoT sensors.',
            quantity: 1200,
            unit: 'pieces',
            deliveryLocation: 'Pune, Maharashtra',
            deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // +25 days
            status: 'OPEN',
            buyerId: buyer1.id,
        },
    });
    const rfq3 = await prisma.rFQ.create({
        data: {
            title: 'Lithium Polymer Battery Packs 3.7V 2500mAh',
            description: 'High-density LiPo rechargeable battery packs with integrated PCM protection circuit and JST-XHP connector.',
            quantity: 10000,
            unit: 'packs',
            deliveryLocation: 'Ahmedabad, Gujarat',
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
            status: 'OPEN',
            buyerId: buyer1.id,
        },
    });
    console.log(`✅ Created sample RFQs with Indian locations (Bengaluru, Pune, Ahmedabad)`);
    // Create Sample Quotations
    await prisma.quotation.create({
        data: {
            rfqId: rfq1.id,
            supplierId: supplier1.id,
            price: 24500, // $4.90/unit
            deliveryDays: 10,
            notes: 'In stock in our Bengaluru warehouse. Can ship within 48 hours of purchase order. Includes 1-year warranty.',
            status: 'PENDING',
        },
    });
    await prisma.quotation.create({
        data: {
            rfqId: rfq1.id,
            supplierId: supplier2.id,
            price: 22000, // $4.40/unit
            deliveryDays: 18,
            notes: 'Direct factory dispatch from Chennai. Freight costs included in total quotation price.',
            status: 'PENDING',
        },
    });
    await prisma.quotation.create({
        data: {
            rfqId: rfq2.id,
            supplierId: supplier1.id,
            price: 18600, // $15.50/pc
            deliveryDays: 21,
            notes: 'Includes tooling setup fee and anodizing batch test reports from Pune facility.',
            status: 'ACCEPTED',
        },
    });
    console.log(`✅ Created sample quotations`);
    console.log('🎉 Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
