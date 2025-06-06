# DeceSoft - SAP Process Data for Process Mining

A web application for viewing and analyzing SAP process data, focusing on the Order to Cash (O2C) process.

## Features

### Data Views

1. **Case IDs View**
   - Displays basic case information
   - Shows process flow with entity types (Quotation → Order → Delivery → Invoice)
   - Lists document IDs for each entity

2. **Case-ID, Entity, Event View**
   - Shows detailed event information for each case
   - Includes event types (Create/Change)
   - Displays timestamps, transactions, and user information
   - Color-coded event types (green for Create, orange for Change)

3. **Case-ID, Entity, Document, Message View**
   - Displays message logs for each document
   - Shows message types, timestamps, and user information
   - Includes partner information when available

4. **Case ID, Documents, Tables, Fields View**
   - Shows detailed SAP table and field information
   - Displays all relevant tables (e.g., VBAK, VBUK, VBAP) with their fields
   - Table names highlighted in the application's primary color (#006d77)
   - Includes document relationships and predecessor information
   - Shows field IDs and their values

### Additional Features

- **DeceSoft Backend Service Information**
  - Modal view showing SAP tables and field structures
  - Detailed information about document types (Quotation, Sales Order, Delivery, Invoice)
  - Transaction codes and table relationships

## Technical Details

### Data Structure
The application processes five XML files:
- `0_O2CERPProcessDefinition.xml`: Process structure and configuration
- `1_Response20230320_Cases.XML`: Case data
- `2_Response20230320_Cases_Events.XML`: Event data
- `3_Response20230320_Cases_Messages.XML`: Message logs
- `4_Response20230320_Cases_DocDetails.XML`: Document details and table data

### Implementation
- Node.js/Express backend with TypeScript
- Fast XML parsing with error handling
- Rate limiting and compression for API endpoints
- Modern, responsive UI with semantic HTML and CSS
- Health check endpoint for monitoring

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the application:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run watch
   ```

3. Access the application at `http://localhost:3000`

## API Endpoints

The application exposes the following REST endpoints:
- `GET /api/health`: Health check endpoint (returns 200 when healthy)
- `GET /api/data/cases`: Retrieves case information
- `GET /api/data/events`: Retrieves event data
- `GET /api/data/messages`: Retrieves message logs
- `GET /api/data/docDetails`: Retrieves document details

## Development

The application uses:
- TypeScript for type safety
- Nodemon for development auto-reload
- Express.js for the backend server
- Fast-XML-Parser for XML processing

## Error Handling
- Comprehensive error handling for XML parsing
- User-friendly error messages
- Rate limiting to prevent API abuse
- Graceful server shutdown

## Security
- API rate limiting
- Input validation
- Secure HTTP headers
- No sensitive data exposure

## Performance
- Response compression
- Efficient XML parsing
- Optimized data structures
- Minimal dependencies

## XML Data Structure

The application processes SAP O2C process data from XML files. The core structure follows this hierarchy:

### Case Structure
Each case represents a business process instance with a unique ID (e.g., "B-0020000273"). Cases can contain multiple document groups, each representing a step in the O2C process.

### Entity Types (in sequence)
1. **Quotation (B)** - Initial sales quotation
2. **Order (C)** - Sales order(s) created from quotation
3. **Delivery (J)** - Delivery document
4. **Invoice (M)** - Billing document

### Multiple Documents Scenario
A single entity (e.g., Order) can have multiple associated documents. For example:
```xml
<Case id="B-0020000273">
    <DocGroup>
        <Entity id="C">Order</Entity>
        <Document id="0000019070">
            <PrecEntity>B</PrecEntity>
            <PrecDocNo>0020000273</PrecDocNo>
        </Document>
        <Document id="0000019071">
            <PrecEntity>B</PrecEntity>
            <PrecDocNo>0020000273</PrecDocNo>
        </Document>
    </DocGroup>
    <DocGroup>
        <Entity id="B">Quotation</Entity>
        <Document id="0020000273"/>
    </DocGroup>
</Case>
```
In this example, one quotation (0020000273) led to two orders (0000019070, 0000019071).

## Data Display

The application displays case information in a hierarchical format:
- Case ID (bold)
- Entity sequence with document numbers
- Multiple documents for the same entity are displayed with comma separation

Example display:
```
B-0020000273
    Quotation (0020000273) → Order (0000019070, 0000019071)
```

## Project Structure

```
.
├── public/               # Static frontend files
│   ├── index.html       # Main application interface
│   └── images/          # Brand assets
├── src/                 # Source code
│   ├── client/         # Frontend React application
│   │   ├── index.tsx   # React entry point
│   │   ├── App.tsx     # Main React component
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   └── types/      # Frontend type definitions
│   └── server/         # Backend Express application
│       ├── index.ts     # Main server entry point
│       ├── config/      # Environment configuration
│       ├── routes/      # API route handlers
│       ├── services/    # Business logic services
│       ├── types/       # Backend type definitions
│       ├── utils/       # Utility functions
│       └── __tests__/   # Test files
├── backups/             # Project backups
│   ├── Backup_2025-05-02_Time_2-30/  # First backup
│   └── Backup_2/                      # Latest backup
├── data/               # XML data files
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite bundler configuration
├── jest.config.js      # Testing configuration
└── package.json        # Project dependencies
```

## Metadata
- **Business Process**: Order to Cash
- **SAP Product**: SAP S/4HANA
- **System**: PRD
- **Client**: 100
- **Date**: May 2, 2025

## Current State (as of June 2, 2025)

The application is a simplified viewer with a clean interface featuring:
- Four visual buttons representing different SAP data types (Cases, Events, Messages, Document Details)
- DeceSoft branding with corporate colors (Header: RGB(0, 88, 95), Buttons: RGB(0, 109, 119))
- Server health monitoring
- Static interface design
- Information modal showing XML file details

## Development Notes

### Latest Changes (June 2, 2025)
- Added modal window showing XML file information
- Added "DeceSoft backend service" button in metadata section
- Updated metadata display with dynamic date
- Created new backup in `backups/Backup_2`

### XML Files Information
The application processes five XML files:
1. `0_O2CERPProcessDefinition.xml`: Process definition and configuration
2. `1_Response20230320_Cases.XML`: Main case data
3. `2_Response20230320_Cases_Events.XML`: Event tracking data
4. `3_Response20230320_Cases_Messages.XML`: Message logs
5. `4_Response20230320_Cases_DocDetails.XML`: Detailed document information

### Backup Information
The project maintains regular backups in the `backups` directory:
- Complete frontend code
- Server implementation
- Configuration files
- Dependencies list

## Configuration

The application uses several configuration files:
- `tsconfig.json`: TypeScript compiler configuration
- `vite.config.ts`: Vite bundler configuration for frontend
- `jest.config.js`: Jest testing framework configuration
- Environment validation with Zod
- Rate limiting settings
- Compression for improved performance

## Health Monitoring

The application includes a health check endpoint at `/api/health` that monitors server status.

## Backup Script

The project includes a backup script (`backup.sh`) that creates dated backups of the project state in GitHub. To create a backup:

```bash
./backup.sh
```

The script will:
- Create a new branch with today's date
- Add all changes
- Commit and push to GitHub
- Switch back to the main branch

---

*Documentation last updated: June 2, 2025* 