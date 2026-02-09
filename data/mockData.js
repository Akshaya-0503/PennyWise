// data/mockData.js - Separate file
const MockData = {
  generateDemoData() {
    return {
      dailyAverage: 18,
      monthlyInvestment: 750,
      projection: (18 * 30 * 12).toLocaleString(),
      achievements: [
        { name: "Early Investor", unlocked: true },
        { name: "Consistency King", unlocked: false },
        { name: "First ₹5,000", unlocked: false }
      ]
    };
  },
  
  generateTransactions() {
    return [
      { id: 1, merchant: "Swiggy", amount: 347, roundUp: 3, timestamp: "2024-01-20 13:45" },
      { id: 2, merchant: "Uber", amount: 187, roundUp: 3, timestamp: "2024-01-20 10:30" },
      { id: 3, merchant: "Amazon", amount: 1249, roundUp: 1, timestamp: "2024-01-19 16:20" }
    ];
  },
  
  generatePortfolio() {
    return {
      gold: { amount: 1140, percentage: 40 },
      etf: { amount: 855, percentage: 30 },
      index: { amount: 855, percentage: 30 }
    };
  }
};

// In script.js, include it:
// <script src="data/mockData.js"></script>
// Then use: MockData.generateDemoData()