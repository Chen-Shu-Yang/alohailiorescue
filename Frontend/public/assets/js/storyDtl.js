const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function loadStoryContent(slug) {
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/story-dtl/${slug}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            $("#storyTitle").text(data.STORY_TITLE);
            $("#storyContent").html(data.STORY_CONTENT);
            
            let objectDate = new Date(data.CREATED_ON);
            let day = objectDate.getDate();
            let month = months[objectDate.getMonth()];
            let year = objectDate.getFullYear();
            $("#storyDate").text(month + " " + day + ", " + year);
        },
    });
}

$(document).ready(() => {
    const url = window.location.href;
    loadStoryContent(url.split('/stories/')[1]);
});