/**
 * TailwindSearchableDropdown.js
 * A lightweight searchable dropdown library using Tailwind CSS
 * Version 1.1.0
 */

(function(global) {
  'use strict';
  
  /**
   * TailwindSearchableDropdown constructor
   * @param {HTMLElement|string} element - The element or selector to initialize on
   * @param {Object} options - Configuration options
   */
  function TailwindSearchableDropdown(element, options) {
    // Normalize element parameter
    this.element = typeof element === 'string' ? 
      document.querySelector(element) : element;
    
    if (!this.element) {
      console.error('TailwindSearchableDropdown: No element found');
      return;
    }
    
    // Base classes that must be included for functionality
    this.baseClasses = {
      container: 'relative',
      selectedItem: 'flex items-center justify-between cursor-pointer',
      dropdown: 'absolute z-10',
      searchInput: 'w-full',
      optionsContainer: 'overflow-y-auto',
      option: 'cursor-pointer',
      selectedOption: 'cursor-pointer',
      noResults: '',
      chevronIcon: ''
    };
    
    // Default options
    this.options = Object.assign({
      placeholder: 'Select an option',
      searchPlaceholder: 'Search...',
      noResultsText: 'No results found',
      onChange: null,
      data: [],
      // Default Tailwind classes
      classes: {
        container: 'w-full max-w-xs',
        selectedItem: 'w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
        dropdown: 'w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg',
        searchInput: 'px-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
        optionsContainer: 'max-h-60 py-1',
        option: 'px-3 py-2 text-sm hover:bg-gray-100',
        selectedOption: 'px-3 py-2 text-sm bg-blue-100',
        noResults: 'px-3 py-2 text-sm text-gray-500',
        chevronIcon: 'w-5 h-5 text-gray-400'
      }
    }, options);
    
    // Initialize the dropdown
    this.init();
  }
  
  // Initialize the dropdown
  TailwindSearchableDropdown.prototype.init = function() {
    // Create container if needed
    if (!this.element.classList.contains('tsd-container')) {
      const container = document.createElement('div');
      container.className = 'tsd-container ' + this.getCombinedClass('container');
      this.element.parentNode.insertBefore(container, this.element);
      container.appendChild(this.element);
      this.container = container;
    } else {
      this.container = this.element;
      this.element = null; // No need to keep reference to original element
    }
    
    // Create the necessary DOM structure
    this.render();
    
    // Add event listeners
    this.addEventListeners();
  };
  
  // Helper method to combine base classes with custom classes
  TailwindSearchableDropdown.prototype.getCombinedClass = function(key) {
    return this.baseClasses[key] + ' ' + this.options.classes[key];
  };
  
  // Render the dropdown
  TailwindSearchableDropdown.prototype.render = function() {
    // Clear container first
    this.container.innerHTML = '';
    
    // Create selected item display
    this.selectedEl = document.createElement('div');
    this.selectedEl.className = 'tsd-selected ' + this.getCombinedClass('selectedItem');
    
    // Create the selected text span
    this.selectedTextEl = document.createElement('span');
    this.selectedTextEl.textContent = this.options.placeholder;
    this.selectedEl.appendChild(this.selectedTextEl);
    
    // Create the chevron icon
    const chevronSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevronSvg.setAttribute('class', this.getCombinedClass('chevronIcon'));
    chevronSvg.setAttribute('viewBox', '0 0 20 20');
    chevronSvg.setAttribute('fill', 'currentColor');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z');
    path.setAttribute('clip-rule', 'evenodd');
    
    chevronSvg.appendChild(path);
    this.selectedEl.appendChild(chevronSvg);
    this.container.appendChild(this.selectedEl);
    
    // Create dropdown
    this.dropdownEl = document.createElement('div');
    this.dropdownEl.className = 'tsd-dropdown ' + this.getCombinedClass('dropdown');
    this.dropdownEl.style.display = 'none';
    this.container.appendChild(this.dropdownEl);
    
    // Create search input
    this.searchEl = document.createElement('input');
    this.searchEl.type = 'text';
    this.searchEl.className = 'tsd-search ' + this.getCombinedClass('searchInput');
    this.searchEl.placeholder = this.options.searchPlaceholder;
    this.dropdownEl.appendChild(this.searchEl);
    
    // Create options container
    this.optionsContainer = document.createElement('div');
    this.optionsContainer.className = 'tsd-options-container ' + this.getCombinedClass('optionsContainer');
    this.dropdownEl.appendChild(this.optionsContainer);
    
    // Populate options
    this.renderOptions();
  };
  
  // Render the options
  TailwindSearchableDropdown.prototype.renderOptions = function() {
    this.optionsContainer.innerHTML = '';
    
    if (this.options.data.length === 0) {
      const noOption = document.createElement('div');
      noOption.className = 'tsd-option tsd-no-results ' + this.getCombinedClass('noResults');
      noOption.textContent = this.options.noResultsText;
      this.optionsContainer.appendChild(noOption);
      return;
    }
    
    this.options.data.forEach(item => {
      const option = document.createElement('div');
      option.className = 'tsd-option ' + this.getCombinedClass('option');
      option.setAttribute('data-value', item.value);
      option.textContent = item.label;
      this.optionsContainer.appendChild(option);
    });
  };
  
  // Filter options based on search term
  TailwindSearchableDropdown.prototype.filterOptions = function(searchTerm) {
    const options = this.optionsContainer.querySelectorAll('.tsd-option:not(.tsd-no-results)');
    let hasResults = false;
    
    options.forEach(option => {
      const text = option.textContent.toLowerCase();
      const isVisible = text.includes(searchTerm.toLowerCase());
      option.style.display = isVisible ? 'block' : 'none';
      if (isVisible) hasResults = true;
    });
    
    // Show or hide "no results" message
    let noResults = this.optionsContainer.querySelector('.tsd-no-results');
    
    if (!hasResults) {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.className = 'tsd-option tsd-no-results ' + this.getCombinedClass('noResults');
        noResults.textContent = this.options.noResultsText;
        this.optionsContainer.appendChild(noResults);
      } else {
        noResults.style.display = 'block';
      }
    } else if (noResults) {
      noResults.style.display = 'none';
    }
  };
  
  // Add event listeners
  TailwindSearchableDropdown.prototype.addEventListeners = function() {
    // Toggle dropdown when clicking on the selected item
    this.selectedEl.addEventListener('click', e => {
      this.toggle();
      e.stopPropagation();
    });
    
    // Handle search input
    this.searchEl.addEventListener('input', e => {
      this.filterOptions(e.target.value);
    });
    
    // Prevent search input clicks from closing the dropdown
    this.searchEl.addEventListener('click', e => {
      e.stopPropagation();
    });
    
    // Handle option selection
    this.optionsContainer.addEventListener('click', e => {
      const option = e.target.closest('.tsd-option:not(.tsd-no-results)');
      if (option) {
        this.select(option.getAttribute('data-value'), option.textContent);
        e.stopPropagation();
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      this.close();
    });
  };
  
  // Toggle dropdown visibility
  TailwindSearchableDropdown.prototype.toggle = function() {
    if (this.dropdownEl.style.display === 'block') {
      this.close();
    } else {
      this.open();
    }
  };
  
  // Open the dropdown
  TailwindSearchableDropdown.prototype.open = function() {
    // Close all other dropdowns first
    document.querySelectorAll('.tsd-dropdown').forEach(dropdown => {
      if (dropdown !== this.dropdownEl) {
        dropdown.style.display = 'none';
      }
    });
    
    this.dropdownEl.style.display = 'block';
    this.searchEl.focus();
    this.searchEl.value = '';
    this.filterOptions('');
  };
  
  // Close the dropdown
  TailwindSearchableDropdown.prototype.close = function() {
    this.dropdownEl.style.display = 'none';
    this.searchEl.value = '';
    this.filterOptions('');
  };
  
  // Select an option
  TailwindSearchableDropdown.prototype.select = function(value, label) {
    this.selectedTextEl.textContent = label;
    this.selectedEl.setAttribute('data-value', value);
    
    // Update option styling
    const options = this.optionsContainer.querySelectorAll('.tsd-option:not(.tsd-no-results)');
    options.forEach(option => {
      if (option.getAttribute('data-value') === value) {
        option.className = 'tsd-option tsd-option-selected ' + this.getCombinedClass('selectedOption');
      } else {
        option.className = 'tsd-option ' + this.getCombinedClass('option');
      }
    });
    
    this.close();
    
    // Call onChange callback if provided
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(value, label);
    }
  };
  
  // Set new data
  TailwindSearchableDropdown.prototype.setData = function(data) {
    this.options.data = data;
    this.renderOptions();
  };
  
  // Get selected value
  TailwindSearchableDropdown.prototype.getValue = function() {
    return this.selectedEl.getAttribute('data-value');
  };
  
  // Get selected label
  TailwindSearchableDropdown.prototype.getLabel = function() {
    return this.selectedTextEl.textContent;
  };
  
  // Update styles without losing functionality
  TailwindSearchableDropdown.prototype.updateStyles = function(styleClasses) {
    // Update style classes
    this.options.classes = Object.assign({}, this.options.classes, styleClasses);
    
    // Re-render with new styles
    this.render();
    
    // Reattach event listeners
    this.addEventListeners();
  };
  
  // Expose the constructor to window
  global.TailwindSearchableDropdown = TailwindSearchableDropdown;
  
})(typeof window !== 'undefined' ? window : this);
