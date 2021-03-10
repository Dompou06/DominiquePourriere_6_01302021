# SoPekocko
Ce dépôt contient le lien vers le dépôt du _front-end_ et le _back-end_ de l'application SoPekocko qui permet d'intégrer et noter des sauces.

---

## Contents
* [Démarrage rapide](#Démarrage-rapide)
* [Prérequis](#Prérequis)
* [Exécution](#Exécution)
* [Utilisation](#Utilisation)
* [Auteur](#Auteur)


## Démarrage rapide
Ces instructions vont vous permettre d'obtenir une copie fonctionnelle du projet sur votre poste de travail.

## Prérequis
Afin de pouvoir exécuter l'application sur votre poste de travail, vous devez d'abord installer les dépendances suivantes :
 1. NodeJS 14
 2. Créer une collection dans Mongo Atlas
 
### Installation
  1. Cloner le dépôt GitHub https://github.com/OpenClassrooms-Student-Center/dwj-projet6
  2. Installer Node.js et npm via npm install dans le terminal
  3. Dans le front-end, installer node-sass en version 4.14.1 via npm install -S node-sass@4.14.1 dans le terminal
  4. Cloner le dépôt GitHub https://github.com/Dompou06/DominiquePourriere_6_01302021.git
  5. Dans ce back-end, copier les données du fichier .env.dist
  6. Créer un fichier .env et le remplir avec les données copiées et ajouter vos paramètres, toujours dans le back-end
  
---
 
## Exécution
Suivre [cette procédure] pour lancer l'application.
 
Exécuter `npm start` dans le front-end et le back-end

---

### Inscription

1. Votre *email* devra être valide et ne pas être déjà inscrit dans la base de données
2. Votre *password* devra comporter 8 à 15 signes ainsi qu'au moins une lettre minuscule et une majuscule, un chiffre et un caractère spécial équivalent -, +, !, *, $, @, % ou _

### Connexion

1. Vous devez vous être déjà inscrit
2. Au bout de cinq essais de password invalides, pendant une minute, les tentatives suivantes seront rejetées

---

## Auteur
Pourrière Dominique
