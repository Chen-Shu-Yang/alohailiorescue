/**
 * Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* exported initSample */

if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
    CKEDITOR.tools.enableHtml5Elements(document);

// The trick to keep the editor in the sample quite small
// unless user specified own height.
CKEDITOR.config.height = 500;
CKEDITOR.config.width = '100%';
CKEDITOR.config.resize_enabled = false;
CKEDITOR.config.toolbar = [
    ['-', 'Bold', 'Italic', 'Underline', 'Strike', 'Undo', 'Redo', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
    ['TextColor', 'BGColor', '-', 'Find', 'Replace', '-', 'NumberedList', 'BulletedList', 'Outdent', 'Indent'],
    ['Table', 'HorizontalRule', 'Blockquote', '-', 'EasyImageUpload', 'Embed', 'Link', 'Unlink'],
    '/',
    ['Styles', 'Format', 'Font', 'FontSize', '-', 'Preview', 'Source']
];

var initSample = (function () {
    var wysiwygareaAvailable = isWysiwygareaAvailable(),
        isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');

    return function () {
        var editorElement = CKEDITOR.document.getById('editor');

        // :(((
        if (isBBCodeBuiltIn) {
            editorElement.setHtml(
                'Hello world!\n\n' +
                'I\'m an instance of [url=https://ckeditor.com]CKEditor[/url].'
            );
        }

        // Depending on the wysiwygarea plugin availability initialize classic or inline editor.
        if (wysiwygareaAvailable) {
            CKEDITOR.replace('editor');
        } else {
            editorElement.setAttribute('contenteditable', 'true');
            CKEDITOR.inline('editor');

            // TODO we can consider displaying some info box that
            // without wysiwygarea the classic editor may not work.
        }
    };

    function isWysiwygareaAvailable() {
        // If in development mode, then the wysiwygarea must be available.
        // Split REV into two strings so builder does not replace it :D.
        if (CKEDITOR.revision == ('%RE' + 'V%')) {
            return true;
        }

        return !!CKEDITOR.plugins.get('wysiwygarea');
    }

})();

function uploadStory() {
    const storyTitle = $("#storyTitle").val();
    const storySlug = $("#storySlug").val();
    const storyDes = $("#storyDes").val();
    const storyContent = CKEDITOR.instances.editor.getData();

    const body = {
        title: storyTitle,
        slug: storySlug,
        description: storyDes,
        content: storyContent,
    };

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/story/new`,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            console.log(data);
            window.location = '/stories';
        }
    });
}

function loadStoryContent(id) {
    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/story-edit/${id}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            console.log(data);
            $("#storyId").val(data.STORYID);
            $("#storyTitle").val(data.STORY_TITLE);
            $("#storySlug").val(data.STORY_SLUG);
            $("#storyDes").val(data.STORY_DES);
            $("#editor").html(data.STORY_CONTENT);
        },
    });
}

function updateStory() {
    const storyId = $("#storyId").val();
    const storyTitle = $("#storyTitle").val();
    const storySlug = $("#storySlug").val();
    const storyDes = $("#storyDes").val();
    const storyContent = CKEDITOR.instances.editor.getData();

    const body = {
        title: storyTitle,
        slug: storySlug,
        description: storyDes,
        content: storyContent,
        storyId: storyId,
    };

    console.log(body);

    $.ajax({
        // headers: { authorization: `Bearer ${tmpToken}` },
        url: `${BackEndURL}/story/edit`,
        type: 'PUT',
        data: JSON.stringify(body),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
            console.log(data);
            window.location = '/stories';
        }
    });
}

$(document).ready(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const storyId = urlParams.get('storyId');

    if (storyId !== "" && storyId !== undefined) {
        $("#submitStory").attr("onclick", "updateStory()");
        loadStoryContent(storyId);
    }
});