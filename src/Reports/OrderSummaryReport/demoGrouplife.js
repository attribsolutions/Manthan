import Data from "./demo.json"

export const groupByColumnsWithSumFunc = (jsonData, columnNames) => {
    const columnSumsByGroup = jsonData.reduce((result, item) => {
        const groupKey = columnNames.map(columnName => item[columnName]).join('|');
        if (!result[groupKey]) {
            result[groupKey] = {
                sums: {},
                data: []
            };

            columnNames.forEach((key) => {
                result[groupKey].sums[key] = item[key];
            })
        }

        const group = result[groupKey];
        group.data.push(item);

        Object.entries(item).forEach(([key, value]) => {
            if (typeof value === 'number') {
                group.sums[key] = (group.sums[key] || 0) + value;
            }
        });

        return result;
    }, {});
    let arr = []
    Object.keys(columnSumsByGroup).forEach(i => {
        delete columnSumsByGroup[i].sums.Orderid
        arr.push(columnSumsByGroup[i].sums)
    })
    
    return arr
};




