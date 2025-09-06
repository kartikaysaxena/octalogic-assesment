# Vehicle Rental Booking System

A full-stack vehicle rental booking system built with Bun, Drizzle ORM, SQLite, React, and Material UI.

## 🛠 Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Hono (Lightweight web framework)
- **Database**: SQLite with Drizzle ORM
- **Validation**: Zod

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material UI (MUI)
- **Styling**: Tailwind CSS
- **Date Handling**: Day.js with MUI Date Pickers
- **HTTP Client**: Axios
- **Build Tool**: Vite

## 🚀 Features

- **Multi-step Form Interface**: One question per screen with validation
- **Dynamic Data Loading**: Vehicle types and models fetched from database
- **Booking Validation**: Prevents overlapping bookings for the same vehicle
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Availability**: Check vehicle availability for selected dates
- **Cost Calculation**: Automatic price calculation based on duration

## 📁 Project Structure

```
vehicle-rental-system/
├── README.md
├── package.json              # Backend dependencies
├── drizzle.config.ts         # Drizzle configuration
├── sqlite.db                 # SQLite database (generated)
├── src/
│   ├── index.ts             # Main server file
│   ├── db/
│   │   ├── index.ts         # Database connection
│   │   ├── schema.ts        # Database schema
│   │   ├── migrate.ts       # Migration script
│   │   └── seed.ts          # Database seeding script
│   ├── services/
│   │   └── bookingService.ts
│   └── validation/
│       └── schemas.ts       # Zod validation schemas
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── types/
        │   └── index.ts
        ├── services/
        │   └── api.ts
        └── components/
            └── BookingForm.tsx
```

## 🏗 Setup Instructions

### Prerequisites
- [Bun](https://bun.sh) installed on your system
- Node.js (for frontend dependencies)

### Backend Setup

1. **Clone and setup backend**:
```bash
# Install backend dependencies
bun install

# Generate database migrations
bun run db:generate

# Run migrations to create tables
bun run db:migrate

# Seed the database with initial data
bun run db:seed

# Start the development server
bun run dev
```

The backend server will start on `http://localhost:8000`

### Frontend Setup

2. **Setup frontend**:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🗄 Database Schema

### Vehicle Types
- `id`: Primary key
- `name`: Vehicle type name (Hatchback, SUV, Sedan, Cruiser)
- `wheels`: Number of wheels (2 or 4)

### Vehicles
- `id`: Primary key
- `name`: Vehicle name
- `typeId`: Foreign key to vehicle_types
- `model`: Vehicle model
- `year`: Manufacturing year
- `pricePerDay`: Daily rental price

### Bookings
- `id`: Primary key
- `firstName`: Customer first name
- `lastName`: Customer last name
- `vehicleId`: Foreign key to vehicles
- `startDate`: Booking start date
- `endDate`: Booking end date
- `totalPrice`: Calculated total price
- `status`: Booking status

## 🔧 API Endpoints

- `GET /api/vehicle-types/:wheels` - Get vehicle types by wheel count
- `GET /api/vehicles/type/:typeId` - Get vehicles by type
- `POST /api/vehicles/:vehicleId/availability` - Check vehicle availability
- `POST /api/bookings` - Create new booking
- `GET /api/health` - Health check

## 💾 Database Commands

```bash
# Generate new migration
bun run db:generate

# Apply migrations
bun run db:migrate

# Seed database with sample data
bun run db:seed

# Open Drizzle Studio (Database viewer)
bun run db:studio
```

## 🧪 Testing the Application

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Navigate through the form**:
   - Enter your name
   - Select 2 wheels (bikes) or 4 wheels (cars)
   - Choose vehicle type (Hatchback, SUV, Sedan, or Cruiser)
   - Select specific vehicle model
   - Pick your rental dates
   - Confirm booking

## 📝 Sample Data

The system comes pre-seeded with:

### Car Types & Vehicles:
- **Hatchback**: Honda Jazz, Maruti Swift, Hyundai i20
- **SUV**: Hyundai Creta, Tata Harrier, Mahindra XUV700
- **Sedan**: Honda City, Maruti Ciaz, Hyundai Verna

### Bike Types & Vehicles:
- **Cruiser**: Royal Enfield Classic 350, Harley Davidson Street 750, Indian Scout Bobber

## 🔒 Validation & Business Logic

- **Form Validation**: Each step must be completed before proceeding
- **Date Validation**: Start date must be today or future, end date must be after start date
- **Availability Check**: System prevents double-booking of vehicles
- **Price Calculation**: Automatic calculation based on duration and daily rates

## 🚀 Production Deployment

### Backend
```bash
bun run build
bun run start
```

### Frontend
```bash
npm run build
# Serve the dist folder with your preferred web server
```

## 📋 Environment Variables

Create a `.env` file in the root directory:
```env
PORT=8000
DATABASE_URL=./sqlite.db
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
```