import { Request, Response } from "express";
import { executeQuery } from "../../utils/db1";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// POST /api/auth/login
export const post = [
    async (req: Request, res: Response) => {
        try {
            const { user_code, password } = req.body;

            // Validate required fields
            if (!user_code || !password) {
                return res.status(400).json({
                    status: false,
                    error: 'user_code and password are required'
                });
            }

            // Find user
            const userQuery = `
                SELECT u.*, r.role_name 
                FROM users u 
                LEFT JOIN roles r ON u.role_code = r.role_code 
                WHERE u.user_code = ? AND u.is_deleted = false
            `;
            const users = await executeQuery(userQuery, [user_code]);

            if (users.length === 0) {
                return res.status(401).json({
                    status: false,
                    error: 'Invalid credentials'
                });
            }

            const user = users[0];

            // Verify password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({
                    status: false,
                    error: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: user.id, 
                    user_code: user.user_code, 
                    role_code: user.role_code 
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            // Log login action
            const logQuery = 'INSERT INTO action_logs (user_code, action, timestamp) VALUES (?, ?, NOW())';
            await executeQuery(logQuery, [user_code, 'LOGIN']);

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                status: true,
                data: {
                    user: userWithoutPassword,
                    token
                },
                message: 'Login successful'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Login failed'
            });
        }
    }
];