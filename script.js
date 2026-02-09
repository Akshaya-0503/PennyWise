// Navigation function
function navigateTo(page) {
    const pages = {
        'dashboard': 'dashboard.html',
        'settings': 'settings.html',
        'analytics': 'analytics.html',
        'signup': '#'
    };
    
    if (pages[page]) {
        window.location.href = pages[page];
    }
}

// Generate realistic demo data
function generateDemoData() {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return {
        // Core metrics
        dailyAverage: 18,
        monthlyInvestment: 750,
        projection: (18 * 30 * 12).toLocaleString(),
        
        // User engagement
        userStats: {
            retentionRate: "94%",
            streakDays: 7,
            totalSaved: 427,
            totalInvested: 2850,
            monthlyAvg: 750
        },
        
        // Achievements
        achievements: [
            { name: "Early Investor", unlocked: true, icon: "🚀" },
            { name: "7-Day Streak", unlocked: true, icon: "🔥" },
            { name: "First ₹1,000", unlocked: true, icon: "💰" },
            { name: "Consistency King", unlocked: false, icon: "👑" },
            { name: "First ₹5,000", unlocked: false, icon: "🏆" }
        ],
        
        // Portfolio
        portfolio: {
            total: 2850,
            breakdown: [
                { name: "Gold", amount: 1140, color: "#F59E0B" },
                { name: "Nifty ETF", amount: 855, color: "#10B981" },
                { name: "Index Fund", amount: 855, color: "#3B82F6" }
            ]
        }
    };
}

// Round-up calculator
function calculateRoundUp(amount, level = 10) {
    const remainder = amount % level;
    return remainder === 0 ? 0 : level - remainder;
}

// Simulate live transactions
const mockTransactions = [
    { merchant: "Swiggy", amount: 347, category: "food" },
    { merchant: "Uber", amount: 187, category: "transport" },
    { merchant: "Amazon", amount: 1249, category: "shopping" },
    { merchant: "Starbucks", amount: 385, category: "food" },
    { merchant: "Zomato", amount: 423, category: "food" },
    { merchant: "BookMyShow", amount: 620, category: "entertainment" }
];

let totalSpareChange = 427;
let totalInvested = 2850;

function simulateTransaction() {
    const randomTrans = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
    const roundUp = calculateRoundUp(randomTrans.amount, 10);
    
    totalSpareChange += roundUp;
    
    // Update UI if on dashboard
    if (document.getElementById('spareChange')) {
        document.getElementById('spareChange').textContent = totalSpareChange;
        
        // Add to transaction feed
        const feed = document.getElementById('transactionFeed');
        if (feed) {
            const transactionEl = document.createElement('div');
            transactionEl.className = 'transaction-item';
            transactionEl.innerHTML = `
                <div>
                    <strong>${randomTrans.merchant}</strong>
                    <small>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                </div>
                <div>
                    <span>₹${randomTrans.amount}</span>
                    <span class="round-up-badge">+₹${roundUp}</span>
                </div>
            `;
            feed.prepend(transactionEl);
            
            // Keep only last 5 transactions
            if (feed.children.length > 5) {
                feed.removeChild(feed.lastChild);
            }
        }
    }
    
    // Auto-invest if threshold reached
    if (totalSpareChange >= 100) {
        autoInvest();
    }
}

// Auto-invest function
function autoInvest() {
    const investmentAmount = totalSpareChange;
    totalSpareChange = 0;
    totalInvested += investmentAmount;
    
    // Update UI
    if (document.getElementById('totalInvested')) {
        document.getElementById('totalInvested').textContent = totalInvested;
        document.getElementById('spareChange').textContent = totalSpareChange;
        
        // Show notification
        showNotification(`₹${investmentAmount} auto-invested successfully!`, 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : '#4F46E5'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize charts (simplified)
function initCharts() {
    // This is a simplified version - in real implementation, use Chart.js
    const data = generateDemoData();
    
    // Update portfolio chart if exists
    const portfolioChart = document.getElementById('portfolioChart');
    if (portfolioChart) {
        portfolioChart.innerHTML = `
            <div style="display: flex; align-items: center; gap: 2rem;">
                <div style="width: 200px; height: 200px; border-radius: 50%; 
                    background: conic-gradient(#F59E0B 40%, #10B981 40%, #10B981 70%, #3B82F6 70%);
                    display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; width: 100px; height: 100px; border-radius: 50%;"></div>
                </div>
                <div>
                    <h3>Portfolio Allocation</h3>
                    ${data.portfolio.breakdown.map(item => `
                        <div style="display: flex; align-items: center; gap: 1rem; margin: 0.5rem 0;">
                            <div style="width: 20px; height: 20px; background: ${item.color}; border-radius: 4px;"></div>
                            <span>${item.name}: ₹${item.amount} (${Math.round(item.amount/data.portfolio.total*100)}%)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Show video modal
function showVideo() {
    alert("Video demo would play here. For hackathon, you can embed a Loom video or YouTube demo.");
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initCharts();
    
    // Start transaction simulation if on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        // Update initial values
        document.getElementById('spareChange').textContent = totalSpareChange;
        document.getElementById('totalInvested').textContent = totalInvested;
        
        // Simulate transaction every 5 seconds
        setInterval(simulateTransaction, 5000);
        
        // Also simulate immediately
        setTimeout(simulateTransaction, 1000);
    }
    
    // Initialize settings page
    if (window.location.pathname.includes('settings.html')) {
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                optionButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Initialize analytics page
    if (window.location.pathname.includes('analytics.html')) {
        const data = generateDemoData();
        document.getElementById('projectionValue').textContent = data.projection;
        document.getElementById('streakDays').textContent = data.userStats.streakDays;
        
        // Populate achievements
        const achievementsContainer = document.getElementById('achievementsContainer');
        if (achievementsContainer) {
            data.achievements.forEach(ach => {
                const achievementEl = document.createElement('div');
                achievementEl.className = `achievement ${ach.unlocked ? 'unlocked' : 'locked'}`;
                achievementEl.innerHTML = `
                    <span class="achievement-icon">${ach.icon}</span>
                    <span>${ach.name}</span>
                `;
                achievementsContainer.appendChild(achievementEl);
            });
        }
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .achievement {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        margin: 0.5rem 0;
        background: #F3F4F6;
        border-radius: 10px;
    }
    
    .achievement.unlocked {
        background: #D1FAE5;
        border-left: 4px solid #10B981;
    }
    
    .achievement.locked {
        opacity: 0.6;
    }
    
    .achievement-icon {
        font-size: 1.5rem;
    }
`;
document.head.appendChild(style);