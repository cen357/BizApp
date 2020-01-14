$(document).ready(function () {
    // Initialize profile counter (profile index)
    var counter = 2;

    // Initialize info data of the data table
    var infoData = {
        time: "",
        profit: ""
    };

    // Initialize salary profile data for worksheet
    var profileData = [{
            "A": 1,
            "B": "Anthony",
            "C": "Developer",
            "1": 4322,
            "2": 2,
            "3": 14,
            "4": 14,
            "5": 2,
            "6": 1
        },
        {
            "A": 2,
            "B": "Jane",
            "C": "Developer",
            "1": 6232,
            "2": 1,
            "3": 10,
            "4": 10,
            "5": 4,
            "6": 5
        }
    ];

    // Initialize datatable
    var $table = $('#dataTable');
    $table.bootstrapTable({
        data: profileData
    });

    // Download function
    var $toolbar = $('#toolbar');
    $(function () {
        $toolbar.find('select').change(function () {
            $table.bootstrapTable('destroy').bootstrapTable({
                exportDataType: $(this).val(),
                exportTypes: ['json', 'xml', 'txt', 'sql', 'csv', 'excel', 'pdf'],
                columns: [{
                        field: 'state',
                        checkbox: true,
                        visible: $(this).val() === 'selected'
                    },
                    {
                        field: 'A',
                        title: 'A'
                    }, {
                        field: 'B',
                        title: 'B'
                    }, {
                        field: '1',
                        title: '1'
                    }
                ]
            });
        }).trigger('change');
    });

    // Add information below title
    $('#info').on('click', function () {
        $('#info_save').on('click', function () {
            infoData.time = $('#add_time').val();
            infoData.profit = $('#add_profit').val();
            $('#infoDisplay #time').text(infoData.time);
            $('#infoDisplay #profit').text(infoData.profit);
            $('#info').addClass('d-none');
            $('#infoDisplay').removeClass('d-none');
            closeInfoModal();
        });

    });

    // Read imported Json File from local machine
    $('#upload').on('click', function () {
        var control = document.querySelector("#file");
        var importData;
        control.addEventListener("change", function (event) {
            var loadFile = document.querySelector("#file").files[0];

            // Load data to dataTable
            var reader = new FileReader();
            reader.onload = function (event) {
                var contents = event.target.result;
                importData = getParsedJson(contents);
            };

            // Error notification
            reader.onerror = function (event) {
                console.error("File could not be read! Code " + event.target.error.code);
            };

            // Read data from JSON File
            reader.readAsText(loadFile, "UTF-8");
        }, false);

        $('#upload_save').on('click', function () {
            $table.bootstrapTable('load', importData.data);
            closeUploadModal();
        });
    });

    // Add new profile
    $("#add_save").on('click', function (e) {
        $table.bootstrapTable('insertRow', {
            index: counter,
            row: {
                "A": ++counter,
                "B": $('#add_name').val(),
                "1": Number($('#add_salary').val())
            }
        });
        console.log($table.bootstrapTable('getData'));
        // Empty input and close modal
        closeAddModal();
    });

    // Stop action if no row is selected 
    $('#edit').on('click', function (e) {
        let selectedIndex = getIdSelection($table);
        if (selectedIndex === -1) {
            alert("Vui lòng chọn dòng cần sửa");
            e.stopPropagation();
        }
    });

    // Edit selected profile
    $('#edit_save').on('click', function () {
        // Update row by selected index
        let selectedIndex = getIdSelection($table);
        $table.bootstrapTable('updateRow', {
            index: selectedIndex - 1,
            row: {
                "B": $('#edit_name').val(),
                "1": Number($('#edit_salary').val())
            }
        });

        // Empty input and close modal
        closeEditModal();
    });

    // Remove selected profile
    $('#remove').on('click', function (e) {
        let selectedIndex = getIdSelection($table);

        // Stop action if no row is selected
        if (selectedIndex === -1) {
            alert("Vui lòng chọn dòng cần xóa");
            e.stopPropagation();
        }

        // Remove row by selected index
        $table.bootstrapTable('removeByUniqueId', selectedIndex);
        counter--;

        // Update indexes of profiles after the removed profile
        for (let index = selectedIndex; index <= counter; index++) {
            $table.bootstrapTable('updateCellByUniqueId', {
                id: index + 1,
                field: 'A',
                value: index
            });
        }
    });

    // Switch over to timesheet table page
    $("#timesheet").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", infoData);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to overtime table page
    $("#overtime").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", infoData);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to cafeteria table page
    $("#cafeteria").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", infoData);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to profit table page
    $("#profit").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", infoData);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to tax table page
    $("#tax").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", infoData);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to salary table page
    $("#salary").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", infoData);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });
});