
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// Validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+84|0)[3-9]\d{8}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
}

// Error messages
const errorMessages = {
  required: "Trường này là bắt buộc",
  email: "Email không hợp lệ",
  phone: "Số điện thoại không hợp lệ (VD: 0901234567)",
  password: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
  passwordMismatch: "Mật khẩu xác nhận không khớp",
  name: "Họ tên phải từ 2-50 ký tự và chỉ chứa chữ cái",
  terms: "Bạn phải đồng ý với điều khoản sử dụng",
}

// Validation functions
const validators = {
  required: (value) => value.trim() !== "",
  email: (value) => patterns.email.test(value),
  phone: (value) => !value || patterns.phone.test(value),
  password: (value) => patterns.password.test(value),
  name: (value) => patterns.name.test(value),
  passwordMatch: (password, confirmPassword) => password === confirmPassword,
}

// Show/hide error message
function showError(fieldId, message) {
  const field = $(fieldId)
  const errorElement = $(fieldId + "Error")

  if (field && errorElement) {
    field.classList.add("error")
    errorElement.textContent = message
    errorElement.classList.add("show")
  }
}

function hideError(fieldId) {
  const field = $(fieldId)
  const errorElement = $(fieldId + "Error")

  if (field && errorElement) {
    field.classList.remove("error")
    errorElement.classList.remove("show")
  }
}

// Password strength checker
function checkPasswordStrength(password) {
  const strengthContainer = $("#passwordStrength")
  if (!strengthContainer) return

  const criteria = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[@$!%*?&]/.test(password),
  ]

  const strength = criteria.filter(Boolean).length

  // Clear previous bars
  strengthContainer.innerHTML = ""

  // Create strength bars
  for (let i = 0; i < 4; i++) {
    const bar = document.createElement("div")
    bar.className = "strength-bar"

    if (i < strength - 1) {
      if (strength <= 2) bar.classList.add("weak")
      else if (strength <= 3) bar.classList.add("medium")
      else bar.classList.add("strong")
    }

    strengthContainer.appendChild(bar)
  }
}

// Real-time validation
function setupRealTimeValidation() {
  // Email validation
  const emailFields = ["#loginEmail", "#registerEmail"]
  emailFields.forEach((fieldId) => {
    const field = $(fieldId)
    if (field) {
      field.addEventListener("blur", () => {
        const value = field.value.trim()
        if (value && !validators.email(value)) {
          showError(fieldId, errorMessages.email)
        } else {
          hideError(fieldId)
        }
      })
    }
  })

  // Name validation
  const nameField = $("#registerName")
  if (nameField) {
    nameField.addEventListener("blur", () => {
      const value = nameField.value.trim()
      if (value && !validators.name(value)) {
        showError("#registerName", errorMessages.name)
      } else {
        hideError("#registerName")
      }
    })
  }

  // Phone validation
  const phoneField = $("#registerPhone")
  if (phoneField) {
    phoneField.addEventListener("blur", () => {
      const value = phoneField.value.trim()
      if (value && !validators.phone(value)) {
        showError("#registerPhone", errorMessages.phone)
      } else {
        hideError("#registerPhone")
      }
    })
  }

  // Password validation and strength
  const passwordField = $("#registerPassword")
  if (passwordField) {
    passwordField.addEventListener("input", () => {
      checkPasswordStrength(passwordField.value)
    })

    passwordField.addEventListener("blur", () => {
      const value = passwordField.value
      if (value && !validators.password(value)) {
        showError("#registerPassword", errorMessages.password)
      } else {
        hideError("#registerPassword")
      }
    })
  }

  // Confirm password validation
  const confirmPasswordField = $("#confirmPassword")
  if (confirmPasswordField && passwordField) {
    confirmPasswordField.addEventListener("blur", () => {
      const password = passwordField.value
      const confirmPassword = confirmPasswordField.value

      if (confirmPassword && !validators.passwordMatch(password, confirmPassword)) {
        showError("#confirmPassword", errorMessages.passwordMismatch)
      } else {
        hideError("#confirmPassword")
      }
    })
  }
}

// Form validation
function validateForm(formId) {
  let isValid = true
  
  // Đảm bảo ẩn tất cả lỗi trước khi validate lại
  $$(`${formId} .error-message.show`).forEach(el => el.classList.remove('show'))
  $$(`${formId} input.error`).forEach(el => el.classList.remove('error'))

  if (formId === "#loginForm") {
    // Login form validation
    const email = $("#loginEmail").value.trim()
    const password = $("#loginPassword").value

    if (!validators.required(email)) {
      showError("#loginEmail", errorMessages.required)
      isValid = false
    } else if (!validators.email(email)) {
      showError("#loginEmail", errorMessages.email)
      isValid = false
    } 

    if (!validators.required(password)) {
      showError("#loginPassword", errorMessages.required)
      isValid = false
    } 
  } else if (formId === "#registerForm") {
    // Register form validation
    const name = $("#registerName").value.trim()
    const email = $("#registerEmail").value.trim()
    const password = $("#registerPassword").value
    const confirmPassword = $("#confirmPassword").value
    const phone = $("#registerPhone").value.trim()
    const agreeTerms = $("#agreeTerms") ? $("#agreeTerms").checked : true; // Giả định có agreeTerms

    // Name validation
    if (!validators.required(name)) {
      showError("#registerName", errorMessages.required)
      isValid = false
    } else if (!validators.name(name)) {
      showError("#registerName", errorMessages.name)
      isValid = false
    }

    // Email validation
    if (!validators.required(email)) {
      showError("#registerEmail", errorMessages.required)
      isValid = false
    } else if (!validators.email(email)) {
      showError("#registerEmail", errorMessages.email)
      isValid = false
    }

    // Password validation
    if (!validators.required(password)) {
      showError("#registerPassword", errorMessages.required)
      isValid = false
    } else if (!validators.password(password)) {
      showError("#registerPassword", errorMessages.password)
      isValid = false
    }

    // Confirm password validation
    if (!validators.required(confirmPassword)) {
      showError("#confirmPassword", errorMessages.required)
      isValid = false
    } else if (!validators.passwordMatch(password, confirmPassword)) {
      showError("#confirmPassword", errorMessages.passwordMismatch)
      isValid = false
    }

    // Phone validation (optional)
    if (phone && !validators.phone(phone)) {
      showError("#registerPhone", errorMessages.phone)
      isValid = false
    }

    // Terms validation
    if (!agreeTerms) {
      alert(errorMessages.terms)
      isValid = false
    }
  }

  return isValid
}

// Show success message
function showSuccess(message, callback) {
  // Create success message element if it doesn't exist
  let successElement = $(".success-message")
  if (!successElement) {
    successElement = document.createElement("div")
    successElement.className = "success-message"
    const form = $(".auth-form")
    if (form) { // Thêm kiểm tra null
        form.insertBefore(successElement, form.firstChild)
    } else {
        document.body.appendChild(successElement); // Fallback
    }
  }

  successElement.textContent = message
  successElement.classList.add("show")

  // Hide after 1.5 seconds, then execute callback
  setTimeout(() => {
    successElement.classList.remove("show")
    if (callback) {
      callback()
    }
  }, 1500) 
}

// Hàm để reset nút bấm
function resetButtonState(submitButton, isLogin) {
    submitButton.classList.remove("loading")
    submitButton.disabled = false
    submitButton.textContent = isLogin ? "Đăng nhập" : "Đăng ký"
}


// Handle form submission
function handleFormSubmit(formId, isLogin = false) {
  const form = $(formId)
  const submitButton = form.querySelector('button[type="submit"]')

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Bỏ reset trang nếu validate lỗi
    if (!validateForm(formId)) {
      return
    }
    
    // Yêu cầu data.js phải được tải trước
    if (!window.AuthData || (!window.AuthData.login && isLogin) || (!window.AuthData.register && !isLogin)) {
        alert("Lỗi hệ thống: Không tìm thấy thư viện data.js. Vui lòng kiểm tra lại thứ tự tải script.");
        return;
    }


    // Show loading state
    submitButton.classList.add("loading")
    submitButton.disabled = true
    submitButton.textContent = isLogin ? "Đang đăng nhập..." : "Đang đăng ký..."

    // Collect form data
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    try {
      let result;
      
      if (isLogin) {
          // GỌI HÀM LOGIN TỪ DATA.JS
          result = await window.AuthData.login(data.email, data.password);
      } else {
          // GỌI HÀM REGISTER TỪ DATA.JS
          result = await window.AuthData.register(data);
      }
      
      // Store user data
      localStorage.setItem("user", JSON.stringify(result.user))

      // 1. Show success message (1.5s)
      // 2. Sau đó, CHUYỂN HƯỚNG
      showSuccess(result.message, () => {
        // Reset nút bấm TRƯỚC KHI chuyển hướng 
        resetButtonState(submitButton, isLogin);
        
        // Chuyển hướng đến about.html
        window.location.href = 'about.html'
      })

    } catch (error) {
      // Xử lý lỗi từ data.js (email đã tồn tại, sai mật khẩu,...)
      alert(error.message)
      
      // Reset nút bấm VÀ trạng thái loading ngay lập tức khi có lỗi
      resetButtonState(submitButton, isLogin);
    }
  })
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupRealTimeValidation()

  // Setup form handlers
  const loginForm = $("#loginForm")
  const registerForm = $("#registerForm")

  if (loginForm) {
    handleFormSubmit("#loginForm", true)
  }

  if (registerForm) {
    handleFormSubmit("#registerForm", false)
  }

  // Add some interactive effects
  const inputs = $$("input")
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused")
    })

    input.addEventListener("blur", () => {
      input.parentElement.classList.remove("focused")
    })
  })
})

// Export for potential use in other scripts
window.AuthValidation = {
  validators,
  validateForm,
  showError,
  hideError,
  showSuccess,
}


/**
 * Thiết lập chức năng bật/tắt hiển thị mật khẩu.
 */
function setupPasswordToggle() {
    const toggleButtons = $$(".toggle-password");

    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const passwordInput = $(`#${targetId}`);

            // 1. Chuyển đổi loại input (text/password)
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);

            // 2. Chuyển đổi icon (eye/eye-slash)
            button.classList.toggle("fa-eye");
            button.classList.toggle("fa-eye-slash");
        });
    });
}


// ... (Đoạn mã hiện có trong document.addEventListener("DOMContentLoaded", ...))

document.addEventListener("DOMContentLoaded", () => {
  setupRealTimeValidation()
  
  // GỌI HÀM MỚI Ở ĐÂY
  setupPasswordToggle() 

  // Setup form handlers
  // ... (Phần còn lại giữ nguyên)
});