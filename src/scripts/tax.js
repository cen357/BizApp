$(document).ready(function () {
    let getTransferData = getDataFromLocalStorage("dataTable");
    let getCounter = getDataFromLocalStorage("counter");

    // Calculate tax data 
    let taxData = calcTaxData(getTransferData);
    taxData.push(calcSumRow(taxData));

    // Initialize tax datatable
    let $taxTable = $('#taxTable');
    $taxTable.bootstrapTable({
        data: taxData
    });

    // Update Summary
    $('#summary .card').html("<div>Number of profiles: " + getCounter + "</div>");

    // Switch back to info page
    $("#back").on("click", function () {
        $taxTable.bootstrapTable('destroy');
        localStorage.clear();
        window.location.href = '../BizApp/index.html';
    });
});