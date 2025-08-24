// Application State
class AppState {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.agents = [];
        this.uploadedFiles = [];
        this.distributions = [];
        this.csvData = [];
        this.isLoggedIn = false;
        
        this.init();
    }
    
    init() {
        // Initialize with mock data
        this.agents = [
            {
                id: 1,
                name: "John Smith",
                email: "john@company.com",
                mobile: "+1-555-0101",
                password: "password123",
                createdAt: "2025-08-24T10:00:00Z"
            },
            {
                id: 2,
                name: "Sarah Johnson",
                email: "sarah@company.com",
                mobile: "+1-555-0102",
                password: "password123",
                createdAt: "2025-08-24T11:00:00Z"
            },
            {
                id: 3,
                name: "Mike Davis",
                email: "mike@company.com",
                mobile: "+1-555-0103",
                password: "password123",
                createdAt: "2025-08-24T12:00:00Z"
            },
            {
                id: 4,
                name: "Lisa Wilson",
                email: "lisa@company.com",
                mobile: "+1-555-0104",
                password: "password123",
                createdAt: "2025-08-24T13:00:00Z"
            },
            {
                id: 5,
                name: "David Brown",
                email: "david@company.com",
                mobile: "+1-555-0105",
                password: "password123",
                createdAt: "2025-08-24T14:00:00Z"
            }
        ];
        
        this.updateStats();
    }
    
    updateStats() {
        // Use setTimeout to ensure elements exist
        setTimeout(() => {
            const totalAgentsEl = document.getElementById('total-agents');
            const totalFilesEl = document.getElementById('total-files');
            const totalItemsEl = document.getElementById('total-items');
            const distributionsCountEl = document.getElementById('distributions-count');
            
            if (totalAgentsEl) totalAgentsEl.textContent = this.agents.length;
            if (totalFilesEl) totalFilesEl.textContent = this.uploadedFiles.length;
            if (totalItemsEl) totalItemsEl.textContent = this.csvData.length;
            if (distributionsCountEl) distributionsCountEl.textContent = this.distributions.length;
        }, 100);
    }
}

// Global app state
const appState = new AppState();

// Utility Functions
const showToast = (title, message, type = 'info') => {
    try {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="${iconMap[type]}"></i>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4000);
    } catch (error) {
        console.error('Error showing toast:', error);
    }
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^\+[\d-]+$/;
    return re.test(phone) && phone.length >= 10;
};

const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

const clearErrors = () => {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
};

const showError = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
};

// Authentication Functions
const handleLogin = (e) => {
    console.log('handleLogin called');
    e.preventDefault();
    e.stopPropagation();
    
    try {
        clearErrors();
        
        const emailEl = document.getElementById('email');
        const passwordEl = document.getElementById('password');
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const spinner = loginBtn.querySelector('.loading-spinner');
        
        if (!emailEl || !passwordEl || !loginBtn) {
            console.error('Required elements not found');
            return;
        }
        
        const email = emailEl.value.trim();
        const password = passwordEl.value.trim();
        
        console.log('Login attempt:', { email: email, passwordLength: password.length });
        
        // Validate inputs
        let hasErrors = false;
        
        if (!validateRequired(email)) {
            showError('email-error', 'Email is required');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            showError('email-error', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        if (!validateRequired(password)) {
            showError('password-error', 'Password is required');
            hasErrors = true;
        }
        
        if (hasErrors) {
            console.log('Validation errors found');
            return;
        }
        
        // Show loading state
        if (btnText) btnText.style.display = 'none';
        if (spinner) spinner.style.display = 'flex';
        loginBtn.disabled = true;
        
        console.log('Showing loading state');
        
        // Simulate authentication delay
        setTimeout(() => {
            console.log('Processing authentication');
            
            // Check credentials
            if (email === 'admin@test.com' && password === 'admin123') {
                console.log('Authentication successful');
                
                appState.currentUser = { email, role: 'admin' };
                appState.isLoggedIn = true;
                
                // Hide login page and show app
                const loginPage = document.getElementById('login-page');
                const appContainer = document.getElementById('app-container');
                
                if (loginPage) loginPage.classList.add('hidden');
                if (appContainer) appContainer.classList.remove('hidden');
                
                showToast('Login Successful', 'Welcome to the admin dashboard!', 'success');
                showPage('dashboard');
                
                // Add activity
                setTimeout(() => {
                    addActivity('Admin user logged in');
                }, 500);
                
            } else {
                console.log('Authentication failed');
                showError('login-error', 'Invalid email or password. Use admin@test.com / admin123');
            }
            
            // Reset button state
            if (btnText) btnText.style.display = 'inline';
            if (spinner) spinner.style.display = 'none';
            loginBtn.disabled = false;
            
        }, 1500);
        
    } catch (error) {
        console.error('Error in handleLogin:', error);
        showError('login-error', 'An error occurred during login. Please try again.');
    }
};

const handleLogout = () => {
    console.log('Logging out');
    
    try {
        appState.currentUser = null;
        appState.isLoggedIn = false;
        
        // Clear form data
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        clearErrors();
        
        // Show login page and hide app
        const loginPage = document.getElementById('login-page');
        const appContainer = document.getElementById('app-container');
        
        if (loginPage) loginPage.classList.remove('hidden');
        if (appContainer) appContainer.classList.add('hidden');
        
        showToast('Logged Out', 'You have been successfully logged out', 'info');
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

// Navigation Functions
const showPage = (pageId) => {
    console.log('Showing page:', pageId);
    
    try {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show selected page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-page="${pageId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            agents: 'Agent Management', 
            upload: 'File Upload',
            distribution: 'Distribution Results'
        };
        
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = titles[pageId] || pageId;
        }
        
        appState.currentPage = pageId;
        
        // Load page-specific content
        switch(pageId) {
            case 'agents':
                renderAgents();
                break;
            case 'distribution':
                renderDistributions();
                break;
        }
    } catch (error) {
        console.error('Error showing page:', error);
    }
};

// Agent Management Functions
const renderAgents = () => {
    const agentsGrid = document.getElementById('agents-grid');
    if (!agentsGrid) return;
    
    try {
        if (appState.agents.length === 0) {
            agentsGrid.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                    <i class="fas fa-users" style="font-size: 3rem; color: var(--color-text-secondary); margin-bottom: 1rem;"></i>
                    <h3>No Agents Yet</h3>
                    <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">Start by adding your first agent to the system.</p>
                    <button class="btn btn-glow btn-primary" onclick="showAddAgentModal()">
                        <i class="fas fa-plus"></i>
                        Add First Agent
                    </button>
                </div>
            `;
            return;
        }
        
        agentsGrid.innerHTML = appState.agents.map(agent => `
            <div class="agent-card card-glow">
                <div class="agent-header">
                    <div class="agent-avatar">
                        ${agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="agent-info">
                        <h4>${agent.name}</h4>
                        <p>${agent.email}</p>
                    </div>
                </div>
                <div class="agent-details">
                    <div class="agent-detail">
                        <i class="fas fa-phone"></i>
                        <span>${agent.mobile}</span>
                    </div>
                    <div class="agent-detail">
                        <i class="fas fa-calendar"></i>
                        <span>Created ${new Date(agent.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="agent-detail">
                        <i class="fas fa-circle" style="color: var(--color-success);"></i>
                        <span>Active</span>
                    </div>
                </div>
                <div class="agent-actions">
                    <button class="btn btn-glow btn-outline btn-sm" onclick="editAgent(${agent.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-glow btn-outline btn-sm" onclick="deleteAgent(${agent.id})" style="color: var(--color-error); border-color: var(--color-error);">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering agents:', error);
    }
};

const showAddAgentModal = () => {
    try {
        const modalTitle = document.getElementById('agent-modal-title');
        const agentForm = document.getElementById('agent-form');
        const agentModal = document.getElementById('agent-modal');
        
        if (modalTitle) modalTitle.textContent = 'Add New Agent';
        if (agentForm) {
            agentForm.reset();
            delete agentForm.dataset.agentId;
        }
        
        clearErrors();
        
        if (agentModal) agentModal.classList.remove('hidden');
    } catch (error) {
        console.error('Error showing add agent modal:', error);
    }
};

const editAgent = (agentId) => {
    try {
        const agent = appState.agents.find(a => a.id === agentId);
        if (!agent) return;
        
        const modalTitle = document.getElementById('agent-modal-title');
        const agentForm = document.getElementById('agent-form');
        
        if (modalTitle) modalTitle.textContent = 'Edit Agent';
        
        const nameInput = document.getElementById('agent-name');
        const emailInput = document.getElementById('agent-email');
        const mobileInput = document.getElementById('agent-mobile');
        const passwordInput = document.getElementById('agent-password');
        
        if (nameInput) nameInput.value = agent.name;
        if (emailInput) emailInput.value = agent.email;
        if (mobileInput) mobileInput.value = agent.mobile;
        if (passwordInput) passwordInput.value = agent.password;
        
        // Store the agent ID for updating
        if (agentForm) agentForm.dataset.agentId = agentId;
        
        clearErrors();
        
        const agentModal = document.getElementById('agent-modal');
        if (agentModal) agentModal.classList.remove('hidden');
    } catch (error) {
        console.error('Error editing agent:', error);
    }
};

const deleteAgent = (agentId) => {
    try {
        const agent = appState.agents.find(a => a.id === agentId);
        if (!agent) return;
        
        const confirmTitle = document.getElementById('confirm-title');
        const confirmMessage = document.getElementById('confirm-message');
        const confirmOk = document.getElementById('confirm-ok');
        
        if (confirmTitle) confirmTitle.textContent = 'Delete Agent';
        if (confirmMessage) confirmMessage.textContent = `Are you sure you want to delete ${agent.name}? This action cannot be undone.`;
        
        if (confirmOk) {
            confirmOk.onclick = () => {
                appState.agents = appState.agents.filter(a => a.id !== agentId);
                appState.updateStats();
                renderAgents();
                hideModal('confirm-modal');
                showToast('Agent Deleted', `${agent.name} has been removed from the system`, 'success');
                addActivity(`Deleted agent: ${agent.name}`);
            };
        }
        
        const confirmModal = document.getElementById('confirm-modal');
        if (confirmModal) confirmModal.classList.remove('hidden');
    } catch (error) {
        console.error('Error deleting agent:', error);
    }
};

const handleSaveAgent = (e) => {
    e.preventDefault();
    console.log('Saving agent');
    
    try {
        clearErrors();
        
        const nameInput = document.getElementById('agent-name');
        const emailInput = document.getElementById('agent-email');
        const mobileInput = document.getElementById('agent-mobile');
        const passwordInput = document.getElementById('agent-password');
        const agentForm = document.getElementById('agent-form');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const mobile = mobileInput ? mobileInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';
        
        // Validation
        let hasErrors = false;
        
        if (!validateRequired(name) || name.length < 2) {
            showError('agent-name-error', 'Name must be at least 2 characters');
            hasErrors = true;
        }
        
        if (!validateRequired(email)) {
            showError('agent-email-error', 'Email is required');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            showError('agent-email-error', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        if (!validateRequired(mobile)) {
            showError('agent-mobile-error', 'Mobile number is required');
            hasErrors = true;
        } else if (!validatePhone(mobile)) {
            showError('agent-mobile-error', 'Please enter a valid phone number with country code (e.g., +1-555-0123)');
            hasErrors = true;
        }
        
        if (!validateRequired(password) || password.length < 6) {
            showError('agent-password-error', 'Password must be at least 6 characters');
            hasErrors = true;
        }
        
        // Check for duplicate email (except when editing the same agent)
        const agentId = agentForm ? agentForm.dataset.agentId : null;
        const existingAgent = appState.agents.find(a => a.email === email && a.id != agentId);
        if (existingAgent) {
            showError('agent-email-error', 'An agent with this email already exists');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        // Save agent
        if (agentId) {
            // Update existing agent
            const agentIndex = appState.agents.findIndex(a => a.id == agentId);
            if (agentIndex !== -1) {
                appState.agents[agentIndex] = {
                    ...appState.agents[agentIndex],
                    name,
                    email,
                    mobile,
                    password
                };
                showToast('Agent Updated', `${name} has been updated successfully`, 'success');
                addActivity(`Updated agent: ${name}`);
            }
        } else {
            // Add new agent
            const newAgent = {
                id: Math.max(...appState.agents.map(a => a.id), 0) + 1,
                name,
                email,
                mobile,
                password,
                createdAt: new Date().toISOString()
            };
            appState.agents.push(newAgent);
            showToast('Agent Added', `${name} has been added successfully`, 'success');
            addActivity(`Added new agent: ${name}`);
        }
        
        appState.updateStats();
        renderAgents();
        hideModal('agent-modal');
        
        // Clear the dataset
        if (agentForm) delete agentForm.dataset.agentId;
    } catch (error) {
        console.error('Error saving agent:', error);
    }
};

// File Upload Functions
const handleFileUpload = () => {
    try {
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('file-upload-area');
        const browseBtn = document.getElementById('browse-btn');
        
        if (!fileInput || !uploadArea || !browseBtn) return;
        
        // Handle browse button click
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Handle file input change
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileSelection(file);
            }
        });
        
        // Handle drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        });
    } catch (error) {
        console.error('Error setting up file upload:', error);
    }
};

const handleFileSelection = (file) => {
    try {
        const allowedTypes = ['.csv', '.xlsx', '.xls'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            showToast('Invalid File Type', 'Please upload a CSV, XLSX, or XLS file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showToast('File Too Large', 'Please upload a file smaller than 5MB', 'error');
            return;
        }
        
        // Show file info
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const fileInfo = document.getElementById('file-info');
        
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
        if (fileInfo) fileInfo.classList.remove('hidden');
        
        // Store file reference
        appState.currentFile = file;
        
        showToast('File Selected', `${file.name} is ready for processing`, 'success');
    } catch (error) {
        console.error('Error handling file selection:', error);
    }
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const processFile = () => {
    try {
        if (!appState.currentFile) {
            showToast('No File Selected', 'Please select a file first', 'error');
            return;
        }
        
        const progressContainer = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressContainer) progressContainer.classList.remove('hidden');
        if (progressFill) progressFill.style.width = '0%';
        if (progressText) progressText.textContent = 'Processing file...';
        
        // Simulate file processing with progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            if (progressFill) progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                if (progressText) progressText.textContent = 'Processing complete!';
                
                setTimeout(() => {
                    // Simulate CSV parsing by using sample data
                    const sampleData = [
                        {"firstName": "Alice Johnson", "phone": "1234567890", "notes": "Interested in premium package"},
                        {"firstName": "Bob Wilson", "phone": "2345678901", "notes": "Follow up in 2 weeks"}, 
                        {"firstName": "Carol Davis", "phone": "3456789012", "notes": "Prefers email communication"},
                        {"firstName": "Daniel Miller", "phone": "4567890123", "notes": "High priority lead"},
                        {"firstName": "Emma Garcia", "phone": "5678901234", "notes": "Budget conscious customer"},
                        {"firstName": "Frank Martinez", "phone": "6789012345", "notes": "Needs technical consultation"},
                        {"firstName": "Grace Lee", "phone": "7890123456", "notes": "Existing customer referral"},
                        {"firstName": "Henry Taylor", "phone": "8901234567", "notes": "Interested in bulk purchase"},
                        {"firstName": "Ivy Rodriguez", "phone": "9012345678", "notes": "Schedule demo call"},
                        {"firstName": "Jack Anderson", "phone": "1122334455", "notes": "Price comparison needed"},
                        {"firstName": "Kate Thompson", "phone": "2233445566", "notes": "Quick decision maker"},
                        {"firstName": "Leo White", "phone": "3344556677", "notes": "Needs manager approval"},
                        {"firstName": "Mia Harris", "phone": "4455667788", "notes": "Long-term partnership potential"},
                        {"firstName": "Noah Clark", "phone": "5566778899", "notes": "Technical requirements discussion"},
                        {"firstName": "Olivia Lewis", "phone": "6677889900", "notes": "Follow up next quarter"},
                        {"firstName": "Peter Young", "phone": "7788990011", "notes": "Interested in enterprise plan"},
                        {"firstName": "Quinn Hall", "phone": "8899001122", "notes": "Budget approval pending"},
                        {"firstName": "Ruby Allen", "phone": "9900112233", "notes": "Competitor comparison"},
                        {"firstName": "Sam Scott", "phone": "1011121314", "notes": "Urgent requirement"},
                        {"firstName": "Tina Green", "phone": "1112131415", "notes": "Seasonal purchase"},
                        {"firstName": "Uma Adams", "phone": "1213141516", "notes": "Group discount inquiry"},
                        {"firstName": "Victor Baker", "phone": "1314151617", "notes": "Custom solution needed"},
                        {"firstName": "Wendy Nelson", "phone": "1415161718", "notes": "Partnership discussion"},
                        {"firstName": "Xander Carter", "phone": "1516171819", "notes": "Volume pricing question"},
                        {"firstName": "Yara Mitchell", "phone": "1617181920", "notes": "Implementation timeline"},
                        {"firstName": "Zoe Perez", "phone": "1718192021", "notes": "Contract negotiation"},
                        {"firstName": "Aaron Roberts", "phone": "1819202122", "notes": "Feature demonstration"}
                    ];
                    
                    appState.csvData = sampleData;
                    appState.uploadedFiles.push({
                        id: Date.now(),
                        name: appState.currentFile.name,
                        size: appState.currentFile.size,
                        type: appState.currentFile.type,
                        uploadedAt: new Date().toISOString(),
                        records: sampleData.length
                    });
                    
                    // Distribute data among agents
                    distributeData();
                    
                    appState.updateStats();
                    showToast('File Processed', `Successfully processed ${sampleData.length} records`, 'success');
                    addActivity(`Processed CSV file with ${sampleData.length} records`);
                    
                    // Clear file selection
                    clearFileSelection();
                    
                    // Auto-navigate to distribution page
                    setTimeout(() => {
                        showPage('distribution');
                    }, 1000);
                    
                }, 1000);
            }
        }, 100);
    } catch (error) {
        console.error('Error processing file:', error);
    }
};

const distributeData = () => {
    try {
        if (appState.csvData.length === 0 || appState.agents.length === 0) {
            showToast('Distribution Failed', 'No data to distribute or no agents available', 'error');
            return;
        }
        
        const agentCount = Math.min(5, appState.agents.length); // Use up to 5 agents
        const itemsPerAgent = Math.floor(appState.csvData.length / agentCount);
        const remainder = appState.csvData.length % agentCount;
        
        const distributions = [];
        let currentIndex = 0;
        
        for(let i = 0; i < agentCount; i++) {
            const extraItem = i < remainder ? 1 : 0;
            const itemsToTake = itemsPerAgent + extraItem;
            
            distributions.push({
                id: Date.now() + i,
                agent: appState.agents[i],
                items: appState.csvData.slice(currentIndex, currentIndex + itemsToTake),
                count: itemsToTake,
                distributedAt: new Date().toISOString()
            });
            
            currentIndex += itemsToTake;
        }
        
        appState.distributions = distributions;
        appState.updateStats();
        
        showToast('Distribution Complete', `Successfully distributed ${appState.csvData.length} items among ${agentCount} agents`, 'success');
        addActivity(`Distributed ${appState.csvData.length} items among ${agentCount} agents`);
    } catch (error) {
        console.error('Error distributing data:', error);
    }
};

const clearFileSelection = () => {
    try {
        const fileInput = document.getElementById('file-input');
        const fileInfo = document.getElementById('file-info');
        const uploadProgress = document.getElementById('upload-progress');
        
        if (fileInput) fileInput.value = '';
        if (fileInfo) fileInfo.classList.add('hidden');
        if (uploadProgress) uploadProgress.classList.add('hidden');
        
        appState.currentFile = null;
    } catch (error) {
        console.error('Error clearing file selection:', error);
    }
};

// Distribution Functions
const renderDistributions = () => {
    try {
        const distributionGrid = document.getElementById('distribution-grid');
        const distributionSummary = document.getElementById('distribution-summary');
        
        if (!distributionGrid || !distributionSummary) return;
        
        if (appState.distributions.length === 0) {
            distributionSummary.textContent = 'No distributions yet. Upload a CSV file to get started.';
            distributionGrid.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                    <i class="fas fa-share-alt" style="font-size: 3rem; color: var(--color-text-secondary); margin-bottom: 1rem;"></i>
                    <h3>No Distributions Yet</h3>
                    <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">Upload a CSV file to automatically distribute items among your agents.</p>
                    <button class="btn btn-glow btn-primary" onclick="showPage('upload')">
                        <i class="fas fa-upload"></i>
                        Upload CSV File
                    </button>
                </div>
            `;
            return;
        }
        
        const totalItems = appState.distributions.reduce((sum, dist) => sum + dist.count, 0);
        distributionSummary.textContent = `Distributed ${totalItems} items among ${appState.distributions.length} agents`;
        
        distributionGrid.innerHTML = appState.distributions.map(distribution => `
            <div class="distribution-card card-glow">
                <div class="distribution-header-card">
                    <h4>${distribution.agent.name}</h4>
                    <span class="item-count">${distribution.count} items</span>
                </div>
                <div class="agent-detail" style="margin-bottom: 1rem;">
                    <i class="fas fa-envelope"></i>
                    <span>${distribution.agent.email}</span>
                </div>
                <div class="agent-detail" style="margin-bottom: 1rem;">
                    <i class="fas fa-phone"></i>
                    <span>${distribution.agent.mobile}</span>
                </div>
                <div class="distribution-items">
                    ${distribution.items.slice(0, 3).map(item => `
                        <div class="distribution-item">
                            <h5>${item.firstName}</h5>
                            <p><i class="fas fa-phone"></i> ${item.phone}</p>
                            <p style="font-size: 0.8rem; opacity: 0.8;">${item.notes}</p>
                        </div>
                    `).join('')}
                    ${distribution.items.length > 3 ? `
                        <div class="distribution-item" style="text-align: center; opacity: 0.7;">
                            <p>+ ${distribution.items.length - 3} more items</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering distributions:', error);
    }
};

// Modal Functions
const hideModal = (modalId) => {
    try {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    } catch (error) {
        console.error('Error hiding modal:', error);
    }
};

// Search Function
const handleAgentSearch = (e) => {
    try {
        const searchTerm = e.target.value.toLowerCase();
        const agentCards = document.querySelectorAll('.agent-card');
        
        agentCards.forEach(card => {
            const nameEl = card.querySelector('h4');
            const emailEl = card.querySelector('p');
            
            if (nameEl && emailEl) {
                const name = nameEl.textContent.toLowerCase();
                const email = emailEl.textContent.toLowerCase();
                
                if (name.includes(searchTerm) || email.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    } catch (error) {
        console.error('Error handling agent search:', error);
    }
};

// Activity Updates
const addActivity = (message) => {
    try {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <i class="fas fa-circle" style="color: var(--color-success); font-size: 0.5rem;"></i>
            <span>${message}</span>
            <small>Just now</small>
        `;
        
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Keep only the last 5 activities
        const items = activityList.querySelectorAll('.activity-item');
        if (items.length > 5) {
            items[items.length - 1].remove();
        }
    } catch (error) {
        console.error('Error adding activity:', error);
    }
};

// Global function assignments for onclick handlers
window.showAddAgentModal = showAddAgentModal;
window.editAgent = editAgent;
window.deleteAgent = deleteAgent;
window.showPage = showPage;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing MERN Admin Dashboard');
    
    try {
        // Login form handler with multiple event methods
        const loginForm = document.getElementById('login-form');
        const loginBtn = document.getElementById('login-btn');
        
        if (loginForm) {
            console.log('Login form found, attaching event listeners');
            
            // Primary form submit handler
            loginForm.addEventListener('submit', handleLogin);
            
            // Backup button click handler
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    console.log('Login button clicked');
                    if (e.target.type !== 'submit') {
                        e.preventDefault();
                        handleLogin(e);
                    }
                });
            }
            
            // Enter key handler for inputs
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            [emailInput, passwordInput].forEach(input => {
                if (input) {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleLogin(e);
                        }
                    });
                }
            });
            
            console.log('Login event listeners attached successfully');
        } else {
            console.error('Login form not found!');
        }
        
        // Logout button handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
            console.log('Logout button event listener attached');
        }
        
        // Navigation handlers
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                if (page) showPage(page);
            });
        });
        console.log('Navigation event listeners attached');
        
        // Agent management handlers
        const addAgentBtn = document.getElementById('add-agent-btn');
        if (addAgentBtn) {
            addAgentBtn.addEventListener('click', showAddAgentModal);
        }
        
        const agentForm = document.getElementById('agent-form');
        if (agentForm) {
            agentForm.addEventListener('submit', handleSaveAgent);
        }
        
        const cancelAgentBtn = document.getElementById('cancel-agent');
        if (cancelAgentBtn) {
            cancelAgentBtn.addEventListener('click', () => hideModal('agent-modal'));
        }
        
        const closeAgentModalBtn = document.getElementById('close-agent-modal');
        if (closeAgentModalBtn) {
            closeAgentModalBtn.addEventListener('click', () => hideModal('agent-modal'));
        }
        
        // Search handler
        const agentSearch = document.getElementById('agent-search');
        if (agentSearch) {
            agentSearch.addEventListener('input', handleAgentSearch);
        }
        
        // File upload handlers
        handleFileUpload();
        
        const processFileBtn = document.getElementById('process-file-btn');
        if (processFileBtn) {
            processFileBtn.addEventListener('click', processFile);
        }
        
        const clearFileBtn = document.getElementById('clear-file-btn');
        if (clearFileBtn) {
            clearFileBtn.addEventListener('click', clearFileSelection);
        }
        
        // Confirm modal handlers
        const confirmCancel = document.getElementById('confirm-cancel');
        if (confirmCancel) {
            confirmCancel.addEventListener('click', () => hideModal('confirm-modal'));
        }
        
        const closeConfirmModal = document.getElementById('close-confirm-modal');
        if (closeConfirmModal) {
            closeConfirmModal.addEventListener('click', () => hideModal('confirm-modal'));
        }
        
        // Quick action handlers
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (target) {
                const action = target.dataset.action;
                if (action === 'add-agent') {
                    showPage('agents');
                    setTimeout(showAddAgentModal, 300);
                } else if (action === 'upload-file') {
                    showPage('upload');
                }
            }
        });
        
        // Modal backdrop click handlers
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                    modal.classList.add('hidden');
                }
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modal
                document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                    modal.classList.add('hidden');
                });
            }
        });
        
        // Add initial activity
        setTimeout(() => {
            addActivity('System initialized with 5 agents');
        }, 1000);
        
        console.log('MERN Stack Admin Dashboard initialized successfully!');
        
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});