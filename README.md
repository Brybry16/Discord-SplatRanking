
# SplatRanking - Un Bot Discord pour enregistrer les Rankings Splatoon 2 dans chaque mode de jeu du Rang X 
SplatRanking est un bot développé en Discord.js dont le but est d'enregistrer les 'Powers' des membres du serveur dans chacun des modes de jeu classés de Splatoon 2.  
  
Les utilisateurs doivent entrer manuellement leur power et le bot peut ensuite générer des classements mensuels par serveur et par mode de jeu. 
  
## Installation  
Pour utiliser SplatRanking, vous aurez besoin de :  
  
- Node.JS v8.0.0 ou supérieure ([**instructions d'installation**](https://nodejs.org/fr/download/package-manager/))  
- Une connexion internet  
  
Après avoir installé Node.JS, lancez un terminal à la racine du dossier de SplatRanking et utilisez la commande suivante:

    npm i
   
Cela aura pour effet d'installer les dépendances:  

- discord.js  
- discord.js-commando  
  
Ces dépendances sont nécessaires au bon fonctionnement du bot.  
  
### Configuration  

Une fois les dépendances installées, remplissez le fichier **config.json** qui se trouve dans le dossier **settings**:  
  
- **Prefix:** Le préfixe des commandes du bot (_défaut: x!_)  
- **Token:** Le jeton d'utilisateur de votre bot. Vous pouvez y accéder en cliquant sur votre application (ou en en créant une) via la page '**[Mes applications](https://discordapp.com/developers/applications/me)**' sur le portail Discord  
- **Owner:** Votre propre identifiant Discord à 18 caractères numériques. La manière la plus simple pour obtenir cette valeur est d'activer les fonctionnalités de développeur dans Discord, puis faire un clic droit sur votre pseudo > Copier l'identifiant.  
  
Attention, tant que vous n'aurez pas rempli le fichier de configuration, votre bot ne pourra pas se connecter à Discord et l'application ne pourra pas se lancer.  
  
## Lancement  

### Démarrer le bot

Pour lancer le bot, rendez-vous dans un terminal à la racine du dossier, puis tapez la commande suivante:  

    node index.js
    
Cette commande aura pour effet de démarrer le bot. Si tout se passe bien, la console affichera le message `Logged in !`. En cas d'erreur, assurez-vous que les dépendances ont été correctement installées et que le fichier de configuration est bien rempli.

### Ajouter le bot à votre serveur

Afin d'ajouter le bot à votre serveur, vous devez vous rendre sur la page '**[Mes applications](https://discordapp.com/developers/applications/me)**' du portail Discord. Cliquez ensuite sur l'application que vous souhaitez ajouter puis notez l'ID du client.

Rendez-vous ensuite à l'adresse suivante:

    https://discordapp.com/oauth2/authorize?client_id=<ID DU CLIENT>&scope=bot

Vous pourrez alors sélectionner un serveur parmi ceux sur lesquels vous disposez de la permission '**Gérer le serveur**' afin d'y ajouter votre bot.

# Commandes

SplatRanking dispose d'un total de 3 commandes permettant la gestion des classements et du Power des membres.

## Gestion des rangs

Ce groupe de commandes permet comme son nom l'indique de gérer les rangs (power) des membres du serveur Discord. Il est composé de 3 commandes.

### rank

**Description:** Modifie le rang d'un membre pour la saison actuelle

**Utilisable en MP:** Non

**Permissions requises:** Aucune

**Arguments:**

- Mode: Le mode dans lequel l'utilisateur souhaite modifier son Power. 4 valeurs possibles : `SZ`, `TC`, `RM` ou `CB`. (_Obligatoire_)
- Power: Le Power de l'utilisateur. Écrire `delete` pour supprimer le Power (p. ex. en cas de dérank). `Valeurs numériques` ou mot `delete` uniquement. (_Obligatoire_)
- User: L'utilisateur dont on veut mettre à jour le Power. (_Facultatif, administrateurs uniquement_)

**Exemples:**

- Modifier son Power dans le mode Clam Blitz (Pluie de Palourdes)

	> x!rank cb 2740.2
        
- Modifier le Power d'un utilisateur dans le mode Rainmaker (Mission Bazookarpe)

	> x!rank rm 2740.2 @Brybry#0001

- Supprimer son Power dans le mode Splat Zone (Défense de Zone)

	> x!rank sz delete
        
- Supprimer le Power d'un utilisateur dans le mode Tower Control (Expédition Risquée)

	> x!rank tc delete @Brybry#0001

### reset

**Description:** Supprime le rang d'un membre sur un ou plusieurs modes pour la saison actuelle.

**Utilisable en MP:** Non

**Permissions requises:** Aucune

**Arguments:** 

- Mode: Le mode dans lequel l'utilisateur souhaite modifier son Power. 5 valeurs possibles : `SZ`, `TC`, `RM`, `CB` ou `ALL`. (_Facultatif, défaut: `ALL`_)
- User: L'utilisateur dont on veut supprimer le Power. (_Facultatif, administrateurs uniquement_)

**Exemples:**

- Supprimer son Power en Clam Blitz (Pluie de Palourdes)

	> x!reset cb

- Supprimer le Power d'un membre en Splat Zone (Défense de Zone)

	> x!reset sz @Brybry#0001

- Supprimer son Power dans tous les modes de jeu

	> x!reset
	
	> x!reset all

- Supprimer le Power d'un membre dans tous les modes de jeu

	> x!reset all @Brybry#0001

### ranking

**Description:** Établit le classement du serveur pour la saison en cours ou une saison définie dans un ou plusieurs modes de jeu.

**Utilisable en MP:** Non

**Permissions requises:** Aucune

**Arguments:**

- Mode: Le mode dans lequel l'utilisateur souhaite afficher le ranking. 5 valeurs possibles : `SZ`, `TC`, `RM`, `CB` ou `ALL`. (_Facultatif, défaut: `ALL`_)
- Season: La saison dont l'utilisateur souhaite afficher le ranking. Format: `YYYYMM` (ex: 201805 pour mai 2018). (_Facultatif, défaut: Saison en cours_)

**Exemples:**

- Lister le ranking de la saison en cours dans tous les modes de jeu

	> x!ranking

- Lister le ranking de la saison en cours dans le mode Clam Blitz (Pluie de Palourdes)

	> x!ranking cb

- Lister le ranking de la saison de mai 2018 (05/2018) dans le mode Tower Control (Expédition Risquée)

	> x!ranking tc 201805

- Lister le ranking de la saison de juin 2018 (06/2018) dans tous les modes de jeu

	> x!ranking all 201806
