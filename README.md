# Amazon Scout

A React-based search interface with real Amazon product data integration.

## What it does

This is a full-stack search application that connects to an Amazon Product Search backend API. Users can search for real Amazon products using text input, and the application displays live product data in grid or list views with detailed product information.

## Technical Overview

### Core Functionality
- Real Amazon product search via backend API
- Product listing with grid/list view toggle
- Direct external links to Amazon product pages
- Automatic backend health checks to prevent cold starts
- Loading states with skeleton loaders
- Error handling with retry functionality
- Empty state handling for no results

### UI Components
- Animated gradient text for the main "Search" title
- Search input with focus glow effects
- Camera button for image uploads
- Product cards with images, ratings, and pricing
- Sleek image placeholder with modern icon for failed/missing images
- External link buttons to Amazon product pages
- Backend health status indicator with retry functionality

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env.local` file in the project root:
```bash
VITE_API_BASE_URL=https://quadrant-09-16-backend-74810133137.us-west1.run.app
```

3. **Start development server:**
```bash
npm run dev
```

Runs on `http://localhost:5173`

## Environment Configuration

The application uses the `VITE_API_BASE_URL` environment variable to connect to the backend API. This allows you to:
- Switch between different environments (development, staging, production)
- Test with different backend endpoints
- Deploy to different environments without code changes

Default backend URL: `https://quadrant-09-16-backend-74810133137.us-west1.run.app`

## Tech Stack

- React 18 + TypeScript
- Vite build tool
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching
- shadcn/ui component library
- Lucide React icons
- Amazon Product Search API integration

## File Structure

```
src/
├── pages/
│   ├── Index.tsx          # Home page with search input
│   └── SearchResults.tsx  # Product listing with external links
├── hooks/
│   └── use-health-check.ts # Custom hook for backend health monitoring
├── components/ui/         # Reusable UI components
└── App.tsx               # Main app with routing
```

## Implementation Details

### Background Animation
The home page uses CSS keyframes to create floating gradient orbs:
- `float`: Translates elements in organic patterns
- `pulse-glow`: Opacity and scale pulsing
- `rotate-gradient`: Continuous rotation for depth

### Search System
- Text search filters mock product array by name/category
- Image upload uses hidden file input with camera icon trigger
- Search suggestions are hardcoded array of popular terms

### Mock Data
Product data is stored as JavaScript objects in SearchResults.tsx:
- 6 sample products with images from Unsplash
- Categories: Electronics, Wearables, Computers, Photography, Furniture, Gaming
- Each product has name, price, rating, category, and image URL

### State Management
- Local React state for search queries and UI interactions
- Custom hooks for reusable logic (health checks, mobile detection)
- No external state management library
- URL parameters used for search query persistence

### Backend Health Monitoring
- Automatic health checks on page load to prevent cold starts
- Visual status indicator showing backend connectivity
- Retry functionality for failed health checks
- Console logging for debugging backend issues

## Current Limitations

- No backend integration (all data is mock)
- Image upload only logs to console
- No actual e-commerce functionality (cart, payments, etc.)
- Products redirect to external Amazon pages only

## Backend Integration (PRD)

- See the integration plan: [PRD.txt](mdc:.taskmaster/docs/PRD.txt)
- Configure backend base URL via environment:

```bash
echo "VITE_API_BASE_URL=https://quadrant-09-16-backend-74810133137.us-west1.run.app" > .env.local
```

### Example request (axios)

```js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

async function demoSearch() {
  const res = await axios.post(`${baseURL}/v1/search`, {
    message: 'Monitor with 144hz refresh rate'
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
  console.log(res.data);
}

demoSearch().catch(console.error);
```

## Data Normalization & UI Behavior

### Product normalization (frontend)
- **ID selection**: prefer backend `id`; else extract ASIN from `url` (`/dp/<ASIN>`); else generate a UUID fallback.
- **Name**: defaults to "Unknown product" if blank.
- **Price/Description**: blank values normalize to empty strings. The UI shows `—` when price is empty.
- **Image**:
  - If `image_url` is blank, no fallback URL is set (empty string).
  - The UI uses a sleek `ImagePlaceholder` component with a modern image icon for missing/failed images.
  - Smooth loading states with opacity transitions for better UX.
- **Rating**: parsed as a number and clamped to `[0, max_rating]` where `max_rating` defaults to `5` when missing.
- **Reviews**: `review_count` is parsed after removing commas; invalid/missing values become `0`.
- **Stock**: `availability` is mapped to `inStock` when it contains `"in stock"` (case-insensitive).
- **Source link**: `specifications.sourceUrl` is set from backend `url` (when present). The UI renders a "View on Amazon" button that opens in a new tab.

Source: `src/lib/transformers.ts` and `src/pages/SearchResults.tsx`.

### Prefiltering (dropping unusable items)
- Drop items with neither `id` nor `url`.
- Drop items that have no `url` and all of `name`, `image_url`, and `price` are blank.

Source: `transformProducts(...)` in `src/lib/transformers.ts`.

### Backend info banner
- The backend may return an informational message in `response`.
- When non-empty (after `trim()`), it is shown above the results in a blue info box; otherwise it is hidden.
- Example payload: see `.taskmaster/docs/search_response.json` (`response` plus `products`).

Source: `SearchResults.tsx` (`infoMessage = (searchData?.response || '').trim()`).

