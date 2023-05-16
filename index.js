var input = "";
var result = 0;

$(() => {

    var operationBtn = document.querySelectorAll('#operation');
    var inputElement = document.getElementById('input');
    let assignmentPending = false;

    const userVariables = {};
    const userHistory = {};

    function evalInput(){
        input = $('#input').val();
        if (assignmentPending == true){
            key = input.slice(0, input.indexOf('='));
            val = input.slice(input.indexOf('=') + 1);
            userVariableCreation({ [key]: val});
            assignmentPending = false;
            
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
        } else if (e.which == 61){
            assignmentPending = true;

            console.log("Varible creation is pending!");
        }
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

        $('#modal-content').html("<tr><th>Variable</th><th>Value</th></tr>");
        $('#modal-title').text("User Variables");
        for (const key in userVariables) {
            console.log(`${key}: ${userVariables[key]}`);
            $('#modal-content').html($('#modal-content').html() + `<tr><td>${key}</td><td>${userVariables[key]}</td></tr>`);
        }
    });

    $('#history').click(() => {
        console.log(userHistory);

        $('#modal-content').html("<tr><th>Input</th><th>Output</th></tr>");
        $('#modal-title').text("User History");
        for (const key in userHistory) {
            console.log(`${key}: ${userHistory[key]}`);
            $('#modal-content').html($('#modal-content').html() + `<tr><td>${key}</td><td>${userHistory[key]}</td></tr>`);
        }
    });

});