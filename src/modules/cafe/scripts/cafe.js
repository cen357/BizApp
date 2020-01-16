$(document).ready(function () {
    // Get data from info page
    let getTransferData = getDataFromLocalStorage("dataTable");
    let getInfoData = getDataFromLocalStorage("infoData");
    let getCounter = getDataFromLocalStorage("counter");

    // Calculate tax data 
    let cafeData = calcData(getTransferData);
    cafeData.push(calcSumRow(cafeData));

    // Initialize tax datatable
    let $cafeTable = $('#cafeTable');
    $cafeTable.bootstrapTable({
        data: cafeData
    });

    // Update Summary
    $('#summary .card').append("<div>Tổng số nhân viên: " + getCounter + "</div>");
    $('#summary .card').append("<div>Thời gian: " + getInfoData.time + "</div>");
    $('#summary .card').append("<div>Doanh thu: " + getInfoData.profit + "</div>");

    // Switch back to info page
    $("#back").on("click", function () {
        $cafeTable.bootstrapTable('destroy');
        localStorage.clear();
        window.location.href = '../../../index.html';
    });

    /** Function description: 
     *      Calculate data for one row of the table
     *  Parameters: 
     *      + row: one row from table
     *  Returns: 
     *      - Oject of row data 
     */
    function calcRowData(row) {
        let cafeFee = row['3'] * 730000;
        let data = {
            'A': row['A'],
            'B': row['B'],
            '1': row['C'],
            '2': row['3'],
            '3': 730000,
            '4': cafeFee,
            'C': ''
        };
        return data;
    }

    /** Function description: 
     *      Calculate data for tax table
     *  Parameters: 
     *      + table: table data
     *  Returns: 
     *      - Array of objects of table data
     */
    function calcData(table) {
        let data = [];
        table.forEach(element => {
            data.push(calcRowData(element));
        });
        return data;
    }

    /** Function description: 
     *      Calculate sum row data at the end of the table
     *  Parameters: 
     *      + data: table data
     *  Returns: 
     *      - Object of sum row data
     */
    function calcSumRow(data) {
        let cafeFeeSum = 0;

        data.forEach(element => {
            cafeFeeSum += Number(element['4']);
        });

        let sumRow = {
            'A': '',
            'B': 'Cộng',
            '1': '',
            '2': '',
            '3': '',
            '4': cafeFeeSum,
            'C': ''
        };

        return sumRow;
    }
});