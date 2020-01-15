$(document).ready(function () {
    let getTransferData = getDataFromLocalStorage("dataTable");
    let getInfoData = getDataFromLocalStorage("infoData");
    let getCounter = getDataFromLocalStorage("counter");

    // Calculate tax data 
    let overtimeData = calcData(getTransferData);
    overtimeData.push(calcSumRow(overtimeData));

    // Initialize tax datatable
    let $overtimeTable = $('#overtimeTable');
    $overtimeTable.bootstrapTable({
        data: overtimeData
    });

    // Update Summary
    $('#summary .card').append("<div>Tổng số nhân viên: " + getCounter + "</div>");
    $('#summary .card').append("<div>Thời gian: " + getInfoData.time + "</div>");
    $('#summary .card').append("<div>Doanh thu: " + getInfoData.profit + "</div>");

    // Switch back to info page
    $("#back").on("click", function () {
        $overtimeTable.bootstrapTable('destroy');
        localStorage.clear();
        window.location.href = '../../main/index.html';
    });

    /** Function description: 
     *      Calculate data for one row of the table
     *  Parameters: 
     *      + row: one row from table
     *  Returns: 
     *      - Oject of row data 
     */
    function calcRowData(row) {
        let overtimeDays = ((row['5']) / 8).toFixed(2);
        let bonusPerDay = row['6'] * row['7'];
        let overtimeSalary = (bonusPerDay + row['7']) * overtimeDays;
        let sum = overtimeSalary + overtimeSalary;
        let data = {
            'A': row['A'],
            'B': row['B'],
            '1': row['C'],
            '2': row['5'],
            '3': overtimeDays,
            '4': row['7'],
            '5': row['6'],
            '6': bonusPerDay,
            '7': overtimeSalary,
            '8': overtimeSalary,
            '9': sum,
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
        let overtimeSalarySum = 0;
        let totalSum = 0;

        data.forEach(element => {
            overtimeSalarySum += Number(element['7']);
            totalSum += Number(element['9']);
        });

        let sumRow = {
            'A': '',
            'B': 'Tổng cộng',
            '1': '',
            '2': '',
            '3': '',
            '4': '',
            '5': '',
            '6': '',
            '7': overtimeSalarySum,
            '8': overtimeSalarySum,
            '9': totalSum,
            'C': ''
        };

        return sumRow;
    }
});