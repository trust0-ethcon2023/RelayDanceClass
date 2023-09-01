const sheets = require("gdrive-sheets");

var _mirrored = false;
var _current_rate = "1.0";
var _has_chapters = false;
var _repeats_chapter = false;

function on_loaded() {
    if ($data["video-id"]) {
        var favorite = controller.catalog().value("showcase", "favorites", "S_FAVORITES_" + $data["video-id"]);

        if (favorite) {
            view.object("btn.favorite").property({ "selected": "yes" });
        }
    }
}

function feed_chapters(keyword, location, length, sortkey, sortorder, handler) {
    if ($data["video-id"]) {
        var chapters = controller.catalog().value("showcase", "chapters", "S_CHAPTERS_" + $data["video-id"]);

        if (!chapters) {
            sheets.fetch_data($data["spreadsheet"], "시트1")
                .then(function(data) {
                    return data.map(function(datum) {
                       return Object.assign(datum, {
                           "video-id": $data["video-id"]
                       });
                    });
                })
                .then(function(data) {
                    controller.catalog().submit("showcase", "chapters", "S_CHAPTERS_" + $data["video-id"], {
                        "data": JSON.stringify(data)
                    });

                    handler(data);

                    view.object("showcase.chapters").action("sync", {
                        "player": "youtube.player",
                        "skips-playing": "no"
                    });

                    _has_chapters = true;
                });
        } else {
            handler(JSON.parse(chapters["data"]));

            view.object("showcase.chapters").action("sync", {
                "player": "youtube.player",
                "skips-playing": "no"
            });

            _has_chapters = true;
        }
    } else {
        handler([]);
    }
}

function on_data_changed(id, data) {
    if (id.startsWith("favorite-")) {
        view.object("btn.favorite").property({
            "selected": data["favorite"]
        });
    }
}

function toggle_favorite() {
    owner.action("script", {
        "script": "toggle_favorite",
        "video-id": $data["video-id"]
    });
}

function toggle_mirror() {
    view.object("youtube.player").action("mirror", { "toggle": "yes" });

    if (_mirrored = !_mirrored) {
        controller.action("toast", { 
            "message": controller.catalog().string("Switch to mirror mode.") 
        });
    } else {
        controller.action("toast", { 
            "message": controller.catalog().string("Turn off mirror mode.")
        });
    }
}

function change_rate() {
    var rate = { "1.0": "0.5", "0.5": "0.2", "0.2": "1.0" }[_current_rate];

    view.object("youtube.player").action("rate", { "rate": rate });
    view.object("btn.rate").property({ 
        "image": "btn_rate_" + rate.replace(".", "_") + ".png" 
    });
    controller.action("toast", { 
        "message": controller.catalog().string("Switches to #_x speed.").replace("#_", rate.replace(".0", ""))
    });

    _current_rate = rate;
}

function show_contents() {
    owner.action("script", {
        "script": "show_contents"
    });
}

function prev_chapter() {
    if (_has_chapters) {
        view.object("showcase.chapters").action("prev", {
            "player": "youtube.player"
        });
        controller.action("toast", {
            "message": controller.catalog().string("Move to the previous scene.")
        });
    } else {
        controller.action("toast", {
            "message": controller.catalog().string("Please try again later.")
        });
    }
}

function next_chapter() {
    if (_has_chapters) {
        view.object("showcase.chapters").action("next", {
            "player": "youtube.player"
        });
        controller.action("toast", {
            "message": controller.catalog().string("Move to the next scene.")
        });
    } else {
        controller.action("toast", {
            "message": controller.catalog().string("Please try again later.")
        });
    }
}

function repeat_chapter() {
    view.object("showcase.chapters").action("repeat", { "toggle": "yes" });

    if (_repeats_chapter = !_repeats_chapter) {
        view.object("btn.toolbar.repeat").property({ "selected": "yes" });
        controller.action("toast", { 
            "message": controller.catalog().string("Repeat play is set.")
        })
    } else {
        view.object("btn.toolbar.repeat").property({ "selected": "no" });
        controller.action("toast", { 
            "message": controller.catalog().string("Repeat playback is turned off.")
        });
    }
}
