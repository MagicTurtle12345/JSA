
const USER_STORAGE_KEY = 'registeredUsers';

/**
 * Lấy danh sách người dùng đã đăng ký từ Local Storage.
 * @returns {Array} Danh sách người dùng.
 */
function getRegisteredUsers() {
    const usersJson = localStorage.getItem(USER_STORAGE_KEY);
    // Trả về mảng rỗng nếu chưa có dữ liệu
    return usersJson ? JSON.parse(usersJson) : []; 
}

/**
 * Lưu danh sách người dùng vào Local Storage.
 * @param {Array} users - Danh sách người dùng.
 */
function saveRegisteredUsers(users) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Tìm kiếm người dùng bằng email.
 * @param {string} email - Email của người dùng.
 * @returns {Object|undefined} Thông tin người dùng hoặc undefined nếu không tìm thấy.
 */
function findUserByEmail(email) {
    const users = getRegisteredUsers();
    return users.find(user => user.email === email);
}

/**
 * @param {Object} userData - Dữ liệu người dùng: name, email, password, phone.
 * @returns {Promise<Object>} Trả về thông tin người dùng nếu thành công.
 */
function registerUser(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Mô phỏng độ trễ mạng
            const existingUser = findUserByEmail(userData.email);
            
            if (existingUser) {
                // Lỗi: Email đã tồn tại
                reject({ success: false, message: "Email đã được sử dụng. Vui lòng thử email khác." });
                return;
            }

            const users = getRegisteredUsers();
            
            // Lưu trữ người dùng mới
            const newUser = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                // LƯU Ý: Mật khẩu lưu dưới dạng văn bản thường CHỈ DÙNG CHO MỤC ĐÍCH DEMO/LOCAL STORAGE
                password: userData.password, 
                phone: userData.phone || '',
                joinDate: new Date().toISOString().split('T')[0],
                avatar: 'assets/images/default-avatar.png' 
            };

            users.push(newUser);
            saveRegisteredUsers(users);

            // Trả về thông tin cần thiết cho phiên đăng nhập
            resolve({ 
                success: true, 
                message: "Đăng ký thành công! Chuyển hướng...", 
                user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, joinDate: newUser.joinDate, avatar: newUser.avatar } 
            });

        }, 500); 
    });
}

/**
 * @param {string} email - Email người dùng.
 * @param {string} password - Mật khẩu.
 * @returns {Promise<Object>} Trả về thông tin người dùng nếu thành công.
 */
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Mô phỏng độ trễ mạng
            const user = findUserByEmail(email);

            if (!user) {
                // Lỗi: Email không tồn tại
                reject({ success: false, message: "Email không tồn tại." });
                return;
            }

            // Kiểm tra mật khẩu (so sánh văn bản thường)
            if (user.password !== password) {
                // Lỗi: Sai mật khẩu
                reject({ success: false, message: "Mật khẩu không đúng. Vui lòng kiểm tra lại." });
                return;
            }

            // Đăng nhập thành công
            resolve({ 
                success: true, 
                message: "Đăng nhập thành công! Chuyển hướng...", 
                user: { id: user.id, name: user.name, email: user.email, phone: user.phone, joinDate: user.joinDate, avatar: user.avatar } 
            });

        }, 500); 
    });
}

// Đưa các hàm chính ra ngoài phạm vi toàn cục để validation.js có thể sử dụng
window.AuthData = {
    register: registerUser,
    login: loginUser,
    getUsers: getRegisteredUsers 
};