// ─── backend/src/app.js ─────────────────────────────────────────────
// Entry Point of MiniLib Express server
// Start with : npm run dev

import express from 'express';
import cors from 'cors';
// Node 24 : plus besoin de dotenv // charge les variables depuis .env

// Router Import
import livresRouter from './routes/livres.js';
import adherentsRouter from './routes/adherents.js';

// ── Initialisation of Express' application  ──────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares globaux ───────────────────────────────────────────────
// cors() : autorise les requêtes cross-origin (React sur port 3000 → APIsur 5000)
app.use( cors());

// express.json() : parse automatiquement le body JSON des requêtes POST / PUT
app.use( express.json());

// Middleware de logging minimaliste — affiche chaque requête reçue
app.use( ( req, res, next) => 
    {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next(); // next() = passer au middleware/route suivant
    }
);

// ── Routes ───────────────────────────────────────────────────────────
// All livres's route are prefixe by  /api/v1/livres
app.use( '/api/v1/livres', livresRouter);

// All adherents' route are prefixe by  /api/v1/adherents
app.use( '/api/v1/adherents', adherentsRouter);

// All emprunt's route are prefixe by  /api/v1/emprunt
// app.use( '/api/v1/emprunts', empruntsRouter);

// health route — Check if server is running
app.get( '/health', ( req, res) => 
    {
        res.json(
            {
                status: 'OK',
                message: 'MiniLib Server up',
                timestamp: new Date().toISOString(),
            }
        );
    }
);

// Middleware to manage unknow route (404)
app.use( ( req, res) => 
    {
        res.status(404).json(
            {
                erreur: `Route ${req.method} ${req.url} not find`,
            }
        );
    }
);

// Middleware de gestion des erreurs serveur (500)
// Express reconnaît ce middleware à ses 4 paramètres (err en premier)
app.use( ( err, req, res, next) => 
    {
        console.error( 'Server error:', err.message);
        res.status(500).json(
            {
                erreur: 'Server internal error' 
            }
        );
    }
);

// ── Start ─────────────────────────────────────────────────────────
app.listen( PORT, () => 
    {
        console.log(`MiniLib server started on http://localhost:${PORT}`);
        console.log(`Environment : ${process.env.NODE_ENV}`);
    }
);

export default app; // export pour les tests futurs