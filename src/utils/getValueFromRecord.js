export default (record, name) => {
    let initval;
    if (record) {
        if (name.includes('.')) {
            const names = name.split('.').map(key => `['${key}']`);
            initval = record;
            for (let i=0; i<names.length; i++) {
                if (!initval) {
                    return null;
                }
                initval = eval('initval'+names[i]);
            }
        } else {
            initval = record[name];
        }
    }
    return initval;
}
