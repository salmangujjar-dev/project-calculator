var input = "";
var result = 0;

const userVariables = {};
const userHistory = {};

$(() => {

    var operationBtn = document.querySelectorAll('#operation');
    var inputElement = document.getElementById('input');

    function evalInput(){
        input = $('#input').val();
        input = input.replace(/\s/g, '');

        if (input.includes("=")){
            key = input.slice(0, input.indexOf('='));
            val = input.slice(input.indexOf('=') + 1);
            userVariableCreation({ [key]: val});
            $('#input').val("");
            $('#output').val("");            
            $('#output').attr('placeholder', 'Variable Created!');            
            console.log(userVariables);

            return;
        }

        try{
            if (input == ""){
                throw "Input is NULL";
            }
            input = input.replace(/sin/g, 'Math.sin');
            input = input.replace(/cos/g, 'Math.cos');
            input = input.replace(/tan/g, 'Math.tan');
            input = input.replace(/sqrt/g, 'Math.sqrt');
            input = input.replace('^', '**');

            Object.keys(userVariables).some(function(key){
                if (input.includes(key)){
                    input = input.replace(key, userVariables[key]);
                }
            });
            

            result = eval(input);
            if (result == "Infinity" || result == "-Infinity"){
                throw "Cannot divide by 0.";
            } else if (isNaN(result)){
                throw "Output is Not a Number";
            }
            result = '' + result;
            result = result.slice(0, result.indexOf('.')+ 5);
            
            $('#output').css('color', 'black');
            $('#output').val(result);

            createHistory({[input]:result});
        }catch(e){
            $('#output').val(e);
            $('#output').css('color', 'red');
        }

        console.log("Evaluation performed!");
    }

    function createHistory(result){
        Object.assign(userHistory, result);

        console.log('Appended in User History.');
    }

    function userVariableCreation(result){
        Object.assign(userVariables, result);

        console.log('User Variable is created!');
    }

    function clearScreen(){
        result = 0;
        $('#input').val("");
        $('#output').val("");

        for (const key in userVariables) {
            delete userVariables[key];
        }
        for (const key in userHistory) {
            delete userHistory[key];
        }

        console.log("Screen is cleared!");
    }

    function deleteTrigger(){
        text = $('#input').val();
        newText = text.slice(0, -1);
        $('#input').val(newText);

        console.log("DEL is clicked");
    }

    $(document).keypress(function(e) {
        if(e.which == 13) {
            evalInput();

            console.log("Entered is pressed!");
        } 
        // else if (e.which == 61){
        //     assignmentPending = true;

        //     console.log("Varible creation is pending!");
        // }
    });

    operationBtn.forEach(operation => {
        operation.addEventListener('click', ()=>{
            operator = operation.innerText;
            if (operator == "pi" || operator == "e"){
                operator = operation.value;
            }
            if (operator != ""){
                if (operator == "AC"){
                    clearScreen();
                } else if (operator == "DEL"){
                    deleteTrigger();
                }
                else if (operator == "="){
                    evalInput();
                } else{
                    input = $('#input');
                    input.val(input.val() + operator);
                    
                    inputLength = input.val().length - 1;
                    if (input.val().slice(-1) == ")"){
                        inputElement.setSelectionRange(inputLength,inputLength);
                    }
                }
            }
        });
    });

    $('#assign').click(() => {
        input = $('#input');
        input.val(input.val() + "=");
        assignmentPending = true;

        console.log("Varible creation is pending!");
        
    });

    $('#variables').click(() => {
        console.log(userVariables);

        $('#modal-title').text("User Variables");
        if (Object.keys(userVariables).length === 0){
            $('#modal-body').html("<h4>No User Variable Found!</h4>");
            return;
        }

        $('#modal-body').html("<div class='row'><h6 class='col-6 font-weight-bold'>Variable</h6><h6 class='col-6 font-weight-bold'>Value</h6></div>");
        for (const key in userVariables) {
            console.log(`${key}: ${userVariables[key]}`);
            $('#modal-body').html($('#modal-body').html() + `<div class='row d-flex align-items-center mt-3'><span class='col-6'>${key}</span><span class='col-6'>${userVariables[key]}</span></div>`);
        }
    });

    $('#history').click(() => {
        console.log(userHistory);

        $('#modal-title').text("User History");
        if (Object.keys(userHistory).length === 0){
            $('#modal-body').html("<h4>No User History Found!</h4>");
            return;
        }

        $('#modal-body').html("<div class='row'><h6 class='col-4 font-weight-bold'>Input</h6><h6 class='col-4 font-weight-bold'>Output</h6><h6 class='col-4 font-weight-bold'>Options</h6></div>");
        for (const key in userHistory) {
            keyStr = JSON.stringify(key);
            $('#modal-body').html($('#modal-body').html() + `<div class='row d-flex align-items-center mt-3'><span class='col-4'>${key}</span><span class='col-4'>${userHistory[key]}</span><i class='col-2 fa fa-trash fa-lg' onclick='historyDel(${keyStr})' title="Delete"></i><i class='col-2 fa fa-keyboard fa-lg' onclick='useAsInput(${keyStr})' title="Use as Input"></i></div>`);
        }
    });


});

function historyDel(key){
    delete userHistory[key];
    $('#output').val(`History Deleted for Input: ${key}`);
    $('#modal').modal("hide");

    console.log(`Key: ${key} Deleted!`);
    console.log(userHistory);
}

function useAsInput(key){
    $('#input').val(key);
    $('#output').val(userHistory[key]);
    $('#modal').modal("hide");

    console.log(`Using Key: ${key} as Input!`);
}