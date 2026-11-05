import { Component } from '@angular/core';
import { ProductCarouselComponent } from './features/carousel/carousel.component';
import { ProductListingComponent } from './features/product-listing/product-listing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductCarouselComponent, ProductListingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
