import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../core/services/product.service';

interface CategoryOption {
  label: string;
  value: string;
}

/**
 * ProductListingComponent displays all products in a responsive CSS grid.
 * Filtering is performed client-side; the full product list is fetched once on init.
 *
 * Data flow: ProductService.getProducts() → allProducts → filter by selectedCategory
 * → filteredProducts → rendered in the grid template.
 */
@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [FormsModule, CardModule, DropdownModule, TagModule],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.scss',
})
export class ProductListingComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory = '';

  readonly categories: CategoryOption[] = [
    { label: 'All Categories', value: '' },
    { label: 'Floral',         value: 'Floral' },
    { label: 'Woody',          value: 'Woody' },
    { label: 'Citrus',         value: 'Citrus' },
    { label: 'Oriental',       value: 'Oriental' },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.allProducts     = products;
      this.filteredProducts = products;
    });
  }

  onCategoryChange(): void {
    this.filteredProducts = this.selectedCategory
      ? this.allProducts.filter((p) => p.category === this.selectedCategory)
      : [...this.allProducts];
  }
}
