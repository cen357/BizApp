$(document).ready(function () {
    // Get data from info page
    let getTransferData = getDataFromLocalStorage("dataTable");
    let getInfoData = getDataFromLocalStorage("infoData");
    let getCounter = getDataFromLocalStorage("counter");

    // Calculate tax data 
    let salaryData = calcData(getTransferData);
    salaryData.push(calcSumRow(salaryData));

    // Initialize tax datatable
    let $salaryTable = $('#salaryTable');
    $salaryTable.bootstrapTable({
        data: salaryData
    });

    // Update Summary
    $('#summary .card').append("<div>Tổng số nhân viên: " + getCounter + "</div>");
    $('#summary .card').append("<div>Thời gian: " + getInfoData.time + "</div>");
    $('#summary .card').append("<div>Doanh thu: " + getInfoData.profit + "</div>");

    // Switch back to info page
    $("#back").on("click", function () {
        $salaryTable.bootstrapTable('destroy');
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
        // Overtime sheet data
        let overtimeDays = ((Number(row['5'])) / 8).toFixed(2);
        let averageSalaryPerDay = Math.round(((Number(row['2']) * 12) / 256));
        let bonusPerDay = row['6'] * Number(averageSalaryPerDay);
        let overtimeSalary = Math.round((Number(bonusPerDay) + Number(averageSalaryPerDay)) * Number(overtimeDays));

        // Profit sheet data
        let profitPercent = Math.round((Number(getInfoData.profit) * 15) / 100);
        let totalBonusMoney = Number(row['6']) * profitPercent;

        // Tax sheet data
        const defaultInsuranceFee = 9000000;
        const bonusInsuranceFeePerPerson = 3600000;
        let salary = Number(row['2']);
        let realSalary = salary;
        let totalSum = Number(salary) + Number(totalBonusMoney) + Number(overtimeSalary) * 2;
        let insuranceFee = Math.round(Number(salary) * 10.5 / 100);
        let totalTaxPaymentAmount = Number(totalSum) - Number(overtimeSalary) - Number(insuranceFee) - Number(defaultInsuranceFee) - (Number(row['7']) * Number(bonusInsuranceFeePerPerson));
        let realTaxPaymentAmount = Math.round((Number(totalTaxPaymentAmount) * 5) / 100);

        // Salary data
        let socialSecurityFee = Math.round((salary * 8) / 100);
        let healthInsuranceFee = Math.round((salary * 1.5) / 100);
        let incomeInsuranceFee = Math.round((salary * 1) / 100);
        let totalSalaryPayment = salary + totalBonusMoney;
        let totalTaxFee = socialSecurityFee + healthInsuranceFee + incomeInsuranceFee + realTaxPaymentAmount;
        let actualIncome = Number(totalSalaryPayment - totalTaxFee);
        let data = {
            'A': row['A'],
            'B': row['B'],
            '1': row['C'],
            '2': row['3'],
            '3': salary,
            '4': realSalary,
            '5': totalBonusMoney,
            '6': totalSalaryPayment,
            '7': socialSecurityFee,
            '8': healthInsuranceFee,
            '9': incomeInsuranceFee,
            '10': realTaxPaymentAmount,
            '11': totalTaxFee,
            '12': actualIncome,
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
        let salarySum = 0;
        let realSalarySum = 0;
        let totalBonusMoneySum = 0;
        let totalSalaryPaymentSum = 0;
        let socialSecurityFeeSum = 0;
        let healthInsuranceFeeSum = 0;
        let incomeInsuranceFeeSum = 0;
        let realTaxPaymentAmountSum = 0;
        let totalTaxFeeSum = 0;
        let actualIncomeSum = 0;

        data.forEach(element => {
            salarySum += Number(element['3']);
            realSalarySum += Number(element['4']);
            totalBonusMoneySum += Number(element['5']);
            totalSalaryPaymentSum += Number(element['6']);
            socialSecurityFeeSum += Number(element['7']);
            healthInsuranceFeeSum += Number(element['8']);
            incomeInsuranceFeeSum += Number(element['9']);
            realTaxPaymentAmountSum += Number(element['10']);
            totalTaxFeeSum += Number(element['11']);
            actualIncomeSum += Number(element['12']);
        });

        let sumRow = {
            'A': '',
            'B': 'Tổng cộng',
            '1': '',
            '2': '',
            '3': salarySum,
            '4': realSalarySum,
            '5': totalBonusMoneySum,
            '6': totalSalaryPaymentSum,
            '7': socialSecurityFeeSum,
            '8': healthInsuranceFeeSum,
            '9': incomeInsuranceFeeSum,
            '10': realTaxPaymentAmountSum,
            '11': totalTaxFeeSum,
            '12': actualIncomeSum,
            'C': ''
        };

        return sumRow;
    }
});