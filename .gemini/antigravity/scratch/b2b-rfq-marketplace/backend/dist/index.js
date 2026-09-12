"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const rfqRoutes_1 = __importDefault(require("./routes/rfqRoutes"));
const quotationRoutes_1 = __importDefault(require("./routes/quotationRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins for dev/easy testing
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), message: 'B2B RFQ Marketplace API is running' });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/rfqs', rfqRoutes_1.default);
app.use('/api/quotations', quotationRoutes_1.default);
// Error Handler
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
});
exports.default = app;
