/*
File: script.js
    Patryk Piwowarczyk, patryk_piwowarczyk@student.uml.edu
    Completed 11/29/2022
    Sources include those in the index.html but primarily (early links are from previous assignment)
    1. https://cdnjs.com/libraries/jquery-validate
    2. https://www.geeksforgeeks.org/form-validation-using-jquery/
    3. https://jqueryui.com/slider/#range
    4. https://api.jqueryui.com/tabs/ & https://www.tutorialspoint.com/jqueryui/jqueryui_tabs.htm
    5. https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch03_TabsWidget.pdf
    6. https://stackoverflow.com/questions/1581751/removing-dynamic-jquery-ui-tabs
    7. https://blog.jqueryui.com/2011/03/tabs-api-redesign/
    8. https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls
    9. https://api.jquery.com/empty/
    10. https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/insertCell
    11. https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
    12. https://jqueryvalidation.org/documentation/
    13. https://www.tutorialspoint.com/jqueryui/jqueryui_slider.htm
    14. https://stackoverflow.com/questions/23322536/how-to-switch-between-tabs-using-href
    15. https://www.w3schools.com/jsref/met_table_deleterow.asp
    16. https://www.tutorialrepublic.com/faq/how-to-keep-the-current-tab-active-on-page-reload-in-bootstrap.php
*/

// Generate multiplication table given the range values, source 10 and 11 was primarily used 
function multiplicationTable(rFirst, rLast, cFirst, cLast) {
	var table = document.createElement("table");
	deleteTable(table);
	var rowCount, colCount, i, j, row, cell, rowValue, colValue, flipRow = false, flipCol = false;
	if (rLast < rFirst) {
		flipRow = true;
		rowCount = rFirst - rLast + 1;
	} else {
		rowCount = rLast - rFirst + 1;
	}
	if (cLast < cFirst) {
		flipCol = true;
		colCount = cFirst - cLast + 1;
	} else {
		colCount = cLast - cFirst + 1;
	}

	// Create base row
	row = table.insertRow(0);
	// Insert blank cell at the cross of base row and base column
	row.insertCell(0).innerHTML = " ";

	// Fill in rest of row at base top
	colValue = cFirst;
	for (j = 1; j <= colCount; ++j) {
		row.insertCell(j).innerHTML = colValue;
        //check to see if the column value needs to be added or subtracted based on if cLast < cFirst
		if(flipCol) 
            --colValue
        else
            ++colValue;
	}
	// Remaining Rows
	rowValue = rFirst;
	for (i = 1; i <= rowCount; ++i) {
		row = table.insertRow(i);
		row.insertCell(0).innerHTML = rowValue; //leftmost cell (base rows)

		// Filling in every row minus base row value (leftmost value)
		colValue = cFirst;
		for (j = 1; j <= colCount; ++j) {
			row.insertCell(j).innerHTML = rowValue * colValue;
			if(flipCol) 
                --colValue
            else
                ++colValue;
		}
        //check to see if the column value needs to be added or subtracted based on if rLast < rFirst
        if(flipRow) 
            --rowValue
        else
            ++rowValue;	
        }

	return table;
}

// Generates a tab label
function tabLabel(rFirst, rLast, cFirst, cLast) {
	return rFirst + " x " + rLast + "<br>" + cFirst + " x " + cLast;
}

// Use an id to select tabs (link 14 and 16 used)
function selectTab(tabId) {
	var index = $("#tabs a[href='#" + tabId + "']").parent().index();
	$("#tabs").tabs("option", "active", index);
}

// Removes all selected tabs (link 7 and 8 used)
function deleteSelectedTabs() {
	$("#tabs ul li").each(function() {
		var tabId = $(this).attr("id");
		if ($("#" + tabId + " .tabCheckBox").prop("checked")) {
			var panelId = $(this).remove().attr("aria-controls");
			$("#" + panelId).remove();
			$("#tabs").tabs("refresh");
		}
	});
}

// Delete the Table (link 15 used)
function deleteTable(table) {
	while (table.rows.length) {
		table.deleteRow(0);
	}
}
var nextId = 1;
// Add the new tab for a table (tab sources used are in sources, primarily 4 and 5 and 16)
function newTab(table, label) {
	var tabId = "tab-" + nextId;
	var panelId = "tab-panel-" + nextId;

	// Create new tab
	$("#tabs > div.panelBox").append("<div id=\"" + panelId + "\"></div>");
	// Represent new tab with li
	$("#tabs ul").append("<li id=\"" + tabId + "\"><a href=\"#" + panelId + "\"><div>" + label + "</div></a> <input type=\"checkbox\" class=\"tabCheckBox\"></li>");
	// Refresh tab
	$("#tabs").tabs("refresh");

	// Copy table to a new tab (to continue showing current input until changed)
	$("#" + panelId).empty();
	$("#" + panelId).append($(table));
	++nextId;
	selectTab(tabId);

	return panelId;
}
// Save the tab when clicked, used by .html file
function submit() {
    //get values
	var rFirst = document.getElementById("firstRow").value;
	var rLast = document.getElementById("lastRow").value;
	var cFirst = document.getElementById("firstCol").value;
	var cLast = document.getElementById("lastCol").value;
    //if everything is valid, save tab and create next one
	if ($("#inputForm").valid()) {
		var table = multiplicationTable(parseInt(rFirst), parseInt(rLast), parseInt(cFirst), parseInt(cLast));
		newTab(table, tabLabel(rFirst, rLast, cFirst, cLast));
	}
}

// dynamically update the table in the tabs
function updateTable() {
	if (!$("#inputForm").valid()) {
		return;
	}
	if (!$("#tabs > ul > li").size()) {
		return;
	}
    //load new values
	var rFirst = parseInt($("#firstRow").val()); 
	var rLast = parseInt($("#lastRow").val());
	var cFirst = parseInt($("#firstCol").val());
	var cLast = parseInt($("#lastCol").val());
    //recreate the table using the new data
	var table = multiplicationTable(rFirst, rLast, cFirst, cLast);
	var currentTab = $("#tabs").tabs("option", "active");
	var tabId = $("#tabs ul li").eq(currentTab).attr("id");
	var tabIdNum = tabId.substr(4);
	var panelId = "tab-panel-" + tabIdNum;
    //label the tab to accurately portray the updated table's values
	var label = tabLabel(rFirst, rLast, cFirst, cLast);
	$("#" + tabId + " div").html(label);
	$("#" + panelId).empty();
	$("#" + panelId).append(table);
}

// load the table 
$(window).load(function() {
    //create 4 variables to represent the previous results from table
	var temprFirst = 0, temprLast = 0, tempcFirst = 0, tempcLast = 0; 

	// Validate the input is an integer, if not, fix it or give it an error
	$.validator.addMethod("integer", function(value, element, param) {
		return !isNaN(value) && Math.floor(value) == value;
	})
	// Check for errors
	$("#inputForm").validate({
        rules:{
            firstRow:{
                required: true,
                number: true,
				integer: true,
                min: -50,
                max: 50
            },
            lastRow:{
                required: true,
                number: true,
				integer: true,
                min: -50,
                max: 50
            },
            firstCol:{
                required: true,
                number: true,
				integer: true,
                min: -50,
                max: 50
            },
            lastCol:{
                required: true,
                number: true,
				integer: true,
                min: -50,
                max: 50
            }
        },
        //print the messages for the different errors that may occur in terms of the input (or lack there of)
        messages:{
            firstRow:{
                required:"You must fill every field.",
                number: "Please enter an integer that corresponds to the range."
            },
            lastRow:{
                required:"You must fill every field.",
                number: "Please enter an integer that corresponds to the range."
            },
            firstCol:{
                required:"You must fill every field.",
                number: "Please enter an integer that corresponds to the range."
            },
            lastCol:{
                required:"You must fill every field.",
                number: "Please enter an integer that corresponds to the range."
            }
        },
		//required so the page doesn't get messed up and error prints on one line
        errorElement: "span" 
	});

    //give the variables the value from the past table for current values/tab
	document.getElementById("firstRow").value = temprFirst;
	document.getElementById("lastRow").value = temprLast;
	document.getElementById("firstCol").value = tempcFirst;
	document.getElementById("lastCol").value = tempcLast;

    // Initialize tabs
	$("#tabs").tabs();

    // Create table
	var table = multiplicationTable(temprFirst, temprLast, tempcFirst, tempcLast);
	newTab(table, tabLabel(temprFirst, temprLast, tempcFirst, tempcLast));

	// Slider for First Row Value
	$("#firstRowSlider").slider({
		value: temprFirst,
		step: 1,
		min: -50,
		max: 50,
		slide: function(event, ui) { //update the text/form given slider input
			$("#firstRow").val(ui.value);
			updateTable();
		}
	});
	$("#firstRow").change(function() { //update slider given text/form input
		var value = this.value;
		$("#firstRowSlider").slider("value", parseInt(value));
		updateTable();
	});

	// Slider for Last Row Value
	$("#lastRowSlider").slider({
		value: temprLast,
		step: 1,
		min: -50,
		max: 50,
		slide: function(event, ui) {
			$("#lastRow").val(ui.value);
			updateTable();
		}
	});
	$("#lastRow").change(function() {
		var value = this.value;
		$("#lastRowSlider").slider("value", parseInt(value));
		updateTable();
	});

	// Slider for First Column Value
	$("#firstColSlider").slider({
		value: tempcFirst,
		step: 1,
		min: -50,
		max: 50,
		slide: function(event, ui) {
			$("#firstCol").val(ui.value);
			updateTable();
		}
	});
	$("#firstCol").change(function() {
		var value = this.value;
		$("#firstColSlider").slider("value", parseInt(value));
		updateTable();
	});

	// Slider for Last Column Value
	$("#lastColSlider").slider({
		value: tempcLast,
		step: 1,
		min: -50,
		max: 50,
		slide: function(event, ui) {
			$("#lastCol").val(ui.value);
			updateTable();
		}
	});
	$("#lastCol").change(function() {
		var value = this.value;
		$("#lastColSlider").slider("value", parseInt(value));
		updateTable();
	});
});