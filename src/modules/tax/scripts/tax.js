$(document).ready(function () {
    let getTransferData = getDataFromLocalStorage("dataTable");
    let getInfoData = getDataFromLocalStorage("infoData");
    let getCounter = getDataFromLocalStorage("counter");

    // Calculate tax data 
    let taxData = calcTaxData(getTransferData);
    taxData.push(calcTaxSumRow(taxData));

    // Initialize tax datatable
    let $taxTable = $('#taxTable');
    $taxTable.bootstrapTable({
        data: taxData
    });

    // Update Summary
    $('#summary .card').append("<div>Tổng số nhân viên: " + getCounter + "</div>");
    $('#summary .card').append("<div>Thời gian: " + getInfoData.time + "</div>");
    $('#summary .card').append("<div>Doanh thu: " + getInfoData.profit + "</div>");

    // Switch back to info page
    $("#back").on("click", function () {
        $taxTable.bootstrapTable('destroy');
        localStorage.clear();
        window.location.href = '../../main/index.html';
    });

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
});