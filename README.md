# Bike System Frontend

This is the frontend for the Bike System application. It uses Vite, React, and TypeScript for fast development and efficient builds. This project interacts with a backend service to display bike station information.

## Prerequisites

Before running this frontend application, ensure that the backend project is up and running. The backend project should be available at the specified API URL.

### Backend Prerequisites

1. **Backend URL**: Ensure the backend API is running and accessible. Follow the README in this project: https://github.com/Darius225/bike-system-backend to set the backend up. The backend should be running at the URL specified in the `VITE_BACKEND_API_URL` environment variable, which is created in the env file.

## Getting Started

### 1. Clone the Repository

First, clone this repository to your local machine:

    ```bash
    git clone https://github.com/Darius225/bike-system-frontend
    cd bike-system-frontend
    ```

### 2. Install Dependencies

Install the necessary dependencies using npm or yarn:

    ```bash
    npm install
    # or
    yarn install
    ```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project directory. Add the `VITE_BACKEND_API_URL` environment variable with the URL of your backend API:

    ```env
    VITE_BACKEND_API_URL=http://localhost:3000
    ```

Adjust the URL to match the location where your backend service is running.

### 4. Start the Development Server

Run the development server with:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

Navigate to `http://localhost:5173` in your browser to view the application. An application similar to this open:
<img src="images/application.png" alt="Application Screenshot" width="800" height="500" />

### 5. Running Tests

To run the tests, use:

    ```bash
    npm test
    # or
    yarn test
    ```

Ensure that the backend service is running when you execute the tests, as the tests may rely on data from the backend.

## File Structure

- `src/` - Contains the source code for the application.
  - `components/` - React components used in the application.
  - `services/` - Functions for interacting with the backend API.
  - `main.tsx` - Entry point of the application.
- `index.html` - The main HTML file used by Vite.
- `vite.config.ts` - Vite configuration file.
- `.env` - Environment variables.

## Configuration

### Vite Configuration

The `vite.config.ts` file contains the configuration for Vite. It includes settings for plugins, build options, and alias paths.

### Linting and Formatting

To ensure consistent code style, this project uses ESLint and Prettier. You can run the following commands to lint and format the code:
`npm run lint` # or
`yarn lint`

To fix what can be automatically fixed with lint, run:
`npm run lint:fix`
`

## Troubleshooting

If you encounter issues:

- Ensure the backend API is running and accessible.
- Verify that the `.env` file contains the correct API URL.
- Check the browser console and terminal output for any error messages.

## Contributing

Feel free to open issues or submit pull requests. Follow the contribution guidelines provided in the backend project repository if applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
