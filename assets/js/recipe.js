// Recipe management system
class RecipeManager {
  constructor() {
    this.recipes = []
    this.filteredRecipes = []
    this.favorites = new Set()
    this.currentView = "grid"
    this.init()
  }

  init() {
    this.loadData()
    this.setupEventListeners()
    this.loadDefaultRecipes()
    this.renderRecipes()
    this.updateStats()
  }

  loadData() {
    // Load recipes from localStorage
    const savedRecipes = localStorage.getItem("recipes")
    if (savedRecipes) {
      this.recipes = JSON.parse(savedRecipes)
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      this.favorites = new Set(JSON.parse(savedFavorites))
    }
  }

  saveData() {
    localStorage.setItem("recipes", JSON.stringify(this.recipes))
    localStorage.setItem("favorites", JSON.stringify([...this.favorites]))
  }

  loadDefaultRecipes() {
    if (this.recipes.length === 0) {
      this.recipes = [
        {
          id: 1,
          name: "Phở Bò Truyền Thống",
          category: "main",
          difficulty: "medium",
          time: 180,
          servings: 4,
          description: "Món phở bò truyền thống với nước dùng trong vắt, thơm ngon",
          ingredients: [
            "1kg xương bò",
            "500g thịt bò tái",
            "200g bánh phở",
            "1 củ hành tây",
            "3 tép tỏi",
            "Gừng, quế, hồi, đinh hương",
            "Hành lá, ngò gai",
            "Nước mắm, muối, đường",
          ],
          instructions: [
            "Ninh xương bò trong 3-4 tiếng để có nước dùng trong",
            "Ướp thịt bò với gia vị trong 30 phút",
            "Chuẩn bị bánh phở và rau thơm",
            "Trụng bánh phở qua nước sôi",
            "Xếp bánh phở, thịt bò vào t그릇",
            "Chan nước dùng nóng và thêm rau thơm",
          ],
          image: "/vietnamese-pho-bo-soup.jpg",
          tags: ["truyền thống", "nước dùng", "thịt bò"],
          author: "Admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Bánh Mì Thịt Nướng",
          category: "main",
          difficulty: "easy",
          time: 45,
          servings: 2,
          description: "Bánh mì giòn với thịt nướng thơm lừng và rau củ tươi ngon",
          ingredients: [
            "2 ổ bánh mì",
            "300g thịt heo vai",
            "Pate gan",
            "Dưa chua, cà rốt",
            "Rau thơm, dưa leo",
            "Tương ớt, mayonnaise",
            "Gia vị nướng thịt",
          ],
          instructions: [
            "Ướp thịt với gia vị trong 30 phút",
            "Nướng thịt trên than hoa hoặc lò nướng",
            "Cắt bánh mì, phết pate và mayonnaise",
            "Xếp thịt nướng và rau củ vào bánh mì",
            "Thêm tương ớt theo khẩu vị",
          ],
          image: "/vietnamese-banh-mi-sandwich.jpg",
          tags: ["nhanh gọn", "thịt nướng", "bánh mì"],
          author: "Admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Chè Đậu Xanh",
          category: "dessert",
          difficulty: "easy",
          time: 60,
          servings: 6,
          description: "Chè đậu xanh mát lạnh, ngọt dịu, thích hợp cho mùa hè",
          ingredients: [
            "200g đậu xanh",
            "100g đường phèn",
            "400ml nước cốt dừa",
            "1 muỗng cà phê muối",
            "Lá dứa",
            "Đá bào",
          ],
          instructions: [
            "Ngâm đậu xanh 2 tiếng rồi nấu chín",
            "Nấu nước cốt dừa với đường và muối",
            "Trộn đậu xanh với nước cốt dừa",
            "Để nguội trong tủ lạnh",
            "Ăn kèm với đá bào",
          ],
          image: "/vietnamese-mung-bean-dessert.jpg",
          tags: ["tráng miệng", "mát lạnh", "đậu xanh"],
          author: "Admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: "Cà Ri Gà",
          category: "main",
          difficulty: "medium",
          time: 90,
          servings: 4,
          description: "Cà ri gà đậm đà với nước cốt dừa và gia vị thơm ngon",
          ingredients: [
            "1 con gà ta",
            "400ml nước cốt dừa",
            "2 củ khoai tây",
            "1 củ cà rốt",
            "Sả, gừng, tỏi",
            "Cà ri bột, ớt bột",
            "Nước mắm, đường",
          ],
          instructions: [
            "Thái gà thành miếng vừa ăn",
            "Phi thơm sả, gừng, tỏi",
            "Xào gà với cà ri bột",
            "Thêm nước cốt dừa và rau củ",
            "Nấu nhỏ lửa 45 phút",
            "Nêm nếm gia vị cho vừa khẩu vị",
          ],
          image: "/vietnamese-chicken-curry.jpg",
          tags: ["cà ri", "gà", "nước cốt dừa"],
          author: "Admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: 5,
          name: "Nước Chanh Dây",
          category: "drink",
          difficulty: "easy",
          time: 10,
          servings: 2,
          description: "Nước chanh dây chua ngọt, giải khát tuyệt vời",
          ingredients: [
            "4 quả chanh dây",
            "3 muỗng cà phê đường",
            "500ml nước lạnh",
            "Đá viên",
            "Lá bạc hà (tùy chọn)",
          ],
          instructions: [
            "Lấy cùi chanh dây",
            "Trộn với đường và nước lạnh",
            "Khuấy đều cho đường tan",
            "Thêm đá viên",
            "Trang trí với lá bạc hà",
          ],
          image: "/passion-fruit-juice-drink.jpg",
          tags: ["giải khát", "chua ngọt", "chanh dây"],
          author: "Admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: 6,
          name: "Canh Chua Cá",
          category: "soup",
          difficulty: "medium",
          time: 40,
          servings: 4,
          description: "Canh chua cá đậm đà với cà chua và dứa",
          ingredients: [
            "500g cá basa",
            "2 quả cà chua",
            "100g dứa",
            "100g đậu bắp",
            "50g giá đỗ",
            "Me, tỏi, hành",
            "Nước mắm, đường",
            "Rau thơm",
          ],
          instructions: [
            "Sơ chế cá, cắt miếng vừa ăn",
            "Nấu nước dùng từ xương cá",
            "Phi thơm tỏi, hành",
            "Thêm cà chua, dứa vào nấu",
            "Cho cá và rau củ vào nấu",
            "Nêm nếm chua ngọt vừa khẩu vị",
          ],
          image: "/vietnamese-sour-fish-soup.png",
          tags: ["canh chua", "cá", "cà chua"],
          author: "Admin",
          createdAt: new Date().toISOString(),
        },
      ]
      this.saveData()
    }
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("searchInput")
    const searchBtn = document.getElementById("searchBtn")

    searchInput.addEventListener("input", () => this.filterRecipes())
    searchBtn.addEventListener("click", () => this.filterRecipes())

    // Filter functionality
    document.getElementById("categoryFilter").addEventListener("change", () => this.filterRecipes())
    document.getElementById("difficultyFilter").addEventListener("change", () => this.filterRecipes())
    document.getElementById("timeFilter").addEventListener("change", () => this.filterRecipes())

    // Modal functionality
    document.getElementById("addRecipeBtn").addEventListener("click", () => this.showAddRecipeModal())
    document.getElementById("addFirstRecipe").addEventListener("click", () => this.showAddRecipeModal())
    document.getElementById("cancelRecipe").addEventListener("click", () => this.hideAddRecipeModal())

    // Form submission
    document.getElementById("addRecipeForm").addEventListener("submit", (e) => this.handleAddRecipe(e))

    // Modal close buttons
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal")
        modal.style.display = "none"
      })
    })

    // Click outside modal to close
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none"
        }
      })
    })

    // View mode toggle
    document.getElementById("viewModeBtn").addEventListener("click", () => this.toggleViewMode())
  }

  filterRecipes() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase()
    const categoryFilter = document.getElementById("categoryFilter").value
    const difficultyFilter = document.getElementById("difficultyFilter").value
    const timeFilter = document.getElementById("timeFilter").value

    this.filteredRecipes = this.recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

      const matchesCategory = !categoryFilter || recipe.category === categoryFilter
      const matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter

      let matchesTime = true
      if (timeFilter) {
        const maxTime = Number.parseInt(timeFilter)
        matchesTime = recipe.time <= maxTime
      }

      return matchesSearch && matchesCategory && matchesDifficulty && matchesTime
    })

    this.renderRecipes()
    this.updateStats()
  }

  renderRecipes() {
    const recipesGrid = document.getElementById("recipesGrid")
    const noRecipes = document.getElementById("noRecipes")
    const loadingRecipes = document.getElementById("loadingRecipes")

    // Hide loading
    loadingRecipes.style.display = "none"

    // Use filtered recipes or all recipes
    const recipesToShow =
      this.filteredRecipes.length > 0 || this.hasActiveFilters() ? this.filteredRecipes : this.recipes

    if (recipesToShow.length === 0) {
      recipesGrid.style.display = "none"
      noRecipes.style.display = "block"
      return
    }

    noRecipes.style.display = "none"
    recipesGrid.style.display = "grid"
    recipesGrid.innerHTML = ""

    recipesToShow.forEach((recipe) => {
      const recipeCard = this.createRecipeCard(recipe)
      recipesGrid.appendChild(recipeCard)
    })
  }

  hasActiveFilters() {
    const searchTerm = document.getElementById("searchInput").value
    const categoryFilter = document.getElementById("categoryFilter").value
    const difficultyFilter = document.getElementById("difficultyFilter").value
    const timeFilter = document.getElementById("timeFilter").value

    return searchTerm || categoryFilter || difficultyFilter || timeFilter
  }

  createRecipeCard(recipe) {
    const card = document.createElement("div")
    card.className = "recipe-card"
    card.setAttribute("data-recipe-id", recipe.id)

    const difficultyClass = `difficulty-${recipe.difficulty}`
    const difficultyText = {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
    }

    const isFavorited = this.favorites.has(recipe.id)

    card.innerHTML = `
            <button class="recipe-favorite ${isFavorited ? "favorited" : ""}" data-recipe-id="${recipe.id}">
                ${isFavorited ? "♥" : "♡"}
            </button>
            <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='/vibrant-food-dish.png'">
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <div class="recipe-meta">
                    <span class="recipe-difficulty ${difficultyClass}">${difficultyText[recipe.difficulty]}</span>
                    <span class="recipe-time">⏱️ ${recipe.time} phút</span>
                </div>
                ${
                  recipe.tags && recipe.tags.length > 0
                    ? `<div class="recipe-tags">
                        ${recipe.tags.map((tag) => `<span class="recipe-tag">${tag}</span>`).join("")}
                    </div>`
                    : ""
                }
            </div>
        `

    // Add click event to show recipe details
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("recipe-favorite")) {
        this.showRecipeDetail(recipe)
      }
    })

    // Add favorite button functionality
    const favoriteBtn = card.querySelector(".recipe-favorite")
    favoriteBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      this.toggleFavorite(recipe.id)
    })

    return card
  }

  toggleFavorite(recipeId) {
    if (this.favorites.has(recipeId)) {
      this.favorites.delete(recipeId)
    } else {
      this.favorites.add(recipeId)
    }

    this.saveData()
    this.renderRecipes()
    this.updateStats()
  }

  showRecipeDetail(recipe) {
    const modal = document.getElementById("recipeDetailModal")
    const difficultyText = {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
    }

    const categoryText = {
      appetizer: "Khai vị",
      main: "Món chính",
      dessert: "Tráng miệng",
      drink: "Đồ uống",
      soup: "Canh/Súp",
    }

    // Populate modal content
    document.getElementById("detailRecipeName").textContent = recipe.name
    document.getElementById("detailRecipeImage").src = recipe.image
    document.getElementById("detailRecipeImage").alt = recipe.name
    document.getElementById("detailRecipeCategory").textContent = categoryText[recipe.category]
    document.getElementById("detailRecipeDifficulty").textContent = difficultyText[recipe.difficulty]
    document.getElementById("detailRecipeTime").textContent = `${recipe.time} phút`
    document.getElementById("detailRecipeServings").textContent = `${recipe.servings} người`
    document.getElementById("detailRecipeDescription").textContent = recipe.description

    // Populate ingredients
    const ingredientsList = document.getElementById("detailRecipeIngredients")
    ingredientsList.innerHTML = ""
    recipe.ingredients.forEach((ingredient) => {
      const li = document.createElement("li")
      li.textContent = ingredient
      ingredientsList.appendChild(li)
    })

    // Populate instructions
    const instructionsList = document.getElementById("detailRecipeInstructions")
    instructionsList.innerHTML = ""
    recipe.instructions.forEach((instruction, index) => {
      const li = document.createElement("li")
      li.textContent = instruction
      instructionsList.appendChild(li)
    })

    // Populate tags
    const tagsSection = document.getElementById("detailRecipeTags")
    if (recipe.tags && recipe.tags.length > 0) {
      tagsSection.style.display = "block"
      const tagsContainer = tagsSection.querySelector(".tags-container")
      tagsContainer.innerHTML = ""
      recipe.tags.forEach((tag) => {
        const span = document.createElement("span")
        span.className = "recipe-tag"
        span.textContent = tag
        tagsContainer.appendChild(span)
      })
    } else {
      tagsSection.style.display = "none"
    }

    // Setup action buttons
    const favoriteBtn = document.getElementById("favoriteBtn")
    const isFavorited = this.favorites.has(recipe.id)
    favoriteBtn.innerHTML = `<span class="heart">${isFavorited ? "♥" : "♡"}</span> ${
      isFavorited ? "Bỏ yêu thích" : "Yêu thích"
    }`
    favoriteBtn.className = `btn-secondary ${isFavorited ? "favorited" : ""}`

    favoriteBtn.onclick = () => {
      this.toggleFavorite(recipe.id)
      this.showRecipeDetail(recipe) // Refresh modal
    }

    // Setup other action buttons
    document.getElementById("shareBtn").onclick = () => this.shareRecipe(recipe)
    document.getElementById("printBtn").onclick = () => this.printRecipe(recipe)

    // Show edit/delete buttons if user is author
    const editBtn = document.getElementById("editRecipeBtn")
    const deleteBtn = document.getElementById("deleteRecipeBtn")

    if (recipe.author === "User" || recipe.author === "Admin") {
      editBtn.style.display = "inline-flex"
      deleteBtn.style.display = "inline-flex"
      editBtn.onclick = () => this.editRecipe(recipe)
      deleteBtn.onclick = () => this.deleteRecipe(recipe.id)
    } else {
      editBtn.style.display = "none"
      deleteBtn.style.display = "none"
    }

    modal.style.display = "block"
  }

  shareRecipe(recipe) {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      const shareText = `${recipe.name}\n\n${recipe.description}\n\nXem công thức tại: ${window.location.href}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Đã sao chép link chia sẻ!")
      })
    }
  }

  printRecipe(recipe) {
    const printWindow = window.open("", "_blank")
    const difficultyText = {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
    }

    const categoryText = {
      appetizer: "Khai vị",
      main: "Món chính",
      dessert: "Tráng miệng",
      drink: "Đồ uống",
      soup: "Canh/Súp",
    }

    printWindow.document.write(`
            <html>
                <head>
                    <title>${recipe.name} - Công thức nấu ăn</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #2c5530; }
                        .meta { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
                        .meta div { margin: 5px 0; }
                        h2 { color: #2c3e50; border-bottom: 2px solid #2c5530; padding-bottom: 5px; }
                        ul, ol { padding-left: 20px; }
                        li { margin: 8px 0; }
                        .tags { margin-top: 20px; }
                        .tag { background: #e9ecef; padding: 4px 8px; border-radius: 12px; margin-right: 8px; font-size: 0.9em; }
                    </style>
                </head>
                <body>
                    <h1>${recipe.name}</h1>
                    <p><em>${recipe.description}</em></p>
                    
                    <div class="meta">
                        <div><strong>Danh mục:</strong> ${categoryText[recipe.category]}</div>
                        <div><strong>Độ khó:</strong> ${difficultyText[recipe.difficulty]}</div>
                        <div><strong>Thời gian:</strong> ${recipe.time} phút</div>
                        <div><strong>Khẩu phần:</strong> ${recipe.servings} người</div>
                    </div>
                    
                    <h2>Nguyên liệu</h2>
                    <ul>
                        ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
                    </ul>
                    
                    <h2>Cách làm</h2>
                    <ol>
                        ${recipe.instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
                    </ol>
                    
                    ${
                      recipe.tags && recipe.tags.length > 0
                        ? `<div class="tags">
                            <h2>Tags</h2>
                            ${recipe.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                        </div>`
                        : ""
                    }
                    
                    <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
                        In từ Delicious Cooking - ${new Date().toLocaleDateString("vi-VN")}
                    </p>
                </body>
            </html>
        `)

    printWindow.document.close()
    printWindow.print()
  }

  editRecipe(recipe) {
    // Close detail modal
    document.getElementById("recipeDetailModal").style.display = "none"

    // Populate form with recipe data
    document.getElementById("recipeName").value = recipe.name
    document.getElementById("recipeCategory").value = recipe.category
    document.getElementById("recipeDifficulty").value = recipe.difficulty
    document.getElementById("recipeTime").value = recipe.time
    document.getElementById("recipeServings").value = recipe.servings
    document.getElementById("recipeDescription").value = recipe.description
    document.getElementById("recipeIngredients").value = recipe.ingredients.join("\n")
    document.getElementById("recipeInstructions").value = recipe.instructions.join("\n")
    document.getElementById("recipeImage").value = recipe.image
    document.getElementById("recipeTags").value = recipe.tags ? recipe.tags.join(", ") : ""

    // Change form title and button
    document.querySelector("#addRecipeModal .modal-header h2").textContent = "Chỉnh Sửa Công Thức"
    document.querySelector("#addRecipeForm button[type='submit']").textContent = "Cập Nhật Công Thức"

    // Store recipe ID for update
    document.getElementById("addRecipeForm").setAttribute("data-edit-id", recipe.id)

    // Show modal
    document.getElementById("addRecipeModal").style.display = "block"
  }

  deleteRecipe(recipeId) {
    if (confirm("Bạn có chắc chắn muốn xóa công thức này?")) {
      this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId)
      this.favorites.delete(recipeId)
      this.saveData()
      this.filterRecipes()
      document.getElementById("recipeDetailModal").style.display = "none"
    }
  }

  showAddRecipeModal() {
    // Reset form
    document.getElementById("addRecipeForm").reset()
    document.getElementById("addRecipeForm").removeAttribute("data-edit-id")

    // Reset form title and button
    document.querySelector("#addRecipeModal .modal-header h2").textContent = "Thêm Công Thức Mới"
    document.querySelector("#addRecipeForm button[type='submit']").textContent = "Thêm Công Thức"

    document.getElementById("addRecipeModal").style.display = "block"
  }

  hideAddRecipeModal() {
    document.getElementById("addRecipeModal").style.display = "none"
  }

  handleAddRecipe(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const editId = e.target.getAttribute("data-edit-id")

    const recipe = {
      id: editId ? Number.parseInt(editId) : Date.now(),
      name: formData.get("name").trim(),
      category: formData.get("category"),
      difficulty: formData.get("difficulty"),
      time: Number.parseInt(formData.get("time")),
      servings: Number.parseInt(formData.get("servings")),
      description: formData.get("description").trim(),
      ingredients: formData
        .get("ingredients")
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item),
      instructions: formData
        .get("instructions")
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item),
      image:
        formData.get("image").trim() ||
        `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(formData.get("name"))} food dish`,
      tags: formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      author: "User",
      createdAt: editId
        ? this.recipes.find((r) => r.id === Number.parseInt(editId)).createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (editId) {
      // Update existing recipe
      const index = this.recipes.findIndex((r) => r.id === Number.parseInt(editId))
      if (index !== -1) {
        this.recipes[index] = recipe
      }
    } else {
      // Add new recipe
      this.recipes.unshift(recipe)
    }

    this.saveData()
    this.filterRecipes()
    this.hideAddRecipeModal()

    // Show success message
    alert(editId ? "Công thức đã được cập nhật!" : "Công thức mới đã được thêm!")
  }

  toggleViewMode() {
    const recipesGrid = document.getElementById("recipesGrid")
    const viewModeBtn = document.getElementById("viewModeBtn")

    if (this.currentView === "grid") {
      this.currentView = "list"
      recipesGrid.style.gridTemplateColumns = "1fr"
      viewModeBtn.textContent = "📋 Dạng lưới"
    } else {
      this.currentView = "grid"
      recipesGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))"
      viewModeBtn.textContent = "📋 Dạng danh sách"
    }
  }

  updateStats() {
    const totalRecipes = this.recipes.length
    const userRecipes = this.recipes.filter((recipe) => recipe.author === "User").length
    const favoriteRecipes = this.favorites.size
    const filteredRecipes = this.filteredRecipes.length || totalRecipes

    document.getElementById("totalRecipes").textContent = totalRecipes
    document.getElementById("userRecipes").textContent = userRecipes
    document.getElementById("favoriteRecipes").textContent = favoriteRecipes
    document.getElementById("filteredRecipes").textContent = filteredRecipes
  }
}

// Initialize recipe manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new RecipeManager()
})
