const module = (() => {
    return {
        values: (category, location, length, sortkey, sortorder) => {
            return controller.catalog().values("showcase", "contents", category, null, [ location, length ], [ sortkey, sortorder ]);
        },
        
        count: (category) => {
            return controller.catalog().count("showcase", "contents", category || null);
        },
        
        value: (content_id) => {
            return controller.catalog().value("showcase", "contents", "S_CONTENTS_" + content_id);
        },
        
        latest: () => {
            return controller.catalog().values("showcase", "contents", null, null, [ 0, 1 ], [ "rowid", "decending" ])[0];
        },

        random: () => {
            return controller.catalog().values("showcase", "contents", null, null, [ 0, 1 ], [ null, "random" ])[0];
        },
        
        submit: (content_id, data) => {
            controller.catalog().submit("showcase", "contents", "S_CONTENTS_" + content_id, data);
        },
        
        categorize: (content_id, category) => {
            controller.catalog().categorize("showcase", "contents", "S_CONTENTS_" + content_id, [ category ], null);
        },
        
        uncategorize: (content_id, category) => {
            controller.catalog().categorize("showcase", "contents", "S_CONTENTS_" + content_id, null, [ category ]);
        },
        
        contains: (content_id) => {
            return controller.catalog().contains("showcase", "contents", "S_CONTENTS_" + content_id);
        }
    }
})();

__MODULE__ = module;
