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
        window.location.href = '../BizApp/index.html';
    });
});