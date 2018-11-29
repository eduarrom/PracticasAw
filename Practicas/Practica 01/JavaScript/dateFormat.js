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

    if (todayMonth < birthMonth){
        age--;
    } else if ((birthMonth == todayMonth) && (todayDay < birthDay)){
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