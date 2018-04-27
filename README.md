
# Miradar - Un Bot Discord pour lier des canaux  
Miradar est un bot développé en Discord.js dont le but est de relier plusieurs canaux textuels entre eux.  
  
Vous pouvez définir votre propre liste d'entrées et sorties, et à chaque fois qu'un message est envoyé sur un des canaux d'entrée, il sera retransmis sur tous les canaux de sortie qui lui ont été assignés.  
  
## Installation  
Pour utiliser Miradar, vous aurez besoin de :  
  
- Node.JS v8.0.0 ou supérieure ([**instructions d'installation**](https://nodejs.org/fr/download/package-manager/))  
- Une connexion internet  
  
Après avoir installé Node.JS, lancez un terminal à la racine du dossier de Miradar et utilisez la commande suivante:

    npm i
   
Cela aura pour effet d'installer les dépendances:  

- discord.js  
- discord.js-commando  
  
Ces dépendances sont nécessaires au bon fonctionnement du bot.  
  
### Configuration  

Une fois les dépendances installées, remplissez le fichier **config.json** qui se trouve dans le dossier **settings**:  
  
- **Prefix:** Le préfixe des commandes du bot (_défaut: mi!_)  
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

Miradar dispose d'un total de 5 commandes permettant la gestion des liens entre les canaux ainsi que le formatage des messages qu'il retransmet.

## Gestion des liens

Ce groupe de commandes permet comme son nom l'indique de gérer les liens du serveur Discord. Il est composé de 4 commandes.

### createlink

**Aliases:** cl, create

**Description:** Crée un lien entre deux canaux d'un même serveur.

**Utilisable en MP:** Non

**Permissions requises:** Gérer le serveur

**Arguments:**

- From: Canal à partir duquel copier les messages. _Obligatoire_
- To: Canal sur lequel copier les messages. _Obligatoire_

**Exemples:**

- Créer un lien en passant des canaux textuels

	> mi!createlink #from #to
        
- Créer un lien en passant le nom des canaux textuels

	> mi!createlink from to

### deletelink

**Aliases:** removelink, dl, rl

**Description:** Supprime un lien existant entre deux canaux.

**Utilisable en MP:** Non

**Permissions requises:** Gérer le serveur

**Arguments:**

- From: Canal à partir duquel les messages sont copiés. _Obligatoire_
- To: Canal sur lequel les messages sont copiés. _Obligatoire_

**Exemples:**

- Supprimer un lien en passant des canaux textuels

	> mi!deletelink #from #to
        
- Supprimer un lien en passant le nom des canaux textuels

	> mi!deletelink from to

### resetlinks

**Alias:** reset

**Description:** Supprime tous les liens existant sur le serveur.

**Utilisable en MP:** Non

**Permissions requises:** Gérer le serveur

**Arguments:** Aucun

**Exemples:**

- Supprimer tous les liens d'un serveur

	> mi!resetlinks

### showlinks

**Aliases:** show, sl

**Description:** Liste tous les liens existant sur le serveur.

**Utilisable en MP:** Non

**Permissions requises:** Gérer le serveur

**Arguments:** Aucun

**Exemples:**

- Lister tous les liens d'un serveur

	> mi!showlinks

## Format des messages

Ce groupe de commandes permet de gérer le format dans lequel les messages sont copiés sur les canaux de sortie. Il comporte 1 commande.

### format

**Alias:** form

**Description:** Définit le format dans lequel les messages seront copiés sur les canaux de sortie. Les modificateurs de format sont:

- \u: Tag Discord de l'utilisateur ayant envoyé le message
- \t: Heure du message au format HH:MM
- \c: Canal Discord sur lequel le message copié a été envoyé
- \m: Le message copié (_se situe à la fin par défaut_)

**Utilisable en MP:** Non

**Permissions requises:** Gérer le serveur

**Arguments:**

- formatString: Chaîne de caractère décrivant le format dans lequel les messages doivent être copiés.

**Exemples:**

- Format "IRC"

	> mi!format [\t] \c <\*\*\u\*\*> 
	> 
	> **Sortie:**
	> [16:00] #channel <**Brybry#0001**> Hello world

- Format "Envoyé par ... à ... sur ..."

	> mi!format \*\*\_Message:\_\*\* \m --- Envoyé par \u à \t sur \c
	> 
	> **Sortie:**
	> **_Message:_** Hello world --- Envoyé par Brybry#0001 à 16:00 sur #channel