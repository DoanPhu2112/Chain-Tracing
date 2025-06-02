import { Router } from 'express';
import { createUser, getUser } from './dao';

const router = Router();
router.get('/:name', async (req, res) => {
  try {
    const name = req.params.name;
    // Validate address: must be a non-empty string
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Invalid or missing address' });
    }

    const user = await getUser({ name });
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = req.body;
    // Validate address: must be a non-empty string
    if (!user || typeof user !== 'object' || !user.name || !user.password) {
      return res.status(400).json({ error: 'Invalid or missing user' });
    }
    const username = await getUser({ name: user.name });
    if (username?.id) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const id = await createUser(user);
    return res.status(201).json(id);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log('Login attempt:', { name, password });
    // Validate address: must be a non-empty string
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Invalid or missing address' });
    }
    const user = await getUser({ name });
    if (user && user.password === password) {
      return res.status(200).json(user);
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
