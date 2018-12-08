---
layout: guide
---

For your bot, you may need to use external APIs to fetch/post some data.
The general approach to this is that you use an async action to perform the API call and save the response data to a state variable.

Below is an example action that returns the number of stars for the provided GitHub repository. 
[Axios](https://www.npmjs.com/package/axios) is used to get the requested endpoint and as it is promise based we can `await` the response. 

```js
repoStarsByInput: async (state, event) => {
  const endPoint = 'https://api.github.com/repos'
  try {
    const { data: { stargazers_count } } = await axios.get(`${endPoint}/${event.text}`)
    await event.reply('#builtin_text', { text: `This repo has ${stargazers_count} ★` })
  } catch (e) {
    await event.reply('#builtin_text', { text: `Failed to fetch data for this repo` })
  }
}
```

Note that in this example we are using `builtin_text` renderer which has to be registered properly.
