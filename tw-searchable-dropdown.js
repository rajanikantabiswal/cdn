class SearchableDropdown {
    constructor(selector, options = {}) {
        this.select = document.querySelector(selector);
        if (!this.select) return;

        this.options = options;
        this.init();
    }

    init() {
        // Hide the original select field
        this.select.style.display = "none";

        // Create wrapper
        const wrapper = document.createElement("div");
        wrapper.className = `relative w-full ${this.options.wrapperClass || ''}`;
        
        // Create input field
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = this.options.placeholder || "Search...";
        input.className = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${this.options.inputClass || ''}`;
        
        // Create dropdown list
        const dropdown = document.createElement("div");
        dropdown.className = `absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg hidden ${this.options.dropdownClass || ''}`;
        
        // Populate dropdown with options
        Array.from(this.select.options).forEach(option => {
            const item = document.createElement("div");
            item.textContent = option.text;
            item.className = `px-3 py-2 cursor-pointer hover:bg-gray-200 ${this.options.itemClass || ''}`;
            item.dataset.value = option.value;
            item.addEventListener("click", () => {
                input.value = item.textContent;
                this.select.value = item.dataset.value;
                dropdown.classList.add("hidden");
            });
            dropdown.appendChild(item);
        });

        // Search functionality
        input.addEventListener("input", () => {
            const searchText = input.value.toLowerCase();
            Array.from(dropdown.children).forEach(item => {
                item.style.display = item.textContent.toLowerCase().includes(searchText) ? "block" : "none";
            });
            dropdown.classList.remove("hidden");
        });

        // Hide dropdown on outside click
        document.addEventListener("click", (e) => {
            if (!wrapper.contains(e.target)) dropdown.classList.add("hidden");
        });

        // Append elements
        wrapper.appendChild(input);
        wrapper.appendChild(dropdown);
        this.select.parentNode.insertBefore(wrapper, this.select);
    }
}

// Usage: Convert a select field by class or ID
window.makeSearchable = function(selector, options) {
    new SearchableDropdown(selector, options);
};
