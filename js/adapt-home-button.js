define([
    "coreJS/adapt",
    "coreViews/componentView",
    "core/js/router"

], function(Adapt, ComponentView, Router) {
    var HomeButton = ComponentView.extend({
        events: {
            'click button' : 'onClickHomeButton'
        },

        initialize: function () {
            // Assume that page completion is required if this value is not specified
            var requiresPageCompletion = this.model.get("_requirePageCompletion") !== false;
            if (requiresPageCompletion) {
                this.model.set("_isComplete", true);
                var page = this.model.findAncestor();
                page.on("change:_isComplete", _.bind(this.onPageCompletionUpdate, this));
                this.onPageCompletionUpdate(page);
            }

            this.render();

            var view = this;
            this.model.on("change:_isEnabled", function(component) {
                view.$(".button-widget button").attr("disabled", !component.get("_isEnabled"));
            });
        },

        postRender: function() {
            this.setReadyStatus();

            if (this.model.get("_isVisible")) {
                this.setCompletionStatus();
            } else {
                this.model.on("change:_isVisible", this.setCompletionStatus, this);
            }
        },

        /**
         * Invoked when the next button is clicked.
         */
        onClickHomeButton: function() {
            Adapt.trigger('navigation:homeButton');
        },

        /**
         * Invoked when a change is detected in the page's completion status.
         *
         * @param  {Model}  The page where the _isComplete attribute has changed.
         */
        onPageCompletionUpdate: function(page) {
            var isComplete = !page || page.get("_isComplete") === true;
            this.model.set("_isEnabled", isComplete);
        }
    });

    Adapt.register('home-button', HomeButton);

    return HomeButton;
});
