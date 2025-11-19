import { attribute, mergePatch } from 'https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.6/bundles/datastar.js';

attribute({
  name: 'fetch',
  requirement: 'must',
  async apply({ key, value, mods }) {
    const response = await fetch(value);
    const json = await response.json();
    const pluckSet = mods.get('pluck');
    const fieldName = pluckSet ? [...pluckSet][0] : null;
    const data = fieldName ? json[fieldName] : json;
    mergePatch({ [key]: data });
  },
});
