const CheckForChangesInStructure = (data, saveData) => {
    let needsUpdate = false;
    const defaultData = {
        "sort_type": "oldest",
        "theme": "light",
        "next_id": 1,
        "lists": [],
    }
    const defaultList = {
        "id": 1,
        "name": "Lista bez tytułu",
        "items": [],
        "timestamp": new Date().getTime(),
    }
    const defaultItem = {
        "id": 1,
        "name": "",
        "amount": 0,
        "checked": false,
    }

    if (!data) {
        data = defaultData;
        needsUpdate = true;
    }

    for (const key in defaultData) {
        if (!(key in data)) {
            data[key] = defaultData[key];
            needsUpdate = true;
        }
    }

    for (const key in data) {
        if (!(key in defaultData)) {
            delete data[key];
            needsUpdate = true;
        }
    }

    // Check each list in data.lists
    if (data.lists && Array.isArray(data.lists)) {
        data.lists.forEach(list => {
            if (typeof list === 'object' && list !== null) {
                // Add missing keys from defaultList
                for (const key in defaultList) {
                    if (!(key in list)) {
                        list[key] = defaultList[key];
                        needsUpdate = true;
                    }
                }
                // Remove extra keys not in defaultList
                for (const key in list) {
                    if (!(key in defaultList)) {
                        delete list[key];
                        needsUpdate = true;
                    }
                }
                // Check each item in list.items
                if (list.items && Array.isArray(list.items)) {
                    list.items.forEach(item => {
                        if (typeof item === 'object' && item !== null) {
                            // Add missing keys from defaultItem
                            for (const key in defaultItem) {
                                if (!(key in item)) {
                                    item[key] = defaultItem[key];
                                    needsUpdate = true;
                                }
                            }
                            // Remove extra keys not in defaultItem
                            for (const key in item) {
                                if (!(key in defaultItem)) {
                                    delete item[key];
                                    needsUpdate = true;
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    if (needsUpdate) {
        console.log("Updating data structure:", data);
        saveData(data);
    }
}

export default CheckForChangesInStructure;