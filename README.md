# Medical Supply Inventory - Google Sheets Export Feature - Enhancement for United2Heal App

## Overview
Enhancement to an internal React Native inventory management application that tracks medical supplies as they are received and shipped. I developed a data export feature that allows users to export inventory table data directly to Google Sheets for reporting and analysis.

## My Contribution
Built a serverless backend API that exports filtered inventory data from the MySQL database to Google Sheets, creating organized sheets for each box/group combination.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **APIs**: Google Sheets API v4
- **Authentication**: Google Service Account (JWT)
- **Deployment**: AWS Lambda (serverless function)

## Key Features Implemented
- **Dynamic sheet creation**: Automatically creates new sheets with naming convention `Box{number}_Group{name}`
- **Query-based filtering**: Exports specific inventory data based on group name and box number
- **Auto-formatting**: Dynamically extracts column headers from database results and formats data for spreadsheet compatibility

## Technical Highlights
- Implemented Google Sheets API integration using service account authentication
- Used connection pooling for efficient database queries
- Built parameterized SQL queries to prevent injection vulnerabilities
- Designed async/await pattern for improved error handling and response times
- Environment variable configuration for secure credential management

## Architecture
The feature operates as a serverless function that:
1. Receives group name and box number as query parameters
2. Queries MySQL database for matching inventory records
3. Creates a new sheet in the target Google Spreadsheet
4. Formats and appends data with headers to the new sheet
5. Returns success response to the client

## Challenges Solved
- Ensuring data integrity when jsonData could be undefined or empty
- Creating dynamic sheet names based on inventory metadata
- Handling async operations efficiently to prevent timeout issues on the client side
