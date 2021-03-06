import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import MultiPicker from "../../src/index";
import { getSuggestedFruitSync } from "./common";
import Highlighter from "react-highlight-words";
import { object, bool, string } from "prop-types";

function SuggestionWithStockNumbers({ item, isHighlighted, inputValue }) {
    const style = {
        display: "flex",
        backgroundColor: isHighlighted ? "#aaa" : "#fff",
        width: "100%"
    };
    return (
        <div style={ style }>
            <img src={ item.image } style={ { height: "42px", width: "42px" } } />
            <div style={ { flex: "1 1 0"} }>
                <Typography variant="h6">
                    <Highlighter
                        highlightStyle={ { backgroundColor: "#ff2" } }
                        searchWords={ [ inputValue ] }
                        textToHighlight={ item.name }
                    />
                    <small>&nbsp;({ item.stock } in stock)</small>
                </Typography>
                <Typography>{ item.detail }</Typography>
            </div>
        </div>
    );
}

SuggestionWithStockNumbers.propTypes = {
    item: object.isRequired,
    isHighlighted: bool,
    inputValue: string.isRequired
};

export default function BasicDemo() {
    const [items, setItems] = useState([]);
    return (
        <MultiPicker
            value={ items }
            onChange={ setItems }
            itemToString={ fruit => fruit.name }
            getSuggestedItems={ getSuggestedFruitSync }
            SuggestionComponent={ SuggestionWithStockNumbers }
            label="Your favourite fruit"
            fullWidth
        />
    );
}


