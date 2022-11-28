/*
File: script.js
    Patryk Piwowarczyk, patryk_piwowarczyk@student.uml.edu
    Sources include those in the index.html but especially
    1. https://cdnjs.com/libraries/jquery-validate
    2. https://www.geeksforgeeks.org/form-validation-using-jquery/
*/

function multiplicationTable()
{
    var rFirst = parseInt(document.getElementById('first-Row').value);
    var rLast = parseInt(document.getElementById('last-Row').value);
    var cFirst = parseInt(document.getElementById('first-Col').value);
    var cLast = parseInt(document.getElementById('last-Col').value);
    var table = document.getElementsByClassName("table");

    //reverse the initial and terminating numbers if submitted out of order (10,5 would become 5,10 internally)
    if(rFirst > rLast){
        var temp = rFirst;
        var temp2 = rLast;
        rFirst = temp2;
        rLast = temp;
    }
    if(cFirst > cLast){
        var temp = cFirst;
        var temp2 = cLast;
        cFirst = temp2;
        cLast = temp;
    }

    //start making the table by creating the initial row columns (header)
    var tableHTML ="<thead> <tr> <th> </th>"
    for (var i = rFirst; i <= rLast; i++) {
        tableHTML += "<th>" + i + "</th>";
    }
    tableHTML += "</tr> </thead> <tbody> ";

    //create the rest of the table
    for (var j = cFirst; j <= cLast; j++) {
        tableHTML += "<tr> <th scope=\"row\">" + j + "</td>";
        for(var i = rFirst; i<=rLast; i++){
            tableHTML += "<td>" + j*i + "</td>";
        }
        tableHTML += "</tr>";
    }
    tableHTML += "<tbody>";
    table[0].innerHTML = tableHTML;
}
//Source 2 was a heavy factor in the code below for validation
$(document).ready(function(){
    $('#inputForm').on('blur keyup', function() {
        if ($('#inputForm').validate().checkForm()) {
            $('#submitButton').prop('disabled', false);
        }
        else {
            $('#submitButton').prop('disabled', true);
        }
    });
    //setting rules to prevent predictable errors
    $("#inputForm").validate({
        rules:{
            firstRow:{
                required: true,
                checkFloat: true,
                checkRange: true
            },
            lastRow:{
                required: true,
                checkFloat: true,
                checkRange: true
            },
            firstCol:{
                required: true,
                checkFloat: true,
                checkRange: true
            },
            lastCol:{
                required: true,
                checkFloat: true,
                checkRange: true
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
        }
    });
    $('#submitButton').click(multiplicationTable);
});
//Omit any floats so that the table is clean and isn't wide, making sure it works for our functions
jQuery.validator.addMethod("checkFloat", function(value, element) 
{
    return this.optional(element) || (Number.isInteger(parseFloat(value)));
}, "Integers only, floats are not supported.");
//Prevent the user from going out of bounds via KEYBOARD (different from HTML button incrementation through min/max)
jQuery.validator.addMethod("checkRange", function(value, element) 
{
    return this.optional(element) || (-51 < value) && (value < 51);
}, "Please enter an integer between -50 and 50");