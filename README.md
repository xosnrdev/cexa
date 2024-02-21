# CEXA: Code Execution API

[![CI](https://github.com/xosnrdev/cexa/actions/workflows/ci.yml/badge.svg)](https://github.com/xosnrdev/cexa/actions/workflows/ci.yml)

CEXA is a powerful API designed to execute arbitrary code snippets in various programming languages within isolated docker environments. It prioritizes security, scalability, and user-friendliness.

## Table of Contents

- [Key Features](#key-features)
- [Edge Cases](#edge-cases)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Key Features

- **Multi-Language Support:** Execute code in multiple programming languages, making it a versatile tool for coding platforms, educational platforms, and more.
- **docker-Based Execution:** Ensures code execution within isolated docker containers for security and consistent environments.
- **Robust Error Handling:** Capable of handling various edge cases, including unsupported languages, missing Docker images, and code execution errors.

## Edge Cases

CEXA has been rigorously tested against a variety of edge cases, including but not limited to:

- Unsupported languages
- Execution timeouts
- Empty or invalid code submissions
- Missing language or code in requests
- Syntax errors and unauthorized actions
- Runtime errors, infinite loops, and external network access attempts
- Attempts to write to disk

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (Version 18.x or later)
- docker
- Nerdctl

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

3. Add environment variables to your .env file

4. Install the dependencies:

   ```bash
   npm install
   ```

5. Start the server:

   ```bash
   npm start
   ```

## API Documentation

For a detailed overview of the API endpoints and usage, visit our [API documentation](https://documenter.getpostman.com/view/32696710/2s9YythLiJ).

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute and the process for submitting pull requests.

## License

CEXA is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
