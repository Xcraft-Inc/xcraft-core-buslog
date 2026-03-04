# 📘 xcraft-core-buslog

## Aperçu

Le module `xcraft-core-buslog` est un composant du framework Xcraft qui sert de pont entre le système de journalisation ([xcraft-core-log]) et le bus de communication Xcraft. Il intercepte les messages de log émis par les modules et les redirige vers le bus d'événements pour affichage dans l'interface utilisateur, et/ou vers le système de surveillance ([goblin-overwatch]) pour le traitement des erreurs.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)
- [Licence](#licence)

## Structure du module

Le module est composé d'un unique fichier `index.js` qui expose :

- Une classe `BusLog` gérant l'abonnement aux événements de log et leur redirection sur le bus
- Un système de modes à base de masques de bits pour contrôler finement le comportement de redirection
- Des fonctions utilitaires pour manipuler ces modes à l'échelle globale du module

## Fonctionnement global

1. Une instance `BusLog` s'abonne aux niveaux de log disponibles (`verb`, `info`, `warn`, `err`, `dbg`) via le système de journalisation Xcraft.
2. À chaque message de log reçu, la méthode `log()` est appelée et redirige le message selon les modes actifs :
   - **Mode `event`** : publie un événement `widget.text.[niveau]` sur le bus, permettant aux widgets de l'interface d'afficher le message.
   - **Mode `overwatch`** : pour les erreurs (`err`) et les messages portant une propriété `overwatch`, envoie une commande `overwatch.exception` au système de surveillance.
3. Si tous les modes sont désactivés (`currentModes === 0`), le module se désabonne automatiquement pour ne pas consommer de ressources inutilement.
4. La connectivité de l'objet `resp` est vérifiée avant tout envoi, garantissant la robustesse lors des déconnexions du bus.

## Exemples d'utilisation

### Initialisation

```javascript
const xLog = require('xcraft-core-log')('mon-module');
const resp = /* objet de réponse du bus */;
const busLog = require('xcraft-core-buslog')(xLog, resp);

// Les logs sont désormais redirigés vers le bus d'événements
xLog.info("Message d'information");
xLog.err('Une erreur est survenue');
```

### Utilisation de la progression

```javascript
const busLog = require('xcraft-core-buslog')(xLog, resp);

const totalItems = 100;
for (let i = 0; i < totalItems; i++) {
  busLog.progress('Traitement des données', i, totalItems);
  // Traitement...
}
```

### Gestion des modes

```javascript
const xBusLog = require('xcraft-core-buslog');

// Désactiver tous les modes
xBusLog.delModes(0);

// Réactiver uniquement le mode événement
xBusLog.addModes(xBusLog.modes.event);

// Activer tous les modes
xBusLog.addModes(0);

// Consulter les modes actifs
console.log('Modes actifs:', xBusLog.getModes());
```

## Interactions avec d'autres modules

- **[xcraft-core-log]** : Fournit les niveaux de log auxquels `BusLog` s'abonne pour intercepter les messages.
- **[goblin-overwatch]** : Reçoit les erreurs et exceptions via la commande `overwatch.exception` lorsque le mode `overwatch` est actif.
- **Widgets UI** : Consomment les événements `widget.text.*` et `widget.progress` pour afficher les logs et les barres de progression dans l'interface.

## Détails des sources

### `index.js`

Implémentation principale du module.

#### Classe `BusLog`

Constructeur `BusLog(xLog, resp)` : initialise l'instance avec un logger `xLog` et un objet de réponse `resp` permettant la communication sur le bus, puis s'abonne automatiquement aux niveaux de log.

#### Méthodes publiques

- **`log(mode, msg)`** — Redirige un message de log vers le bus et/ou le système de surveillance selon les modes actifs. Vérifie la connectivité avant l'envoi. Déclenche le désabonnement automatique si tous les modes sont désactivés.
- **`progress(topic, position, length)`** — Publie un événement `widget.progress` sur le bus avec le sujet, la position courante et la longueur totale, permettant l'affichage de barres de progression dans l'interface.

#### Méthodes privées

- **`_subscribe()`** — S'abonne à tous les niveaux de log exposés par `xLog`. Protégé contre les abonnements multiples.
- **`_unsubscribe()`** — Se désabonne proprement de tous les niveaux de log et remet les références à `null`.

#### Fonctions utilitaires du module

- **`addModes(modes)`** — Active des modes via un OR binaire. Si `modes` vaut `0`, active tous les modes (`~0`).
- **`delModes(modes)`** — Désactive des modes via un AND NOT binaire. Si `modes` vaut `0`, désactive tous les modes.
- **`getModes()`** — Retourne le masque de bits des modes actuellement actifs.

#### Constantes et énumérations

- **`prefix`** : Préfixe `'GreatHall'` utilisé dans les événements publiés sur le bus.
- **`modesEnum`** : Énumération des modes disponibles :
  - `event` (`1 << 0`) : redirige les logs vers le bus sous forme d'événements `widget.text.[niveau]`
  - `overwatch` (`1 << 1`) : achemine les erreurs et messages spéciaux vers `overwatch.exception`
- **`currentModes`** : Variable globale (état partagé du module) initialisée avec `event | overwatch`, modifiable via `addModes`/`delModes`.

## Licence

Ce module est distribué sous [licence MIT](./LICENSE).

[xcraft-core-log]: https://github.com/Xcraft-Inc/xcraft-core-log
[goblin-overwatch]: https://github.com/Xcraft-Inc/goblin-overwatch

---

_Ce contenu a été généré par IA_
