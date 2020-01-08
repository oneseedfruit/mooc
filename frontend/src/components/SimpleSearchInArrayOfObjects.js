import React from 'react';
import { TextField } from '@material-ui/core';

const SimpleSearchInArrayOfObjects = ({ arrayOfObjects, searchField, setSearchField, setSearch }) => {
    const handleSearch = event => {
        const s = event.target.value.toLowerCase();

        if (arrayOfObjects) {
            const filteredSearch = arrayOfObjects.filter(a => {       
                let r = false;         
                Object.keys(a).reduce((x, y) => {                    
                    if (typeof y === "string") {                        
                        const c = String(a[`${y}`]).toLowerCase();
                        if (c.includes(s))
                            r = true;
                    }
                    return x || r;
                });
                return r;
            });

            setSearch(filteredSearch);
        }

        if (searchField === '') {
            setSearch(arrayOfObjects);
        }

        setSearchField(event.target.value);        
    };

    return (
        <>
            <TextField  id="standard-basic" 
                    label="search" 
                    value={ searchField }
                    name="name"
                    onChange={ handleSearch }
                    margin="normal"                    
                    fullWidth
            />
        </>
    );
};

export default SimpleSearchInArrayOfObjects;