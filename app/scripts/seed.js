"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var dotenv_1 = require("dotenv");
var connectdb_1 = require("../lib/connectdb");
var User_1 = require("../models/User");
var LeaveApplication_1 = require("../models/LeaveApplication");
// Load environment variables
dotenv_1.default.config();
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, hr, employee;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, connectdb_1.default)()];
                case 1:
                    _b.sent();
                    console.log('🚀 Connected to MongoDB');
                    // Optional: clear previous data
                    return [4 /*yield*/, User_1.default.deleteMany({})];
                case 2:
                    // Optional: clear previous data
                    _b.sent();
                    return [4 /*yield*/, LeaveApplication_1.default.deleteMany({})];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, User_1.default.insertMany([
                            {
                                fullName: 'Jane Smith',
                                email: 'jane.smith@company.com',
                                phone: '+1234567891',
                                employeeId: 'HR001',
                                address: '456 Oak Ave, City, State',
                                department: 'Human Resources',
                                position: 'HR Manager',
                                role: 'hr',
                                joinDate: new Date('2022-03-10'),
                                password: 'password123', // You can hash later
                                status: 'Active'
                            },
                            {
                                fullName: 'John Doe',
                                email: 'john.doe@company.com',
                                phone: '+1234567890',
                                employeeId: 'EMP001',
                                address: '123 Main St, City, State',
                                department: 'Engineering',
                                position: 'Software Engineer',
                                role: 'employee',
                                joinDate: new Date('2023-05-15'),
                                password: 'password123',
                                status: 'Active'
                            }
                        ])];
                case 4:
                    _a = _b.sent(), hr = _a[0], employee = _a[1];
                    // Seed Leave Applications
                    // await LeaveApplication.insertMany([
                    //   {
                    //     employee: employee._id, // ✅ Correct field
                    //     leaveType: 'Sick',
                    //     fromDate: new Date('2025-07-21'),
                    //     toDate: new Date('2025-07-22'),
                    //     reason: 'Fever',
                    //     status: 'Pending',
                    //     appliedOn: new Date()
                    //   },
                    //   {
                    //     employee: employee._id,
                    //     leaveType: 'Casual',
                    //     fromDate: new Date('2025-07-25'),
                    //     toDate: new Date('2025-07-26'),
                    //     reason: 'Personal Work',
                    //     status: 'Approved',
                    //     reviewedBy: hr._id,
                    //     reviewedOn: new Date()
                    //   }
                    // ]);
                    console.log('🌱 Seed data inserted successfully!');
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (err) {
    console.error('❌ Error during seeding:', err);
});
