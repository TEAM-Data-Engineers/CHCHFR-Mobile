# CHCH-Fuel-Recommendator-Mobile-End

## Description

The CHCH-Fuel-Recommendator is a mobile application developed as part of the Data 472 Group project by Group TEAM. This app allows users to find the nearest gas station and the cheapest gas price in the CHCH area. In future updates, the app will also provide users with the best route to the gas station.

## Project Overview

This project focuses on data engineering and involves the development of microservices for the frontend, backend, and mobile end. We use PostgreSQL and MongoDB databases to manage data. GitHub issues and projects are utilized for project management, and multiple repositories are created under our organization.

## Git Repository Organization

The following repositories are created under our organization:

- `CHCH-Fuel-Recommendator-Mobile-End`: Repository for the mobile application.
- `CHCH-Fuel-Recommendator-Docs`: Repository for documentation.
- `CHCH-Fuel-Recommendator-Web-Api`: Repository for the web API.
- `CHCH-Fuel-Recommendator-Data-Collection-Pipeline`: Repository for the data collection pipeline.

## Features

- Locate the nearest gas stations in 5000 meters.
- Display the cheapest gas prices.
- Future update: Provide the best route to the gas station.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/your-org/chch-fuel-recommendator-mobile-end.git
   cd chch-fuel-recommendator-mobile-end
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm start
   ```

4. To run on a specific platform:

   ```sh
   npx start 
   ```

## Project Structure

The project directory is structured as follows:

```bash
CHCH-FUEL-RECOMMENDATOR-MOBILE-END/
├── .expo/
├── assets/
├── components/
│   ├── Badge.js
│   ├── FuelCard.js
│   ├── FuelTypeButton.js
│   └── RoundButton.js
├── node_modules/
├── utils/
├── .env
├── .gitignore
├── app.config.js
├── App.js
├── app.json
├── babel.config.js
├── googlemap.json
├── mobil.co.nz.example.json
├── package-lock.json
├── package.json
└── README.md
```

## Usage

- Open the app and allow location permissions.
- The app will display the nearest gas stations and their prices.
- Use the map view to see the locations of gas stations.
- Switch between map view and list view using the button in the footer.
- Select different fuel types using the buttons in the footer.

## Configuration

Ensure you have the correct API URL set in your environment variables. The app uses Expo Constants to manage the API URL configuration:

```js
const apiUrl = Constants.expoConfig?.extra?.apiUrl || "http://your-web-api-url-endpoint";
```

notes: Your web API URL endpoint should be by running the repository `CHCH-Fuel-Recommendator-Web-Api`.

## Contact

If you have any questions or need further assistance, please contact our team at [aemooooon@gmail.com].
