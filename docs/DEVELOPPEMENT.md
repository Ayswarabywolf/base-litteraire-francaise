# Guide de Développement

## Configuration de l'Environnement

### Base de données

1. Créer une base de données PostgreSQL :
   - Nom : hlp_db
   - Utilisateur : hlp_user
   - Mot de passe : à définir dans le fichier .env

### Backend (Python)

1. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

3. Configurer les variables d'environnement :
   - Copier `.env.example` vers `.env`
   - Remplir les variables nécessaires

### Frontend (React)

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm start
```

## Conventions de Code

- Utiliser PEP 8 pour Python
- ESLint pour JavaScript/React
- Commentaires en français
- Messages de commit en français
