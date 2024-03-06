// if not logged user then redirect to login
if(!localStorage.getItem('loggedUser')){
    $('#homeToastMsg').text("User must get logged in first, to get on Home Page !!!");
    $("#viewHomeToast").toast('show');
    $("#homeToastButton").text('Go To Login Page');
    $("#homeToastButton").on('click',function(){
        window.location.href="loginPageHTML.html";
    })
}


// INITIALING STUFF
// Initialize intlTelInput plugin
const input = document.querySelector("#profileEditContact");
const iti = window.intlTelInput(input, {
    initialCountry: "in",
    separateDialCode: true,
    hiddenInput: "full",
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
});

// Listen to the input event and update the country code accordingly
input.addEventListener("#profileEditContact", function() {
  const selectedCountryData = iti.getSelectedCountryData();
  console.log("Country Code: +" + selectedCountryData.dialCode);
});



// FUNCTIONS UTILITIES
const FnameRegex = /^[a-zA-Z]{1,}$/;
const LnameRegex = /^[a-zA-Z]{0,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,16}$/;
const contactRegex = /^\d{10}$/;
var curDate;
var updateObj;


// GENERAL
function redBorder(ele) { ele.css('border-color', '#ff0000'); }
function revertBorder(ele) { ele.css('border-color', '#5e6278'); }
function Nullify(ele) { ele.val(''); }
function NullifyCheck(ele) { ele.prop('indeterminate', false); ele.prop('checked', false); }
function showToast(msg) {
    $('#homeToastMsg').text(msg);
    $("#viewHomeToast").toast("show");
}
function DisplaySpan(ele) {
    ele.css('visibility', 'visible');
    ele.css('position', 'relative');
}
function removeSpan(ele) {
    ele.css('visibility', 'hidden');
    ele.css('position', 'absolute');
}



// PERFORM CHANGES BUTTON REQUIREMENTS STARTS HERE 

function isValidEditFname() {
    return FnameRegex.test($("#profileEditFname").val());
}
function isValidEditLname() {
    if($("#profileEditLname").val()===""){return true;}
    return LnameRegex.test($("#profileEditLname").val());;
}
function isValidEditDate() {
    curDate = new Date()
    if ($("#profileEditDOB").val() === "") {
        return false;
    }
    return (($("#profileEditDOB").val()) >= ((curDate.getFullYear() - 15).toString() + "-" + (curDate.getMonth() + 1).toString() + "-" + curDate.getDate().toString()));
}
function isValidEditAddress() {
    if ($("#profileEditAddress").val() === "") {
        return false;
    }
    return true;
}
// function isValidEditRole() {
//     return $("#profileEditAdminCheck").prop('indeterminate') || $("#profileEditUser").prop('indeterminate') || $("#profileEditUserCheck").is(':checked') || $("#profileEditAdminCheck").is(':checked') || $("#profileEditAdminReadCheck").is(':checked') || $("#profileEditAdminWriteCheck").is(':checked') || $("#profileEditUserReadCheck").is(':checked') || $("#profileEditUserWriteCheck").is(':checked');
// }
function isValidEditGender() {
    return $("#profileEditGenderMale").is(':checked') || $("#profileEditGenderFemale").is(':checked') || $("#profileEditGenderOther").is(':checked');
}
function isValidEditLanguage() {
    if ($("#profileEditLanguage").val() === "")
        return false;
    return true;
}
function isValidEditSkill() {
    if (skillsArray.length === 0)
        return false;
    return true;
}
function isValidEditEmail() {
    return emailRegex.test($("#profileEditEmail").val());
}
function isValidEditContact() {
    return contactRegex.test($("#profileEditContact").val());
}
function isValidEditPassword() {
    if($("#profileEditPassword").val()==""){return true;}
    return passwordRegex.test($("#profileEditPassword").val());
}
function isValidEditConfirmPassword() {
    if (isValidEditPassword()) {
        return ($("#profileEditPassword").val() === $("#profileEditConfirmPassword").val());
    }
    return false;
}
// DISABLE SINGUP BUTTON
// function disableChangeButton() {
//     if ($("#profileEditFname").val() === "" ||
//         $("#profileEditDOB").val() === "" ||
//         !($("#profileEditGenderMale").is(":checked") ||
//             $("#profileEditGenderFemale").is(":checked") ||
//             $("#profileEditGenderOther").is(":checked")) ||
//         !($("#profileEditAdminReadCheck").is(":checked") ||
//             $("#profileEditAdminWriteCheck").is(":checked") ||
//             $("#profileEditUserReadCheck").is(":checked") ||
//             $("#profileEditUserWriteCheck").is(":checked")) ||
//         $("#profileEditAddress").val() === "" ||
//         $("#profileEditLanguage").val() === "" ||
//         $("#profileEditSkill").val() === "" ||
//         $("#profileEditEmail").val() === "" ||
//         $("#profileEditContact").val() === "") {

//             $("#profileEditChangeButton").prop('disabled', true);
//     } else {
//         $("#profileEditChangeButton").prop('disabled', false);
//     }
// }
// PERFORM CHANGES BUTTON REQUIREMENTS ENDS HERE 





// DOCUMENT ON LOAD
$(document).ready(function(){
    let loggedUserData = JSON.parse(localStorage.getItem("loggedUser"));
    $("#navbarProfilePic").attr("src",loggedUserData.profilepic);
});

// PROFILE INFORMATION SCRIPT STARTS HERE
let currSkills=[];
$("#profileInfoModal").on('show.bs.modal', function () {
    let loggedUserData = JSON.parse(localStorage.getItem('loggedUser'));

    $("#profileInfoPic").attr("src",loggedUserData.profilepic);
    $('#profileInfoID').text(loggedUserData.id);
    $('#profileInfoEmail').text(loggedUserData.email);
    let lname=loggedUserData.lname;
    if(lname){$('#profileInfoName').text(loggedUserData.fname +" "+ loggedUserData.lname);}
    else{$('#profileInfoName').text(loggedUserData.fname);}
    $('#profileInfoContact').text(loggedUserData.contact);
    $('#profileInfoDOB').text(loggedUserData.dob);
    $('#profileInfoGender').text(loggedUserData.gender);
    $('#profileInfoLanguage').text(loggedUserData.preferredlanguage);
    $('#profileInfoAddress').text(loggedUserData.address);

    let role = loggedUserData.role;
    let keyRole = Object.keys(role)[0];
    let formatRole = `${keyRole} : ${role[keyRole].length === 1 ? role[keyRole][0] : role[keyRole].join(' and ')}`;
    $("#profileInfoRole").text(formatRole);

    // skills making sure that it not gets duplicated on closing and opening the Edit.
    let skills = loggedUserData.programmingSkills;
    skills.forEach(skill => {
        if(!currSkills.includes(skill)){
            // let spanH = $('<div>').addClass('pillSpan bg-secondary text-white border d-flex py-1 px-2');
            
            // bold middle dot char = '•'

            let spanD = $('<div>').addClass('pillP d-flex mx-1 fw-bold text-primary').text('>')
            let spanP = $('<div>').addClass('fw-bold text-secondary').text(skill);
            // spanH.append(spanP);
            // $("#profileInfoSkillPills").append(spanH);
            spanD.append(spanP);
            $("#profileInfoSkillPills").append(spanD);
            currSkills.push(skill);
        }
    });
})

// PROFILE INFORMATION SCRIPT ENDS HERE




// PROFILE EDIT SCRIPT STARTS HERE

$("#profileEditModal").on('show.bs.modal', function () {

    // remove span and revert the border so that if user closes modal with incorrection and reopes the span will remains when we have fetched the value
    removeSpan($(".alertSpan"));

    revertBorder($('#profileEditFname'));
    revertBorder($('#profileEditEmail'));
    revertBorder($('#profileEditContact'));
    revertBorder($('#profileEditDOB'));
    revertBorder($('#profileEditLanguage'));
    revertBorder($('#profileEditAddress'));
    revertBorder($('#profileEditSkill'));

    let prefLang = JSON.parse(localStorage.getItem("preferredLanguages"));
    $.each(prefLang, function (index, item) {
        $("#profileEditLanguage").append('<option value="' + item + '">' + item + '</option>');
    });

    let loggedUserData = JSON.parse(localStorage.getItem('loggedUser'));
    $('#profileEditID').text(loggedUserData.id);
    $('#profileEditEmail').val(loggedUserData.email);
    $('#profileEditFname').val(loggedUserData.fname);
    let lname=loggedUserData.lname;
    if(lname){$('#profileEditLname').val(loggedUserData.lname);}
    // slicing contact to only get last 10 digit.
    $('#profileEditContact').val(loggedUserData.contact.slice(-10));
    $('#profileEditDOB').val(loggedUserData.dob);
    $('#profileEditGender' + loggedUserData.gender).prop('checked', true);
    $('#profileEditLanguage').val(loggedUserData.preferredlanguage);
    $('#profileEditAddress').val(loggedUserData.address);

    // for role need to clear them so that no conflict occurs
    NullifyCheck($('#profileEditAdminCheck'));
    NullifyCheck($('#profileEditAdminReadCheck'));
    NullifyCheck($('#profileEditAdminWriteCheck'));
    NullifyCheck($('#profileEditUserCheck'));
    NullifyCheck($('#profileEditUserReadCheck'));
    NullifyCheck($('#profileEditUserWriteCheck'));

    let role = loggedUserData.role;
    let keyRole = Object.keys(role)[0];

    if (role[keyRole].length == 1) {
        $('#profileEdit' + keyRole + 'Check').prop('indeterminate', true);
        $('#profileEdit' + keyRole + role[keyRole][0] + 'Check').prop('checked', true);
    }
    else {
        $('#profileEdit' + keyRole + 'Check').prop('checked', true);
        $('#profileEdit' + keyRole + role[keyRole][0] + 'Check').prop('checked', true);
        $('#profileEdit' + keyRole + role[keyRole][1] + 'Check').prop('checked', true);
    }

    $('#profileEditAminCheck').prop('disabled',true);


});

// SCRIPT FOR PILLS IN EDIT SECTION STARTS HERE
let skillsArray = [];

$(document).ready(function () {
    $('#profileEditModal').on('show.bs.modal', function () {
        
        $("#profileEditProgrammingSkill").on('click', function () {
            revertBorder($(this));
            $(this).val('');
        })

        let prefSkill = JSON.parse(localStorage.getItem("programmingSkills"));
        $.each(prefSkill, function (index, item) {
            $("#profileEditSkillList").append('<option value="' + item + '">' + item + '</option>');
        });

        // existing records
        let loggedUserData=JSON.parse(localStorage.getItem('loggedUser'));
        let skills = loggedUserData.programmingSkills;
        skills.forEach(skill => {
            if(!skillsArray.includes(skill)){
                let spanH = $('<div>').addClass('pillSpan bg-secondary text-white border d-flex py-1 px-2');
                let spanP = $('<div>').addClass('pillP').text(skill);
                let spanC = $('<div>').addClass('crossIcon').text('✖');
                spanH.append(spanP);
                spanH.append(spanC);
                $("#profileEditSkillPills").append(spanH);
                skillsArray.push(skill);
            }
        });

        // on change
        $('#profileEditSkill').on('change', function () {
            var selectedSkill = $(this).val();
            if (selectedSkill && !skillsArray.includes(selectedSkill)) {
                let spanH = $('<div>').addClass('pillSpan bg-secondary text-white rounded-4 border d-flex py-1 px-2');
                let spanP = $('<div>').addClass('pillP').text(selectedSkill);
                let spanC = $('<div>').addClass('crossIcon').text('✖');
                spanH.append(spanP);
                spanH.append(spanC);
                $('#profileEditSkillPills').append(spanH);
                $(this).val(''); // Clear input after selecting skill
                skillsArray.push(selectedSkill);
            }
            else {
                redBorder($('#profileEditSkill'));
                DisplaySpan($('#editskillspan'));
                $('#profileEditSkill').val("");
            }
        });

        $(document).on('click', '.crossIcon', function () {
            let skillToRemove = $(this).prev().text().trim();
            skillsArray = skillsArray.filter(function (e) { return e !== skillToRemove; });
            $(this).parent().remove();
            console.log(skillsArray);
        });
    });

});

// SCRIPTS FOR PILLS IN EDIT SECTION ENDS HERE



// CHANGES TO BE DONE

$('#profileEditEmail').on('click',function(){
    // disableSignup();
    revertBorder($(this));
    removeSpan($('#editmailspan'))
});
$('#profileEditFname').on('click',function(){
    // disableSignup();
    revertBorder($(this));
    removeSpan($('#editfnamespan'))
});
$('#profileEditContact').on('click',function(){
    // disableSignup();
    revertBorder($(this));
    removeSpan($('#editcontactspan'))
});
$('#profileEditDOB').on('click',function(){
    // disableSignup();
    revertBorder($(this));
    removeSpan($('#editdobspan'))
});

// gender
$("#profileEditGenderMale").on('click', function () {
    // disableSignup();
    removeSpan($("#editgenderspan"));
});
$("#profileEditGenderFemale").on('click', function () {
    // disableSignup();
    removeSpan($("#editgenderspan"));
});
$("#profileEditGenderOther").on('click', function () {
    // disableSignup();
    removeSpan($("#editgenderspan"));
});
// gender end

$("#profileEditLanguage").on('click',function(){
    revertBorder($(this));
    removeSpan($('#editlangspan'))

});
$("#profileEditAddress").on('click',function(){
    revertBorder($(this));
    removeSpan($('#editaddressspan'))

});
$("#profileEditSkill").on('click',function(){
    revertBorder($(this));
    removeSpan($('#editskillspan'))

});
$("#profileEditPassword").on('click',function(){
    revertBorder($(this));
    removeSpan($("#editpassspan"));
});
$("#profileEditChangePassword").on('click',function(){
    revertBorder($(this));
    removeSpan($("#editcpassspan"));
});

//role (uneditable) (to edit see the code commentted below whole script)
$('#profileEditAdminCheck').on('click',function(){
    return false;
})
$('#profileEditAdminReadCheck').on('click',function(){
    return false;
})
$('#profileEditAdminWriteCheck').on('click',function(){
    return false;
})
$('#profileEditUserCheck').on('click',function(){
    return false;
})
$('#profileEditUserReadCheck').on('click',function(){
    return false;
})
$('#profileEditUserWriteCheck').on('click',function(){
    return false;
})







// crate and store make user of skills array keep it as below like this as possible but mandatory to below it of skillsArray.
function changeAndStoreInformation() {
    let roleObj;
    if ($("#profileEditAdminCheck").is(':checked') || $("#profileEditAdminCheck").prop('indeterminate')) {
        if ($("#profileEditAdminReadCheck").is(':checked') && $("#profileEditAdminWriteCheck").is(':checked')) {
            roleObj = { "Admin": ["Read", "Write"] };
        }
        else if ($("#profileEditAdminReadCheck").is(':checked') && !$("#profileEditAdminWriteCheck").is(':checked')) {
            roleObj = { "Admin": ["Read"] };
        }
        else { roleObj = { "Admin": ["Write"] }; }
    }
    else {
        if ($("#profileEditUserReadCheck").is(':checked') && $("#profileEditUserWriteCheck").is(':checked')) {
            roleObj = { "User": ["Read", "Write"] };
        }
        else if ($("#profileEditUserReadCheck").is(':checked') && !$("#profileEditUserWriteCheck").is(':checked')) {
            roleObj = { "User": ["Read"] };
        }
        else { roleObj = { "User": ["Write"] }; }
    }

    let gender = "Other";
    let profilePic = "../assets/profile/other.png";
    if ($("#profileEditGenderMale").is(':checked')) {
        gender = "Male";
        profilePic = "../assets/profile/male.png";
    }
    if ($("#profileEditGenderFemale").is(':checked')) {
        gender = "Female";
        profilePic = "../assets/profile/female.png";
    }


    // let myVar = JSON.parse(localStorage.getItem("allUsers"));

    // let newUser = {
    //     "id": myVar.length,
    //     "fname": $("#profileEditFname").val(),
    //     "lname": $("#profileEditLname").val(),
    //     "dob": $("#profileEditDOB").val(),
    //     "address": $("#profileEditAddress").val(),
    //     "role": roleObj,
    //     "gender": gender,
    //     "preferredlanguage": $("#profileEditLanguage").val(),
    //     "programmingSkills": skillsArray,
    //     "email": $("#profileEditEmail").val(),
    //     "contact": $("#profileEditContact").val()
    // }

    // myVar.push(newUser);
    // localStorage.setItem("loggedUser", JSON.stringify(newUser));
    
    let currUserID = JSON.parse(localStorage.getItem("loggedUser")).id;
    let users = JSON.parse(localStorage.getItem("allUsers"));
    let userToUpdate = users.find(element => element.id === currUserID);
    userToUpdate.fname=$("#profileEditFname").val();
    userToUpdate.lname=$("#profileEditLname").val();
    userToUpdate.fname=$("#profileEditFname").val();
    userToUpdate.dob=$("#profileEditDOB").val();
    userToUpdate.address=$("#profileEditAddress").val();
    userToUpdate.role=roleObj;
    userToUpdate.gender=gender;
    userToUpdate.preferredlanguage=$("#profileEditLanguage").val();
    userToUpdate.programmingSkills=skillsArray;
    userToUpdate.email=$("#profileEditEmail").val();
    userToUpdate.contact=$("#profileEditContact").val();
    userToUpdate.profilepic=profilePic;
    let password=$("#profileEditPassword").val();
    if(password){
        userToUpdate.password=password;
    }

    localStorage.setItem("loggedUser", JSON.stringify(userToUpdate));
    localStorage.setItem("allUsers", JSON.stringify(users));
}
//ends up here

$("#profileEditChangeButton").on('click', function () {
    let flag = true;
    if (!isValidEditFname()) {
        // disableSignup();
        redBorder($("#profileEditFname"));
        Nullify($("#profileEditFName"));
        DisplaySpan($("#editfnamespan"));
        flag = false;
    }
    if (!isValidEditLname()) {
        // disableSignup();
        redBorder($("#profileEditLname"));
        Nullify($("#profileEditLName"));
        DisplaySpan($("#editlnamespan"));
        flag = false;
    }
    if (!isValidEditDate()) {
        // disableSignup();
        redBorder($("#profileEditDOB"));
        Nullify($("#profileEditDOB"));
        DisplaySpan($("#editdobspan"));
        flag = false;
    }
    // if (!isValidEditRole()) {
    //     // disableSignup();
    //     NullifyCheck($("#profileEditAdminCheck"));
    //     NullifyCheck($("#profileEditAdminReadCheck"));
    //     NullifyCheck($("#profileEditAdminWriteCheck"));
    //     NullifyCheck($("#profileEditUserCheck"));
    //     NullifyCheck($("#profileEditUserReadCheck"));
    //     NullifyCheck($("#profileEditUserWriteCheck"));
    //     DisplaySpan($("#editrolespan"));
    //     flag = false;
    // }
    if (!isValidEditAddress()) {
        // disableSignup();
        redBorder($("#profileEditAddress"));
        Nullify($("#profileEditAddress"));
        DisplaySpan($("#editaddressspan"));
        flag = false;
    }
    if (!isValidEditGender()) {
        // disableSignup();
        NullifyCheck($("#profileEditGenderMale"));
        NullifyCheck($("#profileEditGenderFemale"));
        NullifyCheck($("#profileEditGenderOther"));
        DisplaySpan($("#editgenderspan"));
        flag = false;
    }
    if (!isValidEditLanguage()) {
        // disableSignup();
        redBorder($("#profileEditLanguage"));
        Nullify($("#profileEditLanguage"));
        DisplaySpan($("#editlangspan"));
        flag = false;
    }
    if (!isValidEditSkill()) {
        // disableSignup();
        redBorder($("#profileEditSkill"));
        Nullify($("#profileEditSkill"));
        DisplaySpan($("#editskillspan"));
        flag = false;
    }
    if (!isValidEditEmail()) {
        // disableSignup();
        redBorder($("#profileEditEmail"));
        Nullify($("#profileEditEmail"));
        DisplaySpan($("#editemailspan"));
        flag = false;
    }
    if (!isValidEditContact()) {
        // disableSignup();
        redBorder($("#profileEditContact"));
        Nullify($("#profileEditContact"));
        DisplaySpan($("#editcontactspan"));
        flag = false;
    }
    if (!isValidEditPassword()) {
        // disableSignup();
        redBorder($("#profileEditPassword"));
        Nullify($("#profileEditPassword"));
        DisplaySpan($("#editpassspan"));
        flag = false;
    }
    if (!isValidEditConfirmPassword()) {
        // disableSignup();
        redBorder($("#profileEditConfirmPassword"));
        Nullify($("#profileEditConfirmPassword"));
        DisplaySpan($("#editcpassspan"));
        flag = false;
    }



    if (flag) {

        changeAndStoreInformation();

        Nullify($("#profileEditFname"));
        Nullify($("#profileEditLname"));
        Nullify($("#profileEditDOB"));
        NullifyCheck($("#profileEditAdminCheck"));
        NullifyCheck($("#profileEditAdminReadCheck"));
        NullifyCheck($("#profileEditAdminWriteCheck"));
        NullifyCheck($("#profileEditUserCheck"));
        NullifyCheck($("#profileEditUserReadCheck"));
        NullifyCheck($("#profileEditUserWriteCheck"));
        Nullify($("#profileEditAddress"));
        NullifyCheck($("#profileEditGenderMale"));
        NullifyCheck($("#profileEditGenderFemale"));
        NullifyCheck($("#profileEditGenderOther"));
        Nullify($("#profileEditLanguage"));
        Nullify($("#profileEditProgrammingSkill"));
        Nullify($("#profileEditEmail"));
        Nullify($("#profileEditContact"));

        // empty the pills
        $('#profileEditSkillPills').empty();
        // empty skillsarray to make sure pills came back at modal open
        skillsArray=[];
        // close modal
        $('#profileEditModal').modal('hide');

        $('#homeToastMsg').text("Changes are perform successfuly !!");
        $("#viewHomeToast").toast('show');
        $("#homeToastButton").text('Okay');
        $("#homeToastButton").on('click',function(){
            $("#viewHomeToast").toast('hide');
        })
        
        setTimeout(function(){
            location.reload();
        },1500);
    }

})




$('#profileLogOutButton').on('click',function(){
    localStorage.removeItem('loggedUser');
    window.location.href = "loginPageHTML.html";
})












/*

// role edit can done by this but since we dont want to let user edit role we dont need it in edit profile yet (04/03/2024)

// role start
//admin
$("#profileEditAdminCheck").on('click', function () {
    // disableSignup();
    removeSpan($("#editrolespan"));

    //logic for admin
    if ($(this).is(':checked')) {
        $("#profileEditAdminReadCheck").prop('checked', true);
        $("#profileEditAdminWriteCheck").prop('checked', true);
    }
    else {
        $("#profileEditAdminReadCheck").prop('checked', false);
        $("#profileEditAdminWriteCheck").prop('checked', false);
    }

    //logic for user
    $("#profileEditUserCheck").prop('indeterminate', false);
    $("#profileEditUserCheck").prop('checked', false);
    $("#profileEditUserReadCheck").prop('checked', false);
    $("#profileEditUserWriteCheck").prop('checked', false);
})
//admin read
$("#profileEditAdminReadCheck").on('click', function () {
    // disableSignup();
    removeSpan($("#editrolespan"));

    //logic for admin
    if ($(this).is(':checked')) {
        if ($("#profileEditAdminWriteCheck").is(":checked")) {
            $("#profileEditAdminCheck").prop('indeterminate', false);
            $("#profileEditAdminCheck").prop('checked', true);
        }
        else {
            $("#profileEditAdminCheck").prop('indeterminate', true);
        }
    }
    else {
        if ($("#profileEditAdminWriteCheck").is(":checked")) {
            $("#profileEditAdminCheck").prop('indeterminate', true);
        }
        else {
            $("#profileEditAdminCheck").prop('indeterminate', false);
            $("#profileEditAdminCheck").prop('checked', false);
        }
    }

    //logic for user
    $("#profileEditUserCheck").prop('indeterminate', false);
    $("#profileEditUserCheck").prop('checked', false);
    $("#profileEditUserReadCheck").prop('checked', false);
    $("#profileEditUserWriteCheck").prop('checked', false);
})
//admin write
$("#profileEditAdminWriteCheck").on('click', function () {
    // disableSignup();
    removeSpan($("#editrolespan"));

    //logic for admin
    if ($(this).is(':checked')) {
        if ($("#profileEditAdminReadCheck").is(":checked")) {
            $("#profileEditAdminCheck").prop('indeterminate', false);
            $("#profileEditAdminCheck").prop('checked', true);
        }
        else {
            $("#profileEditAdminCheck").prop('indeterminate', true);
        }
    }
    else {
        if ($("#profileEditAdminReadCheck").is(":checked")) {
            $("#profileEditAdminCheck").prop('indeterminate', true);
        }
        else {
            $("#profileEditAdminCheck").prop('indeterminate', false);
            $("#profileEditAdminCheck").prop('checked', false);
        }
    }

    //logic for user
    $("#profileEditUserCheck").prop('indeterminate', false);
    $("#profileEditUserCheck").prop('checked', false);
    $("#profileEditUserReadCheck").prop('checked', false);
    $("#profileEditUserWriteCheck").prop('checked', false);
})

//user
$("#profileEditUserCheck").on('click', function () {
    // disableSignup();
    removeSpan($("#editrolespan"));

    //logic for user
    if ($(this).is(':checked')) {
        $("#profileEditUserReadCheck").prop('checked', true);
        $("#profileEditUserWriteCheck").prop('checked', true);
    }
    else {
        $("#profileEditUserReadCheck").prop('checked', false);
        $("#profileEditUserWriteCheck").prop('checked', false);
    }

    //logic for admin
    $("#profileEditAdminCheck").prop('indeterminate', false);
    $("#profileEditAdminCheck").prop('checked', false);
    $("#profileEditAdminReadCheck").prop('checked', false);
    $("#profileEditAdminWriteCheck").prop('checked', false);
})
//user read
$("#profileEditUserReadCheck").on('click', function () {
    // disableSignup();
    removeSpan($("#editrolespan"));

    //logic for user
    if ($(this).is(':checked')) {
        if ($("#profileEditUserWriteCheck").is(":checked")) {
            $("#profileEditUserCheck").prop('indeterminate', false);
            $("#profileEditUserCheck").prop('checked', true);
        }
        else {
            $("#profileEditUserCheck").prop('indeterminate', true);
        }
    }
    else {
        if ($("#profileEditUserWriteCheck").is(":checked")) {
            $("#profileEditUserCheck").prop('indeterminate', true);
        }
        else {
            $("#profileEditUserCheck").prop('indeterminate', false);
            $("#profileEditUserCheck").prop('checked', false);
        }
    }

    //logic for admin
    $("#profileEditAdminCheck").prop('indeterminate', false);
    $("#profileEditAdminCheck").prop('checked', false);
    $("#profileEditAdminReadCheck").prop('checked', false);
    $("#profileEditAdminWriteCheck").prop('checked', false);
})
//user write
$("#profileEditUserWriteCheck").on('click', function () {
    // disableSignup();
    removeSpan($("#editrolespan"));

    //logic for user
    if ($(this).is(':checked')) {
        if ($("#profileEditUserReadCheck").is(":checked")) {
            $("#profileEditUserCheck").prop('indeterminate', false);
            $("#profileEditUserCheck").prop('checked', true);
        }
        else {
            $("#profileEditUserCheck").prop('indeterminate', true);
        }
    }
    else {
        if ($("#profileEditUserReadCheck").is(":checked")) {
            $("#profileEditUserCheck").prop('indeterminate', true);
        }
        else {
            $("#profileEditUserCheck").prop('indeterminate', false);
            $("#profileEditUserCheck").prop('checked', false);
        }
    }

    //logic for admin
    $("#profileEditAdminCheck").prop('indeterminate', false);
    $("#profileEditAdminCheck").prop('checked', false);
    $("#profileEditAdminReadCheck").prop('checked', false);
    $("#profileEditAdminWriteCheck").prop('checked', false);
})

//role ends here

*/