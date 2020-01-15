$(document).ready(function () {
    // Initialize profile counter (profile index)
    let counter;

    counter = 2;

    // Initialize info data
    let Info;

    Info = {
        time: "1",
        profit: 0
    };

    // Initialize salary profile data for worksheet
    let profileData;

    profileData = [{
            "A": 1,
            "B": "Anthony",
            "C": "Developer",
            "1": 4322,
            "2": 2,
            "3": 14,
            "4": 14,
            "5": 2,
            "6": 1,
            "7": 32
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
            "6": 5,
            "7": 30
        }
    ];

    // Initialize datatable
    var $table;
    $table = $('#dataTable');
    $table.bootstrapTable({
        data: profileData
    });

    // Download function
    var $toolbar;
    $toolbar = $('#toolbar');
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
                        field: 'C',
                        title: 'C'
                    }, {
                        field: '1',
                        title: '1'
                    }, {
                        field: '2',
                        title: '2'
                    }, {
                        field: '3',
                        title: '3'
                    }, {
                        field: '4',
                        title: '4'
                    }, {
                        field: '5',
                        title: '5'
                    }, {
                        field: '6',
                        title: '6'
                    }, {
                        field: '7',
                        title: '7'
                    }
                ]
            });
        }).trigger('change');
    });

    // Add information below title
    $('#info').on('click', function () {
        $('#info_save').on('click', function () {
            Info.time = $('#add_time').val();
            Info.profit = $('#add_profit').val();
            $('#infoDisplay #time').text(Info.time);
            $('#infoDisplay #profit').text(Info.profit);
            $('#info').addClass('d-none');
            $('#infoDisplay').removeClass('d-none');

            checkGenerateButton(counter, Info.profit);
            closeInfoModal();
        });

    });

    // Read imported Json File from local machine
    $('#upload').on('click', function () {
        let control;
        control = document.querySelector("#file");

        let importData;
        control.addEventListener("change", function (event) {
            let loadFile = document.querySelector("#file").files[0];

            // Load data to dataTable
            let reader = new FileReader();
            reader.onload = function (event) {
                let contents = event.target.result;
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

            checkGenerateButton(counter, Info.profit);
            closeUploadModal();
        });
    });

    // Add new profile
    $('#add').on('click', function () {
        $("#add_save").on('click', function (e) {
            $table.bootstrapTable('insertRow', {
                index: counter,
                row: {
                    "A": ++counter,
                    "B": $('#add_name').val(),
                    "C": $('#add_job').val(),
                    "1": Number($('#add_taxId').val()),
                    "2": Number($('#add_salary').val()),
                    "3": Number($('#add_workdays').val()),
                    "4": Number($('#add_cafe').val()),
                    "5": Number($('#add_overtime').val()),
                    "6": Number($('#add_bonus').val()),
                    "7": Number($('#add_avgSalary').val())
                }
            });

            checkGenerateButton(counter, Info.profit);
            closeAddModal();
        });
    });

    // Stop action and show warning if no row is selected 
    $('#edit').on('click', function (e) {
        let selectedIndex;
        selectedIndex = getIdSelection($table);
        if (selectedIndex === -1) {
            $('#warningModal').modal('show');
            e.stopPropagation();
        }
    });

    // Edit selected profile
    $('#edit_save').on('click', function () {
        // Update row by selected index
        let selectedIndex;
        selectedIndex = getIdSelection($table);
        $table.bootstrapTable('updateRow', {
            index: selectedIndex - 1,
            row: {
                "B": $('#edit_name').val(),
                "C": $('#edit_job').val(),
                "1": Number($('#edit_taxId').val()),
                "2": Number($('#edit_salary').val()),
                "3": Number($('#edit_workdays').val()),
                "4": Number($('#edit_cafe').val()),
                "5": Number($('#edit_overtime').val()),
                "6": Number($('#edit_bonus').val()),
                "7": Number($('#edit_avgSalary').val())
            }
        });

        checkGenerateButton(counter, Info.profit);
        closeEditModal();
    });

    // Remove selected profile
    $('#remove').on('click', function (e) {
        let selectedIndex = getIdSelection($table);

        // Stop action and show warning if no row is selected
        if (selectedIndex === -1) {
            $('#warningModal').modal('show');
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
        checkGenerateButton(counter, Info.profit);
    });

    // Switch over to timesheet table page
    $("#timesheet").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", Info);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to overtime table page
    $("#overtime").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", Info);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/overtime.html';
    });

    // Switch over to cafeteria table page
    $("#cafeteria").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", Info);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to profit table page
    $("#profit").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", Info);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to tax table page
    $("#tax").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", Info);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });

    // Switch over to salary table page
    $("#salary").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("infoData", Info);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });
});