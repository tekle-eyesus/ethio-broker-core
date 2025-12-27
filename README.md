# EthioBroker Core (Backend)

EthioBroker Core is the backend engine for a comprehensive Insurance Broker Management System (IBMS) tailored specifically for the Ethiopian insurance market. It addresses local operational realities including administrative hierarchies (Region, Zone, Wereda, Kebele), tax identification systems (TIN), and manual trust account financial flows.

This system is built using Node.js, Express, and MongoDB, following a modular Model-View-Controller (MVC) architecture. It provides a RESTful API to manage the entire insurance brokerage lifecycle, from client acquisition to claims processing and financial reconciliation.

## Table of Contents

1. [Key Features](#key-features)
2. [Technical Architecture](#technical-architecture)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Installation and Setup](#installation-and-setup)
6. [Environment Variables](#environment-variables)
7. [Project Structure](#project-structure)
8. [API Documentation](#api-documentation)
9. [Contact](#contact)

## Key Features

### 1. User & Role Management
*   **Authentication:** Secure registration and login using JWT (Access and Refresh tokens).
*   **Authorization:** Role-based access control (Admin, Broker, Agent).
*   **Security:** Password hashing via Bcrypt and protected route middleware.

### 2. Client Management (Localized)
*   **Customer Types:** Support for both Individual and Business entities.
*   **Ethiopian Addressing:** Dedicated fields for Region, Zone, Wereda, Kebele, and House Number.
*   **Identification:** Management of TIN numbers, Trade Licenses, and National/Kebele IDs.
*   **Document Management:** Upload functionality for KYC documents.
*   **Search:** Advanced filtering by Name, Phone, or TIN.

### 3. Policy Management
*   **Lifecycle Tracking:** Status automation (Active, Pending, Expired) based on coverage dates.
*   **Financials:** Automated calculation of Commission Amounts based on Premium and Commission Rates.
*   **Carrier Association:** Linking policies to specific Insurance Companies.
*   **Document Storage:** Attachment of Policy Schedules and Yellow Cards.

### 4. Claims Management
*   **Incident Tracking:** Recording dates, descriptions, and claimed amounts.
*   **Status Workflow:** Progression tracking (Reported -> In Review -> Approved -> Paid).
*   **Evidence:** Upload capabilities for Police Reports and damage photos.

### 5. Financial Management
*   **Ledger System:** Double-entry style transaction recording.
*   **Payment Tracking:** Monitor Client Payments (Cash, CPO, Transfer) and Carrier Remittances.
*   **Reconciliation:** Real-time generation of financial statements per policy (Client Balance vs. Carrier Balance).

## Technical Architecture

The project adheres to the Separation of Concerns principle:
*   **Models:** Define data structure and validation schema (Mongoose).
*   **Controllers:** Handle business logic and request processing.
*   **Routes:** Map HTTP endpoints to controller functions.
*   **Middlewares:** Handle authentication (JWT verification), file uploads (Multer), and error handling.
*   **Utils:** Standardized API response formatting and error wrapping.

## Technology Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Authentication:** JSON Web Token (JWT), Bcrypt
*   **File Handling:** Multer (Local storage configured for MVP)
*   **Utilities:** Cors, Dotenv, Cookie-parser

## Prerequisites

Ensure the following are installed on your machine:
*   Node.js (v16.0.0 or higher)
*   npm (Node Package Manager)
*   MongoDB (Local instance or Atlas URI)

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/ethio-broker-core.git
    cd ethio-broker-core
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory. See the [Environment Variables](#environment-variables) section below.

4.  **Run the application:**
    *   **Development Mode:**
        ```bash
        npm run dev
        ```
    *   **Production Mode:**
        ```bash
        npm start
        ```

5.  **Access the Server:**
    The server will start at `http://localhost:8000` (or your defined port).

## Environment Variables

Create a `.env` file in the root directory and configure the following:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | The port the server listens on | `8000` |
| `MONGODB_URI` | Connection string for MongoDB | `mongodb://localhost:27017/ethio-broker` |
| `CORS_ORIGIN` | Allowed frontend origin | `*` or `http://localhost:5173` |
| `ACCESS_TOKEN_SECRET` | Secret key for signing Access JWTs | `your-complex-secret-key` |
| `ACCESS_TOKEN_EXPIRY` | Lifespan of Access Token | `1d` |
| `REFRESH_TOKEN_SECRET` | Secret key for signing Refresh JWTs | `your-complex-refresh-secret` |
| `REFRESH_TOKEN_EXPIRY` | Lifespan of Refresh Token | `10d` |

## Project Structure

```text
ethio-broker-core/
├── public/
│   └── temp/            # Temporary storage for uploaded files
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Core business logic
│   ├── middlewares/     # Auth, Multer, Error handling
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoint definitions
│   ├── utils/           # Helper classes (ApiError, ApiResponse)
│   ├── app.js           # Express app setup
│   └── index.js         # Entry point
├── .env                 # Environment variables
├── .gitignore
└── package.json
```
## API Documentation

### Authentication
- **POST** `/api/v1/users/register` — Register a new user  
- **POST** `/api/v1/users/login` — Login and receive tokens  
- **POST** `/api/v1/users/logout` — Logout (requires authentication)

### Clients
- **POST** `/api/v1/clients` — Create a new client (Individual/Business)  
- **GET** `/api/v1/clients` — List clients (supports search and pagination)  
- **GET** `/api/v1/clients/:id` — Get client details  
- **PATCH** `/api/v1/clients/:id` — Update client details  
- **DELETE** `/api/v1/clients/:id` — Soft delete client  
- **POST** `/api/v1/clients/:id/documents` — Upload client documents  

### Carriers (Insurance Companies)
- **POST** `/api/v1/carriers` — Add a new insurance carrier  
- **GET** `/api/v1/carriers` — List active carriers  
- **PATCH** `/api/v1/carriers/:id` — Update carrier information  

### Policies
- **POST** `/api/v1/policies` — Create a new policy  
- **GET** `/api/v1/policies` — List policies (supports filters: `status`, `expiringSoon`)  
- **PATCH** `/api/v1/policies/:id` — Update policy (triggers financial recalculation)  
- **DELETE** `/api/v1/policies/:id` — Soft delete policy  

### Claims
- **POST** `/api/v1/claims` — Register a new claim  
- **GET** `/api/v1/claims` — List claims  
- **PATCH** `/api/v1/claims/:id` — Update claim status and amounts  
- **POST** `/api/v1/claims/:id/documents` — Upload claim evidence  

### Finance
- **POST** `/api/v1/finance/transactions` — Record payment (Client In / Carrier Out)  
- **GET** `/api/v1/finance/policy/:policyId` — Get financial statement for a specific policy  
- **GET** `/api/v1/finance/report` — Get general financial reports

## Contact

**Tekleeyesus Munye**  
[LinkedIn](https://www.linkedin.com/in/tekleeysus-munye) • [Twitter](https://twitter.com/TekleeyesusM)

