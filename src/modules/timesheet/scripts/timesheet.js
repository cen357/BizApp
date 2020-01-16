$(document).ready(function () {
    // Get data from info page
    let getTransferData = getDataFromLocalStorage("dataTable");
    let getInfoData = getDataFromLocalStorage("infoData");
    let getCounter = getDataFromLocalStorage("counter");

    // Calculate timesheet data
    let timesheetData = calcData(getTransferData);

    // Initialize timesheet data table
    let $timesheetTable = $('#timesheetTable');
    $timesheetTable.bootstrapTable({
        data: timesheetData
    });

    // Update Summary
    $('#summary .card').append("<div>Tổng số nhân viên: " + getCounter + "</div>");
    $('#summary .card').append("<div>Thời gian: " + getInfoData.time + "</div>");
    $('#summary .card').append("<div>Doanh thu: " + getInfoData.profit + "</div>");

    $('#workdates').on('click', function (e) {
        let selectedIndex;
        selectedIndex = getIdSelection($timesheetTable);

        if (selectedIndex === -1) {
            $('#warningModal').modal('show');
            e.stopPropagation();
        }
    });

    $('#workdates_save').on('click', function () {
        // Initialize workdates data
        let workdates = [];
        // Update workdates data
        $('#workdatesModal input').each(function () {
            addDatesToData(workdates, $(this).is(':checked'));
        });

        // Update row by selected index
        let selectedIndex;
        selectedIndex = getIdSelection($timesheetTable);
        $timesheetTable.bootstrapTable('updateRow', {
            index: selectedIndex - 1,
            row: {
                '1': workdates[0],
                '2': workdates[1],
                '3': workdates[2],
                '4': workdates[3],
                '5': workdates[4],
                '8': workdates[5],
                '9': workdates[6],
                '10': workdates[7],
                '11': workdates[8],
                '12': workdates[9],
                '15': workdates[10],
                '16': workdates[11],
                '17': workdates[12],
                '18': workdates[13],
                '19': workdates[14],
                '22': workdates[15],
                '23': workdates[16],
                '24': workdates[17],
                '25': workdates[18],
                '26': workdates[19],
                '29': workdates[20],
                '30': workdates[21],
                '31': workdates[22],
            }
        });
        closeWorkdatesModal();
    });

    // Switch back to info page
    $("#back").on("click", function () {
        $timesheetTable.bootstrapTable('destroy');
        localStorage.clear();
        window.location.href = '../../../index.html';
    });

    /** Function description: 
     *      Delete inputs and close workdates modal
     *  Parameters: 
     *      + None
     *  Returns: 
     *      - None
     */
    function closeWorkdatesModal() {
        $('#workdatesModal input').each(function () {
            $(this).prop('checked', false);
        });
        $('#workdatesModal').modal('hide');
    }

    /** Function description: 
     *      Add dates to data for storage
     *  Parameters: 
     *      + arr: storage array 
     *      + checked: boolean value input 
     *  Returns: 
     *      - None
     */
    function addDatesToData(arr, checked) {
        if (checked === true) {
            arr.push('x');
        } else {
            arr.push('-');
        }
    }

    /** Function description: 
     *      Calculate data for one row of the table
     *  Parameters: 
     *      + row: row object from table
     *  Returns: 
     *      - Oject of row 
     */
    function calcRowData(row) {
        let data = {
            'A': row['A'],
            'B': row['B'],
            'C': row['C'],
            '1': '',
            '2': '',
            '3': '',
            '4': '',
            '5': '',
            '6': '',
            '7': 'CN',
            '8': '',
            '9': '',
            '10': '',
            '11': '',
            '12': '',
            '13': '',
            '14': 'CN',
            '15': '',
            '16': '',
            '17': '',
            '18': '',
            '19': '',
            '20': '',
            '21': 'CN',
            '22': '',
            '23': '',
            '24': '',
            '25': '',
            '26': '',
            '27': '',
            '28': 'CN',
            '29': '',
            '30': '',
            '31': '',
            'sum': row['3']
        };
        return data;
    }

    /** Function description: 
     *      Calculate data for tax table
     *  Parameters: 
     *      + table: table data (array of row objects)
     *      + dates: employee workdates 
     *  Returns: 
     *      - Array of row objects
     */
    function calcData(table) {
        let data = [];
        table.forEach(element => {
            data.push(calcRowData(element));
        });
        return data;
    }
});