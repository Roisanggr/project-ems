#!/usr/bin/env node

/**
 * Development Server Script
 * Usage: npm run dev || node dev-server.js
 */

import { spawn } from 'child_process';
import path from 'path';

const startServer = () => {
    console.log('🚀 Starting EMS Frontend Development Server...');
    console.log('📁 Project: Environment Monitoring System');
    console.log('⚡ Using Vite for fast development');
    console.log('');
    
    const vite = spawn('npx', ['vite'], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
    });

    vite.on('error', (err) => {
        console.error('❌ Failed to start development server:', err);
    });

    vite.on('close', (code) => {
        if (code !== 0) {
            console.log(`❌ Development server exited with code ${code}`);
        } else {
            console.log('✅ Development server stopped cleanly');
        }
    });

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down development server...');
        vite.kill('SIGINT');
        process.exit(0);
    });
};

startServer();