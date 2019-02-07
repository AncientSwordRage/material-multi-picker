import React from "react";
import createReactClass from "create-react-class";
import { render } from "react-dom";
import MultiPicker from "../index";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { blue, red } from "@material-ui/core/colors";
import { string, func } from "prop-types";
import { AppleImage, PearImage, BananaImage, GrapesImage, MelonImage, RaspberryImage } from "./icons";

const ALL_ITEMS = [
    { name: "apple", stock: 0, image: AppleImage },
    { name: "pear", stock: 14, image: PearImage },
    { name: "banana", stock: 282, image: BananaImage },
    { name: "melon", stock: 81, image: MelonImage },
    { name: "raspberry", stock: 422, image: RaspberryImage },
    { name: "grapes", stock: 109, image: GrapesImage}
];

const itemToString = item => item && item.name;

function getSuggestedSyncItems(searchString, selectedItems) {
    const selectedNames = selectedItems.map(itemToString);
    return ALL_ITEMS
        .filter(item => item.name.toLowerCase().includes(searchString.toLowerCase()))
        .filter(item => !selectedNames.includes(item.name));
}

function getSuggestedSyncItemsMinimumLength(searchString, selectedItems) {
    if (searchString.length >= 2) {
        return getSuggestedSyncItems(searchString, selectedItems);
    }
    return [];
}

function getSuggestedAsyncItems(searchString, selectedItems) {
    if ( !searchString.length ) {
        return Promise.resolve([]);
    }
    return new Promise(resolve => {
        setTimeout(
            () => resolve(getSuggestedSyncItems(searchString, selectedItems)),
            800
        );
    });
}

function getSuggestedAsyncItemsWithError(searchString) {
    if ( !searchString.length ) {
        return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
        setTimeout(
            () => reject(new Error("oops")),
            800
        );
    });
}

const sandboxTheme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: red
    },
    typography: {
        useNextVariants: true,
    }
});

function SuggestionWithStockNumbers({ item, isHighlighted, isSelected, inputValue }) {
    return (
        <div style={ { display: "flex" } }>
            <img src={ item.image } style={ { margin: "0 8px" } } />
            <div style={ { flex: "1 1 0"} }>
                <Typography variant="title">{ item.name }</Typography>
                <Typography>{ item.stock } in stock</Typography>
            </div>
        </div>
    );
}

function getDynamicSuggestionItems(inputValue, selectedItems) {
    const basicSuggestions = getSuggestedSyncItems(inputValue, selectedItems);
    if (basicSuggestions.includes(inputValue)) {
        return basicSuggestions;
    }
    return [ ...basicSuggestions, inputValue ];
}

const Sandbox = createReactClass({
    render() {
        return (
            <MuiThemeProvider theme={ sandboxTheme }>
                <Typography variant="h2">Preview Picker</Typography>
                <DemoSection title="Simple suggestion list" getSuggestedItems={ getSuggestedSyncItems } />
                <DemoSection title="Custom chip labels" getSuggestedItems={ getSuggestedSyncItems } itemToLabel={ item => `Awesome ${item.name}` } />
                <DemoSection title="Custom suggestion components" getSuggestedItems={ getSuggestedSyncItems } SuggestionComponent={ SuggestionWithStockNumbers } />
                <DemoSection title="Dynamically generated suggestions" getSuggestedItems={ getDynamicSuggestionItems } />
                <DemoSection title="Minimum input length for suggesions" getSuggestedItems={ getSuggestedSyncItemsMinimumLength } />
                <DemoSection title="Asynchronous suggestion list" getSuggestedItems={ getSuggestedAsyncItems } />
                <DemoSection title="Handle suggestion fetch errors" getSuggestedItems={ getSuggestedAsyncItemsWithError } />
                <DemoSection title="Throttling requests" getSuggestedItems={ getSuggestedAsyncItems } fetchDelay={ 800 } />
            </MuiThemeProvider>
        );
    }
});

const DemoSection = createReactClass({
    propTypes: {
        title: string.isRequired,
        getSuggestedItems: func.isRequired
    },
    getInitialState() {
        return { items: [] };
    },
    handleItemsChange(items) {
        this.setState({ items });
    },
    render() {
        const { title, getSuggestedItems, ...otherProps } = this.props;
        return (
            <section style={{ padding: "8px"}}>
                <Typography variant="h5">{ title }</Typography>
                <div style={ { width: "700px" } }>
                    <MultiPicker
                        value={ this.state.items }
                        onChange={ this.handleItemsChange }
                        getSuggestedItems={ getSuggestedItems }
                        itemToString={ itemToString }
                        label="Your favourite fruit"
                        fullWidth
                        { ...otherProps }
                    />
                </div>
            </section>
        );
    }
});

render(<Sandbox />, document.getElementById("sandbox"));
