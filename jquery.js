$(document).ready(function () {
    var currentDate = new Date();
    var currentDay = ("0" + currentDate.getDate()).slice(-2);
    var currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    var currentYear = currentDate.getFullYear();
    var finalDate = currentYear + "-" + currentMonth + "-" + currentDay;
    $(".row").find("#checkInDate").val(finalDate).attr("min", finalDate);
    $(".row").find("#checkOutDate").val(finalDate).attr("min", finalDate);
    function getRoomCode() {
        var room_code = $('<div class="row" id="row">' +
            '<div class="col-4 col-xl-4">' +
            '<div id="main-head"></div>' +
            '<div class="text-secondary small" id="sub_title"></div>' +
            '</div>' +
            '<div class="col-4 text-secondary">' +
            '<div>' +
            '<i class="fas fa-pen" id="edit"></i>&nbsp;&times;&nbsp;' +
            '<input type="number" value="1" disabled max=5 min=0 id="room_quant">' +
            '</div>' +
            '</div>' +
            '<div class="col-5 col-xl-4 text-right poppins mediumfont-list" id="close">' +
            '<div>&#8377; <span id="final_rate">10,500</span> <i class="fas fa-times ml-1"></i></div>' +
            '</div>' +
            '</div>'
        );
        //Edit Room Quantity
        room_code.find("#edit").on("click", function () {
            var room_quantity_id = $(this).next();
            console.log(room_quantity_id);
            var status = room_quantity_id.prop("disabled");
            if (status == true) {
                room_quantity_id.prop("disabled", false);
            } else {
                room_quantity_id.prop("disabled", true);
            }
        });
        //Disable on Blur,Enable on mouseenter,disable on mouseleave-(Room Quantity) 
        room_code.find("#room_quant").on({
            blur: function () {
                $(this).prop("disabled", true);
            },
            mouseenter: function () {
                $(this).prop("disabled", false);
            },
            mouseleave: function () {
                $(this).prop("disabled", true);
            }
        });
        //hide items     
        room_code.find("#close").click(function () {
            $(this).parents("#row").remove();
        });
        return room_code;
    }
    var room_json = {
        "r1": {
            room_id: "r1",
            main_title: "Deluxe",
            sub_title: "AC Room Only",
            quantity: 1,
            mrp: 10500
        },
        "r2": {
            room_id: "r2",
            main_title: "Semi Deluxe",
            sub_title: "Non-AC with Breakfast",
            quantity: 1,
            mrp: 10500
        },
        "r3": {
            room_id: "r3",
            main_title: "Semi Deluxe",
            sub_title: "AC with Breakfast",
            quantity: 1,
            mrp: 10500
        }
    };
    //Empty Bucket
    var room_array = [];
    console.log(room_array);
    var room_row = $("#room_list");
    //Populating list
    function populate() {
        var checkInDate = new Date($(".row").find("#checkInDate").val());
        var checkOutDate = new Date($(".row").find("#checkOutDate").val());
        var totalDays = 1;
        totalDays = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);
        room_row.empty();
        var totalAmount = 0;
        for (x in room_array) {
            var title = room_array[x].main_title;
            var sub = room_array[x].sub_title;
            var quant = room_array[x].quantity;
            var mrpPrice = room_array[x].mrp;
            var roomCode = getRoomCode();
            if (quant == 0) {
                room_array.remove(room_array.indexOf(x));
            } else {
                roomCode.appendTo(room_row);
                roomCode.find("#main-head").text(title);
                roomCode.find("#sub_title").text(sub);
                roomCode.find("#room_quant").val(quant);
                roomCode.find("#final_rate").text(mrpPrice);
                totalAmount = totalAmount + (totalDays * quant * mrpPrice);
            }
        }
        $(".row").find("#totalAmount").text(totalAmount);
    }
    function update(row_id, operation) {
        var selectedItem;
        for (x in room_array) {
            if (room_array[x].room_id == row_id) {
                selectedItem = room_array[x];
            }
        }
        if (selectedItem) {
            if (operation == "increase") {
                selectedItem.quantity += 1;
            } else if (operation == "decrease") {
                selectedItem.quantity -= 1;
            }
        } else {
            room_array.push(room_json[row_id]);
        }
    }
    //Increase Quantity
    $(".row").find("#increase").on("click", function () {
        var quantity_id = $(this).next();
        var r_id = $(this).parent().attr("id");
        var room_id = $(".row").find("#rooms");
        var rooms = room_id.text();
        var quantity_value = quantity_id.text();
        if (quantity_value < 5) {
            quantity_value++;
            rooms++;
            if (room_array.length == 0) {
                room_array.push(room_json[r_id]);
            } else {
                update(r_id, "increase");
            }
        }
        quantity_id.text(quantity_value);
        room_id.text(rooms);
        populate();
    });
    //Decrease Quantity
    $(".row").find("#decrease").on("click", function () {
        var quantity_id = $(this).prev();
        var room_id = $(".row").find("#rooms");
        var r_id = $(this).parent().attr("id");
        var rooms = room_id.text();
        var quantity_value = quantity_id.text();
        if (quantity_value > 0) {
            quantity_value--;
            rooms--;
            update(r_id, "decrease");

        }
        quantity_id.text(quantity_value);
        room_id.text(rooms);
        populate();
    });
    //Toggle Promo Code
    $(".row").find(".promotext").on({
        click: function () {
            var mrp = $(".strike").find("#mrp").text();
            var discounted_rate = mrp - (mrp * 0.25);
            var status = $(this).attr("id");
            if (status == "promotext-on") {
                $(this).attr("id", "promotext-off");
                $(".row").find(".promotextsmall").toggle(150);
                $(".row").find(".strike").toggle(150);
                var mrp = $(".strike").find("#mrp").text();
                $(".row").find(".discounted-rate").text(mrp);
            } else {
                $(this).attr("id", "promotext-on");
                $(".row").find(".promotextsmall").toggle(150);
                $(".row").find(".strike").toggle(150);
                $(".row").find(".discounted-rate").text(discounted_rate);
            }
        }
    });
    //Guest number
    $(".row").find("#guest-no").change(function () {
        var guest_no = $(this).val();
        $(".row").find("#guest").text(guest_no);
    });
});
