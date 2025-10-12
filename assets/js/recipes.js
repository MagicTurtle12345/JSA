// assets/js/recipes.js

// Dữ liệu mẫu ban đầu nếu localStorage rỗng
const defaultRecipes = [
    {
        id: 1,
        name: "Phở Bò Truyền Thống",
        category: "Món chính", // Đã sửa category để hiển thị đẹp hơn
        difficulty: "Trung bình",
        time: 180,
        servings: 4,
        description: "Món ăn quốc hồn quốc túy của Việt Nam với nước dùng đậm đà, thịt bò mềm và hương thơm của các loại gia vị.",
        ingredients: ["Xương bò (1kg)", "Thịt bò nạm/tái (300g)", "Bánh phở (1kg)", "Gừng, hành tây (1 củ)", "Hoa hồi, quế, thảo quả (một ít)", "Rau thơm, chanh, ớt"],
        instructions: ["Ninh xương bò lấy nước dùng (tối thiểu 3 tiếng)", "Rang gừng, hành, gia vị, sau đó cho vào nồi nước dùng", "Nêm nếm gia vị cho nước dùng vừa ăn", "Chần bánh phở qua nước sôi", "Xếp bánh phở, thịt bò vào tô, chan nước dùng nóng", "Ăn kèm rau thơm, chanh, ớt."],
        image: "assets/images/pho-bo.jpg", // Giả định có ảnh
        tags: ["Việt Nam", "Món chính", "Truyền thống", "Phở"],
        author: "Default",
        createdAt: "2024-01-10T10:00:00Z",
    },
    {
        id: 2,
        name: "Bánh Mì Kẹp Thịt Nướng",
        category: "Ăn nhẹ",
        difficulty: "Dễ",
        time: 45,
        servings: 2,
        description: "Món ăn đường phố nổi tiếng thế giới, kết hợp hài hòa giữa vị mặn của thịt nướng, chua ngọt của đồ chua và giòn tan của bánh mì.",
        ingredients: ["Thịt heo ba chỉ (200g)", "Bánh mì (2 ổ)", "Đồ chua (cà rốt, củ cải)", "Pate", "Rau mùi, ớt", "Nước sốt ướp thịt"],
        instructions: ["Ướp thịt với gia vị, nướng chín (hoặc chiên)", "Cắt bánh mì dọc theo chiều dài, phết pate", "Kẹp thịt nướng, đồ chua, rau mùi và ớt vào bánh mì."],
        image: "assets/images/banh-mi.jpg", // Giả định có ảnh
        tags: ["Việt Nam", "Ăn nhẹ", "Đường phố", "Thịt heo"],
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
        this.filterRecipes(); 
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
            this.saveData(); 
        }
    }

    // ===============================================
    // CÁC HÀM XỬ LÝ MODAL THÊM/SỬA
    // ===============================================

    showAddRecipeModal(recipe = null) {
        const modal = document.getElementById("addRecipeModal");
        const form = document.getElementById("addRecipeForm");
        
        form.reset();
        form.dataset.editId = "";
        document.querySelector("#addRecipeModal h2").textContent = "Thêm Công Thức Mới";
        document.getElementById("submitRecipeBtn").textContent = "➕ Thêm Công Thức";

        if (recipe) {
            document.querySelector("#addRecipeModal h2").textContent = "Chỉnh Sửa Công Thức";
            document.getElementById("submitRecipeBtn").textContent = "💾 Cập Nhật Công Thức";
            form.dataset.editId = recipe.id;
            
            document.getElementById("recipeName").value = recipe.name || '';
            document.getElementById("recipeCategory").value = recipe.category || 'Món chính';
            document.getElementById("recipeDifficulty").value = recipe.difficulty || 'Dễ';
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
    // CÁC HÀM XỬ LÝ MODAL CHI TIẾT CÔNG THỨC (MỚI)
    // ===============================================

    /**
     * Hiển thị modal chi tiết công thức và điền dữ liệu.
     * @param {number} id - ID của công thức.
     */
    showRecipeDetailModal(id) {
        const recipeId = Number(id);
        const recipe = this.recipes.find(r => r.id === recipeId);

        if (!recipe) {
            alert("Không tìm thấy công thức!");
            return;
        }

        const modal = document.getElementById("recipeDetailModal");
        // Giả định công thức không phải mặc định là của user
        const isOwner = recipe.author !== "Default"; 

        // 1. Điền thông tin cơ bản
        document.getElementById("detailRecipeName").textContent = recipe.name;
        document.getElementById("detailRecipeImage").src = recipe.image || 'assets/images/default-recipe.jpg';

        // 2. Điền Meta
        document.getElementById("detailRecipeCategory").textContent = recipe.category;
        document.getElementById("detailRecipeDifficulty").textContent = recipe.difficulty;
        document.getElementById("detailRecipeTime").textContent = `${recipe.time} phút`;
        document.getElementById("detailRecipeServings").textContent = `${recipe.servings} phần`;
        document.getElementById("detailRecipeDescription").textContent = recipe.description;
        
        // Thêm thông tin tác giả và ngày tạo
        const date = new Date(recipe.createdAt).toLocaleDateString('vi-VN');
        const authorElement = document.getElementById("detailRecipeAuthor");
        if (authorElement) authorElement.textContent = `Tác giả: ${recipe.author} | Ngày tạo: ${date}`;


        // 3. Điền Nguyên liệu (Ingredients)
        const ingredientsList = document.getElementById("detailRecipeIngredients");
        // Sử dụng các item list với icon 
        ingredientsList.innerHTML = recipe.ingredients.map(ing => `<li><i class="fas fa-check-circle ingredient-icon"></i> ${ing}</li>`).join('');

        // 4. Điền Hướng dẫn (Instructions)
        const instructionsList = document.getElementById("detailRecipeInstructions");
        // Sử dụng ordered list (số thứ tự)
        instructionsList.innerHTML = recipe.instructions.map(inst => `<li>${inst}</li>`).join('');
        
        // 5. Điền Tags
        const tagsContainer = document.querySelector("#detailRecipeTags .tags-container");
        const tagsSection = document.getElementById("detailRecipeTags");
        if (recipe.tags && recipe.tags.length > 0) {
            tagsContainer.innerHTML = recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            tagsSection.style.display = 'block';
        } else {
            tagsSection.style.display = 'none';
        }

        // 6. Cập nhật nút Yêu thích
        const favoriteBtn = document.getElementById("favoriteBtn");
        const isFavorite = this.favorites.has(recipeId);
        favoriteBtn.innerHTML = isFavorite ? '<span class="heart">❤️</span> Bỏ yêu thích' : '<span class="heart">♡</span> Yêu thích';
        
        // Gán sự kiện Yêu thích ngay trong hàm này
        favoriteBtn.onclick = (e) => { 
            e.stopPropagation();
            this.toggleFavorite(recipeId);
            // Cập nhật trạng thái icon ngay lập tức trong modal
            const isFav = this.favorites.has(recipeId);
            favoriteBtn.innerHTML = isFav ? '<span class="heart">❤️</span> Bỏ yêu thích' : '<span class="heart">♡</span> Yêu thích';
            // Cập nhật luôn thẻ công thức
            this.filterRecipes(); 
        };

        // 7. Cập nhật nút Chỉnh sửa/Xóa (chỉ hiện khi là công thức của user)
        const editBtn = document.getElementById("editRecipeBtn");
        const deleteBtn = document.getElementById("deleteRecipeBtn");
        
        if (isOwner) {
            editBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
            editBtn.onclick = () => { this.hideRecipeDetailModal(); this.editRecipe(recipeId); };
            deleteBtn.onclick = () => { this.hideRecipeDetailModal(); this.deleteRecipe(recipeId); };
        } else {
            editBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
        }

        // 8. Hiển thị modal
        modal.style.display = "block";
    }

    hideRecipeDetailModal() {
        document.getElementById("recipeDetailModal").style.display = "none";
    }

    // ===============================================
    // HÀM XỬ LÝ FORM SUBMIT (GIỮ NGUYÊN)
    // ===============================================

    handleAddRecipe(event) {
        event.preventDefault(); 

        const form = document.getElementById("addRecipeForm");
        const formData = new FormData(form);
        const editId = form.dataset.editId;

        const name = formData.get("name").trim();
        const category = formData.get("category");
        const difficulty = formData.get("difficulty");
        const time = Number.parseInt(formData.get("time")) || 0;
        const servings = Number.parseInt(formData.get("servings")) || 1;
        const description = formData.get("description").trim();
        
        const ingredients = formData.get("ingredients").split('\n').map(item => item.trim()).filter(item => item.length > 0);
        const instructions = formData.get("instructions").split('\n').map(item => item.trim()).filter(item => item.length > 0);
        
        const image = formData.get("image").trim() || "assets/images/default-recipe.jpg"; 
        
        const tagsInput = formData.get("tags");
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
        
        const user = JSON.parse(localStorage.getItem('user'));
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
            const idToEdit = Number(editId);
            const index = this.recipes.findIndex(r => r.id === idToEdit);
            if (index !== -1) {
                this.recipes[index] = { ...this.recipes[index], ...newRecipe, id: idToEdit }; 
            }
            alert("Công thức đã được cập nhật!");
        } else {
            newRecipe.id = Date.now() + Math.floor(Math.random() * 1000); 
            this.recipes.unshift(newRecipe);
            alert("Công thức mới đã được thêm!");
        }

        this.saveData(); 
        this.filterRecipes();
        this.hideAddRecipeModal();
    }
    
    // ===============================================
    // HÀM LẮNG NGHE SỰ KIỆN (ĐÃ CẬP NHẬT)
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
            addRecipeForm.addEventListener("submit", (e) => this.handleAddRecipe(e));
        }

        // Đóng Modal Thêm/Sửa
        const addModal = document.getElementById("addRecipeModal");
        if (addModal) {
            const closeModalBtn = addModal.querySelector(".modal-close");
            const cancelBtn = document.getElementById("cancelRecipe");
            
            if (closeModalBtn) closeModalBtn.addEventListener("click", () => this.hideAddRecipeModal());
            if (cancelBtn) cancelBtn.addEventListener("click", () => this.hideAddRecipeModal());
            
            window.addEventListener('click', (event) => {
                if (event.target === addModal) {
                    this.hideAddRecipeModal();
                }
            });
        }
        
        // Lắng nghe sự kiện đóng Modal Chi tiết (MỚI)
        const detailModal = document.getElementById("recipeDetailModal");
        if (detailModal) {
            const closeModalBtn = detailModal.querySelector(".modal-close");
            
            if (closeModalBtn) closeModalBtn.addEventListener("click", () => this.hideRecipeDetailModal());
            
            // Đóng khi click ra ngoài
            window.addEventListener('click', (event) => {
                if (event.target === detailModal) {
                    this.hideRecipeDetailModal();
                }
            });
            
            // Lắng nghe nút Print
            const printBtn = document.getElementById("printBtn");
            if (printBtn) {
                printBtn.addEventListener('click', () => window.print());
            }
        }

        // Event Listeners cho bộ lọc (Giữ nguyên)
        document.getElementById("searchInput")?.addEventListener("input", () => this.filterRecipes());
        document.getElementById("categoryFilter")?.addEventListener("change", () => this.filterRecipes());
        document.getElementById("difficultyFilter")?.addEventListener("change", () => this.filterRecipes());
        document.getElementById("timeFilter")?.addEventListener("change", () => this.filterRecipes());
        document.getElementById("authorFilter")?.addEventListener("change", () => this.filterRecipes());

        // Event Listener cho nút Chuyển đổi chế độ xem
        document.getElementById("viewModeBtn")?.addEventListener("click", () => this.toggleViewMode());

    }
    
    // ===============================================
    // CÁC HÀM KHÁC (ĐÃ CẬP NHẬT)
    // ===============================================
    
    // CẬP NHẬT: Thêm sự kiện mở modal chi tiết
    createRecipeCard(recipe) {
        const isFavorite = this.favorites.has(recipe.id);
        
        const card = document.createElement("div");
        card.className = `recipe-card ${this.currentView === 'list' ? 'list-view' : ''}`;
        card.dataset.id = recipe.id;

        const starClass = isFavorite ? 'fas fa-heart' : 'far fa-heart'; // Sử dụng icon trái tim

        card.innerHTML = `
            <div class="recipe-image-section">
                <img src="${recipe.image || 'assets/images/default-recipe.jpg'}" alt="${recipe.name}">
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
            e.stopPropagation(); 
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

        // Gắn sự kiện cho Xem chi tiết (MỚI)
        card.querySelector('.view-details-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showRecipeDetailModal(recipe.id);
        });

        return card;
    }

    renderRecipes(recipesToRender = this.recipes) {
        const recipesGrid = document.getElementById("recipesGrid");
        const emptyState = document.getElementById("emptyState");
        recipesGrid.innerHTML = "";
        
        if (recipesToRender.length === 0) {
            recipesGrid.style.display = 'none';
            emptyState.style.display = 'block';
            document.getElementById("filteredRecipes").textContent = 0;
            return;
        }

        // Giữ lại logic CSS list-mode
        recipesGrid.style.display = this.currentView === 'grid' ? 'grid' : 'block';
        if (this.currentView === 'list') {
             recipesGrid.classList.add("list-mode");
        } else {
             recipesGrid.classList.remove("list-mode");
        }
        
        emptyState.style.display = 'none';

        recipesToRender.forEach(recipe => {
            const card = this.createRecipeCard(recipe);
            recipesGrid.appendChild(card);
        });

        document.getElementById("filteredRecipes").textContent = recipesToRender.length;
    }

    filterRecipes() {
        // ... (Logic giữ nguyên)
        const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
        const category = document.getElementById("categoryFilter")?.value || "all";
        const difficulty = document.getElementById("difficultyFilter")?.value || "all";
        const time = Number(document.getElementById("timeFilter")?.value) || 0;
        const author = document.getElementById("authorFilter")?.value || "all";

        this.filteredRecipes = this.recipes.filter(recipe => {
            const matchesSearch = !searchTerm || 
                                  recipe.name.toLowerCase().includes(searchTerm) || 
                                  recipe.description.toLowerCase().includes(searchTerm) ||
                                  (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

            const matchesCategory = category === "all" || recipe.category === category;
            const matchesDifficulty = difficulty === "all" || recipe.difficulty === difficulty;

            const matchesTime = time === 0 || recipe.time <= time;
            
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
        this.filterRecipes(); 
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
            this.favorites.delete(recipeId); 
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
            recipesGrid.classList.add("list-mode")
            viewModeBtn.innerHTML = '<i class="fas fa-th-large"></i> Dạng lưới'
        } else {
            this.currentView = "grid"
            recipesGrid.classList.remove("list-mode")
            viewModeBtn.innerHTML = '<i class="fas fa-list"></i> Dạng danh sách'
        }
        
        this.renderRecipes(this.filteredRecipes); 
    }

    updateStats() {
        const totalRecipes = this.recipes.length
        const userRecipes = this.recipes.filter((recipe) => recipe.author !== "Default").length
        const favoriteRecipes = this.favorites.size
        // Đã sử dụng ID filteredRecipes
        const filteredRecipes = this.filteredRecipes.length 

        document.getElementById("totalRecipes").textContent = totalRecipes
        document.getElementById("userRecipes").textContent = userRecipes
        document.getElementById("favoriteRecipes").textContent = favoriteRecipes
        document.getElementById("filteredRecipes").textContent = filteredRecipes
    }
}

// Khởi tạo hệ thống quản lý công thức
new RecipeManager();