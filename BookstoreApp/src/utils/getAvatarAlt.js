export default function getAvatarAlt(user){
    if (user.fullName){
        var names= user.fullName.split(" ");
        if (names.length===1) return names[0][0];
        if (names.length>=2) return names[0][0] + names[names.length-1][0];
    }else return user.username[0];
}