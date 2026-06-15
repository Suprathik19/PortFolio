console.log('✅ Admin Integration Script Loading...');

let adminPanelOpen = false;
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

function getPortfolioThemeIsDark() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
}

function applyAdminTheme() {
    const isDark = getPortfolioThemeIsDark();
    document.documentElement.classList.toggle('dark', isDark);
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    const adminContainer = document.getElementById('admin-container');
    if (adminContainer) {
        adminContainer.classList.toggle('admin-theme-dark', isDark);
        adminContainer.classList.toggle('admin-theme-light', !isDark);
    }
}

// Load admin styles immediately (not waiting for login)
function loadAdminStyles() {
    if (!document.getElementById('admin-styles')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'admin-styles';
        styleLink.rel = 'stylesheet';
        styleLink.href = 'admin-styles.css';
        document.head.appendChild(styleLink);
        console.log('📄 Admin styles loaded');
    }
}

// Load styles when script loads
loadAdminStyles();
applyAdminTheme();

window.addEventListener('portfolio-theme-change', applyAdminTheme);
window.addEventListener('storage', function (event) {
    if (event.key === 'theme') {
        applyAdminTheme();
    }
});

if (window.matchMedia) {
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (themeMedia.addEventListener) {
        themeMedia.addEventListener('change', function () {
            if (!localStorage.getItem('theme')) {
                applyAdminTheme();
            }
        });
    }
}

// Multiple keyboard shortcuts to access admin
const ADMIN_SHORTCUTS = [
    { ctrl: true, shift: true, key: 'A', name: 'Ctrl+Shift+A' },
    { ctrl: true, shift: false, key: 'M', name: 'Ctrl+M' },
    { ctrl: true, shift: false, key: 'P', name: 'Ctrl+P' },
];

// Listen for admin shortcuts - MUST be before other handlers
console.log('🔌 Attaching keyboard event listener...');
document.addEventListener('keydown', function(event) {
    // Debug log
    console.log('⌨️ Key pressed:', event.key, 'Ctrl:', event.ctrlKey, 'Shift:', event.shiftKey, 'Alt:', event.altKey);
    
    // Check all registered shortcuts
    for (let shortcut of ADMIN_SHORTCUTS) {
        let keyMatch = event.key.toUpperCase() === shortcut.key.toUpperCase();
        let ctrlMatch = event.ctrlKey === shortcut.ctrl;
        let shiftMatch = event.shiftKey === shortcut.shift;
        
        if (keyMatch && ctrlMatch && shiftMatch) {
            // ALWAYS prevent browser default behavior and stop propagation
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            
            console.log(`✅ Admin shortcut triggered: ${shortcut.name}`);
            
            if (!adminPanelOpen) {
                console.log('📋 Showing admin login...');
                showAdminLogin();
            } else {
                console.log('🔐 Closing admin panel...');
                closeAdminPanel();
            }
            return; // Exit after first match
        }
    }
}, true); // Use capture phase to ensure it fires first
console.log('✅ Keyboard event listener attached successfully!');

function showAdminLogin() {
    applyAdminTheme();
    const html = `
        <div id="admin-login-overlay" class="admin-overlay">
            <div class="admin-login-modal">
                <div class="admin-modal-header">
                    <div>
                        <div class="admin-login-kicker"><span class="admin-dot"></span> Protected access</div>
                        <h2><i class="fas fa-lock admin-lock-icon"></i> Portfolio Admin</h2>
                    </div>
                    <button class="admin-close-btn" onclick="closeAdminPanel()" aria-label="Close admin panel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="admin-modal-body">
                    <p class="admin-login-copy">Unlock the polished admin workspace to edit projects, skills, certifications, education, and stats with live persistence.</p>
                    <div class="admin-form-group">
                        <label class="admin-field-label" for="admin-password-input">Password</label>
                        <input 
                            type="password" 
                            id="admin-password-input" 
                            class="admin-input" 
                            placeholder="Enter password"
                            onkeydown="if(event.key==='Enter') verifyAdminPassword(this)"
                        >
                    </div>
                    <div id="admin-error-msg" class="admin-error-msg" style="display:none;"></div>
                    <button class="admin-btn-primary" onclick="verifyAdminPassword(this)">
                        <i class="fas fa-unlock"></i> Unlock Admin Panel
                    </button>
                    <div class="admin-shortcuts">
                        <div class="admin-shortcuts-title">Available shortcuts</div>
                        <div class="admin-shortcut-row"><span>Ctrl + Shift + A</span><span>Toggle admin</span></div>
                        <div class="admin-shortcut-row"><span>Ctrl + M</span><span>Toggle admin</span></div>
                        <div class="admin-shortcut-row"><span>Ctrl + P</span><span>Toggle admin</span></div>
                    </div>
                    <div class="admin-hint"><strong>Default password:</strong> admin123</div>
                </div>
            </div>
        </div>
    `;
    
    // Create container if it doesn't exist
    let adminContainer = document.getElementById('admin-container');
    if (!adminContainer) {
        adminContainer = document.createElement('div');
        adminContainer.id = 'admin-container';
        document.body.appendChild(adminContainer);
    }
    
    adminContainer.innerHTML = html;
    adminPanelOpen = true;
    applyAdminTheme();
    
    // Focus password input
    setTimeout(() => {
        document.getElementById('admin-password-input').focus();
    }, 100);
}

function verifyAdminPassword(triggerElement) {
    const passwordInput = document.getElementById('admin-password-input');
    const errorMsg = document.getElementById('admin-error-msg');
    const password = passwordInput.value;
    
    if (password === ADMIN_PASSWORD) {
        errorMsg.style.display = 'none';
        
        // Add unlock animation to modal
        const loginModal = document.querySelector('.admin-login-modal');
        if (loginModal) {
            loginModal.parentElement.classList.add('admin-unlocking');
            
            // Add button press animation
            const button = triggerElement && triggerElement.tagName === 'BUTTON' ? triggerElement : null;
            if (button) {
                button.classList.add('admin-btn-click');
            }
            
            // Play the unlock transition before swapping in the real workspace.
            setTimeout(loadAdminPanel, 320);
        } else {
            loadAdminPanel();
        }
    } else {
        errorMsg.textContent = '❌ Invalid password. Try again.';
        errorMsg.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        
        // Shake animation on wrong password
        const loginModal = document.querySelector('.admin-login-modal');
        if (loginModal) {
            loginModal.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                loginModal.style.animation = '';
            }, 500);
        }
    }
}

function loadAdminPanel() {
    applyAdminTheme();
    if (!document.getElementById('admin-styles')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'admin-styles';
        styleLink.rel = 'stylesheet';
        styleLink.href = 'admin-styles.css';
        document.head.appendChild(styleLink);
    }

    const loginOverlay = document.getElementById('admin-login-overlay');
    if (loginOverlay) {
        loginOverlay.innerHTML = `
            <div class="admin-panel-overlay">
                <div class="admin-panel-shell">
                    <div class="admin-panel-header">
                        <div class="admin-panel-title-wrap">
                            <div class="admin-panel-title">
                                <span class="admin-dot"></span>
                                <span>Portfolio Admin</span>
                            </div>
                            <div class="admin-panel-subtitle">Full CRUD workspace loaded from admin.html</div>
                        </div>
                        <div class="admin-panel-actions">
                            <a class="admin-btn-ghost" href="admin.html" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-arrow-up-right-from-square"></i> Open standalone
                            </a>
                            <button class="admin-panel-close" onclick="closeAdminPanel()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <iframe class="admin-panel-frame" src="admin.html" title="Portfolio admin panel"></iframe>
                </div>
            </div>
        `;
        setTimeout(() => {
            const frame = loginOverlay.querySelector('.admin-panel-frame');
            if (frame) frame.classList.add('is-ready');
        }, 120);
        applyAdminTheme();
    }
}

function switchAdminTab(tabName) {
    // Update active button
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.admin-nav-btn').classList.add('active');
    
    // Render content
    let content = '';
    const data = PortfolioData.load();
    
    switch(tabName) {
        case 'overview':
            content = renderAdminOverview();
            break;
        case 'quick-edit':
            content = renderQuickEdit(data);
            break;
        case 'projects':
            content = renderAdminProjects(data);
            break;
        case 'skills':
            content = renderAdminSkills(data);
            break;
        case 'certifications':
            content = renderAdminCertifications(data);
            break;
        case 'education':
            content = renderAdminEducation(data);
            break;
        case 'stats':
            content = renderAdminStats(data);
            break;
        default:
            content = renderAdminOverview();
    }
    
    document.getElementById('admin-main-content').innerHTML = content;
}

function renderAdminOverview() {
    const data = PortfolioData.load();
    const totalSkills = data.skills.reduce((a, c) => a + c.items.length, 0);
    
    return `
        <div class="admin-page">
            <h2>Overview</h2>
            <p class="admin-subtitle">Your portfolio statistics at a glance</p>
            
            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <div class="admin-stat-value">${data.stats.cgpa}</div>
                    <div class="admin-stat-label">CGPA</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-value">${data.projects.length}</div>
                    <div class="admin-stat-label">Projects</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-value">${data.certifications.length}</div>
                    <div class="admin-stat-label">Certifications</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-value">${totalSkills}</div>
                    <div class="admin-stat-label">Skills</div>
                </div>
            </div>
            
            <div class="admin-section">
                <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
                <div class="admin-quick-actions">
                    <button class="admin-quick-btn" onclick="switchAdminTab('projects')">
                        <i class="fas fa-plus"></i> Add Project
                    </button>
                    <button class="admin-quick-btn" onclick="switchAdminTab('skills')">
                        <i class="fas fa-plus"></i> Add Skill
                    </button>
                    <button class="admin-quick-btn" onclick="switchAdminTab('certifications')">
                        <i class="fas fa-plus"></i> Add Certification
                    </button>
                    <button class="admin-quick-btn" onclick="switchAdminTab('stats')">
                        <i class="fas fa-edit"></i> Edit Stats
                    </button>
                </div>
            </div>
            
            <div class="admin-section">
                <h3><i class="fas fa-code-branch"></i> Recent Projects</h3>
                <div class="admin-item-list">
                    ${data.projects.slice(0, 3).map(p => `
                        <div class="admin-item">
                            <div class="admin-item-name">${p.name}</div>
                            <div class="admin-item-meta">${p.category} • ${p.tech.slice(0, 2).join(', ')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderQuickEdit(data) {
    return `
        <div class="admin-page">
            <h2>Quick Edit</h2>
            <p class="admin-subtitle">Update frequently changed information</p>
            
            <div class="admin-form-section">
                <label>CGPA</label>
                <input 
                    type="text" 
                    class="admin-input" 
                    value="${data.stats.cgpa}"
                    id="edit-cgpa"
                    onchange="updateStat('cgpa', this.value)"
                >
            </div>
            
            <div class="admin-form-section">
                <label>Total Projects</label>
                <input 
                    type="text" 
                    class="admin-input" 
                    value="${data.stats.projects}"
                    id="edit-projects"
                    onchange="updateStat('projects', this.value)"
                >
            </div>
            
            <div class="admin-form-section">
                <label>Coding Problems Solved</label>
                <input 
                    type="text" 
                    class="admin-input" 
                    value="${data.stats.problems}"
                    id="edit-problems"
                    onchange="updateStat('problems', this.value)"
                >
            </div>
            
            <div class="admin-form-section">
                <label>Certifications</label>
                <input 
                    type="text" 
                    class="admin-input" 
                    value="${data.stats.certifications}"
                    id="edit-certs"
                    onchange="updateStat('certifications', this.value)"
                >
            </div>
            
            <div class="admin-form-section">
                <label>Internships</label>
                <input 
                    type="text" 
                    class="admin-input" 
                    value="${data.stats.internships}"
                    id="edit-internships"
                    onchange="updateStat('internships', this.value)"
                >
            </div>
            
            <button class="admin-btn-primary" onclick="showAdminNotification('✅ Stats updated!')">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </div>
    `;
}

function renderAdminProjects(data) {
    return `
        <div class="admin-page">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
                <h2>Projects</h2>
                <button class="admin-btn-primary" onclick="showProjectForm()">
                    <i class="fas fa-plus"></i> Add Project
                </button>
            </div>
            
            <div class="admin-item-list">
                ${data.projects.map((p, idx) => `
                    <div class="admin-item-row">
                        <div>
                            <div class="admin-item-name">${p.name}</div>
                            <div class="admin-item-meta">${p.description.substring(0, 80)}...</div>
                            <div class="admin-item-tags">
                                ${p.tech.map(t => `<span class="admin-tag">${t}</span>`).join('')}
                            </div>
                        </div>
                        <button class="admin-btn-delete" onclick="deleteProject(${idx})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAdminSkills(data) {
    return `
        <div class="admin-page">
            <h2>Technical Skills</h2>
            <p class="admin-subtitle">Manage your skill categories and proficiency levels</p>
            
            ${data.skills.map((cat, catIdx) => `
                <div class="admin-section">
                    <h3>${cat.category}</h3>
                    <div class="admin-skill-list">
                        ${cat.items.map((skill, skillIdx) => `
                            <div class="admin-skill-row">
                                <div class="admin-skill-name">${skill.name}</div>
                                <div class="admin-skill-input-group">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value="${skill.pct}"
                                        class="admin-skill-slider"
                                        onchange="updateSkill(${catIdx}, ${skillIdx}, this.value)"
                                    >
                                    <span class="admin-skill-percent">${skill.pct}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderAdminCertifications(data) {
    return `
        <div class="admin-page">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
                <h2>Certifications</h2>
                <button class="admin-btn-primary" onclick="showCertForm()">
                    <i class="fas fa-plus"></i> Add Cert
                </button>
            </div>
            
            <div class="admin-item-list">
                ${data.certifications.map((cert, idx) => `
                    <div class="admin-item-row">
                        <div>
                            <div class="admin-item-name">${cert.name}</div>
                            <div class="admin-item-meta">${cert.issuer} • ${cert.date}</div>
                        </div>
                        <button class="admin-btn-delete" onclick="deleteCert(${idx})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAdminEducation(data) {
    return `
        <div class="admin-page">
            <h2>Education</h2>
            
            ${data.education.map((edu, idx) => `
                <div class="admin-section">
                    <div style="display:flex;justify-content:space-between;align-items:start">
                        <div>
                            <h3>${edu.degree}</h3>
                            <p>${edu.institution}</p>
                            <p class="admin-subtitle">${edu.years} • ${edu.grade}</p>
                        </div>
                        <button class="admin-btn-delete" onclick="deleteEducation(${idx})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderAdminStats(data) {
    return `
        <div class="admin-page">
            <h2>Achievement Stats</h2>
            <p class="admin-subtitle">Numbers displayed in the About section</p>
            
            <div class="admin-form-section">
                <label>CGPA</label>
                <input type="text" class="admin-input" value="${data.stats.cgpa}" onchange="updateStat('cgpa', this.value)">
            </div>
            
            <div class="admin-form-section">
                <label>Projects</label>
                <input type="text" class="admin-input" value="${data.stats.projects}" onchange="updateStat('projects', this.value)">
            </div>
            
            <div class="admin-form-section">
                <label>Coding Problems</label>
                <input type="text" class="admin-input" value="${data.stats.problems}" onchange="updateStat('problems', this.value)">
            </div>
            
            <div class="admin-form-section">
                <label>Certifications</label>
                <input type="text" class="admin-input" value="${data.stats.certifications}" onchange="updateStat('certifications', this.value)">
            </div>
            
            <div class="admin-form-section">
                <label>Internships</label>
                <input type="text" class="admin-input" value="${data.stats.internships}" onchange="updateStat('internships', this.value)">
            </div>
        </div>
    `;
}

function updateStat(key, value) {
    const data = PortfolioData.load();
    data.stats[key] = value;
    PortfolioData.save(data);
    showAdminNotification('✅ Stat updated!');
    // Refresh portfolio
    if (typeof initDynamicPortfolio !== 'undefined') {
        initDynamicPortfolio();
    }
}

function updateSkill(catIdx, skillIdx, value) {
    const data = PortfolioData.load();
    data.skills[catIdx].items[skillIdx].pct = parseInt(value);
    PortfolioData.save(data);
    // Refresh skills display
    if (typeof initCyberHudSkills !== 'undefined') {
        initCyberHudSkills();
    }
}

function closeAdminPanel() {
    adminPanelOpen = false;
    const adminContainer = document.getElementById('admin-container');
    if (adminContainer) {
        adminContainer.innerHTML = '';
    }
    applyAdminTheme();
}

function showAdminNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'admin-notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

function showProjectForm() {
    showAdminNotification('📝 Project form would open here');
}

function showCertForm() {
    showAdminNotification('📝 Certification form would open here');
}

function deleteProject(idx) {
    if (confirm('Delete this project?')) {
        const data = PortfolioData.load();
        data.projects.splice(idx, 1);
        PortfolioData.save(data);
        showAdminNotification('🗑️ Project deleted!');
        switchAdminTab('projects');
    }
}

function deleteCert(idx) {
    if (confirm('Delete this certification?')) {
        const data = PortfolioData.load();
        data.certifications.splice(idx, 1);
        PortfolioData.save(data);
        showAdminNotification('🗑️ Certification deleted!');
        switchAdminTab('certifications');
    }
}

function deleteEducation(idx) {
    if (confirm('Delete this education entry?')) {
        const data = PortfolioData.load();
        data.education.splice(idx, 1);
        PortfolioData.save(data);
        showAdminNotification('🗑️ Education entry deleted!');
        switchAdminTab('education');
    }
}

// ============================================================
// INITIALIZATION COMPLETE
// ============================================================
console.log('🎉 Admin Integration Script Loaded Successfully!');
console.log('Available shortcuts:');
console.log('  🔑 Ctrl+Shift+A - Open Admin Panel');
console.log('  🔑 Ctrl+M - Open Admin Panel');
console.log('  🔑 Ctrl+P - Open Admin Panel');
console.log('Default password: admin123');
