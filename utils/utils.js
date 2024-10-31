export function formatDate(fullDate){
    const date = fullDate.split("-");
    const year = date[0];
    const month = date[1];
    const day = date[2].split("T")[0];
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate
}