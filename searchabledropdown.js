class SearchableDropdown {
    constructor(selector, options = {}) {
        this.select = document.querySelector(selector);
        if (!this.select) return;

        this.options = options;
        this.createDropdown();
    }

    createDropdown() {
        // Hide the original select field
        this.select.style.display = "none";

        // Create a wrapper div
        const wrapper = document.createElement("div");
        wrapper.className = `relative w-full ${this.options.wrapperClass || ""}`;

        // Create the search input
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = this.options.placeholder || "Search...";
        input.className = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer ${this.options.inputClass || ""}`;
        input.readOnly = true; // Make input readonly to handle selection

        // Create the dropdown container
        const dropdown = document.createElement("div");
        dropdown.className = `absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg hidden max-h-60 overflow-auto ${this.options.dropdownClass || ""}`;

        // Populate dropdown with select options
        Array.from(this.select.options).forEach(option => {
            const item = document.createElement("div");
            item.textContent = option.text;
            item.className = `px-3 py-2 cursor-pointer hover:bg-gray-200 ${this.options.itemClass || ""}`;
            item.dataset.value = option.value;

            // Handle option selection
            item.addEventListener("click", () => {
                input.value = item.textContent;
                this.select.value = item.dataset.value;
                dropdown.classList.add("hidden");
            });

            dropdown.appendChild(item);
        });

        // Show/hide dropdown on click
        input.addEventListener("click", () => {
            dropdown.classList.toggle("hidden");
        });

        // Hide dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!wrapper.contains(e.target)) dropdown.classList.add("hidden");
        });

        // Append elements
        wrapper.appendChild(input);
        wrapper.appendChild(dropdown);
        this.select.parentNode.insertBefore(wrapper, this.select);
    }
}

// Usage function
window.makeSearchable = function(selector, options) {
    new SearchableDropdown(selector, options);
};
