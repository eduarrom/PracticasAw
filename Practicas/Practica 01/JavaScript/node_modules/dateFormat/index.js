function calculateAge(birthDate)
{
    today = new Date();
    todayYear = today.getFullYear();
    todayMonth = today.getMonth();
    todayDay = today.getDate();
    birthYear = birthDate.getFullYear();
    birthMonth = birthDate.getMonth();
    birthDay = birthDate.getDate();
    age = todayYear - birthYear;

    if (todayMonth < (birthMonth - 1)){
        age--;
    }
    if (((birthMonth - 1) == todayMonth) && (todayDay < birthDay)){
        age--;
    }
    
    return age;
}

function calculateDate(birthDate){
    birthYear = birthDate.getFullYear();
    birthMonth = birthDate.getMonth();
    birthDay = birthDate.getDate();
    return birthYear + "-" + (birthMonth + 1) + "-" + birthDay;
}

module.exports = {
    calculateAge: calculateAge,
    calculateDate: calculateDate
}