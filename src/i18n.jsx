import { createContext } from 'preact'
import { useContext, useState, useEffect, useRef } from 'preact/hooks'

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'pt', label: 'PT', name: 'Português' },
]

export const DEFAULT_LANGUAGE = 'en'

const STORAGE_KEY = 'dbwarden-language'

const translations = {
  en: {
    nav: {
      why: 'Why dbwarden',
      howItWorks: 'How it works',
      toolScope: 'Tool scope',
      databases: 'Databases',
      fastapi: 'FastAPI',
      plugins: 'Plugins',
      cliReference: 'CLI reference',
      correctness: 'Correctness',
      compare: 'Compare',
      docs: 'Docs',
      openNavigation: 'Open navigation',
      closeNavigation: 'Close navigation',
      generation: 'Generation',
      safety: 'Safety',
      stateAndOperations: 'State and operations',
      repeatableMigrations: 'Repeatable migrations',
      seeds: 'Seeds',
      observability: 'Observability',
      vsAlembic: 'vs Alembic',
      vsAtlas: 'vs Atlas',
      vsDjango: 'vs Django migrations',
      migrateFromAlembic: 'Migrate from Alembic',
    },
    footer: {
      tagline: 'Declarative database migration infrastructure for SQLAlchemy.',
      toolScope: 'Tool scope',
      databasesAndApps: 'Databases & apps',
      compare: 'Compare',
      community: 'Community',
      github: 'GitHub',
      docs: 'Docs',
      harness: 'Harness',
      issues: 'Issues',
      openSource: 'Fully open source. MIT licensed.',
    },
    accessibility: {
      label: 'Accessibility settings',
      title: 'Accessibility settings',
      fontSize: 'Font size',
      normal: 'A',
      large: 'A',
      highContrast: 'High contrast',
      off: 'Off',
      on: 'On',
    },
    theme: {
      label: 'Toggle color theme',
    },
    language: {
      label: 'Select language',
    },
    home: {
      hero: {
        titleLine1: 'Your models are',
        titleLine2: 'your migrations.',
        subtitle: 'A modern Alembic alternative for SQLAlchemy.',
        kicker: 'declarative schema infrastructure',
        kickerSpan: 'for SQLAlchemy',
        lede: 'Declare the schema once, in SQLAlchemy models. dbwarden derives plain SQL migrations with upgrade and rollback in the same file, and checks the result against the database. Fully open source.',
        readDocs: 'Read the docs',
        sourceGitHub: 'Source on GitHub',
        install: 'uv add dbwarden',
        copied: 'copied',
        copyLabel: 'Copy install command',
      },
      demo: {
        command: 'dbwarden make-migrations "drop username, widen bio"',
        modelFile: 'app/models.py',
        modelLabel: 'the model change',
        migrationFile: 'migrations/0003_add_bio.sql',
        migrationLabel: 'upgrade + rollback in one file',
        upgrade: '-- upgrade',
        rollback: '-- rollback',
      },
      why: {
        eyebrow: 'how it works',
        readGuide: 'Read the guide',
        titleLine1: 'The schema lives',
        titleLine2: 'in the models.',
        intro: 'Most migration workflows describe the schema twice (once in the models, once in the migration scripts), and the two drift unless someone keeps reconciling them. The disagreement usually turns up in production.',
        declarativeLabel: 'declarative',
        declarativeStrong: 'You declare the state.',
        declarativeText: 'SQLAlchemy models describe what the schema should be. dbwarden generates the migration SQL, the rollback, and the checks from that one definition.',
        imperativeLabel: 'imperative',
        imperativeStrong: 'You write every step.',
        imperativeText: 'Revision scripts describe how to get from one schema version to the next. The script chain becomes the schema\'s effective definition.',
        principle1Number: '01',
        principle1Title: 'Models, not migration scripts',
        principle1Text: 'Describe the database with SQLAlchemy models and typed metadata. That\'s the whole schema.',
        principle2Number: '02',
        principle2Title: 'Review the SQL',
        principle2Text: 'dbwarden make-migrations produces a versioned SQL file with upgrade and rollback, ready for the pull request.',
        principle3Number: '03',
        principle3Title: 'Check the database',
        principle3Text: 'Snapshots and live comparisons tell you whether "migration succeeded" actually means the schema matches.',
      },
      verified: {
        eyebrow: 'verified',
        docs: 'The correctness docs',
        titleLine1: 'How the loop',
        titleLine2: 'is verified.',
        intro: 'The checks on this page run in CI and in a harness against real databases. Each one has a page or a repository you can read.',
        convergence: 'Convergence gate',
        convergenceText: 'CI replays the full migration history on an empty database and fails the build if the resulting schema differs from the models.',
        convergenceLink: 'How it works',
        roundTrip: 'Round-trip verification',
        roundTripText: 'A harness applies each migration and its rollback in sequence, and confirms the schema ends up where it started. Rollbacks actually run in CI, instead of existing only on paper.',
        roundTripLink: 'Read the docs',
        realBackends: 'Tested on real backends',
        realBackendsText: 'The harness runs against live PostgreSQL, MySQL, and ClickHouse instances, the same engines the generated SQL targets.',
        realBackendsLink: 'dbwarden-harness',
        honestComparisons: 'Comparisons with the honest parts',
        honestComparisonsText: 'The comparison pages state where each tool fits, including the cases where dbwarden isn\'t the right answer.',
        honestComparisonsLink: 'The comparisons',
      },
      docs: {
        eyebrow: 'choosing a tool',
        allComparisons: 'All comparisons',
        titleLine1: 'Which migration tool',
        titleLine2: 'should you use?',
        intro: 'Deciding between migration tools? The comparisons live on this site: where schema truth lives, what gets reviewed, and where each tool fits. The docs are for people who already chose.',
        vsAlembic: 'dbwarden vs Alembic',
        vsAlembicText: 'Revision scripts versus derived SQL, with honest tradeoffs and a six-step migration path.',
        vsAtlas: 'vs Atlas',
        vsAtlasText: 'Language-agnostic HCL schemas versus a SQLAlchemy-native declarative workflow.',
        compare: 'Compare migration tools',
        compareText: 'Models as authority, plain SQL as the artifact, and where it doesn\'t fit.',
        fastapi: 'FastAPI migrations',
        fastapiText: 'Sessions, health checks, and migrations for FastAPI + SQLAlchemy.',
        migrate: 'Migrate from Alembic',
        migrateText: 'Six steps, none destructive, from revision chain to models.',
        correctness: 'Correctness',
        correctnessText: 'Convergence, rollback verification, and real database testing.',
        alreadyUsing: 'already using dbwarden?',
        allDocs: 'All docs',
      },
      faq: {
        label: 'faq',
        existing: {
          q: 'Does dbwarden work with an existing database and schema?',
          a: 'Yes. `generate-models` reverse-engineers the current schema into SQLAlchemy models, and `recover-model-state` rebuilds model state when the revision chain is gone. Your database is never rebuilt; you replace the migration workflow, not the schema. The `Migrate from Alembic` page walks through the six-step path.',
        },
        supported: {
          q: 'Which databases are supported?',
          a: 'PostgreSQL, MySQL, MariaDB, SQLite, and ClickHouse. Each backend has typed metadata options and its own feature matrix, and dev mode runs the same loop against SQLite. The `Databases` page lists what each backend supports.',
        },
        different: {
          q: 'How is dbwarden different from Alembic?',
          a: 'Alembic keeps schema truth in a hand-maintained chain of revision scripts. dbwarden keeps it in the models and derives plain SQL migrations from them, so the migration file is reviewable output rather than the source of truth. The comparison page shows the difference with code.',
        },
        withoutDb: {
          q: 'Can migrations be generated without a database connection?',
          a: 'Yes. `make-migrations` works from committed model state, so it runs anywhere: locally, in CI, or in a sandbox. Snapshots and live checks can run against a real database when you want them to.',
        },
        verified: {
          q: 'How are migrations verified?',
          a: 'Checksums pin each migration to the model state it was derived from, a harness replays upgrade and rollback round-trips against real databases, and the convergence gate replays the full history on an empty database and fails the build on any drift. See the `Correctness` page.',
        },
        framework: {
          q: 'Is dbwarden tied to a framework?',
          a: 'No. It works with any SQLAlchemy 2.0 stack. The optional `dbwarden-fastapi` plugin adds sessions, health checks, and `@auto_schema` request models for FastAPI apps.',
        },
      },
      community: {
        eyebrow: 'open source',
        titleLine1: 'Open source,',
        titleLine2: 'MIT licensed.',
        text: 'The code lives on GitHub. Read it, report a bug, or build a plugin with the template.',
        source: 'Source on GitHub',
        issues: 'Issues',
        releases: 'Releases',
        pluginTemplate: 'Plugin template',
      },
    },
    notFound: {
      eyebrow: '404',
      titleLine1: 'That page',
      titleLine2: 'doesn\'t exist.',
      intro: "The URL doesn't match anything on this site. It may have moved, or the link that brought you here may be stale.",
      whereToGo: 'where to go',
      startHere: 'Start here',
      startHereText: 'Read how dbwarden works, from model change to verified database.',
      home: 'Home',
      theDocs: 'The docs',
      theDocsText: 'Setup, commands, and the full reference live on the documentation site.',
      docsUrl: 'docs.dbwarden.org',
      keepReading: 'keep reading',
    },
    pageFrame: {
      copyLabel: 'Copy install command',
      copied: 'copied',
    },
  },
  es: {
    nav: {
      why: 'Por qué dbwarden',
      howItWorks: 'Cómo funciona',
      toolScope: 'Alcance de la herramienta',
      databases: 'Bases de datos',
      fastapi: 'FastAPI',
      plugins: 'Plugins',
      cliReference: 'Referencia de CLI',
      correctness: 'Correctitud',
      compare: 'Comparar',
      docs: 'Docs',
      openNavigation: 'Abrir navegación',
      closeNavigation: 'Cerrar navegación',
      generation: 'Generación',
      safety: 'Seguridad',
      stateAndOperations: 'Estado y operaciones',
      repeatableMigrations: 'Migraciones repetibles',
      seeds: 'Seeds',
      observability: 'Observabilidad',
      vsAlembic: 'vs Alembic',
      vsAtlas: 'vs Atlas',
      vsDjango: 'vs Django migrations',
      migrateFromAlembic: 'Migrar desde Alembic',
    },
    footer: {
      tagline: 'Infraestructura declarativa de migración de bases de datos para SQLAlchemy.',
      toolScope: 'Alcance de la herramienta',
      databasesAndApps: 'Bases de datos y apps',
      compare: 'Comparar',
      community: 'Comunidad',
      github: 'GitHub',
      docs: 'Docs',
      harness: 'Harness',
      issues: 'Issues',
      openSource: 'Totalmente open source. Licencia MIT.',
    },
    accessibility: {
      label: 'Configuración de accesibilidad',
      title: 'Configuración de accesibilidad',
      fontSize: 'Tamaño de fuente',
      normal: 'A',
      large: 'A',
      highContrast: 'Alto contraste',
      off: 'No',
      on: 'Sí',
    },
    theme: {
      label: 'Cambiar tema de color',
    },
    language: {
      label: 'Seleccionar idioma',
    },
    home: {
      hero: {
        titleLine1: 'Tus modelos son',
        titleLine2: 'tus migraciones.',
        subtitle: 'Una alternativa moderna a Alembic para SQLAlchemy.',
        kicker: 'infraestructura declarativa de esquemas',
        kickerSpan: 'para SQLAlchemy',
        lede: 'Declara el esquema una vez, en modelos SQLAlchemy. dbwarden deriva migraciones SQL planas con upgrade y rollback en el mismo archivo, y verifica el resultado contra la base de datos. Totalmente open source.',
        readDocs: 'Leer la documentación',
        sourceGitHub: 'Código en GitHub',
        install: 'uv add dbwarden',
        copied: 'copiado',
        copyLabel: 'Copiar comando de instalación',
      },
      demo: {
        command: 'dbwarden make-migrations "drop username, widen bio"',
        modelFile: 'app/models.py',
        modelLabel: 'el cambio en el modelo',
        migrationFile: 'migrations/0003_add_bio.sql',
        migrationLabel: 'upgrade + rollback en un archivo',
        upgrade: '-- upgrade',
        rollback: '-- rollback',
      },
      why: {
        eyebrow: 'cómo funciona',
        readGuide: 'Leer la guía',
        titleLine1: 'El esquema vive',
        titleLine2: 'en los modelos.',
        intro: 'La mayoría de los flujos de migración describen el esquema dos veces (una en los modelos y otra en los scripts de migración), y ambos divergen a menos que alguien los reconcilie. El desacuerdo suele aparecer en producción.',
        declarativeLabel: 'declarativo',
        declarativeStrong: 'Tú declaras el estado.',
        declarativeText: 'Los modelos SQLAlchemy describen cómo debería ser el esquema. dbwarden genera el SQL de migración, el rollback y las verificaciones a partir de esa única definición.',
        imperativeLabel: 'imperativo',
        imperativeStrong: 'Tú escribes cada paso.',
        imperativeText: 'Los scripts de revisión describen cómo pasar de una versión del esquema a la siguiente. La cadena de scripts se convierte en la definición efectiva del esquema.',
        principle1Number: '01',
        principle1Title: 'Modelos, no scripts de migración',
        principle1Text: 'Describe la base de datos con modelos SQLAlchemy y metadatos tipados. Eso es todo el esquema.',
        principle2Number: '02',
        principle2Title: 'Revisa el SQL',
        principle2Text: 'dbwarden make-migrations produce un archivo SQL versionado con upgrade y rollback, listo para el pull request.',
        principle3Number: '03',
        principle3Title: 'Verifica la base de datos',
        principle3Text: 'Las snapshots y comparaciones en vivo te dicen si "la migración fue exitosa" realmente significa que el esquema coincide.',
      },
      verified: {
        eyebrow: 'verificado',
        docs: 'Documentación de correctitud',
        titleLine1: 'Cómo se verifica',
        titleLine2: 'el ciclo.',
        intro: 'Las verificaciones de esta página se ejecutan en CI y en un harness contra bases de datos reales. Cada una tiene una página o un repositorio que puedes consultar.',
        convergence: 'Convergence gate',
        convergenceText: 'CI reproduce el historial completo de migraciones en una base de datos vacía y falla el build si el esquema resultante difiere de los modelos.',
        convergenceLink: 'Cómo funciona',
        roundTrip: 'Verificación de ida y vuelta',
        roundTripText: 'Un harness aplica cada migración y su rollback en secuencia, y confirma que el esquema termina donde empezó. Los rollbacks realmente se ejecutan en CI, en lugar de existir solo en papel.',
        roundTripLink: 'Leer la documentación',
        realBackends: 'Probado en backends reales',
        realBackendsText: 'El harness se ejecuta contra instancias reales de PostgreSQL, MySQL y ClickHouse, los mismos motores a los que apunta el SQL generado.',
        realBackendsLink: 'dbwarden-harness',
        honestComparisons: 'Comparaciones con las partes honestas',
        honestComparisonsText: 'Las páginas de comparación indican dónde encaja cada herramienta, incluidos los casos en los que dbwarden no es la respuesta correcta.',
        honestComparisonsLink: 'Las comparaciones',
      },
      docs: {
        eyebrow: 'elegir una herramienta',
        allComparisons: 'Todas las comparaciones',
        titleLine1: '¿Qué herramienta de migración',
        titleLine2: 'deberías usar?',
        intro: '¿Decidiendo entre herramientas de migración? Las comparaciones están en este sitio: dónde reside la verdad del esquema, qué se revisa y dónde encaja cada herramienta. La documentación es para quienes ya eligieron.',
        vsAlembic: 'dbwarden vs Alembic',
        vsAlembicText: 'Scripts de revisión versus SQL derivado, con tradeoffs honestos y una ruta de migración en seis pasos.',
        vsAtlas: 'vs Atlas',
        vsAtlasText: 'Esquemas HCL independientes del lenguaje versus un flujo declarativo nativo de SQLAlchemy.',
        compare: 'Comparar herramientas de migración',
        compareText: 'Modelos como autoridad, SQL plano como artefacto, y dónde no encaja.',
        fastapi: 'Migraciones para FastAPI',
        fastapiText: 'Sesiones, health checks y migraciones para FastAPI + SQLAlchemy.',
        migrate: 'Migrar desde Alembic',
        migrateText: 'Seis pasos, ninguno destructivo, de la cadena de revisiones a los modelos.',
        correctness: 'Correctitud',
        correctnessText: 'Convergencia, verificación de rollback y pruebas en bases de datos reales.',
        alreadyUsing: '¿ya usas dbwarden?',
        allDocs: 'Toda la documentación',
      },
      faq: {
        label: 'faq',
        existing: {
          q: '¿Funciona dbwarden con una base de datos y un esquema existentes?',
          a: 'Sí. `generate-models` extrae el esquema actual a modelos SQLAlchemy, y `recover-model-state` reconstruye el estado del modelo cuando la cadena de revisiones desaparece. Tu base de datos nunca se reconstruye; reemplazas el flujo de migración, no el esquema. La página `Migrar desde Alembic` describe la ruta de seis pasos.',
        },
        supported: {
          q: '¿Qué bases de datos se soportan?',
          a: 'PostgreSQL, MySQL, MariaDB, SQLite y ClickHouse. Cada backend tiene opciones de metadatos tipados y su propia matriz de características, y el modo dev ejecuta el mismo ciclo contra SQLite. La página `Bases de datos` lista lo que soporta cada backend.',
        },
        different: {
          q: '¿En qué se diferencia dbwarden de Alembic?',
          a: 'Alembic mantiene la verdad del esquema en una cadena de scripts de revisión mantenida a mano. dbwarden la mantiene en los modelos y deriva migraciones SQL planas a partir de ellos, por lo que el archivo de migración es un output revisable en lugar de la fuente de verdad. La página de comparación muestra la diferencia con código.',
        },
        withoutDb: {
          q: '¿Se pueden generar migraciones sin conexión a la base de datos?',
          a: 'Sí. `make-migrations` funciona a partir del estado de modelo confirmado, así que se ejecuta en cualquier lugar: localmente, en CI o en un sandbox. Las snapshots y verificaciones en vivo pueden ejecutarse contra una base de datos real cuando lo desees.',
        },
        verified: {
          q: '¿Cómo se verifican las migraciones?',
          a: 'Los checksums fijan cada migración al estado del modelo del cual se derivó, un harness reproduce viajes de ida y vuelta de upgrade y rollback contra bases de datos reales, y el convergence gate reproduce todo el historial en una base de datos vacía y falla el build ante cualquier drift. Ver la página `Correctitud`.',
        },
        framework: {
          q: '¿dbwarden está atado a un framework?',
          a: 'No. Funciona con cualquier stack SQLAlchemy 2.0. El plugin opcional `dbwarden-fastapi` agrega sesiones, health checks y modelos de request `@auto_schema` para apps FastAPI.',
        },
      },
      community: {
        eyebrow: 'open source',
        titleLine1: 'Open source,',
        titleLine2: 'licencia MIT.',
        text: 'El código está en GitHub. Léelo, reporta un bug o construye un plugin con la plantilla.',
        source: 'Código en GitHub',
        issues: 'Issues',
        releases: 'Releases',
        pluginTemplate: 'Plantilla de plugin',
      },
    },
    notFound: {
      eyebrow: '404',
      titleLine1: 'Esa página',
      titleLine2: 'no existe.',
      intro: 'La URL no coincide con nada en este sitio. Puede haberse movido, o el enlace que te trajo aquí puede estar desactualizado.',
      whereToGo: 'a dónde ir',
      startHere: 'Empieza aquí',
      startHereText: 'Lee cómo funciona dbwarden, desde el cambio de modelo hasta la base de datos verificada.',
      home: 'Inicio',
      theDocs: 'La documentación',
      theDocsText: 'Configuración, comandos y la referencia completa están en el sitio de documentación.',
      docsUrl: 'docs.dbwarden.org',
      keepReading: 'sigue leyendo',
    },
    pageFrame: {
      copyLabel: 'Copiar comando de instalación',
      copied: 'copiado',
    },
  },
  fr: {
    nav: {
      why: 'Pourquoi dbwarden',
      howItWorks: 'Comment ça marche',
      toolScope: 'Périmètre de l\'outil',
      databases: 'Bases de données',
      fastapi: 'FastAPI',
      plugins: 'Plugins',
      cliReference: 'Référence CLI',
      correctness: 'Correction',
      compare: 'Comparer',
      docs: 'Docs',
      openNavigation: 'Ouvrir la navigation',
      closeNavigation: 'Fermer la navigation',
      generation: 'Génération',
      safety: 'Sécurité',
      stateAndOperations: 'État et opérations',
      repeatableMigrations: 'Migrations répétables',
      seeds: 'Seeds',
      observability: 'Observabilité',
      vsAlembic: 'vs Alembic',
      vsAtlas: 'vs Atlas',
      vsDjango: 'vs Django migrations',
      migrateFromAlembic: 'Migrer depuis Alembic',
    },
    footer: {
      tagline: 'Infrastructure déclarative de migration de bases de données pour SQLAlchemy.',
      toolScope: 'Périmètre de l\'outil',
      databasesAndApps: 'Bases de données et apps',
      compare: 'Comparer',
      community: 'Communauté',
      github: 'GitHub',
      docs: 'Docs',
      harness: 'Harness',
      issues: 'Issues',
      openSource: 'Entièrement open source. Licence MIT.',
    },
    accessibility: {
      label: 'Paramètres d\'accessibilité',
      title: 'Paramètres d\'accessibilité',
      fontSize: 'Taille de police',
      normal: 'A',
      large: 'A',
      highContrast: 'Contraste élevé',
      off: 'Non',
      on: 'Oui',
    },
    theme: {
      label: 'Basculer le thème de couleur',
    },
    language: {
      label: 'Choisir la langue',
    },
    home: {
      hero: {
        titleLine1: 'Vos modèles sont',
        titleLine2: 'vos migrations.',
        subtitle: 'Une alternative moderne à Alembic pour SQLAlchemy.',
        kicker: 'infrastructure déclarative de schémas',
        kickerSpan: 'pour SQLAlchemy',
        lede: 'Déclarez le schéma une seule fois, dans des modèles SQLAlchemy. dbwarden dérive des migrations SQL simples avec upgrade et rollback dans le même fichier, et vérifie le résultat contre la base de données. Entièrement open source.',
        readDocs: 'Lire la documentation',
        sourceGitHub: 'Code sur GitHub',
        install: 'uv add dbwarden',
        copied: 'copié',
        copyLabel: 'Copier la commande d\'installation',
      },
      demo: {
        command: 'dbwarden make-migrations "drop username, widen bio"',
        modelFile: 'app/models.py',
        modelLabel: 'le changement de modèle',
        migrationFile: 'migrations/0003_add_bio.sql',
        migrationLabel: 'upgrade + rollback dans un seul fichier',
        upgrade: '-- upgrade',
        rollback: '-- rollback',
      },
      why: {
        eyebrow: 'comment ça marche',
        readGuide: 'Lire le guide',
        titleLine1: 'Le schéma vit',
        titleLine2: 'dans les modèles.',
        intro: 'La plupart des flux de migration décrivent le schéma deux fois (une fois dans les modèles, une fois dans les scripts de migration), et les deux divergent à moins que quelqu\'un ne les réconcilie. Le désaccord apparaît généralement en production.',
        declarativeLabel: 'déclaratif',
        declarativeStrong: 'Vous déclarez l\'état.',
        declarativeText: 'Les modèles SQLAlchemy décrivent ce que le schéma devrait être. dbwarden génère le SQL de migration, le rollback et les vérifications à partir de cette seule définition.',
        imperativeLabel: 'impératif',
        imperativeStrong: 'Vous écrivez chaque étape.',
        imperativeText: 'Les scripts de révision décrivent comment passer d\'une version du schéma à la suivante. La chaîne de scripts devient la définition effective du schéma.',
        principle1Number: '01',
        principle1Title: 'Des modèles, pas des scripts de migration',
        principle1Text: 'Décrivez la base de données avec des modèles SQLAlchemy et des métadonnées typées. C\'est tout le schéma.',
        principle2Number: '02',
        principle2Title: 'Révisez le SQL',
        principle2Text: 'dbwarden make-migrations produit un fichier SQL versionné avec upgrade et rollback, prêt pour la pull request.',
        principle3Number: '03',
        principle3Title: 'Vérifiez la base de données',
        principle3Text: 'Les snapshots et les comparaisons en direct vous disent si "la migration a réussi" signifie réellement que le schéma correspond.',
      },
      verified: {
        eyebrow: 'vérifié',
        docs: 'Documentation de correction',
        titleLine1: 'Comment la boucle',
        titleLine2: 'est vérifiée.',
        intro: 'Les vérifications de cette page s\'exécutent en CI et dans un harness contre des bases de données réelles. Chacune a une page ou un référentiel que vous pouvez consulter.',
        convergence: 'Convergence gate',
        convergenceText: 'CI rejoue l\'historique complet des migrations sur une base de données vide et échoue le build si le schéma résultant diffère des modèles.',
        convergenceLink: 'Comment ça marche',
        roundTrip: 'Vérification aller-retour',
        roundTripText: 'Un harness applique chaque migration et son rollback en séquence, et confirme que le schéma se termine là où il a commencé. Les rollbacks s\'exécutent réellement en CI, au lieu d\'exister uniquement sur le papier.',
        roundTripLink: 'Lire la documentation',
        realBackends: 'Testé sur des backends réels',
        realBackendsText: 'Le harness s\'exécute contre des instances réelles de PostgreSQL, MySQL et ClickHouse, les mêmes moteurs que cible le SQL généré.',
        realBackendsLink: 'dbwarden-harness',
        honestComparisons: 'Comparaisons avec les parties honnêtes',
        honestComparisonsText: 'Les pages de comparaison indiquent où chaque outil s\'intègre, y compris les cas où dbwarden n\'est pas la bonne réponse.',
        honestComparisonsLink: 'Les comparaisons',
      },
      docs: {
        eyebrow: 'choisir un outil',
        allComparisons: 'Toutes les comparaisons',
        titleLine1: 'Quel outil de migration',
        titleLine2: 'devriez-vous utiliser ?',
        intro: 'Vous hésitez entre outils de migration ? Les comparaisons sont sur ce site : où réside la vérité du schéma, ce qui est révisé et où chaque outil s\'intègre. La documentation est pour ceux qui ont déjà choisi.',
        vsAlembic: 'dbwarden vs Alembic',
        vsAlembicText: 'Scripts de révision versus SQL dérivé, avec des compromis honnêtes et un chemin de migration en six étapes.',
        vsAtlas: 'vs Atlas',
        vsAtlasText: 'Schémas HCL indépendants du langage versus un flux déclaratif natif SQLAlchemy.',
        compare: 'Comparer les outils de migration',
        compareText: 'Les modèles comme autorité, le SQL simple comme artefact, et où cela ne convient pas.',
        fastapi: 'Migrations FastAPI',
        fastapiText: 'Sessions, health checks et migrations pour FastAPI + SQLAlchemy.',
        migrate: 'Migrer depuis Alembic',
        migrateText: 'Six étapes, aucune destructive, de la chaîne de révisions aux modèles.',
        correctness: 'Correction',
        correctnessText: 'Convergence, vérification de rollback et tests sur des bases de données réelles.',
        alreadyUsing: 'vous utilisez déjà dbwarden ?',
        allDocs: 'Toute la documentation',
      },
      faq: {
        label: 'faq',
        existing: {
          q: 'dbwarden fonctionne-t-il avec une base de données et un schéma existants ?',
          a: 'Oui. `generate-models` rétroconçoit le schéma actuel en modèles SQLAlchemy, et `recover-model-state` reconstruit l\'état du modèle lorsque la chaîne de révisions a disparu. Votre base de données n\'est jamais reconstruite ; vous remplacez le flux de migration, pas le schéma. La page `Migrer depuis Alembic` détaille le chemin en six étapes.',
        },
        supported: {
          q: 'Quelles bases de données sont prises en charge ?',
          a: 'PostgreSQL, MySQL, MariaDB, SQLite et ClickHouse. Chaque backend dispose d\'options de métadonnées typées et de sa propre matrice de fonctionnalités, et le mode dev exécute la même boucle contre SQLite. La page `Bases de données` liste ce que chaque backend prend en charge.',
        },
        different: {
          q: 'En quoi dbwarden diffère-t-il d\'Alembic ?',
          a: 'Alembic conserve la vérité du schéma dans une chaîne de scripts de révision maintenue à la main. dbwarden la conserve dans les modèles et dérive des migrations SQL simples à partir d\'eux, de sorte que le fichier de migration est un output révisable plutôt que la source de vérité. La page de comparaison montre la différence avec du code.',
        },
        withoutDb: {
          q: 'Les migrations peuvent-elles être générées sans connexion à la base de données ?',
          a: 'Oui. `make-migrations` fonctionne à partir de l\'état du modèle commité, il peut donc s\'exécuter n\'importe où : localement, en CI ou dans un sandbox. Les snapshots et les vérifications en direct peuvent s\'exécuter contre une base de données réelle lorsque vous le souhaitez.',
        },
        verified: {
          q: 'Comment les migrations sont-elles vérifiées ?',
          a: 'Les checksums épinglent chaque migration à l\'état du modèle dont elle est dérivée, un harness rejoue les allers-retours upgrade et rollback contre des bases de données réelles, et le convergence gate rejoue tout l\'historique sur une base de données vide et échoue le build en cas de drift. Voir la page `Correction`.',
        },
        framework: {
          q: 'dbwarden est-il lié à un framework ?',
          a: 'Non. Il fonctionne avec n\'importe quelle stack SQLAlchemy 2.0. Le plugin optionnel `dbwarden-fastapi` ajoute des sessions, des health checks et des modèles de requête `@auto_schema` pour les applications FastAPI.',
        },
      },
      community: {
        eyebrow: 'open source',
        titleLine1: 'Open source,',
        titleLine2: 'licence MIT.',
        text: 'Le code est sur GitHub. Lisez-le, signalez un bug ou construisez un plugin avec le modèle.',
        source: 'Code sur GitHub',
        issues: 'Issues',
        releases: 'Releases',
        pluginTemplate: 'Modèle de plugin',
      },
    },
    notFound: {
      eyebrow: '404',
      titleLine1: 'Cette page',
      titleLine2: 'n\'existe pas.',
      intro: 'L\'URL ne correspond à rien sur ce site. Elle a peut-être été déplacée, ou le lien qui vous a amené ici est peut-être obsolète.',
      whereToGo: 'où aller',
      startHere: 'Commencez ici',
      startHereText: 'Lisez comment fonctionne dbwarden, du changement de modèle à la base de données vérifiée.',
      home: 'Accueil',
      theDocs: 'La documentation',
      theDocsText: 'Configuration, commandes et la référence complète sont sur le site de documentation.',
      docsUrl: 'docs.dbwarden.org',
      keepReading: 'poursuivre la lecture',
    },
    pageFrame: {
      copyLabel: 'Copier la commande d\'installation',
      copied: 'copié',
    },
  },
  pt: {
    nav: {
      why: 'Por que dbwarden',
      howItWorks: 'Como funciona',
      toolScope: 'Escopo da ferramenta',
      databases: 'Bancos de dados',
      fastapi: 'FastAPI',
      plugins: 'Plugins',
      cliReference: 'Referência de CLI',
      correctness: 'Corretude',
      compare: 'Comparar',
      docs: 'Docs',
      openNavigation: 'Abrir navegação',
      closeNavigation: 'Fechar navegação',
      generation: 'Geração',
      safety: 'Segurança',
      stateAndOperations: 'Estado e operações',
      repeatableMigrations: 'Migrações repetíveis',
      seeds: 'Seeds',
      observability: 'Observabilidade',
      vsAlembic: 'vs Alembic',
      vsAtlas: 'vs Atlas',
      vsDjango: 'vs Django migrations',
      migrateFromAlembic: 'Migrar do Alembic',
    },
    footer: {
      tagline: 'Infraestrutura declarativa de migração de bancos de dados para SQLAlchemy.',
      toolScope: 'Escopo da ferramenta',
      databasesAndApps: 'Bancos de dados e apps',
      compare: 'Comparar',
      community: 'Comunidade',
      github: 'GitHub',
      docs: 'Docs',
      harness: 'Harness',
      issues: 'Issues',
      openSource: 'Totalmente open source. Licença MIT.',
    },
    accessibility: {
      label: 'Configurações de acessibilidade',
      title: 'Configurações de acessibilidade',
      fontSize: 'Tamanho da fonte',
      normal: 'A',
      large: 'A',
      highContrast: 'Alto contraste',
      off: 'Não',
      on: 'Sim',
    },
    theme: {
      label: 'Alternar tema de cor',
    },
    language: {
      label: 'Selecionar idioma',
    },
    home: {
      hero: {
        titleLine1: 'Seus modelos são',
        titleLine2: 'suas migrações.',
        subtitle: 'Uma alternativa moderna ao Alembic para SQLAlchemy.',
        kicker: 'infraestrutura declarativa de schemas',
        kickerSpan: 'para SQLAlchemy',
        lede: 'Declare o schema uma vez, em modelos SQLAlchemy. O dbwarden deriva migrações SQL simples com upgrade e rollback no mesmo arquivo, e verifica o resultado contra o banco de dados. Totalmente open source.',
        readDocs: 'Ler a documentação',
        sourceGitHub: 'Código no GitHub',
        install: 'uv add dbwarden',
        copied: 'copiado',
        copyLabel: 'Copiar comando de instalação',
      },
      demo: {
        command: 'dbwarden make-migrations "drop username, widen bio"',
        modelFile: 'app/models.py',
        modelLabel: 'a mudança no modelo',
        migrationFile: 'migrations/0003_add_bio.sql',
        migrationLabel: 'upgrade + rollback em um arquivo',
        upgrade: '-- upgrade',
        rollback: '-- rollback',
      },
      why: {
        eyebrow: 'como funciona',
        readGuide: 'Ler o guia',
        titleLine1: 'O schema vive',
        titleLine2: 'nos modelos.',
        intro: 'A maioria dos fluxos de migração descreve o schema duas vezes (uma nos modelos, outra nos scripts de migração), e os dois divergem a menos que alguém os reconcilie. O desacordo geralmente aparece em produção.',
        declarativeLabel: 'declarativo',
        declarativeStrong: 'Você declara o estado.',
        declarativeText: 'Os modelos SQLAlchemy descrevem como o schema deve ser. O dbwarden gera o SQL de migração, o rollback e as verificações a partir dessa única definição.',
        imperativeLabel: 'imperativo',
        imperativeStrong: 'Você escreve cada passo.',
        imperativeText: 'Os scripts de revisão descrevem como ir de uma versão do schema para a próxima. A cadeia de scripts se torna a definição efetiva do schema.',
        principle1Number: '01',
        principle1Title: 'Modelos, não scripts de migração',
        principle1Text: 'Descreva o banco de dados com modelos SQLAlchemy e metadados tipados. Isso é todo o schema.',
        principle2Number: '02',
        principle2Title: 'Revise o SQL',
        principle2Text: 'dbwarden make-migrations produz um arquivo SQL versionado com upgrade e rollback, pronto para o pull request.',
        principle3Number: '03',
        principle3Title: 'Verifique o banco de dados',
        principle3Text: 'Snapshots e comparações em tempo real dizem se "a migração foi bem-sucedida" realmente significa que o schema corresponde.',
      },
      verified: {
        eyebrow: 'verificado',
        docs: 'Documentação de corretude',
        titleLine1: 'Como o ciclo',
        titleLine2: 'é verificado.',
        intro: 'As verificações desta página são executadas em CI e em um harness contra bancos de dados reais. Cada uma tem uma página ou um repositório que você pode ler.',
        convergence: 'Convergence gate',
        convergenceText: 'O CI reproduz o histórico completo de migrações em um banco de dados vazio e falha o build se o schema resultante diferir dos modelos.',
        convergenceLink: 'Como funciona',
        roundTrip: 'Verificação de ida e volta',
        roundTripText: 'Um harness aplica cada migração e seu rollback em sequência, e confirma que o schema termina onde começou. Os rollbacks realmente são executados em CI, em vez de existirem apenas no papel.',
        roundTripLink: 'Ler a documentação',
        realBackends: 'Testado em backends reais',
        realBackendsText: 'O harness é executado contra instâncias reais de PostgreSQL, MySQL e ClickHouse, os mesmos motores que o SQL gerado visa.',
        realBackendsLink: 'dbwarden-harness',
        honestComparisons: 'Comparações com as partes honestas',
        honestComparisonsText: 'As páginas de comparação indicam onde cada ferramenta se encaixa, incluindo os casos em que o dbwarden não é a resposta certa.',
        honestComparisonsLink: 'As comparações',
      },
      docs: {
        eyebrow: 'escolher uma ferramenta',
        allComparisons: 'Todas as comparações',
        titleLine1: 'Qual ferramenta de migração',
        titleLine2: 'você deve usar?',
        intro: 'Decidindo entre ferramentas de migração? As comparações estão neste site: onde reside a verdade do schema, o que é revisado e onde cada ferramenta se encaixa. A documentação é para quem já escolheu.',
        vsAlembic: 'dbwarden vs Alembic',
        vsAlembicText: 'Scripts de revisão versus SQL derivado, com tradeoffs honestos e um caminho de migração em seis passos.',
        vsAtlas: 'vs Atlas',
        vsAtlasText: 'Schemas HCL independentes de linguagem versus um fluxo declarativo nativo do SQLAlchemy.',
        compare: 'Comparar ferramentas de migração',
        compareText: 'Modelos como autoridade, SQL simples como artefato, e onde não se encaixa.',
        fastapi: 'Migrações FastAPI',
        fastapiText: 'Sessions, health checks e migrações para FastAPI + SQLAlchemy.',
        migrate: 'Migrar do Alembic',
        migrateText: 'Seis passos, nenhum destrutivo, da cadeia de revisões aos modelos.',
        correctness: 'Corretude',
        correctnessText: 'Convergência, verificação de rollback e testes em bancos de dados reais.',
        alreadyUsing: 'já usa dbwarden?',
        allDocs: 'Toda a documentação',
      },
      faq: {
        label: 'faq',
        existing: {
          q: 'O dbwarden funciona com um banco de dados e schema existentes?',
          a: 'Sim. `generate-models` faz a engenharia reversa do schema atual em modelos SQLAlchemy, e `recover-model-state` reconstrói o estado do modelo quando a cadeia de revisões desaparece. Seu banco de dados nunca é reconstruído; você substitui o fluxo de migração, não o schema. A página `Migrar do Alembic` descreve o caminho de seis passos.',
        },
        supported: {
          q: 'Quais bancos de dados são suportados?',
          a: 'PostgreSQL, MySQL, MariaDB, SQLite e ClickHouse. Cada backend tem opções de metadados tipados e sua própria matriz de recursos, e o modo dev executa o mesmo ciclo contra SQLite. A página `Bancos de dados` lista o que cada backend suporta.',
        },
        different: {
          q: 'Como o dbwarden difere do Alembic?',
          a: 'O Alembic mantém a verdade do schema em uma cadeia de scripts de revisão mantida manualmente. O dbwarden a mantém nos modelos e deriva migrações SQL simples a partir deles, então o arquivo de migração é um output revisável em vez da fonte da verdade. A página de comparação mostra a diferença com código.',
        },
        withoutDb: {
          q: 'As migrações podem ser geradas sem conexão com o banco de dados?',
          a: 'Sim. `make-migrations` funciona a partir do estado de modelo commitado, então pode ser executado em qualquer lugar: localmente, em CI ou em um sandbox. Snapshots e verificações em tempo real podem ser executados contra um banco de dados real quando desejar.',
        },
        verified: {
          q: 'Como as migrações são verificadas?',
          a: 'Checksums fixam cada migração ao estado do modelo do qual foi derivada, um harness reproduz viagens de ida e volta de upgrade e rollback contra bancos de dados reais, e o convergence gate reproduz todo o histórico em um banco de dados vazio e falha o build em caso de drift. Veja a página `Corretude`.',
        },
        framework: {
          q: 'O dbwarden está vinculado a um framework?',
          a: 'Não. Funciona com qualquer stack SQLAlchemy 2.0. O plugin opcional `dbwarden-fastapi` adiciona sessions, health checks e modelos de request `@auto_schema` para apps FastAPI.',
        },
      },
      community: {
        eyebrow: 'open source',
        titleLine1: 'Open source,',
        titleLine2: 'licença MIT.',
        text: 'O código está no GitHub. Leia-o, relate um bug ou construa um plugin com o template.',
        source: 'Código no GitHub',
        issues: 'Issues',
        releases: 'Releases',
        pluginTemplate: 'Template de plugin',
      },
    },
    notFound: {
      eyebrow: '404',
      titleLine1: 'Essa página',
      titleLine2: 'não existe.',
      intro: 'A URL não corresponde a nada neste site. Ela pode ter sido movida, ou o link que trouxe você aqui pode estar desatualizado.',
      whereToGo: 'para onde ir',
      startHere: 'Comece aqui',
      startHereText: 'Leia como o dbwarden funciona, da mudança de modelo ao banco de dados verificado.',
      home: 'Início',
      theDocs: 'A documentação',
      theDocsText: 'Configuração, comandos e a referência completa estão no site de documentação.',
      docsUrl: 'docs.dbwarden.org',
      keepReading: 'continue lendo',
    },
    pageFrame: {
      copyLabel: 'Copiar comando de instalação',
      copied: 'copiado',
    },
  },
}

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

function createI18nContext() {
  return createContext({
    lang: DEFAULT_LANGUAGE,
    setLang: () => {},
    t: (key) => key,
  })
}

const I18nContext = createI18nContext()

export function I18nProvider({ children }) {
  const isBrowser = typeof window !== 'undefined'

  const [lang, setLangState] = useState(() => {
    if (!isBrowser) return DEFAULT_LANGUAGE
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && LANGUAGES.some((l) => l.code === stored)) return stored
    } catch {}
    if (typeof navigator !== 'undefined' && navigator.language) {
      const preferred = navigator.language.split('-')[0]
      if (LANGUAGES.some((l) => l.code === preferred)) return preferred
    }
    return DEFAULT_LANGUAGE
  })

  const setLang = (next) => {
    if (LANGUAGES.some((l) => l.code === next)) {
      setLangState(next)
      if (isBrowser) {
        try { localStorage.setItem(STORAGE_KEY, next) } catch {}
        document.documentElement.lang = next
      }
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [lang])

  const t = (key, fallback) => {
    const value = getNested(translations[lang], key)
    if (value !== undefined) return value
    if (fallback !== undefined) return fallback
    const defaultValue = getNested(translations[DEFAULT_LANGUAGE], key)
    return defaultValue !== undefined ? defaultValue : key
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}

export function LanguageSwitch() {
  const { t, lang, setLang } = useI18n()
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="language-wrap" ref={wrapRef}>
      <button
        className={open ? 'language-button is-open' : 'language-button'}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('language.label')}
      >
        <span className="language-current">{current.label}</span>
        <span className="language-caret" aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="language-panel" role="listbox" aria-label={t('language.label')}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === lang}
              className={l.code === lang ? 'language-option is-active' : 'language-option'}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
            >
              <span className="language-option-code">{l.label}</span>
              <span className="language-option-name">{l.name}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
