# Von der Domain Story zum Prototyp - Specification-driven Prototyping in DDD Workshops

Gerade haben Sie einen erfolgreichen Domain-Storytelling-Workshop durchgeführt. Das Miro-Board ist übersät mit Piktogrammen, nummerierten Pfeilen und Arbeitsobjekten — überall Stickies, alles miteinander verbunden. Das gesamte Board lebt von der Logik der Domäne. In den Frames stecken die Domain Stories; Akteure bewegen sich durch eine Abfolge von Aktivitäten. In einem anderen Frame steckt das Visual Glossary: Sticky Notes, die die Begriffe und Beziehungen festhalten, die die Domänenexperten tatsächlich verwenden. Alle haben genickt. Die richtigen Fragen wurden gestellt. Die Session war ein Erfolg.

Dann kommt der Montag. Der Link zum Miro-Board wird gespeichert. Der Export landet in einem freigegebenen Ordner. Und nichts hat sich verändert.

Das ist die klassische Lücke zwischen Erkenntnis und Umsetzung. Domain Storytelling hilft dabei, eine Domäne zu verstehen. Aber Verstehen heißt noch nicht Validieren — und zwischen beidem liegt ein entscheidender Unterschied. Dieser Beitrag zeigt, wie diese Lücke schnell geschlossen werden kann: mit genau den Artefakten, die der Workshop bereits produziert hat.

---

## Domain Storytelling kurz erklärt

Für alle, die die Methode noch nicht kennen: Domain Storytelling ist eine kollaborative Modellierungstechnik, bei der Domänenexperten erzählen, wie ihre Arbeit tatsächlich abläuft oder ablaufen soll, während ein Moderator die Geschichte in einer einfachen visuellen Sprache festhält. Das Ergebnis ist eine Domain Story: ein Diagramm, das zeigt, wer was mit welchen Objekten tut — in klarer, nummerierter Reihenfolge.

Jede Domain Story besteht aus drei Arten von Elementen:

- **Akteure** — die Menschen oder Systeme, die die Arbeit erledigen (z. B. *Pendler*, *Mechaniker*, *App*)
- **Arbeitsobjekte** — die Dinge, mit denen gearbeitet wird (z. B. *Fahrrad*, *Code*, *Monatsbeitrag*)
- **Aktivitäten** — was Akteure mit diesen Objekten tun (z. B. *bucht*, *entsperrt*, *gibt zurück*)

Parallel dazu entsteht ein **Visual Glossary**. Es definiert Begriffe nicht isoliert — stattdessen hält es fest, wie Konzepte durch starke Verben miteinander in Beziehung stehen: Ein Pendler *verwendet* einen Code, ein Code *entsperrt* ein Schloss, ein Fahrradständer *enthält* Schlösser, ein Fahrradständer *speichert* Fahrräder. Die Bedeutung jedes Begriffs ergibt sich aus diesen Beziehungen, nicht aus einem Wörterbucheintrag. Am Ende der Session liegen zwei komplementäre Artefakte vor: eine Story, die den Ablauf darstellt, und ein Glossary, das das Vokabular erklärt.

Die meisten Teams behandeln das Glossary als Referenzartefakt — schön, es zu haben, aber nicht mehr. Dieser Beitrag argumentiert, dass man mit beiden Artefakten bereits alles in der Hand hat, was man braucht, um einen funktionierenden Prototypen zu bauen — und ihn den Domänenexperten noch vor Ende der Session zu zeigen.

---

## Prototyp schon fast sichtbar

Hier ist die Erkenntnis, die alles verändert: Das Visual Glossary und die Domain Story bilden zusammen nahezu direkt die Bausteine eines Software-Prototyps.

| Domain-Storytelling-Element | Prototyp-Äquivalent |
|-----------------------------|---------------------|
| Akteur | Benutzerrolle |
| Arbeitsobjekt | Datenentität / UI-Karte / Formular |
| Aktivität | Screen / Aktion / Schaltfläche |
| Abfolge von Aktivitäten | User Flow / Navigationspfad |

Wer das Visual Glossary und die Domain Story durch diese Brille betrachtet, sieht keine Sticky Notes mehr — sondern eine Liste von Screens, die gebaut werden müssen, und Entitäten, die modelliert werden wollen. Die Domänenexperten haben bereits gesagt, was wichtig ist. Sie haben die Dinge benannt, die Abläufe beschrieben und die Formen gezeichnet. Man muss es nur noch rendern.

Der Prototyp muss nicht vollständig sein. Er braucht keine Datenbank, kein Error Handling und keinen produktionsreifen Code. Er muss die Sprache der Domäne gut genug sprechen, damit die Menschen, die in dieser Domäne leben, darauf zeigen und sagen können: *genau so* — oder *nein, so funktioniert das nicht*.

---

## Ein konkretes Beispiel: das Fahrradverleihsystem

Vor einigen Tagen habe ich einen Domain-Storytelling-Workshop mit einem Team durchgeführt, das ein Fahrradverleihssystem für Stadtpendler entwickelt. Das Ziel war, zu verstehen, wie das System in der Praxis funktionieren würde — von einem Mechaniker, der Fahrräder bereitstellt, bis hin zu einem Pendler, der eines an einer Haltestelle des öffentlichen Nahverkehrs entsperrt und es in der Nähe seines Zuhauses zurückgibt.

Die Domain Story hielt zehn nummerierte Aktivitäten über zwei Akteure fest. Ein Mechaniker bringt ein Fahrrad zu einem Fahrradständer. Ein Pendler registriert sich in der App, zahlt einen Monatsbeitrag, sucht nach einem Fahrrad an einer Haltestelle des öffentlichen Nahverkehrs, bucht es über die App, erhält einen Code und entsperrt das Fahrrad mit diesem Code am Fahrradständer. Dann fährt der Pendler nach Hause, gibt das Fahrrad an einem Fahrradständer in der Nähe seines Zuhauses zurück und bestätigt die Rückgabe per Code.

![Bild: Domain Story — die Domain Story des Fahrradverleihsystems aus Miro, mit der vollständigen Abfolge von zehn Aktivitäten über die Akteure Mechaniker und Pendler](https://eu-central-1.graphassets.com/AiE4QoWSSiIQO3k152ugkz/cmna9n53jjhjp08t8f802zn4a)

Parallel dazu entstand das Visual Glossary neben der Story und hielt sechs Begriffe und deren Beziehungen fest: Ein Pendler *verwendet* einen Code, ein Code *entsperrt* ein Schloss, ein Fahrradständer *enthält* Schlösser, ein Fahrradständer *speichert* Fahrräder und ein Pendler *zahlt* einen Monatsbeitrag. Die Bedeutung jedes Begriffs ergab sich aus diesen Beziehungen, nicht aus Beschreibungen.

![Bild: Visual Glossary — das Miro-Sticky-Note-Diagramm mit Pendler, Fahrrad, Fahrradständer, Schloss, Code und Monatsbeitrag sowie den Beziehungen zwischen ihnen](https://eu-central-1.graphassets.com/AiE4QoWSSiIQO3k152ugkz/cmna9nslzjhr608t8necjor4a)

Am Ende der Session nahm ich beide Artefakte — die Domain Story und das Visual Glossary — und übergab sie zusammen mit einer Beispiel-Webseite an eine KI, um den visuellen Stil und die Formatierung zu definieren. Und forderte sie auf, einen funktionierenden Prototyp zu bauen.

> *"Create a clickable webapp prototype out of a provided Domain Story for the process and a Visual Glossary for the domain language. For formatting, use the provided screenshot."*

![Bild: Beispiel-Webseite — der Screenshot, der zur Definition des visuellen Stils und der Formatierung des Prototypen verwendet wurde](https://eu-central-1.graphassets.com/AiE4QoWSSiIQO3k152ugkz/cmna9z6znjoe608t84eh8no0g)

Zehn Minuten später hatten wir einen lauffähigen [HTML-Prototypen](https://github.com/Grinseteddy/blogpost/blob/main/DomainStoryPrototype/samples/velopass_webapp_prototype.html).

![Prototype.jpg](https://eu-central-1.graphassets.com/AiE4QoWSSiIQO3k152ugkz/cmnaa14ixi8b806uprsfuf78j)

Die Screens folgten direkt aus der Domain Story — einer zum Finden eines verfügbaren Fahrrads an einem Fahrradständer, einer zum Buchen und zum Erhalten eines Codes, einer für die aktive Fahrt und einer für die Rückgabe des Fahrrads. Die Story hatte die Navigation für uns gezeichnet.

Jede Beschriftung, jeder Feldname und jede Schaltfläche verwendeten das genaue Vokabular aus dem Glossary. Nicht „Fahrzeug" — *Fahrrad*. Nicht „Station" — *Fahrradständer*. Nicht „PIN" — *Code*. Nicht „Fahrt beenden" — *Fahrrad zurückgeben*. Eigene Begriffe musste die KI nicht erfinden — sie hatte das Glossary direkt vor sich.

Ich zeigte dies dem Team, noch bevor der Workshop endete.

---

## Was im Raum passierte

Die Reaktion war unmittelbar — und aufschlussreich.

Innerhalb von zwei Minuten zeigte einer der Domänenexperten auf dem Screen die verfügbaren Fahrräder und fragte: „Was passiert, wenn ein Pendler zum Fahrradständer kommt und das Fahrrad bereits weg ist — funktioniert der Code dann noch?" Die Domain Story hatte das Zeitfenster zwischen Buchung und Ankunft nicht abgedeckt. Es war eine echte Race Condition, die noch niemand benannt hatte.

Ein anderer Teilnehmer sah auf den Rückgabe-Screen und sagte: „Der Pendler bestätigt die Rückgabe per Code — aber das System sollte auch prüfen, ob das Schloss tatsächlich geschlossen ist. Das sind zwei verschiedene Dinge." Auch das: nicht in der Story, nicht im Glossary — aber sofort sichtbar, sobald es etwas zu reagieren gab.

Ein Entwickler fragte: „Ist ein Code einmalig verwendbar? Kann ich entsperren, wieder sperren und im selben Ausleihvorgang nochmals entsperren?" Eine Frage, hinter der sich eine echte Geschäftsregel verbarg — und die ohne Klärung zu einem stillen Fehler geführt hätte.

Solche Fragen tauchen auch im Domain-Storytelling-Workshop selbst auf. Aber der Prototyp aktiviert eine andere Denkweise — die des Benutzers statt der des Erzählers. Und genau das bringt zusätzliche Erkenntnisse ans Licht.

Der entscheidende Vorteil liegt in der KI: Der Prototyp entsteht noch während des Workshops — nicht ein oder zwei Wochen später, wenn die Energie längst verflogen ist.

---

## So geht es selbst

Die Methode ist einfacher als erwartet. Man braucht drei Dinge:

- Die **Domain Story** — exportiert oder als Screenshot vom Miro-Board
- Das **Visual Glossary** — die Sticky-Note-Beziehungsübersicht vom selben Board
- Eine **Beispiel-Webseite** — ein Screenshot einer bestehenden Oberfläche, deren visuellen Stil und Formatierung der Prototyp übernehmen soll

Alle drei übergibt man einer KI.

Das war's. Die Domain Story teilt der KI mit, welche Screens in welcher Reihenfolge erstellt werden sollen. Das Visual Glossary sagt ihr, wie alles heißt. Die Beispielseite zeigt ihr, wie es aussehen soll. Es bleibt nichts mehr zu spezifizieren — denn der Workshop hat die Arbeit bereits erledigt.

---

## Warum das die Kollaboration verändert

Es passiert etwas, wenn Domänenexperten ihr Vokabular in einer funktionsfähigen Benutzeroberfläche sehen. Sie hören auf, Erzähler zu sein, und werden zu Kritikern — im besten Sinne des Wortes.

Eine Domain Story fragt: *Was soll getan werden?* Ein Prototyp fragt: *Ist das so gemeint?* Das sind verschiedene Fragen, und sie bringen unterschiedliche Informationen ans Licht. Die erste lädt zur Beschreibung ein. Die zweite lädt zur Korrektur ein.

Die Lücken, Sonderfälle und unausgesprochenen Annahmen, die im Workshop nicht aufgetaucht sind, tauchen in fünf Minuten auf, wenn man in einen Prototyp klickt. Nicht weil die Experten etwas zurückgehalten hätten — sondern weil Software implizites Wissen auf eine Weise sichtbar macht, wie es Gespräche und Diagramme nicht können.

Domain Storytelling liefert bereits das gesamte Rohmaterial. Das Visual Glossary definiert die Begriffe und deren Beziehungen. Die Domain Story und das Visual Glossary sind nicht nur Workshop-Outputs — sie sind die Spezifikation. Der Prototyp folgt direkt daraus. Mit einer KI, die das Rendering übernimmt, geht es so schnell, dass der Prototyp noch im Workshop entsteht — und nicht erst Tage später.

Ein Prototyp, der aus der Domain Story und dem Visual Glossary gebaut wird, ist kein Lieferobjekt — er ist eine Frage, die in einer Sprache gestellt wird, die eine ehrliche Antwort erhält.

---

*Setzen Sie Domain Storytelling in Ihren Projekten ein? Ich freue mich darauf, zu hören, wie Sie die Lücke zwischen Workshop und Validierung schließen — melden Sie sich.*