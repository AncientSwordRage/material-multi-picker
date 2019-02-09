[![npm package](https://img.shields.io/npm/v/material-multi-picker.svg)](https://www.npmjs.com/package/material-multi-picker)
[![npm downloads](https://img.shields.io/npm/dw/material-multi-picker.svg)](https://www.npmjs.com/package/material-multi-picker)
[![licence](https://img.shields.io/npm/l/material-multi-picker.svg)](https://opensource.org/licenses/MIT)

Typeahead multipicker, uses React 16, material-ui 3, and [downshift](https://github.com/downshift-js/downshift).

# Usage
Install with `npm install material-multi-picker` or `yarn add material-multi-picker`. Make sure you have React (16+) and Material UI (3+) installed!

```javascript
import MultiPicker from 'material-multi-picker';
import React from 'react';

const favoriteThings = [
    "raindrops on roses",
    "whiskers on kittens",
    "bright copper kettles",
    "warm woolen mittens"
]

function getSuggestions(inputValue) {
    return favoriteThings.filter(
        thing => thing.includes(inputValue.toLowerCase())
    );
}

function MyPicker() {
    //use React hooks for state (React 16.8+ only)
    const [myThings, setMyThings] = useState([]);

    return (
        <MultiPicker
            value={ myThings }
            onChange={ setMyThings }
            getSuggestedItems={ getSuggestions }
            itemToString={ item => item }
        />
    );
}
```

## Demo/Sandbox
Do `npm start` to run a demo server on port 8080.

## Props

| Prop name | Type | Required? | Description |
| --------- | ---- | --------- | ----------- |
| `value`   | array | yes | The items currently displayed as "selected" in the picker. They will appear as a series of "pills". |
| `onChange` | function(newValue) | yes | Callback fired by the component when the user changes the selected items. |
| `getSuggestedItems` | function(inputValue, selectedItems) | yes | Used by the picker to get the suggestions that will appear in the dropdown. Return an array of items or a promise that resolves to an array of items. |
| `itemToString` | function(item) | yes | Used by the picker to extract a unique identifer string for an item (must return a string). |
| `itemToLabel` | function(item) | no | Used by the picker to populate the pill labels. If not supplied, the results of `itemToString` will be used. |
| `itemToAvatar` | function(item) | no | Used by the picker to add material `<Avatar />` icons into the pills. If not supplied, pills will have no icon. |
| `fullWidth` | boolean | no | As in Material UI, determines whether the picker will grow to fill available horizontal space. Defaults to `false` |
| `label` | string | no | The label applied to the input field. Defaults to `""`. |
| `fetchDelay` | number | no | The delay between the last keypress and the picker fetching suggestions. Useful to avoid spamming a service! Defaults to `0`. |
| `SuggestionComponent` | React component | no | Custom component used to render suggestions in the picker dropdown (see below for a list of supplied props). Defaults to the result of `itemToString`. |

## SuggestionComponent props
When supplying a custom `SuggestionComponent`, you will have access to the following props:

| Prop name | Type | Description |
| --------- | ---- | ----------- |
| `itemId` | string | The unique ID of the item (from `itemToString`) |
| `item` | any | The suggestion generated by your `getSuggestedItems` function |
| `isHighlighted` | boolean | `true` if the user is currently highlighting this suggestion (either with keyboard navigation, or by hovering over with the mouse) |
| `inputValue` | string | The string currently entered in the text input field. Useful for highlighting portions of text to indicate matches. |
| `isSelected` | boolean | `true` if the suggestion is already selected in the picker

It's a good idea to avoid interactive or clickable elements in your component, as they may interfere with the picker's event handling.

## Providing Suggestions
When writing your `getSuggestedItems` function, here are some possible strategies:

### Lowercase strings before doing matching
Case is rarely significant when matching results:

```javascript
function getSuggestedItems(inputValue, selectedItems) {
    return items.filter(
        item => item.toLowerCase().includes(inputValue.toLowerCase())
    );
}
```

### Exclude items that have already been selected
You get passed the `selectedItems` array so that you can choose to exclude items if you want. Good idea to use your `itemToString` function first to make sure the comparison is correct.

```javascript
function getSuggestedItems(inputValue, selectedItems) {
    const selectedIds = selectedItems.map(itemToString);
    return items
        .filter(/* some matching condition */)
        .filter(item => !selectedIds.includes(itemToString(item)))        
}
```

### Only pass back a maximum number of items
```javascript
const MAX_SUGGESTIONS_TO_RETURN = 15;

function getSuggestedItems(inputValue, selectedItems) {
    return fetchSuggestionsFromServer(inputValue).then(suggestions => {
        return suggestions.slice(0, MAX_SUGGESTIONS_TO_RETURN);
    });
}
```

### Require a minimum number of characters in the input before showing anything
This can avoid doing an overly broad search that won't be useful.

```javascript
const MINIMUM_INPUT_LENGTH = 3;

function getSuggestedItems(inputValue, selectedItems) {
    if (inputValue.length < MINIMUM_INPUT_LENGTH) {
        return [];
    }
    //otherwise do a real lookup
}
```

### Allow users to create new suggestions by creating dynamic items
```javascript
function getSuggestedItems(inputValue, selectedItems) {
    const suggestions = getMatchingSuggestions(inputValue);

    //only create a dynamic suggestion if no exact match exists
    if ( !suggestions.map(getName).includes(inputValue) ) {
        // set a dynamic=true flag, this lets us use a 
        // special display style for this item
        return [ ...suggestions, { name: inputValue, dynamic: true }];
    }
}
```

### Combine federated results from multiple sources
```javascript
function getSuggestedItems(inputValue, selectedItems) {
    //wait for both servers to return results
    return Promises.all([ 
        fetchSuggestionsFromStaffServer(inputValue),
        fetchSuggestionsFromCustomerServer(inputValue)
    ]).then(([ staffSuggestions, customerSuggestions ]) => {
        //concatenate results from both servers
        return [...staffSuggestions, ...customerSuggestions];
    });
}
```




