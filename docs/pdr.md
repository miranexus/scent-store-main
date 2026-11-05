### **Product Requirements Document: ScentStore Training Project**

Problem Statement  
Current training projects often lack a realistic end-to-end integration between a modern frontend framework and a lightweight backend. This project solves the "knowledge gap" for developers learning to build a fully functional e-commerce interface that consumes real API data, specifically for a high-visual product category like perfumes where presentation (carousels, images) is critical.

User Personas

* The Trainee Developer: A learner aiming to master the integration of Angular (Frontend) with PHP (Backend) and understand state management for product listings.  
* The End Customer (Simulated): A user browsing for fragrances who expects a responsive, visually appealing interface with smooth product navigation via carousels.

Core Features

1. Dynamic Product Carousel: Implementation of a PrimeNG carousel to showcase "Featured Perfumes" and "Special Offers" with auto-rotation and navigation controls.  
2. Product Listing API Integration: A PHP backend endpoint (GET /api/products) that returns a JSON array of perfume data (name, price, image URL, description) consumed by the Angular frontend.  
3. Responsive Product Grid: A secondary view displaying all available perfumes in a grid layout using PrimeNG cards, ensuring mobile responsiveness.  
4. Basic Filtering: Ability to filter the product list by category (e.g., "Floral", "Woody", "Citrus") on the frontend.

Out of Scope

* User Authentication: No login, registration, or "My Account" features.  
* Shopping Cart & Checkout: No payment gateway integration, cart persistence, or order processing logic.  
* Admin Dashboard: No backend CMS for adding/editing products; data will be static or manually seeded in the PHP script.  
* Real-time Inventory: Stock levels will be simulated; no real-time database locking.

Success Criteria

* Functional Integration: The Angular app successfully fetches and renders data from the PHP backend without CORS errors.  
* UI Responsiveness: The PrimeNG carousel and grid adapt seamlessly to mobile, tablet, and desktop viewports.  
* Code Quality: The project structure separates concerns (Services, Components, Controllers) and includes comments explaining the data flow.  
* Performance: Initial page load and carousel transition times are under 2 seconds on a standard connection.

Constraints

* Technology Stack: Frontend must be Angular (latest stable version) using PrimeNG components. Backend must be PHP (no frameworks like Laravel required for this scope).  
* Data Source: Database is limited to a simple MySQL table or a static JSON file served by PHP; no complex ORM required.  
* Timeline: Designed as a 2-4 week training sprint; complexity is capped to ensure completion.  
* Limitations: No server-side rendering (SSR) or advanced caching strategies.

