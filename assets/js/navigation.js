// Mobile navigation functionality
class NavigationManager {
  constructor() {
    this.init()
  }

  init() {
    this.createMobileMenu()
    this.setupEventListeners()
    this.handleResize()
  }

  createMobileMenu() {
    // Add mobile menu button to all navigation bars
    const navContainers = document.querySelectorAll(".nav-container")

    navContainers.forEach((container) => {
      // Create mobile menu button
      const mobileMenuBtn = document.createElement("button")
      mobileMenuBtn.className = "mobile-menu-btn"
      mobileMenuBtn.innerHTML = `
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            `

      // Create mobile menu overlay
      const mobileMenu = document.createElement("div")
      mobileMenu.className = "mobile-menu"

      const navMenu = container.querySelector(".nav-menu")
      const navPhone = container.querySelector(".nav-phone")

      if (navMenu) {
        const mobileMenuContent = document.createElement("div")
        mobileMenuContent.className = "mobile-menu-content"

        // Clone navigation items
        const mobileNavList = navMenu.cloneNode(true)
        mobileNavList.className = "mobile-nav-list"

        // Add phone number if exists
        if (navPhone) {
          const phoneDiv = document.createElement("div")
          phoneDiv.className = "mobile-phone"
          phoneDiv.innerHTML = navPhone.innerHTML
          mobileMenuContent.appendChild(phoneDiv)
        }

        mobileMenuContent.appendChild(mobileNavList)

        // Add social links
        const socialSection = document.createElement("div")
        socialSection.className = "mobile-social"
        socialSection.innerHTML = `
                    <h4>Theo dõi chúng tôi</h4>
                    <div class="mobile-social-links">
                        <a href="#" class="mobile-social-link">📘 Facebook</a>
                        <a href="#" class="mobile-social-link">📷 Instagram</a>
                        <a href="#" class="mobile-social-link">📺 YouTube</a>
                    </div>
                `

        mobileMenuContent.appendChild(socialSection)
        mobileMenu.appendChild(mobileMenuContent)

        // Insert mobile menu button and overlay
        container.appendChild(mobileMenuBtn)
        document.body.appendChild(mobileMenu)
      }
    })
  }

  setupEventListeners() {
    // Mobile menu toggle
    document.querySelectorAll(".mobile-menu-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.toggleMobileMenu())
    })

    // Close mobile menu when clicking outside
    document.querySelectorAll(".mobile-menu").forEach((menu) => {
      menu.addEventListener("click", (e) => {
        if (e.target === menu) {
          this.closeMobileMenu()
        }
      })
    })

    // Close mobile menu when clicking nav links
    document.querySelectorAll(".mobile-nav-list a").forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu()
      })
    })

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize())

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })

    // Active navigation highlighting
    this.highlightActiveNav()
    window.addEventListener("scroll", () => this.highlightActiveNav())
  }

  toggleMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu")
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")

    if (mobileMenu && mobileMenuBtn) {
      const isOpen = mobileMenu.classList.contains("active")

      if (isOpen) {
        this.closeMobileMenu()
      } else {
        this.openMobileMenu()
      }
    }
  }

  openMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu")
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")

    if (mobileMenu && mobileMenuBtn) {
      mobileMenu.classList.add("active")
      mobileMenuBtn.classList.add("active")
      document.body.style.overflow = "hidden"
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu")
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")

    if (mobileMenu && mobileMenuBtn) {
      mobileMenu.classList.remove("active")
      mobileMenuBtn.classList.remove("active")
      document.body.style.overflow = ""
    }
  }

  handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
      this.closeMobileMenu()
    }
  }

  highlightActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    const navLinks = document.querySelectorAll(".nav-link")

    navLinks.forEach((link) => {
      const href = link.getAttribute("href")
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })
  }
}

// Utility functions for enhanced user experience
class UIEnhancements {
  constructor() {
    this.init()
  }

  init() {
    this.addScrollToTop()
    this.addLoadingStates()
    this.addTooltips()
    this.addKeyboardNavigation()
  }

  addScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement("button")
    scrollBtn.className = "scroll-to-top"
    scrollBtn.innerHTML = "↑"
    scrollBtn.setAttribute("aria-label", "Cuộn lên đầu trang")
    document.body.appendChild(scrollBtn)

    // Show/hide scroll button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add("visible")
      } else {
        scrollBtn.classList.remove("visible")
      }
    })

    // Scroll to top functionality
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  addLoadingStates() {
    // Add loading states to buttons
    document.addEventListener("click", (e) => {
      if (e.target.matches("button[type='submit'], .btn-primary")) {
        const button = e.target
        const originalText = button.textContent

        // Don't add loading if already loading
        if (button.classList.contains("loading")) return

        button.classList.add("loading")
        button.disabled = true
        button.textContent = "Đang xử lý..."

        // Remove loading state after 2 seconds (adjust as needed)
        setTimeout(() => {
          button.classList.remove("loading")
          button.disabled = false
          button.textContent = originalText
        }, 2000)
      }
    })
  }

  addTooltips() {
    // Add tooltips to elements with title attribute
    document.querySelectorAll("[title]").forEach((element) => {
      element.addEventListener("mouseenter", (e) => {
        const tooltip = document.createElement("div")
        tooltip.className = "tooltip"
        tooltip.textContent = e.target.getAttribute("title")
        document.body.appendChild(tooltip)

        const rect = e.target.getBoundingClientRect()
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"

        // Remove title to prevent default tooltip
        e.target.setAttribute("data-title", e.target.getAttribute("title"))
        e.target.removeAttribute("title")
      })

      element.addEventListener("mouseleave", (e) => {
        const tooltip = document.querySelector(".tooltip")
        if (tooltip) {
          tooltip.remove()
        }

        // Restore title
        if (e.target.getAttribute("data-title")) {
          e.target.setAttribute("title", e.target.getAttribute("data-title"))
          e.target.removeAttribute("data-title")
        }
      })
    })
  }

  addKeyboardNavigation() {
    // Enhanced keyboard navigation
    document.addEventListener("keydown", (e) => {
      // Close modals with Escape key
      if (e.key === "Escape") {
        const openModal = document.querySelector(".modal[style*='block']")
        if (openModal) {
          openModal.style.display = "none"
        }

        // Close mobile menu
        const mobileMenu = document.querySelector(".mobile-menu.active")
        if (mobileMenu) {
          new NavigationManager().closeMobileMenu()
        }
      }

      // Navigate with arrow keys in recipe grid
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const focusedCard = document.activeElement
        if (focusedCard && focusedCard.classList.contains("recipe-card")) {
          const cards = Array.from(document.querySelectorAll(".recipe-card"))
          const currentIndex = cards.indexOf(focusedCard)

          let nextIndex
          if (e.key === "ArrowLeft") {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1
          } else {
            nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0
          }

          cards[nextIndex].focus()
          e.preventDefault()
        }
      }
    })

    // Make recipe cards focusable
    document.querySelectorAll(".recipe-card").forEach((card) => {
      card.setAttribute("tabindex", "0")
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          card.click()
          e.preventDefault()
        }
      })
    })
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new NavigationManager()
  new UIEnhancements()
})

// Performance optimization
class PerformanceOptimizer {
  constructor() {
    this.init()
  }

  init() {
    this.lazyLoadImages()
    this.optimizeAnimations()
  }

  lazyLoadImages() {
    // Lazy loading for images
    const images = document.querySelectorAll("img[data-src]")

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute("data-src")
          observer.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  optimizeAnimations() {
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.style.setProperty("--animation-duration", "0.01ms")
    }
  }
}

// Initialize performance optimizations
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new PerformanceOptimizer())
} else {
  new PerformanceOptimizer()
}
