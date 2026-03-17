/**
 * IshFinance — app-utils.js
 * Shared utilities loaded on every page:
 *   - Currency formatting (reads user preference from localStorage)
 *   - Budget alert notifications
 *   - Savings goal milestone notifications
 *   - Monthly summary digest
 */

// ─────────────────────────────────────────────
// CURRENCY CONFIG
// ─────────────────────────────────────────────
const CURRENCY_MAP = {
    LKR: { symbol: 'Rs',   code: 'LK', locale: 'en-US' },
    USD: { symbol: '$',    code: 'US', locale: 'en-US' },
    EUR: { symbol: '€',    code: 'DE', locale: 'de-DE' },
    GBP: { symbol: '£',    code: 'GB', locale: 'en-GB' },
    INR: { symbol: '₹',   code: 'IN', locale: 'en-IN' },
    AUD: { symbol: 'A$',  code: 'AU', locale: 'en-AU' },
    CAD: { symbol: 'C$',  code: 'CA', locale: 'en-CA' },
    SGD: { symbol: 'S$',  code: 'SG', locale: 'en-SG' },
    JPY: { symbol: '¥',   code: 'JP', locale: 'ja-JP' },
};

/** Read selected currency from localStorage (default LKR) */
function getPrefs() {
    try { return JSON.parse(localStorage.getItem('ishfinance_prefs') || '{}'); }
    catch (_) { return {}; }
}

function getCurrencyCode() {
    return getPrefs().currency || 'LKR';
}

/**
 * Format a number as currency using the user's chosen currency.
 * e.g.  formatCurrency(12500) → "Rs 12,500.00"
 */
window.formatCurrency = function(amount, opts = {}) {
    const code    = getCurrencyCode();
    const cfg     = CURRENCY_MAP[code] || CURRENCY_MAP.LKR;
    const decimals = opts.noDecimals ? 0 : 2;
    const num = Number(amount);
    if (isNaN(num)) return `${cfg.symbol} 0.00`;
    const formatted = Math.abs(num).toLocaleString(cfg.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
    const sign = (opts.signed && num >= 0) ? '+' : (num < 0 ? '-' : '');
    return `${sign}${cfg.symbol} ${formatted}`;
};

/** Just the symbol string for the current currency */
window.getCurrencySymbol = function() {
    const code = getCurrencyCode();
    return (CURRENCY_MAP[code] || CURRENCY_MAP.LKR).symbol;
};

// ─────────────────────────────────────────────
// TOAST HELPER (reusable across pages)
//  (settings.html defines its own, others use this)
// ─────────────────────────────────────────────
if (!window.showAppToast) {
    window.showAppToast = function(message, type = 'info', duration = 5000) {
        const colors = {
            success:  'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
            error:    'bg-red-500/20 border-red-500/30 text-red-300',
            warning:  'bg-orange-500/20 border-orange-500/30 text-orange-300',
            info:     'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
        };
        const icons = {
            success: `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
            error:   `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
            warning: `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
            info:    `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        };

        // Wrap in a container so multiple toasts stack correctly
        let container = document.getElementById('app-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'app-toast-container';
            container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:99999;display:flex;flex-direction:column;gap:0.75rem;max-width:340px;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.style.cssText = `
            display:flex;align-items:flex-start;gap:0.75rem;
            padding:0.9rem 1.1rem;
            border-radius:0.9rem;
            border:1px solid;
            font-family:'Outfit',sans-serif;
            font-size:0.85rem;font-weight:600;
            backdrop-filter:blur(12px);
            box-shadow:0 20px 40px rgba(0,0,0,0.35);
            animation: appToastIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
        `;
        toast.className = colors[type] || colors.info;
        toast.innerHTML = `${icons[type] || icons.info}<span style="flex:1;line-height:1.4">${message}</span>
            <button onclick="this.parentElement.remove()" style="opacity:0.5;font-size:1.1rem;line-height:1;margin-left:0.25rem;flex-shrink:0;">&times;</button>`;
        container.appendChild(toast);

        if (!document.getElementById('appToastStyle')) {
            const s = document.createElement('style');
            s.id = 'appToastStyle';
            s.textContent = `
                @keyframes appToastIn{from{transform:translateX(80px);opacity:0}to{transform:translateX(0);opacity:1}}
                @keyframes appToastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(80px);opacity:0}}
            `;
            document.head.appendChild(s);
        }

        setTimeout(() => {
            toast.style.animation = 'appToastOut 0.35s ease forwards';
            setTimeout(() => toast.remove(), 350);
        }, duration);
    };
}

// ─────────────────────────────────────────────
// NOTIFICATION CHECKS
// Call this once after session is confirmed.
// ─────────────────────────────────────────────
window.runNotificationChecks = async function() {
    if (typeof supabaseClient === 'undefined') return;
    const prefs = getPrefs();

    // Guard: only run each check once per session (prevents repeat toasts on navigation)
    const sessionKey = 'ishfinance_notif_checked';
    const today      = new Date().toDateString();
    const checked    = JSON.parse(sessionStorage.getItem(sessionKey) || '{}');

    const budgetEnabled  = prefs.notifBudget  !== false; // default on
    const goalsEnabled   = prefs.notifGoals   !== false; // default on
    const summaryEnabled = prefs.notifMonthly === true;  // default off

    // ── 1. BUDGET ALERTS ──────────────────────────────────────────────
    if (budgetEnabled && checked.budget !== today) {
        try {
            const today_date = new Date();
            const y  = today_date.getFullYear();
            const m  = String(today_date.getMonth() + 1).padStart(2, '0');
            const period     = `${y}-${m}`;
            const startDate  = `${period}-01`;
            const endDt      = new Date(startDate); endDt.setMonth(endDt.getMonth() + 1);
            const endDate    = endDt.toISOString().slice(0, 10);

            const [bgRes, txRes] = await Promise.all([
                supabaseClient.from('budgets').select('*, categories(name)').eq('period', period),
                supabaseClient.from('transactions').select('category_id, amount').eq('type', 'expense').gte('date', startDate).lt('date', endDate),
            ]);

            if (bgRes.data && txRes.data) {
                // Build spending map
                const spent = {};
                txRes.data.forEach(tx => {
                    spent[tx.category_id] = (spent[tx.category_id] || 0) + Number(tx.amount);
                });

                const alerts = [];
                bgRes.data.forEach(bg => {
                    const limit = Number(bg.amount);
                    const used  = spent[bg.category_id] || 0;
                    const pct   = (used / limit) * 100;
                    const name  = bg.categories?.name || 'Category';

                    if (pct >= 100) {
                        alerts.push({ name, pct, type: 'exceeded' });
                    } else if (pct >= 80) {
                        alerts.push({ name, pct, type: 'warning' });
                    }
                });

                // Show alerts (staggered slightly)
                alerts.forEach((a, i) => {
                    setTimeout(() => {
                        if (a.type === 'exceeded') {
                            showAppToast(
                                `🚨 <strong>${a.name}</strong> budget exceeded! (${a.pct.toFixed(0)}% used)`,
                                'error', 7000
                            );
                        } else {
                            showAppToast(
                                `⚠️ <strong>${a.name}</strong> budget at ${a.pct.toFixed(0)}% — limit approaching!`,
                                'warning', 6000
                            );
                        }
                    }, i * 800);
                });

                // Mark done for today
                checked.budget = today;
                sessionStorage.setItem(sessionKey, JSON.stringify(checked));
            }
        } catch (e) { console.warn('Budget alert check failed:', e); }
    }

    // ── 2. SAVINGS GOAL MILESTONES ────────────────────────────────────
    if (goalsEnabled && checked.goals !== today) {
        try {
            const { data: goals } = await supabaseClient.from('savings_goals').select('name, target_amount, current_amount');
            const { data: { session } } = await supabaseClient.auth.getSession();
            const userId = session?.user?.id || 'anon';
            
            if (goals) {
                const MILESTONES   = [25, 50, 75, 100];
                const seenKey      = `ishfinance_goal_milestones_${userId}`;
                const seenData     = JSON.parse(localStorage.getItem(seenKey) || '{}');
                let   changed      = false;

                goals.forEach((g, idx) => {
                    const target  = Number(g.target_amount);
                    const current = Number(g.current_amount);
                    if (target <= 0) return;
                    const pct     = (current / target) * 100;
                    const key     = `${g.name}_${target}`;

                    MILESTONES.forEach(ms => {
                        const msKey = `${key}_${ms}`;
                        if (pct >= ms && !seenData[msKey]) {
                            seenData[msKey] = true;
                            changed = true;
                            const emoji = ms === 100 ? '🎉' : ms === 75 ? '🔥' : ms === 50 ? '💪' : '⭐';
                            setTimeout(() => {
                                showAppToast(
                                    `${emoji} <strong>${g.name}</strong> reached ${ms}% of its savings goal!`,
                                    ms === 100 ? 'success' : 'info', 7000
                                );
                            }, idx * 900 + 1200);
                        }
                    });
                });

                if (changed) localStorage.setItem(seenKey, JSON.stringify(seenData));
                checked.goals = today;
                sessionStorage.setItem(sessionKey, JSON.stringify(checked));
            }
        } catch (e) { console.warn('Goal milestone check failed:', e); }
    }

    // ── 3. MONTHLY SUMMARY ────────────────────────────────────────────
    if (summaryEnabled && checked.summary !== today) {
        try {
            const today_date = new Date();
            // Show summary on the 1st two days of the month or if never shown today
            const day  = today_date.getDate();
            const y    = today_date.getFullYear();
            const m    = String(today_date.getMonth() + 1).padStart(2, '0');

            // previous month
            const prevDate = new Date(y, today_date.getMonth() - 1, 1);
            const py = prevDate.getFullYear();
            const pm = String(prevDate.getMonth() + 1).padStart(2, '0');
            const prevPeriod   = `${py}-${pm}`;
            const prevStart    = `${prevPeriod}-01`;
            const prevEndDt    = new Date(prevStart); prevEndDt.setMonth(prevEndDt.getMonth() + 1);
            const prevEnd      = prevEndDt.toISOString().slice(0, 10);

            const { data: txData } = await supabaseClient.from('transactions')
                .select('amount, type')
                .gte('date', prevStart)
                .lt('date', prevEnd);

            if (txData) {
                let income = 0, expense = 0;
                txData.forEach(tx => {
                    if (tx.type === 'income')  income  += Number(tx.amount);
                    if (tx.type === 'expense') expense += Number(tx.amount);
                });
                const net        = income - expense;
                const netSign    = net >= 0 ? '+' : '-';
                const netColor   = net >= 0 ? 'success' : 'warning';
                const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                const prevMonth  = monthNames[prevDate.getMonth()];

                setTimeout(() => {
                    showAppToast(
                        `📊 <strong>${prevMonth} Summary:</strong> Income ${formatCurrency(income, {noDecimals:true})} · Expenses ${formatCurrency(expense, {noDecimals:true})} · Net ${netSign}${formatCurrency(Math.abs(net), {noDecimals:true})}`,
                        netColor, 10000
                    );
                }, 2000);

                checked.summary = today;
                sessionStorage.setItem(sessionKey, JSON.stringify(checked));
            }
        } catch (e) { console.warn('Monthly summary check failed:', e); }
    }
};
