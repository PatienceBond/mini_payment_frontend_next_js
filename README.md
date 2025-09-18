# Mini Payment Gateway UI

A modern, responsive Next.js frontend application for processing payments and managing transactions. Built with HeroUI components, TailwindCSS, and TypeScript.

## Features

- 🎨 **Modern UI**: Clean and intuitive interface built with HeroUI components
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Mobile-first approach with responsive layouts
- 💳 **Payment Processing**: Secure payment form with validation
- 🔍 **Transaction Lookup**: Search and view transaction details
- 📊 **Transaction History**: Paginated table view of all transactions
- ⚡ **Real-time Updates**: Instant feedback with toast notifications
- 🎭 **Smooth Animations**: Framer Motion animations for better UX
- 🛡️ **Error Handling**: Comprehensive error boundaries and loading states

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: HeroUI
- **Styling**: TailwindCSS
- **Forms**: React Hook Form + Yup validation
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mini-payment-gateway-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   └── transactions/       # Transaction API endpoints
│   ├── components/             # React components
│   │   ├── error-boundary.tsx  # Error boundary component
│   │   ├── loading-spinner.tsx # Loading spinner component
│   │   ├── navigation.tsx      # Navigation bar
│   │   ├── payment-form.tsx    # Payment form component
│   │   ├── result-card.tsx     # Transaction result display
│   │   ├── transaction-lookup.tsx # Transaction lookup form
│   │   └── transaction-table.tsx  # Transaction history table
│   ├── providers/              # Context providers
│   │   └── theme-provider.tsx  # Theme management
│   ├── transactions/           # Transactions page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── lib/
│   ├── api.ts                 # API client configuration
│   ├── hooks/                 # Custom hooks
│   │   ├── use-entity.ts      # Generic entity CRUD hooks
│   │   └── use-payment.ts     # Payment-specific hooks
│   └── store/                 # State management
│       └── payment-store.ts   # Payment state store
└── public/                    # Static assets
```

## API Integration

The application integrates with a backend API running on `http://localhost:5000` with the following endpoints:

- `POST /api/payments` - Create a new payment
- `GET /api/payments/{id}` - Get transaction by ID
- `GET /api/payments` - Get all transactions

## Components

### PaymentForm
- Card number, expiry, CVV, amount, and currency fields
- Form validation using Yup schema
- Demo data button for testing
- Real-time form validation feedback

### TransactionLookup
- Search transactions by ID
- Display transaction details in a formatted card
- Error handling for not found transactions

### TransactionTable
- Paginated table view of all transactions
- Status-based color coding
- Responsive design for mobile devices
- Refresh functionality

### ResultCard
- Display transaction results
- Copy transaction ID functionality
- Status indicators with appropriate colors

## Features in Detail

### Dark Mode
- System preference detection
- Manual toggle in navigation
- Persistent theme selection
- Smooth transitions between themes

### Form Validation
- Real-time validation feedback
- Comprehensive error messages
- Card number format validation
- Date validation for expiry fields

### Demo Data
- Pre-filled test card number: `4111111111111112`
- Even last digit for successful transactions
- Quick testing without manual data entry

### Error Handling
- Global error boundaries
- API error handling with user-friendly messages
- Loading states for all async operations
- Toast notifications for user feedback

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent component structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.