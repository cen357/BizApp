/** Function description:
 *      Get the index number of the selected profile (checked box)
 *  Parameters: 
 *      + $dataTable: Bootstrap-table selector
 *  Returns: 
 *      - Index number from ID column
 */
function getIdSelection($dataTable) {
    let selected = $dataTable.bootstrapTable('getSelections');
    // Check if there is no selection
    if (selected.length === 0) {
        return -1;
    }
    return selected[0]['A'];
}

/** Function description:
 *      Generate button is only available if table is not empty and profit is added 
 *  Parameter:
 *      + profileCounter: number of rows (profiles) currently exist
 *      + profitData: total profit of the company
 *  Returns: 
 *      - None
 */
function checkGenerateButton(profileCounter, profitData) {
    let generate = document.querySelector('#generateButton');
    if ((profileCounter === 0) && (profitData === 0)) {
        generate.disabled = true;
    } else {
        generate.disabled = false;
    }
}

/** Function description: 
 *      Delete input value in info modal and close it
 *  Parameters: 
 *      None
 *  Returns: 
 *      None
 */
function closeInfoModal() {
    $("#add_time").val('');
    $("#add_profit").val('');
    $("#infoModal").modal('hide');
}

/** Function description: 
 *      Delete input value in upload modal and close it
 *  Parameters: 
 *      None
 *  Returns: 
 *      None
 */
function closeUploadModal() {
    $("#file").val('');
    $("#uploadModal").modal('hide');
}

/** Function description: 
 *      Delete input value in add modal and close it
 *  Parameters: 
 *      None
 *  Returns: 
 *      None
 */
function closeAddModal() {
    $("#add_name").val('');
    $("#add_job").val('');
    $("#add_taxId").val('');
    $("#add_salary").val('');
    $("#add_workdays").val('');
    $("#add_cafe").val('');
    $("#add_overtime").val('');
    $("#add_bonus").val('');
    $("#add_avgSalary").val('');
    $("#addModal").modal('hide');
}

/** Function description: 
 *      Delete input value in edit modal and close it
 *  Parameters:
 *      None
 *  Returns: 
 *      None
 */
function closeEditModal() {
    $("#edit_name").val('');
    $("#edit_job").val('');
    $("#edit_taxId").val('');
    $("#edit_salary").val('');
    $("#edit_workdays").val('');
    $("#edit_cafe").val('');
    $("#edit_overtime").val('');
    $("#edit_bonus").val('');
    $("#edit_avgSalary").val('');
    $("#editModal").modal('hide');
}

/** Function description: 
 *      Parse JSON text
 *  Parameters: 
 *      + Stringified JSON from JSON file
 *  Returns: 
 *      - Formatted JSON or null
 */
function getParsedJson(text) {
    try {
        return JSON.parse(text);
    } catch (e) {
        // not valid JSON
        return null;
    }
}

/** Function description: 
 *      Saves data to local storage
 *  Parameters: 
 *      + Data key
 *      + Data (either json or normal data)
 *  Returns: 
 *      -  Stringified json data or normal data
 */
function saveDataToLocalStorage(dataKey, data) {
    let formattedData = null;
    try {
        formattedData = JSON.stringify(data);
    } catch (e) {
        // Save as normal data if not json 
        formattedData = data;
    }
    window.localStorage.setItem(dataKey, formattedData);
}

/** Function description: 
 *      Get data from local storage
 *  Parameters: 
 *      + Data key
 *  Returns: 
 *      - Formatted json data or normal data
 */
function getDataFromLocalStorage(dataKey) {
    let data = window.localStorage.getItem(dataKey);
    let formattedData = null;
    try {
        formattedData = JSON.parse(data);
    } catch (e) {
        //get normal data if not json
        formattedData = data;
    }
    return formattedData;
}

/** Function description: 
 *      Calculate data for one row of the table
 *  Parameters: 
 *      + row: one row from table
 *  Returns: 
 *      - Oject of row data 
 */
function calcTaxRowData(row) {
    let data = {
        'A': row['A'],
        'B': row['B'],
        '1': row['1'],
        '2=1*15%': (row['1'] * 15) / 100
    };
    return data;
}

/** Function description: 
 *      Calculate data for tax table
 *  Parameters: 
 *      + table: taxData
 *  Returns: 
 *      - Array of objects of table data
 */
function calcTaxData(table) {
    let data = [];
    table.forEach(element => {
        data.push(calcTaxRowData(element));
    });

    return data;
}

/** Function description: 
 *      Calculate sum row data at the end of the table
 *  Parameters: 
 *      + data
 *  Returns: 
 *      - Object of sum row data
 */
function calcTaxSumRow(data) {
    let salarySum = 0;
    let taxSum = 0;

    data.forEach(element => {
        salarySum += Number(element['1']);
        taxSum += Number(element['2=1*15%']);
    });

    let sumRow = {
        'A': '',
        'B': 'Tổng cộng',
        '1': salarySum,
        '2=1*15%': taxSum
    };

    return sumRow;
}