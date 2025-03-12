# Crypto Tracker API

A lightweight and efficient backend API for tracking cryptocurrency prices across multiple exchanges.

## Features

- **Multi-Exchange Support**: Fetch real-time data from major cryptocurrency exchanges
- **Price Aggregation**: Compare prices across different markets
- **Efficient Caching**: Minimize external API calls and improve performance
- **Lightweight Persistence**: Store historical data and user preferences without heavy database requirements
- **WebSocket Support**: Stream real-time price updates to connected clients

## Tech Stack

- **Node.js & Express**: Fast, minimalist web framework
- **SQLite**: Self-contained, serverless database
- **Axios**: HTTP client for API requests
- **Socket.io**: Real-time bidirectional event-based communication
- **Node-cache**: In-memory caching for optimal performance
- **Jest**: Testing framework

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prices` | Get current prices for all supported cryptocurrencies |
| GET | `/api/prices/:symbol` | Get current price for a specific cryptocurrency |
| GET | `/api/exchanges` | List all supported exchanges |
| GET | `/api/markets/:symbol` | Get all markets/exchanges for a specific cryptocurrency |
| GET | `/api/arbitrage` | Get current arbitrage opportunities |
| GET | `/api/historical/:symbol` | Get historical price data for a specific cryptocurrency |

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/crypto-tracker-api.git
   cd crypto-tracker-api
