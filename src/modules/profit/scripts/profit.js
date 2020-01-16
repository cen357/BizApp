$(document).ready(function () {
    // Get data from info page
    let getTransferData = getDataFromLocalStorage("dataTable");
    let getInfoData = getDataFromLocalStorage("infoData");
    let getCounter = getDataFromLocalStorage("counter");

    // Calculate profit data 
    let profitData = calcData(getTransferData);
    profitData.push(calcSumRow(profitData));

    // Initialize tax datatable
    let $profitTable = $('#profitTable');
    $profitTable.bootstrapTable({
        data: profitData
    });

    // Update Summary
    $('#summary .card').append("<div>Tổng số nhân viên: " + getCounter + "</div>");
    $('#summary .card').append("<div>Thời gian: " + getInfoData.time + "</div>");
    $('#summary .card').append("<div>Doanh thu: " + getInfoData.profit + "</div>");

    // Switch back to info page
    $("#back").on("click", function () {
        $profitTable.bootstrapTable('destroy');
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
        let profitPercent = Math.round((Number(getInfoData.profit) * 15) / 100);
        let totalMoney = Number(row['6']) * profitPercent;
        let data = {
            'A': row['A'],
            'B': row['B'],
            '1': row['C'],
            '2': getInfoData.profit,
            '3': profitPercent,
            '4': row['6'],
            '5': totalMoney,
            '6': 'Bảo hộ nhãn hiệu canon',
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
        let percentSum = 0;
        let totalSum = 0;

        data.forEach(element => {
            percentSum += Number(element['4']);
            totalSum += Number(element['5']);
        });

        let sumRow = {
            'A': '',
            'B': 'Tổng cộng',
            '1': '',
            '2': '',
            '3': '',
            '4': percentSum,
            '5': totalSum,
            '6': '',
        };

        return sumRow;
    }
});