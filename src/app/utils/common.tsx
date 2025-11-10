export const getRoomId = (userId1: string, userId2: string) => {
    const sortedIds = [userId1, userId2].sort();
    const roomId = sortedIds.join('_');
    return roomId;
}


export const formatDate = (date:any)=>{
    var day = date.getDate();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = monthNames[date.getMonth()];

    var formattedDate = day + ' ' + month;
    return formattedDate;
}