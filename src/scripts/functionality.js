$(document).ready(function () {
    // Initialize profile counter (profile index)
    var counter = 2;

    // Initialize salary profile data for worksheet
    var profileData = [{
            "A": 1,
            "B": "Anthony",
            "1": 100
        },
        {
            "A": 2,
            "B": 'Jane',
            "1": 50
        }
    ];

    // Initialize datatable
    var $table = $('#dataTable');
    $table.bootstrapTable({
        data: profileData
    });

    // Download function
    $(function () {
        $('#toolbar').find('select').change(function () {
            $table.bootstrapTable('destroy').bootstrapTable({
                exportDataType: $(this).val(),
                exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
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

    // Read imported Json File from local machine
    var control = document.querySelector("#import");
    var importData;
    control.addEventListener("change", function (event) {
        var loadFile = document.querySelector("#import").files[0];

        // Load data to dataTable
        var reader = new FileReader();
        reader.onload = function (event) {
            var contents = event.target.result;
            importData = getParsedJson(contents);
            $table.bootstrapTable('load', importData.data);
        };

        // Error notification
        reader.onerror = function (event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };

        // Read data from JSON File
        reader.readAsText(loadFile, "UTF-8");
    }, false);

    // Add new profile
    $("#add_save").on('click', function (e) {
        $table.bootstrapTable('insertRow', {
            index: counter,
            row: {
                "A": ++counter,
                "B": $('#add_name').val(),
                "1": $('#add_salary').val()
            }
        });

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
                "A": $('#edit_name').val(),
                "B": $('#edit_salary').val()
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

    // Switch over to tax table page
    $("#tax").on("click", function () {
        // Save data from table to local storage for transfer
        let setTransferData = $table.bootstrapTable('getData');
        saveDataToLocalStorage("dataTable", setTransferData);
        saveDataToLocalStorage("counter", counter);
        window.location.href = '../BizApp/tax.html';
    });
});