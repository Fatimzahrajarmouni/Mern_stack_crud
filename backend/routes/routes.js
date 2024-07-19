import express from 'express';
import { upload, create, get, Updated, Delete } from '../controllers/usercontrollers.js';

const routers = express.Router();

// Route pour créer un utilisateur avec une image
routers.post('/create', upload.single('image'), create);

// Route pour mettre à jour un utilisateur avec une image
routers.put('/update/:id', upload.single('image'), Updated);

// Route pour obtenir tous les utilisateurs
routers.get('/get', get);

// Route pour supprimer un utilisateur
routers.delete('/delete/:id', Delete);

export default routers;
