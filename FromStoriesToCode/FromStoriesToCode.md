# From Stories to Code: How Domain Storytelling and EventStorming Give LLMs the Context They Need

---

## 1. The Broken Promise of AI-Assisted Development

By now, most development teams have tried using an LLM to generate code. The results are familiar: syntactically correct, superficially plausible, and frequently wrong in ways that take hours to diagnose. The model confidently generates endpoints that don't reflect your domain, schemas that miss your business rules, and structures that look reasonable until a domain expert asks a single question and the whole thing unravels.

The temptation is to blame the model. But that's the wrong perspective.

LLMs don't fail at domain work because they're not smart. They fail because they have no access to your domain. They don't know that a Cook cannot rate their own Recipe. They don't know that a Recipe needs a unique title. They don't know that "Making" and "HowTo" are the same concept in two different conversations. They produce plausible generic code because plausible generic code is what they were trained on — and unless you give them something more precise, that's exactly what they'll keep producing.

The missing ingredient isn't a better model or a cleverer prompt. It's a better specification. And that's where collaborative modeling comes in.

This post shows how Domain Storytelling [1] and EventStorming [2] — techniques most of you already know — produce artifacts that are not just useful for human communication but directly usable as LLM context. The result is a prototype pipeline where each modeling step reduces ambiguity and produces measurably better generated output. We'll demonstrate this concretely using **CookWithUs**, a recipe-sharing platform we built from scratch across three prototype iterations.

---

## 2. The Core Idea: Ambiguity Is the Enemy

An LLM prompt is only as good as the context it contains. This is not a controversial claim — it's the fundamental constraint of how these models work. Feed them vague input, get vague output. Feed them precise, structured, domain-grounded input, get precise, structured, domain-grounded output.

> **&#9432; NOTE**: Ambiguity is the enemy since the first software was written. It is not a new problem. Eric Evans already tackled the problem in his groundbreaking work "Domain-Driven Design" in 2003 [3].

The challenge is that most developers approach LLM-assisted prototyping the way they'd approach a Google search: a short description of what they want, with the model expected to fill in the rest. The model obliges — and fills in the rest with generic assumptions derived from the thousands of similar systems it has seen during training.

Collaborative modeling techniques solve a different problem for human teams: they surface tacit knowledge, resolve ambiguity, and build shared understanding. But as a side effect, they produce artifacts — Domain Stories [1], Event Boards [2], Visual Glossaries [4] — that are remarkably well-structured as LLM input. The pictographic language of Domain Storytelling maps cleanly to actors and work objects. The command/event/policy structure of EventStorming [2] maps directly to API operations and business rules. An OpenAPI spec [5] derived from those artifacts is, essentially, a machine-readable domain model.

The thread connecting all three is the **Ubiquitous Language** [3] — the shared vocabulary that emerges from collaborative modeling sessions and grows more precise with each step. In the context of LLM-assisted development, the quality of that language directly determines the quality of the generated output.

The pipeline we'll demonstrate has three steps:

- **Domain Storytelling** — captures intent and produces a first vocabulary
- **EventStorming** — sharpens that vocabulary into events, commands, and policies
- **OpenAPI Spec** — encodes the result as a machine-readable contract

At each step, we feed the artifacts directly to an LLM and generate a prototype. Let's see what happens.

---

## 3. Step One — Domain Storytelling: Capturing Intent

### The Artifact

We ran a Domain Storytelling workshop for CookWithUs and produced the following story:

> *An Anonymous user registers via the App and becomes a Cook. A Cook prepares a Meal and shares a Recipe, optionally with pictures. A different Cook tries that Recipe, also optionally taking pictures, and rates it.*



The pictographic story captures six numbered activities across two Cook actors, making the role distinction between author and rater visually explicit. Alongside it, we built a first Visual Glossary that identified three bounded contexts — **Register**, **Sharing**, and **Rating** — and detailed the structure of key concepts: Cook (with email), Recipe (with Ingredients, Making, and Steps), and Rating (with Stars and optional Picture).

The glossary also made one inheritance relationship visible: **RatedRecipe inherits from Recipe**.

### Turning the Artifacts into a Prompt

Rather than transcribing the artifacts into text, we attached both images directly to the LLM:

> *[Domain Story image] [Visual Glossary image]*
>
> *Based on these two modeling artifacts for a platform called CookWithUs, generate a runnable REST API using Node.js and Express with in-memory storage. No authentication required beyond identifying the current Cook by ID. Do not add any features or concepts not visible in the artifacts.*

The instruction to not add anything not visible in the artifacts is deliberate. It keeps the LLM honest and makes gaps visible — which is exactly what we want for this experiment.

### What the LLM Produced

The output was surprisingly sophisticated. Claude Code generated not just route files but a full OpenAPI 3.1 spec alongside the Express implementation, using `express-openapi-validator` to validate all requests against it. The three bounded contexts translated cleanly into route groups. The `Ingredient` schema with `name`, `number`, and `unit` was pixel-perfect from the glossary. `RatedRecipe` using `allOf` to inherit from `Recipe` correctly mirrored the glossary relationship.

Here is a representative excerpt from the generated spec showing the Rating schemas:

```yaml
Rating:
  type: object
  required: [id, cookId, recipeId, stars]
  properties:
    id:
      type: string
    cookId:
      type: string
    recipeId:
      type: string
    stars:
      type: integer
      minimum: 1
      maximum: 5
    pictures:
      type: array
      items:
        $ref: '#/components/schemas/Picture'
```

Clean, correct, and directly traceable to the Visual Glossary.

### Where It Failed

Three gaps stand out — and they're precisely where the Domain Story and Visual Glossary were ambiguous:

**The self-rating rule is completely absent.** The business rule "a Cook cannot rate their own Recipe" existed in our conversation but was never visible in any artifact. The generated `ratings.js` has no check for it. This is not an LLM failure — it's an artifact failure. The model had no way to know the rule existed.

**Meal is disconnected.** The Domain Story shows a Cook prepares a Meal and then shares a Recipe, implying a relationship. The LLM modeled them as two separate, unrelated resources. `MealInput` has only pictures and no link to Recipe whatsoever.

**`Making` dissolved silently.** In the Visual Glossary it was a distinct concept connecting Cook → Recipe → Steps. In the generated code it became simply an inline array of Steps on Recipe — a modeling decision the LLM made without any domain justification.

These gaps are not edge cases. A Cook gaming their own recipe rankings, a disconnected Meal entity, and a silently collapsed domain concept are the kinds of problems that surface in production and take significant time to unravel. And they all have the same root cause: the artifacts didn't contain that knowledge yet.

---

## 4. Step Two — EventStorming: Sharpening the Language

### The Artifact

We ran an EventStorming session using the Domain Story as a starting point. The board revealed three bounded contexts with clear visual boundaries: **Register**, **Sharing**, and **Rating**. Within those contexts, the following emerged:

In the **Sharing** context: the command `ShareRecipe` produces the event `RecipeShared`. The command `TakePictures` produces `PicturesTaken`. A constraint appeared: *Recipe needs a unique title*.

In the **Rating** context: the command `RateRecipe` produces `RecipeRated`. A policy appeared explicitly: *Own recipes cannot be rated*. `MealCooked` and `RecipeTried` were deliberately marked "Not in the app" — a scoping decision that prevents the LLM from generating dead code.

The refined Visual Glossary added significantly to what the Domain Story had captured:

- **Cook** now has `Name` and `GivenName` alongside email
- **Recipe** gained `Title`, `Servings`, `Meal` (as an enum: Breakfast, Lunch, Dinner, Dessert), and `Diet` (Normal, Vegetarian, Vegan)
- **Making** was renamed `HowTo` — unambiguous and directly code-adjacent
- **ShoppingList** appeared as an entirely new concept, with `Items` each having `Product`, `Number`, and a `Link` to purchase it
- **Rating** gained a `Note` field (text, maximum 1024 characters) and an explicit `Rater` field distinct from the recipe owner

### Turning the Artifacts into a Prompt

For Prototype v2, we started a fresh Claude Code session — no memory of v1 — and attached both EventStorming images with the following prompt:

> *[EventStorming image] [Refined Visual Glossary image]*
>
> *You are building Prototype v2 of CookWithUs. Follow a strict API-first approach:*
> *1. Derive the OpenAPI 3.1 spec from the modeling artifacts above — this is your single source of truth*
> *2. Generate the Node.js + Express implementation from the spec, validated against it using express-openapi-validator*
> *3. Do not add any concept, field, or endpoint not visible in the artifacts*
>
> *Apply the following rules strictly, all of which are explicit in the artifacts:*
> - *A Recipe must have a unique Title*
> - *Own recipes cannot be rated*
> - *MealCooked and RecipeTried are out of scope — do not implement them*
> - *A Rating may include a Note of maximum 1024 characters*

Three things changed deliberately from the v1 prompt. The API-first instruction is now explicit and ordered — spec before code. The business rules from the EventStorming policy stickies are named directly. And the out-of-scope decisions are stated explicitly — telling the LLM what *not* to build is as important as telling it what to build.

### What Changed in the Output

The diff between the v1 and v2 OpenAPI specs tells the story more clearly than any description:

**V1 spec: 3 schemas with domain meaning. V2 spec: 9 schemas.** Three times the domain expressiveness — from the same LLM, purely from richer input artifacts.

Specifically:

The `403` response now exists on `POST /recipes/{recipeId}/ratings`:

```yaml
'403':
  description: Cook cannot rate their own Recipe.
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/Error'
```

One policy sticky on an EventStorming board translated directly into a correctly typed HTTP response code.

`Recipe` in v2:

```yaml
RecipeCreate:
  type: object
  required: [title, ingredients, howTo, servings, meal, diet]
  properties:
    title:
      type: string
    ingredients:
      type: array
      minItems: 1
      items:
        $ref: '#/components/schemas/Ingredient'
    howTo:
      type: array
      minItems: 1
      items:
        $ref: '#/components/schemas/Step'
    shoppingList:
      type: array
      items:
        $ref: '#/components/schemas/ShoppingItem'
    servings:
      type: integer
      minimum: 1
    meal:
      $ref: '#/components/schemas/Meal'
    diet:
      $ref: '#/components/schemas/Diet'
```

`ShoppingList`, `Meal`, `Diet`, `servings`, `title` — none of these existed in v1. They weren't invented by the LLM. They came from the EventStorming board.

One more structural change worth noting: `RatedRecipe` disappeared. In v1, the LLM had constructed a hybrid response object combining Recipe and Rating. In v2, with clearer bounded context boundaries on the EventStorming board, Rating and Recipe are properly separate aggregates. The spec became simpler, not more complex, as the domain knowledge grew more precise. This is a pattern worth recognising: more domain clarity often means less accidental complexity in the output.

---

## 5. Step Three — The API Spec as Machine-Readable Contract

### Splitting by Bounded Context

With v2 producing a clean, well-structured spec, the natural next step was to let the EventStorming board drive the architecture explicitly. Three bounded contexts on the board became three independent OpenAPI specs:

- `register.yaml` — owns Cook identity, registration and lookup, no dependencies
- `sharing.yaml` — owns the full Recipe structure, depends on Cook only via `X-Cook-Id` header
- `rating.yaml` — owns Ratings, references Recipe only via `recipeId` in the path

This separation makes an architectural point that goes beyond prototyping: bounded contexts share IDs, not schemas. `sharing.yaml` does not import `Cook` from `register.yaml`. `rating.yaml` does not import `Recipe` from `sharing.yaml`. The contexts are decoupled at the contract level, which means they can evolve independently.

We kept the implementation as a monorepo with three Express routers, each validated against its own spec. This is worth stating explicitly: **the bounded context is an architectural boundary, not necessarily a deployment boundary**. EventStorming tells you where the seams are. How you deploy across those seams is a separate decision that should be driven by operational needs, not by a reflexive mapping of context to microservice.

### The Specs as the Deliverable

In a genuine API-first approach, the spec is the deliverable. The implementation that follows is mechanical. The three YAML files are Prototype v3 — not the Node.js code that implements them.

This is the most important point of the entire pipeline: by the time you have three clean, domain-aligned OpenAPI specs derived from collaborative modeling artifacts, the hard work is done. What remains is execution, and LLMs are very good at execution when given a precise contract to execute against.

To demonstrate, we ran one final prompt attaching all three specs:

> *[register.yaml] [sharing.yaml] [rating.yaml]*
>
> *Build a single-page React application for CookWithUs. The three attached OpenAPI specs are your single source of truth. Cover the following user journeys, derived strictly from the specs: register as a Cook, share a Recipe, browse Recipes, rate a Recipe. Do not add any feature, field, or screen not derivable from the specs.*

The result was a running web application. The recipe detail screen showed "Scones" with badges for "Breakfast", "Vegetarian", and "3 servings" — the `Meal` enum, `Diet` enum, and `servings` field that didn't exist in Prototype v1, discovered during EventStorming, encoded in the spec, and rendered faithfully by the LLM without any additional instruction.

Nothing on that screen was invented. Every field, every label, every structure came from a sticky note or a pictogram.

---

## 6. The Ubiquitous Language as the Red Thread

Looking back across all three prototypes, the same concept travelled a long way:

What began as a pictogram labelled "Recipe" in the Domain Story became a structured node in the Visual Glossary with Ingredients, Making, and Steps. EventStorming renamed `Making` to `HowTo`, added `Title`, `Servings`, `Meal`, `Diet`, and `ShoppingList`, and established the uniqueness constraint on `Title`. The OpenAPI spec encoded all of this as typed schemas with constraints. The React frontend rendered it as labelled form fields and tagged badges.

The language grew more precise at each step — and that precision is exactly what the LLM consumed. Where the language was vague (the self-rating rule, the Meal-Recipe relationship), the LLM produced vague or incorrect output. Where the language was precise (the Ingredient structure, the Step sequence), the output was correct from the first prototype.

This is not a coincidence. It is the mechanism. The Ubiquitous Language is not just a communication tool for human teams — it is the specification that makes LLM-assisted development reliable.

---

## 7. A Word for the Skeptics

The legitimate concerns about LLM-assisted development are worth taking seriously. Models hallucinate. They introduce subtle inconsistencies. They can create a false sense of progress that masks the absence of real domain understanding. These are not theoretical risks — teams encounter them regularly.

The argument in this post is not that those risks disappear. It is that they are significantly reduced when the model operates within a well-defined domain context. The self-rating rule was missing from Prototype v1 not because the LLM is unreliable, but because the artifact was incomplete. When the rule appeared explicitly on an EventStorming policy sticky, the LLM encoded it correctly. The model behaved like a precise executor of its input — which is exactly what it is.

What this approach does not replace: domain expert involvement, iterative refinement, human judgment about what matters. The EventStorming session that revealed `ShoppingList`, `Meal`, and `Diet` required a room of people with domain knowledge. The LLM had no part in that discovery. It only processed the result.

The shift this pipeline proposes is not "let the LLM do the domain work." It is "do the domain work properly, and the LLM becomes a reliable tool for the rest." That is a meaningful and achievable improvement over the current default, which is feeding vague descriptions to a model and being surprised by vague output.

---

## 8. Conclusion: Stories First, Code Second

The pipeline demonstrated here is straightforward:

A Domain Story and Visual Glossary give the LLM enough context to produce a recognisable first prototype. EventStorming sharpens the language, surfaces hidden rules, and discovers missing concepts — producing a second prototype that is measurably more complete and correct. Three OpenAPI specs derived from those artifacts encode the result as machine-readable contracts that drive both implementation and frontend generation.

At each step, the investment is in the language. The code follows.

This is not a new idea — it is what spec-driven development has always argued. What is new is that the artifacts produced by collaborative modeling workshops are now directly consumable by LLMs, creating a tight feedback loop between domain discovery and working software. A well-facilitated Domain Storytelling session is not just a requirements activity — it is the first prompt for your prototype.

The question worth asking is not "how do we use AI to go faster?" It is "how do we give AI enough context to go in the right direction?" Domain Storytelling and EventStorming have always been the answer to that question for human teams. It turns out they work for LLMs too.

---

*All artifacts, prompts, OpenAPI specs, and generated code from this post are available at [GitHub link].*

*The CookWithUs example was modeled using [Miro](https://miro.com) and [Egon.io](https://egon.io). Prototypes were generated using [Claude Code](https://claude.ai/code).*

## References

[1] Hofer, S.; Schwentner, H.: Domain Storytelling - A Collaborative, Visual, and Agile Way to Build Domain-Driven Software, Addison-Wesley Professional, 2021
[2] Brandolini, A.: EventStorming, 2026, accessed February 24th, 2026, [https://www.eventstorming.com/](https://www.eventstorming.com/)
[3] Evans, E.: Domain-Driven Design - Tackling Complexity in the Heart of Software, Pearson International, 2003
[4] Zörner, S.: Software-Architekturen dokumentieren und kommunizieren: Entwürfe, Entscheidungen und Lösungen nachvollziehbar und wirkungsvoll festhalten (in German), Hanser Fachbuchverlag, 2015 
[5] OpenAPI Initiative: OpenAPI Specification 3.1.0, February 15th, 2021, accessed February 24th, 2026, [https://spec.openapis.org/oas/v3.1.0.html](https://spec.openapis.org/oas/v3.1.0.html)