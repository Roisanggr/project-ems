import { Request, Response } from "express";
import { executeQuery } from "../../utils/db1";
import bcrypt from 'bcrypt';

export const get = [
    async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            
            let whereClause = 'WHERE is_deleted = false';
            const params: any[] = [];
            
            if (search) {
                whereClause += ' AND (user_name LIKE ? OR user_code LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }
            
            const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
            const dataQuery = `
                SELECT u.id, u.user_code, u.user_name, u.role_code, u.created_at, u.updated_at,
                       r.role_name 
                FROM users u 
                LEFT JOIN roles r ON u.role_code = r.role_code 
                ${whereClause}
                ORDER BY u.created_at DESC 
                LIMIT ? OFFSET ?
            `;
            
            const [countResult, userData] = await Promise.all([
                executeQuery(countQuery, params),
                executeQuery(dataQuery, [...params, Number(limit), offset])
            ]);

            res.json({
                status: true,
                data: userData,
                meta: {
                    page: Number(page),
                    limit: Number(limit),
                    total: countResult[0].total,
                    totalPages: Math.ceil(countResult[0].total / Number(limit))
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to fetch users'
            });
        }
    }
];

export const post = [
    async (req: Request, res: Response) => {
        try {
            const { user_code, user_name, role_code, password } = req.body;

            // Validate required fields
            if (!user_code || !user_name || !role_code || !password) {
                return res.status(400).json({
                    status: false,
                    error: 'user_code, user_name, role_code, and password are required'
                });
            }

            // Check if user already exists
            const existingUserQuery = 'SELECT id FROM users WHERE user_code = ? AND is_deleted = false';
            const existingUser = await executeQuery(existingUserQuery, [user_code]);
            
            if (existingUser.length > 0) {
                return res.status(409).json({
                    status: false,
                    error: 'User with this code already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const createUserQuery = `
                INSERT INTO users (user_code, user_name, role_code, password, created_at)
                VALUES (?, ?, ?, ?, NOW())
            `;
            
            const result = await executeQuery(createUserQuery, [
                user_code, 
                user_name, 
                role_code, 
                hashedPassword
            ]);

            // Fetch created user without password
            const getUserQuery = `
                SELECT u.id, u.user_code, u.user_name, u.role_code, u.created_at,
                       r.role_name 
                FROM users u 
                LEFT JOIN roles r ON u.role_code = r.role_code 
                WHERE u.id = ?
            `;
            const userData = await executeQuery(getUserQuery, [result.insertId]);

            res.status(201).json({
                status: true,
                data: userData[0],
                message: 'User created successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : 'Failed to create user'
            });
        }
    }
];