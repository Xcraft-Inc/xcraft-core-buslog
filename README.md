# 📘 Documentation du module xcraft-core-buslog

## Aperçu

Le module `xcraft-core-buslog` est un composant essentiel du framework Xcraft qui permet de rediriger les logs système vers le bus d'événements. Il sert de pont entre le système de journalisation (`xcraft-core-log`) et le bus de communication, permettant ainsi d'afficher les logs dans l'interface utilisateur ou de les traiter par d'autres composants du système.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)

## Structure du module

Le module est relativement simple et se compose principalement de :

- Une classe `BusLog` qui gère l'abonnement aux événements de log et leur redirection
- Des fonctions utilitaires pour gérer les modes de fonctionnement
- Un système de modes permettant d'activer/désactiver certaines fonctionnalités

## Fonctionnement global

1. Le module s'abonne aux différents niveaux de log (`verb`, `info`, `warn`, `err`, `dbg`) via le système de journalisation Xcraft
2. Lorsqu'un message de log est émis, il est intercepté et redirigé vers :
   - Le bus d'événements sous forme d'événement `widget.text.[niveau]` pour l'affichage dans l'interface
   - Le système de surveillance (`overwatch`) pour les erreurs et les messages spécifiquement marqués
3. Le module offre également une fonction de progression pour suivre l'avancement de tâches longues

## Exemples d'utilisation

### Initialisation du module

```javascript
const xLog = require('xcraft-core-log')('mon-module');
const resp = /* objet de réponse du bus */;
const busLog = require('xcraft-core-buslog')(xLog, resp);

// Maintenant les logs seront redirigés vers le bus d'événements
xLog.info("Message d'information");
xLog.err('Une erreur est survenue');
```

### Utilisation de la barre de progression

```javascript
const xLog = require('xcraft-core-log')('mon-module');
const resp = /* objet de réponse du bus */;
const busLog = require('xcraft-core-buslog')(xLog, resp);

// Afficher une progression dans l'interface
const totalItems = 100;
for (let i = 0; i < totalItems; i++) {
  busLog.progress('Traitement des données', i, totalItems);
  // Traitement...
}
```

### Configuration des modes

```javascript
const xBusLog = require('xcraft-core-buslog');

// Désactiver tous les modes
xBusLog.delModes(0);

// Activer uniquement le mode événement
xBusLog.addModes(xBusLog.modes.event);

// Activer tous les modes
xBusLog.addModes(0);

// Vérifier les modes actifs
console.log('Modes actifs:', xBusLog.getModes());
```

## Interactions avec d'autres modules

- **[xcraft-core-log]** : Source des messages de log à rediriger
- **[xcraft-core-transport]** : Utilisé pour envoyer les événements sur le bus
- **[goblin-overwatch]** : Reçoit les exceptions et erreurs pour surveillance
- **Widgets UI** : Reçoivent les événements `widget.text.*` et `widget.progress` pour affichage

## Détails des sources

### `index.js`

Ce fichier contient l'implémentation principale du module avec la classe `BusLog` et les fonctions utilitaires.

#### Classe BusLog

La classe `BusLog` est le cœur du module, responsable de la gestion des abonnements aux logs et de leur redirection.

**Constructeur** : Initialise une instance avec un logger xLog et un objet de réponse pour la communication sur le bus.

#### Méthodes publiques

- **`log(mode, msg)`** — Redirige un message de log vers le bus d'événements et/ou le système de surveillance selon les modes actifs. Gère automatiquement l'envoi vers overwatch pour les erreurs et les messages marqués spécifiquement.
- **`progress(topic, position, length)`** — Envoie une information de progression sur le bus d'événements sous forme d'événement `widget.progress`, permettant l'affichage de barres de progression dans l'interface utilisateur.

#### Méthodes privées

- **`_subscribe()`** — S'abonne aux différents niveaux de log (verb, info, warn, err, dbg) du système de journalisation. Évite les abonnements multiples en vérifiant l'état des souscriptions existantes.
- **`_unsubscribe()`** — Se désabonne proprement de tous les événements de log et remet à zéro les références des souscriptions.

#### Fonctions utilitaires du module

- **`addModes(modes)`** — Active des modes spécifiques de fonctionnement. Si `modes` vaut 0, active tous les modes disponibles.
- **`delModes(modes)`** — Désactive des modes spécifiques. Si `modes` vaut 0, désactive tous les modes.
- **`getModes()`** — Retourne les modes actuellement actifs sous forme de masque de bits.

#### Constantes et énumérations

- **`prefix`** : Préfixe utilisé pour les événements (défini comme 'GreatHall')
- **`modesEnum`** : Énumération des modes disponibles :
  - `event` : Redirige les logs vers le bus d'événements pour affichage dans l'interface
  - `overwatch` : Envoie les erreurs et exceptions au système de surveillance
- **`currentModes`** : Variable globale stockant les modes actuellement actifs

#### Gestion des modes de fonctionnement

Le module utilise un système de masques de bits pour gérer les modes de fonctionnement. Les modes peuvent être combinés et permettent un contrôle fin de la redirection des logs :

- Mode `event` : Les logs sont envoyés comme événements `widget.text.[niveau]` sur le bus
- Mode `overwatch` : Les erreurs et messages spéciaux sont envoyés au système de surveillance via la commande `overwatch.exception`

Lorsque tous les modes sont désactivés (`currentModes === 0`), le module se désabonne automatiquement des événements de log pour optimiser les performances.

#### Gestion de la connectivité

Le module vérifie systématiquement la connectivité de l'objet de réponse (`resp.isConnected()`) avant d'envoyer des événements ou des commandes. Cette vérification évite les erreurs lors de déconnexions du bus et garantit la robustesse du système.

---

_Document mis à jour_

[xcraft-core-log]: https://github.com/Xcraft-Inc/xcraft-core-log
[xcraft-core-transport]: https://github.com/Xcraft-Inc/xcraft-core-transport
[goblin-overwatch]: https://github.com/Xcraft-Inc/goblin-overwatch