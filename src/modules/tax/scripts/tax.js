$(document).ready(function () {
    // Get data from info page
    let getTransferData = getDataFromLocalStorage("dataTable");
    let getInfoData = getDataFromLocalStorage("infoData");
    let getCounter = getDataFromLocalStorage("counter");

    // Calculate tax data 
    let taxData = calcData(getTransferData);
    taxData.push(calcSumRow(taxData));

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
        const defaultInsuranceFee = 9000000;
        const bonusInsuranceFeePerPerson = 3600000;
        // Profit sheet data
        let profitPercent = Math.round((Number(getInfoData.profit) * 15) / 100);
        let totalMoney = Number(row['6']) * profitPercent;

        // Overtime sheet data
        let overtimeDays = ((Number(row['5'])) / 8).toFixed(2);
        let averageSalaryPerDay = Math.round(((Number(row['2']) * 12) / 256));
        let bonusPerDay = row['6'] * Number(averageSalaryPerDay);
        let overtimeSalary = Math.round((Number(bonusPerDay) + Number(averageSalaryPerDay)) * Number(overtimeDays));

        // Tax sheet data
        let salary = Number(row['2']);
        let totalSum = Number(salary) + Number(totalMoney) + Number(overtimeSalary) * 2;
        let insuranceFee = Math.round(Number(salary) * 10.5 / 100);
        let totalTaxPaymentAmount = Number(totalSum) - Number(overtimeSalary) - Number(insuranceFee) - Number(defaultInsuranceFee) - (Number(row['7']) * Number(bonusInsuranceFeePerPerson));
        let realTaxPaymentAmount = Math.round((Number(totalTaxPaymentAmount) * 5) / 100);
        let data = {
            '1': row['A'],
            '2': row['B'],
            '3': row['C'],
            '4': totalSum,
            '5': salary,
            '6': totalMoney,
            '7': overtimeSalary,
            '8': overtimeSalary,
            '9': insuranceFee,
            '10': row['7'],
            '11': totalTaxPaymentAmount,
            '12': realTaxPaymentAmount
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
        let totalSum = 0;
        let salarySum = 0;
        let bonusSum = 0;
        let overtimeSalarySum = 0;
        let insuranceFeeSum = 0;
        let totalTaxPaymentAmountSum = 0;
        let realTaxPaymentAmountSum = 0;

        data.forEach(element => {
            totalSum += Number(element['4']);
            salarySum += Number(element['5']);
            bonusSum += Number(element['6']);
            overtimeSalarySum += Number(element['7']);
            insuranceFeeSum += Number(element['9']);
            totalTaxPaymentAmountSum += Number(element['11']);
            realTaxPaymentAmountSum += Number(element['12']);
        });

        let sumRow = {
            '1': '',
            '2': 'Tổng cộng',
            '3': '',
            '4': totalSum,
            '5': salarySum,
            '6': bonusSum,
            '7': overtimeSalarySum,
            '8': overtimeSalarySum,
            '9': insuranceFeeSum,
            '10': '',
            '11': totalTaxPaymentAmountSum,
            '12': realTaxPaymentAmountSum
        };

        return sumRow;
    }
});