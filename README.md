# <p align="center">CEXA: Code Execution API</p>

[![CI](https://github.com/xosnrdev/cexa/actions/workflows/ci.yml/badge.svg)](https://github.com/xosnrdev/cexa/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/xosnrdev/cexa/graph/badge.svg?token=9MWoTJwvs5)](https://codecov.io/gh/xosnrdev/cexa)

CEXA is a code execution api engine designed to execute arbitrary code in various programming languages leveraging the power of isolated docker containers. It is a versatile tool for coding platforms, educational platforms, and more.

## Table of Contents

- [Key Features](#key-features)
- [Edge Cases](#edge-cases)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Multi-Language Support:** Supports a wide range of programming languages, including Python, JavaScript, Java, C, C++, and more.
- **docker-Based Execution:** Utilizes docker containers to execute code in a secure and isolated environment.
- **Robust Error Handling:** Handles various types of errors, including syntax errors, runtime errors, and infinite loops.

## Edge Cases

CEXA handles the following edge cases:

- **Infinite Loops:** CEXA uses a timeout mechanism to prevent infinite loops and other long-running code.
- **Syntax Errors:** CEXA detects and reports syntax errors in the code.
- **Runtime Errors:** CEXA detects and reports runtime errors in the code.

## Getting Started

### Prerequisites

To run the project, you need to have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop)

### Installation

Follow these steps to set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/xosnrdev/cexa.git

   ```

2. Navigate to the project directory:

   ```bash
   cd cexa
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   RATE_LIMIT_WINDOW_MS=
   RATE_LIMIT_MAX=
   PORT=8080
   NODE_ENV=
   ```

4. Install the dependencies:

   ```bash
   npm install
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

## API Documentation

The API documentation is available at [CEXA documentation](https://documenter.getpostman.com/view/32696710/2s9YythLiJ).

## Contributing

Contributions are welcome! To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Open a pull request.

For more details, see the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
