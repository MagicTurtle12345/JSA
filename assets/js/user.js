// assets/js/user.js

const SESSION_USER_KEY = 'user'; // Khóa lưu thông tin user đang đăng nhập (từ validation.js)
const REGISTERED_USERS_KEY = 'registeredUsers'; // Khóa lưu danh sách tất cả user (từ data.js)

// --- Utility Functions ---

const $ = (selector) => document.querySelector(selector);

/**
 * Lấy user đang đăng nhập từ localStorage.
 * @returns {Object|null} Thông tin người dùng hoặc null.
 */
function getSessionUser() {
    const userJson = localStorage.getItem(SESSION_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Lưu user đang đăng nhập vào localStorage.
 * @param {Object} user - Thông tin người dùng.
 */
function saveSessionUser(user) {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
}

/**
 * Cập nhật thông tin người dùng trong danh sách người dùng đã đăng ký (RegisteredUsers).
 * Điều này mô phỏng việc lưu vào cơ sở dữ liệu.
 * @param {Object} updatedUser - Thông tin người dùng đã cập nhật.
 */
function updateRegisteredUser(updatedUser) {
    const usersJson = localStorage.getItem(REGISTERED_USERS_KEY);
    let users = usersJson ? JSON.parse(usersJson) : [];

    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        // Chỉ cập nhật các trường được phép
        users[index].name = updatedUser.name;
        users[index].phone = updatedUser.phone;
        users[index].avatar = updatedUser.avatar;
        // ... nếu bạn muốn cập nhật mật khẩu, sẽ cần xử lý tại hàm đổi mật khẩu
        
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
        return true;
    }
    return false;
}

/**
 * Hiển thị thông báo (tương tự như alert của form đăng nhập/đăng ký)
 */
function showAlert(elementId, message, isSuccess = false) {
    const alertDiv = $(elementId);
    alertDiv.textContent = message;
    alertDiv.className = isSuccess ? 'alert-message success' : 'alert-message error';
    alertDiv.style.display = 'block';
    setTimeout(() => {
        alertDiv.style.display = 'none';
        alertDiv.textContent = '';
    }, 4000);
}

// --- Core Logic ---

class ProfileManager {
    constructor() {
        this.currentUser = getSessionUser();
        this.checkAuth();
        this.loadUserData();
        this.setupEventListeners();
        this.setupTabSwitching();
    }

    /**
     * Kiểm tra trạng thái đăng nhập và chuyển hướng nếu cần.
     */
    checkAuth() {
        if (!this.currentUser) {
            alert('Vui lòng đăng nhập để xem trang hồ sơ.');
            // Giả định trang đăng nhập là login.html
            window.location.href = 'login.html'; 
        }
    }

    /**
     * Tải dữ liệu người dùng và điền vào trang.
     */
    loadUserData() {
        if (!this.currentUser) return;

        const user = this.currentUser;
        
        // 1. Sidebar Display
        $('#profile-name').textContent = user.name || 'Người Dùng';
        $('#profile-email').textContent = user.email || 'user@email.com';
        $('#user-avatar').src = user.avatar || 'assets/images/default-avatar.png';

        // 2. Info Tab Display
        $('#display-name').textContent = user.name || 'N/A';
        $('#display-email').textContent = user.email || 'N/A';
        $('#display-phone').textContent = user.phone || 'Chưa cập nhật';
        
        const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString('vi-VN') : 'N/A';
        $('#display-join-date').textContent = joinDate;

        // 3. Edit Info Form (Pre-fill)
        $('#updateName').value = user.name || '';
        $('#updatePhone').value = user.phone || '';
    }

    /**
     * Thiết lập logic chuyển đổi giữa các tab.
     */
    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                // Xóa active class khỏi tất cả các nút và pane
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // Thêm active class vào nút và pane được chọn
                button.classList.add('active');
                $(`#${targetTab}`).classList.add('active');
            });
        });
    }

    /**
     * Xử lý sự kiện form cập nhật thông tin.
     */
    handleUpdateInfo(event) {
        event.preventDefault();
        
        const newName = $('#updateName').value.trim();
        const newPhone = $('#updatePhone').value.trim();
        
        if (!newName) {
            showAlert('#update-info-alert', 'Tên không được để trống.', false);
            return;
        }

        // Cập nhật session user
        this.currentUser.name = newName;
        this.currentUser.phone = newPhone;
        
        // Mô phỏng API call: Cập nhật vào danh sách user
        updateRegisteredUser(this.currentUser);
        
        // Cập nhật session localStorage
        saveSessionUser(this.currentUser);

        // Tải lại dữ liệu hiển thị
        this.loadUserData();
        
        showAlert('#update-info-alert', 'Thông tin đã được cập nhật thành công!', true);
    }
    
    /**
     * Xử lý sự kiện form đổi mật khẩu (Mocked).
     */
    handleChangePassword(event) {
        event.preventDefault();

        const currentPassword = $('#currentPassword').value;
        const newPassword = $('#newPassword').value;
        const confirmNewPassword = $('#confirmNewPassword').value;

        // 1. Kiểm tra mật khẩu hiện tại (Mock)
        // Trong ứng dụng thực, mật khẩu hiện tại phải được gửi lên server để xác minh
        if (currentPassword !== this.currentUser.password) {
            showAlert('#change-password-alert', 'Mật khẩu hiện tại không đúng.', false);
            return;
        }

        // 2. Kiểm tra mật khẩu mới và xác nhận
        if (newPassword !== confirmNewPassword) {
            showAlert('#change-password-alert', 'Mật khẩu mới và xác nhận không khớp.', false);
            return;
        }
        
        // 3. Kiểm tra độ mạnh mật khẩu (Nên dùng logic từ validation.js)
        if (newPassword.length < 8) {
            showAlert('#change-password-alert', 'Mật khẩu phải có ít nhất 8 ký tự.', false);
            return;
        }
        
        // Mô phỏng cập nhật mật khẩu
        // Cập nhật session user
        this.currentUser.password = newPassword; 
        saveSessionUser(this.currentUser); 
        
        // Trong môi trường thực: Cập nhật cả trong RegisteredUsers (nếu bạn có hàm update password riêng)

        // Xóa form và thông báo thành công
        $('#changePasswordForm').reset();
        showAlert('#change-password-alert', 'Mật khẩu đã được đổi thành công!', true);
    }

    /**
     * Xử lý sự kiện đăng xuất.
     */
    handleLogout() {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem(SESSION_USER_KEY); // Xóa session user
            // Chuyển hướng về trang chủ hoặc đăng nhập
            window.location.href = 'index.html'; 
        }
    }

    /**
     * Thiết lập tất cả các Event Listener.
     */
    setupEventListeners() {
        // Nút Đăng xuất
        $('#logout-sidebar-btn')?.addEventListener('click', () => this.handleLogout());

        // Form Cập nhật thông tin
        $('#updateInfoForm')?.addEventListener('submit', (e) => this.handleUpdateInfo(e));

        // Form Đổi mật khẩu
        $('#changePasswordForm')?.addEventListener('submit', (e) => this.handleChangePassword(e));

        // Xử lý upload avatar (Mocked)
        $('#avatar-upload')?.addEventListener('change', (e) => this.handleAvatarUpload(e));
    }
    
    /**
     * Xử lý tải ảnh đại diện (Mocked)
     */
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newAvatarUrl = e.target.result;
                
                // Cập nhật hiển thị
                $('#user-avatar').src = newAvatarUrl;
                
                // Cập nhật user data (Mocked: lưu base64/URL)
                this.currentUser.avatar = newAvatarUrl;
                saveSessionUser(this.currentUser);
                updateRegisteredUser(this.currentUser); // Cập nhật danh sách
                
                showAlert('#update-info-alert', 'Ảnh đại diện đã được cập nhật!', true);
                
                // Quay lại tab Thông tin chung
                $('.tab-button[data-tab="info"]').click();
            };
            reader.readAsDataURL(file); // Đọc file thành Base64 URL
        }
    }
}

// Khởi tạo Profile Manager khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});