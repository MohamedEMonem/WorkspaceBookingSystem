const mongoose = require("mongoose");
const dashboardSchema = mongoose.Schema({
    totalUsers: {
        type: Number,
        default: 0,
    },
    totalWorkspaces: {
        type: Number,
        default: 0,
    },
    totalBookings: {
        type: Number,
        default: 0,
    },
    totalSolutions: {
        type: Number,
        default: 0,
    },
    totalRevenue: {
        type: Number,
        default: 0,
    },
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);
module.exports = { Dashboard };