# SILKWAVES

Luxury ecommerce customer website frontend for selling sarees.

## Folder Structure

```text
silkwaves/
  index.html
  package.json
  src/
    App.jsx
    main.jsx
    components/
      category/CategoryCard.jsx
      layout/Footer.jsx
      layout/Layout.jsx
      layout/Navbar.jsx
      product/ProductCard.jsx
      product/ProductGrid.jsx
      ui/Button.jsx
    data/products.json
    hooks/useProducts.js
    pages/Collections.jsx
    pages/Home.jsx
    pages/NotFound.jsx
    pages/ProductDetail.jsx
    services/productService.js
    styles/global.css
    utils/currency.js
```

## Routing

- `/` renders the home page.
- `/collections` renders the product grid with category filters and price sorting.
- `/product/:slug` renders one reusable dynamic product detail page for every product.

## Product API Contract

The UI reads data through `src/services/productService.js`. Set `VITE_API_BASE_URL` to enable real API calls:

- `GET /products`
- `GET /products/:id`

Without an API URL, the storefront uses `src/data/products.json` as a local development fallback.

## Sample Product JSON

```json
{
  "id": 1,
  "title": "Pink Silk Saree",
  "price": 6999,
  "category": "Type 1",
  "description": "Pure handwoven silk saree",
  "images": [],
  "slug": "pink-silk-saree"
}
```

## Run Locally

```powershell
cd .\silkwaves
npm install
npm run dev
```

If PowerShell blocks `npm.ps1`, use:

```powershell
npm.cmd install
npm.cmd run dev
```
update for private