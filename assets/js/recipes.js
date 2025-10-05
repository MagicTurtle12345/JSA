// assets/js/recipes.js

// Dữ liệu mẫu ban đầu nếu localStorage rỗng
const defaultRecipes = [
    {
        id: 1,
        name: "Phở Bò Truyền Thống",
        category: "main",
        difficulty: "medium",
        time: 180,
        servings: 4,
        description: "Món ăn quốc hồn quốc túy của Việt Nam với nước dùng đậm đà, thịt bò mềm và hương thơm của các loại gia vị.",
        ingredients: ["Xương bò", "Thịt bò nạm/tái", "Bánh phở", "Gừng, hành tây", "Hoa hồi, quế, thảo quả", "Rau thơm, chanh, ớt"],
        instructions: ["Ninh xương bò lấy nước dùng (tối thiểu 3 tiếng)", "Rang gừng, hành, gia vị", "Cho gừng, hành, gia vị vào nước dùng, nêm nếm", "Chần bánh phở", "Xếp bánh phở, thịt bò vào tô, chan nước dùng nóng", "Ăn kèm rau thơm."],
        image: "assets/images/pho-bo.jpg", // Giả định có ảnh
        tags: ["Việt Nam", "Món chính", "Truyền thống"],
        author: "Default",
        createdAt: "2024-01-10T10:00:00Z",
    },
    {
        id: 2,
        name: "Bánh Mì Kẹp Thịt Nướng",
        category: "appetizer",
        difficulty: "easy",
        time: 45,
        servings: 2,
        description: "Món ăn đường phố nổi tiếng thế giới, kết hợp hài hòa giữa vị mặn của thịt nướng, chua ngọt của đồ chua và giòn tan của bánh mì.",
        ingredients: ["Thịt heo ba chỉ", "Bánh mì", "Đồ chua (cà rốt, củ cải)", "Pate", "Rau mùi, ớt", "Nước sốt ướp thịt"],
        instructions: ["Ướp thịt, nướng chín", "Chuẩn bị đồ chua", "Xẻ bánh mì, phết pate", "Kẹp thịt, đồ chua, rau mùi, ớt vào bánh mì"],
        image: "assets/images/banh-mi.jpg", // Giả định có ảnh
        tags: ["Việt Nam", "Ăn nhẹ", "Đường phố"],
        author: "Default",
        createdAt: "2024-05-20T15:30:00Z",
    },
];

// Recipe management system
class RecipeManager {
    constructor() {
        this.recipes = [];
        this.filteredRecipes = [];
        this.favorites = new Set();
        this.currentView = "grid";
        this.init();
    }

    init() {
        this.loadData();
        this.loadDefaultRecipes();
        this.setupEventListeners();
        this.filterRecipes(); // Gọi filterRecipes thay vì renderRecipes để hiển thị tất cả ban đầu
        this.updateStats();
    }

    loadData() {
        const savedRecipes = localStorage.getItem("recipes");
        if (savedRecipes) {
            this.recipes = JSON.parse(savedRecipes);
        }

        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            this.favorites = new Set(JSON.parse(savedFavorites));
        }
    }

    saveData() {
        localStorage.setItem("recipes", JSON.stringify(this.recipes));
        localStorage.setItem("favorites", JSON.stringify([...this.favorites]));
    }

    loadDefaultRecipes() {
        if (this.recipes.length === 0) {
            this.recipes = defaultRecipes;
            this.saveData(); // Lưu dữ liệu mẫu vào localStorage lần đầu
        }
    }

    // ===============================================
    // CÁC HÀM XỬ LÝ MODAL (ĐÃ THÊM/SỬA)
    // ===============================================

    showAddRecipeModal(recipe = null) {
        const modal = document.getElementById("addRecipeModal");
        const form = document.getElementById("addRecipeForm");
        
        // Đảm bảo modal được hiển thị và form được reset
        form.reset();
        form.dataset.editId = "";
        document.querySelector("#addRecipeModal h2").textContent = "Thêm Công Thức Mới";
        document.getElementById("submitRecipeBtn").textContent = "➕ Thêm Công Thức";

        if (recipe) {
            // Nếu đang chỉnh sửa
            document.querySelector("#addRecipeModal h2").textContent = "Chỉnh Sửa Công Thức";
            document.getElementById("submitRecipeBtn").textContent = "💾 Cập Nhật Công Thức";
            form.dataset.editId = recipe.id;
            
            // Điền dữ liệu vào form
            document.getElementById("recipeName").value = recipe.name || '';
            document.getElementById("recipeCategory").value = recipe.category || 'main';
            document.getElementById("recipeDifficulty").value = recipe.difficulty || 'easy';
            document.getElementById("recipeTime").value = recipe.time || 30;
            document.getElementById("recipeServings").value = recipe.servings || 4;
            document.getElementById("recipeDescription").value = recipe.description || '';
            document.getElementById("recipeIngredients").value = recipe.ingredients ? recipe.ingredients.join('\n') : '';
            document.getElementById("recipeInstructions").value = recipe.instructions ? recipe.instructions.join('\n') : '';
            document.getElementById("recipeImage").value = recipe.image || '';
            document.getElementById("recipeTags").value = recipe.tags ? recipe.tags.join(', ') : '';
        }

        modal.style.display = "block";
    }

    hideAddRecipeModal() {
        const modal = document.getElementById("addRecipeModal");
        const form = document.getElementById("addRecipeForm");
        
        modal.style.display = "none";
        form.reset();
        form.dataset.editId = "";
    }


    // ===============================================
    // HÀM XỬ LÝ FORM SUBMIT (ĐÃ SỬA LỖI EVENT)
    // ===============================================

    /**
     * Xử lý việc thêm hoặc cập nhật công thức khi form được gửi.
     * @param {Event} event - Sự kiện submit form.
     */
    handleAddRecipe(event) {
        // RẤT QUAN TRỌNG: NGĂN CHẶN TẢI LẠI TRANG
        event.preventDefault(); 

        const form = document.getElementById("addRecipeForm");
        const formData = new FormData(form);
        const editId = form.dataset.editId;

        // Lấy giá trị từ form
        const name = formData.get("name").trim();
        const category = formData.get("category");
        const difficulty = formData.get("difficulty");
        const time = Number.parseInt(formData.get("time")) || 0;
        const servings = Number.parseInt(formData.get("servings")) || 1;
        const description = formData.get("description").trim();
        
        // Xử lý Ingredients và Instructions (Tách chuỗi bằng dấu xuống dòng)
        const ingredients = formData.get("ingredients").split('\n').map(item => item.trim()).filter(item => item.length > 0);
        const instructions = formData.get("instructions").split('\n').map(item => item.trim()).filter(item => item.length > 0);
        
        const image = formData.get("image").trim() || "assets/images/default-recipe.jpg"; // Default image placeholder
        
        // Xử lý Tags (Tách chuỗi bằng dấu phẩy)
        const tagsInput = formData.get("tags");
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
        
        // Lấy thông tin người dùng từ LocalStorage
        const user = JSON.parse(localStorage.getItem('user'));
        // Sử dụng tên người dùng đã đăng nhập hoặc "Người đóng góp"
        const author = user ? user.name : "Người đóng góp"; 

        const newRecipe = {
            name,
            category,
            difficulty,
            time,
            servings,
            description,
            ingredients,
            instructions,
            image,
            tags,
            author,
            createdAt: new Date().toISOString(),
        };

        if (editId) {
            // CẬP NHẬT CÔNG THỨC
            const idToEdit = Number(editId);
            const index = this.recipes.findIndex(r => r.id === idToEdit);
            if (index !== -1) {
                // Giữ lại các thuộc tính cũ như ID, author
                this.recipes[index] = { ...this.recipes[index], ...newRecipe, id: idToEdit }; 
            }
            alert("Công thức đã được cập nhật!");
        } else {
            // THÊM CÔNG THỨC MỚI
            // Tạo ID mới duy nhất
            newRecipe.id = Date.now() + Math.floor(Math.random() * 1000); 
            this.recipes.unshift(newRecipe);
            alert("Công thức mới đã được thêm!");
        }

        // LƯU DỮ LIỆU VÀO LOCAL STORAGE
        this.saveData(); 
        
        // HIỂN THỊ LẠI DANH SÁCH & ẨN MODAL
        this.filterRecipes();
        this.hideAddRecipeModal();
    }
    
    // ... (Hàm createRecipeCard, updateStats, filterRecipes, v.v. giữ nguyên)
    
    // ===============================================
    // HÀM LẮNG NGHE SỰ KIỆN (ĐÃ SỬA LỖI GẮN SỰ KIỆN)
    // ===============================================

    setupEventListeners() {
        // Nút chính "Thêm Công Thức"
        const addRecipeBtn = document.getElementById("addRecipeBtn");
        if (addRecipeBtn) {
            addRecipeBtn.addEventListener("click", () => this.showAddRecipeModal());
        }
        
        // Nút "Thêm Công Thức Đầu Tiên" khi chưa có công thức nào
        const firstRecipeBtn = document.getElementById("firstRecipeBtn");
        if (firstRecipeBtn) {
            firstRecipeBtn.addEventListener("click", () => this.showAddRecipeModal());
        }

        // Form Submit
        const addRecipeForm = document.getElementById("addRecipeForm");
        if (addRecipeForm) {
            // Gắn sự kiện submit form để gọi hàm handleAddRecipe
            addRecipeForm.addEventListener("submit", (e) => this.handleAddRecipe(e));
        }

        // Đóng Modal
        const modal = document.getElementById("addRecipeModal");
        if (modal) {
            const closeModalBtn = modal.querySelector(".modal-close");
            const cancelBtn = document.getElementById("cancelRecipe");
            
            if (closeModalBtn) closeModalBtn.addEventListener("click", () => this.hideAddRecipeModal());
            if (cancelBtn) cancelBtn.addEventListener("click", () => this.hideAddRecipeModal());
            
            // Đóng khi click ra ngoài
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    this.hideAddRecipeModal();
                }
            });
        }
        
        // Event Listeners cho bộ lọc (Giả định bạn đã có các ID này trong HTML)
        document.getElementById("searchInput")?.addEventListener("input", () => this.filterRecipes());
        document.getElementById("categoryFilter")?.addEventListener("change", () => this.filterRecipes());
        document.getElementById("difficultyFilter")?.addEventListener("change", () => this.filterRecipes());
        document.getElementById("timeFilter")?.addEventListener("change", () => this.filterRecipes());
        document.getElementById("authorFilter")?.addEventListener("change", () => this.filterRecipes());

        // Event Listener cho nút Chuyển đổi chế độ xem
        document.getElementById("viewModeBtn")?.addEventListener("click", () => this.toggleViewMode());

    }
    
    // ===============================================
    // CÁC HÀM CÒN LẠI (GIỮ NGUYÊN HOẶC BỔ SUNG LOGIC)
    // ===============================================

    renderRecipes(recipesToRender = this.recipes) {
        const recipesGrid = document.getElementById("recipesGrid");
        const emptyState = document.getElementById("emptyState");
        recipesGrid.innerHTML = "";
        
        if (recipesToRender.length === 0) {
            recipesGrid.style.display = 'none';
            emptyState.style.display = 'block';
            document.getElementById("filteredCount").textContent = 0;
            return;
        }

        recipesGrid.style.display = this.currentView === 'grid' ? 'grid' : 'block';
        emptyState.style.display = 'none';

        recipesToRender.forEach(recipe => {
            const card = this.createRecipeCard(recipe);
            recipesGrid.appendChild(card);
        });

        document.getElementById("filteredCount").textContent = recipesToRender.length;
    }

    createRecipeCard(recipe) {
        const isFavorite = this.favorites.has(recipe.id);
        
        const card = document.createElement("div");
        card.className = `recipe-card ${this.currentView === 'list' ? 'list-view' : ''}`;
        card.dataset.id = recipe.id;

        const starClass = isFavorite ? 'fas fa-heart' : 'far fa-heart'; // Sử dụng icon trái tim

        card.innerHTML = `
            <div class="recipe-image-section">
                <img src="${recipe.image}" alt="${recipe.name}">
                <button class="favorite-btn" data-id="${recipe.id}"><i class="${starClass}"></i></button>
            </div>
            <div class="recipe-content">
                <span class="recipe-category">${recipe.category}</span>
                <h3 class="recipe-title">${recipe.name}</h3>
                <p class="recipe-description">${recipe.description.substring(0, 100)}...</p>
                <div class="recipe-meta">
                    <span class="meta-item"><i class="fas fa-clock"></i> ${recipe.time} phút</span>
                    <span class="meta-item"><i class="fas fa-utensils"></i> ${recipe.servings} khẩu phần</span>
                </div>
                <div class="recipe-actions">
                    <button class="btn-primary view-details-btn">Xem chi tiết</button>
                    <button class="btn-secondary edit-btn" data-id="${recipe.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-secondary delete-btn" data-id="${recipe.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        // Gắn sự kiện cho nút Yêu thích
        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn sự kiện lan truyền
            this.toggleFavorite(recipe.id);
        });
        
        // Gắn sự kiện cho nút Xóa
        card.querySelector('.delete-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteRecipe(recipe.id);
        });

        // Gắn sự kiện cho nút Chỉnh sửa
        card.querySelector('.edit-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editRecipe(recipe.id);
        });

        // Gắn sự kiện cho Xem chi tiết
        card.querySelector('.view-details-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            // Tạm thời chỉ alert, sau này có thể mở modal chi tiết
            alert(`Xem chi tiết công thức: ${recipe.name}`);
        });

        return card;
    }

    filterRecipes() {
        const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
        const category = document.getElementById("categoryFilter")?.value || "all";
        const difficulty = document.getElementById("difficultyFilter")?.value || "all";
        const time = Number(document.getElementById("timeFilter")?.value) || 0;
        const author = document.getElementById("authorFilter")?.value || "all";

        this.filteredRecipes = this.recipes.filter(recipe => {
            // Lọc theo từ khóa
            const matchesSearch = !searchTerm || 
                                  recipe.name.toLowerCase().includes(searchTerm) || 
                                  recipe.description.toLowerCase().includes(searchTerm) ||
                                  (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

            // Lọc theo danh mục
            const matchesCategory = category === "all" || recipe.category === category;
            
            // Lọc theo độ khó
            const matchesDifficulty = difficulty === "all" || recipe.difficulty === difficulty;

            // Lọc theo thời gian
            const matchesTime = time === 0 || recipe.time <= time;
            
            // Lọc theo tác giả (ví dụ: chỉ công thức của User)
            const matchesAuthor = author === "all" || (author === "user" && recipe.author !== "Default") || (author === "default" && recipe.author === "Default");


            return matchesSearch && matchesCategory && matchesDifficulty && matchesTime && matchesAuthor;
        });

        this.renderRecipes(this.filteredRecipes);
        this.updateStats();
    }
    
    toggleFavorite(id) {
        const recipeId = Number(id);
        if (this.favorites.has(recipeId)) {
            this.favorites.delete(recipeId);
        } else {
            this.favorites.add(recipeId);
        }
        this.saveData();
        this.filterRecipes(); // Re-render để cập nhật icon
        this.updateStats();
    }
    
    editRecipe(id) {
        const recipeId = Number(id);
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (recipe) {
            this.showAddRecipeModal(recipe);
        }
    }

    deleteRecipe(id) {
        const recipeId = Number(id);
        if (confirm("Bạn có chắc chắn muốn xóa công thức này?")) {
            this.recipes = this.recipes.filter(r => r.id !== recipeId);
            this.favorites.delete(recipeId); // Xóa khỏi danh sách yêu thích nếu có
            this.saveData();
            this.filterRecipes();
            this.updateStats();
            alert("Đã xóa công thức thành công.");
        }
    }
    
    toggleViewMode() {
        const recipesGrid = document.getElementById("recipesGrid")
        const viewModeBtn = document.getElementById("viewModeBtn")

        if (this.currentView === "grid") {
            this.currentView = "list"
            recipesGrid.classList.add("list-mode") // Sử dụng class thay vì style trực tiếp
            viewModeBtn.innerHTML = '<i class="fas fa-th-large"></i> Dạng lưới'
        } else {
            this.currentView = "grid"
            recipesGrid.classList.remove("list-mode")
            viewModeBtn.innerHTML = '<i class="fas fa-list"></i> Dạng danh sách'
        }
        
        // Render lại để áp dụng class mới
        this.renderRecipes(this.filteredRecipes); 
    }

    updateStats() {
        // Cập nhật các thống kê trên sidebar
        const totalRecipes = this.recipes.length
        const userRecipes = this.recipes.filter((recipe) => recipe.author !== "Default").length
        const favoriteRecipes = this.favorites.size
        const filteredRecipes = this.filteredRecipes.length

        document.getElementById("totalRecipes").textContent = totalRecipes
        document.getElementById("userRecipes").textContent = userRecipes
        document.getElementById("favoriteRecipes").textContent = favoriteRecipes
        document.getElementById("filteredRecipes").textContent = filteredRecipes
    }
}

// Khởi tạo hệ thống quản lý công thức
new RecipeManager();