---
layout: guide
---

# 📚 Types, Elements, Renderers

Before we start discussing how you can create and edit the content of your bot, we should understand the different concepts of the Content Management in Botpress.

## Content Type

A **Content Type** describes a grouping of Content Elements sharing the same properties. They can describe anything and everything – they most often are domain-specific to your bot.

In the context of this tutorial, the template shipped with two Content Types: `Text Message` and `Trivia Question`.

> **🌟 Tip**: As a general rule, the more domain-specific the Content Types are, the easier it is to manage the bot for non-technical people.

Content Types are very specific to the bots they are associated with. Here are some typical examples:
- A restaurant "Menu" and "MenuPage" types
- A "QuestionWithChoices" type
- An "ImportantBroadcast" type

As you can see, Content Types on Botpress are much more specific than generalized "message types" on traditional bot building platforms.

Content Types are defined by developers in JavaScript. Each Content Type has its own `.form.js` file and Botpress automatically finds and registers new Content Types based on the directory and naming convention of the file.

In the context of this tutorial, the two Content Types are defined in the `src/content` folder.

## Content Element

A **Content Element** is a single item of a particular Content Type. Content Types contain many Elements. An Element belongs to a single Content Type.

All Content Elements of the same Content Type are stored within a single `.json` file under the `src/content_data` directory.

[[Maybe provide examples]]

## Content Renderer

A **Content Renderer** defines how a **Content Type** gets rendered on the different channels.

> **Note:** This is critical because every channel is different and has a different set of functionalities. You want to be able to customize and leverage the features of the different platforms to offer the best user experience as possible.

Content Renderers are defined by developers in JavaScript. They can be defined anywhere (usually at the bot startup) via the `bp.renderers.register` method.

In the context of this tutorial, Content Renderers are defined in the `src/renderers.js` file.

[[Maybe provide examples]]

---

#  🔨 Hands-on

Now that you understand the concepts of Content Management, let's make a small change to our bot that covers all of the above concepts.

## Using Builtin Content Types

`@botpress/builtins` package provides you with several builtin content types that we found to be most commonly used. To make use of them you need to install that package and register builtins like this:

```js
const { contentElements, contentRenderers, actions, setup } = require('@botpress/builtins')

await setup(bp)

// Register built-in content elements
await Promise.all(
  Object.values(contentElements)
    .map(schema => bp.contentManager.loadCategoryFromSchema(schema))
)

// Register renderers for the built-in elements
_.toPairs(contentRenderers).forEach(params => bp.renderers.register(...params))

// Register built-in actions
await bp.dialogEngine.registerActions(actions)
```

It may appear that builtins will suit your needs and you won't require creating custom schemas for them.

## Adding new Trivia Questions

The easiest and recommended way to add new content is by using the GUI. Simple navigate to the bot dashboard and click the "Content" menu item.

To add new Trivia Questions, click the "Trivia Questions" from the left menu and then click "Add Content". A new form will show up, and you'll be able to easily define new questions!

Immediately after the content is created, you can chat with the bot, and you should see your new question(s) appearing sometimes.

> **Note:** You probably noticed that the questions are randomized. We'll explain how this is done in the [Actions](./trivia_actions) chapter of this tutorial.

## Making the bot less boring

The bot currently always says the same phrases over and over again. For the bot to be entertaining for the users, it should have multiple ways of saying things.

### Defining variations (Content Types)

Let's open the `src/content/text.form.js` file. Notice how the form that you used in the GUI is defined in this file.

> **📌 Memo:** Content Types are defined by the [Standard JSON Schema Specification](http://json-schema.org/). More specifically, **we are using the excellent [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) library** created and maintained by Mozilla.

We will be adding a new `properties` entry called `"variations"`, which will be an array of strings:

```diff
properties: {
  text: {
    type: 'string',
    title: 'Message'
  },
+  variations: {
+    type: 'array',
+    title: 'Alternates (optional)',
+    items: {
+      type: 'string',
+      default: ''
+    }
+  },
  typing: {
    type: 'boolean',
    title: 'Show typing indicators',
    default: true
  }
}
```

### Picking a random variation (Content Renderer)

Now that our "Text Message" allows you to define multiple variations, we need to make our bot pick one of the phrases. This is done by the Content Renderer.

Open up the `src/renderers.js` file and locate the `text` renderer. This is the one we need to modify.

Picking a random element from an array is easy but let's use Lodash's [`sample`](https://lodash.com/docs/4.17.5#sample) method, which is even easier than writing it ourselves.

Add this at the top of the file:

```js
const _ = require('lodash')
```

Then let's change the `text` renderer to reflect this:

```diff
text: data => {
+  const text = _.sample([data.text, ...(data.variations || [])])
-  return { text: data.text, typing: !!data.typing }
+  return { text: text, typing: !!data.typing }
},
```

> **Note:** The use of the Spread Operator (`...`) requires Node.js 8.1+. We recommend you use the most recent LTS version of Node.js (8.9 at the time of writing this).

It is possible to access state-variable within renderers through `data.state` reference. This may be useful e. g. for displaying translations based on user's language etc. But note that renderer function isn't `async` so if you need to perform some async-operations, you need to keep that logic in actions and save results into state-variables.

## Summary

And we're done! You can edit the existing Content Elements to provide some alternate phrases, then open up the Chat Emulator and chat to your new bot!

Hopefully, you'll find that our bot is now a bit less boring 😅
