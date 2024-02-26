$(document).ready(function () {

    initializeAutocomplete();

    display_sales_list(sales);

    function saveSale() {
        let salesperson = "Dwight K. Schrute III"
        let client = $("#client").val();
        let reams = $("#reams").val();

        const clientInput = $("#client");
        const reamsInput = $("#reams");

        const clientValue = clientInput.val().trim();
        const reamsValue = reamsInput.val().trim();

        // Remove existing error messages and reset data attributes
        $(".inputError").remove();
        clientInput.removeClass('redGlow');
        reamsInput.removeClass('redGlow');

        // Validation checks
        if (clientValue === '' || reamsValue === '') {

            if (clientValue === '' && reamsValue === '') {
                // Handle empty fields
                clientInput.addClass('redGlow');
                reamsInput.addClass('redGlow');
                $("#user").after('<p class="inputError">* Please fill in the client and reams field *</p>');
                clientInput.focus();
            } else if (clientValue === '') {
                // Warn the user about non-numeric input
                clientInput.addClass('redGlow');
                $("#user").after('<p class="inputError">* Please fill in the client field *</p>');
                clientInput.focus();
            } else {
                // Handle empty fields
                reamsInput.addClass('redGlow');
                $("#user").after('<p class="inputError">* Please fill in the reams field *</p>');
                reamsInput.focus();
            }
            return;
        }

        // Check if reamsValue is a number
        if (isNaN(reamsValue) || reamsValue === '0') {
            // Warn the user about non-numeric input
            reamsInput.addClass('redGlow');
            $("#user").after('<p class="inputError">* Please fill in the reams field with valid number greater than 0 *</p>');
            reamsInput.focus();
            return;
        }

        // Remove error messages and styling if inputs are valid
        $(".inputError").remove();
        clientInput.removeClass('redGlow');
        reamsInput.removeClass('redGlow');

        let dataToSave = {
            "salesperson": salesperson,
            "client": client,
            "reams": parseInt(reams)
        };

        $.ajax({
            type: "POST",
            url: "/save_sale",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(dataToSave),
            success: function (result) {
                let allSales = result["sales"];
                display_sales_list(allSales);
                $("#salesperson").val("");
                $("#client").val("");
                $("#reams").val("");
            },
            error: function (request, status, error) {
                console.error("Error saving sale:", error);
            }
        });

        let newClient = $("#client").val().trim();
        if (newClient !== '' && clients.indexOf(newClient) === -1) {
            // Add the new client to the clients array
            clients.push(newClient);
            // Update the autocomplete source
            $("#client").autocomplete("option", "source", clients);
        }
        $("#client").focus();
    }

    function delete_sale(id) {
        $.ajax({
            type: "POST",
            url: "/delete_sale",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ "id": id }),
            success: function (result) {
                display_sales_list(result["sales"]);
            },
            error: function (request, status, error) {
                console.error("Error deleting sale:", error);
            }
        });
    }

    // When the page loads, display all the sales
    display_sales_list(sales);

    $("#submit").on("click", saveSale);

    $("#client, #reams").keypress(function (e) {
        if (e.which === 13) {
            saveSale();
        }
    });

    // Make the droppable area accept draggable elements
    $("#droppable").droppable({
        accept: ".draggable",
        hoverClass: "trash-hover",
        drop: function (event, ui) {
            // Get the sale ID from the dragged element's data attribute
            let saleId = ui.helper.data("sale-id");
            delete_sale(saleId);
        }
    });

    // Handle delete button click
    $("#salesContainer").on("click", ".deleteButton", function () {
        let saleId = $(this).data("sale-id");
        delete_sale(saleId);
    });

    $("#client").focus();

});

function display_sales_list(data) {
    const salesContainer = $("#salesContainer");

    // Empty old data
    salesContainer.empty();

    // Add each sale as a new card
    $.each(data, function (i, sale) {
        const card = `<div class="col-md-12 mb-3 draggable" data-sale-id="${sale["id"]}">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text col-md-3">${sale["salesperson"]}</p>
                                <p class="card-user col-md-3">${sale["client"]}</p>
                                <p class="card-text col-md-3">Reams: ${sale["reams"]}</p>
                                <button class="btn btn-danger col-md-3 deleteButton" data-sale-id="${sale["id"]}">Delete</button>
                            </div>
                        </div>
                    </div>`;
        salesContainer.append(card);
    });

    // Make the newly added cards draggable
    $(".draggable").draggable({
        start: function (event, ui) {
            // Set a high z-index when dragging starts
            $(this).css("z-index", 1000);
        },
        stop: function (event, ui) {
            // Reset the z-index after dragging stops
            $(this).css("z-index", "");
        },
        revert: "invalid",
    });
}

function initializeAutocomplete() {
    $("#client").autocomplete({
        source: clients,
    });
}