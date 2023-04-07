const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function createStoryRow(info) {
    const row = `
        <div class="story-row">
            <input type="number" id="storyId" value="${info.storyId}" readonly hidden />
            <span class="story-title" onclick="window.location='/stories/${info.storySlug}'">${info.storyTitle}</span>
            <div class="story-des" onclick="window.location='/stories/${info.storySlug}'">${info.storyDes}</div>
            <span class="story-date" onclick="window.location='/stories/${info.storySlug}'">${info.storyDate}</span><br>
            <button class="editStoryBtn" onclick="window.location='/blog/editor?storyId=${info.storyId}'">Edit Story</button>
            <button class="deleteStoryBtn" onclick="deleteStory(${info.storyId})">Delete Story</button>
        </div>
    `;

    return row;
}

function createFeaturedRow(info) {
    const row = `
        <div class="popular-row" onclick="window.location='/stories/${info.storySlug}'">
            <div class="popular-title">${info.storyTitle}</div>
            <div class="popular-date">${info.storyDate}</div>
        </div>
    `;

    return row;
}

function loadStoryRow(rowLimit) {
    $('.story-lists').html("");
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/story/${rowLimit}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            for (let i = 0; i < data.length; i++) {
                const story = data[i];

                let objectDate = new Date(story.CREATED_ON);
                let day = objectDate.getDate();
                let month = months[objectDate.getMonth()];
                let year = objectDate.getFullYear();
                let date = month + " " + day + ", " + year;

                let storyInfo = {
                    storyId: story.STORYID,
                    storyTitle: story.STORY_TITLE,
                    storySlug: story.STORY_SLUG,
                    storyDes: story.STORY_DES,
                    storyContent: story.STORY_CONTENT,
                    storyDate: date
                };

                let storyCard = createStoryRow(storyInfo);
                $('.story-lists').append(storyCard);
            }

            if (rowLimit > data.length) {
                $("#loadMoreBtnContain").html("");
            } else {
                $("#loadMoreBtnContain").html("");
                $("#loadMoreBtnContain").append(`<button id="loadMoreBtn" onclick="loadMoreRows()" data-rows="${data.length}">Load More</button>`);
                $("#loadMoreBtn").data("rows", data.length + 5);
            }
        },
    });
}

function loadFeaturedStoryRow() {
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/featured/story`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            for (let i = 0; i < data.length; i++) {
                const story = data[i];

                let objectDate = new Date(story.CREATED_ON);
                let day = objectDate.getDate();
                let month = months[objectDate.getMonth()];
                let year = objectDate.getFullYear();
                let date = month + " " + day + ", " + year;

                let storyInfo = {
                    storyId: story.STORYID,
                    storyTitle: story.STORY_TITLE,
                    storySlug: story.STORY_SLUG,
                    storyDes: story.STORY_DES,
                    storyContent: story.STORY_CONTENT,
                    storyDate: date
                };

                let storyCard = createFeaturedRow(storyInfo);
                $('#featuredStories').append(storyCard);
            }
        },
    });
}

function deleteStory(storyId) {
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/story/${storyId}`,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success() {
            loadStoryRow(10);
        },
    });
}

function loadMoreRows() {
    const rows = $("#loadMoreBtn").data("rows");
    loadStoryRow(rows);
}

$(document).ready(() => {
    loadStoryRow(10);
    loadFeaturedStoryRow();
});