#!/bin/bash

PORT=4321

echo "🚀 Starting Ncmaz Blog..."

# Check if port is in use and kill the process
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port $PORT is busy. Killing process..."
    lsof -ti:$PORT | xargs kill -9
    echo "✅ Port $PORT cleared."
else
    echo "✅ Port $PORT is free."
fi

echo "Installing dependencies..."
npm install

echo "Starting development server..."
npm run dev
